# 文档体系 V2 提案 / Documentation System V2 Proposal

> **目的**：这是一套并行的新文档体系提案，用来替代当前“按专题不断追加 bot 和 guide”的工作方式。
> **状态**：提案草案，不替换现有文件。

---

## 一、这套 v2 想解决什么问题

当前工作流的主要痛点：

1. 新主题一来就倾向于新建一整套 bot
2. 输出格式容易随任务变化而漂移
3. 单次任务上下文太大，执行 bot 容易崩
4. 新内容很难判断如何接入现有工具链

v2 的核心思想是：

- **主题用 framework 管**
- **执行用 capability guide 管**
- **每次真正跑任务时只发 task packet**

---

## 二、目录结构

```
documentation-v2/
├── README.md
├── architecture-overview.md
├── project-state.md
├── operator-playbook.md
├── automation-strategy.md
├── task-packet-template.md
├── new-theme-onboarding-template.md
├── review-gate-template.md
├── integration-handoff-template.md
├── migration-map.md
├── frameworks/
│   ├── knowledge-base-framework.md
│   ├── training-manual-framework.md
│   └── hall-of-fame-framework.md
└── roles/
    ├── team-lead-guide.md
    ├── documentation-architect-guide.md
    ├── content-researcher-guide.md
    ├── video-researcher-guide.md
    ├── image-production-guide.md
    ├── frontend-integration-guide.md
    └── fact-checker-guide.md
```

---

## 三、推荐阅读顺序

### 如果你想理解整体怎么运作

1. `architecture-overview.md`
2. `operator-playbook.md`
3. `automation-strategy.md`
4. `migration-map.md`

### 如果你想理解新主题怎么接入

1. `new-theme-onboarding-template.md`
2. `frameworks/hall-of-fame-framework.md`
3. `roles/team-lead-guide.md`

### 如果你想理解执行 bot 怎么复用

1. `roles/content-researcher-guide.md`
2. `roles/video-researcher-guide.md`
3. `roles/image-production-guide.md`
4. `roles/frontend-integration-guide.md`

---

## 四、和旧体系最大的区别

### 旧体系

- 一个主题经常对应一整套专属 bot
- guide 往往又长又混杂
- 任务、状态、规则容易写在一起

### 新体系

- 主题先定义成 `framework`
- bot 按能力复用
- Team Lead 只发小型 `task packet`
- 运行结果先进入 draft，再进前端运行时数据

---

## 五、你看这套 v2 时建议重点判断

1. 新主题是否更容易接入
2. 执行 bot 是否更容易复用
3. 输出是否更容易标准化
4. 任务是否更容易切小、暂停和恢复
5. 文档是否比现在更容易维护
