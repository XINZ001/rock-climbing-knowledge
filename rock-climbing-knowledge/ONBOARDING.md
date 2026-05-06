# 攀岩知识库 — 开发者 Onboarding

> 给第一次进入这个 repo 的开发者：30 分钟内读完，你应该可以在本地跑起来、知道每个目录是干嘛的、改一个简单页面而不踩坑。
>
> 维护者：team lead（Alice）。本文是单一信息源，发现与代码不一致请优先信代码并提 PR 修这份文档。

---

## 0. TL;DR

- **它是什么**：一个中/英/韩三语攀岩知识库 PWA。React 19 + Vite + Tailwind v4，Supabase 做 auth + 用户内容（社区/伤痛/quest），所有"内容性"数据（10 大板块、202 个知识点、文章、运动员）走静态 JSON 打包进 bundle。
- **怎么跑起来**：复制 `.env.example` → `.env`，填两个 Supabase 变量，`npm install && npm run dev`。
- **首先读哪些文件**：`src/App.jsx`（路由）→ `src/components/layout/FeedLayout.jsx` + `Layout.jsx`（导航/壳）→ `src/context/AppContext.jsx`（全局状态 + 搜索索引）→ `src/context/AuthContext.jsx`（登录态）→ `src/index.css`（设计 token 真源）。
- **不要乱改**：`src/data/*.json`（内容真源，由 team lead 那边专门流程维护）、`public/images/`（生成图）、`vercel.json`、PWA 配置。

---

## 1. 项目背景（不读会写错的部分）

这是一个 **中英双语为主、含韩语支持** 的攀岩学习站。当前生产形态包含：

| 入口 | 路径 | 内容 |
|---|---|---|
| 知识库（10 个 section） | `/knowledge`, `/section/:slug`, `/section/:slug/:sub` | 系统化攀岩知识，202 个知识点（KP） |
| 专栏文章 | `/articles`, `/articles/:slug`, `/articles/category/:id` | ~39 篇深度文章（JSON 静态内容） |
| 名人堂 | `/hall-of-fame`, `/hall-of-fame/:athleteSlug` | 运动员档案 |
| 伤痛档案（社区） | `/injuries`, `/injuries/new`, `/injuries/:id` | 用户提交的伤痛案例（UGC，存 Supabase） |
| 发现（瀑布流） | `/discover` | 帖子 / Feed（社区 UGC + AI 角色帖混排） |
| 工具 | `/diagnosis`, `/climbing-mbti`, `/quests` | 攀岩动物人格测试、MBTI、quest 系统 |
| 我的 | `/profile`, `/settings`, `/climbing-profile` | 用户中心、攀岩档案 |

**业务上的三大支柱**（重要的术语，PR 描述里会出现）：
1. **知识库** — 概念/技术/原理，对应 `section-XX-*.json` + `kp-registry.json`
2. **训练手册** — 可执行训练卡，对应 `training-registry.json`（内容当前为空壳）
3. **攀岩名人** — 运动员档案，对应 `athlete-registry.json`

文件来源真源在 repo 上一级 `team-lead/project-state.md`，但你日常开发不需要碰那边——**只把 `rock-climbing-knowledge/` 当作主仓库**。

---

## 2. 技术栈

| 层 | 用什么 |
|---|---|
| UI 框架 | **React 19** + **react-router-dom v7** + **react-helmet-async** |
| 构建 | **Vite 7** + **vite-plugin-pwa**（autoUpdate） |
| 样式 | **Tailwind v4**（`@import "tailwindcss"` + `@theme {}` 定义 design token，CSS 变量驱动） |
| 后端 | **Supabase**（auth + Postgres + Edge Functions + Storage） |
| 搜索 | **Fuse.js**（客户端模糊搜索，索引在浏览器构建） |
| 图表 | **recharts**（diagnosis 结果展示） |
| 内容渲染 | **react-markdown** + **remark-gfm** |
| 头像/视觉 | **boring-avatars** + 自定义 SVG icon set |
| 部署 | **Vercel**（含 `@vercel/analytics`） |
| 本地工具 | ESLint flat config + react-hooks 规则 |

