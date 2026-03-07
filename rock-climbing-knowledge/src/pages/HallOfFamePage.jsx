import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import {
  getHallOfFameAthletes,
  getHallOfFameMedia,
  hallOfFameCategories,
  hallOfFameRegistry
} from '../utils/hallOfFame'

function initialsFor(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized
  const int = Number.parseInt(value, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function HallOfFamePage() {
  const { t, lang } = useApp()
  const [filter, setFilter] = useState('all')
  const athletes = useMemo(() => getHallOfFameAthletes(), [])

  const filteredAthletes = useMemo(() => {
    if (filter === 'all') return athletes
    return athletes.filter((athlete) => athlete.category === filter)
  }, [athletes, filter])

  const categoryCount = useMemo(
    () =>
      athletes.reduce((acc, athlete) => {
        acc[athlete.category] = (acc[athlete.category] || 0) + 1
        return acc
      }, {}),
    [athletes]
  )

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

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/80 px-4 py-4">
              <div className="text-2xl font-bold">{hallOfFameRegistry._meta.totalAthletes}</div>
              <div className="mt-1 text-xs text-text-secondary">
                {lang === 'zh' ? '收录人物' : 'Featured athletes'}
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-4">
              <div className="text-2xl font-bold">{categoryCount.historical || 0}</div>
              <div className="mt-1 text-xs text-text-secondary">
                {lang === 'zh' ? '历史传奇' : 'Historical legends'}
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-4">
              <div className="text-2xl font-bold">{categoryCount.contemporary || 0}</div>
              <div className="mt-1 text-xs text-text-secondary">
                {lang === 'zh' ? '当代精英' : 'Contemporary greats'}
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-4">
              <div className="text-2xl font-bold">{categoryCount.chinese || 0}</div>
              <div className="mt-1 text-xs text-text-secondary">
                {lang === 'zh' ? '中国代表' : 'Chinese representatives'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(hallOfFameCategories).map(([key, value]) => {
            const active = filter === key
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? 'border-forest bg-forest text-white'
                    : 'border-stone-border bg-stone-card hover:border-forest/40 hover:text-forest'
                }`}
              >
                {t(value)}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-sm text-text-secondary">
          {t(hallOfFameCategories[filter].description)}
        </p>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredAthletes.map((athlete) => (
          (() => {
            const media = getHallOfFameMedia(athlete.athleteId)
            const cardImage = media.cardImage

            return (
              <Link
                key={athlete.athleteId}
                to={`/hall-of-fame/${athlete.slug}`}
                className="group overflow-hidden rounded-[1.5rem] border border-stone-border bg-stone-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div
                  className="relative min-h-[255px] overflow-hidden p-5"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(athlete.accentColor, 0.98)} 0%, ${hexToRgba(athlete.accentColor, 0.9)} 46%, ${hexToRgba(athlete.accentColor, 0.68)} 100%)`
                  }}
                >
                  {cardImage && (
                    <div className="absolute right-0 top-0 h-full w-[48%] overflow-hidden">
                      <img
                        src={cardImage.src}
                        alt={t(cardImage.alt)}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        style={{
                          objectPosition: cardImage.objectPosition || 'center center',
                          transform: `translateX(${cardImage.translateX || '0%'}) scale(${cardImage.scale || 1})`,
                          transformOrigin: 'center center',
                          WebkitMaskImage:
                            'linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 42%, rgba(0, 0, 0, 0.82) 62%, rgba(0, 0, 0, 0.32) 82%, rgba(0, 0, 0, 0) 100%), linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 64%, rgba(0, 0, 0, 0.72) 82%, rgba(0, 0, 0, 0) 100%)',
                          maskImage:
                            'linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 42%, rgba(0, 0, 0, 0.82) 62%, rgba(0, 0, 0, 0.32) 82%, rgba(0, 0, 0, 0) 100%), linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 64%, rgba(0, 0, 0, 0.72) 82%, rgba(0, 0, 0, 0) 100%)',
                          WebkitMaskSize: '100% 100%',
                          maskSize: '100% 100%',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskComposite: 'source-in',
                          maskComposite: 'intersect'
                        }}
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex items-start gap-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 text-lg font-bold text-white backdrop-blur-sm"
                      style={{ backgroundColor: hexToRgba(athlete.accentColor, 0.45) }}
                    >
                      {initialsFor(athlete.athleteName.en)}
                    </div>
                    <div className="min-w-0 max-w-[66%]">
                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/72">
                        {t(hallOfFameCategories[athlete.category])}
                      </div>
                      <h2 className="mt-1 text-xl font-semibold text-white">{t(athlete.athleteName)}</h2>
                      {lang === 'zh' && athlete.athleteName.en && (
                        <div className="text-sm text-white/70">{athlete.athleteName.en}</div>
                      )}
                    </div>
                  </div>

                  <p className="relative z-10 mt-5 max-w-[68%] line-clamp-2 text-sm font-medium leading-relaxed text-white/92">
                    {t(athlete.tagline)}
                  </p>
                  <p className="relative z-10 mt-3 max-w-[68%] line-clamp-4 text-sm leading-relaxed text-white/74">
                    {t(athlete.overview)}
                  </p>
                </div>

                <div className="border-t border-stone-border px-5 py-4">
              <div className="grid grid-cols-1 gap-3">
                {athlete.heroStats.slice(0, 2).map((stat) => (
                  <div key={t(stat.label)} className="rounded-xl bg-stone-sidebar px-3 py-3">
                    <div className="text-xs uppercase tracking-wide text-text-secondary">
                      {t(stat.label)}
                    </div>
                    <div className="mt-1 text-sm font-medium">{t(stat.value)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {athlete.specialties.map((specialty) => (
                  <span
                    key={t(specialty)}
                    className="rounded-full bg-forest-light px-2.5 py-1 text-xs font-medium text-forest"
                  >
                    {t(specialty)}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-end text-sm font-medium text-forest">
                <span className="transition-transform group-hover:translate-x-0.5">
                  {lang === 'zh' ? '查看详情' : 'View profile'} →
                </span>
              </div>
            </div>
              </Link>
            )
          })()
        ))}
      </section>
    </div>
  )
}
