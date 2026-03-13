# 操作者手册 V4 / Operator Playbook

> **适用对象**：你作为操作者，每次要推进一个需求时，具体应该怎么走。

---

## 一、你的固定工作顺序

### Step 1：先清楚说出你的需求

例子：

- “我要新增一个攀岩名人堂”
- “我要给名人堂补第一批人物”
- “我要把这批内容接进前端”

你的需求最好明确到：
- 主题
- 目标
- 本轮范围

### Step 2：先找 Team Lead，不直接找执行 bot

你对 Team Lead 说的内容应该是：

- 这次要做什么
- 做到什么程度
- 你对数量、质量有没有明确期待

这一步不要直接让 Team Lead 开始写 task packet。

### Step 3：拿到 Plan 后交给 Architect

Architect 的任务不是重新理解你的需求，而是：

- 把 Plan 转成可执行大纲
- 为不同 bot 写任务文件

### Step 4：把各任务文件分发给对应的 Content Creator bots

这一步可以并行。

### Step 5：等内容组产出 draft

你不用逐个审。  
先让它们按 Architect 设计的格式产出。

### Step 6：交给 Frontend Integrator 做统一整理

这一步的目标是：
- 形成整体结果
- 让你能一次看清

### Step 7：你只在 Final Review Gate 做最终判断

你看的是整体预览，不是每个 bot 的内部小产物。

---

## 二、你每次实际会拿到什么文件

### 来自 Team Lead

- `plan.md`

### 来自 Architect

- `outline.md`
- `task-content-*.md`
- `status-board.md`

### 来自内容组

- `draft.json / draft.md`
- `report.md`

### 来自 Frontend Integrator

- `integrated draft`
- `integration report`
- 页面预览说明

### 你最终产出的判断

- `final review gate`

---

## 三、你不应该做的事

1. 不要让 Team Lead 同时做 Plan 和具体 task 设计
2. 不要让 Architect 同时做拆包和正式内容搜集
3. 不要让内容组直接把草案写进前端
4. 不要在中间频繁人工 review
5. 不要在没有整体结果时做最终判断

---

## 四、最小成功模式

如果你只想试运行一次，这套流程最小可以这样跑：

1. Team Lead 出 1 份 Plan
2. Architect 出 1 份 Outline + 3 份任务文件
3. 3 个 bot 并行产出 3 类 draft
4. Frontend Integrator 做 1 份整合稿
5. 你做 1 次最终 review
