# 任务清单：攀岩名人堂信息收集
# Task List: Climbing Hall of Fame — Information Collection

> **用途**：追踪攀岩名人堂信息收集工作的任务拆解与完成状态。
> **关联文件**：
> - 范围定义 → `information-collector/topic-hall-of-fame.md`
> - 操作规范 → `information-collector/information-collector-guide.md`
> - 注册表 → `rock-climbing-knowledge/src/data/athlete-registry.json`
>
> **状态标记**：✅ 已完成 ｜ ⬜ 待开始 ｜ 🔄 进行中 ｜ 🙋 需人工操作 ｜ ⏸️ 待评估是否做

**上次更新**：2026-03-08

---

## 快速全局概览

| 模块 | 总任务数 | 已完成 | 待开始 | 其他 |
|------|---------|--------|--------|------|
| 一、Registry 维护 | 10 | 0 | 9 | 1 待评估 |
| 二、来源深化（已入库运动员） | 9 | 0 | 5 | 4 需人工 |
| 三、人工待取队列 | 5 | 0 | 0 | 5 需人工 |
| 四、新运动员采集（批次二） | 10 | 0 | 8 | 2 待评估 |
| 五、视频资源采集 | 4 | 0 | 4 | — |

---

## 模块一：Registry 维护

> 目标：保持 `athlete-registry.json` 与采集进度同步。

### 1.1 新运动员入库（批次一已采集，直接写 JSON 即可）

| 状态 | 任务 | 分配 ID | Category | 备注 |
|------|------|---------|----------|------|
| ⬜ | 写入 Adam Ondra | ath-102 | `elite` | src-003 已有（Wikipedia），可直接入库 |
| ⬜ | 写入 Aleksandra Mirosław | ath-103 | `elite` | src-005 已有（Wikipedia），可直接入库 |
| ⬜ | 写入 钟齐鑫 | ath-202 | `elite` + `isChineseRepresentative: true` | src-006、src-007 已有，内容充足 |
| ⬜ | 写入 邓丽娟 | ath-203 | `elite` + `isChineseRepresentative: true` | src-007 已有；建议先等 模块三 人工取回后再写完整卡 |
| ⬜ | 写入 Alex Honnold | ath-301 | `explorer` | src-009 已有（Wikipedia），可直接入库 |
| ⬜ | 写入 Tommy Caldwell | ath-302 | `explorer` | src-010 已有（Wikipedia），可直接入库 |
| ⬜ | 写入 Wolfgang Güllich | ath-401 | `innovator` | ⚠️ src-012 为低质摘要；建议先完成 模块二 1.2 补源后入库 |

**说明**：以上7人入库后，`explorer` 与 `innovator` 两个类别将不再空白。前端4个 Tab 全部有内容。

### 1.2 数据修复

| 状态 | 任务 | 影响 |
|------|------|------|
| ⬜ | 修复 `cards` 数组内所有卡片的 `"category"` 字段（当前还是旧值：`historical` / `contemporary` / `chinese`，应改为 `legend` / `elite`） | 不影响前端功能，但数据不一致，应修复 |
| ⬜ | 更新 `_meta.totalAthletes`（当前 4，7人入库后应为 11） | 每次入库批量更新一次即可 |
| ⬜ | 更新 `_meta.totalCards`（当前 12，7人×3张=21张新卡，入库后应为 33） | 同上 |

---

## 模块二：来源深化

> 目标：已入库运动员每人至少有 2–3 条质量来源；`interview` 类卡片必须有完整原文支撑。

### 2.1 紧急补充（有卡片但来源为零或质量极低）

| 状态 | 运动员 | 当前来源 | 任务 | 目标来源 |
|------|--------|---------|------|---------|
| ⬜ | **John Gill** (ath-001) | 0条文字来源 | 搜索并抓取 AAC Legacy Series 原文 | americanalpineclub.org/news/…/john-gill（批次一 CAPTCHA 未取到正文） |
| ⬜ | **John Gill** (ath-001) | 0条文字来源 | 搜索 John Gill interview / essay | 任何发布了他本人声音的长文或问答 |
| ⬜ | **Wolfgang Güllich** (ath-401) | 1条（⚠️摘要） | 抓取 Wikipedia 完整正文 | https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich |

### 2.2 质量深化（有来源，可进一步补充）

| 状态 | 运动员 | 当前来源 | 任务 | 目标来源 |
|------|--------|---------|------|---------|
| 🙋 | **Janja Garnbret** (ath-101) | 2条 | 人工取回 Climbing.com 深度报道 | 见模块三 |
| ⬜ | **Adam Ondra** (ath-102) | 1条（Wikipedia） | 搜索并抓取 trainingbeta.com 训练专访 | `trainingbeta.com "adam ondra"` |
| 🙋 | **Adam Ondra** (ath-102) | 1条 | 人工取回 hardclimbs.info 原文 | 见模块三 |
| 🙋 | **Alex Honnold** (ath-301) | 1条（Wikipedia） | 人工取回 Red Bull 生涯专访 | 见模块三 |
| ⬜ | **Tommy Caldwell** (ath-302) | 1条（Wikipedia） | 搜索 The Push 书摘或同类专访 | trainingbeta / rockandice / climbing.com |

---

## 模块三：人工待取队列

> 目标：以下 URL 工具无法自动获取，需你手动打开后复制正文，填入 `hall-of-fame-20260307/manual-fetch-queue-20260307.md` 对应的"人工填写区"。
> 完成后告知我，我来整合进 review 文件并输出 JSON。

