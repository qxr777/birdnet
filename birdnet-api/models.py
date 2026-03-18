"""
数据模型定义
使用 Pydantic 进行数据验证和序列化
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class BirdDetection(BaseModel):
    """单个鸟类检测结果"""
    start_time: float = Field(..., description="检测开始时间（秒）")
    end_time: float = Field(..., description="检测结束时间（秒）")
    scientific_name: str = Field(..., description="物种学名")
    common_name: str = Field(..., description="物种俗名")
    confidence: float = Field(..., ge=0.0, le=1.0, description="置信度 (0-1)")


class AnalysisMetadata(BaseModel):
    """分析元数据"""
    latitude: Optional[float] = Field(None, description="纬度")
    longitude: Optional[float] = Field(None, description="经度")
    total_detections: int = Field(..., description="检测到的鸟类总数")
    audio_duration: Optional[float] = Field(None, description="音频时长（秒）")


class AnalysisResponse(BaseModel):
    """完整的分析响应"""
    success: bool = Field(..., description="分析是否成功")
    detections: List[BirdDetection] = Field(default_factory=list, description="检测结果列表")
    metadata: AnalysisMetadata = Field(..., description="分析元数据")
    error: Optional[str] = Field(None, description="错误信息（如果有）")
