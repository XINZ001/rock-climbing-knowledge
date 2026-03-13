# 文档体系 V3 / Documentation System V3

> **状态**：试运行版。
> **目的**：把你刚确认的新工作流固定成一套并行文档，不覆盖旧体系，也不覆盖 `documentation-v2/`。

---

## 一、这版和 v2 的核心区别

V3 重点解决一个问题：

**Task Architect 可以拆很多任务，但不能让你多次人工 review。**

因此 V3 的关键变化是：

1. Team Lead 先产出 `Plan`
2. Task Architect 只负责把 Plan 变成可并行执行的任务包
3. 各 bot 执行后先做 `self-check`
4. 内容先汇总成 `draft bundle`
5. 由 Frontend Integrator 统一整理
6. 你只看最后一次 `final review gate`

---

## 二、推荐阅读顺序

1. `architecture-overview.md`
2. `operator-execution-flow.md`
3. `roles/team-lead-guide.md`
4. `roles/task-architect-guide.md`
5. `templates/plan-template.md`
6. `templates/task-packet-template.md`
7. `templates/final-review-gate-template.md`
8. `examples/hall-of-fame-example.md`

---

## 三、目录结构

```
documentation-v3/
├── README.md
├── architecture-overview.md
├── operator-execution-flow.md
├── roles/
│   ├── team-lead-guide.md
│   ├── task-architect-guide.md
│   ├── capability-bot-contract.md
│   └── frontend-integrator-guide.md
├── templates/
│   ├── plan-template.md
│   ├── task-packet-template.md
│   ├── self-check-template.md
│   ├── draft-bundle-template.md
│   ├── final-review-gate-template.md
│   ├── integration-handoff-template.md
│   └── status-board-template.md
└── examples/
    └── hall-of-fame-example.md
```

---

## 四、你要重点看什么

如果你是从“现在这套怎么试起来”角度看，重点不是细节，而是这 4 件事：

1. Team Lead 和 Task Architect 的边界是否清楚
2. 中间检查是否真的可以不靠你人工介入
3. Frontend Integrator 是否成为唯一整合入口
4. 最终 review gate 是否足够让你一次判断整体结果
