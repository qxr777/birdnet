"""
BirdNET API 测试脚本
用于测试音频识别接口的功能
"""
import requests
import json
from pathlib import Path


def test_health_check():
    """测试健康检查接口"""
    print("=" * 60)
    print("测试健康检查接口...")
    print("=" * 60)
    
    response = requests.get("http://localhost:8000/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()


def test_analyze_without_location():
    """测试不提供经纬度的音频分析"""
    print("=" * 60)
    print("测试音频分析（不提供经纬度）...")
    print("=" * 60)
    
    # 注意：这里需要一个真实的音频文件
    # 如果没有，可以跳过这个测试
    audio_file_path = "test_audio.mp3"
    
    if not Path(audio_file_path).exists():
        print(f"⚠️  测试音频文件不存在: {audio_file_path}")
        print("请提供一个鸟类音频文件进行测试")
        print()
        return
    
    url = "http://localhost:8000/analyze"
    files = {"audio_file": open(audio_file_path, "rb")}
    
    print(f"上传文件: {audio_file_path}")
    response = requests.post(url, files=files)
    
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()


def test_analyze_with_location():
    """测试提供经纬度的音频分析"""
    print("=" * 60)
    print("测试音频分析（提供经纬度）...")
    print("=" * 60)
    
    # 注意：这里需要一个真实的音频文件
    audio_file_path = "test_audio.mp3"
    
    if not Path(audio_file_path).exists():
        print(f"⚠️  测试音频文件不存在: {audio_file_path}")
        print("请提供一个鸟类音频文件进行测试")
        print()
        return
    
    url = "http://localhost:8000/analyze"
    files = {"audio_file": open(audio_file_path, "rb")}
    data = {
        "latitude": 40.7128,   # 纽约的纬度
        "longitude": -74.0060  # 纽约的经度
    }
    
    print(f"上传文件: {audio_file_path}")
    print(f"经纬度: ({data['latitude']}, {data['longitude']})")
    response = requests.post(url, files=files, data=data)
    
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()


def test_invalid_coordinates():
    """测试无效的经纬度参数"""
    print("=" * 60)
    print("测试无效的经纬度参数...")
    print("=" * 60)
    
    # 创建一个临时的空音频文件用于测试
    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
        temp_file.write(b"fake audio content")
        temp_path = temp_file.name
    
    url = "http://localhost:8000/analyze"
    files = {"audio_file": open(temp_path, "rb")}
    data = {
        "latitude": 100,   # 无效：超出范围
        "longitude": -200  # 无效：超出范围
    }
    
    print(f"测试无效经纬度: ({data['latitude']}, {data['longitude']})")
    response = requests.post(url, files=files, data=data)
    
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()
    
    # 清理临时文件
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
