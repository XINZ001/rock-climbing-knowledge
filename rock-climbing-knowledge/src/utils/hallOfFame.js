import athleteRegistry from '../data/athlete-registry.json'
import crossReferences from '../data/cross-references.json'
import hallOfFameMedia from '../data/hall-of-fame-media'
import athleteAvatars from '../data/athlete-avatars.json'

export const hallOfFameRegistry = athleteRegistry

// Category order controls how athletes are sorted on the list page.
// 'chinese-rep' is a virtual cross-cutting filter (not a real category),
// so it is intentionally excluded from this sort order.
export const hallOfFameCategoryOrder = ['legend', 'elite', 'explorer', 'innovator']

// Tab filter keys: all, then 8 category+subcategory columns, then chinese-rep.
export const hallOfFameTabOrder = [
  'all',
  'elite-lead-sport',
  'elite-bouldering',
  'elite-speed',
  'explorer-free-climbing',
  'explorer-big-wall',
  'explorer-free-solo',
  'legend',
  'innovator',
  'chinese-rep'
]

// --- Two-level navigation: main categories first, then sub for 竞技 / 探险 ---
// Order of main buttons on the page (no athletes shown until one is selected).
// 'all' (全部人物) removed so users browse by category only and avoid duplicate-looking entries.
export const hallOfFameMainOrder = ['elite', 'explorer', 'legend', 'innovator', 'chinese-rep']

export const hallOfFameMainCategories = {
  all: {
    zh: '全部人物',
    en: 'All Athletes',
    description: { zh: '名人堂全量条目', en: 'Complete Hall of Fame roster' },
    intro: {
      zh: '涵盖竞技精英、探险攀登、历史先驱与训练革新等所有栏目，一次浏览名人堂全部收录人物。',
      en: 'Browse the full Hall of Fame across competition, adventure, legends, and innovators.'
    }
  },
  elite: {
    zh: '竞技运动员',
    en: 'Competition Athletes',
    description: { zh: '国际赛场先锋、抱石、速度项目代表', en: 'Lead, bouldering, and speed competition athletes' },
    intro: {
      zh: '在国际赛场改写难度与速度上限的运动员：IFSC 世界杯与奥运赛场上的先锋、抱石、速度项目代表，无论国籍，以成绩与风格说话。',
      en: 'Athletes who redefined limits on the world stage — lead, bouldering, and speed — at World Cups and the Olympics.'
    }
  },
  explorer: {
    zh: '攀岩探险家',
    en: 'Adventure Climbers',
    description: { zh: '自由攀登、大岩壁、无保护独攀代表', en: 'Free climbing, big wall, and free solo' },
    intro: {
      zh: '把户外技术攀登推入新境界的人：自由攀登与极限路线开拓者、大岩壁多日攀登传奇、无保护独攀与 FreeBASE 的代表人物。',
      en: 'Those who pushed outdoor climbing into new territory: free ascent pioneers, big-wall legends, and free soloists.'
    }
  },
  legend: {
    zh: '历史先驱',
    en: 'Pioneering Legends',
    description: {
      zh: '奠定现代攀岩的底层逻辑——动作语言、训练观念、文化身份',
      en: 'Foundational figures: movement language, training ideas, cultural identity'
    },
    intro: {
      zh: '从抱石之父、红点与运动攀奠基人，到分级体系与风格哲学的创立者——他们定义了现代攀岩的动作语言与文化身份。',
      en: 'From the father of bouldering to the originators of redpoint and sport climbing — they defined modern climbing\'s movement and culture.'
    }
  },
  innovator: {
    zh: '训练革新',
    en: 'Training Innovators',
    description: {
      zh: '发明或系统化了对攀岩训练界产生深远影响的方法与工具',
      en: 'Training methods and tools with lasting impact across the sport'
    },
    intro: {
      zh: 'Campus board、Moonboard、指力板与周期化训练等发明或系统化者，以及将科学方法与数据带入攀岩训练的推动者。',
      en: 'Inventors and systematizers of campus board, Moonboard, fingerboards, periodization, and data-driven training.'
    }
  },
  'chinese-rep': {
    zh: '中国运动员',
    en: 'Chinese Athletes',
    description: {
      zh: '横跨各类别的中国代表人物——成就属于攀岩世界，背景根植于中国',
      en: 'Chinese representatives across categories — achievements in climbing, roots in China'
    },
    intro: {
      zh: '横跨竞技、探险等栏目的中国代表人物：奥运奖牌得主、世锦赛冠军与本土攀登文化的推动者，成就属于攀岩世界，背景根植于中国。',
      en: 'Chinese representatives across categories — Olympic and world champions, and pioneers of climbing in China.'
    }
  }
}

