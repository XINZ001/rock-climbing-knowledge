# AI 协作指南：攀岩知识库视频分析与标注
# AI Collaboration Guide: Video Analysis & Tagging for Climbing Knowledge Base

---

## 📌 项目概述

这是一个中英双语攀岩知识库，包含 **177 个知识点（Knowledge Points）**，覆盖攀岩的 10 大领域。你的任务是**搜索、分析 YouTube/Bilibili 视频**，将视频中的内容片段与知识点进行精确匹配和时间戳标注。

---

## 📁 关键文件位置

```
rock-climbing-knowledge/
├── src/data/
│   ├── kp-registry.json          ← 🔑 知识点总注册表（177个知识点，含 ID、关键词、状态）
│   ├── video-registry.json       ← 🎬 视频注册表（所有视频及其时间戳标注）
│   ├── sections.json             ← 模块索引（10个大类）
│   ├── section-01-overview.json  ← 各模块详细内容
│   ├── section-02-physical.json
│   ├── section-03-technique.json ← 攀爬技术（最详细，37个知识点）
│   ├── ...
│   └── section-10-competition.json
├── video-resources.md            ← 已收集的视频资源列表（供参考）
└── reference/illustration-prompts.md ← 插图需求列表（供参考）
```

---

## 🔑 最重要的文件：kp-registry.json

这个文件是**一切操作的核心索引**。包含每个知识点的：

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 唯一标识符 | `"kp-drop-knee"` |
| `path` | 所属路径 | `"technique/body-positioning"` |
| `title` | 中英文标题 | `{ "zh": "落膝", "en": "Drop Knee" }` |
| `keywords` | 关键词列表（用于匹配） | `["落膝", "drop knee", "膝盖下压", "knee drop"]` |
| `tags` | 分类标签 | `["intermediate", "technique"]` |
| `status.video` | 视频配备状态 | `"pending"` / `"partial"` / `"done"` |

### 如何使用 keywords 进行匹配

当你分析一个视频的字幕/内容时，用 `keywords` 字段进行模糊匹配：

```
视频字幕中出现 "drop knee" 或 "落膝" 或 "垂膝"
  → 匹配到 kp-drop-knee
  → 记录该片段的起止时间戳
```

---

## 🎬 视频注册表格式：video-registry.json

当你找到一个视频并完成分析后，请按以下格式添加到 `video-registry.json` 的 `videos` 数组中：

