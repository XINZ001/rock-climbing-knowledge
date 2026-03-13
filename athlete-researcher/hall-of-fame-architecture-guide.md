# 名人堂内容架构重构指南
# Hall of Fame — Content Architecture Redesign

> **文档定位**：本文件定义攀岩名人堂（Hall of Fame）的新内容架构。
> 架构基于 `athlete-researcher/athletes/` 中约 98 名运动员的实际采集内容归纳得出，
> **不继承现有网站的固定卡片类型（biography/training/technique/interview）**。
>
> 本文件是数据处理员的上游依据：处理前先读本文件，再读 `data-processing-guide.md`。

---

## 一、为什么需要重构 / Why Redesign

### 现有结构的问题

现有网站为每位运动员生成固定 3-4 张卡片：

```
biography → training → technique → interview
```

这个框架源于"通用人物页"的设计思路，但与实际采集到的内容存在根本性错位：

| 问题 | 具体体现 |
|------|---------|
| **类型太泛** | "interview" 卡片同时装了心理、哲学、回忆、采访观点，缺乏焦点 |
| **未利用最有价值的内容** | 大量逐字采访稿、播客原文被压缩成两段散文，直接引语消失 |
| **探险者和革新者无法适配** | Honnold 的路线叙事、Eric Horst 的训练科学，用 4 个固定卡片都装不下 |
| **中国运动员被平等对待** | 中国运动员内容深度不同，无专属处理路径 |
| **类别颗粒度不够** | 现有 4 类（legend/elite/explorer/innovator）无法反映速度攀岩、抱石、大岩壁之间的本质差异 |

### 新架构的核心逻辑

**原则一：内容形态决定章节类型，而不是反过来。**

不同运动员的可用内容深度和主题完全不同：
- Garnbret 有 9 条来源，最有价值的是竞技心理和训练体系
- Alex Honnold 有 8 条来源，最有价值的是路线叙事和风险哲学
- 龙金宝 可能只有 1 条比赛报道

用同一套卡片框架处理它们，必然产生"强行填充"或"大量空白"。

**原则二：直接引语是最高价值的内容，要为它单独设计容器。**

从采集内容来看，最有感召力的部分恰恰是：
- Garnbret："Never in my life have I believed in myself like I did in Paris."
- Honnold 谈风险计算的方式
- Eric Horst 关于训练本质的系统论述

这些内容在现有卡片结构中要么被压缩掉，要么变成一段散文里的引号——失去了视觉呈现和独立阅读价值。

**原则三：类别应反映攀岩的真实分支，而不是营销标签。**

---

## 二、新分类系统 / Category System

将现有 4 类扩展为 **6 个主类别**，每个主类别含子类别标签：

| 主类别 | 子类别标签（subcategory）| 典型代表 |
|-------|------------------------|---------|
| `legend` | `historical-pioneer` | John Gill、Royal Robbins |
| `elite` | `lead-sport` | Garnbret、Adam Ondra |
| `elite` | `bouldering` | Ashima Shiraishi、Tomoa Narasaki |
| `elite` | `speed` | Veddriq Leonardo、Aleksandra Mirosław |
| `explorer` | `free-climbing` | Chris Sharma、Tommy Caldwell |
| `explorer` | `big-wall` | Kevin Jorgeson、Jim Collins |
| `explorer` | `free-solo` | Alex Honnold、Dean Potter |
| `innovator` | `training-science` | Eric Horst、Eva López |
| `innovator` | `movement-system` | 贡献了动作语言体系的人物 |

**中国运动员** 保持 `isChineseRepresentative: true` 标记，跨主类别分布（Wu Peng → `elite/speed`，Pan Yufei → `elite/lead-sport`），不再单独作为类别。

---

## 三、章节类型系统 / Chapter Type System

用**弹性章节（Chapters）**替代固定卡片（Cards）。

每位运动员的档案页由 1-5 个章节组成，**从以下类型中选取**：

### 3.1 章节类型全表

| 章节类型 ID | 中文名 | 适用对象 | 核心问题 |
|-----------|--------|---------|---------|
| `career-arc` | 人生轨迹 | 所有运动员 | 他/她是如何走到这一步的？ |
| `competition-record` | 竞技档案 | `elite` 类运动员 | 有哪些关键成绩和里程碑？ |
| `training-system` | 训练体系 | 有详细训练来源的运动员 | 他/她具体如何训练？ |
| `mental-game` | 竞技心理 | `elite` 类，有心理主题采访 | 如何应对压力、自我怀疑和失败？ |
| `signature-routes` | 标志性路线 | `explorer` 类运动员 | 哪些攀登定义了这个人？ |
| `philosophy` | 攀登哲学 | `explorer`、`legend`、`innovator` | 他/她如何看待攀登、风险和人生？ |
| `innovation` | 革新贡献 | `innovator` 类运动员 | 具体发明或建立了什么？ |
| `quotes` | 精选引语 | 任何有丰富采访文本的运动员 | 哪些话值得被单独记住？ |
| `china-context` | 中国视角 | `isChineseRepresentative: true` | 在中国攀岩发展中代表什么？ |

