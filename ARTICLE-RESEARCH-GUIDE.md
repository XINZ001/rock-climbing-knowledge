# 攀岩文章搜索指南 / Climbing Article Research Guide

> **目标 / Goal**：系统性地在互联网上搜索与攀岩知识库 177 个知识点相关的高质量文章，为每篇文章建立与知识点的映射关系，输出结构化的文章索引数据。
>
> **范围 / Scope**：本指南仅覆盖"搜索与记录"阶段。文章的内容整合、翻译、嵌入知识库等后续工作不在本指南范围内。

---

## 一、项目背景 / Project Context

### 1.1 知识库现状

| 维度 | 状态 |
|------|------|
| 知识点总数 | 177 个，分布在 10 大板块、49 个子板块 |
| 内容状态 | 全部已完成（双语：中文 + 英文） |
| 插图 | 289 张 AI 生成插图，已嵌入 |
| 视频 | 部分已关联（YouTube / Bilibili） |
| **外部文章引用** | **空白 — 这是本次任务要填补的** |

### 1.2 为什么需要外部文章

1. **深度补充**：知识库内容是综述性质的，外部文章可以提供更深入的专题分析
2. **权威背书**：来自专业媒体和教练的文章增强内容可信度
3. **延伸阅读**：为用户提供"想了解更多"的出口
4. **内容盲区发现**：通过搜索过程发现知识库未覆盖的重要主题

### 1.3 你的任务

```
搜索 → 筛选 → 结构化记录 → 映射到知识点 → 输出 JSON
```

**你只负责找文章和记录，不需要做任何内容整合。**

---

## 二、文章类型定义 / Article Types

搜索时请关注以下 6 种文章类型，按优先级排列：

| 类型 | 代号 | 说明 | 适用板块 | 优先级 |
|------|------|------|----------|--------|
| 教学文章 | `tutorial` | 手把手教授技术、方法的文章 | 技术、安全、户外 | ⭐⭐⭐ |
| 训练指南 | `training` | 系统性训练方案、周期化建议 | 身体素质、心理策略 | ⭐⭐⭐ |
| 装备评测 | `gear-review` | 装备对比、选购建议、使用心得 | 装备知识 | ⭐⭐ |
| 安全案例 | `safety-case` | 事故分析、安全警示、经验教训 | 安全、伤病 | ⭐⭐⭐ |
| 科学研究 | `research` | 运动科学、生物力学、营养学研究 | 身体素质、伤病 | ⭐⭐ |
| 经验分享 | `experience` | 攀岩者的项目经验、旅行见闻 | 户外、竞技、概览 | ⭐ |

### 选择优先级说明

- 优先找 `tutorial` / `training` / `safety-case` — 这三类文章直接帮助用户学习
- `gear-review` 和 `research` 次之 — 有用但时效性较强
- `experience` 最后 — 好的经验分享有价值，但数量很多，需要精选

---

## 三、知识点体系速查 / Knowledge Point Taxonomy

### 3.1 十大板块总览

| # | 板块 | Section | 子板块数 | KP 数 | 文章搜索优先级 |
|---|------|---------|---------|-------|----------------|
| 1 | 攀岩概览 | Overview | 5 | 12 | 低 — 内容已较完整 |
| 2 | 身体素质 | Physical Fitness | 6 | 20 | **高** — 训练类文章丰富 |
| 3 | 攀爬技术 | Climbing Technique | 6 | 37 | **高** — 教学文章最多 |
| 4 | 心理与策略 | Mental Game & Strategy | 4 | 11 | 中 — 专题文章质量高 |
| 5 | 装备知识 | Gear & Equipment | 5 | 19 | 中 — 评测文章多 |
| 6 | 安全与风险管理 | Safety & Risk Management | 4 | 15 | **高** — 安全文章重要 |
| 7 | 伤病预防与恢复 | Injury Prevention & Recovery | 4 | 16 | **高** — 科学文章有价值 |
| 8 | 户外攀岩实践 | Outdoor Climbing | 6 | 18 | 中 — 实践类文章多 |
| 9 | 特殊人群 | Special Populations | 4 | 13 | 低 — 文章较少但很需要 |
| 10 | 竞技攀岩 | Competition Climbing | 5 | 16 | 低 — 规则类文章有限 |

### 3.2 子板块明细

> 每个子板块后标注了 KP 数量和搜索建议。

