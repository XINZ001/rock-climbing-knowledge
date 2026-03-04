# 攀岩知识库插图批量生成指南 / Image Generation Guide

> **状态**：Prompt 已全部拆分完毕（288 张），本文档指导 AI **逐模块批量生成图片**。
> **关键要求**：每完成一个模块就停下来，等人工审核通过后再继续下一个模块。

---

## 1. Prompt 数据源

所有 Prompt 已按模块拆分为独立文件，存放在 `split-prompts/` 文件夹中：

| 文件 | 模块 | Prompt 数量 |
|------|------|------------|
| `module-01-overview.md` | 攀岩概览 | 22 |
| `module-02-fitness.md` | 身体素质 | 36 |
| `module-03a-technique.md` | 攀爬技术（前半） | 33 |
| `module-03b-technique.md` | 攀爬技术（后半） | 22 |
| `module-04-psychology.md` | 心理与策略 | 12 |
| `module-05-equipment.md` | 装备知识 | 33 |
| `module-06-safety.md` | 安全与风险 | 27 |
| `module-07-injury.md` | 伤病预防 | 28 |
| `module-08-outdoor.md` | 户外攀岩 | 30 |
| `module-09-special-groups.md` | 特殊人群 | 23 |
| `module-10-competition.md` | 竞技攀岩 | 22 |
| **合计** | | **288** |

### Prompt 格式说明

每条 Prompt 的结构如下：

```markdown
### {编号}. {kp-id}
- **原始来源**: {原始知识点 ID}
- **标题**: {中文标题} / {English Title}
- **布局类型**: Type A / B / C / D / E / F
- **Prompt**: {完整的英文 Prompt，直接送入图片生成 API}
```

**你的唯一任务是：读取 `Prompt` 字段内容 → 送入图片生成 API → 保存图片。**
不要自行修改或编造 Prompt。

---

## 2. 统一风格规范

所有 Prompt 已内嵌统一的风格前缀和后缀，无需额外添加。生成时确保输出满足以下要求：

### 视觉风格
- **线稿风格**：干净的教学示意图，**不是照片写实风**
- **配色**：仅使用 forest green `#4A7C59` + warm gray + 白色背景
- **人物**：简笔画风格攀岩者，**无面部细节**
- **无多余装饰**：无背景风景、无渐变、无阴影

### 图片尺寸
- **比例**：1:1 正方形
- **分辨率**：1024×1024 像素
- **格式**：PNG

### 关于图内文字
- Prompt 中描述的 labels 和 annotations 保留为英文（如 "Full Crimp"、"90°"）
- 图片 AI 对英文渲染质量远高于中文，所以标注一律英文
- 中文翻译由应用前端叠加，不需要在图片中出现

---

## 3. 文件命名与存放

### 命名规则

从 Prompt 的编号标题中提取 `kp-id` 作为文件名：

```
标题: ### 2-1a. kp-grip-types-full-crimp
文件名: kp-grip-types-full-crimp.png
```

**注意**：拆分后的 Prompt 产生了带后缀的新 ID（如 `kp-grip-types-full-crimp`），使用完整的新 ID 作为文件名。

### 存放目录

```
rock-climbing-knowledge/public/images/illustrations/
```

如果目录不存在，先创建：
```bash
mkdir -p rock-climbing-knowledge/public/images/illustrations/
```

### 完整路径示例

```
rock-climbing-knowledge/public/images/illustrations/kp-grip-types-full-crimp.png
rock-climbing-knowledge/public/images/illustrations/kp-hangboard-training.png
rock-climbing-knowledge/public/images/illustrations/kp-climbing-categories-sport.png
```

---

## 4. ⭐ 逐模块生成流程（最重要的部分）

