import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PageSEO from '../components/PageSEO'
import mbtiData from '../data/climbing-mbti.json'

/* ─── copywriting (imported inline to keep single-file for v1) ─── */
const COPY = {
  'DO-S': '你对搭子的要求比对自己还高。别人掉了你比他还急，"脚！你的脚呢？说了多少次了！"你说的都对，你也知道自己说的都对，这才是最气人的地方。你骂人的时候是真的心疼，被你骂过的人后来也真的进步了，他们还会回来找你继续骂。你觉得这不是很正常的事情吗？指出问题，解决问题，变得更强，这有什么好玻璃心的。你看不得别人用错误的方式反复尝试，那种感觉就像看人用错误的姿势跑步，膝盖迟早废掉，你不说你难受。你的搭子们又爱你又怕你，每次看到你走过来都下意识地把脚踩好一点。你觉得这说明你的方法有效。你唯一想不通的是，为什么有些人明明知道自己哪里有问题，却不想听别人说出来。在你的世界里，不指出问题才是真正的不尊重。',
  'EXCEL': '你的攀岩训练日志可能比你的日记还详细。几点到馆、热身几分钟、每条线的级别和尝试次数、休息时间、RPE评分，全都记得清清楚楚。周末发朋友圈的格式是"V6×1 V5×2 V4×3，本周完成率87%"，你觉得这是分享训练成果，别人觉得你在写周报。你买攀岩鞋之前会看至少十篇测评，你的镁粉是对比了三个品牌之后选的。你可能不是馆里爬得最好的，但你一定是最清楚自己哪里不好的。你坚信进步是可以被设计出来的，天赋只是还没被数据追上的变量。你最看不起的是那种"凭感觉爬"的人，但你偶尔也会羡慕他们那种不用想那么多就能享受的能力。',
  'GHOST': '你到岩馆的时间是固定的，走的时间也是固定的，中间不社交。戴着耳机，对着自己的训练计划一条一条过，爬完收包走人。你不是不喜欢岩馆里的人，你只是觉得攀岩这件事不需要别人参与。你试线的时候不想被看到，掉下来的时候不想被安慰，完攀了的时候也不需要别人鼓掌。你的攀岩世界里只有你和墙，这让你感到安全。有人觉得你高冷，有人觉得你social恐惧，但你自己知道不是。你只是觉得，进步这件事，是你自己和自己之间的事。你最怕的不是爬不上去，而是在爬不上去的时候被人看到。',
  'NERD': '你已经在这条线上花了47天了。别人问你要不要换条线试试，你觉得他们不理解。这条线你还没完攀，怎么能换？一个游戏关卡没通关你能睡着吗？一道数学题没解出来你能翻到下一页吗？你不能。你清楚地记得每一次进步，第23天你终于稳住了那个脚点，第31天你第一次摸到了倒数第二个手点。你不是不知道换条线可能效率更高，你只是过不了自己心里那道坎。一件事没做完就开始下一件，那叫放弃。你这辈子最讨厌的词就是放弃。你的字典里没有"差不多就行了"这个概念，要么做完要么死在这里。不撞南墙不回头，撞了还要再撞两下，撞出血了先看看墙有没有裂。',
  'SIMP': '你觉得强的人说什么都是对的。馆里V7的大佬说"这双鞋好穿"，你第二天就下单了。大佬说"这个beta应该用heel hook"，你连试都不试别的方案直接heel hook。三个不同的大佬给了你三个互相矛盾的建议，你全都认真尝试了一遍，最后爬得比没人指导的时候还乱。你不是没有自己的想法，你是不太敢相信自己的想法。毕竟人家V7你才V4，人家说的肯定比你想的靠谱吧？你是岩馆里最好学的人，也是最容易被带偏的人。你收藏了几十个攀岩教学视频，关注了一堆攀岩大V，你的知识库越来越大，但你的判断力好像没怎么跟上。因为你从来没给自己一个机会去犯自己的错。',
  'DO-M': '你觉得手指不流血的训练不算训练。你的A2滑轮已经隐隐作痛两周了，但你觉得"还行，就是有点紧"。你的前臂上全是老茧和旧伤，你把这些当勋章。在你的逻辑里，痛苦等于付出，付出等于进步，所以痛苦等于进步。你的训练量可能是全馆最大的，你从来不跳过训练日，发烧了都要去馆里"活动一下"。你最看不起的是那些"练了两天就说累"的人。你觉得吃苦是一种能力，而你这方面天赋异禀。你唯一没想过的问题是：如果用一半的训练量能达到一样的效果，你愿意吗？你可能不愿意。因为对你来说，不吃苦就不对。',
  'DIE': '你对每条线路都有看法，对每个人的beta都有优化方案。"这条线的核心在于第三个手点的body position，你看你这样重心太高了，应该先drop knee再出手"，你说得头头是道。能不能演示一下？"今天手皮薄了，改天吧。"你的攀岩知识储备确实不差，但你上一次真正try hard是什么时候你自己可能也记不太清了。你享受的不是爬上去的感觉，而是站在垫子上给别人讲解时他们点头的表情。你觉得自己是在帮忙，但你有没有发现，你从来只在比你弱的人面前当爹？遇到比你强的人你就变成了安安静静的好学生。你的知识是真的，你的热心也是真的，但你得承认你喜欢的是"被需要"的感觉，多过"变更强"的感觉。',
  'GREEN-T': '"加油！你可以的！再试一次！"这些话从你嘴里说出来特别真诚，连你自己有时候都信了。但你心里知道，当你说"加油"的时候，大概有三成的概率你的真实想法是"求你掉下来"。不是因为你恨这个人，你甚至挺喜欢他的。但如果他爬上去了而你没有，你今晚会在被窝里辗转反侧把这件事复盘三遍。你把嫉妒包装成了鼓励，把竞争心藏在了微笑后面。你做得太好了，从来没有人怀疑过你，你也因此从来没有机会和任何人聊过这件事。你是岩馆里人缘最好的人之一，每个人都觉得你大方、阳光、没有攻击性。只有你自己知道，你在意的东西比你表现出来的多得多。',
  'TILT': '你的脸上从来看不出来，但你的内心有一台24小时运转的比较机器。搭子flash了你磨了三周的项目线，你说"牛逼"的语气完美无缺，但你开车回家的路上沉默了40分钟。你不会发朋友圈抱怨，不会跟别人说你不开心，你只会一个人默默消化。你最讨厌有人问你"你爬V几"，因为不管你回答什么你都觉得不够。但你更讨厌的是没人问你，因为那意味着你根本不值得被问。你知道比较是没有意义的，你也知道每个人的进度不一样，这些道理你都懂，但懂了也没有用。下次看到那个比你晚入坑半年的人又爬上去一条新线，你还是会在心里默默地碎一下。',
  'BABY': '没爬上去？鞋不对。又掉了？今天湿度太大。还是没爬上去？这条定级明显偏了至少半级。你换了个定级宽松的新馆突然爬得特别好，你终于确认了："这才是我的真实水平，之前那个馆定级有问题。"你不是在找借口，你是真的这么认为。在你的世界里，你的能力是稳定的，波动的是外部条件。鞋、天气、手皮、岩壁摩擦力、线路设计师的审美、今天吃的东西消化得不太好，这些都是变量，而你不是变量。你最常说的一句话是"我正常发挥的话肯定能爬上去"，只是正常发挥的条件好像从来没有同时满足过。',
  'TRASH': '"我好菜啊哈哈哈"是你到岩馆说的第一句话，也是最后一句话，中间可能还说了七八次。你还没开始爬就已经声明自己是废物了。"我就是个V3菜鸡别对我有期望"。你朋友圈发攀岩视频一定配文"废物日记"或者"又是丢人的一天"。你不是真的觉得自己差，你是在提前把所有人的期待降到地板上。这样你掉下来是正常的，爬上去了反而是惊喜，怎么样都不亏。你玩的是一个永远不会输的心理游戏。但你偷偷一个人在馆里的时候，试线比谁都认真。你最怕的不是爬不上去，是被人发现你其实很在乎。',
  'MOM': '"你水喝了吗？""镁粉要不要补一下？""我帮你录一个吧？""这个手点你可以试试侧拉。"没有人请你帮忙，但你已经帮完了。你不是在讨好别人，你是真的看不得别人渴着、累着、卡着。你是那种搭子掉下来你比他还着急的人，那种别人还没说口渴你已经把水递过去的人。你的存在让所有人都觉得温暖和安全，但你有没有发现，你花在别人身上的时间比花在自己身上的多得多？你总是在帮别人看线、帮别人调整动作、帮别人录视频，但你自己上一次认真试一条线是什么时候？你不是不想进步，你只是觉得照顾好别人这件事，好像比照顾好自己更重要，也更容易做到。',
  'HUNT-ER': '你来岩馆的时候会花比平时多三倍的时间挑穿什么。你热身的位置永远选在人流量最大的那面墙，你爬的线路难度刚好在"看起来有点厉害但不会掉下来丢脸"的区间。你的社交能力是真的强，你能在五分钟之内和任何人聊起来，"你这双鞋是什么型号？""你一般什么时候来？""要不要一起试那条线？"这些话你说得特别自然。教人爬墙是你最喜欢的环节，因为这需要站得很近、有肢体接触、还能展示你"有耐心"的一面。你的攀岩水平其实就那样，但你不太在意，因为你来这里的KPI和攀岩水平无关。',
  'TALK-ER': '你买了全天票，爬了三条线，聊了四个小时，发了两条朋友圈，晚上回家觉得"今天练得不错"。你是岩馆的社交中心，你能同时和三拨人维持对话，你知道每个常客的名字和最近在磨什么线。有人来了你打招呼，有人走了你说拜拜，中间的时间你在垫子上坐着和人聊天气、聊工作、聊最近哪个馆新开了、聊那个谁好像和那个谁在一起了。你的攀岩水平这半年基本没变过，但你的朋友数量翻了三倍。你不觉得这有什么问题，因为在你看来，岩馆本来就是一个有墙的咖啡厅。',
  'FILTER': '你到岩馆做的第一件事不是热身，是看看今天的光线条件。你最喜欢下午四点左右的自然光从大窗户打进来，拍视频的时候会有一种"纪录片"的质感。你攀爬的角度和路线选择有一部分是按镜头效果来的，那条V4虽然你能完攀但画面不好看，旁边那条V3拍出来动作更流畅。你的小红书攀岩内容比你的实际水平好看至少两个级别，因为你只发成功的，而且角度选得特别讲究。你不觉得这是造假，你觉得这是"内容创作"。你在岩馆里认识的人比大部分人都多，因为"可以互相拍一个吗"是最好的破冰方式。',
  'PUPPY': '你来岩馆永远不是一个人来的。你有一个固定搭子或者一个固定的小团体，他们去哪个区你去哪个区，他们爬什么线你排队跟着爬。你自己不太会选线，看到一面墙上十条线你不知道该试哪条，但如果有人说"来试试这条"你就立刻有了方向。没有搭子的日子你大概率不会来岩馆，不是因为不喜欢攀岩，是因为一个人来你不知道该干什么。你其实挺享受攀岩的，只是你更享受"和大家一起攀岩"。你最开心的时刻不是完攀了一条线，是大家一起试同一条线然后互相加油的那个氛围。',
  'CLOWN': '你掉下来的第一反应是大喊"哈哈哈我好菜啊！"然后全场都笑了。你是岩馆里的气氛担当，你摔了能编成段子，卡住了能编成小品，完攀了反而不知道该说什么因为大家已经习惯你搞笑了。你用幽默化解一切尴尬，包括自己的和别人的。有人掉下来不好意思的时候，你会故意比他摔得更难看让他觉得"至少我不是最差的"。你是大家都喜欢的人，但你有没有发现，没有人认真地教过你攀岩？因为你给所有人的印象都是"他就是来玩的"。你到底在不在乎自己的水平？你好像没让任何人有机会知道答案。',
  'YOLO': '你不读线。你觉得站在下面看来看去是浪费时间，上去了自然就知道该怎么爬。你也不太热身，"爬第一条线就是热身"。你上墙的速度是全馆最快的，冲到一半发现不知道下一步往哪走的次数也是全馆最多的。你掉下来不会懊恼，拍拍手就上去再试一次，用另一种你临场发明的方式。你的攀岩风格完全不可预测，有时候你会用一种完全没有人想到的方式完攀一条线，旁边的人看得目瞪口呆。有时候你会在第二个手点就掉下来，因为你甚至没看那个手点在哪。你享受的不是结果，是那种"我也不知道会发生什么"的刺激感。想太多的人生多无聊。',
  'DRAMA': '有人看你爬的时候，你能感觉到自己每个细胞都活过来了。你的动作变得流畅、有力、充满表现力，好像有一台无形的摄像机在跟拍你，而你正在拍一部关于自己的纪录片。你在高处锁定位置的那个停顿不是为了休息，是为了让画面更有张力。你大声呼气不是因为累，是因为这样更有气势。但是当岩馆里只有你一个人的时候，你连V3都懒得认真爬。不是爬不了，是没有意思。你需要的不是更高的级别，你需要的是观众。你可能不愿意承认，但你爬得最好的那次，一定是旁边有人在看的那次。',
  'DEAF': '楼下的人喊破喉咙"左手！左手！上面那个！"你完全没听见。不是你故意忽略，是你一上墙就进入了另一个频道。外面的声音、旁边的人、楼下的建议，全部自动静音。你的世界里只剩你和这面墙，每一个手点的触感、每一次重心的移动，你全部感受得到，但就是听不到人说话。你下来之后搭子说"我刚才喊了你八百遍"，你是真的一脸茫然不知道他在说什么。你不是social恐惧也不是高冷，你只是在墙上的时候灵魂会去别的地方。有人觉得你不尊重别人的建议，但你只是单纯地、物理性地、没有听到。',
  'HANG': '你已经挂在墙上30秒了。你既不往上也不往下，你的手臂越来越酸但你不肯放手。下面的搭子问"你还好吗"你说"我在休息"，但你心里知道你不是在休息，你是不知道下一步该怎么办。往上你不确定那个手点够不够得到，往下你又不想放弃因为你好不容易爬到这里了。所以你就挂着，等待灵感出现或者力量消失，看哪个先来。你人生中大部分的卡住时刻都是这样处理的：不前进也不放弃，就停在原地，直到问题自己消失或者你再也撑不住了为止。你不是没有解决问题的能力，你只是太怕做出错误的决定了。',
  'NPC': '别人爬什么你爬什么，别人走你也走。有人问你"今天想爬什么"你说"都行啊你们定"。你没有训练计划，没有目标级别，没有正在磨的项目线。你来岩馆是因为朋友来了或者今天刚好没事，你不来岩馆也是因为朋友没来或者今天刚好有事。你是岩馆里存在感最低的人，但你可能也是最没有压力的人。你不焦虑自己的等级，不嫉妒别人的进步，不纠结今天的状态好不好，因为这些概念在你的系统里根本不存在。你来就爬，爬了就走。有人说你佛系，有人说你没追求。你觉得都无所谓，你只是觉得攀岩挺好玩的而已，不需要更多理由了。',
  'LOL': '"啊又掉了哈哈无所谓。"你的攀岩哲学可以总结为六个字：开心就好别卷。你不理解为什么有人会因为一条线没完攀而不开心，你也不理解为什么有人会做攀岩训练计划，你更不理解为什么有人的攀岩日志比高中课堂笔记还认真。在你看来，攀岩就是一个好玩的事情，好玩的事情不需要那么认真。你可能永远停在V3，但你觉得V3挺好的。你最害怕的事情不是爬不上去，而是有一天你开始在乎自己爬不爬得上去，因为那意味着攀岩从"好玩的事"变成了"让你焦虑的事"，那还不如不爬。',
  'SHORT': '你们高个子是不会懂的。同一个手点你们伸手就到了，我需要先flag再推再跳才能摸到。你们觉得这条线V3没问题，但你们用的是V3的beta吗？你们用的是180cm的beta。你花了比别人多三倍的effort完成同一条线，但在等级上这叫"一样"。你知道这不公平，你也知道没有人会承认这件事。你最烦的一句话是"技术好的话身高不是问题"，说这话的人身高一定在175以上。你有没有想过，也许你已经比你以为的强很多了，因为你每条线都在hard mode。但这个想法只会在你心情好的时候出现大概三秒钟。',
  'DRUNK': '攀岩完不喝一杯等于没爬。这是你的核心信条，不可动摇。你的攀岩搭子同时也是你的酒友，你选择岩馆的标准之一是附近有没有好的bar。你在墙上可能表现平平，但你在酒桌上的表现从来不让人失望。你的抱石能力和你的酒量之间有一个你不愿意承认的反比关系。你觉得运动和喝酒是完美的组合，一个消耗卡路里一个补回来，维持宇宙平衡。',
}