#### Section 01 — 攀岩概览 / Overview（12 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| history — 攀岩的历史与发展 | 4 | 搜"history of rock climbing"、攀岩发展史 |
| categories — 攀岩的分类 | 2 | 搜"types of climbing explained" |
| grading — 攀岩的等级系统 | 2 | 搜"climbing grade systems comparison" |
| culture — 攀岩文化与社区 | 2 | 搜"climbing ethics"、"climbing community" |
| olympics — 攀岩与奥运会 | 2 | 搜"Olympic climbing format"、"sport climbing Olympics" |

#### Section 02 — 身体素质 / Physical Fitness（20 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| finger-strength — 指力 | 4 | 搜"hangboard training program"、"finger strength climbing" |
| upper-body — 上肢力量 | 3 | 搜"pull-up training climbers"、"shoulder stability climbing" |
| core — 核心力量 | 3 | 搜"core training rock climbing"、"front lever progression" |
| flexibility — 柔韧性与灵活性 | 3 | 搜"hip mobility climbers"、"climbing flexibility routine" |
| endurance — 耐力 | 4 | 搜"ARC training"、"power endurance climbing" |
| power — 爆发力 | 3 | 搜"campus board training"、"dynamic climbing training" |

#### Section 03 — 攀爬技术 / Climbing Technique（37 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| footwork — 脚法 | 7 | 搜"climbing footwork technique"、"heel hook tutorial"、"toe hook technique" |
| handholds — 手法与抓握 | 8 | 搜"crimp technique"、"sloper grip"、"pinch training" |
| body-positioning — 身体定位与重心 | 9 | 搜"flagging technique"、"drop knee climbing"、"twist lock" |
| dynamic — 动态技术 | 6 | 搜"dyno technique"、"deadpoint climbing"、"dynamic movement" |
| terrain — 特殊地形技术 | 5 | 搜"crack climbing technique"、"slab climbing tips"、"roof climbing" |
| route-reading — 路线阅读 | 2 | 搜"route reading skills"、"onsight vs flash vs redpoint" |

#### Section 04 — 心理与策略 / Mental Game & Strategy（11 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| fear — 恐惧管理 | 2 | 搜"climbing fear management"、"fall practice" |
| focus — 专注与心流 | 3 | 搜"flow state climbing"、"mental training climbing" |
| goals — 目标设定与训练规划 | 3 | 搜"climbing periodization"、"training plan climbing" |
| projecting — 项目攀登策略 | 3 | 搜"projecting tips climbing"、"breaking plateau climbing" |

#### Section 05 — 装备知识 / Gear & Equipment（19 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| basic-gear — 基础装备 | 3 | 搜"best climbing shoes"、"chalk types climbing" |
| protection — 保护装备 | 5 | 搜"climbing harness guide"、"dynamic rope vs static"、"belay device comparison" |
| trad-gear — 传统攀保护装备 | 4 | 搜"trad climbing gear guide"、"cam placement tips" |
| bigwall-gear — 大岩壁装备 | 3 | 搜"big wall climbing gear"、"portaledge review" |
| training-gear — 训练装备 | 4 | 搜"hangboard review"、"home climbing wall setup" |

#### Section 06 — 安全与风险管理 / Safety（15 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| indoor — 室内安全 | 3 | 搜"gym climbing safety"、"lead belaying tips" |
| outdoor — 户外安全 | 5 | 搜"outdoor climbing safety checklist"、"climbing accident analysis" |
| rope-skills — 绳索技术 | 4 | 搜"climbing knots guide"、"rappelling safety"、"self-rescue climbing" |
| bouldering-safety — 抱石安全 | 3 | 搜"bouldering safety tips"、"spotting technique" |

#### Section 07 — 伤病预防与恢复 / Injury（16 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| common-injuries — 常见伤病 | 4 | 搜"pulley injury climbing"、"climber's elbow"、"shoulder impingement climbing" |
| prevention — 预防策略 | 4 | 搜"injury prevention climbing"、"antagonist training climbers"、"warm up routine climbing" |
| recovery — 康复 | 4 | 搜"climbing injury rehab"、"return to climbing after injury" |
| nutrition — 营养与恢复 | 4 | 搜"climbing nutrition guide"、"sleep recovery athletes" |

