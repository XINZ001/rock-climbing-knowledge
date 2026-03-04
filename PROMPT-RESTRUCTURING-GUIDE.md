# 攀岩插图 Prompt 重构指南 / Illustration Prompt Restructuring Guide

> **目标**：将 `illustration-prompts.md` 中的复杂多子图 Prompt 拆分为**独立的、每张只描述一件事**的 Prompt，让图片生成 AI 能更聚焦，出图质量更高，同时保证所有产出图的**布局结构高度一致**。

---

## 一、你的工作流程 / Workflow

### Step 1 — 阅读源文件
读取 `illustration-prompts.md`，它包含约 173 张插图的 Prompt，按 10 个知识模块分组。

### Step 2 — 识别可拆分的 Prompt
每个 Prompt 中如果出现以下模式，就需要拆分：
- `(1) ... (2) ... (3) ...` 编号式并列子图
- `LEFT ... RIGHT ...` / `TOP ... BOTTOM ...` 分区式
- `Three diagrams` / `Four panels` / `2x2 grid` 等多面板结构
- `Comparison:` / `vs` 对比式（这种**可以保留**为一张图，但如果子图各自复杂就也拆）
- `Inset showing ...` 如果 inset 内容足够独立也可考虑拆

### Step 3 — 按规则拆分并重写
每条旧 Prompt → 拆为 N 条新 Prompt（下文有详细规则）。

### Step 4 — 输出到新文件
将所有拆分后的 Prompt 写入 `illustration-prompts-split.md`，保持原有模块编号结构。

---

## 二、拆分规则 / Splitting Rules

### 2.1 核心原则
| 原则 | 说明 |
|------|------|
| **一图一事** | 每个 Prompt 只描述一个概念、一个动作、或一个对比 |
| **宁多勿少** | 如果一个 Prompt 里有 4 个子面板，拆成 4 个独立 Prompt |
| **保留对比** | 如果两个东西的对比是核心信息（如 correct vs incorrect），可以保留在一张图中 |
| **保留序列** | 如果是一个连续动作的 3-4 步骤分解，可以保留为一张图（但超过 4 步就拆） |

### 2.2 拆分命名规则
原始 ID 为 `kp-grip-types`，拆分后为：
```
kp-grip-types-full-crimp
kp-grip-types-half-crimp
kp-grip-types-open-hand
kp-grip-types-pinch
```

### 2.3 拆分后的文件结构模板
每条拆分后的 Prompt 必须包含：

```markdown
### 2-1a. kp-grip-types-full-crimp
- **原始来源**: kp-grip-types
- **标题**: 全捏握 / Full Crimp Grip
- **布局类型**: Type A
- **Prompt**: [完整 Prompt 文本]
```

---

## 三、Prompt 写作规范 / Prompt Writing Standards

### 3.1 统一前缀（必须一字不改地放在每个 Prompt 开头）

```
Instructional climbing diagram, clean line art style, minimal colors (forest green #4A7C59 and warm gray), white background.
```

### 3.2 统一布局结构（Layout Template）

为了让所有产出图的**视觉风格和布局一致**，请按以下结构写每个 Prompt：

```
[统一前缀].
[主体描述 — 占画面约 70%].
[标注/注释 — 用 annotation arrows、labels 描述].
[视角声明 — 如 "side view" / "front view" / "top-down view"].
[统一后缀].
```

### 3.3 统一后缀（必须一字不改地放在每个 Prompt 末尾）

```
Consistent style: simple human figures with no facial features, clean thin annotation arrows, sans-serif labels in English, generous white space margins on all sides. No background scenery or decorative elements.
```

### 3.4 Prompt 长度控制
- **理想长度**：40-80 个英文单词（不含前缀和后缀）
- **上限**：100 个英文单词
- 拆分的目的就是让每个 Prompt 足够短，AI 不会丢失信息

### 3.5 描述层次
1. **What** — 画什么（主体）
2. **How** — 怎么画（视角、姿势、角度）
3. **Where** — 标注什么（labels、arrows、数值）
4. **Avoid** — 不要画什么（见下方攀岩常见错误清单）

---

## 四、⚠️ 攀岩配图 AI 常见绘画错误清单 / Common AI Drawing Mistakes for Climbing

