# 攀岩教学视频搜集与知识点匹配指南
# Climbing Tutorial Video Research & Knowledge Point Mapping Guide

> **目标**：系统性地搜集 YouTube 和 Bilibili 上的**攀岩教学视频**，分析其内容，并将每个视频精准匹配到我们知识库的 175 个知识点（kp-ID）。最终产出可直接入库的结构化数据。

---

## 一、项目背景 / Context

### 1.1 我们是什么项目
一个攀岩知识库网站，包含 **10 个大模块 → 52 个子分类 → 175 个知识点**。每个知识点需要配上优质的教学视频，帮助用户通过视频学习攀岩技术。

### 1.2 视频的地域显示逻辑
最终产品会通过检测用户 IP 来决定视频展示策略：

| 用户 IP 所在地 | 显示内容 |
|---------------|---------|
| **中国境内** | **仅显示 Bilibili 视频**（不显示 YouTube） |
| **中国境外** | **显示全部视频**（YouTube + Bilibili） |

因此：
- **YouTube 视频和 Bilibili 视频同等重要**，都需要搜集
- 每个知识点**理想状态**是同时有 YouTube 和 Bilibili 的对应视频
- Bilibili 视频可以是：原创中文教程、YouTube 视频的搬运/翻译版、有中文字幕的版本

### 1.3 已有进度
之前的 AI 已经完成了一部分工作，但存在以下问题：

**已完成的**：
- 识别了 26 个 YouTube 频道/栏目
- 收录了约 19 个单视频（有确切 URL）
- 对 Hooper's Beta 和 Adam Ondra Tips & Tricks 做了栏目拆解
- 建立了数据库 schema（`yt_climbing_knowledge_schema.sql`）

**存在的问题**：
1. ⚠️ **很多条目只有频道链接，没有具体视频 URL** — 像 `https://www.youtube.com/@magmidt` 这种指向频道首页的链接是无法嵌入播放的
2. ⚠️ **混入了大量非教学内容** — 很多著名攀岩博主（如 Magnus Midtbø）的视频大部分是娱乐/Vlog/挑战内容，并非教学
3. ⚠️ **知识点覆盖不均** — 热门领域（指力、手法）视频多，冷门领域（特殊人群、竞技规则）几乎为零
4. ⚠️ **Bilibili 资源严重不足** — 中国用户看不到 YouTube 视频，但 Bilibili 只收录了约 12 个视频

### 1.4 你的任务
**从头重新搜集**，以教学内容质量为第一优先级，覆盖全部 175 个知识点。

---

## 二、核心原则 / Core Principles

### 🎯 原则 1：教学内容优先，名气不重要

```
❌ 错误思路：这是 Adam Ondra 的视频，他很有名，所以应该收录
✓ 正确思路：这个视频是否在教某个攀岩技术？教得好不好？
```

**必须收录的视频类型**：
- 技术教程（如何做某个动作/使用某个装备）
- 训练方法讲解（训练计划、训练原理）
- 伤病预防/康复指导
- 装备使用教学
- 安全操作演示
- 比赛规则讲解

**不要收录的视频类型**：
- ❌ 攀岩 Vlog / 旅行日记（"我去 Yosemite 玩了一天"）
- ❌ 攀岩挑战（"我能不能爬 V15？"）
- ❌ 娱乐内容（"攀岩者 vs 体操运动员"）
- ❌ 产品开箱/评测（除非包含详细使用教学）
- ❌ 纯比赛回放（除非配有技术分析解说）
- ❌ 攀岩纪录片/电影（除非包含可提取的教学片段）
- ❌ 视频时长 < 2 分钟的极短内容（通常信息量不足）
- ❌ 视频时长 > 60 分钟的超长内容（除非是系统性课程）

### 🎯 原则 2：无名但教得好 > 有名但不教

一个只有 5000 订阅的小频道，如果它的视频清晰地讲解了某个攀岩技术，远比一个百万订阅但只发 Vlog 的博主更有价值。

**判断"教得好"的标准**：
1. 是否有清晰的**技术要点讲解**（不只是展示，而是解释为什么）
2. 是否有**视觉演示**（动作分解、慢动作回放、标注说明）
3. 是否有**正误对比**（正确 vs 错误做法）
4. 语言是否**易于理解**（不需要专业背景就能看懂）
5. 视频**制作质量**（画面清晰、剪辑合理、不会中途跑题）