> ⚠️ **不是 TypeScript**：项目用 JSX + JavaScript。新增文件保持一致，别突然引入 .ts/.tsx。
> ⚠️ **CommonJS 脚本**：`scripts/` 下有 `.cjs` 文件，那是 Node 环境跑的离线工具，不是 web 代码。

---

## 3. 起步：本地运行

```bash
# 1. 安装依赖（要 Node 18+ / 推荐 20+）
npm install

# 2. 配 Supabase
cp .env.example .env
# 然后在 .env 里填：
#   VITE_SUPABASE_URL=https://<project>.supabase.co
#   VITE_SUPABASE_ANON_KEY=<anon-key>
# 这两个值找项目所有者拿。没有 Supabase 凭证也能跑起来，
# 但凡是涉及登录、伤痛档案、社区、quest 进度的功能都会挂。

# 3. 起开发服务器
npm run dev   # → http://localhost:5173

# 4. 其他
npm run build     # 生产构建（输出到 dist/）
npm run preview   # 本地预览构建产物
npm run lint      # ESLint
```

> Vite 的 `cacheDir` 被设为 `/tmp/vite-cache`（见 `vite.config.js`），换电脑/重启不会复用缓存——这是故意的，避免本地缓存导致的 PWA 行为漂移。

### 测试

```bash
node tests/search-benchmark.mjs    # 搜索质量回归（用 search-test-cases.json）
node tests/content-gap-audit.mjs   # 内容覆盖率审计
```

没有 Jest / Vitest 单测。改搜索逻辑前后跑一下 search-benchmark 是必须的。

---

## 4. 目录全景

