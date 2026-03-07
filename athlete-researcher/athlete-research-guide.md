# 攀岩运动员资料搜集指南 / Athlete Profile Research Guide

> **目标 / Goal**：系统性地在全球范围内搜集攀岩运动员的结构化资料，包括生平、战绩、训练方法、采访内容和代表性视频，输出可直接入库的运动员档案数据。
>
> **范围 / Scope**：本指南仅覆盖「搜索 → 记录 → 结构化输出」阶段。内容的翻译、校验、前端展示不在本指南范围内。
>
> **所属支柱**：支柱三 — 攀岩名人。框架文件见 `team-lead/athlete-framework.md`。

---

## 一、项目背景 / Project Context

### 1.1 三支柱架构

本项目的内容分为三个独立支柱：

| 支柱 | 定位 | 你的角色 |
|------|------|---------|
| 支柱一：知识库 | 概念、原理、技术（177 KP，已完成） | — |
| 支柱二：训练手册 | 可直接执行的训练方案 | — |
| **支柱三：攀岩名人** | 运动员生平、训练理念、采访 | **← 你负责搜集内容** |

### 1.2 攀岩名人和知识库的区别

> **知道或不知道某个运动员的存在，不会直接影响你的攀爬表现。**

因此，运动员档案不属于知识库。它的独立价值在于：
- 呈现攀岩运动的历史演进（谁推动了这项运动？）
- 提供训练理念的具象化参考（顶级选手怎么练的？）
- 展现运动的人文面貌（故事、采访、语录）
- 激发用户对攀岩的热情和认同感

### 1.3 你的任务

```
确定运动员名单 → 搜索资料 → 按结构化清单填写 → 输出 JSON
```

**你只负责搜集和结构化，不需要做内容翻译或前端集成。**

---

## 二、运动员名单 / Athlete Roster

### 2.1 分类体系

```
支柱三：攀岩名人
├── 12.1 历史传奇（Historical Legends）    ath-001 ~ ath-099
├── 12.2 当代精英（Contemporary Elite）    ath-101 ~ ath-199
└── 12.3 中国运动员（Chinese Athletes）    ath-201 ~ ath-299
```

### 2.2 第一批必须搜集的运动员（核心名单）

> 以下名单是最低要求。搜索过程中如果发现值得收录的运动员，请在报告中建议补充。

#### 12.1 历史传奇（按年代排序）

| 序号 | 姓名 | ID | 国籍 | 标签 | 搜索优先级 |
|------|------|-----|------|------|-----------|
| 1 | John Gill | ath-001 | 美国 | 现代抱石之父 | ⭐⭐⭐ |
| 2 | Royal Robbins | ath-002 | 美国 | Yosemite 攀岩先驱 | ⭐⭐ |
| 3 | Reinhold Messner | ath-003 | 意大利 | 14 座 8000m、自由攀登倡导者 | ⭐⭐ |
| 4 | Patrick Edlinger | ath-004 | 法国 | 攀岩美学先驱、自由攀登偶像 | ⭐⭐ |
| 5 | Wolfgang Güllich | ath-005 | 德国 | Campus Board 发明者、Action Directe | ⭐⭐⭐ |
| 6 | Lynn Hill | ath-006 | 美国 | The Nose 徒手首登 | ⭐⭐⭐ |
| 7 | Jerry Moffatt | ath-007 | 英国 | 80 年代全球最强攀岩者之一 | ⭐⭐ |
| 8 | Ben Moon | ath-008 | 英国 | Moon Board 创始人、技术流代表 | ⭐⭐ |
| 9 | Catherine Destivelle | ath-009 | 法国 | 女性攀岩先驱、独攀高手 | ⭐⭐ |
| 10 | Alexander Huber | ath-010 | 德国 | 速攀 + 自由攀登 | ⭐ |

#### 12.2 当代精英（活跃中或近年退役）

