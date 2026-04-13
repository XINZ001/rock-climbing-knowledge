import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PageSEO from '../components/PageSEO'
import mbtiData from '../data/climbing-mbti.json'

/* ─── axis config ─── */
const AXIS_KEYS = ['T1','T2','T3','T4','T5','T6','T7','T8']

// max possible score per axis (sum of max option scores for questions on that axis)
const MAX_SCORES = {}
AXIS_KEYS.forEach(ax => { MAX_SCORES[ax] = 0 })
mbtiData.questions.forEach(q => {
  if (!q.axis) return
  const maxOpt = Math.max(...q.options.map(o => o.score))
  MAX_SCORES[q.axis] = (MAX_SCORES[q.axis] || 0) + maxOpt
})

/* ─── descriptions ─── */
const DESCRIPTIONS = {
  'GHOST': {
    base: '你到岩馆不看人，看线。换鞋抹粉，戴上耳机，对着自己心里的计划一条一条过。你不需要搭子，不需要有人给你喊加油，甚至不需要有人知道你来过。你觉得攀岩是你自己和墙之间的事，别人的存在既不加分也不减分。有人说你高冷，其实你只是觉得社交这件事和变强这件事之间没有必然联系。你有系统的训练计划，知道今天该练什么，练完收包走人，干净利落。完攀了一条难线你不会大声庆祝，掉了也不会找借口。你心里清楚自己什么水平，不需要别人来定义。你最理想的session是整个馆只有你一个人，安静地和墙较劲，不被打扰。',
    variants: [
      { questionId: 'S7', answer: 'C', text: '别人主动给你beta的时候你甚至有点烦，你觉得自己还没试够，不需要别人的捷径。' },
      { questionId: 'O5', answer: 'C', text: '有人说来岩馆最大的收获是朋友，你不太理解这个说法，你的收获写在训练日志里，不在通讯录里。' },
      { questionId: 'S14', answer: 'C', text: '你在墙上的时候是听不见外面声音的那种人，不是故意忽略，是真的进入了自己的世界。' }
    ]
  },
  'DO-S': {
    base: '你自己练得认真，但你更管不住的是那张嘴。看到别人用错误的beta反复尝试，你坐不住，直接走过去就开始讲。你觉得指出问题是帮忙，不说出来才是不尊重。你有系统的训练计划，对等级有要求，对自己狠，对搭子更狠。你是那个"再来一把""脚踩好""你可以的别放"的人。你的搭子又爱你又怕你，但不得不承认跟着你确实会进步。你不理解为什么有人听到正确建议会不开心，在你看来，进步的路径很清楚，执行就行了，玻璃心是最没效率的东西。你手指疼了也继续爬，因为你觉得这点痛不算什么。',
    variants: [
      { questionId: 'O6', answer: 'A', text: '你坚定地认为主动给别人beta是热心而不是冒犯，你说这话的时候底气很足，因为你给的建议确实都是对的。' },
      { questionId: 'S18', answer: 'C', text: '在你和搭子的关系里，你永远是那个push别人的角色，你觉得这很正常，有人带着走总比自己瞎摸索快。' },
      { questionId: 'O12', answer: 'A', text: '你认为受伤了还能坚持说明有毅力，这不是逞强，是你对"认真"这个词的定义。' }
    ]
  },
  'NERD': {
    base: '你是那种一条线没完攀就不会换的人。别人可能觉得换条线调整一下效率更高，但你过不了心里那道坎。在你的世界里，放弃一条线等于承认失败，而你从来没想过要放弃攀岩这件事。你有训练计划，你知道自己的弱点在哪，你的目标很明确就是变强。你不太关心别人在爬什么，也不太需要社交，你只关心今天的计划完成了没有。手指有点疼你不会停，因为你觉得进步就是要付出代价的。你认为自己经常练太多但停不下来，这不是抱怨，是一种你对自己的描述。你的字典里没有"差不多就行了"这几个字。',
    variants: [
      { questionId: 'S20', answer: 'A', text: '没完攀的线你会反复试到没力气为止，换线这个选项在你脑子里根本不存在。' },
      { questionId: 'S22', answer: 'A', text: '手指疼了你还在爬，不是不知道风险，是你觉得今天的目标还没完成，停不下来。' },
      { questionId: 'O14', answer: 'A', text: '你承认自己练太多，但你说这话的语气更像是在陈述事实而不是求助。' }
    ]
  },
  'TALK-ER': {
    base: '你进岩馆第一件事是看今天谁在。有没有朋友来直接决定你来不来，到了发现没认识的人你可能考虑早点走。你的搭子不是训练伙伴，是让攀岩变有意思的人。你来岩馆最大的收获不是等级提升，是认识了一群朋友。你没有训练计划，来了就是聊天、爬两条、再聊天。有人说你的攀岩水平半年没变过，但你的朋友数量翻了三倍。你觉得岩馆找对象挺好的，有共同爱好感情基础更好。如果有一天没有人一起爬了，你可能真的会考虑不爬了。等级对你来说不重要，开心就好。',
    variants: [
      { questionId: 'S3', answer: 'C', text: '你到了馆发现今天没认识的人，你的第一反应不是"那就自己爬"，而是"那今天就少待一会儿吧"。' },
      { questionId: 'S19', answer: 'C', text: '你来岩馆的动机是氛围和人，变强什么的随缘就好。' },
      { questionId: 'O5', answer: 'A', text: '让你说来岩馆最大的收获，你会毫不犹豫地说"是认识了这帮人"。' }
    ]
  },
  'PUPPY': {
    base: '你来岩馆永远不是一个人来的。搭子去哪个区你去哪个区，搭子爬什么线你跟着排队。搭子想走了你也走，哪怕你还想再爬一会儿。你不是没有自己的想法，你只是觉得跟着别人比自己做决定舒服。有人给你建议你就听，比你强的人推荐了beta你就用，不太会坚持自己的方法。你在墙上遇到不确定的位置更倾向于犹豫而不是冲，因为你不太确定自己的判断对不对。你没有训练计划，来岩馆的原因是氛围和人。你最开心的时刻不是完攀了一条线，是大家一起加油的那个感觉。没有搭子的日子你大概率不来。',
    variants: [
      { questionId: 'S4', answer: 'A', text: '搭子说走你就走，你连犹豫都没有，因为一个人留在馆里你不知道该干什么。' },
      { questionId: 'S16', answer: 'A', text: '强的人给了你beta你直接用，人家比你厉害肯定有道理，你不会去想自己的方法也许更适合自己。' },
      { questionId: 'S13', answer: 'C', text: '在墙上遇到不确定的位置你会挂着犹豫，不敢往上也不想下来，因为你不太信任自己的判断。' }
    ]
  },
  'HAHA': {
    base: '你完攀了一条难线的第一反应是"哈哈运气好运气好"。你承认自己会在掉下来之前先自嘲一句给自己台阶下，这是你的本能反应。你是岩馆里的气氛组，用幽默化解自己的尴尬也化解别人的尴尬。你喜欢社交，进馆先看谁在，来不来取决于有没有朋友，你觉得搭子是让攀岩有意思的人。但你和纯社交型不一样的地方在于，你其实也会默默在意自己的水平。卡级会让你有点焦虑，只是你选择用一句"我就是个菜鸡哈哈"来盖过这种焦虑。你给所有人的印象都是"来玩的"，所以从来没人认真教过你。你到底有多在乎，你没给任何人机会知道。',
    variants: [
      { questionId: 'S10', answer: 'C', text: '完攀之后你的第一句话永远是自嘲，你已经习惯了把真实的开心包装成一个段子。' },
      { questionId: 'O9', answer: 'A', text: '你知道自己有"先自嘲一句"的习惯，你不觉得这有什么问题，这是你处理压力的方式。' },
      { questionId: 'S8', answer: 'B', text: '搭子flash了你的项目线，你嘴上说恭喜，心里偷偷决定今天一定要完攀，只是这个决定你不会说出来。' }
    ]
  },
  'TILT': {
    base: '你的脸上从来看不出来。搭子flash了你磨了三周的线，你说"牛逼"的语气完美无缺，但回家的路上你沉默了四十分钟。你在意等级，在意进步，在意别人爬到了什么水平，但这些情绪你从来不说出口。你会在心里默默和旁边的人比较，卡级超过三个月你会焦虑，有人说自己一个月V4你第一反应是看他在哪个馆。爬得差的一天你心情会受影响，可能提前走。楼下有人喊加油你觉得是压力而不是鼓励。你没完攀一条你觉得应该能完攀的线，你会有点不开心然后默默想一路。你知道比较没有意义，你也知道每个人进度不同，但知道了也没用。',
    variants: [
      { questionId: 'S8', answer: 'C', text: '搭子完攀你的项目线的那一刻，你嘴上说的和心里想的不是同一句话，这种感觉你太熟悉了。' },
      { questionId: 'O7', answer: 'A', text: '你承认自己经常在心里默默比较，这不是你想做的事，但你控制不了。' },
      { questionId: 'S20', answer: 'C', text: '没完攀的那条线会跟着你回家，你会在路上、在睡前、在第二天洗澡的时候反复想它。' }
    ]
  },
  'BABY': {
    base: '你和玻璃心一样在意等级，一样卡级会焦虑，一样会默默和别人比较。但你们有一个关键的不同：失败的时候你的第一反应是找外部原因。连续三次掉在同一个地方，你觉得是今天状态不好或者鞋的问题。去了一个定级宽松的新馆突然爬得很好，你心里有一瞬间觉得"这才是我的真实水平"。你不是在故意找借口，你是真的这么认为。在你的世界里，你的能力是稳定的，波动的是外部条件。鞋、手皮、湿度、定级标准，这些都是变量，而你不是变量。你最常说的一句话可能是"我正常发挥的话肯定行"，只是正常发挥的条件好像很难同时满足。',
    variants: [
      { questionId: 'S9', answer: 'C', text: '掉了三次你的第一反应是"今天状态不好"或者"手皮太薄了"，你真心觉得不是能力的问题。' },
      { questionId: 'S12', answer: 'C', text: '在定级宽松的馆爬得好，你有那么一瞬间觉得之前的馆定级有问题，这个想法让你挺舒服的。' },
      { questionId: 'O2', answer: 'A', text: '别人说自己一个月V4，你的第一反应是看他在哪个馆，因为你知道定级差异有多大。' }
    ]
  },
  'LOL': {
    base: '你对攀岩最大的评价是"挺好玩的"。你没有训练计划，来了就爬，爬到哪算哪。你不在意等级，不焦虑卡级，有人一个月V4你觉得跟你没关系。你搭子flash了你的项目线你是真心替他开心，因为你从来没把这当成竞争。爬得差的一天你觉得很正常，明天继续就好了。你喜欢在墙上的感觉，那种什么都不用想的专注很解压，但你不会为此制定计划或者逼自己加训。你不太需要搭子但有人给你beta你也愿意听。你觉得爬得好看比爬得难更有意思。你来岩馆是为了享受，不是为了证明什么。你最害怕的不是爬不上去，是有一天你开始在乎爬不爬得上去。',
    variants: [
      { questionId: 'O1', answer: 'A', text: '你是"等级不重要开心就好"这句话最真诚的拥护者，别人说这话可能是安慰自己，你是真的这么觉得。' },
      { questionId: 'O3', answer: 'C', text: '卡级三个月你不会焦虑，因为"级"这个概念在你的攀岩世界里权重很低。' },
      { questionId: 'S19', answer: 'B', text: '你来攀岩就是享受在墙上的感觉，不是为了变强也不是为了社交，单纯觉得爬的过程很舒服。' }
    ]
  },
  'YOLO': {
    base: '你不读线。你觉得站在下面看来看去是浪费时间，上去了自然就知道该怎么爬。到了一个不确定能不能过的位置，你的反应是先试，大不了掉下来。没完攀的线你会反复试到没力气为止。手指有点疼你继续爬，你觉得这点痛不算什么。你不在意等级，没有训练计划，但你爬起来的冲劲比很多有计划的人还猛。你享受的是那种"不知道下一秒会发生什么"的刺激感。你不需要搭子，不需要社交，也不太听别人的建议，有人主动给你beta你甚至有点烦。你的攀岩方式完全不可预测，有时候会用一种完全没人想到的方式完攀，有时候第二个手点就掉下来。你觉得想太多的人生很无聊。',
    variants: [
      { questionId: 'S13', answer: 'A', text: '在墙上遇到不确定的位置你连犹豫都不犹豫，先冲了再说。' },
      { questionId: 'S22', answer: 'A', text: '手指疼了你还在爬，不是不知道风险，是你觉得停下来比疼更难受。' },
      { questionId: 'O12', answer: 'A', text: '你觉得受伤了还能坚持说明有毅力，这就是你对"爽"的定义。' }
    ]
  },
  'MOM': {
    base: '你进馆先看谁在，不是为了社交，是为了看看今天要照顾谁。你搭子掉下来你比他还着急，别人还没说口渴你已经把水递过去了。你看到有人用离谱的beta反复尝试你会直接走过去帮忙，你觉得这是热心不是多管闲事。在你和搭子的关系里，你是那个一直在push他们的人，你觉得有人带着走总比自己瞎摸索快。你自己也想变强，有大概的训练方向，但你花在别人身上的精力可能比花在自己身上的多。你的存在让周围人都觉得温暖和安全。你来岩馆最大的收获确实包括认识了一群朋友，但你和话痨不一样，你是真的在乎他们好不好，不只是聊天开心。',
    variants: [
      { questionId: 'S6', answer: 'A', text: '看到有人卡住了你忍不住就走过去了，不是想显摆，是你看不得别人在那里干着急。' },
      { questionId: 'O6', answer: 'A', text: '你坚定地认为主动给别人beta是善意的表达，你不理解为什么有人会觉得被冒犯。' },
      { questionId: 'S8', answer: 'A', text: '搭子flash了你的项目线你是真心替他开心，没有一点点酸，因为在你心里他的进步也是你的成就。' }
    ]
  },
  'DRAMA': {
    base: '有人看你爬的时候你的状态完全不一样。楼下喊加油你会更有劲，你享受被注意到的感觉。你会录视频发朋友圈或小红书，你觉得爬得好看比爬得难更重要。你是社交的，进馆看谁在，来不来取决于有没有朋友。但你和话痨不同的是，你不只是来聊天的，你需要的是一个舞台。爬得差的一天你会换去人少的区域，不是因为想安静练，是不想在状态不好的时候被人看到。你和搭子互相激励，你享受在墙上的过程，但你不得不承认，有观众的时候你的表现确实会更好。你最好的那次完攀，旁边一定有人在看。',
    variants: [
      { questionId: 'S14', answer: 'A', text: '楼下有人喊加油你觉得是鼓励，你能感觉到肾上腺素在那一刻拉满了。' },
      { questionId: 'O11', answer: 'A', text: '你认为爬得好看比爬得难更重要，动作流畅、有美感，这才是攀岩最吸引你的地方。' },
      { questionId: 'S24', answer: 'B', text: '你录视频主要是为了发朋友圈或小红书，你喜欢分享自己在墙上的样子。' }
    ]
  }
}