### 3.2 各主类别的典型章节组合

**`elite` 竞技精英（以 Garnbret 为例）**：

```
career-arc → competition-record → training-system → mental-game → quotes
```

**`explorer / free-solo` 自由独攀（以 Honnold 为例）**：

```
career-arc → signature-routes → philosophy → training-system → quotes
```

**`explorer / big-wall` 大岩壁（以 Caldwell 为例）**：

```
career-arc → signature-routes → philosophy → mental-game
```

**`legend` 历史先驱（以 John Gill 为例）**：

```
career-arc → philosophy → innovation → quotes
```

**`innovator` 训练革新（以 Eric Horst 为例）**：

```
career-arc → innovation → training-system → quotes
```

**中国运动员（以 Wu Peng 为例，内容较浅时）**：

```
career-arc → competition-record → china-context
```

---

## 四、数据结构变更 / Schema Changes

### 4.1 athlete-registry.json — athletes[] 变更

在现有字段基础上，新增或修改：

```json
{
  "athleteId": "ath-101",
  "slug": "janja-garnbret",
  "athleteName": { "zh": "扬娅·甘布雷特", "en": "Janja Garnbret" },
  "category": "elite",
  "subcategory": "lead-sport",
  "isChineseRepresentative": false,
  "nationality": { "zh": "斯洛文尼亚", "en": "Slovenia" },
  "activeEra": { "zh": "2013 年至今", "en": "Active since 2013" },
  "tagline": { "zh": "...", "en": "..." },
  "overview": { "zh": "...", "en": "..." },
  "featuredQuote": {
    "text": {
      "zh": "在巴黎，我从来没有像那样相信过自己。没有一刻怀疑。",
      "en": "Never in my life have I believed in myself like I did in Paris. Not a single moment of doubt."
    },
    "source": "Climbing Magazine, 2024-08"
  },
  "accentColor": "#356A57",
  "specialties": [...],
  "heroStats": [...],
  "chapterIds": [
    "ath-101-career-arc",
    "ath-101-competition-record",
    "ath-101-training-system",
    "ath-101-mental-game",
    "ath-101-quotes"
  ]
}
```

**新字段说明**：

| 字段 | 说明 |
|------|------|
| `subcategory` | 子类别（见上方表格），用于前端精细筛选 |
| `featuredQuote` | 档案页顶部展示的标志性引语，最能代表此人的一句话 |
| `chapterIds` | 原 `cardIds`，改名为 `chapterIds` 以反映弹性章节逻辑 |

### 4.2 athlete-registry.json — chapters[] 变更

原 `cards[]` 数组改为 `chapters[]`，结构扩展如下：

```json
{
  "id": "ath-101-mental-game",
  "type": "mental-game",
  "athleteId": "ath-101",
  "athleteName": { "zh": "扬娅·甘布雷特", "en": "Janja Garnbret" },
  "title": {
    "zh": "在巅峰时刻保持冷静：巴黎奥运心理解剖",
    "en": "Staying Calm at the Top: A Mental Anatomy of Paris 2024"
  },
  "summary": { "zh": "...", "en": "..." },
  "paragraphs": [
    { "zh": "...", "en": "..." }
  ],
  "pullQuotes": [
    {
      "text": {
        "zh": "我是完美主义者，所以总想给出更多。但我学到了，奥运会最重要的是不能做太少，也不能做太多。",
        "en": "Because I'm a perfectionist, you always want to give every time a little bit more. But I learned for the Olympics it's important that you don't do too little and you don't do too much."
      },
      "context": { "zh": "谈巴黎奥运半决赛后的心态调整", "en": "On mindset between semis and finals at Paris 2024" },
      "source": "Climbing Magazine, 2024-08"
    }
  ],
  "keyFacts": [...],
  "relatedKps": [...],
  "sources": [...]
}
```

**新字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `pullQuotes` | array | **新增**。从原文提炼的逐字引语，带上下文说明和出处。这是最重要的新字段。 |
| `pullQuotes[].text` | object (zh/en) | 引语本文，英文保留原文，中文意译但不截断 |
| `pullQuotes[].context` | object (zh/en) | 一句话说明这段话的背景 |
| `pullQuotes[].source` | string | 来源媒体和日期 |

**`quotes` 类型章节的特殊结构**：

`quotes` 章节是一个纯引语集合，不含 `paragraphs`，只有 `pullQuotes[]`（可包含 5-10 条）：