| 序号 | 姓名 | ID | 国籍 | 标签 | 搜索优先级 |
|------|------|-----|------|------|-----------|
| 1 | Adam Ondra | ath-101 | 捷克 | Silence 9c 首登、多届世界冠军 | ⭐⭐⭐ |
| 2 | Janja Garnbret | ath-102 | 斯洛文尼亚 | IFSC 史上最多奖牌、奥运冠军 | ⭐⭐⭐ |
| 3 | Tomoa Narasaki（楢崎智亞） | ath-103 | 日本 | 抱石世界冠军、动态技术标杆 | ⭐⭐⭐ |
| 4 | Akiyo Noguchi（野口啓代） | ath-104 | 日本 | 抱石世界冠军、日本传奇 | ⭐⭐⭐ |
| 5 | Jakob Schubert | ath-105 | 奥地利 | 全能型选手、多届世界冠军 | ⭐⭐ |
| 6 | Alex Megos | ath-106 | 德国 | 首位 onsight 9a 攀岩者 | ⭐⭐ |
| 7 | Stefano Ghisolfi | ath-107 | 意大利 | 难度攀岩顶尖选手 | ⭐⭐ |
| 8 | Alex Honnold | ath-108 | 美国 | Free Solo El Capitan、无保护攀登代表 | ⭐⭐⭐ |
| 9 | Tommy Caldwell | ath-109 | 美国 | Dawn Wall、大岩壁自由攀登 | ⭐⭐ |
| 10 | Ai Mori（森秋彩） | ath-110 | 日本 | 新生代全能型选手 | ⭐⭐ |
| 11 | Brooke Raboutou | ath-111 | 美国 | 青少年世界冠军起家 | ⭐⭐ |
| 12 | Jain Kim（金滋仁） | ath-112 | 韩国 | 先锋攀世界冠军 | ⭐⭐ |
| 13 | Chaehyun Seo（徐彩炫） | ath-113 | 韩国 | 新生代韩国精英 | ⭐⭐ |
| 14 | Miho Nonaka（野中生萌） | ath-114 | 日本 | 抱石世界冠军 | ⭐⭐ |
| 15 | Sascha Lehmann | ath-115 | 瑞士 | 先锋攀新锐 | ⭐ |
| 16 | Sean Bailey | ath-116 | 美国 | 竞技攀岩新生代 | ⭐ |
| 17 | Dave MacLeod | ath-117 | 英国 | 训练哲学 + 伤病恢复专家 | ⭐⭐ |
| 18 | Chris Sharma | ath-118 | 美国 | 深水抱石先驱、难度攀岩传奇 | ⭐⭐ |
| 19 | Ashima Shiraishi | ath-119 | 美国 | 史上最年轻 V15 完攀者 | ⭐⭐ |
| 20 | Daniel Woods | ath-120 | 美国 | 抱石高手 V17 | ⭐ |

#### 12.3 中国运动员

| 序号 | 姓名 | ID | 标签 | 搜索优先级 |
|------|------|-----|------|-----------|
| 1 | 潘愚非 | ath-201 | 中国男子攀岩第一人、奥运选手 | ⭐⭐⭐ |
| 2 | 宋懿龄 | ath-202 | 速度攀岩世界纪录 | ⭐⭐⭐ |
| 3 | 邓丽娟 | ath-203 | 速度攀岩 | ⭐⭐ |
| 4 | 牛迪 | ath-204 | 速度攀岩 | ⭐⭐ |
| 5 | 伍鹏 | ath-205 | 速度攀岩 | ⭐⭐ |
| 6 | 张悦彤 | ath-206 | 全能型新秀 | ⭐⭐ |

> **中国运动员的搜索难度较大**：中文资料分散在微信公众号、微博、体育新闻中，英文资料很少。请在搜索中特别注意中文来源。

---

## 三、每位运动员的结构化搜集清单 / Structured Research Checklist

### 3.1 总体原则

每位运动员需要搜集 **4 个维度** 的信息，对应 4 种卡片类型：

| 维度 | 卡片类型 `type` | 核心问题 | 必填 | 搜索深度 |
|------|----------------|---------|------|---------|
| 生平与成就 | `biography` | 这个人是谁？做过什么？ | ✅ 必填 | 标准搜索 |
| 训练哲学 | `training` | 他/她怎么训练的？理念是什么？ | ✅ 必填 | ⭐ **深度搜索** |
| 标志性风格 | `technique` | 他/她的攀爬风格有什么特点？ | ✅ 必填 | 标准搜索 |
| 采访与名言 | `interview` | 他/她说过什么有价值的话？怎么思考攀岩的？ | ✅ **必填** | ⭐ **深度搜索** |

> **搜索重点说明**：training 和 interview 是本项目最重视的两个维度。运动员的训练方法可以关联到支柱二（训练手册），他们的采访和思考可以帮助我们更深入地理解支柱一（知识库）的知识点。这些内容的价值远超简单的生平罗列。请在这两个维度上投入最多的搜索时间。

### 3.2 维度一：生平与成就（biography）

搜集以下信息：

