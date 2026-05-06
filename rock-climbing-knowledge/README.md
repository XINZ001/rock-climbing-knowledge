# 攀岩知识库 / Rock Climbing Knowledge Base

> 中英韩三语攀岩知识库 PWA。React 19 + Vite + Tailwind v4 + Supabase + Vercel。

## 开发者第一站

请先读 **[`ONBOARDING.md`](./ONBOARDING.md)** —— 30 分钟内可以让你在本地跑起来、了解每个目录在干嘛、避开已知坑点。

## 快速起步

```bash
cp .env.example .env   # 填 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm install
npm run dev            # → http://localhost:5173
```

完整说明、目录结构、Supabase schema、设计系统、已知坑点都在 `ONBOARDING.md`。

## 其他文档

- `ONBOARDING.md` — 开发者上手指南（**最重要**）
- `DESIGN-BRIEF.md` — 设计概览（部分已落后，以代码为准；详见 ONBOARDING §13）
- `animation-plan.md` — 微动效系统说明
- `ia-diagram.html` — 信息架构图（浏览器直接打开）

## 命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 生产构建
npm run preview   # 本地预览构建产物
npm run lint      # ESLint
```

## 测试

```bash
node tests/search-benchmark.mjs    # 搜索质量回归
node tests/content-gap-audit.mjs   # 内容覆盖率审计
```
