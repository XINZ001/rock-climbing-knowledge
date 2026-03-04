# 资料库内容整合与呈现规划 / Content Integration & Presentation Plan

> **状态**：规划阶段，尚未执行
> **创建日期**：2026-03-03
> **目标**：将已收集的文章和视频资源系统性地整合到知识库中，重新设计每个知识点的呈现形式，使内容更加丰富、层次分明。

---

## 一、现状分析 / Current State

### 1.1 数据层面

| 数据类型 | 存储位置 | 映射粒度 | 与前端连接 |
|---------|---------|---------|-----------|
| KP 正文 | `section-XX-*.json` | 每个 kp 独立内容 | ✅ 已连接 |
| 插图 | `illustration-registry.json` | kp-id 级别 | ✅ 已连接 |
| 视频 | `videos.json` | **sub-section 级别**（如 s03-footwork） | ⚠️ 粗粒度，1 个 KP 最多分配 1 个视频 |
| 文章 | `article-research/section-XX-articles.json` | kp-id 级别（primaryKp + secondaryKps） | ❌ 完全未连接 |

### 1.2 前端层面

当前每个知识点（`KnowledgePoint.jsx`）的呈现结构：

```
┌─────────────────────────────────────┐
│  标题 + 英文副标题                    │
│  术语标签条                           │
│  ────────────────────────────────── │
│  正文内容（Markdown 渲染）            │
│  ────────────────────────────────── │
│  插图（可点击放大）                   │
│  ────────────────────────────────── │
│  Tags 标签                           │
│  相关知识点链接                       │
│  ────────────────────────────────── │
│  相关视频（最多 1 个，嵌入播放）       │
└─────────────────────────────────────┘
```

**问题**：
1. 文章数据完全没有出口
2. 视频只能显示 1 个，且映射是 sub-section 级别的粗分配
3. 没有"延伸阅读"区域
4. 没有"文章洞见"对正文的补充机制
5. 用户无法感知某个知识点还有多少额外学习资源

---

## 二、整合目标 / Integration Goals

### 目标 1：文章 → 知识点正文的内容深化

将文章搜索 Bot 产出的 `keyInsights`（关键洞见）**浓缩融入** KP 正文中，作为"专家补充"或"深度提示"出现。

**效果示例**（以 kp-hangboard-training 为例）：

```
原有正文：
  "悬挂训练（Hangboard Training）是最系统的指力训练方法..."

融入后新增段落：
  > 💡 专家视角：根据 Lattice Training 的研究，不同握姿的选择应基于
  > 项目需求，而非一概认为某种更优。Matt Pincus 建议初学者从
  > half-crimp 开始，避免 full-crimp 训练。
  > — 来源：TrainingBeta《The Complete Hangboard Training Guide》
```

### 目标 2：文章 → 延伸阅读链接

在知识点底部新增"延伸阅读"板块，展示与该 KP 相关的外部文章链接。

### 目标 3：视频 → 精细化映射 + 分层展示

- 将视频从 sub-section 级别 **下沉到 kp-id 级别**
- 每个 KP 默认只展示 1 个"最佳视频"
- 告知用户"还有 N 个相关视频"，点击可展开查看

---

## 三、数据模型变更 / Data Model Changes

### 3.1 KP 正文数据新增字段

在 `section-XX-*.json` 的每个 knowledgePoint 中新增：

```jsonc
{
  "id": "kp-hangboard-training",
  "title": { ... },
  "content": { ... },         // 现有正文
  "terms": [ ... ],
  "crossRefs": [ ... ],
  "tags": [ ... ],

  // ===== 新增字段 =====

  // 文章洞见（融入正文的补充内容）
  "expertInsights": [
    {
      "zh": "根据 Lattice Training 的研究，不同握姿的选择应基于项目需求，推荐初学者从 half-crimp 开始。",
      "en": "According to Lattice Training research, grip position choice should be project-specific. Beginners are recommended to start with half-crimp.",
      "source": "Lattice Training",
      "sourceUrl": "https://latticetraining.com/blog/..."
    }
  ],

  // 延伸阅读
  "furtherReading": [
    {
      "title": "The Complete Hangboard Training Guide",
      "url": "https://www.trainingbeta.com/...",
      "source": "TrainingBeta",
      "language": "en",
      "articleType": "training"
    }
  ]
}
```