```
基本信息：
  □ 全名（原文 + 中文 + 英文）
  □ 出生日期
  □ 出生地 / 国籍
  □ 活跃年代（如 "1990s - present"）
  □ 主要攀爬类型（抱石 / 先锋 / 速度 / 传统 / 大岩壁 / 全能）

⭐ 身体数据（尽可能搜集，对理解攀爬风格和训练选择有重要参考价值）：
  □ 身高 (cm)
  □ 体重 (kg)（如有公开数据）
  □ 臂展 (cm)（或臂展/身高比，即 ape index）
  □ 指距 / 手掌大小（如有）
  □ 身体类型标签（如"修长型"、"力量型"、"矮小灵活型"）
  注意：体重数据敏感，仅记录运动员本人公开过的数据，不要推测

里程碑成就（按时间排序）：
  □ 首登纪录（如 Silence 9c by Adam Ondra, 2017）
  □ 比赛头衔（如 World Championship 2018 金牌）
  □ 开创性事件（如 Lynn Hill free climbing The Nose, 1993）
  □ 等级突破（如 first to onsight 9a）

生涯统计（如有）：
  □ 最高完攀等级（抱石 / 先锋分列）
  □ 世界杯 / 世锦赛奖牌数
  □ 奥运会参赛 / 奖牌情况
  □ 首登线路数量（如 Alex Megos 的 onsight 纪录）

人生故事亮点（1-3 个）：
  □ 定义其职业生涯的关键时刻或故事
  □ 克服困难的经历（如 Tommy Caldwell 失去手指后的回归）
  □ 对攀岩运动的影响
```

### 3.3 维度二：训练哲学（training）⭐ 重点搜索维度

> **这是本项目最重视的搜索维度之一。** 运动员的训练方法是支柱二（训练手册）的重要内容来源。请在此维度投入大量搜索时间，尽可能穷尽所有公开的训练信息。

搜集以下信息：

```
训练方法论（尽可能详细）：
  □ 核心训练理念（如 Adam Ondra 的"高密度训练"、Güllich 的"系统化力量训练"）
  □ 典型训练周安排（如有具体信息 — 周一做什么、周二做什么）
  □ 典型训练日安排（如有具体信息 — 早上做什么、下午做什么）
  □ 特色训练方法（如 Güllich 发明 campus board）
  □ 训练装备偏好（如 Moon Board、特定指力板、system wall）
  □ 指力训练方法（用什么指力板、什么握姿、什么方案）
  □ 耐力训练方法
  □ 爆发力训练方法
  □ 辅助训练（核心、柔韧性、拮抗肌、交叉训练）
  □ 热身 / 冷却方案
  □ 恢复方法（冰浴、拉伸、营养方案等）
  □ 训练计划的周期化（赛季 vs 非赛季的差异）
  □ 受伤后的恢复训练经历（如有）

训练数据（如有公开，尽可能收集具体数字）：
  □ 日训练时长
  □ 周训练频率
  □ 体能基准数据（如 max hang 数据、引体向上 max、前水平保持时间等）
  □ 攀爬量数据（每天爬多少条路线/问题）
  □ 体能测试数据（如 Lattice 公布的基准数据）
  □ 训练阶段划分

训练理念语录（不限数量，有多少记多少）：
  □ 关于训练的代表性发言
  □ 关于特定训练方法的看法
  □ 关于训练和攀爬平衡的思考
  □ 来源标注（采访 / 书籍 / 视频时间戳）

训练视频（搜索该运动员的训练实况视频）：
  □ 训练日常 vlog / training session 视频
  □ 具体训练方法演示视频
  □ 赛前训练准备视频
  □ 每个视频标注 URL + 简要说明

与支柱二的关联：
  □ 该运动员的训练方法是否对应某个训练卡（tp-NNN）？
  □ 该运动员是否是某种训练方法的创始人/推广者？
  □ 该运动员的训练方法是否可以直接提取为新的训练卡？
```

### 3.4 维度三：标志性风格（technique）

搜集以下信息：

```
攀爬风格特点：
  □ 技术标签（如"动态为主"、"静态精准"、"全能型"）
  □ 特色动作或技术（如 Ondra 的标志性尖叫和爆发式攀爬）
  □ 身体优势（如 Sharma 的臂展、Janja 的协调性）
  □ 偏好岩石类型或地形（如 Sharma 偏爱石灰岩悬岩）

标志性路线 / 问题（Signature Routes）：
  □ 最具代表性的 3-5 条路线或抱石问题
  □ 每条路线的名称、等级、地点、完成年份
  □ 为什么这条路线重要（首登？长期项目？风格突破？）

技术分析来源：
  □ 有无专业分析其攀爬风格的文章或视频？
  □ 标注具体 URL

与支柱一的关联：
  □ 该运动员的风格特点是否关联某些知识库 KP？
  □ （如 Ondra 的动态风格 → kp-dyno-technique, kp-deadpoint）
```

### 3.5 维度四：采访与名言（interview）⭐ 重点搜索维度

> **这是本项目最重视的搜索维度之一。** 运动员在采访中表达的思考和理念，可以帮助我们更深入地理解知识库中的知识点。例如 Adam Ondra 谈恐惧管理的采访，直接丰富了 kp-恐惧管理 的内容。**请尽可能搜集所有能找到的采访内容，不设数量上限。**

搜集以下信息：