### 🎯 原则 3：每个知识点至少 1 个视频，理想 2-3 个

| 覆盖程度 | 定义 |
|----------|------|
| ⭐⭐⭐ 理想 | 1 个 YouTube 英文教程 + 1 个 Bilibili 中文教程 + 1 个备选 |
| ⭐⭐ 良好 | 1 个 YouTube + 1 个 Bilibili |
| ⭐ 最低 | 至少 1 个任意平台的教学视频 |
| ❌ 不可接受 | 0 个视频 |

### 🎯 原则 4：必须是具体视频 URL，不是频道链接

```
❌ https://www.youtube.com/@LatticeTraining         （这是频道首页，无法嵌入播放）
✓  https://www.youtube.com/watch?v=XXXXXXXXX        （这是具体视频，可以嵌入播放）
❌ https://www.bilibili.com/video/BV1xxxxx/          （确认这个 BV 号真的存在）
```

---

## 三、知识点体系 / Knowledge Point System

### 3.1 两套 ID 系统

我们的知识点有两层 ID：

| 层级 | 格式 | 示例 | 数量 |
|------|------|------|------|
| **子分类** (Sub-section) | `s{模块号}-{主题}` | `s02-finger`, `s03-footwork` | 52 个 |
| **知识点** (Knowledge Point) | `kp-{描述性名称}` | `kp-grip-types`, `kp-hangboard-training` | 175 个 |

**映射关系**：每个 `kp-` 属于某个 `s##-`，每个 `s##-` 属于某个 `section-##`。

### 3.2 完整的 52 个子分类清单

请使用以下子分类作为搜索和分类的框架：

```
Section 1: 攀岩概览
  s01-history     攀岩的历史与发展
  s01-categories  攀岩的分类
  s01-grading     攀岩的等级系统
  s01-culture     攀岩文化与社区
  s01-olympics    攀岩与奥运会

Section 2: 身体素质
  s02-finger      指力
  s02-upper       上肢力量
  s02-core        核心力量
  s02-flexibility 柔韧性与灵活性
  s02-endurance   耐力
  s02-power       爆发力

Section 3: 攀爬技术
  s03-footwork    脚法
  s03-handholds   手法与抓握
  s03-positioning 身体定位与重心
  s03-dynamic     动态技术
  s03-terrain     特殊地形技术
  s03-reading     路线阅读

Section 4: 心理与策略
  s04-fear        恐惧管理
  s04-focus       专注与心流
  s04-goals       目标设定与训练规划
  s04-projecting  项目攀登策略

Section 5: 装备知识
  s05-basic       基础装备
  s05-protection  保护装备
  s05-trad        传统攀装备
  s05-bigwall     大岩壁装备
  s05-training    训练装备

Section 6: 安全与风险管理
  s06-indoor      室内安全
  s06-outdoor     户外安全
  s06-rope        绳索技术
  s06-boulder     抱石安全

Section 7: 伤病预防与恢复
  s07-common      常见伤病
  s07-prevention  预防策略
  s07-recovery    康复
  s07-nutrition   营养与恢复

Section 8: 户外攀岩实践
  s08-transition  室内到户外
  s08-sport       运动攀
  s08-trad        传统攀
  s08-bouldering  抱石
  s08-bigwall     大岩壁
  s08-travel      攀岩旅行

Section 9: 特殊人群
  s09-kids        儿童攀岩
  s09-youth       青少年
  s09-elderly     中老年
  s09-adaptive    残障攀岩

Section 10: 竞技攀岩
  s10-formats     竞技形式
  s10-rules       比赛规则
  s10-training    备赛训练
  s10-psychology  竞技心理
  s10-orgs        IFSC 与各国协会
```

### 3.3 知识点精确匹配

当你找到一个视频后，需要进一步匹配到具体的 `kp-` 级别。

参考 `rock-climbing-knowledge/src/data/kp-registry.json` 获取完整的 175 个 kp-ID 列表。