/* ─── scoring helpers ─── */
const DIMS = ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10']
const MOT_DIMS = ['D1','D2','D3','D4']
const DEF_DIMS = ['D5','D6','D7','D8','D9','D10']

function computeResult(answers) {
  // 1. tally dimension scores
  const scores = {}
  DIMS.forEach(d => { scores[d] = 0 })
  const triggers = []
  mbtiData.questions.forEach(q => {
    const chosen = answers[q.id]
    if (!chosen) return
    const opt = q.options.find(o => o.id === chosen)
    if (!opt) return
    if (opt.trigger) triggers.push(opt.trigger)
    if (q.dim) scores[q.dim] += opt.score
  })

  // 2. check hidden triggers
  if (triggers.includes('DRUNK')) return 'DRUNK'
  if (triggers.includes('HUNTER')) {
    const d3 = scores.D3 || 0
    const d6 = scores.D6 || 0
    if (d3 >= 4 && d6 >= 4) return 'HUNT-ER'
  }

  // 3. manhattan distance matching
  const types = mbtiData.types
  let bestType = null
  let bestDist = Infinity
  Object.entries(types).forEach(([code, t]) => {
    if (t.hidden) return
    const vec = t.vec
    let dist = 0
    DIMS.forEach((d, i) => { dist += Math.abs((scores[d] || 0) - vec[i]) })
    if (dist < bestDist) { bestDist = dist; bestType = code }
  })

  const maxDist = 40
  const matchPct = Math.max(0, Math.round((1 - bestDist / maxDist) * 100))

  return { type: bestType, matchPct, scores }
}