> **这是最重要的部分。** 图片生成 AI 对攀岩运动的理解很差，以下错误极其常见。在写 Prompt 时，需要通过**精确描述**来预防这些错误。必要时在正文中明确说 "do NOT..."。

### 4.1 🖐️ 手和手指

| 常见错误 | 正确描述方式 |
|----------|-------------|
| 手指数量错误（6指、4指） | 明确写 "a human hand with five fingers" |
| Full crimp 手指角度不对 | 写 "fingers bent at exactly 90 degrees at the PIP joint, thumb locked OVER the index finger, NOT beside it" |
| Half crimp 和 full crimp 画成一样 | 写 "half crimp: same 90-degree bend but thumb is NOT touching any finger, hangs freely" |
| Open hand 画成抓握 | 写 "fingers gently draped over a rounded hold, NO sharp bending at joints, relaxed and curved" |
| 手指在岩点上穿透或悬空 | 写 "fingers making solid contact with the hold surface, no gaps between skin and rock" |
| Pinch 握力方向画反 | 写 "thumb on ONE side, four fingers on the OPPOSITE side, squeezing inward toward each other" |

### 4.2 🧗 攀岩者身体姿态

| 常见错误 | 正确描述方式 |
|----------|-------------|
| 身体朝向相机（正面平面人） | 明确写视角："side view" 或 "three-quarter view from below" |
| 身体悬空，看不出在攀爬 | 写 "climber's hands gripping holds on the wall, feet pressing on footholds, body weight supported" |
| 手臂弯曲角度不自然 | 写 "arms straight / arms bent at 90 degrees at the elbow" 等精确角度 |
| 重心位置不合理（漂浮感） | 写 "center of gravity directly below the handholds" 并用 "gravity arrow pointing down" |
| 腿部姿势像站在地面而非岩壁上 | 写 "feet pressing INTO the wall surface, toes pointing toward the wall" |
| 落膝（drop knee）膝盖方向错误 | 写 "one knee rotated inward and pointing DOWNWARD toward the ground, hip turned into the wall" |
| 背步（back step）面朝方向错误 | 写 "climber's chest faces SIDEWAYS, not facing the wall squarely" |
| 勾脚尖（toe hook）与勾脚跟（heel hook）混淆 | toe hook 写 "TOP of the shoe (dorsum) hooked OVER the hold, toes pointing upward"；heel hook 写 "HEEL of the shoe placed ON TOP of the hold, hamstring pulling body toward wall" |
| Gaston 和 side pull 画成一样 | Gaston 写 "fingers pointing OUTWARD away from the body, elbow flared out, like prying open elevator doors"；side pull 写 "fingers pointing sideways, body leaning in the OPPOSITE direction" |
| 旗帜步（flagging）的自由腿消失 | 写 "non-weight-bearing leg extended visibly to the side/behind for counterbalance, NOT hidden behind the body" |

### 4.3 🪢 绳索和绳结

| 常见错误 | 正确描述方式 |
|----------|-------------|
| 绳子穿过固体物体 | 写 "rope passes THROUGH the carabiner gate opening, wrapping around the body of the carabiner" |
| 绳子不受重力影响（漂浮弯曲） | 写 "rope hangs naturally under gravity with a slight catenary curve" |
| 八字结画成乱团 | 写 "figure-eight knot: rope forms the shape of the number 8, two parallel strands visible in the finished knot" |
| 绳子粗细不一致 | 写 "uniform rope diameter of approximately 10mm throughout" |
| 绳子没有连接两端（断裂感） | 写 "a single continuous rope from belayer to climber through all quickdraws" |
| 半扣结（Munter hitch）画成简单缠绕 | 写 "Munter hitch: rope wraps around carabiner forming two turns that can flip direction" |

### 4.4 ⛓️ 装备