```
采访内容（不限数量，有多少找多少）：
  □ 文字采访（攀岩杂志、新闻网站）
  □ 播客采访（TrainingBeta Podcast、Nugget Climbing Podcast、Power Company 等）
  □ 视频采访（YouTube 长访谈、赛后采访）
  □ 每个采访的来源 URL、媒体名称、日期
  □ 每个采访的核心话题标签（如"训练方法"、"恐惧管理"、"赛前心理"、"伤病恢复"）
  □ 每个采访的 2-3 句核心要点摘要（中文书写）

采访内容分类标注（帮助后续关联知识点）：
  □ 关于训练的采访 → 标注 topic: "training"
  □ 关于心理/恐惧的采访 → 标注 topic: "mental"
  □ 关于技术/风格的采访 → 标注 topic: "technique"
  □ 关于伤病/恢复的采访 → 标注 topic: "injury"
  □ 关于比赛/竞技的采访 → 标注 topic: "competition"
  □ 关于生涯/人生的采访 → 标注 topic: "career"
  □ 关于装备/器材的采访 → 标注 topic: "gear"

代表性语录（不限数量，有价值的全部记录）：
  □ 原文引用（保留原语言）
  □ 中文翻译
  □ 出处标注
  □ 话题标签（这条语录在谈什么？）

与支柱一的关联（关键）：
  □ 这个采访的内容是否可以帮助理解某个知识点？
  □ 标注 relatedKps（如 Ondra 谈恐惧 → kp-fear-management）
  □ 这些关联后续会用于丰富知识点页面的内容

精彩视频（不限数量）：
  □ 训练视频（公开的训练实况）
  □ 比赛精彩瞬间
  □ 纪录片 / 专题片
  □ 项目攀登纪录（如 Silence, The Dawn Wall）
  □ 每个视频的 URL、平台、标题、时长
  □ 简短说明（1 句话：这个视频展示了什么）

播客出演（搜索运动员上过的播客节目）：
  □ TrainingBeta Podcast
  □ Nugget Climbing Podcast
  □ The Climbing Nomads
  □ Power Company Climbing Podcast
  □ Enormocast
  □ 其他攀岩播客
  □ 每个播客的 URL、期数、日期、核心话题

书籍 / 自传（如有）：
  □ 书名、出版年份、出版社
  □ 核心内容概述（2-3 句话）
  □ 哪些章节与训练/技术/心理有关
```

---

## 四、搜索策略 / Search Strategy

### 4.1 信息来源优先级

**第一梯队 — 官方与权威来源**

| 来源 | 类型 | 擅长领域 | URL |
|------|------|---------|-----|
| **IFSC 官网** | 比赛数据 | 竞赛战绩、运动员档案 | ifsc-climbing.org |
| **8a.nu** | 攀岩数据库 | 完攀记录、排名 | 8a.nu |
| **Wikipedia** | 百科 | 生平、成就概述 | wikipedia.org |
| **运动员个人网站/社媒** | 一手信息 | 训练、采访、最新动态 | 各运动员 Instagram / 个人站 |

**第二梯队 — 攀岩专业媒体**

| 来源 | 语言 | 擅长 |
|------|------|------|
| Climbing Magazine | EN | 深度人物专题 |
| Rock and Ice | EN | 人物访谈 |
| UKClimbing | EN | 英国视角的运动员报道 |
| PlanetMountain | EN/IT | 欧洲运动员深度报道 |
| Gripped | EN | 加拿大视角 |
| 岩点 (YanDian) | ZH | 中国运动员报道 |
| 中国登山协会网站 | ZH | 中国队官方信息 |

**第三梯队 — 视频平台**

| 来源 | 说明 |
|------|------|
| YouTube | 运动员频道（Adam Ondra, Magnus Midtbø 等）、采访、纪录片 |
| Bilibili | 中文翻译/搬运视频、中国运动员视频 |
| Vimeo | 攀岩纪录片 |
| Red Bull TV | 赞助运动员的专题内容 |

**第四梯队 — 书籍**

| 书名 | 涉及运动员 |
|------|-----------|
| *Revelations* | Jerry Moffatt 自传 |
| *The Rock Warrior's Way* | 训练心理（多位运动员） |
| *Alone on the Wall* | Alex Honnold 自传 |
| *The Push* | Tommy Caldwell 自传 |
| *Valley Uprising* (纪录片) | Yosemite 历史人物 |
| *Silence* (纪录片) | Adam Ondra |
| *The Dawn Wall* (纪录片) | Tommy Caldwell & Kevin Jorgeson |

**第五梯队 — 多语言来源（重要补充）**