#### Section 08 — 户外攀岩实践 / Outdoor（18 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| transition — 从室内到户外 | 3 | 搜"indoor to outdoor climbing transition"、"first outdoor climbing trip" |
| sport-climbing — 运动攀 | 3 | 搜"sport climbing outdoors tips"、"clipping technique" |
| trad-climbing — 传统攀 | 4 | 搜"trad climbing for beginners"、"multi-pitch climbing guide" |
| bouldering — 户外抱石 | 3 | 搜"outdoor bouldering tips"、"reading boulder problems" |
| big-wall — 大岩壁 | 3 | 搜"big wall climbing guide"、"aid climbing basics" |
| travel — 攀岩旅行 | 2 | 搜"best climbing destinations"、"climbing trip planning" |

#### Section 09 — 特殊人群 / Special Populations（13 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| kids — 儿童攀岩 | 3 | 搜"kids climbing coaching"、"youth climbing development" |
| youth — 青少年攀岩 | 3 | 搜"youth climbing training"、"growth plate climbing injury" |
| elderly — 中老年攀岩 | 4 | 搜"older climbers training"、"climbing over 50" |
| adaptive — 适应性攀岩 | 3 | 搜"adaptive climbing"、"paraclimbing" |

#### Section 10 — 竞技攀岩 / Competition（16 KP）

| 子板块 | KPs | 搜索建议 |
|--------|-----|----------|
| formats — 竞赛形式 | 4 | 搜"climbing competition format"、"Olympic climbing rules" |
| rules — 竞赛规则 | 3 | 搜"IFSC competition rules"、"climbing scoring system" |
| training — 竞赛训练 | 3 | 搜"competition climbing training"、"peaking for climbing comp" |
| psychology — 竞赛心理 | 3 | 搜"competition anxiety climbing"、"mental preparation climbing" |
| organizations — 竞赛组织 | 3 | 搜"IFSC World Cup"、"national climbing federation" |

---

## 四、搜索策略 / Search Strategy

### 4.1 平台优先级

按质量和专业度排序：

**第一梯队 — 攀岩专业媒体（优先）**

| 网站 | 语言 | 擅长领域 | URL |
|------|------|----------|-----|
| Climbing Magazine | EN | 全领域 | climbing.com |
| Rock and Ice | EN | 技术、安全 | rockandice.com |
| UKClimbing (UKC) | EN | 户外、传统攀 | ukclimbing.com |
| TrainingBeta | EN | 训练、身体素质 | trainingbeta.com |
| 8a.nu | EN | 竞技、项目 | 8a.nu |
| Gripped | EN | 加拿大视角 | gripped.com |
| 岩点 (YanDian) | ZH | 中文攀岩 | yandian.com / 公众号 |
| 攀岩在线 | ZH | 中文资讯 | — |

**第二梯队 — 专业博客与训练网站**

| 网站 | 语言 | 擅长领域 |
|------|------|----------|
| Power Company Climbing | EN | 训练方法 |
| Lattice Training Blog | EN | 数据驱动训练 |
| Dave MacLeod Blog | EN | 伤病、训练哲学 |
| Eric Hörst / Training4Climbing | EN | 训练科学 |
| The Climbing Doctor | EN | 伤病预防 |
| Mani the Monkey | EN | 指力训练 |
| Moon Climbing Blog | EN | 训练装备 |

**第三梯队 — 通用平台（补充）**

| 平台 | 用法 |
|------|------|
| REI Expert Advice | 装备选购、户外入门 |
| Mountain Project Forum | 经验分享、路线讨论 |
| Reddit r/climbing、r/climbharder | 社区讨论（仅选精华帖） |
| PubMed / Google Scholar | 运动科学研究（伤病、训练） |

### 4.2 搜索关键词构造方法

每个知识点的搜索词应由三部分组成：

```
[核心关键词] + [领域限定词] + [文章类型词]
```

**示例：**

| 知识点 | 核心关键词 | 领域限定 | 类型词 | 完整搜索词 |
|--------|-----------|---------|--------|-----------|
| kp-hangboard-training | hangboard training | rock climbing | program guide | "hangboard training program rock climbing guide" |
| kp-pulley-injury | pulley injury | climbing finger | prevention rehab | "climbing finger pulley injury prevention rehab" |
| kp-fear-management | fear of falling | rock climbing | mental training | "fear of falling rock climbing mental training" |

**关键词来源：**
- 每个 KP 在 `kp-registry.json` 中都有 `keywords` 数组 — **直接使用**
- 组合 KP 的英文 title + 2-3 个 keywords 作为基础搜索词
- 如果英文搜索结果不够，追加中文关键词搜索

