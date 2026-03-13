# 运动员数据处理指南 / Athlete Data Processing Guide

> **角色定位**：你负责将信息收集员采集的原始文本，转化为攀岩名人堂网站可直接使用的结构化数据。
> 你是"从原材料到成品"的最后一道关卡：提炼、结构化、双语化，输出两个目标文件。
>
> ⚠️ **先读架构文件再开始处理**：本指南是操作手册，内容架构的设计依据在
> `athlete-researcher/hall-of-fame-architecture-guide.md`。
> 对"为什么用这些章节类型"有疑问时，去那里找答案。

---

## 一、工作全貌 / Overview

### 输入（你的原材料）

原始来源文件位于：

```
athlete-researcher/athletes/
├── 01-elite-lead-sport/     ← 竞技精英：难度
│   ├── 00-index_01-elite-lead-sport_*.md   ← 该类别总索引
│   ├── Janja-Garnbret_elite-lead-sport_*.md
│   ├── Adam-Ondra_elite-lead-sport_*.md
│   └── ...（每位运动员一个 .md 文件）
├── 02-elite-bouldering/     ← 竞技精英：抱石
├── 03-elite-speed/          ← 竞技精英：速度
├── 04-explorer-free-climbing/ ← 探险：自由攀登
├── 05-explorer-big-wall/    ← 探险：大岩壁
├── 06-explorer-free-solo/   ← 探险：自由独攀
├── 07-legend/               ← 历史先驱
├── 08-innovator/            ← 训练革新
├── 09-chinese-athletes/     ← 中国运动员
└── 10-media-platforms/      ← 媒体与平台资源（参考，不处理）
```

每个运动员 `.md` 文件的结构如下：

```markdown
# 预览：{运动员姓名} — 信息收集批次 {日期}

> 状态：待 Review｜共 N 条来源

---

## src-001 · {文章标题}

| 字段 | 内容 |
|------|------|
| 来源  | {来源网站名} |
| 作者  | {作者} |
| 日期  | {YYYY-MM} |
| 类型  | interview / profile / biography / wikipedia |
| 语言  | en / zh |
| URL   | {原文链接} |

### 原文全文

{完整原文，可能是采访逐字稿、文章正文、Wikipedia 摘录等}

---

## src-002 · {第二条来源标题}
...
```

**读取时关注的关键位置**：

| 位置 | 用途 |
|------|------|
| `## src-NNN · {标题}` | 每条来源的起点 |
| 元数据表格 | 来源出处、URL、语言 → 写入 `sources[]` 和 `furtherReading[]` |
| `### 原文全文` 下的正文 | **你的主要素材**：从这里提炼关键内容 |
| 直接引语（`"..."` 或 `**Garnbret:** "..."` 格式） | **最优先保留**，提取进 `pullQuotes[]` |

**处理哪些运动员**：总负责人会在任务指令中指定。如未指定，优先处理已在 `athlete-registry.json` 中有占位入口、但章节内容尚薄的运动员，或 `09-chinese-athletes/` 中的人物。

### 输出（你的成品）

你需要写入**两个文件**：

```
rock-climbing-knowledge/src/data/
├── athlete-registry.json   ← 主注册表（athletes[] + chapters[]）
└── hall-of-fame-media.js   ← 多媒体注册表（图片、视频、时间线）
```

---

## 二、关键内容提取规则 / Content Extraction Rules

⚠️ **这是本指南最重要的一节，不可跳过。**

从 `### 原文全文` 中提取**有价值的内容**，不是简单摘抄，也不是泛泛概述。

### 2.1 什么是"有价值的内容"

满足以下任意一条，必须保留：

#### A. 训练方法的具体描述
- 可被读者直接参考或复现的训练细节
- 示例：
  > "Six training sessions weekly lasting four to five hours each; 95 percent of training occurs on the wall rather than supplementary fitness work."
- **保留原因**：具体数字 + 训练结构，对攀岩者有直接参考价值