```json
{
  "id": "yt-VIDEO_ID",
  "platform": "youtube",
  "videoId": "VIDEO_ID",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "title": { "zh": "中文标题", "en": "English Title" },
  "channel": "频道名",
  "lang": "en",
  "duration": 720,
  "segments": [
    {
      "kpId": "kp-drop-knee",
      "start": 220,
      "end": 295,
      "relevance": "primary",
      "note": {
        "zh": "标准落膝教学，含正误对比",
        "en": "Standard drop knee tutorial with right/wrong comparison"
      }
    },
    {
      "kpId": "kp-flagging",
      "start": 300,
      "end": 380,
      "relevance": "secondary",
      "note": {
        "zh": "在落膝讲解中顺带提到了旗帜步",
        "en": "Flagging mentioned in context of drop knee"
      }
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 格式：`yt-{videoId}` 或 `bili-{BVid}` |
| `platform` | ✅ | `"youtube"` 或 `"bilibili"` |
| `videoId` | ✅ | YouTube 的 11 位 ID 或 Bilibili 的 BV 号 |
| `url` | ✅ | 完整视频链接 |
| `title` | ✅ | 必须包含 `zh` 和 `en` 两个字段 |
| `channel` | ✅ | 频道/创作者名称 |
| `lang` | ✅ | 视频主要语言：`"en"` 或 `"zh"` |
| `duration` | ⬚ | 视频总时长（秒），不确定填 `null` |
| `segments` | ✅ | 知识点映射数组，至少 1 个 |
| `segments[].kpId` | ✅ | 必须是 `kp-registry.json` 中存在的 ID |
| `segments[].start` | ⬚ | 片段起始时间（秒），不确定填 `null` |
| `segments[].end` | ⬚ | 片段结束时间（秒），不确定填 `null` |
| `segments[].relevance` | ✅ | `"primary"` / `"secondary"` / `"mention"` |
| `segments[].note` | ✅ | 中英文简述，说明该片段对应的内容 |

### relevance 级别定义

| 级别 | 含义 | 示例 |
|------|------|------|
| `primary` | 该片段的**主题**就是这个知识点 | "Neil Gresham 专门教 Drop Knee" |
| `secondary` | 在讲其他内容时**深入讨论**了这个知识点 | "讲仰角技术时详细演示了 Drop Knee" |
| `mention` | 仅**简要提及**，没有深入讲解 | "列举技术清单时提到了 Drop Knee" |

---

## 📋 工作流程

### Step 1: 获取视频
- 从 YouTube / Bilibili 搜索攀岩教学视频
- 优先搜索高质量频道（见下方推荐列表）
- 优先选择有字幕/CC的视频（便于分析）

### Step 2: 分析视频内容
- 获取视频字幕（YouTube 自动字幕或手动字幕）
- 识别视频中讲解的每个技术点/知识点
- 记录每个知识点出现的时间戳（起止时间）

### Step 3: 匹配知识点
- 打开 `kp-registry.json`
- 用视频中提到的术语，在 `keywords` 字段中搜索匹配
- 如果视频内容涉及的知识点在注册表中不存在，请记录下来作为"建议新增"

### Step 4: 写入 video-registry.json
- 按格式添加视频条目
- 确保所有 `kpId` 都是 `kp-registry.json` 中已有的 ID
- 一个视频可以有多个 segments（通常 3-15 个）

### Step 5: 更新 kp-registry.json 状态
- 将已配备视频的知识点的 `status.video` 更新为 `"partial"` 或 `"done"`
- `"partial"` = 有 1-2 个视频片段
- `"done"` = 有 3+ 个视频片段（覆盖充分）

---

## 🎯 优先搜索频道

### English YouTube 频道（按内容价值排序）

| 频道 | 擅长领域 | 搜索关键词 |
|------|---------|-----------|
| **Neil Gresham** | 技术大师课（30+ 教程）| `Neil Gresham Masterclass` |
| **Lattice Training** | 科学训练、指力 | `@LatticeTraining` |
| **Hooper's Beta** | 伤病预防、康复 | `@HoopersBeta` |
| **Adam Ondra** | 职业技术演示 | `@AdamOndra` |
| **Movement for Climbers** | 技术进阶系列 | `@movementforclimbers` |
| **Catalyst Climbing** | 动态动作 | `@CatalystClimbing` |
| **VDiff Climbing** | 安全技术、传统攀 | `vdiffclimbing.com` |
| **Wide Boyz** | 裂缝攀登 | `Wide Boyz` |
| **The Climbing Doctor** | 攀岩伤病 | `@theclimbingdoctor` |
| **HowNOT2** | 装备测试 | `@HowNOT2` |
| **IFSC** | 比赛直播 | `@IFSClimbing` |

### 中文频道（Bilibili + YouTube）

| 频道 | 擅长领域 |
|------|---------|
| **知岩片语** | 传统攀装备、恐惧管理 |
| **岩时攀岩** | 攀岩技术系列 |
| **Jamin_Yan** | 指力板训练 |
| **未來攀登** | 耐力训练 |
| **Geek Climber** | 训练与装备 |

---

## 🏷️ 10 大知识模块速览

| # | 模块 | slug | KPs | 关键搜索方向 |
|---|------|------|-----|-------------|
| 1 | 攀岩概览 | `overview` | 12 | 历史纪录片、分类讲解、等级系统、奥运 |
| 2 | 身体素质 | `physical` | 20 | 指力训练、核心、柔韧性、耐力、爆发力 |
| 3 | 攀爬技术 | `technique` | 37 | 脚法、手法、身体定位、动态、裂缝、读线 |
| 4 | 心理与策略 | `mental` | 11 | 恐惧管理、心流、项目攀登 |
| 5 | 装备知识 | `gear` | 19 | 攀岩鞋、保护器、传统攀装备 |
| 6 | 安全与风险 | `safety` | 15 | 室内/户外安全、绳索技术、抱石安全 |
| 7 | 伤病预防 | `injury` | 16 | 滑车韧带、肌腱伤、热身、营养 |
| 8 | 户外实践 | `outdoor` | 18 | 室内转户外、运动攀、传统攀、大岩壁 |
| 9 | 特殊人群 | `special` | 13 | 儿童、青少年、中老年、残障攀岩 |
| 10 | 竞技攀岩 | `competition` | 16 | 比赛格式、规则、备赛、IFSC |

---

## ⚠️ 注意事项

1. **ID 一致性**：`segments[].kpId` 必须严格匹配 `kp-registry.json` 中的 `id` 字段。拼写错误会导致无法关联。

2. **时间戳精度**：精确到秒即可。如果无法精确判断，可以填 `null`，后续再补充。宁可填 `null` 也不要填错误的时间。

3. **不要重复添加**：添加视频前先检查 `video-registry.json` 中是否已有相同 `id` 的视频。

4. **建议新增知识点**：如果你在视频中发现了重要的攀岩概念/技术，但 `kp-registry.json` 中没有对应的知识点，请在 video-registry.json 的视频条目中加一个 `"suggestedNewKPs"` 字段记录。

5. **双语要求**：`title` 和 `note` 字段必须同时包含 `zh` 和 `en`。英文视频的中文标题可以意译。

6. **一个视频通常匹配多个知识点**：一个 20 分钟的教学视频可能涉及 5-15 个不同的知识点。请尽量全面标注。

7. **优先标注 technique（攀爬技术）模块**：这是知识点最多（37个）也是视频资源最丰富的模块，应该优先完成。

---

## 📊 当前进度

- 知识点总数：177
- 已有视频标注：约 17 个视频（大部分缺少时间戳）
- 目标：每个知识点至少 3 个视频片段

### 优先级排序
1. 🔴 攀爬技术（37 KPs）— 最需要视频支持
2. 🟠 身体素质（20 KPs）— 训练视频丰富
3. 🟡 安全与风险（15 KPs）— 安全教学很重要
4. 🟢 装备知识（19 KPs）— 装备评测视频多
5. 🔵 其他模块 — 逐步补充

---

## 💡 搜索技巧

### YouTube 字幕获取
- 许多攀岩教学视频有英文自动字幕
- 搜索时加 `CC` 或 `subtitles` 可以找到有字幕的视频
- YouTube API 可以批量获取字幕文本

### 高效搜索关键词
```
# 英文搜索
"climbing technique tutorial [TECHNIQUE_NAME]"
"how to [TECHNIQUE_NAME] climbing"
"[CHANNEL_NAME] [TECHNIQUE_NAME]"

# 中文搜索（Bilibili）
"攀岩教学 [技术名称]"
"攀岩技巧 [技术名称]"
"[频道名] 攀岩"
```

### 判断视频质量的标准
- ✅ 有清晰的动作演示（不只是讲解）
- ✅ 教学结构化（分段讲解不同技术）
- ✅ 来自知名攀岩教练/运动员
- ✅ 播放量 > 10K
- ❌ 纯 Vlog 无教学内容
- ❌ 商业广告性质

---

*最后更新：2026-03-01*
*知识库版本：177 个知识点*
