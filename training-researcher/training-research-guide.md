# 攀岩训练方案搜集指南 / Training Protocol Research Guide

> **目标 / Goal**：**穷尽式**地在全球范围内搜集所有能找到的攀岩训练方案，将每个方案按统一模板结构化记录，最终输出**可审阅、可合并、可入库**的训练卡草案数据。**搜索数量不设上限，能找到多少就找多少。**
>
> **范围 / Scope**：本指南仅覆盖「搜索 → 记录 → 结构化输出」阶段。你需要把来源内容归一化为统一字段格式（含必要的中英文字段），但**不负责**前端集成、最终入库和上线校验。
>
> **所属支柱**：支柱二 — 训练手册。框架文件见 `team-lead/training-framework.md`。

---

## 一、项目背景 / Project Context

### 1.1 三支柱架构

本项目的内容分为三个独立支柱：

| 支柱 | 定位 | 你的角色 |
|------|------|---------|
| 支柱一：知识库 | 概念、原理、技术（177 KP，已完成） | — |
| **支柱二：训练手册** | 可直接执行的训练方案（训练卡） | **← 你负责搜集内容** |
| 支柱三：攀岩名人 | 运动员生平、训练理念 | — |

### 1.2 训练手册和知识库的区别

> **如果一个条目可以直接拿来当「今天的训练菜单」，它属于训练手册。**
> **如果它解释的是原理或概念，它属于知识库。**

| 属于训练手册（你要找的） | 不属于训练手册（不要找的） |
|------------------------|--------------------------|
| 「7s on / 3min off，6 组，20mm 边缘」 | 「指力训练的生理原理」 |
| 「4x4 方案：4 条 V3 路线，每条 4 遍，休息 4 分钟」 | 「什么是无氧耐力」 |
| 「初级 8 周训练计划，每周 3 天」 | 「周期化训练的理论框架」 |

### 1.3 你的任务

```
搜索训练方案 → 评估质量 → 按统一模板填写训练卡 → 输出 JSON
```

**你只负责搜集、提取和结构化归一化，不负责前端集成或最终入库。**

---

## 二、训练方案分类体系 / Protocol Categories

搜索和记录按以下 5 个分类进行，每个分类有对应的 ID 区间：

### 2.1 分类总览

| # | 分类 | ID 起始 | 描述 | 搜索目标 | 搜索优先级 |
|---|------|---------|------|---------|-----------|
| 11.1 | 指力专项 | tp-001 ~ tp-019 | 指力板悬挂、极限边缘等 | **穷尽搜索** | ⭐⭐⭐ |
| 11.2 | 耐力专项 | tp-020 ~ tp-039 | ARC、4x4、power endurance | **穷尽搜索** | ⭐⭐⭐ |
| 11.3 | 爆发力专项 | tp-040 ~ tp-059 | campus board、system wall | **穷尽搜索** | ⭐⭐ |
| 11.4 | 综合训练计划 | tp-060 ~ tp-099 | 多周期完整计划 | **穷尽搜索** | ⭐⭐⭐ |
| 11.5 | 辅助与对抗训练 | tp-100 ~ tp-119 | 拮抗肌、核心、热身 | **穷尽搜索** | ⭐⭐ |

> **搜索原则：不设数量上限。** 每个分类能找到多少方案就找多少。**正式 ID 分配必须遵循 `team-lead/training-framework.md` 的当前预留区间。** 如果某一分类的合格方案数量超出当前 ID 容量，继续搜集，但在研究稿中先用临时 ID（如 `draft-11-01`）标记，并在分类报告中单列“ID 段待扩容”，不要自行改成新的跨分类跳号体系。

### 2.2 各分类搜索目标详情

#### 11.1 指力专项（Finger Strength Protocols）