#### B. 运动员本人的直接引语（最高优先级）
- 表达训练哲学、心理观念、对攀登的看法
- 示例：
  > "Every day is another fight. I'm a perfectionist, so I want to be great."
- **特别规则**：引语表达得好，无论长短，**必须完整保留**——不要为了精简而截断有意义的语句
- **提取方式**：直接引语同时写入 `paragraphs[]`（散文语境中）和 `pullQuotes[]`（独立展示）

#### C. 心理策略与思维方式
- 如何处理压力、自我怀疑、比赛前后的心理调适
- 示例：Garnbret 解释"巴黎奥运决赛前的心态管理"的具体过程

#### D. 对攀登的独特洞见或理念
- 能让读者"啊，原来可以这么看"的观点
- 示例（Gill）："攀登是兼具游戏性和精神性的实践"

#### E. 里程碑式的成就描述
- 能说明某人"为什么重要"的具体数据或事件
- 示例："首位女性 onsight 8c"、"单赛季包揽所有抱石世界杯冠军"

### 2.2 什么内容可以省略

- 泛泛而谈的背景介绍（"攀岩是一项古老的运动..."）
- 与该运动员无实质关联的通用信息
- Wikipedia 式的流水账生平（生日、出生地保留在 keyFacts 即可）
- 信息收集员在文件中添加的主观评估备注

### 2.3 "有价值内容"放在哪里

| 内容类型 | 写入位置 |
|---------|---------|
| 训练方法细节、心理策略（散文叙述） | `chapters[].paragraphs[]` |
| 直接引语（逐字原文，英文） | `chapters[].pullQuotes[]` + 可整合进 `paragraphs[]` |
| 关键数字、里程碑 | `chapters[].keyFacts[]` |
| 标志性引语（档案页顶部展示）| `athletes[].featuredQuote` |
| 编者对此人的精炼洞察 | `hallOfFameMedia[].interviewNotes[]` |

---

## 三、目标文件结构 / Target File Structures

### 3.1 athlete-registry.json — athletes[] 数组

每个运动员在 `athletes` 数组中有一个入口：

```json
{
  "athleteId": "ath-102",
  "slug": "adam-ondra",
  "athleteName": {
    "zh": "亚当·翁德拉",
    "en": "Adam Ondra"
  },
  "category": "elite",
  "subcategory": "lead-sport",
  "nationality": {
    "zh": "捷克",
    "en": "Czech Republic"
  },
  "activeEra": {
    "zh": "2006 年至今",
    "en": "Active since 2006"
  },
  "tagline": {
    "zh": "首位完成 9c 的人类",
    "en": "The first person to climb 9c"
  },
  "overview": {
    "zh": "一两句话，说明此人为什么值得被收录——聚焦最核心的一件事。",
    "en": "One to two sentences on why this person belongs here, focused on the single most important fact."
  },
  "featuredQuote": {
    "text": {
      "zh": "最能代表此人的一句话（中文意译）",
      "en": "The single most representative quote, verbatim from source."
    },
    "source": "来源媒体名称, YYYY-MM"
  },
  "accentColor": "#4A7C59",
  "isChineseRepresentative": false,
  "specialties": [
    { "zh": "难度攀登", "en": "Lead climbing" },
    { "zh": "抱石", "en": "Bouldering" }
  ],
  "heroStats": [
    {
      "label": { "zh": "代表成就", "en": "Signature achievement" },
      "value": { "zh": "9c《Silence》（2017）", "en": "9c Silence (2017)" }
    }
  ],
  "chapterIds": [
    "ath-102-career-arc",
    "ath-102-competition-record",
    "ath-102-training-system",
    "ath-102-quotes"
  ]
}
```

**字段说明**：