### 4.1 核心规则：生成一个模块 → 停下来 → 等人工审核 → 再继续

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   读取模块 N 的 Prompt 文件                                   │
│        ↓                                                    │
│   逐条生成该模块的所有图片                                      │
│        ↓                                                    │
│   输出该模块的生成报告                                         │
│        ↓                                                    │
│   ⏸️  停下来，等待人工审核                                     │
│        ↓                                                    │
│   人工反馈：                                                  │
│     ✅ 全部通过 → 进入模块 N+1                                │
│     🔄 部分需重做 → 按反馈重新生成指定图片 → 再次审核            │
│     ❌ 风格不对 → 调整参数/Prompt → 重做整个模块                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 生成顺序

按以下顺序逐模块处理。**不要跳模块，不要一次性生成所有。**

| 批次 | 文件 | 数量 | 说明 |
|------|------|------|------|
| **Batch 1** | `module-01-overview.md` | 22 | 先做这个模块作为**风格校准**，确认输出风格满意后再继续 |
| **Batch 2** | `module-02-fitness.md` | 36 | 包含大量手指/身体细节，是质量验证的关键模块 |
| **Batch 3** | `module-03a-technique.md` | 33 | 攀爬技术前半 |
| **Batch 4** | `module-03b-technique.md` | 22 | 攀爬技术后半 |
| **Batch 5** | `module-04-psychology.md` | 12 | 最少的模块，信息图为主 |
| **Batch 6** | `module-05-equipment.md` | 33 | 装备解剖图，细节要求高 |
| **Batch 7** | `module-06-safety.md` | 27 | 安全操作演示 |
| **Batch 8** | `module-07-injury.md` | 28 | 解剖/医学图 |
| **Batch 9** | `module-08-outdoor.md` | 30 | 户外场景 |
| **Batch 10** | `module-09-special-groups.md` | 23 | 特殊人群 |
| **Batch 11** | `module-10-competition.md` | 22 | 竞技攀岩 |

### 4.3 每个批次的执行步骤

以 Batch 1 为例：

```
Step 1 — 读取
  读取 split-prompts/module-01-overview.md
  解析出 22 条 Prompt（编号 1-1a 到 1-12）

Step 2 — 检查已有文件
  检查 rock-climbing-knowledge/public/images/illustrations/ 中
  是否已存在对应的 .png 文件
  如果已存在 → 跳过（除非人工要求重做）

Step 3 — 逐条生成
  对每条 Prompt：
    a. 提取 Prompt 字段的完整文本
    b. 调用图片生成 API（参数见下方 §5）
    c. 保存为 {kp-id}.png
    d. 记录生成状态（成功/失败/跳过）

Step 4 — 输出生成报告
  生成 Batch 1 的完整报告（格式见下方 §6）

Step 5 — ⏸️ 停下来
  告诉用户："模块 1 已生成完毕，共 22 张图片，请检查。"
  等待用户反馈后再继续。
```

### 4.4 ⚠️ 第一个模块是风格校准

Batch 1（模块 1：攀岩概览）具有特殊作用——**它是风格校准批次**。

```
在 Batch 1 完成后，人工审核应重点关注：
  1. 线稿风格是否满意？（太写实？太卡通？）
  2. 颜色是否准确（forest green #4A7C59）？
  3. 人物风格是否接受？
  4. 标注文字的清晰度？
  5. 白底留白是否足够？

如果风格需要系统性调整，将在此时修正，避免后续 266 张图白做。
可能的调整手段：
  - 在所有 Prompt 前缀后追加额外指令（如 "flat colors only, no shading, no gradient"）
  - 更换图片生成模型/参数
  - 调整 API 的 style 参数
```

---

## 5. 图片生成 API 参数

根据你使用的图片生成工具，参考以下参数设置：

### 通用参数

```json
{
  "prompt": "{从 Prompt 字段提取的完整文本}",
  "size": "1024x1024",
  "quality": "high",
  "style": "natural",
  "format": "png"
}
```

### 如果使用 DALL-E 3

```json
{
  "model": "dall-e-3",
  "prompt": "{Prompt 字段}",
  "n": 1,
  "size": "1024x1024",
  "quality": "hd",
  "style": "natural"
}
```