### 3.2 视频数据重构：从 sub-section 映射改为 kp-id 映射

**当前 `videos.json` 结构**（按 sub-section）：

```json
{
  "s03-footwork": [
    { "title": {...}, "url": "...", "channel": "..." }
  ]
}
```

**新结构 `videos.json`**（按 kp-id，支持多视频 + 排序）：

```jsonc
{
  "kp-edging": {
    "primary": {
      "title": { "zh": "...", "en": "..." },
      "url": "https://www.youtube.com/watch?v=...",
      "channel": "Neil Gresham",
      "lang": "en",
      "platform": "youtube"
    },
    "more": [
      {
        "title": { "zh": "...", "en": "..." },
        "url": "https://www.bilibili.com/video/BV...",
        "channel": "岩时攀岩",
        "lang": "zh",
        "platform": "bilibili"
      },
      {
        "title": { "zh": "...", "en": "..." },
        "url": "https://www.youtube.com/watch?v=...",
        "channel": "Movement for Climbers",
        "lang": "en",
        "platform": "youtube"
      }
    ]
  }
}
```

**设计说明**：
- `primary`：该 KP 的最佳教学视频，默认展示
- `more`：其他相关视频，折叠隐藏，用户点击展开
- 选择 primary 的原则：教学质量最高 + 可嵌入播放 + 优先中国用户能看到的（Bilibili）

### 3.3 kp-registry.json 状态追踪新增

```jsonc
{
  "id": "kp-hangboard-training",
  "status": {
    "content": "done",
    "illustration": "done",
    "video": "done",          // 现有
    "article": "done",        // 新增：文章覆盖状态
    "expertInsights": "done"  // 新增：洞见融入状态
  }
}
```

---

## 四、UI 呈现重新设计 / UI Redesign

### 4.1 知识点新版布局

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│  📖 标题 + 英文副标题                                  │
│  ┌──────────────────────────────────────────────┐    │
│  │ 术语：边踩 edging | 内侧边踩 inside edge | ... │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  ── 正文内容 ──────────────────────────────────────   │
│  边踩是攀岩中最基本也最常用的脚法技术……                  │
│  ……                                                   │
│                                                       │
│  ┌─ 💡 专家补充 ──────────────────────────────────┐  │
│  │ 根据 Lattice Training 的研究，不同边踩技术的      │  │
│  │ 选择应视岩壁角度而定……                            │  │
│  │                    — TrainingBeta ↗              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  ── 插图 ──────────────────────────────────────────   │
│  [内侧边踩图]  [外侧边踩图]                            │
│                                                       │
│  ── 🎬 教学视频 ───────────────────────────────────   │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ▶ [Neil Gresham - Edging Masterclass]          │  │
│  │  YouTube | EN | 12:34                            │  │
│  └─────────────────────────────────────────────────┘  │
│  📹 还有 3 个相关视频  ▸ 展开查看                       │
│    ┌─ 展开后 ──────────────────────────────────────┐  │
│    │ [B站] 岩时攀岩 - 边踩技术教学 | 中文 | 8:21    │  │
│    │ [YT] Movement for Climbers - Edging | EN      │  │
│    │ [YT] Rockentry - Edging Right & Wrong | EN    │  │
│    └───────────────────────────────────────────────┘  │
│                                                       │
│  ── Tags ──────────────────────────────────────────   │
│  [beginner] [technique]                               │
│                                                       │
│  ── 🔗 相关知识点 ─────────────────────────────────   │
│  → 攀岩鞋  → 板岩技术  → 落膝                          │
│                                                       │
│  ── 📚 延伸阅读 ───────────────────────────────────   │
│  • Climbing Footwork Fundamentals (Climbing Mag) EN ↗ │
│  • 攀岩脚法入门教程 (岩点) ZH ↗                        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 4.2 各板块设计细节