| 字段 | 必填 | 前端渲染位置 | 说明 |
|------|------|------------|------|
| `athleteId` | ✅ | — | 固定格式 `ath-NNN`，由总负责人分配 |
| `slug` | ✅ | URL 路径 | 全小写连字符，英文名，如 `adam-ondra` |
| `athleteName` | ✅ | 列表卡片 + 详情页 hero | `{ zh, en }` 双语；列表页卡片还用 `en` 生成姓名缩写头像 |
| `category` | ✅ | 列表页筛选器 + 详情页标签 | `legend` / `elite` / `explorer` / `innovator` |
| `subcategory` | ✅ | **未渲染（存储备用）** | 未来精细筛选器使用 |
| `nationality` | ✅ | 详情页侧边栏"人物概览" | `{ zh, en }` |
| `activeEra` | ✅ | 详情页侧边栏"人物概览" | `{ zh, en }` |
| `tagline` | ✅ | 列表卡片正文 + 详情页 hero | 一句话标签，有力、具体 |
| `overview` | ✅ | 列表卡片正文 + 详情页 hero | 1-2 句，为什么此人值得收录 |
| `featuredQuote` | ✅ | 详情页 hero 区块（带竖线引用样式）| `{ text: {zh,en}, source }`，必须有原文出处 |
| `accentColor` | ✅ | 列表卡片背景渐变色 + 详情页 hero 渐变色 | 见下方推荐色表；**每次添加前检查注册表已有颜色** |
| `specialties` | ✅ | 列表卡片 + 详情页 hero（chips 标签） | `[{ zh, en }]`，2-4 个标签 |
| `heroStats` | ✅ | 详情页 hero 底部数据卡（3 列网格，全部渲染） | `[{ label:{zh,en}, value:{zh,en} }]`，建议 2-3 条 |
| `isChineseRepresentative` | 仅中国运动员 | 列表页"中国运动员"筛选器 | 非中国运动员可省略此字段（或设为 `false`） |
| `chapterIds` | ✅ | — | **顺序即详情页渲染顺序**，与 `chapters[]` 中实际写入的 ID 必须一致 |

**accentColor 推荐**（确保颜色多样不重复，**处理新运动员前先读取注册表已有颜色，避免重复**）：

| 色值 | 色调 |
|------|------|
| `#356A57` | 深绿 |
| `#6F5B7B` | 深紫 |
| `#B85C4B` | 砖红 |
| `#8C6A32` | 深金 |
| `#2C6E8A` | 深蓝 |
| `#7A5C3E` | 深土 |
| `#4A6741` | 橄榄绿 |
| `#8B3A5A` | 深玫瑰 |
| `#5C4033` | 深棕 |
| `#3D6B8A` | 石板蓝 |

---

### 3.2 athlete-registry.json — chapters[] 数组

**章节类型速查表**（完整说明见 `hall-of-fame-architecture-guide.md`）：

| 类型 ID | 中文名 | 适用对象 |
|--------|--------|---------|
| `career-arc` | 人生轨迹 | 所有运动员 |
| `competition-record` | 竞技档案 | `elite` 类 |
| `training-system` | 训练体系 | 有详细训练来源的运动员 |
| `mental-game` | 竞技心理 | `elite` 类，有心理主题采访 |
| `signature-routes` | 标志性路线 | `explorer` 类 |
| `philosophy` | 攀登哲学 | `explorer`、`legend`、`innovator` |
| `innovation` | 革新贡献 | `innovator` 类 |
| `quotes` | 精选引语 | 有丰富采访文本的任何运动员 |
| `china-context` | 中国视角 | `isChineseRepresentative: true` |

**根据内容决定章节组合**（不是每种类型都必须开）：
- 来源不含训练细节 → 不开 `training-system`
- 来源不含采访引语 → 不开 `quotes`
- 不是中国运动员 → 不开 `china-context`
- **宁缺勿凑**：2 个充实的章节胜过 4 个空洞的章节

**`chapterIds` 的顺序即详情页的渲染顺序**，请按内容重要性排列（通常：career-arc 最先，quotes 最后）。

**章节 JSON 结构**：

