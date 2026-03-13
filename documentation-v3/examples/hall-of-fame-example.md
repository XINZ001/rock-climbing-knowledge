# 名人堂示例流程 / Hall of Fame Example

> **目标**：用一个真实但简化的例子，说明 V3 体系如何工作。

---

## 一、用户需求

“我要增加一个名人堂主题，先做第一批 5 位代表人物，并最终能在前端展示。”

---

## 二、Team Lead 产出什么

Team Lead 输出一份 `Plan`：

### 这份 Plan 会说明

1. 本轮目标：
   - 先做 5 位人物
2. 需要的 bot：
   - Content Bot
   - Video Bot
   - Image Bot
   - Frontend Integrator
3. 不需要的 bot：
   - 例如某些无关的训练或纠错 bot
4. 并行关系：
   - Content / Video / Image 可并行
   - Frontend Integrator 等待三者产出后再开始

---

## 三、Task Architect 怎么拆

Task Architect 会生成：

1. `task-hof-content-batch-01.md`
2. `task-hof-video-batch-01.md`
3. `task-hof-image-batch-01.md`
4. `status-board-hof-batch-01.md`

每个任务包都会附带：
- 输入
- 输出
- 范围
- 停止条件
- self-check 标准

---

## 四、三个 bot 怎么执行

### Content Bot

产出：
- `hall-of-fame-content-draft.json`
- `hall-of-fame-content-self-check.md`

### Video Bot

产出：
- `hall-of-fame-video-draft.json`
- `hall-of-fame-video-self-check.md`

### Image Bot

产出：
- `hall-of-fame-image-draft/`
- `hall-of-fame-image-self-check.md`

---

## 五、中间为什么不需要你人工审很多次

因为这三个 bot 完成后，不直接找你。

它们先：
1. 做 self-check
2. 进入 `Draft Bundle`

Draft Bundle 只负责说明：
- 哪些草案通过了自检
- 哪些草案需要返工

---

## 六、Frontend Integrator 这时做什么

Frontend Integrator 拿到 Draft Bundle 后，统一整合成：

1. `hall-of-fame-runtime-draft.json`
2. 页面接入结果
3. 一个整合报告

这时你看到的是一个**整体结果**，而不是三个分散的小结果。

---

## 七、你最后只看什么

你只看：

1. 整合后的 runtime draft
2. 页面预览
3. final review gate

然后你做一次总判断：

- 通过
- 部分通过
- 返工

---

## 八、为什么这套比旧方式更稳

1. 你仍然能并行调用多个 bot
2. 你不需要中间多次人工 review
3. 前端拿到的是统一整理后的结果
4. Task Architect 负责的是编排，不是增加管理负担
