# 视频信息拆分与栏目调研表（v1）

生成日期：2026-03-01

## 1) 视频信息拆分

- 单视频（可直接对应单条内容）：19 条
- 栏目/频道/站点页（需要二次拆解为具体视频）：48 条（去重后 26 个栏目链接）

### 1.1 单视频（来自当前库）
| 知识点ID | 标题 | 链接 |
|---|---|---|
| s01-categories | Trad, Sport, Free Solo, Aid, Bouldering Explained | https://www.youtube.com/watch?v=DxZbc6PJjHE |
| s01-categories | Climbing 101: How to Boulder Indoors | https://www.youtube.com/watch?v=eFkfVMnlpIA |
| s01-categories | Learning to Lead | https://www.youtube.com/watch?v=ecx75KwBCV8 |
| s01-categories | An Introduction to Trad Climbing | https://www.youtube.com/watch?v=VrLf6GwzLdo |
| s01-categories | 室内攀岩科普基础入门视频教程 | https://www.bilibili.com/video/BV1dg4y1871t/ |
| s02-finger | Crimp Grips Tutorial: Crimp Like a Pro | https://www.youtube.com/watch?v=o59qz4orcWs |
| s02-finger | 指力板初中阶完整训练模板分享 | https://www.bilibili.com/video/BV1W44y1y7nT/ |
| s02-finger | 家用指力板选购安装训练详解 | https://www.bilibili.com/video/BV1FE411A7uR/ |
| s03-handholds | Crimp Grips Tutorial: Crimp Like a Pro | https://www.youtube.com/watch?v=o59qz4orcWs |
| s03-footwork | 攀岩动作与技巧—正身动作 | https://www.bilibili.com/video/BV1v64y1c78u/ |
| s03-footwork | 新手怎么入门攀岩？沉浸式教程 | https://www.bilibili.com/video/BV1JNpJzcERW/ |
| s04-fear | 先锋攀不敢冲坠？安全冲坠和保护教学 | https://www.bilibili.com/video/BV1j5411Y7kQ/ |
| s05-basic | 户外运动攀/传统攀装备 10 分钟全知道 | https://www.bilibili.com/video/BV1ok4y127UL/ |
| s05-trad | 机械塞和岩塞怎么用？传统攀放置保护方法 | https://www.bilibili.com/video/BV1K64y117Bi/ |
| s06-outdoor | Lead Belay Techniques by Chris Sharma | https://www.bilibili.com/video/BV1yX4y1w7SX/ |
| s06-rope | Essential Knots: Figure 8 Knot Tutorial | https://www.bilibili.com/video/BV1bx411y7y9/ |
| s06-rope | Quick Knot Tutorial: Clove Hitch | https://www.bilibili.com/video/BV1hY411E7S6/ |
| s07-prevention | Simple Shoulder Warm-Up for Climbers | https://youtu.be/_XONhxQ-Gbk |
| s01-olympics | Paris 2024 Sport Climbing Highlights | https://www.olympics.com/en/video/highlights-sport-climbing-olympic-games-paris-2024 |

### 1.2 栏目列表（去重后）
| 栏目/频道 | 栏目链接 |
|---|---|
| Reel Rock | https://www.youtube.com/@reelrock |
| Magnus Midtbø | https://www.youtube.com/@magmidt |
| Lattice Training | https://www.youtube.com/@LatticeTraining |
| Hooper's Beta | https://www.youtube.com/@HoopersBeta |
| Catalyst Climbing | https://www.youtube.com/@CatalystClimbing |
| Movement for Climbers | https://www.youtube.com/@movementforclimbers |
| Rockentry | https://www.youtube.com/@rockentry |
| Bouldering Bobat | https://www.youtube.com/@BoulderingBobat |
| Wide Boyz | https://www.youtube.com/@WideBoyztv |
| Bouldering Highlights | https://www.youtube.com/@BoulderingHighlights |
| Adam Ondra | https://www.youtube.com/@AdamOndra |
| Power Company Climbing | https://www.youtube.com/@powercompanyclimbing |
| Petzl | https://www.youtube.com/@petzl |
| VDiff Climbing | https://www.vdiffclimbing.com/ |
| HowNOT2 | https://www.youtube.com/@HowNOT2 |
| Ortovox | https://www.youtube.com/@ORTOVOX |
| REI | https://www.youtube.com/@REI |
| Climbing Magazine | https://www.youtube.com/@ClimbingMagazine |
| The Climbing Doctor | https://www.youtube.com/@theclimbingdoctor |
| Climbing Nomads | https://www.youtube.com/@TheClimbingNomads |
| Mellow Climbing | https://www.youtube.com/@mellowclimbing |
| AlpineSavvy | https://www.alpinesavvy.com/videos |
| PBS News | https://www.pbs.org/newshour/show/adaptive-climbing |
| IFSC | https://www.youtube.com/@IFSClimbing |
| Strong Mind Climbing | https://www.strongmindclimbing.com/ |
| Olympics | https://www.olympics.com/en/video/highlights-sport-climbing-olympic-games-paris-2024 |

## 2) 栏目拆解实操（已完成）

> 执行步骤：
> 1. 搜索栏目来源页
> 2. 提取栏目内视频标题与链接
> 3. 按标题语义映射主要知识点

### 2.1 Hooper's Beta（已拆解 10 条最新条目）
来源页：
- https://www.hoopersbeta.com/
- https://www.hoopersbeta.com/library/lateral-elbow-pain

