# 模糊搜索增强指南 / Fuzzy Search Enhancement Guide

> **状态**：指令文件，尚未执行
> **目标**：让搜索系统能理解用户的"口语化"、"偏门"表达，即使用户输入的词和知识库中的标准术语不完全一致，也能找到正确的知识点。

---

## 一、问题诊断 / Problem Analysis

### 1.1 现有搜索系统

当前使用 **Fuse.js** 做前端模糊搜索（见 `AppContext.jsx`），索引字段和权重：

| 字段 | 权重 | 示例内容 |
|------|------|---------|
| `title_zh` | 3.0 | "攀岩绳" |
| `title_en` | 3.0 | "Climbing Rope" |
| `terms_zh` | 2.5 | "动力绳 静力绳 绳径 绳皮" |
| `terms_en` | 2.5 | "dynamic rope static rope" |
| `tags` | 1.5 | "beginner gear" |
| `content_zh` | 1.0 | 整段正文 |
| `content_en` | 1.0 | 整段正文 |

Fuse.js 配置：`threshold: 0.35`，`minMatchCharLength: 1`

### 1.2 核心问题：Fuse.js 是"字符级模糊"，不是"语义级模糊"

Fuse.js 的模糊匹配本质是 **编辑距离**（Levenshtein Distance），即判断两个字符串有多少个字符的增删改差异。这种方式：

**能解决的问题** ✅
- 拼写错误："edgeing" → "edging"
- 少打一个字："攀岩绳" 输入 "攀岩" → 能匹配
- 英文大小写："Drop Knee" vs "drop knee"

**不能解决的问题** ❌
- 同义词/口语化表达："绳子" → 应该匹配 "攀岩绳 / 绳索技术"
- 上位概念："拉伸" → 应该匹配 "柔韧性与灵活性"
- 日常用语对专业术语："怕摔" → 应该匹配 "恐惧管理 / 冲坠恐惧"
- 缩写/别名："cam" → 应该匹配 "机械塞"
- 描述性搜索："手指受伤" → 应该匹配 "手指滑轮损伤"

### 1.3 典型失败场景

| 用户输入 | 期望命中 | 当前结果 | 原因 |
|---------|---------|---------|------|
| 绳子 | kp-rope（攀岩绳） | ❌ 无结果 | "绳子"和"攀岩绳"编辑距离太大 |
| 怕高 | kp-fear-of-falling（冲坠恐惧） | ❌ 无结果 | "怕高"和"恐惧"无字符重叠 |
| 拉伸 | kp-hip-flexibility 等 | ❌ 无结果 | "拉伸"和"柔韧性"无字符重叠 |
| 手受伤 | kp-pulley-injury 等 | ⚠️ 弱匹配 | 要靠正文搜索，权重太低 |
| 安全帽 | kp-helmet（头盔） | ❌ 无结果 | "安全帽"和"头盔"无字符重叠 |
| 粉笔 | kp-chalk（镁粉） | ❌ 无结果 | "粉笔"和"镁粉"无字符重叠 |
| 练指力 | kp-hangboard-training（挂板训练） | ⚠️ 弱匹配 | 只能通过正文匹配 |

---

## 二、解决方案 / Solution

### 核心思路：为每个知识点建立"同义词扩展层"

在 Fuse.js 索引中增加一个新字段 `synonyms`（别名/同义词），将用户可能使用的各种口语化、非标准表达预先注入。搜索时 Fuse.js 同时在这个字段中进行匹配。

**这是纯前端方案，不需要后端、不需要 NLP 模型、不需要联网。**

---

## 三、实施步骤 / Implementation Steps

### Step 1：创建同义词词典文件

新建文件：`rock-climbing-knowledge/src/data/search-synonyms.json`

这个文件是一个以 `kp-id` 为 key 的字典，value 是该知识点的所有口语化别名（中英文混合）：

