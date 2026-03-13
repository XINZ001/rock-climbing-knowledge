# 文档体系 V4 / Documentation System V4

> **状态**：提案草案，不覆盖现有文档。
> **目标**：将最终确认的工作流固定为一套更详细、更可执行的文档体系。

---

## 一、V4 的最终工作流

V4 只采用你最终确认的这条链路：

1. `Team Lead`
2. `Architect`
3. `Content Creator Group`
4. `Frontend Integrator`
5. `Final Review Gate`

这版不再引入 `Discovery` 作为默认环节，也不把 `Task Architect` 单独定义成独立的 review 管理者。  
如果后面需要额外的预处理步骤，应由 `Team Lead` 在计划中显式声明，而不是默认为系统固定节点。

---

## 二、这版要解决的问题

1. 让 `Team Lead` 只负责目标、范围、调用关系和成功标准
2. 让 `Architect` 只负责把计划翻译为执行大纲和任务文件
3. 让 `Content Creator Group` 真正负责内容搜集和草案生产
4. 让 `Frontend Integrator` 成为唯一整合入口
5. 让人工 review 只在最终整体结果上发生

---

## 三、推荐阅读顺序

1. `architecture-overview.md`
2. `operator-playbook.md`
3. `roles/team-lead-guide.md`
4. `roles/architect-guide.md`
5. `roles/content-creator-guide.md`
6. `roles/frontend-integrator-guide.md`
7. `roles/final-review-guide.md`
8. `templates/plan-template.md`
9. `templates/architect-outline-template.md`
10. `examples/hall-of-fame-end-to-end.md`

---

## 四、目录结构

```
documentation-v4/
├── README.md
├── architecture-overview.md
├── operator-playbook.md
├── roles/
│   ├── team-lead-guide.md
│   ├── architect-guide.md
│   ├── content-creator-guide.md
│   ├── frontend-integrator-guide.md
│   └── final-review-guide.md
├── templates/
│   ├── plan-template.md
│   ├── architect-outline-template.md
│   ├── content-task-template.md
│   ├── content-report-template.md
│   ├── draft-bundle-template.md
│   ├── integration-handoff-template.md
│   ├── final-review-gate-template.md
│   └── status-board-template.md
└── examples/
    ├── hall-of-fame-end-to-end.md
    ├── hall-of-fame-plan-sample.md
    ├── hall-of-fame-architect-outline-sample.md
    ├── hall-of-fame-content-task-sample.md
    ├── hall-of-fame-video-task-sample.md
    ├── hall-of-fame-image-task-sample.md
    ├── hall-of-fame-integration-handoff-sample.md
    └── hall-of-fame-final-review-sample.md
```

---

## 五、这套体系的核心思想

### Team Lead 负责“做什么”

- 为什么做
- 做到什么程度
- 调谁来做
- 怎么才算完成

### Architect 负责“怎么拆”

- 该往哪里搜
- 每个 bot 的任务边界是什么
- 输出格式是什么
- 批次怎么切

### Content Creator Group 负责“真的去做”

- 搜集
- 记录
- 结构化
- 产出 draft

### Frontend Integrator 负责“把结果接起来”

- 汇总 draft
- 统一格式
- 接入前端

### Final Review Gate 负责“最后一次人审”

- 通过
- 返工
- 部分通过

---

## 六、你看这版时建议重点判断

1. `Plan` 是否足够高层但又不空泛
2. `Architect Outline` 是否比直接写 task packet 更适合作为中间层
3. `Content Creator Group` 是否真的拿到文件就能执行
4. `Frontend Integrator` 是否不会被迫补脑
5. 最终 review 是否能只做一次整体把关
