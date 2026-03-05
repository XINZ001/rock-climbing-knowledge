# 纠错报告：kp-scoring-systems — 抱石赛计分系统

**日期**：2026-03-05
**触发来源**：用户截图（小红书评论区，用户"建良不睢"和"小木桩"）
**状态**：已执行修改 ✅

---

## 争议内容

**知识点**：`kp-scoring-systems` — 计分系统
**文件**：`rock-climbing-knowledge/src/data/section-10-competition.json`

**原文（中文）**：
> 「2024年起IFSC启用了新的抱石计分系统。每个问题的top得25分，zone得5分。如果首次尝试就达到zone或top，有额外的奖励分。最终得分为所有问题得分之和。如果总分相同，则比较首次尝试成功的次数。」

**原文（英文）**：
> 「Since 2024, IFSC bouldering uses a points-based system: 25 points per top, 5 per zone, with bonuses for first-attempt successes. Total points determine ranking, with flash counts as tiebreakers.」

**用户反馈**：
> "建良不睢"：内容有误，"小木桩"进一步确认仅"top得25分"正确，zone分值错误，attempt机制描述不准确。

---

## 最终结论

⚠️ **部分正确，需补充修正**

- ✅ Top = 25分：正确
- ❌ Zone = 5分：错误，应为 **10分**（2025年IFSC世界杯）
- ❌ "有额外的奖励分"：描述不准确，实际机制是每次**失败尝试扣0.1分**（flash得满分，非独立bonus）
- ❌ "2024年起"：不够精确，2025年起世界杯正式采用新制；巴黎2024奥运会是其原型（但zone结构略不同）
- ❌ "总分相同比较首次尝试成功的次数"：由于0.1分制，相同总分极少，tiebreaker描述有误

---

## 理论支持

| # | 来源 | 关键依据 | 链接 |
|---|------|---------|------|
| 1 | World Climbing / IFSC官方 | 2025年世界杯：Top=25，Zone=10，每次失败尝试扣0.1分 | https://www.worldclimbing.com/news/new-rule-changes-take-effect-for-ifsc-world-cup-series-2025 |
| 2 | Olympics.com | 新抱石计分：flash得满分，之后每次递减0.1 | https://www.olympics.com/en/news/sport-climbing-how-does-the-new-boulder-scoring-work |
| 3 | Inside Climbing | 2025赛季深度分析，明确Zone=10分 | https://www.inside-climbing.com/2025/03/12/deep-dive-looking-new-2025-ifsc-boulder-format/ |
| 4 | Gripped Magazine | 巴黎2024奥运计分解析 | https://gripped.com/indoor-climbing/the-paris-olympics-a-new-scoring-system/ |
| 5 | 8a.nu / Vertical-Life | 2025年新积分制报道 | https://www.8a.nu/news/ifsc-boulder-scoring-by-points-in-2025-id8qr |

---

## 修改记录

**修改前（中文）**：
> 「2024年起IFSC启用了新的抱石计分系统。每个问题的top得25分，zone得5分。如果首次尝试就达到zone或top，有额外的奖励分。最终得分为所有问题得分之和。如果总分相同，则比较首次尝试成功的次数。这个新系统简化了之前较为复杂的乘积排名方式，让观众更容易理解比赛局势。」

**修改后（中文）**：
> 「2025年起IFSC世界杯正式启用新的积分制计分系统（巴黎2024奥运会是其原型）。每个问题的top得25分，zone得10分。首次尝试完成（即flash）可拿到满分；每次失败尝试扣除0.1分（例如第二次才完成top则得24.9分）。最终得分为所有问题积分之和，分数高者排名靠前。这一新体系取代了之前的「Top数>Zone数>尝试次数」计次排名方式，使比赛实时局势对选手和观众都更为直观。」

**修改前（英文）**：
> 「Since 2024, IFSC bouldering uses a points-based system: 25 points per top, 5 per zone, with bonuses for first-attempt successes. Total points determine ranking, with flash counts as tiebreakers. This replaced the older multiplication system for better spectator comprehension.」

**修改后（英文）**：
> 「Starting with the 2025 IFSC World Cup series (modeled on the Paris 2024 Olympic format), bouldering uses a points-based system: 25 points per top, 10 per zone, with 0.1 points deducted per failed attempt (a flash earns full points; a second-attempt top earns 24.9). Total points determine ranking. This replaced the older count-based system (tops > zones > attempts) for better spectator comprehension.」