| 目标训练方案 | 搜索关键词 | 知名出处 |
|------------|-----------|---------|
| Max Hang 最大力量悬挂 | "max hang protocol climbing", "maximum weight hangs" | Eva López, Lattice Training |
| Minimum Edge 极限边缘 | "min edge training climbing", "minimum edge protocol" | Eva López |
| Repeaters 重复悬挂 | "repeater hangboard protocol", "7-3 repeaters" | Anderson Brothers, Eric Hörst |
| One-arm 单臂渐进 | "one arm hang progression climbing" | Lattice Training |
| 负重悬挂 | "weighted hang climbing", "added weight hangboard" | — |
| 辅助悬挂（弹力带） | "assisted hangboard training beginner" | — |
| No-hang 设备训练 | "no hang device training climbing" | — |
| 开放握姿专项 | "open hand crimp training", "half crimp protocol" | — |

#### 11.2 耐力专项（Endurance Protocols）

| 目标训练方案 | 搜索关键词 | 知名出处 |
|------------|-----------|---------|
| ARC Training | "ARC training climbing protocol", "aerobic restoration capillarity" | Anderson Brothers |
| 4x4 方案 | "4x4 climbing training", "power endurance 4x4" | — |
| Linked Boulders | "linked boulder problems endurance" | — |
| Interval 间歇耐力 | "climbing interval training", "on-off climbing circuit" | Lattice Training |
| 长路线耐力管理 | "endurance strategy multi-pitch", "pacing long routes" | Steve Bechtel |

#### 11.3 爆发力专项（Power Protocols）

| 目标训练方案 | 搜索关键词 | 知名出处 |
|------------|-----------|---------|
| Campus Board 经典序列 | "campus board exercises climbing", "1-5-9 campus" | Wolfgang Güllich (originator) |
| Campus Board 触碰训练 | "campus board touches", "campus board bumps" | — |
| System Wall 系统板 | "system wall training climbing", "system board drills" | Ben Moon |
| 负重攀爬 | "weighted climbing training", "weighted bouldering" | — |
| Limit Bouldering | "limit bouldering training", "projecting at max grade" | Steve Bechtel |

#### 11.4 综合训练计划（Full Programs）

| 目标训练方案 | 搜索关键词 | 知名出处 |
|------------|-----------|---------|
| 初级入门计划（0-6 月） | "beginner climbing training plan", "first 6 months climbing" | — |
| 中级突破计划 | "intermediate climbing training program", "plateau breaker" | TrainingBeta |
| 进阶竞技计划 | "advanced climbing training periodization" | Eric Hörst, Lattice |
| 赛季冲刺计划（6-8 周） | "climbing competition peaking plan" | — |
| 非赛季体能积累 | "off season climbing training", "base fitness climbing" | Steve Bechtel |
| 抱石专项计划 | "bouldering specific training plan" | — |
| 先锋攀专项计划 | "lead climbing training plan", "sport climbing periodization" | — |
| 家庭训练计划（无岩墙） | "home climbing training no wall", "lockdown climbing workout" | — |

#### 11.5 辅助与对抗训练（Supplementary & Antagonist）

| 目标训练方案 | 搜索关键词 | 知名出处 |
|------------|-----------|---------|
| 拮抗肌训练套路 | "antagonist training climbers", "push exercises climbing" | Hooper's Beta |
| 核心专项序列 | "core workout climbing", "front lever progression climbing" | — |
| 肩部稳定训练 | "shoulder stability climbing exercises", "shoulder prehab" | The Climbing Doctor |
| 标准热身协议 | "climbing warm up routine", "warm up protocol bouldering" | — |
| 冷却与恢复 | "climbing cool down routine", "recovery protocol climbing" | — |
| 柔韧性训练 | "hip mobility routine climbers", "flexibility program climbing" | — |

---

## 三、搜索策略 / Search Strategy

### 3.1 信息来源优先级

**第一梯队 — 专业训练网站与教练（最高质量）**

| 来源 | 语言 | 擅长领域 | URL / 说明 |
|------|------|---------|-----------|
| **Lattice Training** | EN | 数据驱动训练，系统训练计划 | latticetraining.com/blog |
| **Eric Hörst / Training4Climbing** | EN | 训练科学，指力，心理 | trainingforclimbing.com |
| **Steve Bechtel / Climb Strong** | EN | 力量周期化，简洁方案 | climbstrong.com |
| **Eva López** | EN/ES | 指力训练研究，Max Hang 创始人 | 学术论文 + 博客 |
| **TrainingBeta** | EN | 训练计划播客与文章 | trainingbeta.com |
| **Power Company Climbing** | EN | 项目攀登训练 | powercompanyclimbing.com |
| **Dave MacLeod** | EN | 训练哲学，伤病恢复训练 | davemacleod.com |
| **Hooper's Beta** | EN | 训练方法 + 伤病预防 | YouTube + hoopers-beta.com |

