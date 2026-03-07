# 训练手册框架 / Training Manual Framework

> **内容架构定位**：本文件是整个攀岩知识库网站内容的**三支柱之二**。
>
> | 支柱 | 定位 | 框架文件 |
> |------|------|---------|
> | 支柱一：知识库 | 对攀岩表现有直接帮助的概念、技术、原理 | `climbing-knowledge-framework.md` |
> | **支柱二：训练手册**（本文件） | 知识的落地执行方案（具体方案、组数、休息） | `training-framework.md` |
> | 支柱三：攀岩名人 | 人物、文化、历史（运动员生平、训练理念、采访） | `athlete-framework.md` |

---

## 一、定位与边界

### 训练手册的核心价值

知识库和训练手册解决不同层次的问题：

| 维度 | 知识库（支柱一） | 训练手册（支柱二） |
|------|---------------|----------------|
| 核心问题 | 为什么？是什么？ | 怎么做？做多少？ |
| 典型内容 | 「指力训练的原理」「ARC 训练的生理机制」 | 「7s on/3min off，6 组，20mm 边缘」 |
| 使用场景 | 建立认知框架 | 直接拿来当今天的训练菜单 |

### 判断一个条目归属的标准

> 如果这个条目可以**直接拿来当「今天的训练菜单」**，它属于训练手册。
> 如果它解释的是**原理或概念**，它属于知识库。

### 训练手册依赖知识库

训练手册是知识的融会贯通，每个训练方案都应通过 `relatedKps` 字段指向其对应的知识库原理，帮助用户理解「我为什么要做这个训练」。

---

## 二、条目结构

每个训练方案是一张**「训练卡」**（Training Card），包含固定字段：

| 字段 | 说明 |
|------|------|
| 目标能力 | 这个方案训练的是哪个维度（链接知识库 KP） |
| 难度级别 | 入门 / 中级 / 进阶 |
| 所需装备 | 指力板 / campus board / 训练环 / 无器械 等 |
| 执行方案 | 组数、次数、时长、休息（具体数字，可直接执行） |
| 进阶变体 | 如何加难度（下一阶段方案） |
| 注意事项 | 常见错误、受伤风险点 |
| 适用人群 | 推荐的基础等级或前置条件 |

---

## 三、分类与 ID 体系

### 分类体系

```
支柱二：训练手册
├── 11.1 指力专项（Finger Strength Protocols）      tp-001 ~ tp-019
├── 11.2 耐力专项（Endurance Protocols）            tp-020 ~ tp-039
├── 11.3 爆发力专项（Power Protocols）              tp-040 ~ tp-059
├── 11.4 综合训练计划（Full Programs）              tp-060 ~ tp-099
└── 11.5 辅助与对抗训练（Supplementary）           tp-100 ~ tp-119
```

### 各分类代表条目（参考，非完整列表）

**11.1 指力专项**
- Max Hang 最大力量悬挂（各边缘尺寸变体）
- Minimum Edge 极限边缘训练
- Repeater 重复悬挂法
- One-arm 单臂渐进方案
- 负重 / 辅助悬挂调节

**11.2 耐力专项**
- ARC Training 完整执行方案
- Power Endurance 4x4 变体
- Linked Boulder Problems 串联抱石
- Campus Board Ladders（耐力导向）

**11.3 爆发力专项**
- Campus Board 经典序列（1-5-9 / 1-4-8 / 1-3-5-7-9）
- Weighted Movement 负重动态
- System Wall 系统训练

**11.4 综合训练计划**
- 初级 8 周基础建立计划
- 中级突破计划（针对平台期）
- 赛季前 6 周冲刺计划
- 非赛季体能积累计划

**11.5 辅助与对抗训练**
- 推力对抗系列（拮抗肌训练）
- 核心专项序列（前悬体、L-sit 等）
- 标准热身协议（攀岩前 10 分钟）

---

## 四、ID 命名规范

| 层级 | 格式 | 示例 |
|------|------|------|
| 训练卡 ID | `tp-NNN` | `tp-001`（Max Hang Protocol） |

---

## 五、数据文件规范

### 存放位置

```
rock-climbing-knowledge/src/data/
└── training-registry.json    ← 训练方案注册表
```

### training-registry.json 字段模板

```json
{
  "id": "tp-001",
  "category": "finger-strength",
  "title": {
    "zh": "Max Hang 最大力量悬挂协议",
    "en": "Max Hang Protocol"
  },
  "difficulty": "intermediate",
  "equipment": ["hangboard"],
  "targetAbility": {
    "zh": "指力（最大握持力）",
    "en": "Finger Strength (Max Grip)"
  },
  "relatedKps": ["kp-0201"],
  "protocol": {
    "sets": 6,
    "reps": 1,
    "duration": "7s",
    "rest": "3min",
    "grip": "half-crimp",
    "edge": "20mm",
    "notes": "..."
  },
  "progressions": [],
  "warnings": [],
  "prerequisites": "",
  "sources": []
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一 ID，格式 `tp-NNN` |
| `category` | enum | `finger-strength` / `endurance` / `power` / `full-program` / `supplementary` |
| `difficulty` | enum | `beginner` / `intermediate` / `advanced` |
| `equipment` | array | 所需装备列表 |
| `relatedKps` | array | 关联知识库 KP（「这个训练对应哪个知识点」） |
| `protocol` | object | 核心执行参数（组数 / 次数 / 时长 / 休息） |
| `progressions` | array | 进阶变体（下一步怎么加难） |
| `warnings` | array | 受伤风险点和常见错误 |
| `prerequisites` | string | 推荐的前置条件或基础等级 |
| `sources` | array | 来源出处 |

---

## 六、与其他支柱的关联规则

| 关联方向 | 规则 |
|---------|------|
| 训练手册 → 知识库 | `relatedKps` 字段引用对应知识点原理（**必填**，每张训练卡必须有至少一个 KP 关联） |
| 训练手册 → 名人 | `notes` 中可注明「该方法由 XX 运动员推广」，不做强字段约束 |
| 知识库 → 训练手册 | KP 可在 `relatedTraining` 字段推荐相关训练卡（可选，后续实现） |

---

## 七、产出归档位置

| 产出 | 位置 |
|------|------|
| 本框架文件 | `team-lead/training-framework.md` |
| 数据注册表 | `rock-climbing-knowledge/src/data/training-registry.json` |

---

*创建于 2026-03-06*
*对应内容架构版本：三支柱 v1*
