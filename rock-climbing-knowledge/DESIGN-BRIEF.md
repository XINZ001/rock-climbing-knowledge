# 攀岩知识库 — 设计概览 (Design Brief)

> 本文件描述网站当前的视觉系统和页面布局，供设计协作参考。

---

## 1. 品牌色彩方案

网站采用「岩石 + 森林」自然色调体系，整体温暖、沉稳，无暗色模式。

### 核心色板

| 色彩角色 | 色值 | CSS 变量 | 用途 |
|---------|------|---------|------|
| 页面背景 | `#F8F6F3` | `--color-stone-bg` | 全局页面背景，偏暖白 |
| 卡片/容器背景 | `#FFFFFF` | `--color-stone-card` | 所有卡片、弹窗、Header 背景 |
| 侧栏背景 | `#F0EDE8` | `--color-stone-sidebar` | 左侧导航面板 |
| 边框 | `#E5E0D8` | `--color-stone-border` | 卡片/输入框/分隔线边框 |
| 主文字 | `#3D3D3D` | `--color-text-primary` | 标题、正文 |
| 辅助文字 | `#6B6B6B` | `--color-text-secondary` | 描述、标签、时间戳 |
| 品牌绿（主色） | `#4A7C59` | `--color-forest` | 按钮、链接、选中态、品牌标识 |
| 品牌绿（深） | `#3A6347` | `--color-forest-dark` | 按钮 hover 态 |
| 品牌绿（浅底） | `#E8F0EB` | `--color-forest-light` | 选中态背景、成功提示底 |
| 辅助暖色 | `#D4913D` | `--color-amber` | 伤痛档案标签、警告图标 |
| 辅助暖色（浅底） | `#FDF3E7` | `--color-amber-light` | 警告提示底色 |

### 渐变方案（用于入口卡片 Banner）

三个主模块各有专属双径向渐变，用于页面头部 Banner 和首页入口卡片：

- **攀岩名人堂**：左上 `rgba(199,161,42,0.22)` 金色 + 右下 `rgba(74,124,89,0.18)` 森林绿
- **伤痛档案**：左上 `rgba(212,145,61,0.18)` 暖橙 + 右下 `rgba(180,60,60,0.14)` 砖红
- **攀岩知识库**：左上 `rgba(74,124,89,0.20)` 森林绿 + 右下 `rgba(93,64,55,0.14)` 棕色

渐变均使用 `radial-gradient`，定位于左上 / 右下角，扩散范围约 35%–40%，覆盖于白色卡片之上，形成柔和的色彩倾向。

---

## 2. 字体方案

```
font-family: "Helvetica Neue", "Helvetica", "PingFang SC", "Microsoft YaHei", "Arial", sans-serif;
```

- 中英文混排，中文优先使用 PingFang SC（macOS / iOS）和 Microsoft YaHei（Windows）
- 全局开启 `-webkit-font-smoothing: antialiased`
- 不使用自定义 Web 字体，依赖系统字体

---

## 3. 全局布局结构

```
┌─────────────────────────────────────────────────┐
│  Header (sticky top, h-14, z-40)                │
│  [汉堡菜单] [Logo] [知识库|名人堂|伤痛档案] [搜索] [EN/中文] [用户] │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │  Main Content                        │
│ w-60     │  <Outlet />                          │
│ sticky   │  max-w-6xl mx-auto px-4 py-8         │
│ 仅桌面端  │                                      │
│          ├──────────────────────────────────────┤
│          │  Footer (border-t, text-center)      │
└──────────┴──────────────────────────────────────┘
```

- **Header**：白底 + 底部边框 + 轻投影，高 56px，sticky 吸顶
- **Sidebar**：桌面端始终显示（w-60），移动端通过汉堡菜单滑出（w-72），带遮罩层
- **Main Content**：flex-1 自适应，内容区统一 `max-w-6xl`
- **Footer**：白底 + 顶部边框，居中对齐，显示品牌信息和小红书链接

### 响应式断点

- `sm` (640px)：卡片从单列变双列，Header 导航按钮显示文字
- `lg` (1024px)：桌面侧栏显示，移动侧栏隐藏
- `xl` (1280px)：知识库网格变为 4 列

---

## 4. 首页 (Home Page)

首页是整个网站的门户，不展示具体内容，只提供三大模块的入口。

### 布局（从上到下）

1. **Hero 区域**（居中对齐）
   - 64×64 圆角绿色图标（山峰 icon）
   - 主标题 `text-3xl font-bold`：攀岩知识库
   - 副标题 `text-lg text-secondary`：Climbing Knowledge Base
   - 描述文字 `text-sm text-secondary`
   - 制作人署名 + 小红书外链按钮

2. **入口卡片 ×3**（纵向排列，间距 mb-10）
   - 圆角 `rounded-[1.75rem]`，白底 + 边框 + 轻投影
   - 绝对定位的渐变背景层
   - 内容区 `px-6 py-6 sm:px-8`，flex 布局：左侧标题+描述，右侧 CTA 文字 + 箭头
   - Hover 效果：上移 0.5px + 增强投影
   - 各卡片 CTA 文字颜色与渐变主色一致（名人堂绿色、伤痛档案暖色、知识库绿色）
   - "攀岩名人堂"卡片额外有 `NEW` 徽章（右上角，琥珀色半透明底 + 大写文字）

---

## 5. 模块列表页（知识库 / 名人堂 / 伤痛档案）

三个模块的列表页使用统一的页面头部 Banner 风格：