### 如果使用 Midjourney

```
{Prompt 字段} --ar 1:1 --style raw --v 6.1
```

### 如果使用 Gemini Imagen / 其他

按工具要求传入 Prompt 文本，确保：
- 输出 1:1 正方形
- 不要追加额外的 style 参数覆盖 Prompt 中已有的风格指令

### 失败重试策略

```
如果生成失败：
  1. 等待 5 秒后重试（可能是 rate limit）
  2. 最多重试 3 次
  3. 如果仍然失败，记录到报告中，标记为 ❌ FAILED
  4. 不要修改 Prompt 自行重试 — 等待人工审核时一并反馈
```

---

## 6. 生成报告格式

每个批次完成后，必须输出以下格式的报告：

```markdown
# Batch {N} 生成报告 — 模块 {模块名}

**生成时间**: {YYYY-MM-DD HH:MM}
**Prompt 来源**: split-prompts/module-{XX}-{name}.md
**总数**: {X} 张
**成功**: {X} 张
**失败**: {X} 张
**跳过（已存在）**: {X} 张

## 生成结果明细

| # | Prompt ID | 文件名 | 状态 | 备注 |
|---|-----------|--------|------|------|
| 1 | kp-climbing-categories-sport | kp-climbing-categories-sport.png | ✅ 成功 | |
| 2 | kp-climbing-categories-trad | kp-climbing-categories-trad.png | ✅ 成功 | |
| 3 | kp-climbing-origins | kp-climbing-origins.png | ❌ 失败 | API timeout，已重试 3 次 |
| 4 | kp-grading-systems | kp-grading-systems.png | ⏭️ 跳过 | 文件已存在 |

## ⏸️ 等待审核

请检查以下目录中的图片：
rock-climbing-knowledge/public/images/illustrations/

### 审核要点
1. 风格是否一致（线稿、绿+灰、白底）？
2. 内容是否匹配 Prompt 描述的教学目标？
3. 攀岩装备/动作是否画对了？（参考下方常见错误清单）
4. 哪些图需要重新生成？

### 请回复以下之一
- ✅ "全部通过" → 我将继续生成下一个模块
- 🔄 "以下需要重做: {ID 列表}" → 我将重新生成指定图片
- 🔄 "以下需要重做并修改 Prompt: {ID + 修改说明}" → 我将调整 Prompt 后重做
- ❌ "风格需要调整: {说明}" → 我将调整后重做整个模块
```

---

## 7. 单张重新生成

当审核后需要重做某些图时：

```
Step 1: 定位 Prompt
  在对应模块的 split-prompts/module-XX-YYY.md 中
  搜索 kp-id 找到对应 Prompt

Step 2: 重新生成
  使用完全相同的 Prompt 重新生成
  （除非人工明确要求修改 Prompt）

Step 3: 覆盖保存
  新图片覆盖旧文件，保持文件名不变

Step 4: 更新报告
  在报告中标记为 "🔄 已重做"
```

### 如果人工要求修改 Prompt

| 情况 | 处理方式 |
|------|---------|
| 微调措辞（如 "改成 front view"） | 修改 Prompt → 重新生成 → 同步回 split-prompts 文件 |
| 内容有误（如 "装备画法不对"） | 在 Prompt 中补充更精确描述 → 重新生成 → 同步回文件 |
| 风格系统性问题（如 "全部太写实"） | 修改所有 Prompt 的前缀 → 重做整个模块 → 同步到全部文件 |

---

## 8. 质量检查清单

### AI 自查（每张图生成后立即检查）

生成图片后，在可能的情况下对图片进行基本验证：

- [ ] 图片是否成功生成（不是空白/错误图）？
- [ ] 图片尺寸是否为 1024×1024？
- [ ] 文件名是否严格匹配 kp-id？
- [ ] 文件是否成功保存到目标目录？

### 人工审核（每个模块完成后）