```json
{
  "id": "ath-102-mental-game",
  "type": "mental-game",
  "athleteId": "ath-102",
  "title": {
    "zh": "章节标题：要具体，不要泛泛（见第五节标准）",
    "en": "Chapter title: be specific, not generic"
  },
  "summary": {
    "zh": "1-2 句，概括这个章节的核心主题。",
    "en": "1-2 sentences summarizing what this chapter is about."
  },
  "paragraphs": [
    {
      "zh": "第一段：从原文提炼的核心内容，可含完整引语（用引号标出）。",
      "en": "First paragraph: key content from source, quotes may be included verbatim."
    }
  ],
  "pullQuotes": [
    {
      "text": {
        "zh": "引语中文意译，保持完整，不截断。",
        "en": "Verbatim quote in original English. Never truncate a meaningful sentence."
      },
      "context": {
        "zh": "一句话说明这段话的背景（如：谈巴黎奥运半决赛后的心态调整）",
        "en": "One sentence describing when/why this was said"
      },
      "source": "来源媒体名, YYYY-MM"
    }
  ],
  "keyFacts": [
    {
      "label": { "zh": "训练频率", "en": "Training frequency" },
      "value": { "zh": "每周 6 次，每次 4-5 小时", "en": "6 sessions/week, 4–5 hours each" }
    }
  ],
  "relatedKps": ["kp-fingerboard-training"],
  "sources": [
    {
      "label": "Climbing Magazine 2024-08 interview",
      "url": "https://www.climbing.com/..."
    }
  ]
}
```

**`relatedKps` 填写说明**：
- 填入知识库知识点的 ID（格式 `kp-XXXX`），前端会在侧边栏显示为可点击链接
- 所有 ID 必须是 `rock-climbing-knowledge/src/data/kp-registry.json` 中已存在的条目
- 不确定是否存在时，**留空数组 `[]`**，不要猜测

**`sources[]` 聚合逻辑**：详情页侧边栏"来源概览"会把**所有章节**的 `sources[]` 合并去重（按 URL），统一展示。因此同一来源 URL 可以在多个章节都引用——不会重复显示给用户。

**`quotes` 类型章节的特殊写法**（纯引语集合，无需 paragraphs）：

```json
{
  "id": "ath-101-quotes",
  "type": "quotes",
  "title": { "zh": "扬娅说过的话", "en": "Words from Janja" },
  "summary": { "zh": "从多年采访中提炼的核心观点", "en": "Core ideas from years of interviews" },
  "paragraphs": [],
  "pullQuotes": [
    { "text": {...}, "context": {...}, "source": "..." },
    { "text": {...}, "context": {...}, "source": "..." }
  ],
  "keyFacts": [],
  "sources": [...]
}
```

**字段说明**：

| 字段 | 必填 | 前端渲染 | 说明 |
|------|------|---------|------|
| `id` | ✅ | — | `{athleteId}-{type}` |
| `type` | ✅ | ✅ | 见上方类型表，控制章节标签；`quotes` 类型跳过 paragraphs 渲染 |
| `athleteId` | ✅ | — | 反向关联用，前端不直接渲染 |
| `title` | ✅ | ✅ | 具体的章节标题（见第五节标准） |
| `summary` | ✅ | ✅ | 1-2 句，章节预览文字 |
| `paragraphs` | ✅ | ✅ | 1-3 段散文（`quotes` 类型填空数组 `[]`） |
| `pullQuotes` | 推荐 | ✅ | 逐字引语，每条含 `text` / `context` / `source` |
| `keyFacts` | 推荐 | ✅ | 2-4 条数据点，`label` + `value` 双语 |
| `relatedKps` | 可选 | ✅ | 关联知识点 ID（必须存在于 kp-registry.json），侧边栏展示 |
| `sources` | ✅ | ✅ | 至少 1 条，`label` + `url`；侧边栏去重后统一展示 |

---

### 3.3 hall-of-fame-media.js — 媒体注册表

#### 文件结构说明

`hall-of-fame-media.js` 是一个 **JavaScript 文件**，不是 JSON。当前文件结构如下：

```js
const hallOfFameMedia = {}

export default hallOfFameMedia
```