| 常见错误 | 正确描述方式 |
|----------|-------------|
| 锁扣（carabiner）画成圆环 | 写 "D-shaped carabiner with a spring-loaded gate on the straight side" |
| 快挂（quickdraw）结构错误 | 写 "quickdraw: two carabiners connected by a short fabric sling (dogbone), top carabiner clips to bolt, bottom clips to rope" |
| 安全带变成腰带 | 写 "climbing harness with padded waistbelt ABOVE hip bones, two leg loops around thighs, a belay loop connecting waist and legs at the front center" |
| Cam（机械塞）画成随机金属块 | 写 "spring-loaded camming device with four curved lobes that expand outward, a trigger bar in the center, and a stem with a sling loop" |
| 头盔画成建筑安全帽 | 写 "lightweight climbing helmet with ventilation holes, sits on the crown of the head, chin strap visible — NOT a hard hat, NOT a bicycle helmet" |
| 攀岩鞋画成运动鞋 | 写 "climbing shoe with smooth rubber sole, NO tread pattern, pointed toe box, snug fit with visible rubber rand wrapping around the sides — NOT a sneaker" |
| GriGri 画成简单滑轮 | 写 "GriGri belay device: enclosed body with a rope channel, internal cam mechanism visible through a cutaway" |
| 挂板（hangboard）画成单调木板 | 写 "hangboard with multiple edge depths (deep 20mm, medium 15mm, shallow 10mm), finger pockets (3-finger and 2-finger), sloper rails, and jug handles — all at different depths and widths" |
| 校园板（campus board）横档间距不均匀 | 写 "campus board rungs evenly spaced approximately 22cm apart, numbered 1-10 from bottom to top" |
| 抱石垫画成床垫 | 写 "bouldering crash pad: thick rectangular folding pad with carrying straps, approximately 10-15cm thick, hinged in the middle for folding" |

### 4.5 🧱 岩壁和岩点

| 常见错误 | 正确描述方式 |
|----------|-------------|
| 岩壁像光滑的混凝土墙 | 写 "textured rock surface with visible cracks, edges, and natural features" |
| 室内岩点画成自然岩石 | 写 "colorful plastic climbing holds bolted to a plywood wall" |
| 仰角（overhang）角度不明显 | 写 "wall angled past vertical at approximately 120 degrees (30 degrees overhang from vertical)" 并标注角度 |
| 板岩（slab）画成垂直 | 写 "wall angled LESS than vertical at approximately 75-80 degrees, leaning AWAY from the climber" |
| 裂缝宽度不合理 | 写精确宽度: "finger crack: 1-2cm wide" / "hand crack: 5-8cm wide" / "fist crack: 8-12cm wide" |
| 岩点大小和实际不符 | 写 "small crimp edge approximately 15mm deep" 或 "large jug hold the size of a full hand" |
| 二面角（dihedral/corner）画成平面 | 写 "dihedral: two rock faces meeting at approximately 90 degrees forming an inside corner, like an open book standing upright" |
| 屋檐（roof）没画水平 | 写 "roof: rock surface that is completely horizontal, like a ceiling, climber hanging beneath it" |

### 4.6 📐 力学和物理

| 常见错误 | 正确描述方式 |
|----------|-------------|
| 力的箭头方向错误 | 每次写力的方向时加精确描述: "downward gravity arrow," "friction force arrow parallel to rock surface pointing upward" |
| 对向力不平衡 | 写 "equal and opposite force arrows" 并标注 |
| 动态动作轨迹不像抛物线 | 写 "parabolic dotted arc trajectory with apex marked at the highest point" |
| 没有表现出重力感 | 写 "body weight visible through slightly compressed knees" 或 "rope catenary curve under gravity" |
| 摩擦力方向画反 | 写 "friction force arrow pointing OPPOSITE to the direction of potential slip" |
| Barn door 旋转方向不明确 | 写 "body rotating like a door swinging open — pivoting around the hand and foot on the same side, opposite side swinging away from the wall" |

### 4.7 🧒 人体比例和解剖

| 常见错误 | 正确描述方式 |
|----------|-------------|
| 成人和儿童身体比例一样 | 写 "child figure with proportionally larger head (1/5 of body height), shorter limbs" |
| 手指骨骼解剖图不准确 | 写 "anatomical side view of a finger showing three phalanx bones (distal, middle, proximal), connected by DIP, PIP, and MCP joints, with A1-A5 pulley bands wrapping around the flexor tendon" |
| 肌肉示意图位置不对 | 写具体部位：如 "latissimus dorsi: large fan-shaped muscle on the back from lower spine to upper arm" |
| 肩袖肌群位置混淆 | 写 "four rotator cuff muscles on the back of the shoulder blade: supraspinatus on top, infraspinatus and teres minor below, subscapularis on the front" |
| 滑车韧带（pulley）画成滑轮 | 写 "finger pulley: a fibrous band that wraps AROUND the flexor tendon, holding it close to the bone — NOT a wheel, but a ring-like tissue band" |