```json
{
  "_meta": {
    "description": "搜索同义词扩展词典。为每个知识点提供口语化、非标准的搜索别名，帮助 Fuse.js 匹配用户的日常用语。",
    "usage": "导入后与搜索索引合并，作为 synonyms 字段参与 Fuse.js 检索。",
    "guidelines": [
      "包含口语/俗语（绳子、怕高、练指力）",
      "包含近义词（拉伸→柔韧性）",
      "包含上位/下位概念（手指受伤→滑轮损伤）",
      "包含常见错误叫法（安全帽→头盔）",
      "包含英文缩写和变体（cam、biner）",
      "中英文别名写在一起，空格分隔"
    ]
  },

  "kp-rope": "绳子 绳索 攀岩绳子 爬山绳 安全绳 大绳 climbing rope cord line",
  "kp-knots": "打结 系绳 绳结 绑绳子 结绳 knot tying tie",
  "kp-helmet": "安全帽 头盔 帽子 脑壳保护 hard hat head protection",
  "kp-chalk": "镁粉 粉 粉笔 止滑粉 防滑粉 手粉 chalk powder",
  "kp-climbing-shoes": "攀岩鞋 岩鞋 抱石鞋 鞋子 climbing shoe rock shoe",

  "kp-fear-of-falling": "怕摔 怕高 恐高 害怕 恐惧 不敢爬 不敢冲 scared afraid fear of heights",
  "kp-fall-practice": "练冲坠 练摔 学摔 脱落练习 practice falling",

  "kp-hip-flexibility": "拉伸 劈叉 压腿 髋关节 开胯 柔韧 筋 stretch split hip opening",
  "kp-shoulder-mobility": "肩膀活动 转肩 肩关节 肩部拉伸 shoulder stretch mobility",

  "kp-grip-types": "抓法 握法 怎么抓 手势 手型 grip hand position",
  "kp-hangboard-training": "指力板 挂板 练指力 手指力量 指力训练 练手指 fingerboard hangboard finger strength",
  "kp-finger-assessment": "测指力 指力测试 手指测试 finger test assessment",
  "kp-pulley-injury": "手指受伤 手指疼 滑轮 指头伤 环韧带 A2 受伤 finger injury hurt pain",
  "kp-tendonitis": "肌腱炎 肘疼 手腕疼 腱鞘炎 网球肘 tendon elbow wrist pain",

  "kp-edging": "边踩 踩点 脚法 踩边 用脚 stand step edge footwork",
  "kp-smearing": "摩擦踩 蹭 踩不住 蹭墙 没脚点 friction smear",
  "kp-toe-hook": "勾脚尖 脚尖勾 脚背勾 toe hook",
  "kp-heel-hook": "勾脚跟 脚跟勾 heel hook",
  "kp-drop-knee": "落膝 压膝 膝盖往下 drop knee egyptian",
  "kp-flagging": "旗帜步 旗杆 伸腿平衡 flag",
  "kp-dyno-technique": "跳跃 跳石 飞 弹 动态 dyno jump leap dynamic",
  "kp-deadpoint": "死点 最高点接 静态跳 deadpoint dead point",

  "kp-harness": "安全带 安全吊带 腰带 绑带 harness belt",
  "kp-belay-device": "保护器 确保器 ATC GriGri 下降器 belay device belaying",
  "kp-quickdraw": "快挂 狗骨 快扣 quickdraw draw",
  "kp-carabiner": "锁扣 铁锁 扣环 登山扣 主锁 carabiner biner krab",
  "kp-cam": "机械塞 cam 弹簧塞 凸轮 friend",
  "kp-nut": "岩塞 rock stopper nut 被动保护",

  "kp-warmup": "热身 暖身 活动 准备活动 warm up warming",
  "kp-antagonist-training": "拮抗训练 对抗训练 推 俯卧撑 平衡训练 antagonist push-up",
  "kp-rest-recovery": "休息 恢复 放松 歇 rest day off recovery",

  "kp-belaying": "保护 确保 给绳 收绳 拉绳 带人 belay catch hold",
  "kp-rappelling": "下降 绳降 速降 下来 下去 rappel abseil descend",
  "kp-anchor-building": "保护站 锚点 搭站 固定点 anchor station setup",

  "kp-bouldering-fall": "抱石摔 落地 着地 怎么摔 怎么落 fall land crash pad",
  "kp-spotting": "保护 接人 spotter 站旁边 spot",

  "kp-core-role": "核心力量 腹肌 腰腹 body tension 身体张力 core abs",
  "kp-core-training": "练核心 练腹肌 核心训练 前水平 front lever plank",
  "kp-pulling-power": "引体向上 拉 pull up 上肢 手臂 臂力 pull chin up",

  "kp-overhang-technique": "仰角 倒挂 大角度 过90度 steep overhang",
  "kp-slab-technique": "板岩 小角度 光板 friction slab",
  "kp-crack-climbing": "裂缝 裂隙 塞手 crack jam hand jam fist jam",
  "kp-route-reading": "看线 读线 观察路线 read route beta sequence",

  "kp-periodization": "训练计划 周期 训练周期 怎么安排训练 plan schedule cycle",
  "kp-training-log": "训练日志 记录 训练记录 log journal track",
  "kp-plateau-breaking": "瓶颈 瓶颈期 上不去 提高不了 卡住了 stuck plateau",

  "kp-skin-care": "手皮 茧 起皮 手破了 破皮 磨手 skin callus flapper tear",
  "kp-nutrition-basics": "吃什么 饮食 营养 减重 体重 food diet weight nutrition",
  "kp-sleep-recovery": "睡眠 睡觉 休息 恢复 sleep rest",

  "kp-indoor-outdoor-differences": "户外 室外 野外 岩馆区别 outdoor gym difference",
  "kp-rock-types": "石头 岩石 花岗岩 石灰岩 种类 granite limestone rock type",
  "kp-classic-destinations": "去哪里爬 攀岩地点 目的地 阳朔 destination where to climb",

  "kp-kids-intro": "小孩 儿童 孩子 小朋友 kid child children youth",
  "kp-elderly-general": "老年人 年纪大 上年纪 older senior elderly age",
  "kp-adaptive-types": "残疾 残障 残障攀岩 无障碍 adaptive disability",

  "kp-competition-formats": "比赛 竞赛 赛制 怎么比 competition format event",
  "kp-scoring-systems": "评分 得分 怎么算分 score point judge",
  "kp-speed-competition": "速度赛 速攀 最快 speed race sprint"
}
```