```
rock-climbing-knowledge/
├── README.md                  # 默认 Vite 模板的 README，可忽略
├── DESIGN-BRIEF.md            # ⚠️ 半过时的设计文档，颜色和导航已落后于代码
├── ONBOARDING.md              # ← 你正在读
├── animation-plan.md          # 微动效系统说明
├── ia-diagram.html            # 信息架构图（直接浏览器打开）
├── package.json
├── vite.config.js             # Vite + PWA 配置
├── vercel.json                # Vercel 重写规则（SPA fallback）
├── eslint.config.js
├── .env / .env.example        # Supabase 凭证
│
├── public/                    # 静态资源
│   ├── images/
│   │   ├── illustrations/     # KP 配图（PNG，由内容流水线生成）
│   │   ├── feed/              # Feed 卡片图
│   │   ├── hall-of-fame/      # 运动员图
│   │   ├── hero/              # 首页 hero
│   │   ├── knowledge-modules/ # section banner
│   │   ├── mbti/, quests/, scenes/, textures/, logo/, avatars/
│   │   └── og-cover.webp      # OG 分享封面
│   ├── fonts/                 # Feed 卡片自定义字体（.woff2）
│   ├── favicon.svg, pwa-192/512.png
│   └── sitemap.xml, robots.txt
│
├── src/
│   ├── main.jsx               # 入口：HelmetProvider → BrowserRouter → AuthProvider → AppProvider → App
│   ├── App.jsx                # 所有路由（见 §5）
│   ├── index.css              # ⭐ 设计 token 真源（Tailwind @theme + dark mode + 动效）
│   │
│   ├── pages/                 # 27 个页面组件（一页一文件）
│   ├── components/
│   │   ├── layout/            # FeedLayout, Layout, Header, Sidebar, Footer
│   │   ├── content/           # 知识点渲染：KnowledgePoint, VideoSection, Breadcrumb
│   │   ├── article/           # 文章渲染：ArticleRenderer, KpLink, IllustrationEmbed,
│   │   │                      # VideoEmbed, TipBlock, WarningBlock, ExpertQuote, ArticleCard
│   │   ├── auth/              # AuthModal
│   │   ├── search/            # （目前空壳，搜索 UI 在 SearchPage 内联）
│   │   ├── ui/                # 通用：Avatar, UserAvatar, BrandIcon, ImageLightbox,
│   │   │                      # ScrollToTop, ThemeToggle, TiltCard, TrendingKPs, QuestDrawModal
│   │   └── PageSEO.jsx        # 每页 <head> 元数据
│   │
│   ├── context/
│   │   ├── AppContext.jsx     # ⭐ 全局：sections / 搜索索引 / lang / kpRouteMap / t() i18n helper
│   │   └── AuthContext.jsx    # ⭐ Supabase auth + profile 同步
│   │
│   ├── hooks/
│   │   ├── useAnimateIn.js    # IntersectionObserver 触发入场动画
│   │   └── useUserRegion.js   # IP/locale → 区域偏好
│   │
│   ├── lib/                   # ⭐ Supabase 业务封装
│   │   ├── supabase.js        # client 实例（从 VITE_ 环境变量读）
│   │   ├── community.js       # 帖子/评论/点赞/feed 互动
│   │   ├── injuries.js        # 伤痛档案 CRUD（基于 posts + injury_details）
│   │   ├── diagnosis.js       # 攀岩动物人格测试结果存取
│   │   └── questProgress.js   # quest 进度
│   │
│   ├── utils/                 # 纯函数辅助
│   │   ├── icons.jsx          # 统一 icon 入口（注意是 .jsx，含 SVG）
│   │   ├── articleKpMap.js    # 文章 → KP 的反向映射
│   │   ├── crossRefResolver.js
│   │   ├── feedbackStore.js   # localStorage 反馈缓存
│   │   ├── hallOfFame.js
│   │   ├── sectionVisuals.js  # section 配色/图标映射
│   │   └── videoFilter.js
│   │
│   ├── data/                  # ⭐⭐ 内容真源（静态 JSON，build-time import）
│   │   ├── sections.json              # 10 个 section + sub-section 目录树
│   │   ├── section-01-overview.json … section-10-competition.json   # KP 正文
│   │   ├── kp-registry.json           # 202 KP 主索引（id, path, keywords）
│   │   ├── article-registry.json      # 文章索引
│   │   ├── articles/*.json            # 文章正文（39 篇）
│   │   ├── athlete-registry.json      # 运动员名单
│   │   ├── athlete-avatars.json
│   │   ├── hall-of-fame-media.js      # ← 注意是 .js 不是 .json
│   │   ├── illustration-registry.json # KP → 插图文件名映射
│   │   ├── image-registry.json        # 通用图片索引
│   │   ├── video-registry.json        # 视频索引（含时间戳标注）
│   │   ├── videos.json                # KP → 视频列表（前端消费）
│   │   ├── feed-registry.json         # Feed 帖子（AI 生成）
│   │   ├── profiles-registry.json     # AI 角色档案
│   │   ├── quests.json
│   │   ├── climbing-mbti.json
│   │   ├── diagnosis-tree.json        # 动物人格决策树
│   │   ├── cross-references.json
│   │   ├── kp-article-map.json        # 文章 ↔ KP 映射
│   │   ├── search-synonyms.json       # 搜索同义词扩展
│   │   ├── search-stopwords.json      # 中/英/韩 2645 词停用词
│   │   └── training-registry.json     # 当前空壳，预留位
│   │
│   └── assets/                # 一般不动
│
├── scripts/                   # ⭐ Node CommonJS 离线脚本（不是 web 代码）
│   ├── extract-kps.cjs                # 从 section JSON 提取 KP 列表
│   ├── list-kps.cjs
│   ├── generate-illustration-registry.cjs  # 扫 public/images/illustrations/ 生成 registry
│   ├── fetch-urls.sh / fetch-unsplash-urls.sh
│
├── sql/                       # Supabase 一次性 SQL（手动到 Dashboard SQL Editor 执行）
│   ├── create-check-email-rpc.sql        # check_email_exists RPC
│   └── create-diagnosis-results.sql      # diagnosis_results 表 + RLS
│
├── supabase/
│   └── functions/
│       └── check-email/      # Edge Function（备份方案，当前 AuthContext 直接走 RPC，不依赖此函数）
│
└── tests/
    ├── search-benchmark.mjs        # 搜索质量回归
    ├── search-test-cases.json      # 测试用例
    └── content-gap-audit.mjs       # 内容覆盖率审计
```