### 共同 Banner 结构

```html
<section class="relative overflow-hidden rounded-[2rem] border bg-stone-card shadow-sm mb-8">
  <div class="absolute inset-0 bg-[radial-gradient(...)]" />  <!-- 渐变背景 -->
  <div class="relative px-6 py-8 sm:px-10 sm:py-10">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">标题</h1>
    <p class="mt-3 text-base sm:text-lg text-secondary">描述</p>
  </div>
</section>
```

- 圆角 `rounded-[2rem]`，比首页入口卡片略大
- 内边距 `px-6 py-8`（sm: `px-10 py-10`）
- 渐变配色与首页入口卡片一致
- 标题 `text-3xl sm:text-4xl font-bold tracking-tight`
- 页面宽度统一 `max-w-6xl`

### 各模块内容区差异

**攀岩知识库 `/knowledge`**
- Banner 下方紧接 4 列网格卡片（每张代表一个知识领域）
- 每张卡片：白底圆角 `rounded-xl`，40×40 彩色图标 + 标题 + 英文副标题 + 描述 + 子分类数量
- 各知识领域有独立主题色（用于图标背景）

**攀岩名人堂 `/hall-of-fame`**
- Banner 下方是 3 列网格卡片（每张代表一个分类）
- 卡片圆角 `rounded-[1.5rem]`，标题为 forest 绿色 + 人数计数
- 包含简介文字、代表人物预览、进入链接

**伤痛档案 `/injuries`**
- Banner 内右侧有 CTA 按钮「分享我的经历」（绿色圆角按钮）
- Banner 下方依次是：免责声明（暖色底横条）→ 筛选器（下拉选择框）→ 2 列案例卡片网格
- 案例卡片含：部位标签（暖色 pill）+ 类型标签（绿色 pill）+ 标题 + 摘要 + 互动数据

---

## 6. 导航系统

### Header 导航栏

三个顶部导航按钮，当前活跃状态用 `bg-forest-light text-forest` 高亮：
- 知识库（book icon）→ `/knowledge`
- 名人堂（trophy icon）→ `/hall-of-fame`
- 伤痛档案（alertTriangle icon）→ `/injuries`

### 侧栏导航

从上到下：
1. 首页（home icon）
2. 攀岩知识库（book icon）— 选中态 `bg-forest-light text-forest`
3. 攀岩名人堂（trophy icon）— 同上
4. 伤痛档案（alertTriangle icon）— 选中态 `bg-amber-light text-amber`
5. 知识领域手风琴列表（10 个领域，每个可展开显示子分类）

### 用户菜单（Header 右上角下拉）

- 头像圆形（首字母，forest 绿底白字）+ 昵称 + 展开箭头
- 下拉项：「个人设置」→ `/settings` ｜ 分割线 ｜ 「退出登录」（红色文字）
- 未登录时显示绿色「登录」按钮

---

## 7. 组件风格规范

### 卡片（Card）

- 背景 `bg-stone-card`（白色）
- 边框 `border border-stone-border`
- 圆角分两档：普通卡片 `rounded-xl`（12px），大尺寸 Banner `rounded-[2rem]`（32px）
- Hover：`hover:shadow-md hover:border-stone-border/80`
- 入口级卡片额外有 `hover:-translate-y-0.5 hover:shadow-lg`

### 按钮

- 主按钮：`bg-forest text-white rounded-lg px-4 py-2`，hover `bg-forest-dark`
- 辅助按钮：`border border-stone-border text-text-secondary rounded-lg`
- 禁用态：`disabled:opacity-50`
- 圆角统一 `rounded-lg`（8px）或 `rounded-xl`（12px）

### 表单输入框

```
px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm
focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest
```

### 标签 / 药丸（Pill / Tag）

- 绿色标签：`bg-forest-light text-forest text-xs font-medium rounded-full px-2 py-0.5`
- 暖色标签：`bg-amber-light text-amber text-xs font-medium rounded-full px-2 py-0.5`

### 弹窗（Modal）

- 全屏遮罩 `bg-black/40`
- 内容区 `bg-stone-card rounded-2xl border shadow-xl max-w-md`
- 右上角关闭按钮

---

## 8. 间距和尺寸规范

| 元素 | 值 |
|------|-----|
| 页面主区域内边距 | `px-4 py-8` |
| 页面最大宽度 | `max-w-6xl`（72rem / 1152px） |
| 卡片间距 | `gap-4`（16px）或 `gap-6`（24px） |
| 模块间距（首页卡片之间） | `mb-10`（40px） |
| Banner 与内容间距 | `mb-8`（32px） |
| 表单元素间距 | `space-y-4`（16px） |
| Header 高度 | `h-14`（56px） |
| 侧栏宽度 | 桌面 `w-60`（240px），移动 `w-72`（288px） |

---

## 9. 交互与动画

- 卡片 hover：上移 + 投影增强，`transition-all`
- 侧栏滑入：`transition-transform duration-300 ease-out`
- 遮罩层：`transition-opacity duration-300`
- 图标 hover：`group-hover:scale-105 transition-transform`
- CTA 箭头：`group-hover:translate-x-0.5`
- 自定义动画：fadeIn、scaleIn、slideUp、fadeInUp（用于弹窗和 toast）

---

## 10. 国际化

- 中英文双语，通过 `lang` 状态切换（`zh` / `en`）
- Header 右侧有语言切换按钮 `EN / 中文`
- 所有用户可见文案都有中英文版本
- 默认语言：中文