#### A. 专家补充板块（Expert Insights）

**位置**：正文之后、插图之前
**样式**：浅绿色背景的引用卡片，与正文在视觉上明确区分
**内容来源**：从文章搜索 Bot 产出的 `keyInsights` 中提炼
**数量**：每个 KP 最多 1-2 条（避免喧宾夺主）
**交互**：来源链接可点击跳转原文

```jsx
// 概念示意
<div className="bg-forest/5 border-l-4 border-forest rounded-r-lg p-4 my-4">
  <div className="text-xs font-semibold text-forest mb-1">💡 专家补充</div>
  <p className="text-sm">根据 Lattice Training 的研究……</p>
  <a className="text-xs text-forest mt-2" href="...">
    — TrainingBeta ↗
  </a>
</div>
```

#### B. 视频板块重设计

**默认状态**：只显示 1 个"最佳视频"（primary），嵌入播放器
**折叠提示**：下方显示"📹 还有 N 个相关视频"
**展开后**：以紧凑列表形式展示其余视频（缩略图 + 标题 + 平台标签 + 语言）
**平台智能**：
- 中国 IP 用户：优先展示 Bilibili 视频为 primary
- 海外用户：优先展示 YouTube 视频为 primary
- 或由前端根据 `navigator.language` 初步判断

```
默认状态：
┌─────────────────────────────────┐
│  ▶  [嵌入播放器 - primary 视频]  │
│  标题 | 频道 | 平台              │
└─────────────────────────────────┘
📹 还有 3 个相关视频  ▸

展开后：
📹 还有 3 个相关视频  ▾
┌──────────────────────────────────┐
│ [缩略图] B站 | 岩时攀岩 | 中文    │
│ [缩略图] YT  | Movement... | EN  │
│ [缩略图] YT  | Rockentry | EN    │
└──────────────────────────────────┘
```

#### C. 延伸阅读板块

**位置**：知识点最底部，相关知识点链接之后
**样式**：简洁的链接列表，带来源标签和语言标识
**数量**：每个 KP 最多 3-4 篇（精选）
**排序**：按 quality.total 降序

```
📚 延伸阅读
• The Complete Hangboard Training Guide    TrainingBeta  EN ↗
• 指力训练：从入门到进阶                      岩点         ZH ↗
```

### 4.3 整体知识点呈现层次总结

从上到下的信息层次：

| 层次 | 内容 | 用户意图 | 信息密度 |
|------|------|---------|---------|
| 1 | 标题 + 术语 | 快速识别"这是什么" | 低 |
| 2 | 正文 | 系统学习核心知识 | 高 |
| 3 | 专家补充 | 获得额外深度和权威视角 | 中 |
| 4 | 插图 | 视觉理解技术动作 | 中 |
| 5 | 教学视频（primary） | 动态学习，看演示 | 高 |
| 6 | 更多视频（折叠） | 想看更多不同讲解 | 按需 |
| 7 | Tags + 相关知识点 | 探索关联内容 | 低 |
| 8 | 延伸阅读 | 深入研究，阅读原文 | 按需 |

---

## 五、实施步骤 / Implementation Steps

### Phase 1：数据准备（不涉及前端改动）

**Step 1.1 — 视频数据重构**
- 将 `videos.json` 从 sub-section 映射改为 kp-id 映射
- 为每个 KP 选择 primary 视频
- 已有的视频搜索产出需要做 kp 级别的精确匹配
- 输出：新版 `videos.json`

**Step 1.2 — 文章数据提炼**
- 从 `article-research/section-XX-articles.json` 中提取：
  - `furtherReading` 数据（url, title, source, language, articleType）
  - `expertInsights` 数据（从 keyInsights 中精选 1-2 条最有价值的）
- 为每个 KP 生成这两个新字段
- 输出：每个 section 的 enrichment JSON 文件

