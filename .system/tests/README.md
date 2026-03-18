# ⚖️ 裁判与审计沙盒 (Audit Sandbox)

> **最高审查权限 (Independent Audit)**：本目录包含针对全栈系统架构的**外部干涉型契约测试 (Contract & E2E Tests)**。
> 它处于 `birdnet-api/` 和 `birdnet-app/` 代码库的物理隔离层之外，具备**绝对审判权**。

---

## 🚫 AI 编码代理禁令 (Agent Rules)
1. **严禁修改 (Forbidden)**：任何负责生成业务功能、修改前端或后端代码的 `Builder-Agent`（编码代理），**绝对禁止修改**本目录下的任何 `.py`、`.js` 或 `.sh` 测试断言。
2. **免责审查 (Blind test)**：编码代理无法通过降低本目录下的 `assert` 容错率来使 Bug 通过。

---

## 🔬 1. 接口契约审查：`test_api_contract.py`
验证后端提供的 HTTP 端点是否 100% 遵守了 `plan.md` 的契约模型。

* **运行指令**：
  ```bash
  # 跑全套接口审查 (需要 API 正在后台运行)
  cd .system/tests
  python test_api_contract.py
  ```

* **失败判定**：
  * **Status Code 不符**（例如坐标溢出，预期为 422 却吐了 500）。
  * **响应字段缺失**（缺少 `success` / `detections` 等 Pydantic 数据规范）。
  * 发生任何一个 `AssertionError`，审计 Agent 将判定当前 PR **失败 (Fail)**。

---

## 🚗 2. 全栈端到端 (E2E) 自动化审查：`e2e_test.py`
验证前端（`birdnet-app`）与后端（`birdnet-api`）的全链条联合动作模型，确保没有“接口通了但界面崩了”的假象。

* **运行指令 (需要安装并启动无头浏览器)**：
  ```bash
  cd .system/tests
  
  # 安装浏览器驱动 (第一次时运行)
  pip install playwright && playwright install
  
  # 跑全链条测试 (需同时开启 backend 和 frontend)
  python e2e_test.py
  ```

* **失败判定 (Failure Assertion)**：
  * **404/无法访问**：前端服务未开启或崩溃。
  * **分析超时 (超过 20s 无果)**：后端 AI 算力崩溃、或者接口契约（CORS 等）断开导致死锁。
  * **核心元素不见了**：例如渲染出了界面，但没有“最佳匹配”或“置信度”卡槽卡位，说明代码样式/DOM 漂移发生重大 Bug。

---
*System Note: 本目录作为独立哨兵，严守全栈最终防线。*