/* ─── scoring logic ─── */
function computeResult(answers) {
  const scores = {}
  AXIS_KEYS.forEach(ax => { scores[ax] = 0 })

  mbtiData.questions.forEach(q => {
    if (!q.axis) return
    const chosen = answers[q.id]
    if (!chosen) return
    const opt = q.options.find(o => o.id === chosen)
    if (!opt) return
    scores[q.axis] += opt.score
  })

  // normalize to 0-10
  const norm = {}
  AXIS_KEYS.forEach(ax => {
    norm[ax] = MAX_SCORES[ax] > 0 ? (scores[ax] / MAX_SCORES[ax]) * 10 : 0
  })

  // manhattan distance to each type
  const types = mbtiData.types
  let bestType = null
  let bestDist = Infinity
  Object.entries(types).forEach(([code, t]) => {
    const vec = t.vec
    let dist = 0
    AXIS_KEYS.forEach((ax, i) => { dist += Math.abs(norm[ax] - vec[i]) })
    if (dist < bestDist) { bestDist = dist; bestType = code }
  })

  // match percentage: max theoretical distance ~80 (8 axes * 10 each), use 60 as practical max
  const maxDist = 60
  const matchPct = Math.max(0, Math.round((1 - bestDist / maxDist) * 100))

  return { type: bestType, matchPct, scores: norm }
}

