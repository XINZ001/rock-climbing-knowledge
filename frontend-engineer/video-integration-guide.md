# 前端任务指令：视频数据整合与展示

> **发起人**：总负责人
> **执行人**：前端工程师 Bot
> **优先级**：高
> **最后更新**：2026-03-04

---

## 一、任务目标

将视频调研员的全部产出（`video-researcher/` 目录）整合进前端应用，实现：

1. **每个知识点关联多条视频**，但 UI 上只默认展示一条最佳视频，其余折叠收纳
2. **基于用户 IP 地址 + 语言偏好**，智能筛选展示哪个平台的视频
3. **可基于视频内容理解，优化现有数据中表述不够准确或可改进的字段**（如标题翻译、摘要等）

---

## 二、当前架构（你需要了解的现状）

### 2.1 现有文件

| 文件 | 作用 | 备注 |
|------|------|------|
| `src/data/videos.json` | 当前视频数据，按 subSection ID 分组 | 结构简单，一个 KP 只配一条视频 |
| `src/data/video-registry.json` | 视频注册表，含 segments/时间戳 | 更详细但数据量小 |
| `src/pages/TopicPage.jsx` | 页面层，负责把 video 分配给各 KP | 目前只传单条 video |
| `src/components/content/KnowledgePoint.jsx` | 知识点组件，渲染视频嵌入 | 目前只接收单条 `video` prop |
| `src/components/content/VideoSection.jsx` | 视频卡片网格组件 | 独立组件，已有 VideoCard 可复用 |
| `src/context/AppContext.jsx` | 全局 context，含 `lang` 状态 | 目前无 IP / 地区状态 |

### 2.2 现有视频数据结构（`videos.json`）

```json
{
  "s01-categories": [
    {
      "title": { "zh": "...", "en": "..." },
      "url": "https://www.youtube.com/watch?v=...",
      "channel": "...",
      "lang": "en",
      "knowledgePointId": "kp-xxx"  // 可选
    }
  ]
}
```

### 2.3 视频调研数据来源

**请完整阅读 `video-researcher/` 整个目录**，这是视频调研员的全部产出。目录结构如下：

```
video-researcher/
├── video-research-guide.md           ← 调研指导文件（了解数据规范和字段定义）
├── video-research-results.md         ← 主表（汇总所有视频条目）
├── video-research-results/           ← 各轮次 / 各模块的详细产出
│   ├── video-research-index.md       ← 索引文件
│   ├── video-research-s02-physical.md
│   ├── video-research-s03-technique.md
│   ├── video-research-s06-safety.md
│   ├── video-research-round3.md
│   ├── video-research-round4.md
│   ├── video-research-round5.md
│   ├── video-research-round6.md
│   └── video-research-supplements.md
└── reference/                        ← 参考资料
```

你需要把**所有 `.md` 文件中的视频条目**都读取并整合，不要只看主表。子目录中的轮次文件和模块文件可能包含主表中没有的补充视频。

每条视频条目通常包含：
- **视频标题** / **平台**（YouTube | Bilibili）/ **频道** / **URL** / **语言**（en | zh）
- **Primary KP**：主要匹配的知识点（可多个）
- **Secondary KP**：次要匹配的知识点
- **内容摘要**：中英双语描述
- **教学质量评分**：⭐ 1-5 星
- **评分理由**

共约 **174 条视频**，覆盖 ~87 条 Bilibili + ~58 条 YouTube。

---

## 三、数据层改造

### 3.1 新的视频数据结构

将 `videos.json` 重构为 **按 kp-id 索引、支持多视频** 的结构：