**第二梯队 — 攀岩专业媒体**

| 来源 | 语言 | 说明 |
|------|------|------|
| Climbing Magazine | EN | 训练专题文章 |
| Rock and Ice | EN | 训练方法深度文章 |
| UKClimbing | EN | 英国视角的训练分享 |
| Gripped Magazine | EN | 加拿大训练文章 |
| 岩点 (YanDian) | ZH | 中文攀岩训练内容 |

**第三梯队 — 书籍（权威但需要提炼）**

| 书名 | 作者 | 擅长领域 |
|------|------|---------|
| *The Rock Climber's Training Manual* | Anderson Brothers | ARC、Repeaters、周期化计划 |
| *Training for Climbing (3rd ed.)* | Eric Hörst | 全面训练理论与方案 |
| *Climb Strong: Build Your Base* | Steve Bechtel | 力量基础与周期化 |
| *Performance Rock Climbing* | Dale Goddard & Udo Neumann | 运动科学 + 动作分析 |
| *Make or Break* | Dave MacLeod | 伤病预防导向的训练 |
| *Beastmaking* | Ned Feehally | 指力训练专著 |
| *9 out of 10 Climbers Make the Same Mistakes* | Dave MacLeod | 训练误区与修正 |

**第四梯队 — 全球多语言来源（重要补充）**

| 来源 | 语言 | 说明 |
|------|------|------|
| 日本攀岩训练资料 | JA | 日本竞技攀岩极强（楢崎智亞、野口啓代、森秋彩），有独特的训练方法论 |
| 韩国攀岩训练 | KO | 金滋仁 (Jain Kim)、徐彩炫 (Chaehyun Seo) 等韩国选手体系 |
| 法语/意大利语来源 | FR/IT | 欧洲传统攀岩强国（法国、意大利）的训练文化 |
| 西班牙语来源 | ES | Eva López 的原始研究 |
| Bilibili 训练视频 | ZH | 中文训练内容（原创 + 翻译搬运） |

**日本来源搜索关键词：**
```
"クライミング トレーニング" (climbing training)
"ボルダリング 指力 トレーニング" (bouldering finger strength training)
"フィンガーボード プロトコル" (fingerboard protocol)
"クライミング 持久力 トレーニング" (climbing endurance training)
"キャンパスボード トレーニング方法" (campus board training method)
```

**韩国来源搜索关键词：**
```
"클라이밍 트레이닝" (climbing training)
"볼더링 훈련 프로그램" (bouldering training program)
"핑거보드 훈련" (fingerboard training)
```

### 3.2 搜索关键词构造方法

每个训练方案的搜索词由三部分组成：

```
[训练方法名] + [攀岩领域限定] + [执行细节词]
```

**示例：**

| 目标方案 | 方法名 | 领域限定 | 细节词 | 完整搜索词 |
|---------|--------|---------|--------|-----------|
| Max Hang | max hang | climbing hangboard | protocol sets reps | "max hang climbing hangboard protocol sets reps" |
| 4x4 | 4x4 training | climbing bouldering | power endurance workout | "4x4 climbing bouldering power endurance workout" |
| 初级计划 | beginner training plan | rock climbing | 8 week program schedule | "beginner rock climbing training plan 8 week program" |

### 3.3 语言策略

| 语言 | 占比目标 | 说明 |
|------|---------|------|
| 英文 | ~65% | 全球训练内容生态最大 |
| 中文 | ~15% | 中文原创 + 翻译内容 |
| 日文 | ~10% | 日本训练方法独特且高质量 |
| 其他（韩/法/西/意） | ~10% | 各国特色方法补充 |

> **非英语来源的处理方式**：保留原文来源信息；结构化输出时，把 `title`、`subtitle`、`targetAbility` 统一补齐中英文字段，把原文关键数据（组数、次数、休息时间、边缘尺寸等）准确翻译后录入 `protocol`。不要额外扩写不存在于原文的训练建议。

