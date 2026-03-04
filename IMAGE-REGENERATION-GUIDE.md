# 问题图片修复指南 / Image Regeneration Guide (img2img)

> **定位**：当初次生成的配图存在内容错误时，通过参考真实图片重新生成。
> **前置依赖**：本文档与 `IMAGE-GENERATION-GUIDE.md` 配合使用。初次生成按那个文件执行，修复问题图片按本文件执行。
> **触发方式**：用户手动提供一批需要修复的图片文件名列表。

---

## 1. 整体流程

```
用户（网站线上）反馈图片有问题
        ↓
项目负责人收到反馈，收集问题图片文件名
        ↓
项目负责人把文件名列表发给你（配图生成 bot）
        ↓
┌──────────────────────────────────────────┐
│  你（bot）的工作从这里开始：              │
│                                          │
│  Step 1: 接收文件名列表                   │
│  Step 2: 反查知识点 + 原始 Prompt         │
│  Step 3: 搜索正确的参考图片（3-5 张）     │
│  Step 4: 展示候选图，等用户确认           │
│  Step 5: 用参考图 + 风格提示词生成新图     │
│  Step 6: 输出结果，等用户确认替换         │
└──────────────────────────────────────────┘
```

---

## 2. Step 1 — 接收输入

### 输入格式

用户会以文件名列表的形式告诉你哪些图需要修复：

```
需要修复的图片：
- kp-figure-eight-knot.png
- kp-cam-mechanism.png
- kp-finger-pulley-anatomy.png
```

或者简写为：

```
修复：kp-figure-eight-knot, kp-cam-mechanism, kp-finger-pulley-anatomy
```

### 你需要从文件名中提取的信息

文件名即为 kp-id（去掉 `.png` 后缀）。用这个 kp-id 可以反查到：

| 需要的信息 | 从哪里找 |
|-----------|---------|
| 原始 Prompt | `split-prompts/module-XX-YYY.md` 中搜索该 kp-id |
| 所属模块 | Prompt 所在的文件即为所属模块 |
| 布局类型 | Prompt 条目中的 `布局类型` 字段 |
| 原始来源知识点 | Prompt 条目中的 `原始来源` 字段 |
| 中文标题 | Prompt 条目中的 `标题` 字段 |

### 反查示例

输入：`kp-figure-eight-knot.png`

1. 在 `split-prompts/` 目录下搜索 `kp-figure-eight-knot`
2. 找到所在文件（如 `module-06-safety.md`）
3. 提取该条目的完整信息：
   - 标题：八字结 / Figure Eight Knot
   - 布局类型：Type C（步骤序列）
   - 原始 Prompt：`Instructional climbing diagram...`
   - 原始来源：`kp-figure-eight-knot`

---

## 3. Step 2 — 分析错误类型

在搜索参考图之前，先判断原始图片出了什么问题。常见的错误类型：

| 错误类型 | 典型表现 | 搜索参考图的方向 |
|---------|---------|----------------|
| 结构错误 | 绳结穿法不对、cam 的凸轮结构画错 | 搜索该装备/绳结的技术图解 |
| 解剖错误 | 肌肉/肌腱位置不对、关节方向错误 | 搜索医学/运动解剖图 |
| 动作错误 | 攀岩姿势不合理、重心违反物理 | 搜索该技术的教学照片/图解 |
| 装备外形错误 | 攀岩鞋画成运动鞋、头盔画成安全帽 | 搜索该装备的产品图/示意图 |
| 比例错误 | 人和岩壁比例失调、装备大小不对 | 搜索有人物对比的实拍/图解 |
| 细节遗漏 | 缺少关键部件（如快挂的狗骨、cam 的触发杆） | 搜索该装备的爆炸图/解剖图 |

### 高频出错的图片类型

以下类型的图片在 AI 初次生成时最容易出错，修复时要格外仔细确认参考图的准确性：

1. **绳结**（八字结、布林结、双套结等）— AI 难以正确表现绳子的穿越关系
2. **机械装置**（cam、滑轮系统、保护器）— 内部机械结构容易画错
3. **解剖图**（手指滑车、肩袖肌群、脚踝结构）— 肌腱/韧带的位置和走向
4. **裂缝技术截面**（hand jam、fist jam）— 手在裂缝中的姿态和受力方向
5. **多步骤操作**（保护站搭建、下降器安装）— 绳子的穿越路径

---

## 4. Step 3 — 搜索参考图片

### 搜索策略

根据知识点和错误类型，搜索 3-5 张正确的参考图片。搜索顺序：

**优先级 1：技术图解 / 教学插图**
- 搜索关键词：`{英文知识点名} diagram`、`{英文知识点名} illustration`、`{英文知识点名} technical drawing`
- 来源：攀岩教材、认证机构教材（如 AMGA、SPI）

