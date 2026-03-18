<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" width="100%" alt="BirdNET App Banner">
  
  # 🦜 BirdNET 全栈音频识别生态
  
  **基于 AI 深度学习的鸟类声音识别系统，集成了 Python 推理后端与极致交互的 React 网页端。**

  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)

</div>

---

## 📖 项目简介
本项目是一个**前后端分离**的鸟类音频声音分析平台。
用户可以通过极具现代感的网页端实时**录音**或**上传音频文件**，后端将调用基于 TensorFlow 的 `birdnet_analyzer` 模型，极速解算并返回音频中出现的鸟类物种、置信度以及具体出现的时间段。

> 🧭 **Specs 全谱系规格书 (SDD 驱动)**
> [功能规格 (spec.md)](./.system/spec.md) | [项目宪法 (constitution.md)](./.system/constitution.md) | [技术规划 (plan.md)](./.system/plan.md) | [微任务清单 (tasks.md)](./.system/tasks.md)

- **`birdnet-api/`**：基于 FastAPI 的高性能异步计算后端 [Python]。
- **`birdnet-app/`**：基于 React + Vite 的现代化视觉交互前端 [TypeScript]。

---

## 🛠️ 目录结构

```text
.
├── birdnet-api/           # 🧠 FastAPI 推理后端
│   ├── main.py            # API 核心入口
│   ├── models.py          # 框架数据模型定义
│   └── requirements.txt   # 后端 Python 依赖
│
└── birdnet-app/           # 🎨 React/TypeScript 前端
    ├── App.tsx            # 主界面交互组件
    ├── components/        # 录音/分析/结果等视图组件
    └── services/          # 前后端 API 对接客户端
```

---

## 🚀 极速启动

### 1️⃣ 启动后端 (Back-end)
前往 `birdnet-api` 文件夹下启动你的 Python AI 推理引擎：

```bash
cd birdnet-api

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境 (macOS/Linux)
source venv/bin/activate

# 安装依赖项
pip install -r requirements.txt

# 启动 API 服务
python main.py
```
> 💡 后端服务将在 `http://0.0.0.0:8000` 启动，你可以通过 `/docs` 查看 Swagger 文档。

---

### 2️⃣ 启动前端 (Front-end)
前往 `birdnet-app` 文件夹下启动 React 视觉中心：

```bash
cd birdnet-app

# 安装 Node 依赖项
npm install

# 启动开发服务器
npm run dev
```
> 💡 随后在浏览器中打开终端显示的本地端口（通常是 `http://localhost:5173`），即可开始识鸟之旅！

---

## 📂 测试数据 (Testing Data)
进行音频识别测试时，你可以：
1. **使用内置用例**：`birdnet-api/test_audio.mp3`。
2. **下载更多鸟鸣**：推荐前往全球最大开源鸟类声学库 [Xeno-Canto (xeno-canto.org)](https://xeno-canto.org/)。你可以输入任何鸟类的中英文名，自由下载 `.mp3` 录音用于测试。
   > 💡 **小贴士**：为了获得最完美的 AI 推理效果，建议优先选择 **Quality A 级** 且背景杂音较小的高音质音频！

---

## 🤝 贡献与开源
如果你觉得这个项目对你有帮助，欢迎点亮右上角的 **⭐ Star**！这也是对全栈 AI 应用研究的极大鼓励。

