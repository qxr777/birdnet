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

## 🚗 2. 前端端到端审查 (待拓展)
可以在此目下放置 `playwright` 或者是 `cypress` 等 E2E 脚本，模拟点击流并进行全链条（全栈）冒烟测试，彻底接管前后端联调的合规裁判权。