---

## 5. 路由结构

完整定义在 `src/App.jsx`。结构上有两层 layout：

```
<FeedLayout>     ← 外壳：3-tab 底部导航 + 顶部 logo/搜索/语言/用户
  ├─ /            HomePage          （Tab 1: 知识库首页）
  ├─ /learn       HomePage          （别名，Tab 2 也叫"学"，复用 HomePage）
  ├─ /train       TrainPage         （Tab 3: 练）
  ├─ /discover    FeedPage          （瀑布流 / 发现）
  ├─ /profile     ProfilePage       （右上角入口）
  │
  └─ <Layout>    ← 内壳：Header + 桌面 Sidebar（仅 knowledge-scope 显示）
       ├─ /knowledge, /knowledge-index    KnowledgePage
       ├─ /section/:sectionSlug           SectionPage
       ├─ /section/:sectionSlug/:subSlug  TopicPage
       ├─ /search                         SearchPage
       ├─ /articles                       ArticleListPage
       ├─ /articles/category/:categoryId  ArticleCategoryPage
       ├─ /articles/:articleSlug          ArticleDetailPage
       ├─ /hall-of-fame                   HallOfFamePage
       ├─ /hall-of-fame/:athleteSlug      AthletePage
       ├─ /quests                         QuestPage
       ├─ /diagnosis                      DiagnosisPage
       ├─ /climbing-mbti                  ClimbingMbtiPage
       ├─ /injuries                       InjuryListPage
       ├─ /injuries/new, /injuries/:id/edit   InjuryFormPage
       ├─ /injuries/:id                   InjuryDetailPage
       ├─ /climbing-profile               ClimbingProfilePage
       ├─ /settings                       SettingsPage
       ├─ /auth/callback                  AuthCallbackPage
       └─ /admin/feedback                 FeedbackPage
  │
  └─ *  NotFoundPage
</FeedLayout>
```

> ⚠️ **DESIGN-BRIEF.md 描述的是早期 Header**（知识库 / 名人堂 / 伤痛档案 三按钮）。**真实导航**已经改成"知识库 / 发现 / 我的"3-tab 底栏 + 桌面顶栏。改导航相关的活以代码为准。

> ⚠️ **死代码 import**：`App.jsx` 顶部 import 了 `LearnPage` 和 `HallOfFameCategoryPage` 两个组件，但路由表里 `/learn` 实际用 `HomePage`、`hall-of-fame` 也没有 `category/:id` 子路由。这两个文件目前是**孤儿**——不要据此推断它们是"在用"的页面。ESLint 没报是因为 `no-unused-vars` 配了 `^[A-Z_]` 例外（专门放过 React 组件命名）。在路由真正接上前，改这俩文件无效。

---

## 6. 数据流：内容是如何到达页面的

```
┌──────────────────────────────────────────────────────────────┐
│  内容真源（静态 JSON，build 时打包进 bundle）                 │
│  src/data/*.json                                             │
└──────────────────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│  AppContext（src/context/AppContext.jsx）                    │
│  - sectionsIndex 立即加载                                     │
│  - sections-NN 通过 import.meta.glob 动态加载（懒加载）       │
│  - 第一次渲染后异步构建 Fuse.js 全文索引（KP + 文章 + 运动员） │
│  - 暴露：sections / search() / searchSuggest() / t() / lang  │
│           / loadSectionData() / getKpRoute()                 │
└──────────────────────────────────────────────────────────────┘
              │
              ▼
        各页面 + 组件
```

**关键 hook**：
- `const { t, lang, search, sections } = useApp()`
- `const { user, profile, signIn, signOut } = useAuth()`

