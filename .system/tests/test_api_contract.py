"""
BirdNET API 测试脚本
用于测试音频识别接口的功能
"""
import requests
import json
from pathlib import Path


def test_health_check():
    """测试健康检查接口"""
    print("🧪 测试健康检查接口...")
    response = requests.get("http://localhost:8000/health")
    
    # 🚨 严格断言：真理审查
    assert response.status_code == 200, f"接口故障，状态码为 {response.status_code}"
    data = response.json()
    assert data.get("status") == "healthy", "服务状态并非 healthy"
    assert "service" in data, "响应体缺少 service 字段"
    print("✅ 健康检查通过\n")


def test_analyze_without_location():
    """测试不提供经纬度的音频分析"""
    print("🧪 测试音频分析（不提供经纬度）...")
    audio_file_path = "test_audio.mp3"
    
    if not Path(audio_file_path).exists():
        print(f"⚠️  跳过测试：音频文件不存在: {audio_file_path}\n")
        return
    
    url = "http://localhost:8000/analyze"
    with open(audio_file_path, "rb") as f:
        files = {"audio_file": f}
        response = requests.post(url, files=files)
    
    # 🚨 严格断言：验证返回的数据结构是否符合 plan.md 契约
    assert response.status_code == 200, f"分析失败: {response.text}"
    data = response.json()
    assert "success" in data and data["success"] is True, "接口返回 success 不为 True"
    assert "detections" in data, "响应体缺少 detections 字段"
    assert "metadata" in data, "响应体缺少 metadata 字段"
    print(f"✅ 非坐标分析通过（检出鸟类: {len(data['detections'])} 种）\n")


def test_analyze_with_location():
    """测试提供经纬度的音频分析"""
    print("🧪 测试音频分析（提供经纬度）...")
    audio_file_path = "test_audio.mp3"
    
    if not Path(audio_file_path).exists():
        return
    
    url = "http://localhost:8000/analyze"
    data_payload = {"latitude": 40.71, "longitude": -74.00}
    
    with open(audio_file_path, "rb") as f:
        files = {"audio_file": f}
        response = requests.post(url, files=files, data=data_payload)
    
    assert response.status_code == 200, f"带坐标分析失败: {response.text}"
    print("✅ 带坐标分析通过\n")


def test_invalid_coordinates():
    """测试无效的经纬度参数 (严格拦截边缘案例)"""
    print("🧪 测试无效的经纬度参数 (防爆边界)...")
    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
        temp_file.write(b"fake audio content")
        temp_path = temp_file.name
    
    url = "http://localhost:8000/analyze"
    files = {"audio_file": open(temp_path, "rb")}
    data = {"latitude": 100, "longitude": -200} # 100 超出范围 [ -90, 90 ]
    
    response = requests.post(url, files=files, data=data)
    
    # 🚨 严格断言：Pydantic 结合 FastAPI 会抛出 422 Unprocessable Entity
    assert response.status_code == 422, f"预期应被 422 拦截，实际返回 {response.status_code}"
    print("✅ 坐标边缘边界防御通过\n")
    
    Path(temp_path).unlink()


def main():
    """运行所有测试"""
    print("\n🧪 开始测试 BirdNET API\n")
    
    try:
        # 测试健康检查
        test_health_check()
        
        # 测试无效参数
        test_invalid_coordinates()
        
        # 测试音频分析（需要真实音频文件）
        test_analyze_without_location()
        test_analyze_with_location()
        
        print("✅ 测试完成！")
        print("\n💡 提示：")
        print("- 如需完整测试音频识别功能，请提供真实的鸟类音频文件")
        print("- 将音频文件命名为 'test_audio.mp3' 并放在当前目录")
        print("- 或修改脚本中的 audio_file_path 变量")
        
    except requests.exceptions.ConnectionError:
        print("❌ 连接失败！请确保 API 服务正在运行：")
        print("   uvicorn main:app --reload --port 8000")
    except Exception as e:
        print(f"❌ 测试失败: {str(e)}")


if __name__ == "__main__":
    main()