| 来源 | 语言 | 说明 |
|------|------|------|
| 日本攀岩媒体 | JA | 日本选手资料（楢崎智亞、野口啓代、森秋彩） |
| 韩国攀岩媒体 | KO | 韩国选手资料（金滋仁、徐彩炫） |
| 法语攀岩媒体 | FR | 法国历史人物（Edlinger、Destivelle） |
| 德语攀岩媒体 | DE | 德国/奥地利选手（Güllich、Huber、Schubert） |
| 意大利攀岩媒体 | IT | 意大利选手（Ghisolfi） |
| 斯洛文尼亚媒体 | SL | Janja Garnbret 母国报道 |

**日文搜索关键词：**
```
"楢崎智亞 トレーニング" (Narasaki training)
"野口啓代 インタビュー" (Noguchi interview)
"森秋彩 クライミング" (Mori climbing)
"ボルダリング 日本代表 選手" (bouldering Japan national team)
"クライミング 選手 トレーニング方法" (climbing athlete training method)
```

**韩文搜索关键词：**
```
"김자인 클라이밍 인터뷰" (Jain Kim climbing interview)
"서채현 훈련" (Chaehyun Seo training)
"한국 클라이밍 국가대표" (Korean national climbing team)
```

**中文搜索关键词：**
```
"潘愚非 训练方法"
"宋懿龄 速度攀岩"
"中国攀岩队 采访"
"攀岩 国家队 选手介绍"
site:weixin.qq.com 攀岩 运动员
```

### 4.2 每位运动员的搜索流程

```
for each athlete in roster:
    Step 1: Wikipedia / IFSC 基础信息
        → 填写 biography 的基本信息和生涯统计

    Step 2: 8a.nu 完攀记录
        → 填写最高等级、标志性路线

    Step 3: Google 搜索 "{name} climbing interview"
        → 找到 2-5 篇最佳采访

    Step 4: Google 搜索 "{name} climbing training method"
        → 填写训练哲学

    Step 5: YouTube 搜索 "{name} climbing"
        → 找到 3-5 个精彩视频

    Step 6: 母语来源搜索（如日本选手搜日文）
        → 补充本地媒体的独家内容

    Step 7: 交叉验证
        → 核实关键数据（等级、年份、奖牌）的准确性

    Step 8: 按模板填写 4 张卡片
end
```

### 4.3 语言策略

| 语言 | 适用场景 |
|------|---------|
| 英文 | 所有运动员的基础搜索语言 |
| 中文 | 中国运动员的主要搜索语言 + 全球运动员的 Bilibili 视频 |
| 日文 | 日本运动员（楢崎、野口、森秋彩、野中） |
| 韩文 | 韩国运动员（金滋仁、徐彩炫） |
| 法文 | 法国历史人物（Edlinger、Destivelle） |
| 德文 | 德国/奥地利选手（Güllich、Huber、Schubert） |

### 4.4 使用 /fetch 技能读取页面内容

当你通过搜索找到运动员的采访页面、训练报道、官方档案或百科页面，需要读取**完整内容**时，使用 `/fetch` 技能将网页转换为干净的 Markdown 文本，便于提取结构化信息。

**调用方式：**

```
/fetch https://www.climbing.com/people/adam-ondra-interview-2019
```

**内部降级策略（自动按顺序尝试，无需手动干预）：**

| 优先级 | 方法 | 说明 |
|--------|------|------|
| 1 | `markdown.new/{url}` | Cloudflare 渲染器，首选 |
| 2 | `defuddle.md/{url}` | 备用渲染器 |
| 3 | `r.jina.ai/{url}` | Jina AI 阅读器 |
| 4 | Scrapling | 均失败时提示用本地爬虫 |

**典型使用场景：**

| 场景 | 示例 |
|------|------|
| 读取完整的运动员采访文章 | Climbing Magazine、Rock and Ice 采访页 |
| 从 IFSC 官网提取完整战绩数据 | 运动员 IFSC 档案页 |
| 读取 Wikipedia 完整条目 | 运动员 Wikipedia 页面 |
| 读取 8a.nu 的完攀纪录 | 运动员 8a.nu 主页 |
| 读取母语来源原文（日/韩/德/法） | 楢崎智亞的日文采访、Güllich 的德文报道 |
| 读取运动员个人网站/博客文章 | 运动员本人发布的训练日志 |

**标准工作流（以采访搜索为例）：**

```
1. 用 WebSearch 搜索 "Adam Ondra Climbing Magazine interview 2020"
2. 获得采访 URL 列表
3. 用 /fetch 读取最相关的页面，获得完整采访全文
4. 从全文中提取 keyInterviews.keyTakeaway、quotes 字段内容
5. 记录 topics 标签和 relatedKps 关联
6. 按 §5.1 的 Interview 卡模板填写
```

**配合 §4.2 搜索流程使用：**