| 栏目 | 视频标题（栏目条目） | 链接 | 主要知识点（建议映射） |
|---|---|---|---|
| Hooper's Beta | How to Fix Lateral Elbow Pain (Tennis Elbow) | https://www.hoopersbeta.com/library/lateral-elbow-pain | 7.1 常见伤病；7.3 康复 |
| Hooper's Beta | When 'Tight to the Wall' Actually Does the Opposite － Coaching w/ Dan Pt. 4 | https://www.hoopersbeta.com/library/body-tension-coaching-with-dan | 3.3 身体定位与重心；2.3 核心力量 |
| Hooper's Beta | Pro Climber vs PT Debate Good/Bad Climbing Advice \| Hype vs Reality Pt. 3 | https://www.hoopersbeta.com/library/hype-vs-reality-pt-3 | 4.3 训练规划；4.4 Projecting 策略 |
| Hooper's Beta | How I Fix Stubborn Medial Elbow Pain / Tendinitis | https://www.hoopersbeta.com/library/fix-stubborn-medial-elbow-pain | 7.1 常见伤病；7.3 康复 |
| Hooper's Beta | 180 Days Testing Changed Our Opinions on Finger Training Devices | https://www.hoopersbeta.com/library/180-days-testing-edges | 2.1 指力训练；5.5 训练装备 |
| Hooper's Beta | One Essential Tool for Progressing on Overhangs － Coaching w/ Dan Pt. 3 | https://www.hoopersbeta.com/library/one-essential-tool-for-progressing-on-overhangs-coaching-w/-dan-pt-3 | 3.5 特殊地形（仰角）；2.3 核心 |
| Hooper's Beta | How to Get Bulletproof Wrists in 15 Minutes | https://www.hoopersbeta.com/library/how-to-get-bulletproof-wrists-in-15-minutes | 7.2 预防策略；2.4 灵活性 |
| Hooper's Beta | Shoulder Orientation: Climbing Technique #2 － Coaching w/ Dan | https://www.hoopersbeta.com/library/shoulder-orientation-climbing-technique-2-coaching-w/-dan | 3.3 身体定位与重心 |
| Hooper's Beta | How to Fix Ulnar Wrist Pain (TFCC Injury Recovery Guide) | https://www.hoopersbeta.com/library/how-to-fix-ulnar-wrist-pain-tfcc-injury-recovery-guide | 7.1 常见伤病；7.3 康复 |
| Hooper's Beta | The "Off Foot" is Climbing Technique #1 － Coaching w/ Dan | https://www.hoopersbeta.com/library/climbing-technique-off-foot | 3.1 脚法；3.3 重心管理 |

### 2.2 Adam Ondra - Tips & Tricks（已拆解到可抓取条目）
来源页：
- https://www.adamondra.com/%23tips-and-tricks/
- https://www.adamondra.com/tips-tricks-episode-1-climb-smart-boulder-training-efficiency/
- https://www.adamondra.com/what-do-new-tips-tricks-on-my-youtube-channel-mean/

| 栏目 | 视频标题（栏目条目） | 链接 | 主要知识点（建议映射） |
|---|---|---|---|
| Adam Ondra Tips & Tricks | Tips & Tricks Episode 1 - Climb Smart: Boulder training efficiency | https://www.adamondra.com/tips-tricks-episode-1-climb-smart-boulder-training-efficiency/ | 4.3 训练规划；3.6 路线阅读 |
| Adam Ondra Tips & Tricks | Tips & Tricks Episode 2: How to climb boulders on your peak level | https://www.adamondra.com/tips-tricks-episode-2-climb-better-how-to-climb-boulders-on-your-peak-level/ | 4.4 Projecting；3.6 路线阅读 |
| Adam Ondra Tips & Tricks | What Do New Tips & Tricks on my YouTube Channel Mean? | https://www.adamondra.com/what-do-new-tips-tricks-on-my-youtube-channel-mean/ | 4.3 训练规划（系列导览） |
| Adam Ondra Tips & Tricks | Adam's Warm-Up Routine: Injury Prevention and Performance | https://www.adamondra.com/adam-s-warm-up-routine-injury-prevention-and-performance/ | 7.2 预防策略；2.4 热身/灵活性 |
| Adam Ondra Tips & Tricks | Crimp Grips Tutorial: Crimp Like a Pro Climber | https://www.adamondra.com/crimp-grips-tutorial-crimp-like-a-pro-climber/ | 2.1 指力；3.2 手法与抓握 |
| Adam Ondra Tips & Tricks | How to efficiently and safely clean a route from quickdraws? | https://www.adamondra.com/how-to-efficiently-and-safely-clean-a-route-from-quickdraws/ | 6.3 绳索技术；5.2 保护装备 |
| Adam Ondra Tips & Tricks | Functional Training: How to Train Muscle Coordination | https://www.adamondra.com/functional-training-how-to-train-muscle-coordination/ | 2.3 核心；2.2 上肢；2.4 协调与灵活性 |
| Adam Ondra Tips & Tricks | Climb Smart: Boulder training efficiency（YouTube链接） | https://www.youtube.com/watch?v=SLJTwFQE10A | 4.3 训练规划；3.6 读线与尝试策略 |
| Adam Ondra Tips & Tricks | Episode 2（页面中跳转出的短链接） | https://youtu.be/8vHn8EncLzE | 4.4 Projecting；3.6 读线 |

## 3) 当前结论

- 你的思路是正确的：必须先把“栏目”拆成具体视频，再做知识点对齐。
- 目前已证明这套流程可执行（至少对 Hooper's Beta、Adam Ondra 的 Tips 系列可稳定提取）。
- 下一步应对其余 24 个栏目按同样流程继续补齐，最终形成“栏目视频全集 -> 知识点映射库”。

