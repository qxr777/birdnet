# 📋 鸟类识别全栈系统 - 微任务清单 (tasks.md)

> **任务定位 (Task Breakdown & WBS)**：本文件根据 `plan.md` (技术实施) 拆解，旨在向编码代理或执行者提供**原子化、可测试的微操作子任务**。
>
> **状态代号 (Status Markers)**：
> * `[x]` - **已构建完毕 (Completed)**
> * `[ ]` - **待办 / 等待执行 (Todo / Pending)**

---

## 🧠 1. 后端微任务清单 (birdnet-api)

### 🟢 1.1 核心框架与数据契约建模
* [x] **Task 1.1.1**：基于 `FastAPI` 开启异步微服务引擎接口框架。
* [x] **Task 1.1.2**：利用 `Pydantic` 设计分析响应模型：`BirdDetection`, `AnalysisMetadata`, `AnalysisResponse`。（*定位在 `models.py`*）
* [x] **Task 1.1.3**：配置严格的 Cors 跨域隔离白名单模板（白名单中严格指向本地端口）。

### 🟡 1.2 音频算力核心与资源安全
* [x] **Task 1.2.1**：编写 `POST /analyze` 路由，并绑定 `UploadFile` 和地理坐标入参数据强制格式化。
* [x] **Task 1.2.2**：实现临时音频存取与调用 `birdnet_analyzer` 运算核心。
* [x] **Task 1.2.3**：**[红线校验]** 向分析逻辑包裹 `try...finally` 块，在请求结束（报错亦然）时强行 unlink 临时目录及 `.mp3` 文件。
* [ ] **Task 1.2.4**：新增音频文件 Body Size 校验：如果大小超过 210MB，提前返回 413 状态码（大文件防御）。

---

## 🎨 2. 前端微任务清单 (birdnet-app)

### 🟢 2.1 状态机设计与业务层对接
* [x] **Task 2.1.1**：编写 API 服务拉取类（`api.ts`），建立 `fetch` 接口连接到 `localhost:8000/analyze` 通道，支持传输 `FormData`。
* [x] **Task 2.1.2**：实现 `audioRecorder.ts` 录音状态机，支持录音流的 Start、Stop、Pause 触发及安全下线释放占用。

### 🟡 2.2 视图渲染与心流状态面板
* [x] **Task 2.2.1**：实现 `HomeScreen.tsx`：提供点击录音和点击上传的双引擎激活模式，支持读取地理位置。
* [x] **Task 2.2.2**：实现 `AnalyzingScreen.tsx`：搭载 Framer Motion 或者是内置 SVG 进度动画渲染，绑定流式加载文字反馈。
* [x] **Task 2.2.3**：实现 `ResultScreen.tsx`：渲染物种卡片，支持展示置信度条和计算概率。
* [ ] **Task 2.2.4**：**[边缘处理]** 增加断网或请求 500 时响应的 `ErrorScreen`：底部必须配置 “Retry / 重试” 触发按钮，无缝倒插回 `IDLE` 初始激活状态。

---

## 💻 3. 测试与环境自动化 (DevOps)

* [x] **Task 3.1**：编写 `test_api.py` 自动化后端的 mock 测试，避免每次必须运行前端才能走通识别流程。
* [x] **Task 3.2**：制作根目录级别的全栈 `README.md` 模板：将全套 Docker 启动或者是 Python 环境变量配置命令固化，供下一阶段直接自动化部署使用。
* [ ] **Task 3.3**：在根目录下提供一键启动的 Shell 脚本，例如并行跑前后端的便捷包，进一步提升DX（开发者体验）。

---
*System Note: 本任务清单已针对当前 `.git` 现状进行归档，未打钩项表示下一阶段自动化流水线待领取的微指令。*
