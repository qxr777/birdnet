#!/usr/bin/env python3
"""
🦜 BirdNET 全栈端到端 (E2E) 自动化审判器
基于 Playwright (Python 版) 模拟真实浏览器动作，验证前端与后端的联调成果。
"""

import os
import sys
from pathlib import Path

# 🚨 守门线：如果没有装 playwright，提醒用户
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("❌ 缺失依赖：请先在环境内安装 playwright。")
    print("   运行: pip install playwright && playwright install")
    sys.exit(1)

# 配置基准地址
FRONTEND_URL = "http://localhost:3000"
TEST_AUDIO_PATH = Path(__file__).resolve().parents[2] / "birdnet-api" / "test_audio.mp3"

def run_e2e():
    print("="*60)
    print(" 🚗 开启全栈端到端 (E2E) 自动化冒烟测试 ")
    print("="*60)
    print(f"🔗 访问前端: {FRONTEND_URL}")
    print(f"🎵 测试音频: {TEST_AUDIO_PATH.name}\n")

    # 1. 验证必要音频文件是否就位
    if not TEST_AUDIO_PATH.exists():
        print(f"⚠️ 跳过 E2E 测试：找不到音频文件 {TEST_AUDIO_PATH}\n")
        return

    with sync_playwright() as p:
        # 2. 启动无头浏览器 (headless=True)，在后台高静默运行
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 3. 访问前端主页
            print("🌐 正在载入 Page 视窗...")
            page.goto(FRONTEND_URL, timeout=10000)
            
            # 断言：主页加载，应当有主标题或者操作指引
            assert page.is_visible("text=倾听自然") or page.is_visible("text=录制"), "❌ 前端主页渲染失败"
            print("✅ 初始界面渲染通过")

            # 4. 模拟拖拽上传 / 处理隐形文件输入框
            print("📥 正在模拟上传音频流...")
            
            # 使用 Playwright 特性直接定位 input[type="file"] 注入音频
            # 如果组件内没暴露 input，可以通过直接 drag_and_drop 模拟
            # 我们先尝试找标准的 input 单测
            page.set_input_files('input[type="file"]', str(TEST_AUDIO_PATH))

            # 5. 断言过渡状态 (Analyzing Status)
            print("⌛ 正在监测‘分析中’心流骨架屏状态...")
            page.wait_for_selector("text=分析中", timeout=5000)
            print("✅ 从上传平滑过渡到‘分析中’状态")

            # 6. 等待并断言最终结果面板爆出
            print("📊 正在匹配最终识别结果面板渲染...")
            
            # 限制最高等候 20 秒后端的 AI 推理时间
            page.wait_for_selector("text=识别结果详情", timeout=20000)
            
            # 断言界面上有“最佳匹配”或对应的鸟类俗名位置
            assert page.is_visible("text=最佳匹配"), "❌ 结果页未能成功载入最高置信卡片"
            assert page.is_visible("text=置信度"), "❌ 响应体或渲染卡片缺失置信度卡槽"
            
            print("\n🎉 [E2E 成功] 全栈联调契约链条完全打通！")
            
        except Exception as e:
            print(f"\n❌ E2E 审查爆出 Failure: {str(e)}")
            print("💡 建议排查: 后端 api 或 前端 app 端口是否离线、或是 DOM Selector 发生微幅漂移。")
            sys.exit(1)
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    run_e2e()