---

## 五、布局一致性规范 / Layout Consistency Standards

### 5.1 图片类型分类

根据内容将所有图分为以下几类，每类使用固定布局模板：

#### Type A — 单技术动作（Single Technique）
```
布局：居中的攀岩者或局部特写，占画面 60-70%
标注：2-4 个 annotation arrows 指向关键部位
底部：技术名称 label
适用：edging, smearing, toe hook, 单个 grip 类型
```

#### Type B — 正误对比（Correct vs Incorrect）
```
布局：左右分栏
规范：始终 LEFT = 错误 (X mark), RIGHT = 正确 (checkmark)
中间：虚线分隔
各占画面 45%，中间留 10% 间距
适用：center of gravity, core engagement, body position
```

#### Type C — 步骤序列（Step Sequence）
```
布局：从左到右水平排列，2-4 步
每步：编号 ①②③④
步之间：右向箭头连接
底部：简短 label
适用：mantling steps, fall technique, knot tying, warmup flow
```

#### Type D — 装备解剖（Equipment Anatomy）
```
布局：居中放大的装备图，占画面 50%
周围：leader lines + labels 指向各部件
可选：右侧或底部加一个使用场景缩略图
适用：harness, quickdraw, belay device, hangboard, cam
```

#### Type E — 数据/信息图（Infographic）
```
布局：结构化图表（表格、雷达图、时间线、流程图等）
关键：保持数据可读性
颜色：forest green 用于强调数据，warm gray 用于背景
适用：grading chart, periodization, training log, scoring systems
```

#### Type F — 解剖/医学（Anatomy/Medical）
```
布局：身体部位居中，占画面 60%
标注：精确的解剖标签指向对应结构
如有对比：健康 vs 受伤 并排
适用：pulley injury, shoulder anatomy, growth plate, tendonitis
```