**i18n 用法**（重要）：内容字段都是 `{ zh, en, ko }` 形状的对象，用 `t(obj)` 取当前语言值，会按当前 `lang` → `zh` → `en` → `ko` 兜底。直接 `obj.zh` 也可以但不建议（不响应语言切换）。

**懒加载**：除 sections 目录、KP/文章/运动员 registry 之外，每个 section 的正文（`section-NN-*.json`）和文章正文（`articles/*.json`）通过 `import.meta.glob` 按需加载。第一次进入某 section 时才拉对应 JSON。

---

## 7. 后端：Supabase

### 7.1 用户与 auth

- 客户端在 `src/lib/supabase.js`
- `AuthContext` 监听 `onAuthStateChange`，登录后自动从 `profiles` 表拉 `profile`
- 注册时通过 `auth.signUp` 自动写 `profiles` 行（默认走 Supabase 自带流程，没有自定义 trigger）
- Magic-link 回调走 `/auth/callback` → `AuthCallbackPage`
- 邮箱预检：`supabase.rpc('check_email_exists', ...)`，SQL 在 `sql/create-check-email-rpc.sql`

### 7.2 实际使用的表（grep 出来的）

| 表 | 用途 | 主要文件 |
|---|---|---|
| `profiles` | 用户基础资料（username, avatar_url, climbing_level, bio） | `AuthContext.jsx` |
| `climbing_profiles` | 攀岩档案（等级、风格、身体数据） | `ClimbingProfilePage.jsx`, `InjuryFormPage.jsx` |
| `posts` | 帖子主表（社区 + 伤痛档案共用） | `lib/community.js`, `lib/injuries.js` |
| `injury_details` | 伤痛档案细节（部位、类型、严重度） | `lib/injuries.js` |
| `comments` | 评论 | `lib/community.js`, `lib/injuries.js` |
| `likes` | 点赞 | `lib/community.js` |
| `media` | 帖子附件（图/视频，Storage 路径） | `lib/community.js`, `lib/injuries.js` |
| `post_knowledge_points` | 帖子 ↔ KP 多对多 | `lib/community.js` |
| `feed_views` / `feed_likes` / `feed_bookmarks` / `feed_comments` | Feed 瀑布流互动 | `lib/community.js` |
| `user_quest_progress` | quest 进度 | `lib/questProgress.js` |
| `diagnosis_results` | 动物人格测试结果（含 RLS） | `lib/diagnosis.js`, `sql/create-diagnosis-results.sql` |

### 7.3 Storage

社区/伤痛档案的图片视频上传到 Supabase Storage，bucket 名以 `media.storage_path` 形式存进 DB。

### 7.4 Edge Functions

`supabase/functions/check-email/` —— 备份方案。当前代码走 RPC，不依赖 Edge Function。如果 RPC 出问题再考虑切回 Edge。

---

## 8. 设计系统

**真源不是 DESIGN-BRIEF.md，是 `src/index.css` 的 `@theme {}` 块。**

### 8.1 颜色 token（CSS 变量）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--color-stone-bg` | `#F7F1E8` | `#1A1D21` | 全局背景 |
| `--color-stone-card` | `#FFFFFF` | `#23272E` | 卡片/容器 |
| `--color-stone-sidebar` | `#EFE8DC` | `#1F2228` | 侧栏背景 |
| `--color-stone-border` | `#DED4C6` | `#3A3F47` | 边框 |
| `--color-text-primary` | `#2F332F` | `#E0E0E0` | 主文字 |
| `--color-text-secondary` | `#70736D` | `#9CA3AF` | 辅助文字 |
| `--color-forest` | `#4A7C59` | `#6AAF7D` | 品牌主绿 |
| `--color-amber` | `#C45B52` | `#E07B73` | 暖色（伤痛/警告） |
| `--color-teal` | `#5B7FBF` | `#7FA3D6` | 蓝色辅色 |
| `--color-gold` | `#A68A2A` | `#D4B44A` | 金色辅色 |