```json
{
  "_meta": {
    "description": "Videos mapped to knowledge points, with quality ranking",
    "updatedAt": "2026-03-04"
  },
  "kp-edging": [
    {
      "title": { "zh": "攀岩脚法入门 — 边踩技术", "en": "Climbing Technique: Foot Placement & Edging" },
      "url": "https://www.youtube.com/watch?v=oqd39cc0HL0",
      "channel": "Eric Karlsson Bouldering",
      "platform": "youtube",
      "lang": "en",
      "relevance": "primary",
      "quality": 4,
      "summary": {
        "zh": "详细演示内侧边踩和外侧边踩的正确姿势...",
        "en": "Detailed demonstration of inside and outside edging technique..."
      }
    },
    {
      "title": { "zh": "攀岩动作与技巧—脚法正身动作", "en": "Climbing Moves & Technique: Footwork Basics" },
      "url": "https://www.bilibili.com/video/BV1v64y1c78u/",
      "channel": "岩时攀岩",
      "platform": "bilibili",
      "lang": "zh",
      "relevance": "primary",
      "quality": 4,
      "summary": {
        "zh": "...",
        "en": "..."
      }
    }
  ]
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `{ zh, en }` | 是 | 双语标题 |
| `url` | string | 是 | 视频完整 URL（必须是具体视频，不是频道链接） |
| `channel` | string | 是 | 频道/UP主名 |
| `platform` | `"youtube"` \| `"bilibili"` | 是 | 平台标识 |
| `lang` | `"en"` \| `"zh"` | 是 | 视频语言 |
| `relevance` | `"primary"` \| `"secondary"` | 是 | 与该 KP 的关联程度 |
| `quality` | 1-5 | 是 | 教学质量评分（来自调研数据的星级） |
| `summary` | `{ zh, en }` | 否 | 内容简述 |

### 3.2 数据转换规则

从 `video-research-results.md` 解析数据时：

1. **一条视频可能出现在多个 KP 下**（因为 Primary KP 可能列出多个 kp-id）
2. **排序规则**（同一个 KP 下的多条视频）：
   - `relevance: "primary"` 排在 `"secondary"` 前面
   - 同级别按 `quality` 降序
   - 同分按平台交替排列（确保 YouTube 和 Bilibili 都靠前）
3. **过滤**：
   - ❌ 丢弃频道链接（URL 不含具体视频 ID 的）
   - ❌ 丢弃 `quality < 3` 的视频
   - ❌ 丢弃非教学内容（Vlog、挑战类）
4. **合并现有数据**：`videos.json` 和 `video-registry.json` 中已有的视频如果在调研数据中也存在，以调研数据的评分和映射为准；如果调研数据中没有但现有数据中有且是有效视频 URL，保留。

### 3.3 内容优化授权

在整合数据的过程中，你**可以也应该**基于对视频内容的理解，做以下优化：

- **修正不准确的中文翻译标题**（如英文标题被机翻导致不自然）
- **补充缺失的双语标题**（有些条目只有一种语言的标题）
- **改进 summary**：如果调研数据中的内容摘要过于笼统，可以写得更具体
- **修正 KP 映射**：如果你判断某视频映射到的 KP 不准确，可以调整
- **不要凭空捏造视频 URL 或频道名**——只优化已有数据的文字描述

---

## 四、IP 地理位置检测

### 4.1 实现方案

新增一个 hook 或 utility 用于获取用户地理位置区域信息：

```
src/hooks/useUserRegion.js   （或 src/utils/userRegion.js）
```

**检测逻辑**：

1. 调用免费 IP 地理定位 API（推荐选项见下方）获取用户国家代码
2. 判断是否为中国大陆（country code = `CN`）
3. 缓存结果到 `sessionStorage`，避免重复请求
4. 提供 fallback：API 失败时默认为「非中国大陆」（因 YouTube 嵌入在海外更可靠）

**推荐 API**（免费、无需 key、HTTPS）：

| API | 特点 |
|-----|------|
| `https://ipapi.co/json/` | 免费 1000次/天，返回 `country_code` |
| `https://ip-api.com/json/?fields=countryCode` | 免费但 HTTP only，生产环境需注意 |
| `https://api.country.is/` | 极简，只返回 `{ "country": "CN" }` |

选择其中一个即可，确保生产环境兼容 HTTPS。

### 4.2 导出接口

```js
// 示例接口
const { region, isMainlandChina, loading } = useUserRegion()
// region: "CN" | "US" | "JP" | ...
// isMainlandChina: boolean
// loading: boolean （API 请求中）
```

---

