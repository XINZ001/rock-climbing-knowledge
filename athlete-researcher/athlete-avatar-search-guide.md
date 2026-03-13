# 运动员头像搜索执行指南 / Athlete Avatar Search Runbook

> **目标**：为名人堂中的每一位运动员搜索并记录头像图 URL，产出可被后续入库与前端展示使用的头像来源清单。
>
> **范围**：本指南仅覆盖「搜索 → 记录 → 输出清单」。头像字段如何写入 `hall-of-fame-media` 或 `athlete-registry`、前端如何在卡片/详情页展示，由后续实现决定，不在本文档内规定。

---

## 一、运动员名单来源 / Athlete List Source

- **真源**：`rock-climbing-knowledge/src/data/athlete-registry.json`
- **用法**：从 `athletes` 数组中取每项的 `athleteId`、`slug`、`athleteName.en`、`athleteName.zh` 作为搜索与记录的关键信息。
- **规模**：当前约 76 名运动员（以 registry 内 `_meta.totalAthletes` 及实际条目为准）。

搜索时建议同时使用：
- **英文名** `athleteName.en`（如 Janja Garnbret、Adam Ondra）
- **中文名** `athleteName.zh`（如 扬娅·甘布雷特）
- **slug**（如 janja-garnbret）用于官网或维基链接

---

## 二、头像定义与要求 / Avatar Definition and Requirements

### 2.1 什么是「头像」

本指南中的**头像**指：适合在名人堂**卡片左侧小方块**或**运动员详情页**使用的**肖像照**。

### 2.2 建议要求

| 维度 | 要求 |
|------|------|
| **内容** | 正面或半身、面部清晰可辨；优先单人照，避免多人合影中截取 |
| **场景** | 优先官方/媒体肖像、定妆照、采访照；避免纯比赛抓拍（如仅背影、仅攀爬动作） |
| **尺寸/比例** | 建议 1:1 或竖版，便于裁剪为正方形展示；分辨率足够在卡片小图下清晰显示 |
| **版权/来源** | 尽量选用可商用或注明来源的图片；记录**来源页面/站点**与**版权或使用说明**（见下方记录格式），便于后续合规 |

若某运动员难以找到符合上述要求的图片，可在 `licenseOrNote` 中注明「待替换」或「仅作占位，需后续授权」。

---

## 三、推荐搜索渠道 / Recommended Search Channels

按优先级或类型参考以下渠道（可并行使用）：

