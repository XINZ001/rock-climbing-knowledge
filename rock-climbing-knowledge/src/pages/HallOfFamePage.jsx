import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  getHallOfFameAthletes,
  hallOfFameMainOrder,
  hallOfFameMainCategories,
  athleteMatchesMainSub
} from '../utils/hallOfFame'

export default function HallOfFamePage() {
  const { t, lang } = useApp()
  const athletes = useMemo(() => getHallOfFameAthletes(), [])

  const mainCounts = useMemo(() => {
    const counts = {}
    hallOfFameMainOrder.forEach((key) => {
      counts[key] = athletes.filter((a) => athleteMatchesMainSub(a, key, '')).length
    })
    return counts
  }, [athletes])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(74,124,89,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(199,161,42,0.18),_transparent_35%)]" />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {lang === 'zh' ? '攀岩名人堂' : 'Climbing Hall of Fame'}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-text-secondary leading-relaxed">
              {lang === 'zh'
                ? '收录攀岩历史与当代最具代表性的人物，集中展示他们的成就、风格、访谈与影像。'
                : 'A curated Hall of Fame featuring defining figures from climbing history and the modern era, with achievements, style, interviews, and media.'}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {hallOfFameMainOrder.map((key) => {
            const value = hallOfFameMainCategories[key]
            if (!value) return null
            const count = mainCounts[key] ?? 0
            const categoryAthletes = athletes.filter((a) => athleteMatchesMainSub(a, key, ''))
            const sampleNames = categoryAthletes.slice(0, 3).map((a) => t(a.athleteName))
            return (
              <Link
                key={key}
                to={`/hall-of-fame/browse/${key}`}
                className="group relative flex w-full flex-col rounded-[1.5rem] border border-stone-border bg-stone-card p-6 text-left transition-all hover:border-forest/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
              >
                <h2 className="text-xl font-bold tracking-tight text-forest">
                  {t(value)}
                  {key !== 'all' && (
                    <span className="ml-2 text-base font-medium text-text-secondary">
                      ({count})
                    </span>
                  )}
                </h2>
                {value.intro && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                    {lang === 'zh' ? value.intro.zh : value.intro.en}
                  </p>
                )}
                {count > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
                    <span>{lang === 'zh' ? '涉及人物：' : 'Including: '}</span>
                    <span className="font-medium text-forest">
                      {sampleNames.join(lang === 'zh' ? '、' : ', ')}
                      {count > 3 && (lang === 'zh' ? ` 等 ${count} 位` : ` and ${count - 3} more`)}
                    </span>
                  </div>
                )}
                <div className="mt-4 flex items-center text-sm font-medium text-forest">
                  <span className="transition-transform group-hover:translate-x-0.5">
                    {lang === 'zh' ? '进入查看' : 'View'} →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