### 5.2 颜色使用规则
| 元素 | 颜色 |
|------|------|
| 正确做法、重点部位、active elements | Forest green (#4A7C59) |
| 错误做法、次要元素、inactive elements | Warm gray |
| 背景 | White |
| **不使用任何其他颜色** | — |

### 5.3 视角一致性
同一模块内的图尽量使用一致的视角：
- 手/手指技术 → side view（侧面图）
- 全身攀爬姿态 → front view 或 three-quarter view
- 脚法技术 → side view + bottom view（脚底图）
- 装备 → front view + cross-section（剖面图）
- 裂缝技术 → cross-section view（截面图）

---

## 六、拆分完整示例 / Full Splitting Example

### 原始 Prompt（kp-grip-types）

```
Four side-view hand diagrams showing climbing grip types on a rock edge:
(1) Full crimp - fingers bent at 90 degrees with thumb locked over index finger,
(2) Half crimp - fingers bent 90 degrees without thumb lock,
(3) Open hand - fingers naturally extended and relaxed over a rounded hold,
(4) Pinch - thumb pressing against four fingers from opposite side of a hold.
Each with labeled arrows showing force direction and finger joint angles.
```

**分析**：包含 4 个独立子图，每个是一种不同的握法 → 拆成 4 个。

### 拆分后

---

#### 2-1a. kp-grip-types-full-crimp
- **原始来源**: kp-grip-types
- **标题**: 全捏握 / Full Crimp Grip
- **布局类型**: Type A — 单技术动作
- **Prompt**: Instructional climbing diagram, clean line art style, minimal colors (forest green #4A7C59 and warm gray), white background. Side view of a human hand with five fingers gripping a small rock edge approximately 15mm deep. Fingers bent at exactly 90 degrees at the PIP joint. Thumb locked firmly OVER the tip of the index finger, pressing downward — NOT beside it. Annotation arrows show: downward force through fingertips into the edge, and a highlight circle on the A2 pulley area of the ring finger indicating stress. Label: "Full Crimp." Consistent style: simple human figures with no facial features, clean thin annotation arrows, sans-serif labels in English, generous white space margins on all sides. No background scenery or decorative elements.

---

#### 2-1b. kp-grip-types-half-crimp
- **原始来源**: kp-grip-types
- **标题**: 半捏握 / Half Crimp Grip
- **布局类型**: Type A — 单技术动作
- **Prompt**: Instructional climbing diagram, clean line art style, minimal colors (forest green #4A7C59 and warm gray), white background. Side view of a human hand with five fingers gripping a small rock edge approximately 15mm deep. Fingers bent at 90 degrees at the PIP joint — same angle as full crimp. Thumb hangs freely in the air, NOT touching any finger, NOT locked over the index. Annotation arrows show: downward force through fingertips, reduced stress indicator at A2 pulley compared to full crimp. Label: "Half Crimp." Consistent style: simple human figures with no facial features, clean thin annotation arrows, sans-serif labels in English, generous white space margins on all sides. No background scenery or decorative elements.

---

#### 2-1c. kp-grip-types-open-hand
- **原始来源**: kp-grip-types
- **标题**: 张手握 / Open Hand Grip
- **布局类型**: Type A — 单技术动作
- **Prompt**: Instructional climbing diagram, clean line art style, minimal colors (forest green #4A7C59 and warm gray), white background. Side view of a human hand with five fingers draped gently over a rounded sloper hold. Fingers relaxed with NO sharp bending at joints — a gentle natural curve following the hold shape. Maximum skin contact area highlighted in forest green on the fingertip pads. Annotation arrows show friction force parallel to the hold surface. Label: "Open Hand." Consistent style: simple human figures with no facial features, clean thin annotation arrows, sans-serif labels in English, generous white space margins on all sides. No background scenery or decorative elements.

---

#### 2-1d. kp-grip-types-pinch
- **原始来源**: kp-grip-types
- **标题**: 捏握 / Pinch Grip
- **布局类型**: Type A — 单技术动作
- **Prompt**: Instructional climbing diagram, clean line art style, minimal colors (forest green #4A7C59 and warm gray), white background. Front view of a human hand with five fingers gripping a vertical protruding hold. Thumb on one side pressing inward, four fingers on the opposite side pressing inward — creating opposing squeeze forces. Annotation arrows show two inward-pointing force arrows compressing the hold from both sides. A small cross-section of the hold shape shown below. Label: "Pinch." Consistent style: simple human figures with no facial features, clean thin annotation arrows, sans-serif labels in English, generous white space margins on all sides. No background scenery or decorative elements.

---

### 不拆分的示例（kp-center-of-gravity）

原始 Prompt：
```
Side-by-side comparison on a vertical wall:
LEFT (X mark) - climber with bent arms, hips far from wall, excessive arm muscle loading arrows.
RIGHT (checkmark) - climber with straight arms, hips close to wall, weight through skeleton to feet.
```

**分析**：只有 2 个子图，且它们的对比关系是核心信息 → 不拆，保留为一张 Type B 图。

但需要重写以加入攀岩细节防错描述：

#### 3-12. kp-center-of-gravity
- **标题**: 重心管理 / Center of Gravity Management
- **布局类型**: Type B — 正误对比
- **Prompt**: Instructional climbing diagram, clean line art style, minimal colors (forest green #4A7C59 and warm gray), white background. Side-by-side comparison on a vertical wall (90 degrees). LEFT (X mark in warm gray): climber with bent arms at roughly 90 degrees, hips hanging far from the wall surface, excessive muscle loading arrows on biceps, feet barely pressing on holds. RIGHT (checkmark in forest green): climber with fully straight arms, hips close to the wall, a vertical gravity line passing through the skeleton from hands to feet, feet firmly pressing on footholds. Center-of-gravity dot marked on each figure at hip level. Vertical dashed line separates the two panels. Consistent style: simple human figures with no facial features, clean thin annotation arrows, sans-serif labels in English, generous white space margins on all sides. No background scenery or decorative elements.

---

## 七、不需要拆分的情况 / When NOT to Split

以下情况保留为一张图：

1. **简单对比图**（2 个子图，且每个子图不复杂，描述 < 30 词）
   - 例如：correct vs incorrect body position → 保留
2. **3-4 步连续序列**（且每步只是同一动作的阶段，描述 < 20 词/步）
   - 例如：mantling 4 步 → 保留
3. **单主体 + 一个小 inset**（inset < 15 词）
   - 例如：full body + detail inset of hand grip → 保留

**但如果**：
- 子图超过 4 个 → 拆
- 每个子图本身需要详细描述（> 30 words）→ 拆
- 子图之间无逻辑关联（如几个独立装备或几个独立训练动作）→ 拆

---

## 八、输出文件结构 / Output File Format

最终输出到 `illustration-prompts-split.md`，格式如下：

```markdown
# 攀岩知识库插图清单（拆分版）/ Illustration Prompt List (Split Version)

> 风格前缀：`Instructional climbing diagram, clean line art style, minimal colors (forest green #4A7C59 and warm gray), white background.`
> 风格后缀：`Consistent style: simple human figures with no facial features, clean thin annotation arrows, sans-serif labels in English, generous white space margins on all sides. No background scenery or decorative elements.`
> 每张图的文件命名：`{id}.png`，放入 `public/images/illustrations/` 目录。

---

## 1. 攀岩概览

### 1-1a. kp-climbing-categories-sport
- **原始来源**: kp-climbing-categories
- **标题**: 运动攀 / Sport Climbing
- **布局类型**: Type A
- **Prompt**: ...

### 1-1b. kp-climbing-categories-trad
- **原始来源**: kp-climbing-categories
- **标题**: 传统攀 / Traditional Climbing
- **布局类型**: Type A
- **Prompt**: ...

(依次类推)
```

### 文件命名规范
- 拆分后图片文件名：`{id}.png`
  - 例如：`kp-grip-types-full-crimp.png`
- 放入 `public/images/illustrations/` 目录

---

## 九、质量检查清单 / Quality Checklist

完成所有拆分后，逐条检查：

- [ ] 每个 Prompt 是否以统一前缀开头？
- [ ] 每个 Prompt 是否以统一后缀结尾？
- [ ] 每个 Prompt 是否只描述**一个主要概念**？
- [ ] 每个 Prompt 主体长度是否在 40-100 词之间（不含前缀后缀）？
- [ ] 攀岩手指/握法描述是否包含精确角度和拇指位置？
- [ ] 装备描述是否有足够细节避免被画成日常物品？
- [ ] 岩壁角度是否有精确数值（度数）？
- [ ] 力的方向箭头是否有明确方向描述？
- [ ] 身体姿态是否指定了视角（side view / front view / top-down）？
- [ ] 对比图是否统一了 LEFT=错误、RIGHT=正确？
- [ ] 布局类型是否正确标注（Type A-F）？
- [ ] ID 命名是否符合 `kp-原ID-子项` 规范？
- [ ] 是否有用 "NOT" / "do NOT" 来防止 AI 常见错误？
- [ ] 同一模块内的视角是否一致？

---

## 十、特别注意：攀岩 Prompt 写作技巧 / Climbing-Specific Prompt Tips

### 10.1 让 AI 理解"在岩壁上"而非"在地面上"
```
❌ "A person doing a high step"
✓ "A climber on a vertical rock wall performing a high step, one foot raised
   to hand height on a small foothold, hands gripping holds above, body
   pressed close to the wall surface"
```
如果不明确说 "on a rock wall"，AI 很可能画出在地面做运动的人。

### 10.2 让 AI 区分攀岩装备和日常物品
```
❌ "A helmet"
✓ "A lightweight climbing helmet with ventilation holes and a thin chin strap
   — NOT a construction hard hat, NOT a bicycle helmet"
```

### 10.3 强调"line art"避免过度渲染
```
如果 AI 输出仍然太写实，可以在前缀后追加:
"technical illustration style, no shading, no gradient, flat colors only"
```

### 10.4 图内标注必须用英文
所有图内标注文字用**英文**，因为：
1. 图片 AI 对英文渲染质量远高于中文
2. 中文字符容易变成乱码或不可读
3. 后续可以在应用层叠加中文翻译

### 10.5 避免描述"表情"或"情绪"
```
❌ "A happy climber smiling"
✓ "A simple human figure in climbing position"
```
面部表情会导致 AI 投入过多算力在人脸上，分散对技术细节的注意力。后缀中已包含 "no facial features"。

### 10.6 数值一定要写
攀岩是个充满精确数值的运动，数值能帮助 AI 理解正确比例：
| 类别 | 写法示例 |
|------|---------|
| 岩点深度 | "15mm edge", "20mm pocket" |
| 岩壁角度 | "vertical (90°)", "overhang (120°)", "slab (75°)" |
| 裂缝宽度 | "finger crack 1-2cm", "hand crack 5-8cm" |
| 身体角度 | "elbow bent at 90 degrees", "hip flexion of 120 degrees" |
| 绳索直径 | "10mm diameter rope" |
| 训练时间 | "7-10 second hold" |
| 横档间距 | "rungs spaced 22cm apart" |
| 岩壁高度 | "15 meter tall wall", "4 meter boulder" |

### 10.7 攀岩鞋是关键视觉元素
如果图中有脚部特写，务必描述攀岩鞋的特征：
```
✓ "climbing shoe with smooth rubber sole (no tread), rubber rand wrapping
   around the toe and sides, pointed asymmetric toe box, heel cup with
   rubber patch"
```
AI 默认会画运动鞋或登山靴，必须明确区分。

### 10.8 用排除法定义形状
对于 AI 容易画错的物体，同时描述"是什么"和"不是什么"：
```
✓ "A carabiner: D-shaped metallic loop with a spring-loaded gate —
   NOT a simple ring, NOT an oval, NOT a chain link"
```

---

## 十一、处理顺序与批次 / Processing Order

请按以下顺序处理 `illustration-prompts.md` 中全部 173 条 Prompt：

| 批次 | 模块 | 原始数量 | 预估拆分后数量 |
|------|------|---------|--------------|
| 1 | 1. 攀岩概览 | 12 | ~25 |
| 2 | 2. 身体素质 | 19 | ~35 |
| 3 | 3. 攀爬技术 (前半) | 17 | ~30 |
| 4 | 3. 攀爬技术 (后半) | 17 | ~30 |
| 5 | 4. 心理与策略 | 11 | ~18 |
| 6 | 5. 装备知识 | 19 | ~35 |
| 7 | 6. 安全与风险 | 15 | ~25 |
| 8 | 7. 伤病预防 | 16 | ~28 |
| 9 | 8. 户外攀岩 | 18 | ~30 |
| 10 | 9. 特殊人群 | 13 | ~22 |
| 11 | 10. 竞技攀岩 | 16 | ~25 |

**每处理完一个批次，立即输出到 `illustration-prompts-split.md`，不要等全部处理完。**

---

## 十二、附录：布局类型速查卡 / Layout Type Quick Reference

```
┌─────────────────────────────────────────────────────┐
│ Type A — 单技术              Type B — 正误对比        │
│ ┌───────────────────┐       ┌──────────┬──────────┐ │
│ │                   │       │ ✗ Wrong  │ ✓ Right  │ │
│ │   [主体 60-70%]   │       │          │          │ │
│ │    ← arrows →     │       │ [45%]    │ [45%]    │ │
│ │                   │       │          │          │ │
│ │   "Label"         │       └──────────┴──────────┘ │
│ └───────────────────┘                                │
│                                                      │
│ Type C — 步骤序列            Type D — 装备解剖        │
│ ┌────┐→┌────┐→┌────┐       ┌───────────────────┐   │
│ │ ①  │ │ ②  │ │ ③  │       │    ←label          │   │
│ └────┘ └────┘ └────┘       │  [装备图 50%] label→│   │
│  step1  step2  step3       │    ←label          │   │
│                             └───────────────────┘   │
│                                                      │
│ Type E — 信息图              Type F — 解剖/医学       │
│ ┌───────────────────┐       ┌───────────────────┐   │
│ │ [图表/雷达图/      │       │                   │   │
│ │  时间线/流程图]    │       │  [身体部位 60%]    │   │
│ │                   │       │   ← labels →      │   │
│ └───────────────────┘       └───────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

祝你重构顺利！🧗