- **Step 3（Google 搜索采访）** → 得到 URL → 用 `/fetch` 读取完整采访内容
- **Step 4（Google 搜索训练方法）** → 得到文章 URL → 用 `/fetch` 读取完整训练描述
- **Step 5（YouTube 搜索）** → YouTube 视频本身无法用 `/fetch` 读取，仅记录 URL 和标题

> **提示**：如果某个页面 `/fetch` 失败（返回登录墙或空内容），在对应卡片的 `sources` 中保留 URL，并在批次报告的"搜索盲区"中注明。某些付费杂志的采访内容可能无法抓取，属正常情况。

---

## 五、输出格式 / Output Format

### 5.1 单位运动员的 JSON 输出

每位运动员输出 **3-4 张卡片**，每张卡片一个 JSON 对象：

#### Biography 卡示例

```json
{
  "id": "ath-101-biography",
  "type": "biography",
  "athleteId": "ath-101",
  "athleteName": {
    "zh": "亚当·翁德拉",
    "en": "Adam Ondra",
    "original": "Adam Ondra"
  },
  "category": "contemporary",
  "nationality": "Czech Republic",
  "birthDate": "1993-02-05",
  "birthPlace": "Brno, Czech Republic",
  "activeYears": "2005 - present",
  "climbingDisciplines": ["lead", "bouldering"],
  "physicalData": {
    "height": "186 cm",
    "weight": "70 kg",
    "armSpan": "190 cm",
    "apeIndex": "+4 cm",
    "bodyType": "tall-lean",
    "notes": "体重为运动员本人公开数据"
  },
  "title": {
    "zh": "亚当·翁德拉：攀岩等级的定义者",
    "en": "Adam Ondra: The Grade Definer"
  },
  "summary": {
    "zh": "...",
    "en": "..."
  },
  "milestones": [
    {
      "year": 2012,
      "event": "首登 Change (9b+/5.15c)，当时世界最难路线",
      "significance": "等级突破"
    },
    {
      "year": 2017,
      "event": "首登 Silence (9c/5.15d)，人类首条 9c",
      "significance": "历史性首登"
    },
    {
      "year": 2021,
      "event": "东京奥运会参赛",
      "significance": "奥运会"
    }
  ],
  "careerStats": {
    "highestBoulder": "V16 (8C+)",
    "highestLead": "9c (5.15d)",
    "worldChampionships": "2x Lead Champion (2014, 2019)",
    "olympicResults": "Tokyo 2020: 6th Combined"
  },
  "storyHighlights": [
    "13 岁成为最年轻的 8c 完攀者",
    "Silence 项目历时 4 年，推动人类攀岩等级极限"
  ],
  "relatedKps": [],
  "relatedTraining": [],
  "sources": [
    {
      "type": "website",
      "title": "Adam Ondra - IFSC Profile",
      "url": "https://www.ifsc-climbing.org/...",
      "language": "en"
    },
    {
      "type": "article",
      "title": "Adam Ondra sends Silence 9c",
      "url": "https://...",
      "language": "en"
    }
  ]
}
```

#### Training 卡示例

```json
{
  "id": "ath-101-training",
  "type": "training",
  "athleteId": "ath-101",
  "athleteName": {
    "zh": "亚当·翁德拉",
    "en": "Adam Ondra"
  },
  "category": "contemporary",
  "title": {
    "zh": "亚当·翁德拉的训练体系",
    "en": "Adam Ondra's Training System"
  },
  "trainingPhilosophy": {
    "zh": "翁德拉以高密度、高频率的训练著称。他的核心理念是...",
    "en": "Ondra is known for his high-density, high-frequency training. His core philosophy..."
  },
  "typicalWeek": {
    "zh": "每周训练 6 天，每天 4-6 小时...",
    "en": "Trains 6 days per week, 4-6 hours per day..."
  },
  "signatureMethods": [
    {
      "method": "高密度抱石训练",
      "description": "在短时间内集中完成大量高难度抱石尝试"
    }
  ],
  "trainingQuotes": [
    {
      "quote": "...",
      "quoteOriginal": "...",
      "source": "Climbing Magazine interview, 2019"
    }
  ],
  "relatedKps": ["kp-0203", "kp-0205"],
  "relatedTraining": [],
  "sources": []
}
```

#### Technique 卡示例