// Sub-buttons when main = elite or explorer. Key is the filter key used in athleteMatchesTabKey.
export const hallOfFameSubCategories = {
  elite: [
    { key: 'elite-lead-sport', zh: '竞技·先锋', en: 'Lead' },
    { key: 'elite-bouldering', zh: '竞技·抱石', en: 'Bouldering' },
    { key: 'elite-speed', zh: '竞技·速度', en: 'Speed' }
  ],
  explorer: [
    { key: 'explorer-free-climbing', zh: '探险·自由攀', en: 'Free climbing' },
    { key: 'explorer-big-wall', zh: '探险·大岩壁', en: 'Big wall' },
    { key: 'explorer-free-solo', zh: '探险·无保护独攀', en: 'Free solo' }
  ]
}

/** Whether athlete matches (mainCategory, subKey). subKey '' = entire main category. */
export function athleteMatchesMainSub(athlete, mainCategory, subKey) {
  if (mainCategory === 'all') return true
  if (mainCategory === 'chinese-rep') return !!athlete.isChineseRepresentative
  if (mainCategory === 'legend') return athlete.category === 'legend'
  if (mainCategory === 'innovator') return athlete.category === 'innovator'
  if (mainCategory === 'elite') {
    if (athlete.category !== 'elite') return false
    if (!subKey) return true
    return athlete.subcategory === subKey
  }
  if (mainCategory === 'explorer') {
    if (athlete.category !== 'explorer') return false
    if (!subKey) return true
    return athlete.subcategory === subKey
  }
  return false
}

export const hallOfFameCategories = {
  all: {
    zh: '全部人物',
    en: 'All Athletes',
    description: { zh: '名人堂全量条目', en: 'Complete Hall of Fame roster' }
  },
  'elite-lead-sport': {
    zh: '竞技·先锋',
    en: 'Elite · Lead',
    description: { zh: '国际赛场先锋/难度项目代表', en: 'Lead sport competition athletes' }
  },
  'elite-bouldering': {
    zh: '竞技·抱石',
    en: 'Elite · Bouldering',
    description: { zh: '国际赛场抱石项目代表', en: 'Bouldering competition athletes' }
  },
  'elite-speed': {
    zh: '竞技·速度',
    en: 'Elite · Speed',
    description: { zh: '国际赛场速度项目代表', en: 'Speed climbing athletes' }
  },
  'explorer-free-climbing': {
    zh: '探险·自由攀',
    en: 'Explorer · Free climbing',
    description: { zh: '户外自由攀登与极限路线开拓者', en: 'Free climbing and hard route pioneers' }
  },
  'explorer-big-wall': {
    zh: '探险·大岩壁',
    en: 'Explorer · Big wall',
    description: { zh: '大岩壁多日攀登代表', en: 'Big wall climbers' }
  },
  'explorer-free-solo': {
    zh: '探险·无保护独攀',
    en: 'Explorer · Free solo',
    description: { zh: '无保护独攀与 FreeBASE 代表', en: 'Free solo and FreeBASE' }
  },
  legend: {
    zh: '历史先驱',
    en: 'Pioneering Legends',
    description: {
      zh: '奠定现代攀岩的底层逻辑——动作语言、训练观念、文化身份',
      en: 'Foundational figures: movement language, training ideas, cultural identity'
    }
  },
  innovator: {
    zh: '训练革新',
    en: 'Training Innovators',
    description: {
      zh: '发明或系统化了对攀岩训练界产生深远影响的方法与工具',
      en: 'Training methods and tools with lasting impact across the sport'
    }
  },
  'chinese-rep': {
    zh: '中国运动员',
    en: 'Chinese Athletes',
    description: {
      zh: '横跨各类别的中国代表人物——成就属于攀岩世界，背景根植于中国',
      en: 'Chinese representatives across categories — achievements in climbing, roots in China'
    }
  }
}