**匹配规则**：
- 一个视频可以匹配多个 kp，但需要区分 **primary**（主要）/ **secondary**（次要）/ **related**（相关）
- **primary**：视频的核心主题就是这个知识点（如"指力板训练教程" → kp-hangboard-training）
- **secondary**：视频中有相当篇幅涉及（如"指力板训练教程"中讲了热身 → kp-warmup-stretching）
- **related**：视频中简单提到（如"指力板训练教程"中推荐了一本书 → kp-training-log）

---

## 四、搜索策略 / Search Strategy

### 4.1 YouTube 搜索

#### 4.1.1 优先搜索的教学型频道

以下频道**已知产出高质量教学内容**，优先从这些频道中筛选：

| 优先级 | 频道 | 强项领域 | 搜索建议 |
|--------|------|---------|---------|
| ⭐⭐⭐ | **Neil Gresham** | 技术大师课（30+ 教程） | 搜 "Neil Gresham Masterclass" + 具体技术名 |
| ⭐⭐⭐ | **Lattice Training** | 科学训练方法 | 搜频道内 tutorials/training |
| ⭐⭐⭐ | **Hooper's Beta** | 伤病预防、康复、训练 | 搜频道内 injury/rehab/training |
| ⭐⭐⭐ | **The Climbing Doctor** | 攀岩伤病康复（80+ 视频） | 搜频道内 rehab/injury |
| ⭐⭐ | **Adam Ondra** (Tips & Tricks 系列) | 高水平技术讲解 | **只搜 Tips & Tricks 系列**，忽略 Vlog |
| ⭐⭐ | **Movement for Climbers** | 技术进阶 | 搜频道内 technique/footwork |
| ⭐⭐ | **Catalyst Climbing** | 动态技术 | 搜频道内 dynamic/training |
| ⭐⭐ | **Wide Boyz** (Crack School 系列) | 裂缝攀登 | **只搜 Crack School 系列** |
| ⭐⭐ | **Petzl** | 装备使用官方教程 | 搜频道内 tutorial/how-to |
| ⭐⭐ | **VDiff Climbing** | 安全技术、传统攀 | 网站 vdiffclimbing.com |
| ⭐⭐ | **REI** | 入门级安全/装备教学 | 搜 "REI climbing" + 具体技术 |
| ⭐⭐ | **Power Company Climbing** | 项目攀登策略 | 搜频道内 projecting/redpoint |
| ⭐⭐ | **HowNOT2** | 装备安全测试 | 搜频道内 gear test/safety |
| ⭐ | **EpicTV Climbing Daily** | 每日攀岩新闻（部分教学） | 筛选教学类内容 |
| ⭐ | **Rockentry** | 技术教学（正误对比） | 搜频道内 technique |
| ⭐ | **Bouldering Bobat** | 初学者友好 | 搜频道内 beginner/technique |
| ⭐ | **Training For Climbing (Eric Horst)** | 训练理论 | 搜 "Eric Horst" + 具体话题 |

#### 4.1.2 通用搜索关键词

对于上述频道未覆盖的知识点，使用以下搜索策略：

```
搜索模板：
  "{知识点英文名} climbing tutorial"
  "{知识点英文名} climbing technique how to"
  "how to {动作名} rock climbing"
  "{装备名} climbing guide beginner"
  "{伤病名} climbing rehab recovery"
```

**搜索示例**：
| 知识点 | 搜索词 |
|--------|--------|
| kp-edging | "edging technique climbing tutorial" |
| kp-drop-knee | "drop knee climbing technique how to" |
| kp-pulley-injury | "A2 pulley injury climbing rehab" |
| kp-anchor-building | "climbing anchor building tutorial" |
| kp-campus-training | "campus board training climbing" |
| kp-speed-competition | "speed climbing competition rules explained" |
| kp-adaptive-equipment | "adaptive climbing equipment tutorial" |

#### 4.1.3 筛选标准

找到视频后，按以下标准决定是否收录：

```
✅ 收录条件（全部满足）：
  □ 视频主题是攀岩教学/训练/安全
  □ 有具体的技术讲解（不只是展示）
  □ 视频时长在 2-60 分钟之间
  □ 画面清晰，至少 720p
  □ 观看量 > 1,000（除非内容特别稀缺）
  □ 有具体视频 URL（不是频道链接）
  □ 不是 YouTube Shorts

❌ 排除条件（任一即排除）：
  □ 纯 Vlog / 旅行日记
  □ 挑战/娱乐视频
  □ 纯比赛录像（无解说分析）
  □ 开箱/评测（无使用教学）
  □ 画面模糊 / 音质差
  □ 内容过时（2015 年前的装备教学等）
  □ YouTube Shorts（< 60s）
```