**优先级 2：装备制造商官方图**
- 搜索关键词：`{装备名} {品牌} diagram`
- 来源：Petzl、Black Diamond、DMM 等品牌的产品技术图
- 这类图通常结构最准确

**优先级 3：专业攀岩网站的教学图**
- 搜索关键词：`{英文知识点名} technique tutorial`
- 来源：VDiff Climbing、REI Expert Advice、Climbing Magazine 等

**优先级 4：清晰的教学照片**
- 搜索关键词：`{英文知识点名} climbing photo`
- 用于验证动作姿态和比例关系

### 搜索关键词模板

| 图片类型 | 搜索关键词模板 |
|---------|-------------|
| 绳结 | `{knot name} tying steps diagram`, `{knot name} climbing illustration` |
| 装备结构 | `{equipment name} anatomy diagram`, `{equipment name} parts labeled` |
| 攀岩动作 | `{technique name} climbing technique diagram`, `{technique name} body position` |
| 解剖图 | `{body part} climbing injury anatomy`, `{body part} medical illustration` |
| 保护系统 | `{system name} setup diagram`, `{system name} rigging illustration` |

### 候选图要求

每张候选图必须满足：
- [ ] 内容正确（这是最重要的！参考图的意义就在于内容准确）
- [ ] 关键结构清晰可辨
- [ ] 分辨率足够看清细节
- [ ] 与目标布局类型（Type A-F）匹配或可适配

---

## 5. Step 4 — 展示候选图并等待确认

### 展示格式

```markdown
## 修复图片：kp-figure-eight-knot

**标题**: 八字结 / Figure Eight Knot
**布局类型**: Type C — 步骤序列
**错误原因**: 原图绳子穿越关系不正确，第二步和第三步的绳圈方向画反了

### 候选参考图

| # | 来源 | 说明 | 可行性评估 |
|---|------|------|-----------|
| 1 | {来源描述} | 四步分解图，绳子穿越关系清晰 | 推荐 — 步骤拆解与目标一致 |
| 2 | {来源描述} | 最终形态特写，结构正确 | 可用 — 但缺少中间步骤 |
| 3 | {来源描述} | 手绘技术图，带箭头标注 | 可用 — 风格接近目标 |

### 我的建议
推荐使用 **候选图 #1** 作为参考：步骤拆解清晰，绳子的穿越路径在每一步都能看清。

⏸️ 请确认：
- 选择哪张参考图？（编号）
- 是否需要我搜索更多候选？
- 对生成方向有什么补充说明？
```

**必须等用户确认后才能进入下一步。不要自行选择参考图直接生成。**

---

## 6. Step 5 — 使用参考图 + 风格提示词生成

### 核心原则

> **内容来自参考图，文字提示词只负责风格。**

img2img 的本质是：让 AI 模仿参考图的内容结构，但输出项目统一的视觉风格。所以提示词中不再描述"画什么"，只描述"画成什么样子"。

### 风格提示词模板

以下是通用的风格提示词，适用于所有布局类型：

```
Instructional climbing diagram, clean line art style, minimal colors using only
forest green #4A7C59 and warm gray on a pure white background. Simple human
figures with no facial features. Clean thin annotation arrows, sans-serif labels
in English. Generous white space margins on all sides. No background scenery,
no decorative elements, no gradients, no shadows.
```

### 按布局类型追加的风格指令

| 布局类型 | 追加指令 |
|---------|---------|
| Type A — 单技术动作 | `Single centered subject occupying 60-70% of frame. 2-4 annotation arrows pointing to key features.` |
| Type B — 正误对比 | `Side-by-side comparison layout. Left panel marked with X (incorrect), right panel marked with checkmark (correct). Clear dividing line between panels.` |
| Type C — 步骤序列 | `Horizontal step-by-step sequence from left to right, 2-4 steps. Each step numbered, connected by arrows. Equal spacing between steps.` |
| Type D — 装备解剖 | `Centered equipment diagram occupying 50% of frame. Surrounding leader lines connecting to labeled parts. Clean exploded-view style.` |
| Type E — 信息图 | `Clean infographic layout. Data visualization, timeline, or flowchart style. Minimal iconography.` |
| Type F — 解剖/医学 | `Centered anatomical illustration occupying 60% of frame. Precise anatomical labels with leader lines. Medical illustration clarity.` |

### 完整的 img2img 提示词结构

```
[通用风格提示词]
[布局类型追加指令]
```

示例（修复一张 Type C 绳结图）：