| 状态 | 优先级 | 描述 | URL | 阻塞原因 |
|------|--------|------|-----|---------|
| 🙋 | ⭐⭐⭐ | 钟齐鑫深度问答采访 | https://www.bjnews.com.cn/detail/152895584715124.html | 待人工访问 |
| 🙋 | ⭐⭐⭐ | 知乎：中国速度攀岩崛起之路 | https://zhuanlan.zhihu.com/p/718171045 | 403（需登录） |
| 🙋 | ⭐⭐⭐ | Climbing.com Garnbret 深度报道 | https://www.climbing.com/climbers/janja-garnbret-profile-greatest-ever/ | 工具报错 |
| 🙋 | ⭐⭐ | Red Bull：Honnold 生涯专访 | https://www.redbull.com/int-en/athlete/alex-honnold | 工具超时 |
| 🙋 | ⭐⭐ | hardclimbs.info：Adam Ondra | https://hardclimbs.info/climbers/adam-ondra/ | CAPTCHA |

---

## 模块四：新运动员采集（批次二）

> 目标：为以下候选人物搜索并抓取原始来源，完成后输出 MD 预览 → 你 review → 写入 JSON。

### 4.1 竞技精英 `elite`

| 状态 | 优先级 | 人物 | 国籍 | 入选理由 | 备注 |
|------|--------|------|------|---------|------|
| ⬜ | ⭐⭐⭐ | **Veddriq Leonardo** | 印尼 | 巴黎2024速度金牌，男子首破5秒 | 媒体报道丰富，采集性价比高 |
| ⬜ | ⭐⭐ | **伍鹏** | 中国 🇨🇳 | 巴黎2024速度银牌；`isChineseRepresentative: true` | 中文资料应较丰富 |
| ⬜ | ⭐⭐ | **Toby Roberts** | 英国 | 巴黎2024 Boulder&Lead 金牌 | 最新奥运周期代表人物 |
| ⬜ | ⭐⭐ | **Alberto Ginés López** | 西班牙 | 东京2020男子组合金牌（时年18岁） | 最年轻奥运攀岩冠军之一 |
| ⏸️ | ⭐⭐ | **Samuel Watson** | 美国 | 当前速度世界纪录保持者（4.64s） | 成绩刚出（2025），纪录随时可能被打破，暂待评估是否收录时机成熟 |

### 4.2 探险攀登 `explorer`

| 状态 | 优先级 | 人物 | 入选理由 | 备注 |
|------|--------|------|---------|------|
| ⬜ | ⭐⭐ | **Chris Sharma** | 先锋攀传奇，多次持有世界最难路线（Realization、Es Pontet） | 与 Ondra 并列的难度先锋 |
| ⬜ | ⭐ | **Kevin Jorgeson** | Dawn Wall 共同完成者（与 Tommy Caldwell） | 可与 Caldwell 资料合并搜索 |

### 4.3 训练革新 `innovator`

| 状态 | 优先级 | 人物 | 入选理由 | 备注 |
|------|--------|------|---------|------|
| ⬜ | ⭐ | **John Sherman "Vermin"** | V-scale 抱石分级体系创始人 | 影响整个抱石圈的标准化工具 |
| ⏸️ | ⭐ | **Roman Krajnik** | Garnbret 教练，2019年起 | 以教练身份入选是否符合门槛，待评估 |

### 4.4 历史先驱 `legend`（文化人物，严格控制 ≤ 总量 10%）

| 状态 | 优先级 | 人物 | 入选理由 | 备注 |
|------|--------|------|---------|------|
| ⬜ | ⭐ | **Jimmy Chin / Chai Vasarhelyi** | 《Free Solo》导演，奥斯卡最佳纪录片，攀岩文化影响力极高 | 注意 legend 文化人物 ≤ 10% 上限 |

---

## 模块五：视频资源采集

> 目标：为每位入库运动员搜索并记录视频来源（对应前端 `hall-of-fame-media.js`）。
> 当前状态：4位已入库运动员均有 media 占位记录，但信息收集员尚未进行系统性视频搜索。
> 本模块作为**第二阶段任务**，文字来源基本稳定后启动。

| 状态 | 运动员 | 文字来源现状 | 视频采集 | 备注 |
|------|--------|------------|---------|------|
| ⬜ | John Gill (ath-001) | ⚠️ 0条（紧急） | ⬜ 未开始 | 视频资源可能以采访录像为主 |
| ⬜ | Lynn Hill (ath-002) | ⚠️ 1条 | ⬜ 未开始 | 有个人网站，视频资源应较丰富 |
| ⬜ | Janja Garnbret (ath-101) | ✅ 2条（含深度采访） | ⬜ 未开始 | YouTube / Red Bull TV 内容丰富 |
| ⬜ | 潘愚非 (ath-201) | ⚠️ 1条 | ⬜ 未开始 | Bilibili / 新浪体育可能有赛前赛后采访 |

---

## 批次记录

| 批次 | 日期 | 文件夹 | 采集来源数 | 覆盖人物 | Review 状态 | JSON 输出状态 |
|------|------|--------|-----------|---------|------------|-------------|
| 批次一 | 2026-03-07 | `hall-of-fame-20260307/` | 12条 | Garnbret、Ondra、Mirosław、速度攀岩史、钟齐鑫、邓丽娟、潘愚非、Honnold、Caldwell、Lynn Hill、Güllich | ⬜ 待 Review | ⬜ 待输出 |
| 批次二 | — | — | — | — | — | — |

---

## 更新规则

1. 完成一个任务后，将该行状态改为 `✅ 已完成`，并在括号内注明日期，如 `✅ 已完成（2026-03-08）`
2. 新开始一个任务，将状态改为 `🔄 进行中`
3. 每完成一个批次后，在"批次记录"中更新对应行状态
4. 快速概览表中的数字，在各模块状态变更后手动更新

---

*创建于 2026-03-08*