### 4.3 语言策略

| 语言 | 占比目标 | 说明 |
|------|---------|------|
| 英文 | ~80% | 英文攀岩内容生态远大于中文 |
| 中文 | ~20% | 补充中文优质来源（岩点、攀岩在线） |

### 4.4 搜索深度

每个知识点的目标：

| 知识点搜索优先级 | 目标文章数 | 说明 |
|----------------|-----------|------|
| 高优先（技术、训练、安全、伤病） | 2-4 篇 | 尽量找不同角度的文章 |
| 中优先（装备、心理、户外） | 1-2 篇 | 至少找 1 篇高质量文章 |
| 低优先（概览、竞技、特殊人群） | 0-1 篇 | 有好的就收录，没有不强求 |

---

## 五、文章质量评估标准 / Quality Criteria

### 5.1 五维度评分（每项 1-5 分）

| 维度 | 说明 | 1 分 | 3 分 | 5 分 |
|------|------|------|------|------|
| **权威性** (authority) | 作者/来源的专业背景 | 匿名论坛帖 | 攀岩媒体文章 | 知名教练/运动科学家署名 |
| **深度** (depth) | 内容的详细程度 | 泛泛而谈 | 有具体建议和步骤 | 系统性、有数据支撑 |
| **实用性** (practicality) | 对攀岩者的直接帮助 | 纯理论 | 有可执行建议 | 有完整训练计划/操作步骤 |
| **时效性** (recency) | 发布时间和内容是否过时 | 10年以上 | 3-5年内 | 2年内或经典不过时 |
| **独特性** (uniqueness) | 相对知识库现有内容的增量 | 与 KP 内容重复 | 有补充视角 | 有知识库未覆盖的见解 |

### 5.2 最低录入标准

以下条件**全部满足**才能收录：

- [ ] 文章来自可信来源（非内容农场、非 AI 生成垃圾文）
- [ ] 内容与至少 1 个知识点直接相关
- [ ] 权威性 ≥ 2 且 深度 ≥ 2
- [ ] 总分（5维度之和）≥ 12 分
- [ ] 文章仍可访问（链接未失效）

### 5.3 优先收录标准

满足以下任一条件的文章**优先收录**：

- 总分 ≥ 18 分
- 来自第一梯队专业媒体的深度文章
- 知名教练/运动员署名的训练文章
- 包含知识库未覆盖的独特见解
- 有科学研究数据支撑的文章

---

## 六、KP 映射方法 / Knowledge Point Mapping

### 6.1 映射规则

每篇文章必须映射到知识点：

```
1 个主知识点 (primaryKp)  — 必填，文章最核心的主题
0-3 个次知识点 (secondaryKps) — 选填，文章附带涉及的主题
```

### 6.2 映射判断逻辑

按以下优先级判断主知识点：

1. **标题匹配**：文章标题直接对应某个 KP → 该 KP 为主
2. **内容主题匹配**：文章 >50% 内容讨论某个 KP 的主题 → 该 KP 为主
3. **关键词匹配**：文章的核心关键词与 KP 的 `keywords` 高度重叠 → 该 KP 为主

次知识点判断：
- 文章中有段落讨论了其他 KP 的内容
- 文章的训练方法可以应用到多个 KP

### 6.3 跨板块文章处理

如果一篇文章横跨多个 section（例如一篇"如何避免攀岩伤病"的文章同时涉及 section-02 训练、section-06 安全、section-07 伤病）：

- 选择文章**最深入讨论**的那个 KP 作为 primaryKp
- 其他涉及的 KP 放入 secondaryKps
- **不要**为同一篇文章创建多条记录

### 6.4 映射示例

```
文章："How to Train Finger Strength for Climbing — A Complete Guide"
→ primaryKp: "kp-hangboard-training"
→ secondaryKps: ["kp-grip-types", "kp-finger-assessment", "kp-advanced-finger"]

文章："Preventing Pulley Injuries: What Every Climber Should Know"
→ primaryKp: "kp-pulley-injury"
→ secondaryKps: ["kp-warmup", "kp-finger-assessment"]

文章："我的阳朔攀岩之旅"
→ primaryKp: "kp-classic-destinations"
→ secondaryKps: ["kp-rock-types", "kp-trip-planning"]
```

---

## 七、输出格式 / Output Format

### 7.1 单篇文章 JSON 模板

每找到一篇合格文章，请按以下格式记录：

