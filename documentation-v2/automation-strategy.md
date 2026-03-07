# 自动化方案 V2 / Automation Strategy

> **目标**：让工作流从“靠聊天记住状态”变成“靠任务包和可恢复产物运行”。

---

## 一、自动化的最小闭环

```mermaid
flowchart LR
    A["需求"] --> B["Team Lead"]
    B --> C["Task Packet"]
    C --> D["Capability Bot"]
    D --> E["Draft Output"]
    E --> F["Review Gate"]
    F --> G["Integration Bot"]
    G --> H["Runtime Data / Frontend"]
```

---

## 二、自动化的关键不是更聪明的 bot，而是更稳定的接口

### 你要固定的接口

1. `framework`
2. `task packet`
3. `draft output`
4. `review decision`
5. `integration handoff`

只要这 5 个接口固定，bot 可以替换，主题可以扩展。

---

## 三、建议固定的中间产物

### 1. task packet

定义本轮任务。

### 2. draft registry

用于承接研究类产物。

### 3. batch report

用于承接本轮摘要、遗漏和风险。

### 4. review note

用于人工确认：

- 通过
- 退回
- 部分通过

### 5. integration note

告诉前端整合 bot：

- 哪些 draft 可以写入 runtime
- 要改哪些页面或组件

---

## 四、为什么这能减少上下文崩溃

因为 bot 不再依赖会话记忆，而依赖文件状态：

- 当前做哪一批
- 已完成什么
- 哪些跳过
- 哪些待补
- 下一步建议是什么

---

## 五、推荐的自动化边界

### 可以自动化的

- 批次切分
- 研究类草案生成
- 视频与图片草案生成
- 整合到 draft registry
- 简单格式校验

### 先不要全自动的

- framework 改动
- 跨主题 schema 变化
- 大批量直接写 runtime data
- 有争议内容的最终结论

---

## 六、推荐的任务节奏

1. Team Lead 生成任务包
2. 执行 bot 只做一个批次
3. 人工 review
4. 通过后再整合
5. 再进入下一批

这套节奏比“让 bot 一口气跑完整个主题”更慢，但更稳。