### 3.4 使用网页抓取工具读取页面内容

当你通过搜索找到一个目标 URL（训练方案文章、教练博客、研究论文等），需要读取其**完整内容**时，使用网页抓取/阅读工具将网页转换为干净的 Markdown 文本，便于提取训练参数。**如果当前环境支持 `/fetch`，优先使用；如果不支持，使用等效的网页转 Markdown 工具即可。**

**调用方式（以 `/fetch` 为例）：**

```
/fetch https://latticetraining.com/blog/max-hang-guide
```

**推荐降级策略（按顺序尝试）：**

| 优先级 | 方法 | 说明 |
|--------|------|------|
| 1 | `markdown.new/{url}` | Cloudflare 渲染器，首选 |
| 2 | `defuddle.md/{url}` | 备用渲染器 |
| 3 | `r.jina.ai/{url}` | Jina AI 阅读器 |
| 4 | Scrapling | 均失败时提示用本地爬虫 |

**典型使用场景：**

| 场景 | 示例 |
|------|------|
| 读取教练博客的完整训练方案文章 | Lattice、Climb Strong、TrainingBeta 博客页 |
| 从文章中提取组数、时长、休息等具体参数 | 任何第一/二梯队来源的训练文章 |
| 搜索结果只显示摘要，需要读取全文 | 任何内容被截断的文章页 |
| 读取非英语原文页面（日/韩/西班牙文） | 日本训练网站、Eva López 西班牙语研究页 |

**标准工作流（搜索 + 精读）：**

```
1. 用 WebSearch 搜索目标训练方案，获得候选 URL 列表
2. 选择最相关的 URL
3. 用网页抓取/阅读工具读取该页面，获得干净的文章全文
4. 从全文中提取 protocol 所需参数（组数、时长、休息、边缘尺寸等）
5. 按 §4.2 模板填写完整训练卡
```

> **提示**：如果某个页面抓取失败（返回登录墙、反爬页或空页面），在 `researchNotes` 中注明“页面无法完整抓取，参数来源为摘要或二手转述”，并降低该来源的可信度权重。

---

## 四、统一训练卡模板 / Training Card Template

### 4.1 核心原则

每一个训练方案都必须套入这个模板。模板的设计目标是：
- **可执行**：用户看完就能直接去练，不需要再查资料
- **可比较**：不同方案之间的字段一致，方便横向比较
- **可追溯**：每个方案标注出处来源

### 4.2 JSON 模板

```json
{
  "id": "tp-001",
  "category": "finger-strength",
  "title": {
    "zh": "Max Hang 最大力量悬挂协议",
    "en": "Max Hang Protocol"
  },
  "subtitle": {
    "zh": "最经典的指力提升方案，适合 V4+ 攀岩者",
    "en": "The classic finger strength protocol for V4+ climbers"
  },
  "difficulty": "intermediate",
  "targetAbility": {
    "zh": "指力（最大握持力）",
    "en": "Finger Strength (Max Grip)"
  },
  "equipment": ["hangboard"],
  "relatedKps": ["kp-hangboard-training", "kp-crimp-hold"],
  "duration": {
    "perSession": "20-30 min",
    "programLength": "4-6 weeks",
    "frequency": "2x per week"
  },
  "protocol": {
    "sets": 6,
    "reps": 1,
    "hangDuration": "10s",
    "rest": "3 min between sets",
    "grip": "half-crimp",
    "edge": "20mm (adjust to ability)",
    "load": "bodyweight + added weight (target: max effort for 10s)",
    "detailedSteps": [
      "1. 热身：5 分钟轻度攀爬 + 渐进悬挂",
      "2. 选择边缘尺寸：能让你全力坚持 10 秒的尺寸",
      "3. 悬挂 10 秒（双臂、half-crimp 握姿）",
      "4. 休息 3 分钟（完全休息，不做其他事）",
      "5. 重复 6 组",
      "6. 如果能轻松完成 10s → 下次加 2-5kg",
      "7. 如果坚持不到 7s → 下次减重或换更大边缘"
    ]
  },
  "progressions": [
    {
      "stage": "入门适应",
      "description": "使用大边缘（25-30mm），无负重，6 组 x 10s"
    },
    {
      "stage": "标准方案",
      "description": "20mm 边缘，逐步加重，6 组 x 10s"
    },
    {
      "stage": "进阶挑战",
      "description": "18mm 或更小边缘，或转为单臂辅助悬挂"
    }
  ],
  "warnings": [
    "未完成热身就开始训练是最常见的受伤原因",
    "Full crimp 握姿在高负重下极易导致 A2 滑轮损伤",
    "建议攀龄 > 1 年的攀岩者才开始此训练",
    "手指有任何疼痛应立即停止"
  ],
  "prerequisites": "建议攀岩等级 ≥ V4 / 5.11a，攀龄 > 1 年",
  "commonMistakes": [
    "组间休息不够（3 分钟是最低要求，不是目标）",
    "追求过小边缘而忽略正确握姿",
    "在攀爬日同时做 max hang（应分开到不同天）"
  ],
  "sources": [
    {
      "type": "article",
      "title": "Eva López Max Hang Protocol Explained",
      "url": "https://...",
      "language": "en"
    },
    {
      "type": "video",
      "title": "Lattice Training: How to Max Hang",
      "url": "https://...",
      "language": "en"
    }
  ],
  "researchNotes": "搜索时发现该方案存在多个版本，当前卡片采用来源最完整、参数最明确的版本；其余变体已记录待审核。"
}
```