```json
{
  "id": "ath-101-technique",
  "type": "technique",
  "athleteId": "ath-101",
  "athleteName": {
    "zh": "亚当·翁德拉",
    "en": "Adam Ondra"
  },
  "category": "contemporary",
  "title": {
    "zh": "亚当·翁德拉的攀爬风格解析",
    "en": "Adam Ondra's Climbing Style Analysis"
  },
  "styleDescription": {
    "zh": "翁德拉的攀爬风格以爆发性和精准的路线阅读著称...",
    "en": "Ondra's climbing style is characterized by explosive power and precise route reading..."
  },
  "styleTags": ["explosive", "route-reading", "versatile"],
  "physicalAdvantages": "身高 186cm，臂展与身高比 1:1.02",
  "signatureRoutes": [
    {
      "name": "Silence",
      "grade": "9c (5.15d)",
      "location": "Flatanger, Norway",
      "year": 2017,
      "significance": "人类首条 9c，定义了当时攀岩难度的天花板"
    },
    {
      "name": "Change",
      "grade": "9b+ (5.15c)",
      "location": "Flatanger, Norway",
      "year": 2012,
      "significance": "首登当时世界最难路线"
    }
  ],
  "relatedKps": ["kp-0316", "kp-0304"],
  "sources": []
}
```

#### Interview 卡示例

```json
{
  "id": "ath-101-interview",
  "type": "interview",
  "athleteId": "ath-101",
  "athleteName": {
    "zh": "亚当·翁德拉",
    "en": "Adam Ondra"
  },
  "category": "contemporary",
  "title": {
    "zh": "亚当·翁德拉：采访精选与名言",
    "en": "Adam Ondra: Selected Interviews & Quotes"
  },
  "keyInterviews": [
    {
      "title": "...",
      "media": "Climbing Magazine",
      "type": "article",
      "date": "2019-06",
      "url": "https://...",
      "language": "en",
      "topics": ["mental", "projecting"],
      "keyTakeaway": "讨论了 Silence 项目的心理挑战...",
      "relatedKps": ["kp-0401", "kp-0413"]
    }
  ],
  "podcasts": [
    {
      "show": "TrainingBeta Podcast",
      "episode": "Episode 145",
      "date": "2020-03",
      "url": "https://...",
      "duration": "1:15:00",
      "topics": ["training", "periodization"],
      "keyTakeaway": "详细讨论了赛季周期化训练安排...",
      "relatedKps": ["kp-0403"]
    }
  ],
  "quotes": [
    {
      "quoteOriginal": "...",
      "quoteZh": "...",
      "source": "...",
      "topic": "training",
      "relatedKps": []
    }
  ],
  "featuredVideos": [
    {
      "title": "Adam Ondra: Silence 9c",
      "platform": "YouTube",
      "url": "https://...",
      "duration": "18:30",
      "description": "Silence 首登纪录片，展示了完整的项目过程"
    }
  ],
  "books": [
    {
      "title": "...",
      "year": 2020,
      "note": "..."
    }
  ],
  "sources": []
}
```

### 5.2 批次汇总报告

每完成一个分类的搜索，输出汇总报告：

```markdown
## 分类 12.X — [分类名] 搜索报告

### 概览
- 搜索日期：YYYY-MM-DD
- 运动员数量：X 位
- 卡片数量：X 张（biography X + training X + technique X + interview X）
- 搜索语言：EN / ZH / JA / ...

### 运动员完成情况
| ID | 姓名 | biography | training | technique | interview | 状态 |
|----|------|-----------|----------|-----------|-----------|------|
| ath-101 | Adam Ondra | ✅ | ✅ | ✅ | ✅ | 完成 |
| ath-103 | Tomoa Narasaki | ✅ | ⚠️ 信息不足 | ✅ | ❌ 未找到 | 部分 |

### 新发现的运动员建议
| 姓名 | 国籍 | 建议原因 |
|------|------|---------|
| Sorato Anraku (安乐宙斗) | 日本 | 2023 年抱石世界冠军，年仅 16 岁 |

### 搜索盲区
- 日文采访资料覆盖不足，建议下轮补充
- [其他说明]
```

### 5.3 全局汇总

所有运动员搜索完成后，输出完整的 `athlete-registry.json`：

```json
{
  "_meta": {
    "description": "攀岩名人档案注册表 — 支柱三",
    "version": "1.0.0",
    "generatedAt": "2026-03-XX",
    "totalCount": 0,
    "athleteCount": 0
  },
  "athletes": [
    { "...卡片 1..." },
    { "...卡片 2..." }
  ]
}
```

### 5.4 产出文件位置

| 产出 | 位置 |
|------|------|
| 批次报告 | `athlete-researcher/category-12X-report.md` |
| 最终数据 | `rock-climbing-knowledge/src/data/athlete-registry.json` |

---

## 六、工作流程 / Workflow

### Phase 1：按分类逐批搜索

```
搜索顺序：
  1. 12.2 当代精英 — 资料最丰富、用户关注度最高
  2. 12.1 历史传奇 — 资料完整但需要挖掘
  3. 12.3 中国运动员 — 中文搜索为主

每位运动员的搜索流程：
  for each athlete in category:
      1. Wikipedia + IFSC → biography 基础信息
      2. 8a.nu → 完攀记录和排名
      3. Google/YouTube → 采访、训练方法、视频
      4. 母语来源 → 本地独家内容
      5. 交叉验证关键数据
      6. 按模板填写 4 张卡片
      7. 标注 relatedKps 和 relatedTraining
  end
  输出分类报告
  ⏸️ 暂停，等待人工确认
```