**Step 1.3 — 数据注入**
- 将 Step 1.2 的 enrichment 数据写入 `section-XX-*.json` 的对应 KP 中
- 更新 `kp-registry.json` 的 status 字段

### Phase 2：前端组件开发

**Step 2.1 — ExpertInsights 组件**
- 新建 `components/content/ExpertInsights.jsx`
- 渲染 `expertInsights` 数组为引用卡片

**Step 2.2 — 视频板块重构**
- 改造 `KnowledgePoint.jsx` 中的视频渲染逻辑
- 支持 primary + 折叠更多的交互
- 更新 `TopicPage.jsx` 中的视频数据传递逻辑

**Step 2.3 — FurtherReading 组件**
- 新建 `components/content/FurtherReading.jsx`
- 渲染 `furtherReading` 数组为链接列表

**Step 2.4 — KnowledgePoint 组件整合**
- 按新版布局调整 `KnowledgePoint.jsx` 的渲染顺序
- 集成 ExpertInsights 和 FurtherReading 组件

### Phase 3：数据补全

**Step 3.1 — 文章搜索继续推进**
- 完成剩余 8 个 Section 的文章搜索
- 每个 Section 完成后立即执行 Phase 1 的数据提炼流程

**Step 3.2 — 视频搜索精细化**
- 视频搜索 Bot 改为按 kp-id 级别搜索和映射
- 解决历史遗留的频道链接问题

**Step 3.3 — 覆盖率追踪**
- 建立全局覆盖率看板，追踪每个 KP 的：
  - 正文 ✅/❌
  - 插图 ✅/❌
  - primary 视频 ✅/❌
  - 延伸阅读 ✅/❌
  - 专家补充 ✅/❌

---

## 六、文章整合的具体操作方法 / Article Integration Method

### 6.1 从 keyInsights 到 expertInsights 的转化规则

不是所有 keyInsights 都适合成为 expertInsights。筛选标准：

| 适合 | 不适合 |
|------|--------|
| 提供了知识库正文中**没有**的具体建议 | 与正文内容高度重复 |
| 有数据/研究支撑的结论 | 纯个人经验/观点 |
| 可操作的训练/安全提示 | 过于笼统的描述 |
| 来自权威来源（教练/研究） | 来自社区讨论 |

**转化流程**：

```
1. 读取 article-research/section-XX-articles.json
2. 对于每篇文章：
   a. 读取其 primaryKp 和 secondaryKps
   b. 读取其 keyInsights 数组
   c. 对照该 KP 的现有 content，判断哪些 insight 是增量信息
   d. 将有价值的 insight 改写为简洁的中英双语段落
   e. 附上来源信息（source + url）
3. 每个 KP 最终保留 0-2 条 expertInsights
```

### 6.2 从 articles 到 furtherReading 的转化规则

```
1. 对每个 KP，找出所有 primaryKp 或 secondaryKps 包含该 kp-id 的文章
2. 按 quality.total 降序排列
3. 取前 3 篇作为 furtherReading
4. 仅保留 url, title, source, language, articleType 字段
```

### 6.3 示例：kp-grip-types 的完整整合结果

**当前状态**：
- 正文：✅ 详细讲解了 full crimp / half crimp / open hand / pinch
- 插图：✅ 4 张独立握法图
- 视频：⚠️ 有 1 个 Adam Ondra 的视频
- 文章：❌ 未连接（但 article-research 中有 2 篇匹配文章）

**整合后**：