每个色都有 `-dark` 和 `-light` 变体。Tailwind 用法：`bg-forest`、`text-text-secondary`、`border-stone-border` 等。

### 8.2 字体

```
--font-sans:   "Helvetica Neue", "Helvetica", "PingFang SC", "Microsoft YaHei", "Arial", sans-serif
--font-serif-cn: "Noto Serif SC", "Source Han Serif SC", "Songti SC", Georgia, serif
--font-mono:   "JetBrains Mono", "SF Mono", "Menlo", ui-monospace, monospace
```

`Noto Serif SC` 和 `JetBrains Mono` 走 Google Fonts CDN（PWA 已配缓存）。Feed 卡片有 4 个本地 woff2（`/public/fonts/`）。

### 8.3 主题

`AppContext` 当前**硬编码 dark**（见 `useEffect` 写 `document.documentElement.classList.add('dark')` 和 localStorage 'dark'）。`ThemeToggle.jsx` 组件存在但 setTheme 是 noop。如果要恢复主题切换，改 AppContext 的 theme state。

### 8.4 Utility class（自定义）

`src/index.css` 里定义了一组项目专用 class：
- `.card-hover` — 卡片 hover 提升 + 阴影
- `.btn-press` — 按钮点击 scale(0.97)
- `.eyebrow` — 小标签（mono + uppercase，前缀小横线）
- `.chip-mono` — 元数据药丸（mono 字体）
- `.heading-display` — 大标题 serif 风
- `.markdown-content *` — 文章/KP markdown 渲染样式
- `.anim-ready / .anim-visible / .anim-done` — 入场动画系统（配 `useAnimateIn.js`）
- `.diagnosis-card` — 攀岩动物人格入口的渐变动画卡

新增视觉时**优先用现有 class 和 token**，不要硬编码颜色 hex。

### 8.5 微动效

完整说明见 `animation-plan.md`。核心：入场动画走 `IntersectionObserver`（`useAnimateIn` hook），`prefers-reduced-motion` 已被尊重。

---

## 9. 国际化

- **三语支持：zh / en / ko**（DESIGN-BRIEF 只写了 zh+en，已落后）
- 默认中文，存 `localStorage.lang`
- 所有内容字段都是 `{ zh, en, ko }` 对象
- 用 `t(obj)` 取值；fallback 顺序：当前 lang → zh → en → ko
- 韩语在不少地方还没填全，写新代码时**至少要 zh + en**，ko 可空字符串

---

## 10. 搜索

**完全是客户端 Fuse.js**，不走服务端。

- 索引在 `AppContext.buildIndex()` 内异步构建，覆盖：所有 KP + 所有文章 + 所有运动员
- 同义词扩展：`search-synonyms.json`（KP 别名/相关词）
- 停用词：`search-stopwords.json`（中/英/韩 2645 词，用于 snippet 过滤）
- 两个索引：strict (threshold 0.4) + loose (threshold 0.6, 用于"你是不是想搜"建议)
- 二次排序：完全等于 > 开头匹配 > 包含；同分时短标题优先（解决"janja" 的 case，注释里有讲）
- 测试：`tests/search-benchmark.mjs` + `search-test-cases.json`

**改搜索行为前必跑** `node tests/search-benchmark.mjs`，过 PR 时附结果。

---

## 11. PWA / 部署

- `vite-plugin-pwa` autoUpdate 模式，manifest 内置在 `vite.config.js`
- 字体走 CacheFirst，最长缓存 1 年
- workbox `maximumFileSizeToCacheInBytes: 8MB`（CJK 字体大）
- Vercel 部署：`vercel.json` 里 `/(.*) → /index.html` 的 SPA fallback
- Vercel Analytics 已接入（`@vercel/analytics/react` 在 `main.jsx`）

部署：推到 main 分支，Vercel 自动 build。预览部署看 PR 上的 Vercel bot 评论。

---

## 12. 编码约定

