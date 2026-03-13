# Sample Architect Outline: 攀岩名人堂 / Sample Hall of Fame Architect Outline

> **说明**：这是一份示范性的 Architect Outline，用于展示 Architect 在不越界做内容研究的前提下，应如何定义执行方向。

---

## 1. 对应 Plan

`hall-of-fame-plan-sample.md`

## 2. 本轮总体执行思路

本轮以“跑通名人堂最小闭环”为第一优先级，而不是追求最大覆盖率。  
因此本轮执行重点应放在：

1. 条目结构稳定
2. 三类内容可并行产出
3. 前端能整合成统一结果

## 3. 内容组整体搜索方向

### 内容方向

优先搜集以下维度：

1. 人物基本信息
2. 生涯摘要
3. 代表成就
4. 训练理念
5. 采访摘录

### 视频方向

优先搜集以下类型：

1. 采访
2. 训练公开视频
3. 经典表现分析

### 图片方向

优先形成以下资产：

1. 人物主视觉展示图
2. 可用于列表和详情页的统一风格图像

## 4. 各 bot 的边界

### Content Bot

负责人物档案文字内容，不负责视频和图片。

### Video Bot

负责视频资源，不负责人物正文。

### Image Bot

负责图像资产，不负责人物事实内容。

## 5. 输出格式要求

### Content Draft

至少包含：

- 基本信息
- 生涯摘要
- 代表成就
- 训练理念摘要
- 采访摘录
- 来源

### Video Draft

至少包含：

- 标题
- 链接
- 类型
- 与人物的关联说明

### Image Draft

至少包含：

- 文件路径
- 图片用途
- 生成说明或素材说明

## 6. 停止条件

每个内容 bot 只完成本轮任务文件所定义的范围，不自动扩展。

## 7. 任务文件列表

1. `hall-of-fame-content-task-sample.md`
2. `hall-of-fame-video-task-sample.md`
3. `hall-of-fame-image-task-sample.md`

## 8. 汇总交接方式

全部 draft 与 report 统一进入 `Draft Bundle`，再交给 Frontend Integrator 处理。