添加运动员条目时，将新的键值对插入 `hallOfFameMedia` 对象：

```js
const hallOfFameMedia = {
  'ath-101': {
    // Janja Garnbret 的内容
  },
  'ath-102': {
    // Adam Ondra 的内容（你新增的）
  }
}

export default hallOfFameMedia
```

⚠️ **注意 JS 语法**：对象键用单引号包裹，每个条目后加逗号，最后一个条目结尾逗号可省略（建议保留）。

#### 条目结构

```js
'ath-102': {
  cardImage: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/...',
    alt: { zh: '简短描述', en: 'Brief description' },
    scale: 1.05,
    translateX: '0%',
    objectPosition: 'center top'
  },
  images: [
    {
      src: '...',
      alt: { zh: '...', en: '...' },
      caption: { zh: '...', en: '...' },
      creditLabel: 'Wikimedia Commons / 摄影师',
      creditUrl: '...'
    }
  ],
  videos: [
    {
      title: { zh: '...', en: '...' },
      url: 'https://www.youtube.com/watch?v=...',
      channel: '频道名称',
      platform: 'youtube',
      lang: 'en',
      summary: { zh: '...', en: '...' },
      relevance: 'primary'
    }
  ],
  bilibiliVideos: [
    {
      title: { zh: '...', en: '...' },
      url: 'https://www.bilibili.com/video/...',
      uploader: 'UP主名称',
      summary: { zh: '...', en: '...' },
      relevance: 'primary'
    }
  ],
  podcasts: [
    {
      title: { zh: '...', en: '...' },
      url: '...',
      show: 'TrainingBeta Podcast',
      episodeDate: '2023-09',
      summary: { zh: '...', en: '...' }
    }
  ],
  timeline: [
    {
      year: '2017',
      detail: { zh: '...', en: '...' }
    }
  ],
  interviewNotes: [
    { zh: '编者洞察或精炼引语', en: 'Key insight or curated quote' }
  ],
  furtherReading: [
    { title: '...', source: '...', url: '...' }
  ]
}
```

**字段说明**：

| 字段 | 渲染位置 | 说明 |
|------|---------|------|
| `cardImage` | **列表页卡片右侧** + **详情页 hero 右侧** | 两个页面共用同一图片；优先用 Wikimedia Commons 免费图 |
| `images` | **详情页图集（gallery）区块** | 仅用于画廊，**不包含** `cardImage`；无可用图时填 `[]` |
| `videos` | 详情页"精选视频"区块 | `platform: 'youtube'`；`relevance` 字段前端不渲染，供内部排序参考 |
| `bilibiliVideos` | 详情页"Bilibili 视频"区块 | 中国运动员优先填写；有任何运动员的 B 站资源也可填；`relevance` 同上 |
| `podcasts` | 详情页"播客"区块 | 有播客逐字稿来源时填写 |
| `timeline` | 详情页"关键时间线"区块 | `year` 为字符串；按时间正序排列 |
| `interviewNotes` | 详情页"采访观察"区块 | 每条为 `{ zh, en }` 对象；编者精炼洞察，非原文摘抄 |
| `furtherReading` | 详情页侧边栏"延伸阅读" | `{ title, source, url }` |

**`cardImage` 的 `objectPosition` / `scale` / `translateX` 调整方式**：
- 默认值：`objectPosition: 'center top'`，`scale: 1`，`translateX: '0%'`
- 如果人物面孔被裁切：调整 `objectPosition`，如 `'center 20%'` 向下偏移
- 如果图片需要放大局部：`scale: 1.1`（适度，不超过 1.3）
- 无法判断时保持默认值，总负责人可在预览后微调

**无法找到图片时**：`cardImage` 省略（不写此键），`images` 填 `[]`。

---

## 四、详情页渲染顺序 / Detail Page Render Order

了解渲染顺序，有助于你决定哪些内容写入 `chapters[]`、哪些写入媒体字段。

