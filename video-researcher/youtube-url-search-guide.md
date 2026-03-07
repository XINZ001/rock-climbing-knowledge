# YouTube 视频 URL 补全指令
# YouTube Video URL Gap-Fill Guide

> **任务定位**：本指令专门用于补全 `videos.json` 中缺失的 YouTube 视频。
> 当前状态：**116 个 KP 没有 YouTube 视频，30 个只有 1 个**。

---

## 一、你需要做的事（只做这一件）

找到这 116 个 KP 对应的 YouTube 教学视频的**具体 URL**，输出到 `videos.json`。

**你不需要观看视频**。你只需要：
1. 用网页搜索找到视频链接
2. 通过标题 + 描述判断内容是否合适
3. 输出 JSON 格式数据

---

## 二、搜索方式（不看视频也能找到 URL）

### 2.1 优先：直接搜索已知优质频道的视频

以下频道已验证内容质量高，**优先从这些频道找视频**：

| 频道 | 擅长领域 | 搜索方式示例 |
|------|---------|------------|
| **Neil Gresham** | 技术大师课（全面） | `Neil Gresham Masterclass footwork youtube` |
| **Lattice Training** | 训练、指力、耐力 | `Lattice Training hangboard tutorial youtube` |
| **Hooper's Beta** | 伤病、康复、训练 | `Hooper's Beta pulley injury youtube` |
| **The Climbing Doctor** | 伤病康复（80+ 视频） | `The Climbing Doctor shoulder rehab youtube` |
| **Movement for Climbers** | 技术进阶 | `Movement for Climbers footwork technique youtube` |
| **Catalyst Climbing** | 动态技术、训练 | `Catalyst Climbing campus board youtube` |
| **Wide Boyz** | 裂缝攀（Crack School 系列） | `Wide Boyz Crack School youtube` |
| **Petzl** (官方) | 装备使用教程 | `Petzl belay device tutorial youtube` |
| **VDiff Climbing** | 安全技术、传统攀 | `VDiff climbing anchor building youtube` |
| **REI** (官方) | 入门装备、安全 | `REI climbing rope coiling youtube` |
| **Power Company Climbing** | 项目策略、心理 | `Power Company Climbing projecting youtube` |
| **HowNOT2** | 装备安全测试 | `HowNOT2 climbing gear youtube` |
| **Eric Karlsson Bouldering** | 技术、初学者 | `Eric Karlsson Bouldering technique youtube` |
| **Rockentry** | 技术正误对比 | `Rockentry climbing technique youtube` |
| **Adam Ondra** (Tips & Tricks) | 高水平技术 | `Adam Ondra Tips Tricks footwork youtube` |
| **日光山石 SULIMORO** | 繁中技术教学 | `SULIMORO climbing technique youtube` |

### 2.2 搜索模板

```
# 按频道+主题搜索（最高效）
"Neil Gresham" climbing [主题关键词] site:youtube.com

# 通用主题搜索
rock climbing [主题] tutorial site:youtube.com
how to [动作名] rock climbing youtube.com/watch

# 找播放列表（批量获取）
"Neil Gresham Masterclass" playlist youtube
"Hooper's Beta" playlist youtube
```

### 2.3 判断视频是否合适（不看视频也能判断）

通过搜索结果显示的**标题 + 描述片段**判断：

```
✅ 标题含：tutorial / technique / how to / guide / training / rehab / tips
✅ 描述含：explains / demonstrates / step by step / fundamentals / progressions
✅ 时长：一般搜索结果会显示时长，保留 2-30 分钟的

