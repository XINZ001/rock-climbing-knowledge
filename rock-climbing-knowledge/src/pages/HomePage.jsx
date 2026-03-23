import { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import { getHallOfFameAthletes, getHallOfFameMedia } from '../utils/hallOfFame'
import PageSEO from '../components/PageSEO'

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

export default function HomePage() {
  const { sections, t, lang, search, searchReady } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }
    const timer = setTimeout(() => {
      const res = search(query)
      setResults(res.slice(0, 8))
      setShowDropdown(res.length > 0)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, search])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowDropdown(false)
    }
  }

  const handleResultClick = (item) => {
    navigate(`/section/${item.sectionSlug}/${item.subSectionSlug}`)
    setQuery('')
    setShowDropdown(false)
  }

  // 名人堂：主页排序 — 竞技优先，Janja 置顶
  const allAthletes = useMemo(() => {
    const homeCategoryOrder = ['elite', 'legend', 'explorer', 'innovator']
    return [...getHallOfFameAthletes()].sort((a, b) => {
      // Janja 始终第一
      if (a.slug === 'janja-garnbret') return -1
      if (b.slug === 'janja-garnbret') return 1
      const catA = homeCategoryOrder.indexOf(a.category)
      const catB = homeCategoryOrder.indexOf(b.category)
      if (catA !== catB) return catA - catB
      return a.athleteId.localeCompare(b.athleteId)
    })
  }, [])

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <PageSEO path="/" />
      {/* 圆点网格背景 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 2px, transparent 2px)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Hero */}
      <div className="text-center mt-16 mb-26">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest text-white mb-4">
          <Icon name="mountain" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-3">
          {lang === 'zh' ? '攀岩知识库' : 'Climbing Knowledge Base'}
        </h1>

        {/* 搜索框 */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto mt-4">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              placeholder={searchReady
                ? (lang === 'zh' ? '搜索知识点...' : 'Search...')
                : (lang === 'zh' ? '索引加载中...' : 'Loading...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors shadow-sm"
            />
          </div>

          {showDropdown && (
            <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-stone-card rounded-lg border border-stone-border shadow-lg overflow-hidden z-50 text-left">
              {results.map((r) => (
                <button
                  key={r.item.id}
                  onClick={() => handleResultClick(r.item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-stone-bg transition-colors border-b border-stone-border last:border-b-0"
                >
                  <div className="text-sm font-medium">{lang === 'zh' ? r.item.title_zh : r.item.title_en}</div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {lang === 'zh' ? r.item.sectionTitle_zh : r.item.sectionTitle_en}
                    {' · '}
                    {lang === 'zh' ? r.item.subTitle_zh : r.item.subTitle_en}
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearchSubmit}
                className="w-full text-center px-4 py-2 text-sm text-forest hover:bg-forest-light transition-colors font-medium"
              >
                {lang === 'zh' ? '查看全部结果 →' : 'View all results →'}
              </button>
            </div>
          )}
        </form>

        <p className="text-sm text-text-secondary mt-4 flex flex-wrap items-center justify-center gap-3">
          <span>{lang === 'zh' ? '制作人：行之' : 'By 行之'}</span>
          <a
            href="https://xhslink.com/m/7LQ0G4Nh0oU"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-lg border border-stone-border bg-stone-card text-text-secondary hover:bg-stone-hover hover:border-forest/40 transition-colors"
          >
            <img src="/images/xiaohongshu-logo.png" alt="小红书" className="w-[18px] h-[18px] rounded object-contain" />
            {lang === 'zh' ? '查看小红书' : 'View Xiaohongshu'}
          </a>
        </p>
      </div>

      {/* ==================== 1. 攀岩知识库 ==================== */}
      <div className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(74,124,89,0.20),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(93,64,55,0.14),_transparent_40%)]" />

        {/* Banner header */}
        <div className="relative px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="book" size={22} style={{ color: '#4A7C59' }} />
                {lang === 'zh' ? '攀岩知识库' : 'Climbing Knowledge Base'}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed max-w-2xl">
                {lang === 'zh'
                  ? '系统化的攀岩知识体系，涵盖技术、训练、装备、安全等 10 大领域'
                  : 'A systematic knowledge base covering technique, training, gear, safety and more across 10 domains'}
              </p>
            </div>
            <Link
              to="/knowledge"
              className="flex items-center gap-1.5 text-sm font-medium text-forest hover:underline shrink-0"
            >
              {lang === 'zh' ? `查看全部 ${sections.length} 个领域` : `View all ${sections.length} domains`}
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Preview: 横向滚动所有知识领域 */}
        <div className="pb-6">
          <div className="flex gap-3 overflow-x-auto py-2 -my-2 scrollbar-hide">
            <div className="shrink-0 w-4 sm:w-6" aria-hidden="true" />
            {sections.slice(0, 10).map((section) => (
              <Link
                key={section.id}
                to={`/section/${section.slug}`}
                className="group flex flex-col bg-white/80 backdrop-blur-sm rounded-xl border border-stone-border/60 p-4 hover:shadow-md hover:border-forest/30 transition-all shrink-0 w-[160px]"
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 mb-2.5 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: section.color }}
                >
                  <Icon name={section.icon} size={18} />
                </span>
                <h3 className="font-semibold text-sm leading-tight">{t(section.title)}</h3>
                {lang === 'zh' && section.title.en && (
                  <p className="text-[11px] text-text-secondary mt-0.5">{section.title.en}</p>
                )}
              </Link>
            ))}
            {sections.length > 10 && (
              <Link
                to="/knowledge"
                className="group flex flex-col items-center justify-center bg-stone-bg/60 rounded-xl border border-stone-border/60 border-dashed p-4 hover:border-forest/40 hover:bg-forest-light/30 transition-all shrink-0 w-[160px]"
              >
                <span className="text-2xl text-text-secondary group-hover:text-forest transition-colors mb-1.5">+</span>
                <span className="text-sm font-medium text-text-secondary group-hover:text-forest transition-colors">
                  {lang === 'zh' ? '查看更多' : 'View more'}
                </span>
              </Link>
            )}
            <div className="shrink-0 w-4 sm:w-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ==================== 2. 攀岩名人堂 ==================== */}
      <div className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(199,161,42,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(74,124,89,0.18),_transparent_40%)]" />

        {/* Banner header */}
        <div className="relative px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="trophy" size={22} style={{ color: '#9A7B2A' }} />
                {lang === 'zh' ? '攀岩名人堂' : 'Climbing Hall of Fame'}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed max-w-2xl">
                {lang === 'zh'
                  ? '收录攀岩历史与当代最具代表性的人物，集中展示他们的成就、风格与影像'
                  : 'Defining figures from climbing history and the modern era — achievements, style, and media'}
              </p>
            </div>
            <Link
              to="/hall-of-fame"
              className="flex items-center gap-1.5 text-sm font-medium text-forest hover:underline shrink-0"
            >
              {lang === 'zh' ? `查看全部 ${allAthletes.length} 位` : `View all ${allAthletes.length}`}
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Preview: 全部运动员横向滚动 — 复用名人堂富卡片 */}
        <div className="pb-6">
          <div className="flex gap-4 overflow-x-auto py-2 -my-2 scrollbar-hide">
            <div className="shrink-0 w-4 sm:w-6" aria-hidden="true" />
            {allAthletes.slice(0, 10).map((athlete) => {
              const media = getHallOfFameMedia(athlete.athleteId)
              const cardImage = media.cardImage
              const name = athlete.isChineseRepresentative
                ? (athlete.athleteName.zh || athlete.athleteName.en)
                : (athlete.athleteName.en || athlete.athleteName.zh)
              const subName = athlete.isChineseRepresentative
                ? athlete.athleteName.en
                : athlete.athleteName.zh
              return (
                <Link
                  key={athlete.athleteId}
                  to={`/hall-of-fame/${athlete.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-stone-border bg-stone-card shadow-sm transition-all hover:shadow-md hover:border-forest/30 shrink-0 w-[260px] sm:w-[300px]"
                >
                  <div
                    className="relative flex flex-col overflow-hidden p-4 h-[160px]"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(athlete.accentColor, 0.98)} 0%, ${hexToRgba(athlete.accentColor, 0.9)} 46%, ${hexToRgba(athlete.accentColor, 0.68)} 100%)`
                    }}
                  >
                    {cardImage && (
                      <div className="absolute right-0 top-0 h-full w-[48%] overflow-hidden">
                        <img
                          src={cardImage.src}
                          alt={name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          style={{
                            opacity: 0.4,
                            objectPosition: cardImage.objectPosition || 'center center',
                            transform: `translateX(${cardImage.translateX || '0%'}) scale(${cardImage.scale || 1})`,
                            transformOrigin: 'center center',
                            WebkitMaskImage:
                              'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.82) 62%, rgba(0,0,0,0.32) 82%, rgba(0,0,0,0) 100%)',
                            maskImage:
                              'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.82) 62%, rgba(0,0,0,0.32) 82%, rgba(0,0,0,0) 100%)'
                          }}
                        />
                      </div>
                    )}
                    <div className="relative z-10 flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white leading-tight">{name}</h3>
                      {subName && (
                        <div className="text-xs text-white/60 mt-0.5">{subName}</div>
                      )}
                    </div>
                    <p className="relative z-10 mt-2 text-xs font-medium leading-relaxed text-white/88 line-clamp-2">
                      {t(athlete.tagline)}
                    </p>
                  </div>
                </Link>
              )
            })}
            {allAthletes.length > 10 && (
              <Link
                to="/hall-of-fame"
                className="group flex flex-col items-center justify-center rounded-[1.25rem] border border-stone-border border-dashed bg-stone-bg/60 hover:border-forest/40 hover:bg-forest-light/30 transition-all shrink-0 w-[260px] sm:w-[300px] h-[160px]"
              >
                <span className="text-3xl text-text-secondary group-hover:text-forest transition-colors mb-2">+</span>
                <span className="text-sm font-medium text-text-secondary group-hover:text-forest transition-colors">
                  {lang === 'zh' ? `查看全部 ${allAthletes.length} 位` : `View all ${allAthletes.length}`}
                </span>
              </Link>
            )}
            <div className="shrink-0 w-4 sm:w-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ==================== 3. 伤痛档案 ==================== */}
      <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,145,61,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(180,60,60,0.14),_transparent_40%)]" />

        {/* Banner header */}
        <div className="relative px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="medkit" size={22} className="text-amber" />
                {lang === 'zh' ? '伤痛档案' : 'Injury Archive'}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed max-w-2xl">
                {lang === 'zh'
                  ? '来自真实攀岩者的受伤经历——了解风险，做好预防。分享你的故事，帮助更多人安全攀岩。'
                  : 'Real injury stories from climbers — understand risks, learn prevention. Share your story to help others climb safely.'}
              </p>
            </div>
            <Link
              to="/injuries"
              className="flex items-center gap-1.5 text-sm font-medium text-amber hover:underline shrink-0"
            >
              {lang === 'zh' ? '查看档案' : 'View Archive'}
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Preview: CTA */}
        <div className="relative px-6 pb-6 sm:px-8">
          <Link
            to="/injuries"
            className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-border/60 p-5 hover:shadow-md hover:border-amber/30 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center shrink-0">
              <Icon name="messageCircle" size={22} className="text-amber" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">
                {lang === 'zh' ? '分享你的攀岩受伤经历' : 'Share your climbing injury experience'}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {lang === 'zh'
                  ? '记录受伤部位、攀岩类型、恢复过程，帮助其他攀岩者做好预防'
                  : 'Document the body part, climbing type, and recovery to help others prevent injuries'}
              </p>
            </div>
            <Icon name="chevronRight" size={16} className="text-text-secondary shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  )
}
