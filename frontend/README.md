# 神秘塔罗 · Tarot Divination

一个基于 React 的塔罗牌占卜网站，支持 78 张牌图鉴浏览、四种牌阵占卜、AI 流式解读与可视化后台管理。

## ✨ 功能特性

- **78 张牌图鉴**：22 张大阿卡纳 + 56 张小阿卡纳，支持按牌组筛选、正逆位牌意查看
- **四种占卜牌阵**：单牌、三牌（过去/现在/未来）、凯尔特十字（10 位）、自由抽（1-12 张）
- **AI 流式解读**：通过后端代理调用 OpenAI 兼容接口，未配置时优雅降级为预设牌意
- **历史记录**：localStorage 本地保存，可查看与清空
- **管理后台**（`/admin`，默认密码 `admin123`）：
  - 风格设置：6 套主题、自定义配色、字体导入、模块图标自定义、星空特效参数
  - 内容设置：全站文字、Hero 区、各页面文案、背景渐变可视化编辑
  - 牌面管理：78 张牌图片上传 + 牌意编辑（名称/关键词/正逆位含义）
  - API 配置：LLM Key、端点、模型、连接测试
  - 密码设置：修改管理员密码

## 🛠 技术栈

- **前端**：React 18 + TypeScript + TailwindCSS 3 + Vite 6 + Zustand 5 + React Router 7
- **后端**：Express 4 + TypeScript（自带 AI 代理，端口 3001）
- **存储**：localStorage（历史记录与管理配置）

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入 LLM 配置（可选，不配置则 AI 解读降级为预设牌意）：

```bash
LLM_API_KEY=your-api-key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
PORT=3001
```

### 3. 启动开发服务

```bash
npm run dev          # 同时启动前端(5173)和后端(3001)
# 或分开启动
npm run client:dev   # 仅前端
npm run server:dev   # 仅后端
```

访问 http://localhost:5173 ，管理后台 http://localhost:5173/admin

### 4. 构建

```bash
npm run build        # 产出 dist/
```

## 📁 项目结构

```
tarot-app/
├── api/                  # Express 后端（AI 代理）
│   └── server.ts
├── src/
│   ├── api/              # 前端 API 调用
│   ├── components/       # 通用组件 + 管理组件
│   ├── data/             # 78 张牌数据 + 牌阵 + 默认文案
│   ├── hooks/            # 自定义 hook
│   ├── pages/            # 页面（Home/Deck/Divine/History/admin/*）
│   ├── store/            # Zustand store（adminConfig/auth）
│   └── index.css
└── public/
```

## 🎴 牌数据

- `src/data/majorArcana.ts`：22 张大阿卡纳
- `src/data/minorArcana1.ts` / `minorArcana2.ts`：56 张小阿卡纳
- `src/data/spreads.ts`：牌阵配置
- `src/data/defaultContent.ts`：全站默认文案

每张牌含：中英文名、阿卡纳分类、花色、元素、正逆位关键词与含义。

## 🔐 安全提示

- 首次部署后请立即修改默认管理员密码 `admin123`
- `.env` 含 API Key，已在 `.gitignore` 中排除，切勿提交
- AI 调用通过后端代理，Key 不会暴露到前端

## 📝 License

MIT