- **JSX，不要 TS**
- 文件名：组件 PascalCase（`HomePage.jsx`），utils/hooks camelCase（`useAnimateIn.js`），数据 kebab-case（`kp-registry.json`）
- 组件 props：尽量用 `{ destructured }`
- ESLint：`no-unused-vars` 已开（允许 `^[A-Z_]` 大写开头的未用变量，例如未用的 React 导入）
- React Hooks 规则按官方插件
- **不要用 console.log 留在代码里**（buildIndex 里有 console.warn/error 是有意保留的）
- 新页面：在 `src/pages/` 下加文件 → 在 `src/App.jsx` 注册路由 → 在合适的 nav 入口加链接 → 加 `<PageSEO />` 头
- 新组件：复用 `components/ui/` 已有的 Avatar/UserAvatar/ImageLightbox 等，不要重造

### Lint baseline 政策（决定于 2026-05-06）

`npm run lint` 当前不绿（约 37 errors + 15 warnings），里面混了一些真 bug 信号也有一些可忽略的项目历史债。**短期我们采取宽松策略**：

| 项 | 规则 |
|---|---|
| 你 PR 触动的文件 | **不能新增 ESLint error**。如果你的修改会让 lint 报新 error，先修掉再提 |
| 既有 error | 可以暂时不修。**别用"PR 之外的清理"为由动它们，避免无关变更** |
| Warnings | 全局放行，PR 不阻塞 |
| `console.log` | 仍然不允许新增（例外 `console.warn`/`console.error` 用于真错误日志） |
| Hooks 规则 | 严格遵守。React-hooks/rules-of-hooks 类的 error 不允许引入 |

**清债任务**：未来会单独安排一个任务把 37 个老 error 一次性修完，之后政策升级到"PR 必须全绿"。在那之前，按上面的"不引入新 error"做。

**怎么验证**：在 PR 之前跑 `npm run lint` 两次——一次在 main 上（拿到基线 error 数），一次在你的分支上。**新分支的 error 数 ≤ main 的 error 数** 即合规。如果你只动了 N 个文件，可以更精确地对那 N 个文件 diff lint 输出。

---

## 13. 已知坑点（先看再踩）

1. **DESIGN-BRIEF.md 与代码不一致**：颜色、导航结构、语言数都过时了。本文件 §5 §8 §9 是当前真源。
2. **AppContext 硬编码 dark mode**：theme toggle 组件存在但 setTheme 是 noop。要做切换需要改 context。
3. **`/learn` 路由复用 HomePage**：底部 tab "学" 不是独立页面，是 HomePage 的另一个入口。改首页要考虑 tab 视觉一致性。
4. **死代码 import**：`App.jsx` 里 `LearnPage` 和 `HallOfFameCategoryPage` 都被 import 了但没在任何 route 里用。改这两个文件不会反映到任何页面。
5. **`hall-of-fame-media.js` 是 .js 不是 .json**：data 目录里唯一一个。它导出 JS module 而非纯数据，所以可以含逻辑/常量引用。
6. **`training-registry.json` 是空壳**：训练手册支柱内容尚未注入，相关 UI 可能还没接到。
7. **韩语翻译不完整**：写新内容时按 zh+en+ko 的 schema，ko 没翻译先填空字符串。
8. **Vite cacheDir 在 `/tmp`**：本地开发遇到诡异缓存问题先 `rm -rf /tmp/vite-cache` 再说。
9. **PWA 自动更新可能导致用户看到旧版本**：发版后让自己强刷 `Cmd+Shift+R` 验证。
10. **Supabase RPC `check_email_exists` 必须存在**：若新环境忘了跑 `sql/create-check-email-rpc.sql`，登录页会挂。
11. **没有打点 / PostHog**：当前只有 Vercel Analytics，**没有**其他埋点系统。新功能要做埋点先跟 team lead 对齐方案。

### 当前已知技术债（截至 2026-05-06）

> 这些不是"踩了就 BOOM"的坑，是开发时会让你多花 20 分钟搞懂"这是 bug 还是已知"的状态。

