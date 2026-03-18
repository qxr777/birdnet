# BirdNET 音频识别 API

基于 FastAPI 的鸟类音频识别后端服务，使用 BirdNET-Analyzer 进行鸟类声音识别。

## 功能特性

- ✅ 上传音频文件进行鸟类识别
- ✅ 支持经纬度参数提高识别准确度
- ✅ 返回结构化 JSON 结果
- ✅ 支持多种音频格式（mp3, wav, flac 等）
- ✅ 自动临时文件管理

## 安装

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 启动服务

```bash
# 开发模式（自动重载）
uvicorn main:app --reload --port 8000

# 或直接运行
python main.py
```

服务将在 `http://localhost:8000` 启动。

## API 使用

### 接口文档

启动服务后访问：
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 示例请求

#### 使用 curl

```bash
# 基本用法（不提供经纬度）
curl -X POST "http://localhost:8000/analyze" \
  -F "audio_file=@bird_audio.mp3"

# 提供经纬度（推荐，可提高识别准确度）
curl -X POST "http://localhost:8000/analyze" \
  -F "audio_file=@bird_audio.mp3" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060"
```

#### 使用 Python requests

```python
import requests

url = "http://localhost:8000/analyze"
files = {"audio_file": open("bird_audio.mp3", "rb")}
data = {"latitude": 40.7128, "longitude": -74.0060}

response = requests.post(url, files=files, data=data)
print(response.json())
```

### 响应格式

```json
{
  "success": true,
  "detections": [
    {
      "start_time": 0.0,
      "end_time": 3.0,
      "scientific_name": "Turdus migratorius",
      "common_name": "American Robin",
      "confidence": 0.85
    },
    {
      "start_time": 5.0,
      "end_time": 8.0,
      "scientific_name": "Cardinalis cardinalis",
      "common_name": "Northern Cardinal",
      "confidence": 0.92
    }
  ],
  "metadata": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "total_detections": 2,
    "audio_duration": null
  },
  "error": null
}
```

## 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `audio_file` | File | 是 | 音频文件 |
| `latitude` | float | 否 | 纬度（-90 到 90） |
| `longitude` | float | 否 | 经度（-180 到 180） |

## 技术架构

- **FastAPI**: 高性能 Web 框架
- **BirdNET-Analyzer**: 鸟类音频识别引擎
- **Pydantic**: 数据验证和序列化
- **Uvicorn**: ASGI 服务器

## 注意事项

1. **首次运行**: BirdNET-Analyzer 首次运行时会下载模型文件（约 200MB），请耐心等待
2. **音频格式**: 支持常见音频格式，推荐使用 WAV 或 MP3
3. **处理时间**: 处理时间取决于音频长度，通常每分钟音频需要几秒钟
4. **置信度阈值**: 默认最小置信度为 0.25，可在 `main.py` 中调整

## 开发

### 项目结构

```
birdnet-api/
├── main.py              # FastAPI 应用主文件
├── models.py            # Pydantic 数据模型
├── requirements.txt     # Python 依赖
├── README.md           # 项目说明
└── test_api.py         # 测试脚本
```

### 运行测试

```bash
python test_api.py
```

## License

MIT