```json
{
  "url": "https://www.trainingbeta.com/hangboard-training-guide/",
  "title": "The Complete Hangboard Training Guide for Climbers",
  "source": "TrainingBeta",
  "author": "Matt Pincus",
  "language": "en",
  "publishDate": "2024-06",
  "articleType": "training",
  "primaryKp": "kp-hangboard-training",
  "secondaryKps": ["kp-grip-types", "kp-finger-assessment"],
  "quality": {
    "authority": 5,
    "depth": 5,
    "practicality": 5,
    "recency": 4,
    "uniqueness": 3,
    "total": 22
  },
  "summary": "系统讲解了 hangboard 训练的基础原理、三种常见训练方案（repeaters、max hangs、minimum edge）的对比，以及 6 周训练计划示例。",
  "keyInsights": [
    "推荐初学者从 half-crimp 开始，避免 full-crimp 训练",
    "提出了根据爬龄选择训练方案的决策树",
    "包含 6 周渐进式训练计划表格"
  ],
  "tags": ["hangboard", "finger-strength", "training-plan", "periodization"]
}
```

### 7.2 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | string | ✅ | 文章完整 URL |
| `title` | string | ✅ | 文章原标题 |
| `source` | string | ✅ | 来源网站名称 |
| `author` | string | 选填 | 作者姓名（如有） |
| `language` | string | ✅ | `"en"` 或 `"zh"` |
| `publishDate` | string | ✅ | 发布日期，格式 `"YYYY-MM"` 或 `"YYYY"`，未知填 `"unknown"` |
| `articleType` | string | ✅ | 6 种类型之一：`tutorial` / `training` / `gear-review` / `safety-case` / `research` / `experience` |
| `primaryKp` | string | ✅ | 主知识点 ID（必须来自 kp-registry） |
| `secondaryKps` | string[] | ✅ | 次知识点 ID 数组（可为空 `[]`） |
| `quality` | object | ✅ | 5 维度评分 + total |
| `summary` | string | ✅ | 1-2 句话概述文章核心内容（用中文写） |
| `keyInsights` | string[] | ✅ | 文章中对知识库最有补充价值的 2-4 个要点（用中文写） |
| `tags` | string[] | ✅ | 3-6 个英文标签，用于后续分类和检索 |

> **注意**：`summary` 和 `keyInsights` 统一用**中文**书写，方便后续人工审核。

### 7.3 批次汇总报告模板

每完成一个 section 的搜索后，输出一份汇总报告：

```markdown
## Section XX — [中文名] 搜索报告

### 概览
- 搜索日期：YYYY-MM-DD
- 涉及子板块：X 个
- 涉及知识点：X 个
- 找到文章：X 篇（录入 X 篇 / 跳过 X 篇）

### 覆盖情况
| 知识点 ID | 知识点名称 | 文章数 | 状态 |
|-----------|-----------|--------|------|
| kp-xxx | ... | 2 | ✅ 已覆盖 |
| kp-yyy | ... | 0 | ❌ 未找到 |

### 未覆盖 KP 说明
- kp-yyy：搜索了"xxx"和"yyy"，未找到符合标准的文章。建议后续用中文关键词补搜。

### 文章列表
[此处放上述 JSON 数组]
```

### 7.4 全局覆盖率统计模板

所有 section 搜索完成后，输出全局统计：

```markdown
## 全局覆盖率报告

| Section | KP 总数 | 已覆盖 | 未覆盖 | 覆盖率 | 文章总数 |
|---------|---------|--------|--------|--------|---------|
| 01 概览 | 12 | 8 | 4 | 67% | 10 |
| ... | ... | ... | ... | ... | ... |
| **合计** | **177** | **XXX** | **XXX** | **XX%** | **XXX** |

### 未覆盖 KP 清单
[列出所有 0 篇文章的 KP]

### 低覆盖 KP 清单
[列出只有 1 篇文章且质量 < 15 分的 KP]
```

---

## 八、工作流程 / Workflow

### Phase 1：按板块逐批搜索

```
for each section in [01, 02, 03, ..., 10]:
    for each subsection in section:
        for each KP in subsection:
            1. 用 KP 的 keywords 构造搜索词
            2. 在第一梯队网站搜索
            3. 如果结果不足，扩展到第二/三梯队
            4. 评估每篇文章质量
            5. 合格文章按模板记录
        end
    end
    输出 Section 搜索报告
    ⏸️ 暂停，等待人工确认
end
```