## 五、视频筛选逻辑

### 5.1 三种场景的视频筛选规则

根据 IP 和语言组合，从每个 KP 的视频数组中筛选可展示的视频：

```
场景 A：用户 IP 在中国大陆（isMainlandChina === true）
  → 只显示 platform === "bilibili" 的视频
  → 无论当前语言是中文还是英文

场景 B：用户 IP 在大陆之外 + 当前语言为英文（lang === "en"）
  → 只显示 platform === "youtube" 的视频
  → 包含 lang: "en" 和 lang: "zh" 的 YouTube 视频都可以显示

场景 C：用户 IP 在大陆之外 + 当前语言为中文（lang === "zh"）
  → 显示所有平台的视频（youtube + bilibili 都可以）
```

### 5.2 筛选后排序

在每个场景中，筛选后的视频按以下规则排序，**第一条即为默认展示的「最佳视频」**：

1. `relevance: "primary"` 优先于 `"secondary"`
2. 同 relevance 下，`quality` 高的优先
3. 同 quality 下：
   - 场景 A：Bilibili 中文视频优先
   - 场景 B：YouTube 英文视频优先
   - 场景 C：与当前 `lang` 匹配的优先

### 5.3 建议封装

```js
// src/utils/videoFilter.js

/**
 * 从一个 KP 的所有视频中，根据用户地区和语言筛选并排序
 * @param {Array} videos - 该 KP 下的所有视频
 * @param {boolean} isMainlandChina
 * @param {string} lang - "zh" | "en"
 * @returns {Array} 筛选并排序后的视频，第一条为推荐展示
 */
export function filterAndRankVideos(videos, isMainlandChina, lang) {
  // ...实现上述逻辑
}
```

---

## 六、UI 展示改造

### 6.1 KnowledgePoint 组件改造

**现状**：`KnowledgePoint` 接收单条 `video` prop
**目标**：接收 `videos` 数组（已筛选排序后），展示为「一条主视频 + 折叠更多」

#### 交互设计

```
┌─────────────────────────────────────────┐
│  📹 相关视频 / Related Video             │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │     [嵌入播放器 - 最佳视频]           │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│  视频标题                    频道名  B站  │
│                                         │
│  ▶ 更多相关视频 (3)    ← 折叠按钮       │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│  │ 展开后显示其余视频列表（紧凑卡片）   │ │
│  │ ┌───────────┐  ┌───────────┐       │ │
│  │ │ 视频卡片2 │  │ 视频卡片3 │       │ │
│  │ └───────────┘  └───────────┘       │ │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
└─────────────────────────────────────────┘
```

#### 详细要求

1. **默认展示第一条视频**（即排序后的最佳视频），使用现有的嵌入播放器样式
2. **如果有 2 条及以上视频**，在主视频下方显示折叠按钮：
   - 中文：`▶ 更多相关视频 (N)`
   - 英文：`▶ More videos (N)`
   - 点击展开，展开后变为 `▼ 收起 / ▼ Collapse`
3. **折叠区域内的视频**：使用紧凑卡片样式（参考 `VideoSection.jsx` 中 `VideoCard` 的设计），不需要自动展开播放器，只显示缩略图 + 标题 + 频道 + 平台标签
4. **如果筛选后只有 0 条视频**：不显示视频区域（与当前空状态行为一致）
5. **如果筛选后只有 1 条视频**：只显示主视频，不显示折叠按钮

### 6.2 TopicPage 改造

**现状**：`TopicPage` 从 `videos.json` 按 subSection ID 读取，分配单条 video
**目标**：从新的 `videos.json`（按 kp-id 索引）读取，传入筛选后的数组

```jsx
// TopicPage.jsx 改造要点
import { useUserRegion } from '../hooks/useUserRegion'
import { filterAndRankVideos } from '../utils/videoFilter'
import videosData from '../data/videos.json'

// 在组件内部
const { isMainlandChina, loading: regionLoading } = useUserRegion()

// 为每个 KP 获取筛选后的视频数组
const getVideosForKp = (kpId) => {
  const allVideos = videosData[kpId] || []
  return filterAndRankVideos(allVideos, isMainlandChina, lang)
}

// 传给 KnowledgePoint
<KnowledgePoint
  point={kp}
  videos={getVideosForKp(kp.id)}   // 数组，不再是单条
  illustrations={illustrationRegistry[kp.id]}
/>
```

