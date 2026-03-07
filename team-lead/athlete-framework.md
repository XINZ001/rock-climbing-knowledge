# 攀岩名人档案框架 / Athlete Profile Framework

> **内容架构定位**：本文件是整个攀岩知识库网站内容的**三支柱之三**。
>
> | 支柱 | 定位 | 框架文件 |
> |------|------|---------|
> | 支柱一：知识库 | 对攀岩表现有直接帮助的概念、技术、原理 | `climbing-knowledge-framework.md` |
> | 支柱二：训练手册 | 知识的落地执行方案（具体方案、组数、休息） | `training-framework.md` |
> | **支柱三：攀岩名人**（本文件） | 人物、文化、历史（运动员生平、训练理念、采访） | `athlete-framework.md` |

---

## 一、定位与边界

### 攀岩名人收录什么
- 对攀岩运动有重大历史影响的传奇人物
- 当代竞技精英运动员
- 有代表性的中国攀岩运动员
- 具有独特训练理念或攀爬风格、值得记录的攀岩家

### 为什么它不属于知识库
> 知道或不知道某个运动员的存在，不会直接影响你的攀爬表现。
> 你完全可以在不认识任何职业运动员的情况下攀得很好。

因此，攀岩名人是独立的内容支柱，而非知识库的一部分。它的价值在于：
- 丰富文化视野（攀岩的历史演进）
- 提供训练理念参考（链接至训练手册）
- 呈现运动的人文面貌（采访、语录、故事）

---

## 二、条目结构

每位运动员由 **3–4 张独立「名人卡」** 组成：

| 卡片类型 | 内容 | 字段 `type` |
|---------|------|------------|
| 生平与成就 | 背景简介、里程碑路线、头衔、世界纪录 | `biography` |
| 训练哲学 | 训练方法提炼、训练理念、日常训练结构 | `training` |
| 标志性风格 | 技术特点分析（可链接知识库 KP） | `technique` |
| 采访与名言 | 精选采访内容、代表性语录（可选） | `interview` |

---

## 三、分类与 ID 体系

### 分类体系

```
支柱三：攀岩名人
├── 12.1 历史传奇（Historical Legends）    ath-001 ~ ath-099
├── 12.2 当代精英（Contemporary Elite）    ath-101 ~ ath-199
└── 12.3 中国运动员（Chinese Athletes）    ath-201 ~ ath-299
```

### 各分类代表人物（参考，非完整列表）

**12.1 历史传奇**
- John Gill — 现代抱石之父，首创动态发力哲学
- Wolfgang Güllich — campus board 发明者，Action Directe 首登者
- Lynn Hill — The Nose 徒手首登（1993），女性攀岩先驱
- Patrick Edlinger — 攀岩美学先驱，自由攀登代表人物
- Jerry Moffatt / Ben Moon — 英国技术流传奇

**12.2 当代精英**
- Adam Ondra — Silence 首登（9c），多届世界冠军
- Janja Garnbret — 全能竞技精英，史上最多 IFSC 奖牌
- Tomoa Narasaki — 抱石世界冠军，动态技术标杆
- Brooke Raboutou — 青少年世界冠军起家的全能选手
- Sean Bailey / Stefano Ghisolfi — 当代难度攀岩精英

**12.3 中国运动员**
- 潘愚非
- 宋懿龄
- 其他现役国家队成员

---

## 四、ID 命名规范

| 层级 | 格式 | 示例 |
|------|------|------|
| 运动员主 ID | `ath-NNN` | `ath-001`（John Gill） |
| 具体卡片 ID | `ath-NNN-{type}` | `ath-001-biography` |

> 卡片 ID 用后缀代替字母编号（`-biography` 比 `-001a` 更语义清晰）。

---

## 五、数据文件规范

### 存放位置

```
rock-climbing-knowledge/src/data/
└── athlete-registry.json    ← 运动员卡片注册表
```

### athlete-registry.json 字段模板

```json
{
  "id": "ath-001-biography",
  "type": "biography",
  "athleteId": "ath-001",
  "athleteName": {
    "zh": "约翰·吉尔",
    "en": "John Gill"
  },
  "category": "historical",
  "title": {
    "zh": "约翰·吉尔：现代抱石之父",
    "en": "John Gill: Father of Modern Bouldering"
  },
  "summary": {
    "zh": "...",
    "en": "..."
  },
  "keyFacts": [],
  "relatedKps": [],
  "relatedTraining": [],
  "sources": []
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一卡片 ID，格式 `ath-NNN-{type}` |
| `type` | enum | `biography` / `training` / `technique` / `interview` |
| `athleteId` | string | 所属运动员主 ID（`ath-NNN`） |
| `category` | enum | `historical` / `contemporary` / `chinese` |
| `relatedKps` | array | 关联知识库知识点（可为空） |
| `relatedTraining` | array | 关联训练手册方案 ID（可为空） |
| `sources` | array | 内容来源（URL / 书籍 / 采访出处） |

---

## 六、与其他支柱的关联规则

| 关联方向 | 规则 |
|---------|------|
| 名人 → 知识库 | `relatedKps` 字段引用相关 KP（例：Güllich → kp-0246 campus board） |
| 名人 → 训练手册 | `relatedTraining` 字段引用相关训练方案 |
| 知识库 → 名人 | 知识库 KP **不主动引用**运动员，保持知识库独立性 |
| 训练手册 → 名人 | 训练方案可在 `notes` 中注明「由 XX 运动员推广」，不做强关联 |

---

## 七、产出归档位置

| 产出 | 位置 |
|------|------|
| 本框架文件 | `team-lead/athlete-framework.md` |
| 数据注册表 | `rock-climbing-knowledge/src/data/athlete-registry.json` |

---

*创建于 2026-03-06*
*对应内容架构版本：三支柱 v1*
