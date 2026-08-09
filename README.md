# Carrot Tarot · 塔罗占卜项目集合

本仓库为 mono-repo，包含塔罗占卜网站的三个子项目。

## 📦 项目结构

```
carrot-tarot/
├── nextjs-app/      # Next.js 16 + React 19 版本
├── frontend/        # tarot-app: Vite + React 18 版本（含 Express AI 代理）
└── backend/         # carrot-tarot-backend: Strapi 5 后端（AI 代理 + 限流）
```

## 🗂 子项目说明

### 1. nextjs-app/ — Next.js 版本

基于 Next.js 16 + React 19 + TailwindCSS 4 的塔罗占卜网站。

```bash
cd nextjs-app
npm install
npm run dev      # http://localhost:3000
```

### 2. frontend/ — Vite + React 版本（含轻量后端）

功能最完整的版本：78 张牌图鉴、4 种牌阵占卜、AI 流式解读、可视化管理后台。

- **前端**：React 18 + TypeScript + Vite 6 + TailwindCSS 3 + Zustand 5
- **后端**：Express 4（自带 AI 代理，端口 3001）

```bash
cd frontend
npm install
cp .env.example .env      # 填入 LLM_API_KEY 等（可选）
npm run dev               # 前端 5173 + 后端 3001
```

管理后台：http://localhost:5173/admin （默认密码 `admin123`）

详见 [frontend/README.md](./frontend/README.md)

### 3. backend/ — Strapi 5 后端

独立的 Strapi 后端，提供 AI 解读代理（含速率限制）与可扩展 CMS。

```bash
cd backend
npm install
cp .env.example .env      # 修改密钥
npm run develop           # http://localhost:1337/admin
```

详见 [backend/README.md](./backend/README.md)

## ✨ 核心功能

| 功能 | frontend | nextjs-app | backend |
|------|----------|------------|---------|
| 78 张牌图鉴 | ✅ | — | — |
| 4 种牌阵占卜 | ✅ | — | — |
| AI 流式解读 | ✅（Express 代理） | — | ✅（Strapi 代理） |
| 管理后台 | ✅ /admin | — | ✅ /admin |
| 速率限制 | — | — | ✅ |
| 历史记录 | ✅ localStorage | — | — |

## 🔒 安全提示

- 各子项目的 `.env` 已在根 `.gitignore` 中排除，切勿提交
- 首次部署后请立即修改默认管理员密码 `admin123`
- API Key 通过后端代理调用，不会暴露到前端

## 🚀 部署

详见各子项目 README 的部署说明。推荐组合：
- `frontend/` → Vercel / 静态托管
- `backend/` → Railway / Render / 云服务器

## 📝 License

MIT
