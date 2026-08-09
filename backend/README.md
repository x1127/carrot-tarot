# Carrot Tarot Backend · Strapi

塔罗占卜网站的 Strapi 5 后端，提供 AI 解读代理（含速率限制）与可扩展的内容管理 API。

## ✨ 功能特性

- **AI 解读代理**：`POST /api/ai-proxy` 流式转发至 OpenAI 兼容接口，保护 API Key 不暴露前端
- **速率限制**：按 IP 限流（默认 5 次/60 秒），防止公开接口被滥用刷量
- **请求校验**：空请求体拦截，避免无谓上游调用
- **可扩展 CMS**：预留 `site-content` / `theme-config` / `spread` API 目录，可扩展为完整内容管理

## 🛠 技术栈

- Strapi 5.51 + TypeScript
- better-sqlite3（开发数据库）
- Node ≥ 20

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改密钥（生产环境务必生成强随机值）：

```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS="..."        # 逗号分隔的 4 个 key
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
ENCRYPTION_KEY=...
```

AI 代理相关环境变量（按需）：

```bash
LLM_API_KEY=your-api-key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
# 可选速率限制覆盖
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5
```

### 3. 启动

```bash
npm run develop    # 开发模式（autoReload）
npm run start      # 生产模式
npm run build      # 构建管理面板
```

访问 http://localhost:1337/admin 创建管理员账号。

## 📁 项目结构

```
carrot-tarot-backend/
├── config/                # Strapi 配置（database/middlewares/server...）
├── src/
│   ├── api/
│   │   ├── ai-proxy/      # AI 解读代理（controller + routes）
│   │   ├── site-content/  # 预留：站点内容
│   │   ├── theme-config/  # 预留：主题配置
│   │   └── spread/        # 预留：牌阵
│   ├── middlewares/
│   │   └── rate-limit.ts  # 自研速率限制中间件
│   └── index.ts           # 注册中间件
└── database/migrations/
```

## 🔌 API 端点

### AI 解读代理

```
POST /api/ai-proxy
Content-Type: application/json

{
  "question": "我想知道近期事业",
  "spreadName": "三牌占卜",
  "cardContext": "..."
}
```

**响应**：流式 SSE，逐块返回解读文本。

**限流**：超限返回 `429` + `Retry-After` 头。

| 响应头 | 说明 |
|--------|------|
| `X-RateLimit-Limit` | 窗口内最大请求数 |
| `X-RateLimit-Remaining` | 剩余请求数 |
| `X-RateLimit-Reset` | 窗口重置时间戳 |
| `Retry-After` | 重试等待秒数（仅 429） |

## 🔒 安全说明

- `.env` 已在 `.gitignore` 中排除，切勿提交
- 生产环境请用强随机值替换所有 `tobemodified` 占位符
- 速率限制基于内存（单实例），多实例部署需替换为 Redis 共享存储

## 📝 License

MIT