### 4.3 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一 ID，格式 `tp-NNN`，按分类区间分配 |
| `category` | enum | ✅ | `finger-strength` / `endurance` / `power` / `full-program` / `supplementary` |
| `title` | object | ✅ | 中英文标题 |
| `subtitle` | object | ✅ | 一句话说明这是什么、适合谁 |
| `difficulty` | enum | ✅ | `beginner` / `intermediate` / `advanced` |
| `targetAbility` | object | ✅ | 训练目标能力（中英文） |
| `equipment` | array | ✅ | 所需装备列表（可为 `["none"]`） |
| `relatedKps` | array | ✅ | 对应知识库 KP（至少 1 个） |
| `duration` | object | ✅ | 单次时长 / 方案总周期 / 每周频率 |
| `protocol` | object | ✅ | 核心执行参数 + `detailedSteps` 分步骤说明 |
| `progressions` | array | ✅ | 渐进阶段（入门 → 标准 → 进阶） |
| `warnings` | array | ✅ | 受伤风险点 |
| `prerequisites` | string | ✅ | 前置条件（等级 / 攀龄 / 身体要求） |
| `commonMistakes` | array | ✅ | 常见执行错误 |
| `sources` | array | ✅ | 来源出处（URL / 书籍 / 视频） |
| `researchNotes` | string | 选填 | 搜索过程中的备注（仅保留在研究稿中，供人工审核参考） |

> **关键要求**：`protocol.detailedSteps` 必须是完整的、可直接照做的步骤说明。用中文书写，包含具体数字。

---

## 五、质量评估标准 / Quality Criteria

### 5.1 训练方案的评估维度

| 维度 | 说明 | 1 分 | 3 分 | 5 分 |
|------|------|------|------|------|
| **来源权威性** | 方案的出处是否专业可信 | 匿名论坛帖 | 攀岩媒体文章 | 知名教练/研究者提出 |
| **可执行性** | 是否包含足够的执行细节 | 只说"多做悬挂" | 有组数和时间 | 完整的逐步指令 |
| **安全性** | 是否有风险提示和适用前提 | 无任何提示 | 有基本提醒 | 有详细安全协议 |
| **验证度** | 是否有用户/研究验证 | 完全理论 | 有教练推荐 | 有研究数据或大量实践验证 |
| **独特性** | 相对其他已收录方案的差异化 | 与已有方案重复 | 有一些变体 | 全新方法或独特视角 |

### 5.2 收录标准

**必须全部满足：**
- [ ] 方案来自可信来源（不是 AI 生成或内容农场）
- [ ] 包含可直接执行的具体参数（组数、时间、休息）
- [ ] 可执行性 ≥ 3 分
- [ ] 总分（5 维度之和）≥ 13 分