> **注意**：以上是示范覆盖的约 50 个高频 KP。完整版需要覆盖全部 177 个知识点。不是每个 KP 都需要同义词——如果标题和 terms 已经足够覆盖日常表达，可以留空或不写。重点覆盖**专业术语与日常用语差距大**的 KP。

### Step 2：将同义词注入 Fuse.js 索引

修改 `AppContext.jsx` 中的 `buildIndex` 函数：

```jsx
// 在文件顶部导入
import searchSynonyms from '../data/search-synonyms.json'

// 在 buildIndex 函数中，构建 allDocs 时新增 synonyms 字段
allDocs.push({
  id: kp.id,
  // ... 现有字段不变 ...
  title_zh: kp.title.zh,
  title_en: kp.title.en,
  terms_zh: (kp.terms || []).map(t => t.zh).join(' '),
  terms_en: (kp.terms || []).map(t => t.en).join(' '),
  tags: (kp.tags || []).join(' '),
  content_zh: kp.content?.zh || '',
  content_en: kp.content?.en || '',

  // 新增：同义词字段
  synonyms: searchSynonyms[kp.id] || ''
})
```

### Step 3：在 Fuse.js keys 中新增 synonyms 字段

```jsx
const fuse = new Fuse(allDocs, {
  keys: [
    { name: 'title_zh', weight: 3.0 },
    { name: 'title_en', weight: 3.0 },
    { name: 'terms_zh', weight: 2.5 },
    { name: 'terms_en', weight: 2.5 },
    { name: 'synonyms', weight: 2.0 },   // ← 新增
    { name: 'tags', weight: 1.5 },
    { name: 'content_zh', weight: 1.0 },
    { name: 'content_en', weight: 1.0 }
  ],
  threshold: 0.4,             // ← 从 0.35 略微放宽到 0.4，提高召回率
  includeMatches: true,
  minMatchCharLength: 1,
  ignoreLocation: true         // ← 新增：不限制匹配位置，对长 synonyms 字符串很重要
})
```

### Step 4：同义词词典的维护规则

同义词词典应由**总负责人审核后**才能修改。维护规则：

| 规则 | 说明 |
|------|------|
| **口语优先** | 重点收录用户不知道专业术语时会怎么搜的词 |
| **不重复已有** | 如果 terms 中已经有的词，不需要重复写入 synonyms |
| **中英文混写** | 一个 value 字符串里中英文空格分隔即可 |
| **控制长度** | 每个 KP 的同义词控制在 10-20 个词以内，过多会引入噪音 |
| **定期补充** | 根据用户搜索无结果的日志（未来可加）反向补充同义词 |

---

## 四、进阶增强（可选） / Advanced Enhancements

### 4.1 kp-registry.json 的 keywords 字段也纳入索引

目前 `kp-registry.json` 中每个 KP 已有 `keywords` 数组（如 `["动力绳", "dynamic rope", "静力绳", ...]`），但这些 keywords **没有**被纳入 Fuse.js 索引。原因是搜索索引是从 `section-XX-*.json` 构建的，不读 `kp-registry.json`。

**建议**：在 buildIndex 时，额外加载 `kp-registry.json`，将 keywords 合并到搜索文档中：

```jsx
import kpRegistry from '../data/kp-registry.json'

// 在构建 allDocs 时
const registryEntry = kpRegistry.registry.find(r => r.id === kp.id)
const registryKeywords = registryEntry?.keywords?.join(' ') || ''

allDocs.push({
  // ...
  keywords: registryKeywords,   // 新增
  synonyms: searchSynonyms[kp.id] || ''
})
```

Fuse.js keys 中增加：
```jsx
{ name: 'keywords', weight: 2.0 }
```

### 4.2 搜索建议（Search Suggestions）

当用户输入无结果时，提示近似词：

```
搜索 "绳子" — 0 个结果
💡 你是否在找：攀岩绳 | 绳索技术 | 绳结
```