❌ 标题含：vlog / challenge / vs / reaction / day in my life / trip to
❌ 描述含：watch me / I tried / can I
❌ YouTube Shorts（< 1 分钟）
```

---

## 三、输出格式（直接写入 videos.json）

每找到一个视频，输出以下格式，追加到对应 `kp-xxx` 的数组中：

```json
{
  "title": {
    "zh": "视频标题（保留原标题即可，不用翻译）",
    "en": "原始英文标题"
  },
  "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "channel": "频道名称",
  "platform": "youtube",
  "lang": "en",
  "quality": 4,
  "summary": {
    "zh": "一句话描述：这个视频教了什么（根据标题和描述推断）",
    "en": ""
  },
  "relevance": "primary"
}
```

**quality 评分参考**：
- 5 分：Neil Gresham、Lattice Training、Hooper's Beta、The Climbing Doctor 的核心教学视频
- 4 分：其他已知优质频道的教学视频
- 3 分：不知名频道但内容明显是教学
- 不确定时给 3 分

---

## 四、需要补全的 116 个 KP（按优先级排列）

### 🔴 第一批：核心技术（Section 02 + 03）— 最重要，先做这里

#### Section 02 身体素质（15 个缺 YouTube）
```
kp-hangboard-training     | Hangboard Training          | 推荐：Lattice Training, Hooper's Beta
kp-finger-assessment      | Finger Strength Assessment  | 推荐：Lattice Training
kp-advanced-finger        | Advanced Finger Training    | 推荐：Lattice Training, Hooper's Beta
kp-pulling-power          | Pulling Power               | 推荐：Lattice Training, Movement for Climbers
kp-pushing-power          | Pushing Power & Mantling    | 推荐：Neil Gresham
kp-core-role              | Core Role in Climbing       | 推荐：Hooper's Beta, Lattice Training
kp-core-training          | Core Training Methods       | 推荐：Hooper's Beta
kp-anti-rotation          | Anti-Rotation Core          | 推荐：Hooper's Beta
kp-endurance-types        | Aerobic vs Anaerobic        | 推荐：Lattice Training
kp-arc-training           | ARC Training                | 推荐：Lattice Training
kp-4x4-training           | 4x4 Training Method         | 推荐：Lattice Training, Hooper's Beta
kp-long-route-endurance   | Long Route Endurance        | 推荐：Lattice Training
kp-campus-training        | Campus Board Training       | 推荐：Lattice Training, Catalyst Climbing
kp-dynamic-movement       | Dynamic Movement            | 推荐：Catalyst Climbing, Neil Gresham
kp-coordination-timing    | Coordination & Timing       | 推荐：Neil Gresham
```

#### Section 03 攀爬技术（16 个缺 YouTube）
```
kp-bicycle               | Bicycle Technique           | 推荐：Neil Gresham, Movement for Climbers
kp-smedging              | Smedging                    | 推荐：Neil Gresham, Eric Karlsson
kp-undercling-sidepull-gaston | Undercling/Sidepull/Gaston | 推荐：Neil Gresham
kp-palming               | Palming                     | 推荐：Neil Gresham
kp-diagonal-support      | Diagonal Support            | 推荐：Neil Gresham
kp-stemming              | Stemming                    | 推荐：Neil Gresham, Movement for Climbers
kp-high-step-mantle      | High Step & Mantling        | 推荐：Neil Gresham
kp-coordination-timing   | Coordination Moves          | 推荐：Neil Gresham
kp-swing-momentum        | Swing-by & Momentum         | 推荐：Catalyst Climbing
kp-campus-moves          | Campus Moves                | 推荐：Catalyst Climbing, Lattice Training
kp-slab-technique        | Slab Technique              | 推荐：Neil Gresham, Movement for Climbers
kp-overhang-technique    | Overhang Technique          | 推荐：Neil Gresham, Catalyst Climbing
kp-roof-technique        | Roof Technique              | 推荐：Neil Gresham
kp-arete-mantle          | Arete & Mantle              | 推荐：Neil Gresham
kp-route-reading-basics  | Route Reading Fundamentals  | 推荐：Power Company Climbing, Neil Gresham
kp-onsight-flash-redpoint| Onsight/Flash/Redpoint      | 推荐：Power Company Climbing
```

---

### 🟠 第二批：伤病 + 安全 + 装备（Section 05, 06, 07）

#### Section 07 伤病预防（11 个缺 YouTube）
```
kp-tendonitis            | Tendonitis                  | 推荐：Hooper's Beta, The Climbing Doctor
kp-shoulder-injury       | Shoulder Injuries           | 推荐：Hooper's Beta, The Climbing Doctor
kp-skin-management       | Skin Management             | 推荐：Lattice Training, Eric Karlsson
kp-when-to-rest          | When to Rest                | 推荐：Hooper's Beta
kp-injury-assessment     | Post-Injury Assessment      | 推荐：The Climbing Doctor, Hooper's Beta
kp-rehab-programs        | Rehab Programs              | 推荐：The Climbing Doctor
kp-return-criteria       | Return to Climbing Criteria | 推荐：The Climbing Doctor, Hooper's Beta
kp-rehab-mistakes        | Common Rehab Mistakes       | 推荐：Hooper's Beta
kp-climber-nutrition     | Climber Nutrition           | 推荐：Lattice Training
kp-weight-management     | Weight Management           | 推荐：Lattice Training
kp-hydration             | Hydration                   | 推荐：通用搜索 "climber hydration"
```

#### Section 06 安全（7 个缺 YouTube）
```
kp-gym-etiquette         | Gym Etiquette               | 推荐：REI, Eric Karlsson, 通用搜索
kp-rockfall-risk         | Rockfall Risk               | 推荐：VDiff Climbing, REI
kp-weather-assessment    | Weather Assessment          | 推荐：VDiff Climbing, REI
kp-retreat-strategy      | Retreat Strategy            | 推荐：VDiff Climbing
kp-leave-no-trace        | Leave No Trace              | 推荐：REI
kp-wilderness-first-aid  | Wilderness First Aid        | 推荐：REI, 通用搜索 "wilderness first aid climbing"
kp-basic-rescue          | Basic Rescue                | 推荐：Petzl, VDiff Climbing
```

#### Section 05 装备（15 个缺 YouTube）
```
kp-chalk                 | Chalk & Chalk Bag           | 推荐：Eric Karlsson, 通用搜索
kp-climbing-clothing     | Climbing Clothing           | 推荐：REI, 通用搜索
kp-helmet                | Helmet                      | 推荐：Petzl, REI, HowNOT2
kp-rope                  | Climbing Rope               | 推荐：REI, Petzl, VDiff
kp-quickdraw             | Quickdraw                   | 推荐：Petzl, REI, VDiff
kp-nuts-stoppers         | Nuts & Stoppers             | 推荐：VDiff Climbing, REI
kp-cams                  | Cams / Friends              | 推荐：VDiff Climbing, REI
kp-pitons                | Pitons                      | 推荐：VDiff Climbing
kp-portaledge            | Portaledge                  | 推荐：通用搜索 "portaledge setup tutorial"
kp-haul-bag              | Haul Bag                    | 推荐：通用搜索 "haul bag big wall"
kp-ascender              | Ascender / Jumar            | 推荐：Petzl, VDiff Climbing
kp-hangboard-gear        | Hangboard / Fingerboard     | 推荐：Lattice Training, Hooper's Beta
kp-campus-board-gear     | Campus Board (gear)         | 推荐：Lattice Training
kp-gymnastic-rings       | Gymnastic Rings             | 推荐：通用搜索 "gymnastic rings climbing training"
kp-system-wall           | System Wall / Moon Board   | 推荐：通用搜索 "Moonboard training tutorial"
```

---

### 🟡 第三批：户外 + 心理（Section 04, 08）

#### Section 04 心理与策略（9 个缺 YouTube）
```
kp-fear-management       | Fear Management             | 推荐：Power Company Climbing
kp-desensitization       | Gradual Desensitization     | 推荐：Power Company Climbing
kp-attention-management  | Attention Management        | 推荐：Power Company Climbing
kp-flow-state            | Flow State                  | 推荐：Power Company Climbing
kp-periodization         | Periodization               | 推荐：Lattice Training
kp-goal-setting          | Goal Setting                | 推荐：Power Company Climbing, Lattice Training
kp-training-log          | Training Log                | 推荐：Lattice Training
kp-projecting-strategy   | Projecting Strategy         | 推荐：Power Company Climbing
kp-working-linking       | Working Sections & Linking  | 推荐：Power Company Climbing
```

#### Section 08 户外（12 个缺 YouTube）
```
kp-first-outdoor-trip    | First Outdoor Trip          | 推荐：REI, VDiff Climbing
kp-rock-types            | Rock Types                  | 推荐：通用搜索 "rock types climbing granite limestone"
kp-lead-strategy-outdoor | Outdoor Lead Strategy       | 推荐：VDiff Climbing
kp-outdoor-sport-safety  | Outdoor Sport Safety        | 推荐：REI, Petzl, VDiff
kp-outdoor-bouldering-chars | Outdoor Bouldering       | 推荐：Eric Karlsson, 通用搜索
kp-landing-strategy      | Landing Strategy            | 推荐：Eric Karlsson
kp-area-exploration      | Area Exploration            | 推荐：通用搜索 "climbing area guidebook tips"
kp-bigwall-planning      | Big Wall Planning           | 推荐：通用搜索 "big wall climbing planning"
kp-aid-climbing          | Aid Climbing                | 推荐：VDiff Climbing, 通用搜索
kp-wall-living           | Living on the Wall          | 推荐：通用搜索 "portaledge big wall living"
kp-classic-destinations  | Classic Destinations        | 推荐：通用搜索 "climbing destinations guide"
kp-trip-planning         | Trip Planning               | 推荐：REI, 通用搜索
```

---

### 🔵 第四批：竞技 + 特殊人群 + 概览（Section 01, 09, 10）

#### Section 10 竞技攀岩（11 个缺 YouTube）
```
kp-speed-competition     | Speed Competition Format    | 推荐：搜索 "IFSC speed climbing rules explained youtube"
kp-scoring-systems       | Scoring Systems             | 推荐：搜索 "competition climbing scoring youtube"
kp-isolation-zone        | Isolation Zone              | 推荐：搜索 "climbing competition isolation zone youtube"
kp-time-limits-attempts  | Time Limits & Attempts      | 推荐：搜索 "climbing competition format rules"
kp-peaking               | Peaking for Competition     | 推荐：Lattice Training
kp-competition-anxiety   | Competition Anxiety         | 推荐：Power Company Climbing
kp-performance-mindset   | Performance Mindset         | 推荐：Power Company Climbing
kp-pressure-visualization| Pressure & Visualization   | 推荐：Power Company Climbing
kp-ifsc                  | IFSC                        | 推荐：搜索 "IFSC climbing organization explained youtube"
kp-national-federations  | National Federations        | 推荐：搜索 "climbing federation national youtube"
kp-competition-circuit-rankings | Circuit & Rankings  | 推荐：搜索 "IFSC world cup circuit rankings youtube"
```

#### Section 09 特殊人群（12 个缺 YouTube）
```
kp-kids-development      | Kids Development            | 推荐：搜索 "kids rock climbing development youtube"
kp-kids-safety           | Kids Safety                 | 推荐：搜索 "children climbing safety youth youtube"
kp-kids-fun-approach     | Fun-Focused Approach        | 推荐：搜索 "youth climbing coaching fun youtube"
kp-youth-training-load   | Youth Training Load         | 推荐：Lattice Training, Hooper's Beta
kp-growth-plate-concerns | Growth Plate Concerns       | 推荐：The Climbing Doctor, Hooper's Beta
kp-elderly-injury-prevention | Elderly Injury Prev.   | 推荐：The Climbing Doctor
kp-elderly-training-adjustments | Elderly Training    | 推荐：通用搜索 "climbing older adults training youtube"
kp-elderly-benefits      | Benefits for Older Adults   | 推荐：通用搜索 "climbing over 50 benefits youtube"
kp-elderly-flexibility   | Elderly Flexibility         | 推荐：通用搜索 "flexibility climbing older youtube"
kp-adaptive-types        | Adaptive Climbing Types     | 推荐：搜索 "adaptive climbing Paralympic youtube"
kp-adaptive-equipment    | Equipment Modifications     | 推荐：搜索 "adaptive climbing equipment youtube"
kp-adaptive-organizations| Organizations              | 推荐：搜索 "Paradox Sports inclusive climbing youtube"
```

#### Section 01 攀岩概览（8 个缺 YouTube）
```
kp-climbing-origins      | Origins of Climbing         | 推荐：搜索 "history of rock climbing documentary youtube"
kp-free-climbing-revolution | Free Climbing Movement  | 推荐：搜索 "free climbing history Yosemite youtube"
kp-modern-era            | Modern Era                  | 推荐：搜索 "modern sport climbing history youtube"
kp-climbing-categories   | Major Climbing Categories   | 推荐：REI, 通用搜索 "types of climbing explained youtube"
kp-special-categories    | Specialized Types           | 推荐：搜索 "ice climbing via ferrata deep water solo youtube"
kp-grading-systems       | Grading Systems             | 推荐：搜索 "climbing grades explained V scale Yosemite youtube"
kp-grade-comparison      | Grade Comparison            | 推荐：搜索 "climbing grade comparison systems youtube"
kp-olympics-history      | Olympic History             | 推荐：搜索 "Olympic climbing history 2020 Tokyo youtube"
```

---

## 五、工作流程

```
对于每个 KP：
  1. 在搜索引擎搜索（用上面的搜索模板）
  2. 找到 1-3 个符合条件的 youtube.com/watch?v= URL
  3. 通过标题+描述确认是教学内容
  4. 输出 JSON 追加到 videos.json 对应的 kp-xxx 数组
  5. 继续下一个 KP

目标：每个 KP 至少找到 1 个 YouTube 视频
理想：找到 2-3 个（会自动折叠显示）
```

---

## 六、输出位置

直接修改：`rock-climbing-knowledge/src/data/videos.json`

在对应的 `"kp-xxx": [...]` 数组中追加新的视频对象。如果该 KP 还没有条目，新建一个 key。

---

## 七、不要做的事

- ❌ 不要只写频道链接（`@LatticeTraining`），必须是 `watch?v=` URL
- ❌ 不要强行猜测视频 ID，必须是真实搜索到的链接
- ❌ 不要收录 YouTube Shorts
- ❌ 不要收录 Vlog、挑战、纯比赛录像
- ❌ 不要修改已有的视频条目

---

> 参考完整知识点列表：`rock-climbing-knowledge/src/data/kp-registry.json`
> 参考完整频道信息：`video-researcher/video-research-guide.md` 第四章