以下是人工审核时的关注要点：

**风格一致性**
- [ ] 整体风格在模块内是否一致？
- [ ] 与前一个模块的风格是否一致？
- [ ] 是否为线稿而非写实渲染？
- [ ] 颜色是否仅有 green + gray + white？

**攀岩内容正确性**（重点！）
- [ ] 攀岩鞋有没有画成运动鞋/登山靴？
- [ ] 锁扣（carabiner）有没有画成圆环？
- [ ] 头盔有没有画成建筑安全帽？
- [ ] 攀岩者的手指数量对不对（5 根）？
- [ ] 绳子有没有穿过固体物体？
- [ ] Cam（机械塞）有没有画成随机金属块？
- [ ] 正误对比图（Type B）的左右方向是否统一（LEFT=错 RIGHT=对）？
- [ ] 攀岩者身体姿态是否合理（不漂浮、有重力感）？

**标注与排版**
- [ ] 标注文字是否可读？
- [ ] 留白是否充足？
- [ ] 箭头和标注是否清晰？

---

## 9. 快速启动 Checklist

开始第一个批次前，确认以下事项：

```
□ split-prompts/ 文件夹存在且包含 11 个 .md 文件（共 288 条 Prompt）
□ 目标目录已创建: rock-climbing-knowledge/public/images/illustrations/
□ 图片生成 API 可用且有足够配额（288 张 × 可能的重试）
□ 已选择从 module-01-overview.md 开始（风格校准批次）
□ 理解"生成一个模块 → 输出报告 → 停下等审核 → 再继续"的流程
□ 不会一次性生成所有模块
```

准备就绪后，开始 **Batch 1: module-01-overview.md（22 张）**。

---

## 附录 A：布局类型速查

Prompt 中标注的布局类型含义（供审核参考）：

| 类型 | 说明 | 预期构图 |
|------|------|---------|
| Type A | 单技术动作 | 居中主体 60-70%，2-4 个标注箭头 |
| Type B | 正误对比 | 左右分栏，LEFT=✗ RIGHT=✓ |
| Type C | 步骤序列 | 左→右水平排列 2-4 步，编号+箭头 |
| Type D | 装备解剖 | 居中装备 50%，周围引线+标签 |
| Type E | 数据/信息图 | 图表/时间线/流程图 |
| Type F | 解剖/医学 | 身体部位居中 60%，精确解剖标签 |

## 附录 B：进度追踪模板

维护一个全局进度文件 `generation-progress.md`：

```markdown
# 插图生成进度 / Generation Progress

| 批次 | 模块 | 总数 | 成功 | 失败 | 审核状态 | 备注 |
|------|------|------|------|------|---------|------|
| Batch 1 | 01-概览 | 22 | — | — | ⏳ 未开始 | 风格校准批次 |
| Batch 2 | 02-身体素质 | 36 | — | — | ⏳ 未开始 | |
| Batch 3 | 03a-技术前 | 33 | — | — | ⏳ 未开始 | |
| Batch 4 | 03b-技术后 | 22 | — | — | ⏳ 未开始 | |
| Batch 5 | 04-心理 | 12 | — | — | ⏳ 未开始 | |
| Batch 6 | 05-装备 | 33 | — | — | ⏳ 未开始 | |
| Batch 7 | 06-安全 | 27 | — | — | ⏳ 未开始 | |
| Batch 8 | 07-伤病 | 28 | — | — | ⏳ 未开始 | |
| Batch 9 | 08-户外 | 30 | — | — | ⏳ 未开始 | |
| Batch 10 | 09-特殊人群 | 23 | — | — | ⏳ 未开始 | |
| Batch 11 | 10-竞技 | 22 | — | — | ⏳ 未开始 | |
| **合计** | | **288** | | | | |

审核状态说明：
⏳ 未开始 | 🔄 生成中 | 👀 待审核 | ✅ 已通过 | 🔁 需重做
```