12. **`npm run lint` 当前不绿**：约 **52 个问题（37 errors, 15 warnings）**，主要是 React Hooks 规则、conditional hooks、effect 中同步 setState、deps 缺失、未用变量等。基线政策见 §12："新 PR 不引入新 error，warnings 放行"。后续会单开任务清债。
13. **`npm install` 报 audit 漏洞**：约 8 个（2 moderate, 6 high）。不阻塞启动。先不要随便 `npm audit fix --force`，可能升大版本。
14. **build warnings**：
    - CSS 里 Google Fonts `@import` 不在所有规则之前（影响顺序，但视觉无差）
    - `src/lib/supabase.js` 同时被静态和动态 import，动态 import 不会拆 chunk
    - `index` chunk 约 **3.9MB minified**、`section-03-technique` 约 **681KB**，超过 Vite 500KB warning。说明首屏 bundle 偏大，未来要拆
15. ~~**根目录的"幽灵目录"**~~：已于 2026-05-06 清理。原本根目录有 `--skip-download/`、`--sub-format/`、`--sub-langs/`、`--write-auto-subs/`、`--write-subs/`、`-o/`、`yt-dlp/`、`vtt/`、`en-orig/`、`https:/` 一批 yt-dlp 误操作残留——记一笔，避免再发生：跑 `yt-dlp` 等命令时**记得给参数加引号**，特别是 URL 和 `-o` 后面的输出路径。
16. **`README.md` 还是 Vite 默认模板**：忽略它。所有项目知识在本文件 + DESIGN-BRIEF + animation-plan。下一次 PR 会把 README 改成指向本文件。
17. **`ONBOARDING.md` 当前可能 untracked**：本文件刚创建（2026-05-05），如果 `git status` 显示是 untracked，等 owner commit 后再做 `git pull`，避免和 origin 上的同名文件冲突。

---

## 14. 接下来做什么 / 怎么挑活

- 当前路线图见 repo 上一级 `team-lead/next-steps-roadmap.md`（重点：角色种子内容 + Feed 页面 + 场景插图）
- 但这份路线图是 2026-04-12 写的，最新优先级以 team lead（Alice）当面分配为准
- 改动建议：
  - **先小后大**：第一个 PR 挑一个独立页面或一个 utility，不要一上来动 AppContext / 路由
  - **改内容的 PR 要走 team-lead 那边的产出流程**（不是开发的工作）
  - **加新 section 或 KP**：通常不是开发动手，需要更新 `kp-registry.json` 等真源，由内容流程负责

---

## 15. 一条龙：5 分钟跑起来检查清单

```bash
git pull   # ⚠️ 如果 ONBOARDING.md 是 untracked，先确认 origin 上没有同名冲突再 pull
cp .env.example .env  # 填 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm install
npm run dev           # → http://localhost:5173

# 如果起不来：
node --version        # 必须 18+，已验证 v22 OK
rm -rf /tmp/vite-cache node_modules && npm install
```

**最低验收**（不需要打开浏览器也能跑）：
- `npm run dev` 输出 "Vite ready"，监听 5173 端口
- `curl -sI http://localhost:5173/` 返回 200
- `curl -sI http://localhost:5173/knowledge` 返回 200（SPA fallback 工作）
- `npm run build` 成功（会有 build warnings，见 §13.14——不是 blocker）

**完整验收**（如果你的 runtime 有浏览器工具）：
- 打开 → 深色背景 + "攀岩知识库" hero → 点底三 tab → 进 `/knowledge` 看到 10 板块卡片 → 准备好开发。

---

## 16. 出错了找谁

- 业务方向 / 需求拆分 / 优先级：team lead（Alice）
- Slock 端协作 / 任务流：通过 DM 找 Alice，或在分配的 channel 提
- Supabase 凭证：项目所有者 xingjian-hu

---

*最后更新：2026-05-05 by Alice (team lead)*
*下次有大改动（路由重构 / 设计 token 调整 / 新表）请同步更新本文件*