/* ─── components ─── */

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full bg-stone-border/40 rounded-full h-2 mb-6">
      <div
        className="h-2 rounded-full bg-forest transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function QuestionCard({ question, selected, onSelect, lang }) {
  const text = question.text[lang] || question.text.zh
  return (
    <div className="animate-fadeIn">
      <h2 className="text-lg font-semibold text-text-primary mb-5">{text}</h2>
      <div className="flex flex-col gap-3">
        {question.options.map(opt => {
          const isSelected = selected === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'border-forest bg-forest-light/40 shadow-sm'
                  : 'border-stone-border bg-stone-card hover:border-forest/30 hover:bg-stone-bg'}`}
            >
              <span className="text-sm text-text-primary">{opt.text[lang] || opt.text.zh}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ResultCard({ result, lang }) {
  const isHidden = typeof result === 'string'
  const typeCode = isHidden ? result : result.type
  const matchPct = isHidden ? 99 : result.matchPct
  const typeInfo = mbtiData.types[typeCode]
  if (!typeInfo) return null
  const copy = COPY[typeCode] || ''
  const zhName = typeInfo.name.zh

  return (
    <div className="animate-fadeIn">
      {/* type header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{typeInfo.emoji}</div>
        <div className="text-2xl font-bold text-text-primary font-mono tracking-wider mb-1">{typeCode}</div>
        <div className="text-xl font-semibold text-text-primary mb-2">{zhName}</div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-forest-light text-forest">
          匹配度 {matchPct}%
        </div>
      </div>

      {/* description */}
      <div className="bg-stone-bg rounded-2xl p-5 mb-6">
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{copy}</p>
      </div>

      {/* matrix position */}
      {typeInfo.mot && (
        <div className="flex items-center justify-center gap-3 mb-6 text-xs text-text-secondary">
          <span className="px-2 py-1 rounded-full bg-stone-bg border border-stone-border">动机：{typeInfo.mot}</span>
          <span className="px-2 py-1 rounded-full bg-stone-bg border border-stone-border">防御：{typeInfo.def}</span>
        </div>
      )}

      {/* actions */}
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={() => {
            const text = `我的攀岩MBTI是 ${typeCode}（${zhName}）${typeInfo.emoji}\n匹配度 ${matchPct}%\n\n${copy.slice(0, 100)}…\n\n来测测你是什么类型 👉`
            navigator.clipboard?.writeText(text)
            alert('已复制到剪贴板！')
          }}
          className="w-full max-w-xs px-6 py-3 rounded-xl bg-forest text-stone-card font-medium text-sm hover:bg-forest-dark transition-colors"
        >
          复制结果分享给朋友
        </button>
        <Link
          to="/"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}

/* ─── main page ─── */

export default function ClimbingMbtiPage() {
  const { lang } = useApp()
  const questions = mbtiData.questions
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [showCalculating, setShowCalculating] = useState(false)

  const currentQ = questions[currentIdx]

  const handleSelect = useCallback((optId) => {
    const qId = currentQ.id
    setAnswers(prev => ({ ...prev, [qId]: optId }))

    // auto-advance after short delay
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1)
      } else {
        // calculate result
        setShowCalculating(true)
        setTimeout(() => {
          const newAnswers = { ...answers, [qId]: optId }
          const r = computeResult(newAnswers)
          setResult(r)
          setShowCalculating(false)
        }, 1500)
      }
    }, 300)
  }, [currentIdx, currentQ, answers, questions.length])

  const handleRestart = useCallback(() => {
    setCurrentIdx(0)
    setAnswers({})
    setResult(null)
    setShowCalculating(false)
  }, [])

  return (
    <>
      <PageSEO
        title={lang === 'zh' ? '攀岩MBTI测试' : 'Climbing MBTI Test'}
        description="发现你的攀岩人格类型"
      />
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-text-primary">
            🧩 {lang === 'zh' ? '攀岩MBTI测试' : 'Climbing MBTI'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {lang === 'zh' ? '内测版 · 22道题 · 约3分钟' : 'Beta · 22 questions · ~3 min'}
          </p>
        </div>

        {showCalculating && (
          <div className="text-center py-20 animate-pulse">
            <div className="text-4xl mb-4">🔮</div>
            <p className="text-text-secondary">{lang === 'zh' ? '正在分析你的攀岩人格...' : 'Analyzing your climbing personality...'}</p>
          </div>
        )}

        {!showCalculating && !result && currentQ && (
          <>
            <ProgressBar current={currentIdx + 1} total={questions.length} />
            <div className="text-xs text-text-secondary mb-4">{currentIdx + 1} / {questions.length}</div>
            <QuestionCard
              question={currentQ}
              selected={answers[currentQ.id]}
              onSelect={handleSelect}
              lang={lang}
            />
          </>
        )}

        {!showCalculating && result && (
          <>
            <ResultCard result={result} lang={lang} />
            <div className="text-center mt-6">
              <button
                onClick={handleRestart}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                🔄 {lang === 'zh' ? '重新测试' : 'Retake'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
