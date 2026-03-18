# 📐 鸟类识别全栈系统 - 技术实施规划 (plan.md)

> **实施定位 (Implementation Template)**：本规划根据 `spec.md` (业务需求) 和 `constitution.md` (安全及约束) 制定。它将宏观意图转化为微观技术选型、接口契约与前端状态模型设计，指导底层编码代理进行自动化构建。

---

## 🛠️ 一、 技术栈选型 (Technology Stack)

| 维度 | 技术选型 | 理由与约束 |
| :--- | :--- | :--- |
| **API 后端 (Backend)** | **Python 3.10+ & FastAPI** | 异步高性能、内置 `Pydantic` 强类型、深度融合 `TensorFlow` 推理生态。 |
| **推理核心 (Engine)** | **`birdnet-analyzer`** | 康奈尔大学实验室官方提供，模型成熟度极高，支持坐标加权。 |
| **网页前端 (Frontend)**| **React 18+ & Vite & TS** | 组件化高度渲染、极速打包、对端侧原生音频录制接口支持友好。 |
| **样式规范 (Styles)** | **Tailwind CSS & Framer Motion** | 便于快速渲染高质量的“声波脉冲”和流式动态心流状态。 |

---

## 🔗 二、 核心 API 契约设计 (API Contract Specification)

### 📤 1. 音频分析端点：`POST /analyze`
*   **Content-Type**: `multipart/form-data`
*   **请求参数清单 (Request Params)**:
    | 参数名 | 必填 | 类型 | 描述 |
    | :--- | :--- | :--- | :--- |
    | `audio_file` | 是 | `File` | 音频数据（支持 `.mp3`, `.wav`, `.m4a`） |
    | `latitude` | 否 | `float` | 纬度：范围 `[-90, 90]`，用于提升地理预测率 |
    | `longitude`| 否 | `float` | 经度：范围 `[-180, 180]`，用于提升地理预测率 |

*   **响应结构模型 (Response JSON Model)**:
    ```json
    {
      "success": true,
      "detections": [
        {
          "start_time": 12.5,
          "end_time": 15.0,
          "scientific_name": "Cuculus canorus",
          "common_name": "Common Cuckoo",
          "confidence": 0.88
        }
      ],
      "metadata": {
        "latitude": 30.123,
        "longitude": 120.456,
        "total_detections": 1
      }
    }
    ```

---

## 🌀 三、 前端状态机模型 (State Machine Lifecycle)

前端组件应当严格遵循单一状态驱动，防止视觉冲突：

| 状态 (State) | 触发条件 | 绑定的界面 / 组件 |
| :--- | :--- | :--- |
| **`IDLE`** (初始) | 应用加载完毕 | `HomeScreen`：展示上传按钮或点击录制。 |
| **`RECORDING`** | 用户点击录音且获得 Mic 授权 | 提供录制中脉冲、Pause/Stop 动效控制。 |
| **`UPLOADING`** | 提交分析，数据正在通过 HTTP 传输 | 进度条或锁屏 LoadingsScreen。 |
| **`ANALYZING`** | 后端已接收数据，AI 正在跑推理计算 | 展示“分析中...”骨架屏（Framer Motion 音频波漫射）。 |
| **`SUCCESS`** | 接口吐出正确 200 JSON 列表数据 | `ResultScreen`：渲染物种卡片及时间轴。 |
| **`ERROR`** | 网络断开 / 接口吐出 structure 报错 | `ErrorScreen`：提供 Retry 或返回主屏。 |

---

## 📂 四、 数据持久化与缓存策略 (可选升级)

*   **无状态处理 (Stateless)**：当前架构下，后端**严禁**持有上传内容的长期存储权限。每次分析结束后，本地音频流缓冲文件必须在 `finally` 块中 `os.remove('/path/to/temp')` 强行释放。
*   **未来可扩展性**：如需记录用户足迹，可考虑接入轻量级分布式 KV 数据库存储分析指纹，避免相同音频重复计算导致算法算力浪费。