### 4.2 Bilibili 搜索

#### 4.2.1 优先搜索的中文频道

| 频道 | 强项领域 |
|------|---------|
| **知岩片语** | 传统攀装备、恐惧管理、装备教学 |
| **岩时攀岩** | 攀岩技术系列 |
| **Jamin_Yan** | 指力板训练（翻译 Hooper's Beta） |
| **未來攀登** | 耐力训练（翻译 Lattice） |
| **艾艾艾小艾** | 室内攀岩入门 |

#### 4.2.2 Bilibili 搜索关键词

```
搜索模板：
  "攀岩 {知识点中文名} 教程"
  "攀岩 {知识点中文名} 教学"
  "攀岩 {技术名} 怎么练"
  "攀岩 {装备名} 使用方法"
  "攀岩 {伤病名} 康复"
  "climbing {英文关键词}"（部分搬运视频用英文标题）
```

#### 4.2.3 特别注意：Bilibili 搬运/翻译视频

Bilibili 上有大量 YouTube 搬运视频（加了中文字幕），这些非常有价值，因为它们让中国用户能看到优质英文教学内容。搜索时可以尝试：

```
"Neil Gresham" site:bilibili.com
"Hooper's Beta" 字幕
"Adam Ondra" 教学 翻译
"Lattice Training" 中文
```

---

## 五、输出格式 / Output Format

### 5.1 主输出文件：`video-research/video-research-results.md`

每个视频一条记录，格式如下：

```markdown
### {序号}. {视频标题}

| 字段 | 值 |
|------|---|
| **视频标题** | {原始标题} |
| **平台** | YouTube / Bilibili |
| **频道/UP主** | {频道名} |
| **视频 URL** | {具体视频链接，不是频道链接} |
| **时长** | {分:秒} |
| **语言** | en / zh / en+zh-sub（英语+中文字幕） |
| **观看量** | {数字} |
| **发布日期** | {YYYY-MM-DD} |
| **可嵌入** | yes / no |
| **Primary KP** | {kp-id-1}, {kp-id-2} |
| **Secondary KP** | {kp-id-3}, {kp-id-4} |
| **内容摘要** | {2-3 句话描述这个视频教了什么} |
| **教学质量评分** | ⭐⭐⭐⭐⭐ (1-5) |
| **评分理由** | {为什么给这个分数} |
```

### 5.2 覆盖率追踪表：`coverage-tracker.md`

同步维护一个覆盖率表：

```markdown
| Sub-section | KP ID | KP 名称 | YouTube | Bilibili | 状态 |
|-------------|-------|---------|---------|----------|------|
| s02-finger | kp-grip-types | 抓握类型 | ✅ 2个 | ✅ 1个 | 完成 |
| s02-finger | kp-hangboard-training | 挂板训练 | ✅ 3个 | ✅ 2个 | 完成 |
| s09-elderly | kp-elderly-flexibility | 柔韧性 | ❌ 0个 | ❌ 0个 | 缺失 |
```

### 5.3 数据库导入格式：CSV

每批完成后，同时输出一个 CSV 文件，可直接导入 SQLite 数据库：

```csv
channel_name,yt_handle,yt_video_id,video_title,video_url,published_at,duration_seconds,view_count,language,relevance_tier,relevance_score,kp_id,kp_name_zh,kp_name_en,match_reason,current_review_status
"Lattice Training","@LatticeTraining","abc123def","How to Train Finger Strength","https://www.youtube.com/watch?v=abc123def","2024-06-15",720,150000,"en","primary",92,"kp-hangboard-training","挂板训练","Hangboard Training","Comprehensive hangboard protocol with progressive overload","auto"
```

---

## 六、工作流程 / Workflow

### Phase 1 — 按子分类搜索（第一轮）

按 52 个子分类，逐个搜索 YouTube 和 Bilibili：

