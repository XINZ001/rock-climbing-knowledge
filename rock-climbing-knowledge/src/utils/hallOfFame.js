import athleteRegistry from '../data/athlete-registry.json'
import crossReferences from '../data/cross-references.json'
import hallOfFameMedia from '../data/hall-of-fame-media'

export const hallOfFameRegistry = athleteRegistry

export const hallOfFameCategoryOrder = ['historical', 'contemporary', 'chinese']

export const hallOfFameCategories = {
  all: {
    zh: '全部人物',
    en: 'All Athletes',
    description: {
      zh: '首轮名人堂全量条目',
      en: 'Complete first-batch Hall of Fame roster'
    }
  },
  historical: {
    zh: '历史传奇',
    en: 'Historical Legends',
    description: {
      zh: '奠定现代攀岩风格与文化的人',
      en: 'Figures who defined modern climbing style and culture'
    }
  },
  contemporary: {
    zh: '当代精英',
    en: 'Contemporary Elite',
    description: {
      zh: '持续改写竞技上限的现役标杆',
      en: 'Active benchmarks redefining the competitive ceiling'
    }
  },
  chinese: {
    zh: '中国代表',
    en: 'Chinese Athletes',
    description: {
      zh: '中国攀岩国际化进程中的代表人物',
      en: 'Representative figures in China’s international climbing rise'
    }
  }
}

export const hallOfFameCardTypes = {
  biography: {
    zh: '生平与成就',
    en: 'Biography & Achievements'
  },
  training: {
    zh: '训练哲学',
    en: 'Training Philosophy'
  },
  technique: {
    zh: '标志性风格',
    en: 'Signature Style'
  },
  interview: {
    zh: '采访与观点',
    en: 'Interview & Ideas'
  }
}

export function getHallOfFameAthletes() {
  return [...hallOfFameRegistry.athletes].sort((a, b) => {
    const categoryDiff =
      hallOfFameCategoryOrder.indexOf(a.category) - hallOfFameCategoryOrder.indexOf(b.category)
    if (categoryDiff !== 0) return categoryDiff
    return a.athleteId.localeCompare(b.athleteId)
  })
}

export function getHallOfFameAthleteBySlug(slug) {
  return hallOfFameRegistry.athletes.find((athlete) => athlete.slug === slug) || null
}

export function getHallOfFameCardsForAthlete(athleteId) {
  const athlete = hallOfFameRegistry.athletes.find((entry) => entry.athleteId === athleteId)
  if (!athlete) return []
  const cardMap = new Map(hallOfFameRegistry.cards.map((card) => [card.id, card]))
  return athlete.cardIds.map((cardId) => cardMap.get(cardId)).filter(Boolean)
}

export function getHallOfFameCrossReference(kpId) {
  return crossReferences.references[kpId] || null
}

export function getHallOfFameMedia(athleteId) {
  return hallOfFameMedia[athleteId] || {
    images: [],
    videos: [],
    timeline: [],
    interviewNotes: [],
    furtherReading: []
  }
}
