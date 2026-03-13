# 信息收集报告 / Collection Report

**主题**：攀岩名人堂（Climbing Hall of Fame）
**任务依据**：`information-collector/topic-hall-of-fame.md`
**收集日期**：2026-03-07
**批次编号**：批次一（首轮覆盖，高优先级类别）

---

## 一、本次收集摘要

| 指标 | 数值 |
|------|------|
| 搜索关键词组数 | 12 组 |
| 候选 URL 数量 | 约 40 条 |
| 成功抓取源数量 | **12 条** |
| 失败 URL 数量 | 3 条（见下） |
| 覆盖类别 | A（竞技）、C1（训练创始人）、D（中国）、B1/B3（户外先驱） |
| 输出文件数量 | 3 个 JSON 文件 |

---

## 二、已收集来源概览

### 文件 1：`sources-competitive-climbing-20260307.json`（竞技攀岩，5条）

| ID | 人物 / 主题 | 来源 | 语言 | 核心话题 |
|----|---------|------|------|---------|
| src-001 | **Janja Garnbret** 深度专访 | Olympics.com | EN | 训练方法、心理哲学 |
| src-002 | **Janja Garnbret** 综合信息 | Wikipedia | EN | 成就、竞赛记录 |
| src-003 | **Adam Ondra** 综合信息 | Wikipedia | EN | 难度攀岩纪录、成就 |
| src-004 | **速度攀岩** 历史与纪录 | Wikipedia | EN | 速度攀岩历史、世界纪录 |
| src-005 | **Aleksandra Mirosław** | Wikipedia | EN | 成就、世界纪录 |

**关键发现**：
- Janja Garnbret 是史上最成功的竞技攀岩运动员，10个世锦赛冠军，两届奥运冠军。训练强度：每周6次、每次4-5小时、95%时间在岩壁上。
- Adam Ondra 完成世界首条9c路线（Silence，2017）。
- 速度攀岩男子世界纪录：从2011年6.26秒（钟齐鑫，中国）降至2025年4.64秒（Samuel Watson，美国）。

---

### 文件 2：`sources-chinese-climbing-20260307.json`（中国攀岩，3条）

| ID | 人物 | 来源 | 语言 | 核心话题 |
|----|------|------|------|---------|
| src-006 | **钟齐鑫** 人物专访 | 中国新闻网（2015） | ZH | 成就、训练理念、大满贯 |
| src-007 | **邓丽娟 + 钟齐鑫（教练）** | 新浪财经（2024） | ZH | 成就、训练历程、师承 |
| src-008 | **潘愚非** 夺冠报道 | 新华网（2025） | ZH | 历史突破、心理状态 |

**关键发现**：
- 钟齐鑫（"中国壁虎"）：世界首位速度攀岩大满贯得主（4次世锦赛冠军），退役后转型为国家队教练，培养出邓丽娟。
- 邓丽娟：2024年巴黎奥运速度攀岩银牌，中国攀岩史上首枚奥运奖牌。成绩从2020年7.088秒提升至2024年6.18秒。
- 潘愚非：2025年6月成为中国首位攀石项目世界冠军，带伤夺冠，以84.2分险胜0.1分。

---

### 文件 3：`sources-outdoor-training-pioneers-20260307.json`（户外先驱 + 训练创始人，4条）

| ID | 人物 | 来源 | 语言 | 核心话题 |
|----|------|------|------|---------|
| src-009 | **Alex Honnold** | Wikipedia | EN | El Cap无保护首登、哲学 |
| src-010 | **Tommy Caldwell** | Wikipedia | EN | Dawn Wall首次自由攀、逆境 |
| src-011 | **Lynn Hill** 纪念文章 | PlanetMountain（2018） | EN | The Nose自由首登、女性先驱 |
| src-012 | **Wolfgang Güllich** | 搜索摘要（⚠️未完整抓取） | EN | Campus board发明、Action Directe |

