# 纠错报告：kp-lead-competition + kp-scoring-systems — 先锋赛同分规则

**日期**：2026-03-05
**触发来源**：小木桩（小红书评论区）
**状态**：已执行修改 ✅

---

## 争议内容

**知识点**：`kp-lead-competition` + `kp-scoring-systems`
**文件**：`rock-climbing-knowledge/src/data/section-10-competition.json`

**原文（两处，中文）**：
> 「如果多名选手到达相同高度，则通过**用时较短者排名靠前**来决定名次。」
> 「如果两名选手成绩相同，**先完成的选手（用时更短者）排名靠前**。」

**原文（两处，英文）**：
> 「Ties are broken by **faster completion time**.」

**用户反馈**：
> 同分处理顺序有误，正确顺序为：决赛同分→SF排名→资格赛排名→最后才用时。

---

## 最终结论

❌ **原内容有误**

「同分看用时」仅适用于**资格赛**（无前置轮次）。IFSC 规则中，决赛同分优先使用 countback（回溯前置轮次排名），用时仅为最后手段。

**正确顺序**：
- 决赛同分 → 半决赛排名 → 资格赛排名 → 用时
- 半决赛同分 → 资格赛排名 → 用时
- 资格赛同分 → 用时

**实战验证**：2025年IFSC世锦赛先锋决赛，Homma Taisei 与 Alberto Ginés López 同达第42+手点，由半决赛排名（countback）决定 Homma 获铜牌。

---

## 理论支持

| # | 来源 | 关键依据 | 链接 |
|---|------|---------|------|
| 1 | IFSC 官网（2025世锦赛报道） | Homma vs López 铜牌由半决赛 countback 决定，非用时 | https://www.worldclimbing.com/events_old/ifsc-climbing-world-championships-seoul-2025/news/lee-and-garnbret-take-lead-world-titles |
| 2 | Olympics.com（2025世锦赛） | 独立印证 42+ 同分 countback 结果 | https://www.olympics.com/en/news/ifsc-sport-climbing-world-championships-2025-lee-dohyun-wins-lead-gold-republic-of-korea |
| 3 | GearJunkie / IFSC 规则解析 | 确认 countback 机制：previous round ranking 作为同分决定因素 | https://gearjunkie.com/climbing/ifsc-climbing-explained |
| 4 | IFSC 官方规则文件（Jan 2025） | 官方 PDF | https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/w2ggglzziip6zpnpkir4.pdf |
| 5 | Zenocycle（IFSC规则） | 确认 countback 存在；该来源顺序描述有误（time→countback），已被实战结果推翻 | https://zenocycleparts.com/blogs/biking-topic-gearjunkie/ifsc-world-cup-climbing-rules-scoring-explained |

---

## 修改记录

**kp-lead-competition → content.zh（修改前）**：
> 「如果多名选手到达相同高度，则通过用时较短者排名靠前来决定名次。」

**修改后**：
> 「同分处理顺序取决于轮次：决赛同分→先比半决赛排名（countback），仍相同→比资格赛排名，最后→比用时；半决赛同分→先比资格赛排名，最后→比用时；资格赛同分→直接比用时。」

**kp-lead-competition → content.en（修改前）**：
> 「Ties are broken by faster completion time.」

**修改后**：
> 「Tiebreaking depends on the round: in the Final, by semifinal ranking (countback), then qualification ranking, then time; in the Semifinal, by qualification ranking then time; in Qualification, by time alone.」

**kp-scoring-systems → content.zh / en**：同上逻辑，对应段落已同步修正。
