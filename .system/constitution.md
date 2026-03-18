# ⚖️ 鸟类识别全栈系统 - 项目宪法 (constitution.md)

> **宪法地位 (Guardrails)**：本宪法定义系统“必须如何被构建”（How），是所有开发者接口与 AI Agent 阵列在生成代码、修改架构时**不可逾越的技术红线和绝对安全护栏**。任何违反本宪法的代码合并请求 (PR) 均应被视为不合格。

---

## 🔒 一、 安全与机密管理 (Security & Secrets)

1. **绝对剥离硬编码 (Zero Hardcoding)**：
   * 严禁在任何代码文件（`.py`, `.ts`, `.js`, `.json`）或配置文件中硬编码任何 API 密钥、数据库连接串、或者是私有云凭证。
   * 所有机密参数必须通过环境上下文（如 `.env` 并在代码中通过环境变量加载）注入。
2. **凭证隔离拦截 (Ignore Enforcement)**：
   * 任何形态的 `.env` 或者是 `.env.local` 文件**必须**绝对包含在 `.gitignore` 防御网中，严禁推送到任意远程仓库分支。
3. **严格的跨域策略 (Strict CORS)**：
   * 对外接口的 CORS 策略在生产环境（Production）下**严禁**使用 `"*"` (通配符授权)。必须配置严格的 Origin 白名单域名。

---

## 📊 二、 语法规范与强数据合规 (Typing & Data Compliance)

1. **全链路强类型化 (Full-stack Typing)**：
   * **后端 (Python)**：所有 API 的入参（Request Params/Body）与出参（Response Model）必须使用 `Pydantic` 等模型进行严格定义，自带结构化强检查。
   * **前端 (TypeScript)**：组件、API 服务层、数据映射器必须拥有完整的 Interface 或 Type 覆盖。**严禁在生产代码中使用 `any` 类型逃避检查。**
2. **错误响应模型规范 (Error Handling Spec)**：
   * 后端在发生非预期崩溃（如模型加载失败、音频损坏）时，严禁吞掉异常，必须向调用方返回带有明确 `status_code` 和 `detail` 文本的结构化 JSON，而非裸字符串或 HTML 报错页。

---

## 🌀 三、 性能与资源生命周期安全 (Performance & Resource Lifespan)

1. **临时资源强制闭环 (Mandatory Resource Cleanup)**：
   * 当后端接口处理用户上传的音频文件时，不管是使用 `NamedTemporaryFile` 还是创建 `temp_dir`，**必须**使用带有 `try...finally` 块的生命周期控制。
   * 在请求结束（无论成功或报错失败）时，**必须第一时间静默且彻底地卸载、删除本地临时音频和缓存文件**，防止服务器磁盘被海量上传流迅速撑爆。
2. **异步非阻塞 (Async-First)**：
   * 后端框架接口必须一律采用 `async def` 异步声明，所有的 IO 操作（如读取音频流写入临时目录）必须通过 `await` 语法非阻塞处理，保证高并发条件下的响应吞吐能力。

---

## 🎨 四、 架构与解耦隔离 (Architecture decoupled)

1. **核心业务与渲染纯绝缘 (Separation of Concerns)**：
   * 后端只负责 AI 推理和 JSON 数据喂料，严禁包含任何 HTML 模板、重定向中继或者前端状态机控制。
   * 前端负责所有视觉渲染和声纹交互，严禁在边缘端跑重度算法推理，必须通过 HTTP 完成。

---
*System Note: 任何由 AI 阵列生成的修改若不符合上述四大铁律，工具链应在静态检查或 CI 阶段自动进行拒绝。*