**优先收录：**
- 来自第一梯队来源的方案
- 知名教练署名的训练计划
- 有科学研究支撑的方法
- 补充现有空白分类的方案

### 5.3 去重规则（搜集阶段宽松，后期审核合并）

**搜集阶段原则：宁可多收，不可少收。** 后期人工审核会做合并和去重。

搜集阶段的去重仅限于明显的完全重复：
- 如果两个来源描述的是完全相同的方案（名称相同、参数一模一样）→ 合并为 1 张训练卡，`sources` 列出多个来源
- 如果名称相同但差异属于**教练版本差异**或**完整执行逻辑差异**（如 Eva López 版 Max Hang vs Lattice 版 Max Hang）→ **分别建卡**
- 如果名称相同、核心逻辑相同，只是参数表述略有出入或文章摘要不完整 → 先合并为 1 张卡，把差异记入 `researchNotes`
- 如果名称不同但方法类似 → **分别建卡**
- 同一方案的不同难度变体 → 如果来源本身就是一个方案 → 放在同一张卡的 `progressions` 中；如果来源单独讲述的 → 可独立建卡

> **记住**：你的目标是穷尽式搜集。不要在搜集阶段帮用户"减少信息量"。

---

## 六、输出格式 / Output Format

### 6.1 单张训练卡

按 §4.2 的 JSON 模板输出。

### 6.2 批次汇总报告

每完成一个分类的搜索，输出一份汇总报告：

```markdown
## 分类 11.X — [分类名] 搜索报告

### 概览
- 搜索日期：YYYY-MM-DD
- 搜索来源数量：X 个网站/书籍
- 搜索语言：EN / ZH / JA / ...
- 找到方案数：X 个（录入 X 个 / 跳过 X 个 / 合并 X 个）

### 已录入训练卡列表
| ID | 标题 | 难度 | 来源 | 质量总分 |
|----|------|------|------|---------|
| tp-001 | Max Hang Protocol | intermediate | Eva López / Lattice | 22 |
| tp-002 | ... | ... | ... | ... |

### 跳过的方案（含原因）
| 方案 | 来源 | 跳过原因 |
|------|------|---------|
| 某 Reddit 用户的自创方案 | r/climbharder | 无权威背书，可执行性 1 分 |

### 搜索盲区说明
- 日文来源本轮未覆盖，建议下轮补充
- [其他说明]
```

### 6.3 全局汇总

所有分类搜索完成后，输出完整的研究草案汇总文件 `training-registry-draft.json`：

```json
{
  "_meta": {
    "description": "训练手册注册表 — 支柱二",
    "version": "1.0.0",
    "generatedAt": "2026-03-XX",
    "totalCount": 0
  },
  "protocols": [
    { "...训练卡 1..." },
    { "...训练卡 2..." }
  ]
}
```

> **说明**：研究阶段的汇总文件允许保留 `researchNotes` 等审核辅助字段；真正写入前端目录的 `training-registry.json` 应由后续整合环节去掉研究字段后生成。

### 6.4 产出文件位置

| 产出 | 位置 |
|------|------|
| 批次报告 | `training-researcher/category-11X-report.md` |
| 研究草案汇总 | `training-researcher/training-registry-draft.json` |
| 前端最终注册表 | `rock-climbing-knowledge/src/data/training-registry.json`（由后续整合环节生成，不属于本指南执行范围） |

---

## 七、工作流程 / Workflow

### Phase 1：按分类逐批搜索

```
搜索顺序（按优先级）：
  1. 11.1 指力专项 — 最核心、资料最丰富
  2. 11.4 综合训练计划 — 用户需求最大
  3. 11.2 耐力专项 — 重要能力维度
  4. 11.3 爆发力专项
  5. 11.5 辅助与对抗训练

每个分类的搜索流程：
  for each target_protocol in category:
      1. 用目标搜索词搜索第一梯队来源
      2. 不够则扩展到第二/三梯队
      3. 尝试多语言搜索（JA / ZH / KO）
      4. 评估质量，合格则按模板填写训练卡
      5. 注意去重：同一方案合并，不同方案分建
  end
  输出分类报告
  ⏸️ 暂停，等待人工确认
```