export const hallOfFameChapterTypes = {
  'career-arc': { zh: '人生轨迹', en: 'Career Arc' },
  'competition-record': { zh: '竞技档案', en: 'Competition Record' },
  'training-system': { zh: '训练体系', en: 'Training System' },
  'mental-game': { zh: '竞技心理', en: 'Mental Game' },
  'signature-routes': { zh: '标志性路线', en: 'Signature Routes' },
  'philosophy': { zh: '攀登哲学', en: 'Philosophy' },
  'innovation': { zh: '革新贡献', en: 'Innovation' },
  'quotes': { zh: '精选引语', en: 'Selected Quotes' },
  'china-context': { zh: '中国视角', en: 'China Context' }
}

export function getHallOfFameAthletes() {
  return [...hallOfFameRegistry.athletes].sort((a, b) => {
    const categoryDiff =
      hallOfFameCategoryOrder.indexOf(a.category) - hallOfFameCategoryOrder.indexOf(b.category)
    if (categoryDiff !== 0) return categoryDiff
    return a.athleteId.localeCompare(b.athleteId)
  })
}

/** Tab key for an athlete (category + subcategory, or legend/innovator). Used for filtering and card label. */
export function getTabKeyForAthlete(athlete) {
  if (athlete.category === 'elite' && athlete.subcategory)
    return `elite-${athlete.subcategory}`
  if (athlete.category === 'explorer' && athlete.subcategory)
    return `explorer-${athlete.subcategory}`
  if (athlete.category === 'legend' || athlete.category === 'innovator')
    return athlete.category
  return athlete.category
}

/** Whether athlete matches a tab filter key. */
export function athleteMatchesTabKey(athlete, tabKey) {
  if (tabKey === 'all') return true
  if (tabKey === 'chinese-rep') return !!athlete.isChineseRepresentative
  return getTabKeyForAthlete(athlete) === tabKey
}

export function getChineseRepresentativeAthletes() {
  return hallOfFameRegistry.athletes.filter((athlete) => !!athlete.isChineseRepresentative)
}

export function getHallOfFameAthleteBySlug(slug) {
  return hallOfFameRegistry.athletes.find((athlete) => athlete.slug === slug) || null
}

export function getHallOfFameChaptersForAthlete(athleteId) {
  const athlete = hallOfFameRegistry.athletes.find((entry) => entry.athleteId === athleteId)
  if (!athlete) return []
  const chapterMap = new Map(hallOfFameRegistry.chapters.map((chapter) => [chapter.id, chapter]))
  return (athlete.chapterIds || []).map((chapterId) => chapterMap.get(chapterId)).filter(Boolean)
}

export function getHallOfFameCrossReference(kpId) {
  return crossReferences.references[kpId] || null
}

export function getHallOfFameMedia(athleteId) {
  const base = hallOfFameMedia[athleteId] || {
    images: [],
    videos: [],
    bilibiliVideos: [],
    podcasts: [],
    timeline: [],
    interviewNotes: [],
    furtherReading: []
  }
  const avatarPath = athleteAvatars[athleteId]
  const athlete = hallOfFameRegistry.athletes.find((a) => a.athleteId === athleteId)
  const cardImage =
    base.cardImage ||
    (avatarPath && {
      src: avatarPath,
      alt: athlete ? athlete.athleteName : { zh: '', en: '' },
      objectPosition: 'center center'
    })
  return { ...base, ...(cardImage && { cardImage }) }
}