详情页（`/hall-of-fame/{slug}`）的区块渲染顺序如下：

```
1. Hero 区块
   ├── category 标签
   ├── athleteName（大标题）
   ├── tagline（副标题）
   ├── overview（简介）
   ├── featuredQuote（带竖线的引用块）
   ├── specialties（chips 标签）
   └── heroStats（底部数据卡，全部渲染）

2. 侧边栏（左侧，桌面端吸附）
   ├── 人物概览（nationality + activeEra）
   ├── 关联知识点（汇总所有章节 relatedKps，去重）
   ├── 来源概览（汇总所有章节 sources[]，按 URL 去重）
   └── 延伸阅读（media.furtherReading）

3. 主内容区（右侧，按以下顺序）
   ├── 图集（media.images，若非空）
   ├── 关键时间线（media.timeline，若非空）
   ├── 采访观察（media.interviewNotes，若非空）
   ├── 章节（按 chapterIds 顺序，依次渲染）
   ├── 精选视频（media.videos，若非空）
   ├── Bilibili 视频（media.bilibiliVideos，若非空）
   └── 播客（media.podcasts，若非空）
```

**实践含义**：
- `timeline`、`interviewNotes` 会出现在所有章节**之前**，适合放简短的生涯大事记和编者补充
- 章节的顺序由 `chapterIds` 数组决定，建议：`career-arc` → 核心专题章节 → `quotes`

---

## 五、处理流程 / Processing Workflow

### Step 1：确认要处理的运动员

读取总负责人的任务指令，确认待处理的运动员名单和优先级。

### Step 2：读取原始来源

找到该运动员在 `athlete-researcher/athletes/{对应子文件夹}/` 下的 `.md` 文件，全文阅读每条 `src-NNN`。

### Step 3：内容评估 + 章节规划

快速评估可用素材：
- 有几条来源？类型是什么（Wikipedia / 采访 / 播客 / 竞赛报道）？
- 有详细训练描述吗？有直接引语吗？有路线叙事吗？
- 内容深度属于哪一档（Rich / Standard / Minimal）？
- **决定开哪几个章节类型**（参考架构文件中的典型组合）

### Step 4：写 athletes[] 入口

按 3.1 的结构，追加到 `athletes` 数组末尾。
特别注意填写 `featuredQuote`（从原文引语中选最具代表性的一句）。

### Step 5：写 chapters[]

按 3.2 的结构，逐章节撰写，追加到 `chapters` 数组末尾。
- 先写 `paragraphs`（散文叙述）
- 再提炼 `pullQuotes`（从 paragraphs 中的引语，或直接从原文摘取）
- 最后填 `keyFacts` 和 `sources`
- 确保 `chapterIds` 字段与实际写入的章节 ID 一致，且顺序反映你希望的展示优先级

### Step 6：写 hall-of-fame-media.js 条目

在 `hallOfFameMedia` 对象中添加 `'ath-NNN'` 键，按 3.3 的结构填写内容。

### Step 7：更新 _meta

```json
"_meta": {
  "totalAthletes": N,
  "totalChapters": M,
  "updatedAt": "YYYY-MM-DD"
}
```

`totalAthletes` = `athletes[]` 数组长度；`totalChapters` = `chapters[]` 数组长度；`updatedAt` = 今天日期。

### Step 8：输出处理摘要，等待确认

```
## 处理完成：{运动员姓名}（{athleteId}）

**章节规划**：[列出选择的章节类型及理由]

**写入内容**：
- athletes[] 入口：ath-NNN（subcategory: XXX）
- chapters[] 新增：ath-NNN-career-arc, ath-NNN-mental-game（共 N 个）
- hall-of-fame-media.js 新增：'ath-NNN' 条目

**提取的关键 pullQuotes**：
1. "{引语原文}" — 来源：[文章标题]
2. ...（列出全部已提炼的引语）

**featuredQuote 选择**："{选中的标志性引语}" — 选择理由：[一句话说明]

**来源使用情况**：
- src-001（文章标题）→ career-arc + mental-game
- src-002（文章标题）→ training-system + pullQuotes

**待补充或注意事项**（如有）：
- [如：图片暂未找到 Wikimedia 可用图；或：某章节来源偏薄建议后续补充]

请确认后我继续处理下一位。
```

