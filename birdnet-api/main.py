"""
BirdNET 音频识别 API
基于 FastAPI 实现的鸟类音频识别后端服务
"""
import os
import tempfile
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from birdnet_analyzer.analyze import analyze as birdnet_analyze

from models import AnalysisResponse, BirdDetection, AnalysisMetadata


app = FastAPI(
    title="BirdNET 音频识别 API",
    description="上传音频文件，识别其中的鸟类声音",
    version="1.0.0"
)

# 配置 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径欢迎信息"""
    return {
        "message": "欢迎使用 BirdNET 音频识别 API",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy", "service": "birdnet-api"}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_audio(
    audio_file: UploadFile = File(..., description="音频文件（支持 mp3, wav, flac 等格式）"),
    latitude: Optional[float] = Form(None, ge=-90, le=90, description="纬度 (-90 到 90)"),
    longitude: Optional[float] = Form(None, ge=-180, le=180, description="经度 (-180 到 180)")
):
    """
    分析音频文件中的鸟类声音
    
    参数:
    - audio_file: 音频文件
    - latitude: 录音地点纬度（可选，用于提高识别准确度）
    - longitude: 录音地点经度（可选，用于提高识别准确度）
    
    返回:
    - 检测到的鸟类列表，包含时间段、物种名称和置信度
    """
    temp_audio_path = None
    temp_output_dir = None
    
    try:
        # 创建临时文件保存上传的音频
        suffix = Path(audio_file.filename).suffix if audio_file.filename else ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio:
            content = await audio_file.read()
            temp_audio.write(content)
            temp_audio_path = temp_audio.name
        
        # 调试信息
        file_size = len(content)
        print(f"DEBUG: 上传文件名: {audio_file.filename}")
        print(f"DEBUG: 文件大小: {file_size} 字节 ({file_size / 1024:.2f} KB)")
        print(f"DEBUG: 收到坐标: Lat={latitude}, Lon={longitude}")
        print(f"DEBUG: 临时文件路径: {temp_audio_path}")
        
        # 创建临时输出目录
        temp_output_dir = tempfile.mkdtemp()
        
        # 执行 BirdNET 分析
        # 策略：如果提供了地理位置，先用位置过滤；如果无结果，再进行全球识别兜底
        print(f"INFO: 开始处理音频 - {audio_file.filename} ({file_size / 1024:.1f} KB)")
        
        def run_analysis(lat=None, lon=None):
            # 清空之前的输出
            for f in Path(temp_output_dir).glob("*.csv"):
                f.unlink()
            
            birdnet_analyze(
                audio_input=temp_audio_path,
                output=temp_output_dir,
                min_conf=0.1,
                lat=lat if lat is not None else -1,
                lon=lon if lon is not None else -1,
                rtype='csv'
            )
            
            # 获取结果文件
            return [
                f for f in Path(temp_output_dir).glob("*.csv")
                if "results" in f.name.lower() and "params" not in f.name.lower()
            ]

        # 1. 尝试使用位置进行识别
        current_lat = latitude if latitude is not None else -1
        current_lon = longitude if longitude is not None else -1
        
        csv_files = run_analysis(current_lat, current_lon)
        
        # 2. 检查是否有结果，如果没有结果且之前提供了位置，则尝试全球识别
        if latitude is not None and longitude is not None:
            # 检查 CSV 是否有数据行
            has_data = False
            if csv_files:
                with open(csv_files[0], 'r', encoding='utf-8') as f:
                    # 读取标题行后看是否还有内容
                    lines = f.readlines()
                    if len(lines) > 1:
                        has_data = True
            
            if not has_data:
                print("INFO: 带有地理位置的识别无结果，正在尝试全球识别兜底...")
                csv_files = run_analysis()  # 全球识别

        # 解析输出结果
        detections = []
        
        if not csv_files:
            return AnalysisResponse(
                success=True,
                detections=[],
                metadata=AnalysisMetadata(
                    latitude=latitude,
                    longitude=longitude,
                    total_detections=0
                )
            )
        
        # 读取结果 CSV 文件
        import csv
        output_file = csv_files[0]
        with open(output_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    detection = BirdDetection(
                        start_time=float(row.get('Start (s)', 0)),
                        end_time=float(row.get('End (s)', 0)),
                        scientific_name=row.get('Scientific name', ''),
                        common_name=row.get('Common name', ''),
                        confidence=float(row.get('Confidence', 0))
                    )
                    detections.append(detection)
                except (ValueError, KeyError):
                    continue
        
        print(f"INFO: 识别成功，找到 {len(detections)} 条记录")
        
        # 构建响应
        return AnalysisResponse(
            success=True,
            detections=detections,
            metadata=AnalysisMetadata(
                latitude=latitude,
                longitude=longitude,
                total_detections=len(detections)
            )
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"处理音频时发生错误: {str(e)}"
        )
    
    finally:
        # 清理临时文件
        if temp_audio_path and os.path.exists(temp_audio_path):
            try:
                os.unlink(temp_audio_path)
            except Exception:
                pass
        
        if temp_output_dir and os.path.exists(temp_output_dir):
            try:
                import shutil
                shutil.rmtree(temp_output_dir)
            except Exception:
                pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