> ⚠️ **重要**：每个分类完成后必须暂停，等待人工确认后再继续。不要一口气搜完所有分类。

### Phase 2：人工审核

人工审核会关注：
- 训练卡的可执行性是否足够（能否直接拿去练？）
- `detailedSteps` 是否完整清晰
- 是否有遗漏的重要方案
- 去重判断是否合理

### Phase 3：多语言补充搜索

针对 Phase 1 未充分覆盖的语言进行专项搜索：
- 日文训练资料（日本选手的训练方法）
- 中文原创训练内容（Bilibili / 微信公众号 / 岩点）
- 西班牙语（Eva López 原始研究）
- 韩语训练资料

### Phase 4：最终汇总与交接

- 合并所有训练卡到 `training-researcher/training-registry-draft.json`
- 输出全局统计报告
- 标注需要后续补充的空白领域
- 将研究草案移交给后续整合环节，生成前端使用的 `training-registry.json`

---

## 八、特殊情况处理 / Edge Cases

### 8.1 一个来源包含多个训练方案
很常见（如一篇"Complete Hangboard Guide"包含 Max Hang + Repeater + Min Edge）。处理方式：
- 拆分为独立的训练卡，每卡一个方案
- `sources` 中共享同一来源 URL

### 8.2 综合训练计划的处理
多周期的完整计划（如"12 周训练计划"）可能内含多个子方案。处理方式：
- 整体计划建一张 `full-program` 卡
- 计划中的子方案（如其中的 max hang 部分）如果已独立建卡，则在 `researchNotes` 或分类报告中注明关联关系，等待后续整合时决定是否增加正式字段
- `protocol.detailedSteps` 按周/阶段描述整体流程

### 8.3 方案参数有争议
同一方案不同教练推荐不同参数（如 max hang 的时长有人说 7s、有人说 10s）。处理方式：
- 如果差异反映的是**不同教练体系**或**不同训练目标** → 分别建卡
- 如果差异只是同一体系内的轻微表述差异 → 合并为 1 张卡，在 `researchNotes` 中记录争议点
- 不要擅自“取平均值”生成一个原文中不存在的折中方案
- `progressions` 只用于同一张卡内部的难度递进，不用于混合多个教练体系

### 8.4 非英语来源的翻译
- `title` / `subtitle` / `targetAbility`：翻译为中英文
- `protocol.detailedSteps`：用中文书写
- `warnings` / `commonMistakes`：用中文书写
- `sources`：保留原文标题 + 注明原始语言

---

## 九、快速启动清单 / Quick Start Checklist

```
□ 1. 阅读 team-lead/training-framework.md 了解训练手册的定位
□ 2. 确认你能访问 kp-registry.json 中的知识点列表（用于填 relatedKps）
     - 注意：使用真实 KP ID（如 `kp-hangboard-training`），不要使用占位符或编号猜测
□ 3. 从分类 11.1 指力专项开始
□ 4. 第一个目标方案：Max Hang Protocol
     - 搜索 Lattice Training、Eva López、Eric Hörst 的相关内容
     - 找到具体参数（组数、时长、休息、边缘尺寸）
     - 按 §4.2 模板填写完整训练卡
     - 确保 detailedSteps 可以直接拿去练
□ 5. 继续搜索 11.1 中的其他方案
□ 6. 完成 11.1 后，输出分类报告
□ 6.1 同步更新 `training-researcher/training-registry-draft.json`
□ 7. ⏸️ 暂停等待确认
□ 8. 确认后继续 11.4 综合训练计划
□ 9. 重复直到所有 5 个分类完成
```

---

> **最后提醒**：训练卡的核心价值是**可执行性**。一张好的训练卡 = 用户不需要任何额外搜索，直接照着练。如果你填写 `detailedSteps` 时发现信息不够完整（如"做几组不确定"），不要猜测，在 `researchNotes` 中标注"参数不完整，需补充"，等人工审核时决定。

---

*创建于 2026-03-06*
*对应内容架构版本：三支柱 v1*