```json
{
  "id": "ath-101-quotes",
  "type": "quotes",
  "title": { "zh": "扬娅说过的话", "en": "Words from Janja" },
  "summary": { "zh": "从多年采访中提炼的核心观点", "en": "Core ideas drawn from years of interviews" },
  "pullQuotes": [
    { "text": {...}, "context": {...}, "source": "..." },
    { "text": {...}, "context": {...}, "source": "..." }
  ],
  "paragraphs": [],
  "keyFacts": [],
  "sources": [...]
}
```

### 4.3 hall-of-fame-media.js — 新增字段

```js
'ath-101': {
  cardImage: { ... },
  images: [ ... ],
  videos: [ ... ],         // YouTube 视频（保持不变）
  bilibiliVideos: [        // 新增：中国运动员专用，或有 Bilibili 资源的运动员
    {
      title: { zh: '...', en: '...' },
      url: 'https://www.bilibili.com/video/...',
      uploader: 'UP主名称',
      summary: { zh: '...', en: '...' },
      relevance: 'primary'
    }
  ],
  podcasts: [              // 新增：播客来源（TrainingBeta、Joe Rogan 等）
    {
      title: { zh: '...', en: '...' },
      url: '...',
      show: 'TrainingBeta Podcast',
      episodeDate: '2023-09',
      summary: { zh: '...', en: '...' }
    }
  ],
  timeline: [ ... ],
  interviewNotes: [ ... ],
  furtherReading: [ ... ]
}
```

---

## 五、内容深度分级 / Content Depth Tiers

根据原始数据的实际丰富程度，将运动员分为三档：

| 档位 | 来源数量 | 章节上限 | 处理方式 |
|------|---------|---------|---------|
| **Rich**（完整档案） | ≥ 4 条来源，含采访全文 | 4-5 个章节 + `quotes` | 充分提炼，pullQuotes 不少于 3 条 |
| **Standard**（标准档案） | 2-3 条来源 | 2-3 个章节，无 `quotes` | 聚焦最有价值的 1-2 个主题章节 |
| **Minimal**（基础档案） | 1 条来源或仅 Wikipedia | 1-2 个章节 | 只做 `career-arc` + `competition-record`，标注"内容待补充" |

**中国运动员**：多数属于 Standard 或 Minimal，但必须包含 `china-context` 章节。

---

## 六、映射：原始数据来源 → 章节类型

处理时，根据每条 `src-NNN` 来源的**类型字段**，判断它对应哪个章节：

| 来源类型 | 对应章节 |
|---------|---------|
| `wikipedia` / `biography` | `career-arc` |
| `competition-report` / `results` | `competition-record` |
| `interview`（谈训练方法） | `training-system` |
| `interview`（谈心理、压力、备赛） | `mental-game` |
| `interview`（谈某条路线的故事） | `signature-routes` |
| `interview`（谈哲学、价值观、为何攀登） | `philosophy` |
| `training-article` / `podcast`（方法论） | `training-system` 或 `innovation` |
| 任何含有高质量直接引语的来源 | → 同时往 `pullQuotes` 提炼 |
| 中文来源（新华、新浪体育、微博） | 优先贡献 `china-context`；成绩数据贡献 `competition-record` |

---

## 七、迁移说明 / Migration Note

现有 `athlete-registry.json` 中已有 4 名运动员（ath-001、ath-002、ath-101、ath-201）。

这些运动员的现有数据**不需要删除**，但需要：
1. 为每位运动员**添加 `subcategory` 字段**
2. 为每位运动员**添加 `featuredQuote` 字段**（从现有卡片内容中提炼）
3. 将 `cardIds` 字段**重命名为 `chapterIds`**
4. 将 `cards[]` 数组**重命名为 `chapters[]`**
5. 为现有章节内容中的关键引语**添加 `pullQuotes[]` 字段**（可在处理新运动员时顺带补充）

以上迁移工作量较小，可以在处理新运动员时同步完成。

---

## 八、文件更新清单 / Files to Update

每次处理完一批运动员，需要更新以下文件：

| 文件 | 更新内容 |
|------|---------|
| `rock-climbing-knowledge/src/data/athlete-registry.json` | `athletes[]` 新入口 + `chapters[]` 新章节 |
| `rock-climbing-knowledge/src/data/hall-of-fame-media.js` | 对应运动员的媒体条目 |
| `rock-climbing-knowledge/src/data/athlete-registry.json._meta` | `totalAthletes` 和 `totalChapters` 计数 |

---

*创建于 2026-03-11*
*基于 `athlete-researcher/athletes/` 约 98 名运动员的内容分析*
*下游依赖：`athlete-researcher/data-processing-guide.md`*
