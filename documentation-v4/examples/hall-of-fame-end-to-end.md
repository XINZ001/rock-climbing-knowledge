# 名人堂端到端示例 V4 / Hall of Fame End-to-End Example

> **目的**：演示在 V4 中，“名人堂”这个需求从 Team Lead 到最终 review 是怎么跑的。

---

## 一、用户需求

“我要新增一个攀岩名人堂，首轮先做一小批人物，并能在前端看到。”

---

## 二、Team Lead 这一轮做什么

Team Lead 不去决定具体人物细节，而是输出一份 `Plan`，明确：

1. 这是一个新主题还是已有主题扩展
2. 本轮目标是什么
3. 需要哪些 bot
4. 本轮数量、质量、展示目标
5. 最终怎样算成功

例如，Team Lead 会说：

- 需要 Content Bot、Video Bot、Image Bot、Frontend Integrator
- 这轮先做一小批
- 目标是跑通完整闭环，而不是做完全部名人堂

---

## 三、Architect 这一轮做什么

Architect 读取 Plan 后，不直接搜集内容，而是输出：

1. 一份 `Outline`
2. 多份具体任务文件
3. 一份状态板

### Architect 会决定

- 内容组应该优先搜什么维度
- 视频组应该搜什么类型的视频
- 图片组应该做什么类型的图
- 每个 bot 到哪里停

### Architect 不会决定

- 最终是否通过
- 前端最后怎么审

---

## 四、Content Creator Group 这一轮做什么

### Content Bot

可能负责：

- 人物基本信息
- 生涯摘要
- 代表成就
- 训练理念
- 采访摘录

输出：
- `hall-of-fame-content-draft.*`
- `hall-of-fame-content-report.md`

### Video Bot

可能负责：

- 人物采访
- 训练公开视频
- 经典表现分析视频

输出：
- `hall-of-fame-video-draft.*`
- `hall-of-fame-video-report.md`

### Image Bot

可能负责：

- 人物主视觉图
- 头像或展示卡图

输出：
- `hall-of-fame-image-draft/`
- `hall-of-fame-image-report.md`

---

## 五、Frontend Integrator 这一轮做什么

它拿到三个 draft 后，统一整理成：

1. `integrated hall-of-fame draft`
2. 页面接入结果
3. 预览说明

这时操作者看到的是一个整体结果，而不是三个零散包。

---

## 六、Final Review Gate 在这里怎么起作用

操作者只在这一步做一次总审：

1. 这轮目标有没有达到
2. 内容、视频、图片是否形成整体
3. 页面是否达到最小可用状态
4. 哪些通过，哪些返工

---

## 七、为什么这套比旧方式更适合试运行

1. Team Lead 不越界做执行拆包
2. Architect 不越界做内容研究
3. 内容组职责明确
4. Frontend Integrator 成为唯一整合入口
5. 最终 review 只发生一次