function getDescription(typeCode, answers) {
  const entry = DESCRIPTIONS[typeCode]
  if (!entry) return ''
  let desc = entry.base
  entry.variants.forEach(v => {
    if (answers[v.questionId] === v.answer) {
      desc += ' ' + v.text
    }
  })
  return desc
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

function ResultCard({ result, answers, onRestart }) {
  const typeCode = result.type
  const matchPct = result.matchPct
  const typeInfo = mbtiData.types[typeCode]
  if (!typeInfo) return null
  const description = getDescription(typeCode, answers)

  return (
    <div className="animate-fadeIn">
      {/* type illustration */}
      <div className="flex justify-center mb-4">
        <img
          src={`/images/mbti/mbti-${typeCode.toLowerCase().replace('-', '')}.webp`}
          alt={typeInfo.name.zh}
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* type header */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-text-primary font-mono tracking-wider mb-1">{typeCode}</div>
        <div className="text-xl font-semibold text-text-primary mb-2">{typeInfo.name.zh}</div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-forest-light text-forest">
          匹配度 {matchPct}%
        </div>
      </div>

      {/* slogan */}
      <div className="text-center mb-4">
        <p className="text-sm text-text-secondary italic">「{typeInfo.slogan}」</p>
      </div>

      {/* description */}
      <div className="bg-stone-bg rounded-2xl p-5 mb-6">
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>

      {/* actions */}
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={() => {
            const text = `我的攀岩人格是 ${typeCode}（${typeInfo.name.zh}）${typeInfo.emoji}\n匹配度 ${matchPct}%\n\n「${typeInfo.slogan}」\n\n${description.slice(0, 100)}...\n\n来测测你是什么类型`
            navigator.clipboard?.writeText(text)
            alert('已复制到剪贴板！')
          }}
          className="w-full max-w-xs px-6 py-3 rounded-xl bg-forest text-stone-card font-medium text-sm hover:bg-forest-dark transition-colors"
        >
          复制结果分享给朋友
        </button>
        <button
          onClick={onRestart}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors mt-2"
        >
          重新测试
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
        title={lang === 'zh' ? '攀岩人格测试' : 'Climbing Personality Test'}
        description="发现你的攀岩人格类型"
      />
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-text-primary">
            {lang === 'zh' ? '攀岩人格测试' : 'Climbing Personality'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {lang === 'zh' ? '33道题 · 约5分钟' : '33 questions · ~5 min'}
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
          <ResultCard result={result} answers={answers} onRestart={handleRestart} />
        )}
      </div>
    </>
  )
}