> ⚠️ **重要**：每个分类完成后必须暂停，等待人工确认后再继续。

### Phase 2：人工审核

人工审核会关注：
- 数据准确性（等级、年份、奖牌数）
- 运动员选择是否合理
- 是否有遗漏的重要运动员
- relatedKps 映射是否准确

### Phase 3：补充搜索

根据 Phase 1 的报告：
- 对 training 卡信息不足的运动员做专项补充
- 对中国运动员做中文来源深度搜索
- 对日韩运动员做母语来源搜索
- 收录人工审核建议的新运动员

### Phase 4：最终汇总

- 合并所有卡片到 `athlete-registry.json`
- 输出全局统计报告
- 标注需要后续补充的信息空白

---

## 七、质量评估标准 / Quality Criteria

### 7.1 单张卡片的最低要求

| 卡片类型 | 最低要求 |
|---------|---------|
| biography | 基本信息完整 + 至少 3 个里程碑事件 + 至少 1 个来源 |
| training | 至少有训练理念描述 + 1 条训练语录 + 至少 1 个来源 |
| technique | 至少有风格描述 + 2 条标志性路线 + 至少 1 个来源 |
| interview | 至少有 1 篇采访链接 + 2 条语录 + 1 个视频 |

### 7.2 数据准确性要求

- **等级数据**：必须用公认的等级系统（YDS / Font / V-scale），不同来源不一致时取 IFSC/8a.nu 数据
- **年份数据**：必须核实，多个来源交叉验证
- **奖牌数据**：以 IFSC 官网为准
- **引用语录**：必须标注出处，不可虚构

### 7.3 搜索无果时的处理

- 如果某位运动员的 training 信息确实无公开资料 → 在 `researchNotes` 中说明"训练方法未公开"，不要猜测
- 如果某位运动员的 interview 找不到 → 该卡片标记为"无可用资源"，在报告中说明
- **绝不编造信息**

---

## 八、特殊情况处理 / Edge Cases

### 8.1 已去世的运动员
如 Wolfgang Güllich（1960-1992）。处理方式：
- `activeYears`: "1980 - 1992"
- 着重搜集历史资料和后人评价
- 视频资料以纪录片为主

### 8.2 跨界运动员
如 Reinhold Messner（登山 + 攀岩）。处理方式：
- 聚焦其攀岩相关的成就和贡献
- 登山成就简要提及但不深入
- `climbingDisciplines` 标注其攀岩类型

### 8.3 运动员身份兼教练/训练师
如 Dave MacLeod、Eric Hörst。处理方式：
- biography 中同时记录运动员身份和教练身份
- training 卡重点写其公开的训练理论
- 可在 `relatedTraining` 中关联其设计的训练方案

### 8.4 信息极度匮乏的运动员（特别是中国运动员）
处理方式：
- biography 卡尽可能从官方体育新闻中提取
- 其他卡片如果无法填写，暂不生成，在报告中标注
- 建议关注微信公众号、微博等中文平台

---

## 九、快速启动清单 / Quick Start Checklist

```
□ 1. 阅读 team-lead/athlete-framework.md 了解名人档案的定位
□ 2. 确认你能访问 kp-registry.json（用于填 relatedKps）
□ 3. 从分类 12.2 当代精英开始
□ 4. 第一位运动员：Adam Ondra (ath-101)
     - IFSC 官网 → 比赛战绩
     - Wikipedia → 基本信息
     - 8a.nu → 完攀等级纪录
     - YouTube "Adam Ondra interview" → 采访
     - YouTube "Adam Ondra training" → 训练方法
     - 填写 4 张卡片
□ 5. 继续搜索 12.2 中的其他运动员
□ 6. 完成 12.2 后，输出分类报告
□ 7. ⏸️ 暂停等待确认
□ 8. 确认后继续 12.1 历史传奇
□ 9. 最后处理 12.3 中国运动员
□ 10. 全部完成后汇总到 athlete-registry.json
```

---

> **最后提醒**：
> 1. **准确性第一** — 一个错误的年份或等级会损害整个知识库的可信度。不确定的数据标注"待验证"，不要猜。
> 2. **全球视野** — 不要只搜英文来源。日本、韩国、法国、德国的攀岩文化各有特色，母语来源往往有独家内容。
> 3. **故事性** — 好的运动员档案不只是数据堆砌，而是能让用户感受到这个人的特别之处。搜集时注意那些"定义性时刻"。

---

*创建于 2026-03-06*
*对应内容架构版本：三支柱 v1*