实现方式：当 Fuse.js 在 `threshold: 0.4` 下无结果时，用更宽松的 `threshold: 0.6` 再搜一次，将结果作为"建议"展示。

### 4.3 热门搜索词映射表（极简方案）

如果不想做 Fuse.js 增强，还有一个最简单的方案——硬编码一个**查询重写表**：

```json
{
  "绳子": "攀岩绳 绳索",
  "怕高": "恐惧 冲坠",
  "拉伸": "柔韧性 灵活性",
  "安全帽": "头盔",
  "粉笔": "镁粉 chalk"
}
```

搜索时先查这个表，如果命中就用替换后的词去搜。但这种方案可扩展性差，推荐作为补充而非主方案。

### 4.4 未来可考虑：搜索无结果日志

在 `SearchPage.jsx` 中，当 `results.length === 0` 且 `query` 非空时，将 query 记录到 localStorage 或发送到后端。定期分析这些"搜索失败词"，反向补充同义词词典。

```jsx
// SearchPage.jsx 中
if (searchReady && results.length === 0 && query) {
  // 记录到 localStorage
  const failedQueries = JSON.parse(localStorage.getItem('failedSearches') || '[]')
  if (!failedQueries.includes(query)) {
    failedQueries.push(query)
    localStorage.setItem('failedSearches', JSON.stringify(failedQueries.slice(-100)))
  }
}
```

---

## 五、完整改动文件清单 / Files to Modify

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/data/search-synonyms.json` | **新建** | 177 个 KP 的同义词词典 |
| `src/context/AppContext.jsx` | **修改** | 导入同义词 + keywords，注入索引，调整 Fuse.js 配置 |
| `src/pages/SearchPage.jsx` | **可选修改** | 无结果时显示搜索建议、记录失败查询 |

核心改动量很小（AppContext 约改 10 行），**工作量主要在编写 `search-synonyms.json` 词典**。

---

## 六、同义词词典编写指南 / Synonym Dictionary Writing Guide

### 6.1 编写原则

1. **站在"不懂攀岩的人"的角度思考**：一个刚进攀岩馆的新手会怎么搜索？
2. **覆盖"俗语→专业术语"的映射**：绳子→攀岩绳，安全帽→头盔，粉笔→镁粉
3. **覆盖"描述性搜索→具体知识点"的映射**：手指受伤→滑轮损伤，怕摔→恐惧管理
4. **覆盖"英文缩写→完整术语"**：cam→机械塞，biner→锁扣
5. **不要过度扩展**：每个 KP 只加真正需要的别名，不要把无关的词加进来

### 6.2 重点覆盖的 KP 类型

| 类型 | 原因 | 示例 |
|------|------|------|
| 装备类 | 攀岩装备有很多专业名称，新手不知道 | 安全帽→头盔，粉笔→镁粉 |
| 伤病类 | 用户会用口语描述疼痛部位 | 手指疼→滑轮损伤，肘疼→肌腱炎 |
| 技术类 | 攀岩技术名称对新手很陌生 | 怎么踩→边踩/摩擦踩，怎么抓→握法 |
| 心理类 | 心理状态有很多口语表达 | 怕高→恐惧管理，紧张→竞赛心理 |
| 训练类 | 训练方法的口语表达 | 练指力→挂板训练，拉伸→柔韧性 |

### 6.3 不需要同义词的 KP

以下类型的 KP 通常不需要额外同义词：
- 标题本身就很日常化的（如"热身方案"）
- terms 字段已经覆盖了常见表达的
- 极度专业、用户不太会主动搜索的（如"IFSC 与各国协会"）

### 6.4 验证方法

词典编写完成后，可以用以下测试用例验证搜索效果：

```
测试查询           期望命中的 KP
─────────────────────────────────────
绳子               kp-rope
怕高               kp-fear-of-falling
拉伸               kp-hip-flexibility, kp-shoulder-mobility
手指受伤           kp-pulley-injury
安全帽             kp-helmet
粉笔               kp-chalk
练指力             kp-hangboard-training
怎么抓             kp-grip-types
cam                kp-cam
手皮破了           kp-skin-care
减重               kp-nutrition-basics
去哪里爬           kp-classic-destinations
小孩能爬吗         kp-kids-intro
卡住了不进步       kp-plateau-breaking
```

---

## 七、执行建议 / Execution Recommendation

### 推荐分两步走

**第一步（快速见效）**：
1. 创建 `search-synonyms.json`，先覆盖 50 个高频/高落差 KP
2. 修改 `AppContext.jsx`，接入同义词 + registry keywords
3. 用上方测试用例验证

**第二步（完善补全）**：
1. 补全剩余 127 个 KP 的同义词（很多可以留空）
2. 上线后收集搜索失败日志
3. 根据日志反向补充同义词

---

*本文件为指令文档，不需要自行判断，严格按上述步骤执行即可。*