**关键发现**：
- Alex Honnold：2017年6月3日完成El Capitan Freerider无保护首登（3h56m），纪录片《Free Solo》获奥斯卡最佳纪录片。
- Tommy Caldwell：2015年完成Dawn Wall首次自由攀（19天），被评为"地球上最全面的攀岩手"，断指后坚持攀岩的故事具有强传播力。
- Lynn Hill：1993年完成The Nose自由首登，1994年单日完成（23小时），"领先时代数十年"。
- Wolfgang Güllich：发明Campus Board（1988），完成世界首条9a（Action Directe，1991），两项成就都具里程碑意义。

---

## 三、失败记录

| URL | 失败原因 | 已有替代来源 |
|-----|---------|------------|
| https://hardclimbs.info/climbers/adam-ondra/ | CAPTCHA 反爬保护 | 已用 Wikipedia 替代（src-003） |
| https://lynnhillclimbing.com/biography/ | CAPTCHA 反爬保护 | 已用 PlanetMountain 文章替代（src-011） |
| https://zhuanlan.zhihu.com/p/718171045 | 403 Forbidden（未登录） | 暂无替代，建议后续通过人工访问获取 |

---

## 四、尚未覆盖的名人堂候选人

以下人物在本次搜索中出现，但**尚未抓取专项原文**，建议下一批次优先补充：

| 优先级 | 人物 | 类别 | 原因 |
|--------|------|------|------|
| ⭐⭐⭐ | **Veddriq Leonardo**（印尼） | A3 速度 | 巴黎2024奥运金牌，打破5秒壁垒 |
| ⭐⭐⭐ | **Samuel Watson**（美国） | A3 速度 | 现世界纪录保持者（4.64s，2025） |
| ⭐⭐ | **Alberto Ginés López**（西班牙） | A1 先锋 | 东京2020奥运男子组合金牌（18岁） |
| ⭐⭐ | **Toby Roberts**（英国） | A1+A2 | 巴黎2024奥运男子Boulder&Lead金牌 |
| ⭐⭐ | **伍鹏**（中国） | D1 | 巴黎2024奥运银牌（与邓丽娟同届） |
| ⭐⭐ | **吴鹏**（中国） | A3 | 巴黎2024速度攀岩铜牌（决赛时Watson破世界纪录） |
| ⭐⭐ | **Roman Krajnik** | C2 教练 | Janja Garnbret的教练，2019年加入 |
| ⭐ | **Kevin Jorgeson** | B2 | Dawn Wall共同完成者（与Tommy Caldwell） |
| ⭐ | **Jimmy Chin / Chai Vasarhelyi** | E1 导演 | 《Free Solo》导演，获奥斯卡 |
| ⭐ | **John Sherman ("Vermin")** | B1/C1 | V-scale抱石分级创始人 |

---

## 五、质量说明

- src-001（Garnbret Olympics专访）：**质量最高**，深度采访，含训练数据（每周6次×4-5小时，95%墙上训练）
- src-007（邓丽娟报道）：**中文质量最高**，含师承关系（钟齐鑫→邓丽娟）的详细叙述
- src-012（Güllich）：⚠️ **质量较低**，fullText来自搜索结果摘要而非完整原文抓取，仅供参考，需后续补充
- Zhihu文章（中国速度攀岩崛起之路）：**未能获取**（403），该文章内容丰富，建议人工访问后手动添加

---

## 六、建议下一步行动

1. **优先补充**：Veddriq Leonardo、Samuel Watson、伍鹏的专项原文
2. **补充中文来源**：知乎文章（中国速度攀岩崛起之路）需人工访问
3. **深化 Ondra**：搜索 `"Adam Ondra training" interview`，trainingbeta.com 有其专访（`sources-adam-ondra-training-YYYYMMDD.json`）
4. **深化 Honnold**：`redbull.com/honnold` 有生涯专访原文，值得抓取
5. **补充 Güllich**：直接访问 `https://en.wikipedia.org/wiki/Wolfgang_G%C3%BCllich` 获取完整 Wikipedia 文本

---

*收集员备注：本批次重点覆盖最高优先级类别（A竞技 + D中国），已获取12条来源，含5名中国核心运动员（钟齐鑫、邓丽娟、潘愚非）和7名国际顶级运动员的基础信息。暂停等待确认，可继续下一批次。*
