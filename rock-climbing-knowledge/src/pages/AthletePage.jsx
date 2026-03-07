import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import VideoSection from '../components/content/VideoSection'
import ImageLightbox from '../components/ui/ImageLightbox'
import {
  getHallOfFameAthleteBySlug,
  getHallOfFameCardsForAthlete,
  getHallOfFameCrossReference,
  getHallOfFameMedia,
  hallOfFameCardTypes,
  hallOfFameCategories
} from '../utils/hallOfFame'

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

export default function AthletePage() {
  const { athleteSlug } = useParams()
  const { t, lang } = useApp()
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const athlete = getHallOfFameAthleteBySlug(athleteSlug)

  const cards = useMemo(
    () => (athlete ? getHallOfFameCardsForAthlete(athlete.athleteId) : []),
    [athlete]
  )
  const media = useMemo(
    () => (athlete ? getHallOfFameMedia(athlete.athleteId) : getHallOfFameMedia('')),
    [athlete]
  )
  const heroImage = media.cardImage || media.images[0] || null
  const galleryImages = useMemo(
    () => media.images.filter((image) => image.src !== heroImage?.src),
    [media.images, heroImage]
  )

  const relatedReferences = useMemo(() => {
    const seen = new Set()
    return cards
      .flatMap((card) => card.relatedKps || [])
      .map((kpId) => getHallOfFameCrossReference(kpId))
      .filter((item) => item && !seen.has(item.path) && seen.add(item.path))
  }, [cards])

  const allSources = useMemo(() => {
    const seen = new Set()
    return cards
      .flatMap((card) => card.sources || [])
      .filter((source) => {
        if (seen.has(source.url)) return false
        seen.add(source.url)
        return true
      })
  }, [cards])

  if (!athlete) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-semibold mb-2">
          {lang === 'zh' ? '未找到该人物' : 'Athlete not found'}
        </h1>
        <Link to="/hall-of-fame" className="text-forest hover:underline text-sm">
          {lang === 'zh' ? '返回名人堂' : 'Back to Hall of Fame'}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <nav className="text-sm text-text-secondary">
        <Link to="/" className="hover:text-forest transition-colors">
          {lang === 'zh' ? '首页' : 'Home'}
        </Link>
        <span className="mx-2">/</span>
        <Link to="/hall-of-fame" className="hover:text-forest transition-colors">
          {lang === 'zh' ? '攀岩名人堂' : 'Hall of Fame'}
        </Link>
        <span className="mx-2">/</span>
        <span>{t(athlete.athleteName)}</span>
      </nav>

      <section
        className="mt-5 overflow-hidden rounded-[2rem] border border-stone-border bg-stone-card shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(athlete.accentColor, 0.18)} 0%, rgba(255,255,255,1) 74%)`
        }}
      >
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          {heroImage && (
            <div className="absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden lg:block">
              <img
                src={heroImage.src}
                alt={t(heroImage.alt)}
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                style={{
                  objectPosition: heroImage.objectPosition || 'center top',
                  transform: `translateX(${heroImage.translateX || '0%'}) scale(${heroImage.scale || 1})`,
                  transformOrigin: 'center center',
                  WebkitMaskImage:
                    'linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 44%, rgba(0, 0, 0, 0.8) 66%, rgba(0, 0, 0, 0.28) 84%, rgba(0, 0, 0, 0) 100%), linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0.65) 86%, rgba(0, 0, 0, 0) 100%)',
                  maskImage:
                    'linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 44%, rgba(0, 0, 0, 0.8) 66%, rgba(0, 0, 0, 0.28) 84%, rgba(0, 0, 0, 0) 100%), linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0.65) 86%, rgba(0, 0, 0, 0) 100%)',
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

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-text-secondary">
              {t(hallOfFameCategories[athlete.category])}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-bold">{t(athlete.athleteName)}</h1>
            {lang === 'zh' && athlete.athleteName.en && (
              <p className="mt-2 text-base text-text-secondary">{athlete.athleteName.en}</p>
            )}
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-text-primary">
              {t(athlete.tagline)}
            </p>
            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-text-secondary">
              {t(athlete.overview)}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {athlete.specialties.map((specialty) => (
                <span
                  key={t(specialty)}
                  className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium"
                >
                  {t(specialty)}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            {athlete.heroStats.map((stat) => (
              <div key={t(stat.label)} className="rounded-2xl bg-white/85 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-text-secondary">
                  {t(stat.label)}
                </div>
                <div className="mt-2 text-sm font-semibold leading-relaxed">
                  {t(stat.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-[1.5rem] border border-stone-border bg-stone-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
              {lang === 'zh' ? '人物概览' : 'Profile'}
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-text-secondary">
                  {lang === 'zh' ? '国家/地区' : 'Nation'}
                </dt>
                <dd className="mt-1 text-sm font-medium">{t(athlete.nationality)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-text-secondary">
                  {lang === 'zh' ? '活跃阶段' : 'Active era'}
                </dt>
                <dd className="mt-1 text-sm font-medium">{t(athlete.activeEra)}</dd>
              </div>
            </dl>
          </div>

          {relatedReferences.length > 0 && (
            <div className="rounded-[1.5rem] border border-stone-border bg-stone-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
                {lang === 'zh' ? '关联知识点' : 'Related Knowledge'}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedReferences.map((reference) => (
                  <Link
                    key={reference.path}
                    to={reference.path}
                    className="rounded-full bg-forest-light px-3 py-1.5 text-xs font-medium text-forest hover:bg-forest hover:text-white transition-colors"
                  >
                    {t(reference.title)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[1.5rem] border border-stone-border bg-stone-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
              {lang === 'zh' ? '来源概览' : 'Sources'}
            </h2>
            <ul className="mt-4 space-y-3">
              {allSources.map((source) => (
                <li key={source.url} className="text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forest hover:underline"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {media.furtherReading.length > 0 && (
            <div className="rounded-[1.5rem] border border-stone-border bg-stone-card p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
                {lang === 'zh' ? '延伸阅读' : 'Further Reading'}
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                {media.furtherReading.map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-forest hover:underline"
                    >
                      {item.title}
                    </a>
                    <div className="mt-0.5 text-xs text-text-secondary">{item.source}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className="space-y-5">
          {galleryImages.length > 0 && (
            <section className="rounded-[1.5rem] border border-stone-border bg-stone-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                    {lang === 'zh' ? '人物图集' : 'Gallery'}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {lang === 'zh' ? '图片与视觉记录' : 'Images and Visual Record'}
                  </h2>
                </div>
                <div className="text-xs text-text-secondary">
                  {galleryImages.length} {lang === 'zh' ? '张图片' : 'images'}
                </div>
              </div>

              <div className={`mt-5 grid gap-4 ${galleryImages.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {galleryImages.map((image, index) => (
                  <button
                    key={image.src}
                    onClick={() => setLightboxIndex(index)}
                    className="group overflow-hidden rounded-[1.25rem] border border-stone-border bg-stone-sidebar text-left"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-bg">
                      <img
                        src={image.src}
                        alt={t(image.alt)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                    </div>
                    <div className="space-y-2 px-4 py-4">
                      <p className="text-sm leading-relaxed text-text-primary">{t(image.caption)}</p>
                      <a
                        href={image.creditUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex text-xs text-forest hover:underline"
                      >
                        {image.creditLabel}
                      </a>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {media.timeline.length > 0 && (
            <section className="rounded-[1.5rem] border border-stone-border bg-stone-card p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                {lang === 'zh' ? '生涯节点' : 'Career Timeline'}
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                {lang === 'zh' ? '关键时间线' : 'Key Milestones'}
              </h2>
              <div className="mt-5 space-y-4">
                {media.timeline.map((item) => (
                  <div key={`${athlete.athleteId}-${item.year}`} className="grid gap-2 border-l-2 border-forest/30 pl-4 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-4">
                    <div className="text-sm font-semibold text-forest">{item.year}</div>
                    <div className="text-sm leading-7 text-text-secondary">{t(item.detail)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {media.interviewNotes.length > 0 && (
            <section className="rounded-[1.5rem] border border-stone-border bg-stone-card p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                {lang === 'zh' ? '采访观察' : 'Interview Notes'}
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                {lang === 'zh' ? '信息与访谈补充' : 'Additional Context and Voice'}
              </h2>
              <div className="mt-5 space-y-3">
                {media.interviewNotes.map((item, index) => (
                  <div key={`${athlete.athleteId}-note-${index}`} className="rounded-2xl bg-stone-sidebar px-4 py-4 text-sm leading-7 text-text-secondary">
                    {t(item)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {cards.map((card) => (
            <article
              key={card.id}
              className="rounded-[1.5rem] border border-stone-border bg-stone-card p-6 shadow-sm"
            >
              <div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                    {t(hallOfFameCardTypes[card.type])}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">{t(card.title)}</h2>
                </div>
              </div>

              <p className="mt-4 text-base leading-relaxed text-text-primary">{t(card.summary)}</p>

              <div className="mt-5 space-y-4">
                {card.paragraphs.map((paragraph, index) => (
                  <p key={`${card.id}-${index}`} className="text-sm leading-7 text-text-secondary">
                    {t(paragraph)}
                  </p>
                ))}
              </div>

              {card.keyFacts?.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {card.keyFacts.map((fact) => (
                    <div key={t(fact.label)} className="rounded-2xl bg-stone-sidebar px-4 py-4">
                      <div className="text-xs uppercase tracking-wide text-text-secondary">
                        {t(fact.label)}
                      </div>
                      <div className="mt-2 text-sm font-medium leading-relaxed">
                        {t(fact.value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {card.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-stone-border px-3 py-1.5 text-xs text-text-secondary hover:border-forest hover:text-forest transition-colors"
                  >
                    {source.label}
                  </a>
                ))}
              </div>
            </article>
          ))}

          {media.videos.length > 0 && (
            <section className="rounded-[1.5rem] border border-stone-border bg-stone-card p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                {lang === 'zh' ? '精选视频' : 'Selected Videos'}
              </div>
              <h2 className="mt-2 text-2xl font-semibold">
                {lang === 'zh' ? '相关影像与采访' : 'Video and Interview Picks'}
              </h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {lang === 'zh'
                  ? '优先收录能直接看到比赛气质、动作风格和人物表达的影像与采访。'
                  : 'This section highlights videos and interviews that show competitive presence, movement style, and the athlete’s own voice most directly.'}
              </p>
              <VideoSection videos={media.videos} />
            </section>
          )}
        </div>
      </section>

      {lightboxIndex >= 0 && galleryImages.length > 0 && (
        <ImageLightbox
          images={galleryImages.map((image) => image.src)}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
        />
      )}
    </div>
  )
}