```
对于每个子分类 (s##-xxx)：
  1. 确定搜索关键词（中英文）
  2. YouTube 搜索：
     a. 先搜优先频道内的对应内容
     b. 再做通用关键词搜索
     c. 筛选符合标准的视频
     d. 记录具体视频 URL（不是频道链接！）
  3. Bilibili 搜索：
     a. 搜中文关键词
     b. 搜搬运/翻译视频
     c. 筛选并记录
  4. 为每个视频匹配具体的 kp-ID
  5. 填写完整的输出记录
  6. 更新覆盖率表
```

### Phase 2 — 覆盖率补缺（第二轮）

查看覆盖率表，找出仍然缺失视频的知识点：

```
对于每个缺失的知识点：
  1. 扩大搜索范围（尝试更多关键词组合）
  2. 搜索小众频道（不要只看大 V）
  3. 尝试相关话题搜索（如 "kp-elderly-flexibility" 搜 "yoga for older climbers"）
  4. 如果实在找不到，标记为 "无可用资源" 并说明原因
```

### Phase 3 — 质量审查（第三轮）

对已收录的视频做最终审查：

```
对于每个收录的视频：
  □ 链接是否有效？（实际打开确认）
  □ 内容是否真的匹配标注的知识点？
  □ 是否有更好的替代视频？
  □ 可嵌入状态是否正确？
```

### 处理顺序建议

按照以下优先级处理模块（教学需求高 → 低）：

```
第一批（核心教学）：
  1. Section 3: 攀爬技术（34 个 KP）— 最多技术动作需要视频演示
  2. Section 6: 安全与风险（15 个 KP）— 安全操作必须有视频
  3. Section 2: 身体素质（19 个 KP）— 训练方法需要视频

第二批（重要补充）：
  4. Section 5: 装备知识（19 个 KP）— 装备使用教学
  5. Section 7: 伤病预防（16 个 KP）— 康复动作需要视频
  6. Section 8: 户外攀岩（18 个 KP）— 户外技能

第三批（知识扩展）：
  7. Section 4: 心理与策略（11 个 KP）
  8. Section 1: 攀岩概览（12 个 KP）
  9. Section 10: 竞技攀岩（16 个 KP）
  10. Section 9: 特殊人群（13 个 KP）— 最难找到对应视频
```

---

## 七、视频内容分析方法 / Video Content Analysis

当你找到一个视频后，需要分析其教学内容。以下是分析框架：

### 7.1 快速判断法（30 秒）

1. **看标题和缩略图** — 是否明确是教学内容？
2. **看描述和章节标记** — 是否有结构化的教学大纲？
3. **看时长** — 2-30 分钟最佳
4. **看评论区** — 是否有学习者的正面反馈？

### 7.2 深度分析法（观看视频）

如果快速判断通过，进一步分析：

```
教学要素评估：
  □ 是否有语言讲解？（不是纯背景音乐）
  □ 是否有动作演示？
  □ 是否有慢动作/特写？
  □ 是否有正误对比？
  □ 是否有字幕/文字标注？
  □ 是否有分步骤讲解？
  □ 讲解者的专业水平如何？（教练 > 爱好者）
```

### 7.3 知识点匹配方法

```
Step 1: 看视频标题和描述，初步判断属于哪个子分类 (s##-)
Step 2: 看视频的具体内容，匹配到精确的知识点 (kp-)
Step 3: 判断匹配等级：
  - 视频标题/主题直接匹配 → primary
  - 视频中花了显著时间讲解 → secondary
  - 视频中顺带提到 → related（不需要记录，除非该 KP 缺视频）
```

---

## 八、特殊情况处理 / Edge Cases

### 8.1 系列视频
如果一个频道有一个完整的系列（如 Neil Gresham Masterclass 30+ 集），需要：
- 列出系列中**每一集的具体视频 URL 和对应知识点**
- 不要只写一个系列链接

### 8.2 一个视频涵盖多个知识点
很常见。正确做法：
- 在 Primary KP 填最核心的 1-2 个
- 在 Secondary KP 填次要的
- 不要为了"多匹配"而强行关联

