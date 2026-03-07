# 项目状态真源 / Project State Source of Truth

> **用途**：本文件记录项目的当前真实状态，供所有 `guide`、`framework`、`plan` 文档引用。
> **原则**：会变化的事实写在这里；其他文档尽量不要重复硬编码项目规模、目录路径、当前进度。
> **更新时间**：2026-03-06

---

## 一、项目定位 / Project Identity

这是一个以攀岩学习为主题的中英双语内容工作区，当前由三条内容支柱组成：

| 支柱 | 定位 | 真源文件 |
|------|------|---------|
| 支柱一：知识库 | 概念、技术、原理、规则 | `team-lead/climbing-knowledge-framework.md` |
| 支柱二：训练手册 | 可直接执行的训练卡 | `team-lead/training-framework.md` |
| 支柱三：攀岩名人 | 运动员、训练理念、采访 | `team-lead/athlete-framework.md` |

---

## 二、当前规模 / Current Scale

### 2.1 支柱一：知识库

| 维度 | 当前数值 |
|------|---------|
| section 数量 | 10 |
| sub-section 数量 | 49 |
| knowledge point 数量 | 177 |
| 有插图的 KP | 172 |
| 插图总数 | 289 |
| 有视频映射的 KP | 138 |
| 视频总数 | 338 |

### 2.2 支柱二、三

| 注册表 | 当前状态 |
|--------|---------|
| `training-registry.json` | 结构已建，内容待研究整合 |
| `athlete-registry.json` | 结构已建，内容待研究整合 |

> 如果以上数字变化，应优先更新本文件，而不是逐个改所有 guide。

---

## 三、目录真源 / Canonical Directory Map

```
rock-climbing/
├── CLAUDE.md
├── team-lead/
│   ├── project-state.md
│   ├── documentation-architect-guide.md
│   ├── general-director-guide.md
│   ├── climbing-knowledge-framework.md
│   ├── training-framework.md
│   ├── athlete-framework.md
│   └── content-integration-plan.md
├── video-researcher/
├── article-researcher/
├── prompt-engineer/
├── illustrator/
├── photo-regenerator/
├── training-researcher/
├── athlete-researcher/
├── fact-checker/
├── frontend-engineer/
├── archive/
├── rock-climbing-knowledge/
├── data-model/
└── content-snapshots/
```

---

## 四、数据真源 / Canonical Data Files

### 4.1 前端运行时数据

| 文件 | 作用 | 备注 |
|------|------|------|
| `rock-climbing-knowledge/src/data/sections.json` | section / sub-section 目录树 | 支柱一导航真源 |
| `rock-climbing-knowledge/src/data/section-*.json` | 知识点正文 | 支柱一内容真源 |
| `rock-climbing-knowledge/src/data/kp-registry.json` | 177 个 KP 索引 | KP ID 真源 |
| `rock-climbing-knowledge/src/data/videos.json` | KP 级视频列表 | 当前前端消费的视频真源 |
| `rock-climbing-knowledge/src/data/illustration-registry.json` | KP 对应插图 | 当前前端消费的插图真源 |
| `rock-climbing-knowledge/src/data/training-registry.json` | 训练卡注册表 | 当前为空壳 |
| `rock-climbing-knowledge/src/data/athlete-registry.json` | 运动员注册表 | 当前为空壳 |

### 4.2 研究与中间产物

| 文件或目录 | 作用 |
|-----------|------|
| `video-researcher/` | 视频搜索过程与结果 |
| `article-researcher/` | 文章搜索结果与报告 |
| `training-researcher/` | 训练卡研究草案 |
| `athlete-researcher/` | 运动员研究草案 |
| `fact-checker/` | 纠错报告与对用户的回复草案 |
| `prompt-engineer/` | 插图 Prompt 模块化产物 |
| `data-model/` | SQLite schema 与 YouTube 数据流水线 |

---

## 五、当前角色分层 / Role Layers

### 5.1 架构层

| 角色 | 文件 |
|------|------|
| 总负责人 | `team-lead/general-director-guide.md` |
| 文档架构负责人 | `team-lead/documentation-architect-guide.md` |

### 5.2 执行层

| 角色 | 文件 |
|------|------|
| 视频调研员 | `video-researcher/video-research-guide.md` |
| 文章调研员 | `article-researcher/article-research-guide.md` |
| 训练方案调研员 | `training-researcher/training-research-guide.md` |
| 运动员调研员 | `athlete-researcher/athlete-research-guide.md` |
| 内容纠错员 | `fact-checker/fact-checker-guide.md` |
| Prompt 工程师 | `prompt-engineer/prompt-restructuring-guide.md` |
| 插画师 | `illustrator/image-generation-guide.md` |
| 图片再生成 | `photo-regenerator/image-regeneration-guide.md` |
| 视频分析师（归档） | `archive/video-analyst/video-tagging-guide.md` |

### 5.3 工程与运维层

| 角色 | 文件 |
|------|------|
| 文件组织规范 | `frontend-engineer/file-organization-guide.md` |
| 版本管理规范 | `frontend-engineer/version-control-guide.md` |
| 视频整合规范 | `frontend-engineer/video-integration-guide.md` |
| 搜索增强规范 | `frontend-engineer/fuzzy-search-guide.md` |

---

## 六、文档分类标准 / Documentation Taxonomy

| 类型 | 目的 | 应包含 | 不应包含 |
|------|------|--------|---------|
| `framework` | 定义内容模型和边界 | ID、字段、分类、归属判断 | 当前进度、历史产出细节 |
| `guide` | 指导一个角色执行 | 输入、输出、步骤、质量门槛、停止条件 | 过多历史背景、重复目录地图 |
| `plan` | 描述跨角色改造方案 | 目标、阶段、依赖、交付物 | 角色级操作细节 |
| `report` | 记录一次执行结果 | 范围、产出、遗漏、结论 | 长期规则 |
| `reference` | 提供只读素材 | 表格、关键词库、案例 | 执行命令式要求 |
| `state` | 记录当前真实状态 | 数量、路径、当前激活文件 | 执行流程 |

---

## 七、使用规则 / Usage Rules

1. 任何 guide 要引用项目规模、目录、当前数据文件时，优先引用本文件。
2. 任何 framework 修改 ID、字段、分类时，应同步检查本文件的真源表。
3. 任何新增角色文档，先判断它属于 `framework / guide / plan / report / reference / state` 哪一类。
4. 如果某个文档里出现旧目录名、旧数量、旧路径，优先以本文件为准。

---

## 八、当前治理重点 / Current Governance Priorities

1. 清理各 guide 中残留的旧路径引用，如 `guides/`、`split-prompts/`、`video-research/`。
2. 统一各执行指南的开头结构：角色目标、输入、输出、边界、停止条件。
3. 将超长 guide 中的大表格和样例逐步拆到 `reference/`。
4. 让 `general-director-guide.md` 负责“怎么协调”，不再承担所有项目事实的真源角色。