### 6.3 Loading 状态

IP 检测是异步的，在结果返回之前：
- 视频区域显示一个轻量 skeleton / 占位符（不要让整个页面等待）
- 知识点的文字内容正常渲染，不受影响

---

## 七、不要动的部分

- `video-registry.json` 的 schema 保持不动（它是视频标注 Bot 的产出格式）
- `VideoSection.jsx` 保留（可能其他地方有用到，或者可以从中复用 `VideoCard`）
- Section JSON 文件（`section-01~10-*.json`）的知识点内容不要修改
- 不要修改 `kp-registry.json`

---

## 八、执行步骤

### Step 1：数据解析与构建（最重要）

1. 完整阅读 `video-researcher/` 整个目录下的所有 `.md` 文件，提取全部视频条目
2. 读取现有 `src/data/videos.json` 和 `src/data/video-registry.json`
3. 按 §3 的规则解析、合并、去重、排序
4. 生成新的 `src/data/videos.json`
5. 对于频道链接（无具体视频 ID 的 URL），直接丢弃并在产出报告中标注

### Step 2：IP 检测模块

1. 创建 `src/hooks/useUserRegion.js`（或放在 utils 中）
2. 实现 §4 的检测 + 缓存逻辑
3. 在 `AppContext` 中集成（或作为独立 hook 在 TopicPage 中使用）

### Step 3：视频筛选工具

1. 创建 `src/utils/videoFilter.js`
2. 实现 `filterAndRankVideos()` 函数
3. 编写测试用例覆盖三种场景

### Step 4：组件改造

1. 修改 `KnowledgePoint.jsx`：接收 `videos` 数组，实现「主视频 + 折叠更多」
2. 修改 `TopicPage.jsx`：使用新数据结构 + 筛选逻辑
3. 确保 loading 状态、空状态、单视频状态都正确处理

### Step 5：验证与产出报告

1. 本地运行验证：切换语言、模拟不同地区
2. 输出整合报告：
   - 共整合了多少条视频
   - 覆盖了多少个 KP（含覆盖率）
   - 丢弃了多少条无效数据（频道链接、低质量等）
   - 做了哪些内容优化（标题修正、摘要改进等）

---

## 九、质量标准

- [ ] `videos.json` 中不存在频道链接（所有 URL 必须是可嵌入的具体视频）
- [ ] 每条视频都有 `platform` 字段且值正确
- [ ] 中国大陆 IP 用户看不到任何 YouTube 视频嵌入
- [ ] 海外英文用户看不到 Bilibili 视频
- [ ] 海外中文用户可以看到两个平台的视频
- [ ] 折叠/展开交互流畅，无布局跳动
- [ ] IP 检测失败时有合理 fallback，页面不卡住
- [ ] 不影响已有的插图、专家洞察、延伸阅读等模块的渲染

---

## 十、参考文件路径速查

```
读取（输入）：
  video-researcher/                                   ← ⭐ 完整阅读此目录下所有文件
  rock-climbing-knowledge/src/data/videos.json        ← 现有视频数据
  rock-climbing-knowledge/src/data/video-registry.json ← 现有视频注册表
  rock-climbing-knowledge/src/data/kp-registry.json   ← KP 总索引（验证 kp-id 用）

修改（输出）：
  rock-climbing-knowledge/src/data/videos.json        ← 重构后的视频数据
  rock-climbing-knowledge/src/hooks/useUserRegion.js  ← 新增
  rock-climbing-knowledge/src/utils/videoFilter.js    ← 新增
  rock-climbing-knowledge/src/pages/TopicPage.jsx     ← 改造
  rock-climbing-knowledge/src/components/content/KnowledgePoint.jsx ← 改造
```

---

*本指令由总负责人编写，前端工程师 Bot 按此执行。完成后提交整合报告等待审核。*