---

## 六、写作质量标准 / Quality Standards

### 双语写作规范

- 中英文必须是**独立写作**，不是互相翻译
- `pullQuotes[].text.en` 保留原文英文，一字不改；`.zh` 可意译，但不截断
- 中文用"他/她"，不用"其"；技术术语用约定俗成译法（"抱石"不是"boulder climbing"的直译）
- 不要在中文中保留英文括注，除非是人名或路线名

### 事实准确性

- 只写有来源支撑的内容
- 数字（成绩、时间、次数）必须有原文依据，不要"合理估计"
- 如来源说法不一致，保守处理并注明

### 章节标题要具体

❌ 差：`"Janja Garnbret 的训练"`
✅ 好：`"每周六练、95% 在岩壁上的训练逻辑"`

❌ 差：`"Adam Ondra 的成就"`
✅ 好：`"从 13 岁完成 9a 到 24 岁首登 9c：难度攀登的进化速度"`

❌ 差：`"Alex Honnold 的心理"`
✅ 好：`"恐惧的解剖：Honnold 如何系统性地消除 Freerider 上的风险"`

### 篇幅控制

- `overview`（athletes 入口）：50 字以内（中文），1-2 句
- `summary`（章节摘要）：80 字以内（中文），1-2 句
- `paragraphs`：每段 100-200 字，最多 3 段；**价值密度优先于篇幅**
- `pullQuotes`：每个章节 1-4 条；`quotes` 类型章节可到 6-10 条
- `keyFacts`：2-4 条，每条 value 不超过 20 字（中文）

---

## 七、特殊情况处理 / Edge Cases

| 情况 | 处理方式 |
|------|---------|
| 来源只有 Wikipedia，缺乏采访内容 | 只开 `career-arc` + `competition-record`，不强行写空洞章节 |
| 有精彩引语但不确定出处 | 填入 pullQuotes，source 注明"来源未经独立核实"，提示总负责人审核 |
| 中国运动员缺乏英文来源 | 优先用中文来源写中文版，英文版意译但保持语义完整；`china-context` 章节必须开 |
| 运动员姓名中文译法有争议 | 用 IFSC/CGMA 官方中文名；如无官方，用最广泛流传的版本 |
| 原文极长（如播客全文） | 优先处理包含训练方法、引语、核心成就的段落；不求面面俱到 |
| 运动员横跨多个子文件夹（如 Caldwell 在 04 和 05 都有） | 合并两个文件夹的来源，`subcategory` 选主要所属；`signature-routes` 章节可涵盖两方面 |
| featuredQuote 难以选择 | 优先选训练哲学或心理观念类引语；其次选最能体现其独特性的话；避免选纯成绩描述 |
| `relatedKps` 不确定有哪些可用 ID | 读取 `rock-climbing-knowledge/src/data/kp-registry.json` 检索，不确定时留 `[]` |
| 无可用图片 | `cardImage` 键省略，`images` 填 `[]`；侧边栏不会渲染图集区块 |

---

## 八、参考：现有数据基准

第一批运动员处理完成后，`athlete-registry.json` 将包含可参考的真实示例。

首次处理时，以 `athlete-researcher/athletes/01-elite-lead-sport/Janja-Garnbret_elite-lead-sport_*.md` 作为起点——她的原始来源最丰富（9 条），适合建立质量基准。第一个条目处理完成并经总负责人确认后，后续运动员以它为参考标准。

---

*创建于 2026-03-11 / 优化于 2026-03-12*
*架构依据：`athlete-researcher/hall-of-fame-architecture-guide.md`*
*输入目录：`athlete-researcher/athletes/`*
*下游文件：`athlete-registry.json`、`hall-of-fame-media.js`*