### 8.3 知识点没有对应视频
有些知识点可能很难找到视频（如 kp-adaptive-equipment, kp-growth-plate-concerns），此时：
- 尝试放宽搜索条件（相关话题的通用医学/运动科学视频）
- 如果确实没有，在覆盖率表中标记 "无可用资源"，并建议一个 "最接近的替代"

### 8.4 视频语言问题
- 优先选择有**中文字幕**的英文视频给 Bilibili 侧
- 如果英文视频质量极高但无中文字幕，仍然收录，标注 `language: en`
- Bilibili 上如有搬运/字幕版，同时收录两个版本

### 8.5 视频可能被删除/下架
- 尽量选择**官方频道**的视频（不容易被删）
- 避免选择搬运/盗版账号的视频
- 记录视频发布日期，优先选择近 3 年内的视频

---

## 九、已有资源参考 / Existing Resources Reference

以下文件包含之前搜集的数据，可以作为参考（但需要重新验证和补充）：

| 文件 | 说明 | 用途 |
|------|------|------|
| `video-resources.md` | 按知识模块分类的视频资源汇总 | 参考频道列表和大致分类 |
| `influencer-video-master-table.md` | 按博主×知识点的视频母表 | 参考已有的视频-KP 映射 |
| `famous-climbing-creators-table.md` | 博主盘点和覆盖分析 | 参考频道信息和覆盖情况 |
| `channel-video-research-table.md` | 栏目拆解进度 | 参考 Hooper's Beta 等频道的拆解结果 |
| `data-model/yt_climbing_knowledge_schema.sql` | 数据库 schema | 了解最终数据应入库的结构 |
| `rock-climbing-knowledge/src/data/kp-registry.json` | 175 个知识点的完整注册表 | **精确匹配知识点的权威来源** |
| `rock-climbing-knowledge/src/data/sections.json` | 模块和子分类定义 | 了解分类体系 |

⚠️ **重要**：已有文件中有大量"频道链接"而非"视频链接"的条目，这些需要被替换为具体视频 URL。

---

## 十、质量检查清单 / Final Quality Checklist

每个批次完成后，逐条检查：

### 视频级检查
- [ ] 每条记录都有**具体视频 URL**（不是频道链接）？
- [ ] URL 格式正确？（YouTube: `watch?v=XXX`，Bilibili: `BVxxxxxxxx`）
- [ ] 视频内容确实是**教学/教程**类型？
- [ ] 教学质量评分（1-5 星）是否合理？
- [ ] 内容摘要是否准确描述了视频教学内容？
- [ ] 语言标注是否正确？
- [ ] 时长是否在合理范围内？

### 知识点级检查
- [ ] Primary KP 匹配是否准确？
- [ ] 一个视频的 Primary KP 不超过 3 个？
- [ ] 匹配理由是否清晰？
- [ ] relevance_score 是否合理（primary: 80-100, secondary: 50-79, related: 20-49）？

### 覆盖率检查
- [ ] 175 个知识点中，有多少覆盖率达到 ⭐ 以上？
- [ ] YouTube 和 Bilibili 的覆盖比例如何？
- [ ] 缺失的知识点是否标注了原因？
- [ ] 是否有模块整体缺失的情况？

---

## 十一、附录：kp-ID 快速参考 / Quick Reference

### 容易找到视频的知识点（优先处理）
```
kp-grip-types, kp-hangboard-training, kp-finger-assessment,
kp-pulling-power, kp-core-role, kp-core-training,
kp-edging, kp-smearing, kp-toe-hook, kp-heel-hook,
kp-center-of-gravity, kp-flagging, kp-drop-knee,
kp-dyno-technique, kp-deadpoint,
kp-climbing-shoes, kp-harness, kp-rope, kp-belay-device,
kp-knots, kp-belaying, kp-rappelling,
kp-bouldering-fall, kp-lead-belay-indoor,
kp-pulley-injury, kp-tendonitis, kp-warmup
```

### 难以找到视频的知识点（需要更多搜索创意）
```
kp-growth-plate-concerns, kp-adaptive-equipment,
kp-elderly-flexibility, kp-elderly-training-adjustments,
kp-competition-anxiety, kp-performance-mindset,
kp-ifsc, kp-national-federations,
kp-competition-circuit-rankings,
kp-wall-living, kp-aid-climbing
```

---

祝搜集顺利！🔍🧗
