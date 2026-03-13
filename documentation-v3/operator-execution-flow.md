# 你的执行流程 V3 / Operator Execution Flow

> **适用对象**：你作为操作者，面对一个新需求时，应该如何实际推进。

---

## 一、标准操作顺序

### Step 1：提需求

你给出的输入应该像这样：

- “我要增加一个名人堂主题”
- “我要补名人堂第一批 5 位人物”
- “我要把名人堂接入前端”

### Step 2：找 Team Lead 出 Plan

你让 Team Lead 先回答：

1. 这次目标是什么
2. 需要哪些 bot
3. 哪些可以并行
4. 最终要交付什么

### Step 3：把 Plan 交给 Task Architect

Task Architect 不重做需求判断，只做拆包：

- 给每个 bot 一份专属任务包
- 给每个包定义自检标准
- 给整轮任务生成状态板

### Step 4：并行交给各 bot 执行

这时你通常可以同时启动：

- Content Bot
- Video Bot
- Image Bot

### Step 5：等所有 bot 产出 draft

这里你不做逐个 review。  
它们只需要：

- 完成自己的任务
- 做 self-check
- 输出草案

### Step 6：交给 Frontend Integrator 汇总

Frontend Integrator 会把这些分散草案整理成：

- runtime draft
- 页面接入结果
- 预览说明

### Step 7：你只做最后一次 review

你看的对象不是三个 bot 的内部小结果，而是：

- 整体主题是否成立
- 前端是否能展示
- 哪些缺口需要返工

---

## 二、你不应该做的事

1. 不要直接把大需求扔给执行 bot
2. 不要在中途分别人工 review 每一个 bot 的小产物
3. 不要让研究 bot 直接改前端
4. 不要让 Frontend Integrator 自己猜内容结论

---

## 三、你实际拿到的文件顺序

1. `Plan`
2. `Task Packets`
3. `Self-check Results`
4. `Draft Bundle`
5. `Integrated Runtime Draft`
6. `Final Review Gate`

这个顺序固定后，你每次推进都会稳很多。