1. **IFSC 官网及社媒**  
   - [IFSC 运动员页](https://www.ifsc-climbing.org/) 或赛事新闻中的选手图。
2. **Wikipedia**  
   - 英文/中文词条 Infobox 中的头像，注意注明「Wikipedia」及该页 URL 作为 source；使用前需确认其版权与本站使用场景是否兼容。
3. **运动员个人/赞助商官网与社媒**  
   - 个人官网、Instagram、赞助商（如 adidas TERREX、The North Face 等）官方图。
4. **Getty Images / 官方图库**  
   - 用于发现高质量肖像；最终采用时需确认授权与使用范围。
5. **搜索引擎**  
   - **Google / 百度图片**：用「运动员英文名 + climbing」或「中文名 + 攀岩」等搜索；找到可用的**直接图片 URL**（如维基共享、官方图库链接）后，可填入 `athlete-researcher/athlete-avatar-overrides.json`（格式：`"athleteId": "图片URL"`），再运行 `node athlete-researcher/scripts/fetch-avatars.mjs` 自动下载到 `athlete-avatars/`。**仅作发现来源**，选定 URL 后应尽量追溯到原始站点并记录，以便后续确认版权。

中国运动员可侧重：新华社/中新社体育、中国登山协会、IFSC 中文报道、运动员微博/官方账号等。

---

## 四、执行步骤（逐人）/ Execution Steps (Per Athlete)

对名单中的**每一名**运动员执行：

1. **取出一人**  
   从 `athlete-registry.json` 的 `athletes` 中取当前条目的 `athleteId`、`athleteName.en`、`athleteName.zh`、`slug`。
2. **多渠道搜索**  
   用中英文名、slug 在第三节所列渠道中搜索，优先官方/维基/正规媒体。
3. **选定一张最佳头像**  
   在满足「头像定义与要求」的前提下，选定 1 张最合适的图片。
4. **记录**  
   将**图片 URL**、**来源（站点/页面名或 URL）**、**版权或备注**写入产出清单（见第五节）。

重复以上步骤直至全部运动员处理完毕；找不到合适图片的也占一行并注明「待补」或原因。

---

## 五、记录格式与产出 / Record Format and Output

### 5.1 产出文件位置与命名

- **本执行指南**：`athlete-researcher/athlete-avatar-search-guide.md`（即本文档）。
- **执行结果**：`athlete-researcher/athlete-avatar-results.md`（推荐，便于人工维护）或 `athlete-researcher/athlete-avatar-results.json`（便于脚本入库）。在 guide 中约定其一，执行时创建或更新该文件。

### 5.2 记录字段

每条记录至少包含：

| 字段 | 说明 |
|------|------|
| `athleteId` | 与 registry 一致，如 `ath-101` |
| `athleteName.en` | 英文名，便于核对 |
| `avatarUrl` | 头像图片的完整 URL（尽量为可直接引用的图片地址） |
| `source` | 来源说明：站点名或页面 URL，如 "IFSC", "Wikipedia - https://..." |
| `licenseOrNote` | 可选。版权、授权或备注，如 "Wikipedia CC", "官方社媒", "待替换" |

### 5.3 表格模板（Markdown 结果示例）

可将下表复制到 `athlete-avatar-results.md`，前两列由 registry 复制生成，后三列由执行搜索后填写：

| athleteId | athleteName.en | avatarUrl | source | licenseOrNote |
|-----------|----------------|-----------|--------|---------------|
| ath-101 | Janja Garnbret | | | |
| ath-102 | Adam Ondra | | | |
| ath-103 | Alberto Ginés López | | | |
| ath-104 | Anže Peharc | | | |
| ath-105 | Brooke Raboutou | | | |
| … | （共约 76 人，其余同上） | | | |

**说明**：完整名单见 `rock-climbing-knowledge/src/data/athlete-registry.json` 的 `athletes` 数组。请将全体运动员的 `athleteId` 与 `athleteName.en` 填入前两列，执行搜索后填写 `avatarUrl`、`source`、`licenseOrNote`。

### 5.4 JSON 结果格式（可选）

若采用 `athlete-avatar-results.json`，可按下述结构（便于后续脚本合并到 media 或 registry）：

```json
[
  { "athleteId": "ath-101", "avatarUrl": "https://...", "source": "IFSC", "licenseOrNote": "" },
  { "athleteId": "ath-102", "avatarUrl": "", "source": "", "licenseOrNote": "待补" }
]
```

---

## 六、与现有媒体数据的关系 / Relation to Existing Media

- 当前 **`rock-climbing-knowledge/src/data/hall-of-fame-media.js`** 按 `athleteId` 存 `images`、`cardImage` 等，**尚无统一 `avatar` 字段**；名人堂卡片左侧目前为**首字母缩写（initials）**占位。
- 本步骤**仅产出「头像 URL 清单」**（见第五节）；不修改 registry 或 hall-of-fame-media。
- 后续由开发在 media 或 registry 中增加相应字段（如 `avatar` 或 `portrait`），将本清单中的 URL 写入，前端再读取并展示头像；具体字段名与数据结构由实现阶段决定，本指南不做规定。

---

## 七、小结

- 本指南供执行者按**运动员名单逐人搜索头像**，并按要求记录 URL 与来源。
- 名单来自 **athlete-registry.json**，头像需符合**肖像清晰、来源可追溯、尽量可商用或注明版权**。
- 执行结果输出到 **athlete-researcher/athlete-avatar-results.md**（或约定的 .json），便于后续入库与前端接入。