```jsonc
// 新增到 section-02-physical.json 的 kp-grip-types 中
{
  "expertInsights": [
    {
      "zh": "Lattice Training 的研究表明，不同握姿（half crimp / open hand / full crimp）的选择应基于项目需求，而非一概认为某种更优。顶尖攀岩者如 Aidan Roberts 偏好 open hand，Will Bosi 偏好 half crimp，说明没有'最优握姿'，关键是针对性训练。",
      "en": "Research from Lattice Training shows that grip position choice should be project-specific rather than dogmatic. Top climbers like Aidan Roberts prefer open hand while Will Bosi favors half crimp, suggesting there's no single 'best grip' — targeted training matters most.",
      "source": "Lattice Training",
      "sourceUrl": "https://latticetraining.com/blog/how-to-manage-finger-strength-for-climbers/"
    }
  ],
  "furtherReading": [
    {
      "title": "Finger Strength Training for Climbers",
      "url": "https://latticetraining.com/blog/how-to-manage-finger-strength-for-climbers/",
      "source": "Lattice Training",
      "language": "en",
      "articleType": "training"
    },
    {
      "title": "Half Crimp and Open Hand Grip Positions",
      "url": "https://www.trainingbeta.com/grip-positions/",
      "source": "TrainingBeta",
      "language": "en",
      "articleType": "tutorial"
    }
  ]
}
```

---

## 七、视频分层展示的具体逻辑 / Video Display Logic

### 7.1 Primary 视频选择算法

当一个 KP 有多个视频时，按以下优先级选择 primary：

```
优先级 1: relevance = "primary" 且可嵌入播放
优先级 2: 教学质量评分最高
优先级 3: 优先 Bilibili（为中国用户兜底）
优先级 4: 最近发布的
```

### 7.2 前端展示逻辑

```jsx
// 伪代码
function VideoBlock({ primaryVideo, moreVideos }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      {/* 始终展示 primary */}
      <EmbeddedPlayer video={primaryVideo} />

      {/* 折叠更多 */}
      {moreVideos.length > 0 && (
        <button onClick={() => setExpanded(!expanded)}>
          📹 还有 {moreVideos.length} 个相关视频 {expanded ? '▾' : '▸'}
        </button>
      )}

      {expanded && (
        <div className="compact-video-list">
          {moreVideos.map(v => <CompactVideoCard video={v} />)}
        </div>
      )}
    </div>
  )
}
```

### 7.3 CompactVideoCard 设计

折叠列表中的视频使用紧凑卡片，不嵌入播放器，点击后：
- 方案 A：在当前位置展开为嵌入播放器（替换当前 primary）
- 方案 B：新窗口打开原始链接
- **推荐方案 A**，提供更好的站内体验

---

## 八、bot 指导调整 / Bot Guide Updates

### 文章搜索 Bot

新增输出要求：每篇文章除了现有字段外，增加一个 `suggestedInsight` 字段，标注哪条 keyInsight 最适合作为 expertInsight 融入正文。

### 视频搜索 Bot

映射粒度从 sub-section 级别改为 kp-id 级别。每个视频条目新增 `kpId` 字段（取代之前模糊的 `Primary KP` 文本）。

### 总负责人

增加新的审核维度：
- 审核 expertInsights 是否真的是正文的增量信息（不能与正文重复）
- 审核 furtherReading 的文章质量是否达标
- 审核 primary 视频的选择是否合理

---

## 九、风险与注意事项 / Risks & Notes

1. **不要过度补充**：expertInsights 是"锦上添花"，不是替代正文。每个 KP 最多 2 条。
2. **链接失效风险**：外部文章和视频链接可能失效，未来需要定期检查。
3. **中英双语一致性**：expertInsights 必须同时提供中英文版本。
4. **视频数据迁移**：从 sub-section 映射到 kp-id 映射时，需要逐条审核匹配准确性，不能自动化。
5. **渐进式上线**：建议先完成 1 个 Section 的完整整合作为试点，确认流程和效果后再推广。

---

## 十、优先试点建议 / Pilot Recommendation

建议以 **Section 02（身体素质）** 作为首个试点：

- ✅ 文章搜索已完成（25 篇，覆盖 18/20 个 KP）
- ✅ 视频资源相对丰富
- ✅ 插图 Prompt 已就绪
- ✅ 知识点数量适中（20 个），可控

试点完成后可评估：
- 数据转化流程是否顺畅
- UI 设计是否合理
- 用户（你）对呈现效果是否满意
- 是否需要调整再推广到其他 Section

---

*本文件仅为规划文档，所有变更均未执行。待确认后再按 Phase 逐步实施。*