> ⚠️ **重要**：每个 Section 完成后必须暂停，等待人工确认后再继续下一个 Section。不要一口气搜完所有 Section。

### Phase 2：人工审核

人工审核会关注：
- 文章质量是否达标
- KP 映射是否准确
- 是否有遗漏的重要文章
- 是否需要调整搜索策略

### Phase 3：补充搜索

根据 Phase 1 的覆盖率报告，对以下 KP 进行专项补充搜索：
- 覆盖率为 0 的 KP
- 只有 1 篇且质量 < 15 分的 KP
- 人工审核指出需要更多文章的 KP

补充搜索策略：
- 尝试中文搜索
- 扩大搜索到第三梯队平台
- 用不同关键词组合重新搜索
- 搜索较旧但经典的文章

### Phase 4：最终汇总

- 输出完整的全局覆盖率报告
- 将所有文章 JSON 合并为一个完整的数据文件
- 输出格式：

```json
{
  "_meta": {
    "description": "Article Research Registry",
    "generatedAt": "2026-03-XX",
    "totalArticles": 0,
    "coverage": {
      "totalKps": 177,
      "coveredKps": 0,
      "coverageRate": "0%"
    }
  },
  "articles": [
    { ... },
    { ... }
  ]
}
```

---

## 九、后续应用规划 / Future Applications

> 以下内容仅作说明，帮助你理解文章收集的最终用途。你当前不需要执行这些操作。

### 应用方式 1：延伸阅读 / Further Reading

将文章直接作为"延伸阅读"链接嵌入知识点页面。用户在阅读完知识点后，可以点击外部链接深入学习。

```json
// 未来 KP 数据中可能新增的字段
"furtherReading": [
  { "title": "...", "url": "...", "source": "...", "language": "en" }
]
```

### 应用方式 2：内容深化 / Content Enrichment

基于找到的高质量文章，补充和深化知识点的内容。例如：
- 在 kp-hangboard-training 中加入文章提到的"根据爬龄选择训练方案"的决策逻辑
- 在 kp-pulley-injury 中补充新的康复研究数据

### 应用方式 3：引用体系 / Citation System

为知识库建立正式的引用系统：
```json
// 未来 KP 数据中可能新增的字段
"references": [
  { "id": "ref-001", "citation": "Pincus, M. (2024). The Complete Hangboard Training Guide." }
]
```

### 应用方式 4：覆盖率分析 / Gap Analysis

通过分析哪些 KP 找不到外部文章，可以发现：
- 知识库中可能有"自创概念"需要验证
- 某些主题可能过于小众，需要考虑是否保留
- 某些主题外部内容很丰富，说明知识库的 KP 拆分可能需要调整

---

## 十、快速启动清单 / Quick Start Checklist

立刻开始工作，按以下步骤执行：

```
□ 1. 确认你能访问 kp-registry.json 中的 177 个知识点
□ 2. 从 Section 02（身体素质）开始 — 高优先级且文章丰富
□ 3. 选择第一个子板块：finger-strength（指力，4 个 KP）
□ 4. 对 kp-grip-types 进行搜索：
     - 用关键词："full crimp half crimp open hand climbing technique"
     - 优先在 TrainingBeta、Climbing Magazine 搜索
     - 评估质量，合格则按 JSON 模板记录
□ 5. 继续搜索该子板块的其他 KP
□ 6. 完成 finger-strength 后，继续 upper-body、core...
□ 7. 完成整个 Section 02 后，输出搜索报告
□ 8. ⏸️ 暂停等待确认
□ 9. 确认后继续 Section 03（攀爬技术）
□ 10. 重复直到所有 10 个 Section 完成
```

**推荐搜索顺序（按优先级）**：
1. Section 02 — 身体素质（训练类文章最丰富）
2. Section 03 — 攀爬技术（教学类文章最多）
3. Section 07 — 伤病预防与恢复（科学类文章有价值）
4. Section 06 — 安全与风险管理（安全类文章重要）
5. Section 08 — 户外攀岩实践
6. Section 04 — 心理与策略
7. Section 05 — 装备知识
8. Section 01 — 攀岩概览
9. Section 10 — 竞技攀岩
10. Section 09 — 特殊人群

---

> **最后提醒**：质量重于数量。10 篇高质量文章比 50 篇平庸文章更有价值。如果搜索某个 KP 时找不到好文章，直接跳过并在报告中注明，不要降低标准收录低质量内容。