```
Instructional climbing diagram, clean line art style, minimal colors using only
forest green #4A7C59 and warm gray on a pure white background. Simple human
figures with no facial features. Clean thin annotation arrows, sans-serif labels
in English. Generous white space margins on all sides. No background scenery,
no decorative elements, no gradients, no shadows.
Horizontal step-by-step sequence from left to right, 2-4 steps. Each step
numbered, connected by arrows. Equal spacing between steps.
```

将此提示词 + 确认过的参考图一起传入 img2img API。

### API 参数建议

```json
{
  "image": "{参考图}",
  "prompt": "{风格提示词}",
  "size": "1024x1024",
  "strength": 0.6
}
```

**关于 strength 参数**（图片引导强度）：

| strength | 效果 | 适用场景 |
|----------|------|---------|
| 0.4-0.5 | 强烈保留参考图结构 | 参考图的构图和内容已经非常理想，只需改风格 |
| 0.5-0.7 | 平衡参考与风格 | 默认推荐值，大多数情况用这个 |
| 0.7-0.85 | 风格主导，参考图为辅 | 参考图只提供大致结构参考，需要更多风格化处理 |

先用 **0.6** 试一次。如果输出偏离参考图太多，降低到 0.5；如果风格化不够，提高到 0.7。

---

## 7. Step 6 — 输出结果与替换

### 生成后展示

每张修复图生成后，按以下格式展示：

```markdown
## 修复结果：kp-figure-eight-knot

| 对比 | 图片 |
|------|------|
| 原图 | {展示原图} |
| 参考图 | {展示参考图} |
| 新图 | {展示新生成的图} |

### 检查要点
- [ ] 绳结穿越关系是否正确？
- [ ] 风格是否与项目统一（线稿、绿+灰+白底）？
- [ ] 标注是否清晰？
- [ ] 尺寸是否为 1024×1024？

⏸️ 请确认：
- ✅ "通过" → 替换原文件
- 🔄 "调整 strength" → 我会调整参数重新生成
- 🔄 "换参考图" → 回到候选图选择步骤
- ❌ "放弃修复" → 保留原图不变
```

### 替换规则

确认通过后：

1. 新图保存为相同文件名，覆盖原图
2. 路径：`rock-climbing-knowledge/public/images/illustrations/{kp-id}.png`
3. 记录修复日志（见下方 §8）

---

## 8. 修复日志

每次修复完成后，输出修复日志：

```markdown
# 图片修复日志 / Regeneration Log

**修复日期**: {YYYY-MM-DD}
**修复数量**: {X} 张

| # | kp-id | 标题 | 错误类型 | 参考图来源 | strength | 结果 |
|---|-------|------|---------|-----------|----------|------|
| 1 | kp-figure-eight-knot | 八字结 | 结构错误 | {来源} | 0.6 | ✅ 已替换 |
| 2 | kp-cam-mechanism | 凸轮机械塞 | 结构错误 | {来源} | 0.5 | ✅ 已替换 |
| 3 | kp-finger-pulley-anatomy | 手指滑车 | 解剖错误 | {来源} | 0.6 | 🔄 需二次修复 |
```

---

## 9. 常见场景处理

### 场景 A：参考图找不到合适的

如果搜索 3 轮都找不到满意的参考图：

1. 告诉用户搜索结果不理想
2. 建议用户自行提供参考图（拍照、截图、或指定 URL）
3. 用户提供后继续 img2img 流程

### 场景 B：img2img 输出内容仍然不对

如果用参考图生成后内容还是有错误：

1. 降低 strength（如从 0.6 降到 0.45），让参考图占更大权重
2. 如果仍不行，尝试换一张更清晰的参考图
3. 最多重试 3 次，仍不满意则标记为"需人工处理"

### 场景 C：风格偏离项目统一风格

如果 img2img 输出的风格不够统一：

1. 提高 strength（如从 0.6 升到 0.75），让风格提示词权重更大
2. 在风格提示词中补充更明确的约束（如 `absolutely no shading, flat colors only`）
3. 确认后重新生成

### 场景 D：用户直接提供了参考图

如果用户在发送文件名列表时附带了参考图：

1. 跳过 Step 3（搜索参考图）
2. 直接用用户提供的参考图进入 Step 4（确认）和 Step 5（生成）

---

## 10. 快速启动 Checklist

收到一批问题图片文件名后，按以下清单执行：

```
□ 收到文件名列表，确认每个文件名格式正确（kp-xxx-yyy）
□ 逐个反查：在 split-prompts/ 中找到对应 Prompt 条目
□ 分析每张图的错误类型
□ 搜索参考图（每张 3-5 张候选）
□ 展示候选图，等用户确认
□ 用确认的参考图 + 风格提示词生成新图（strength 默认 0.6）
□ 展示原图 vs 新图对比，等用户确认
□ 确认通过后替换原文件
□ 输出修复日志
```

**核心原则：每一步都等用户确认，不要自动往下走。**
