import { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import { getHallOfFameAthletes, getHallOfFameMedia } from '../utils/hallOfFame'
import PageSEO from '../components/PageSEO'
import ArticleCard from '../components/article/ArticleCard'
import TrendingKPs from '../components/ui/TrendingKPs'
import articleRegistry from '../data/article-registry.json'

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

// 为搜索结果生成跳转路径
function getResultRoute(item) {
  if (item._type === 'article') return `/articles/${item.slug}`
  if (item._type === 'athlete') return `/hall-of-fame/${item.slug}`
  // KP: 跳转到子页面并定位到具体知识点
  return `/section/${item.sectionSlug}/${item.subSectionSlug}#${item.id}`
}

// 获取最近搜索记录
function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]')
  } catch { return [] }
}
function saveRecentSearch(query) {
  try {
    const recent = getRecentSearches().filter(q => q !== query)
    recent.unshift(query)
    localStorage.setItem('recentSearches', JSON.stringify(recent.slice(0, 8)))
  } catch { /* ignore */ }
}

export default function HomePage() {
  const { sections, t, lang, search, searchReady } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const heroRef = useRef(null)
  const sectionKbRef = useRef(null)
  const sectionArticleRef = useRef(null)
  const sectionHofRef = useRef(null)

  // 搜索 + 200ms 防抖
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      const res = search(query)
      setResults(res.slice(0, 20))
      setShowDropdown(res.length > 0)
      setActiveIdx(-1)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, search])

  // 点击外部关闭
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

  // 按类型分组结果：每组最多显示的条数
  const GROUP_LIMITS = { kp: 5, article: 3, athlete: 3 }
  const dropdownGroups = [
    { type: 'kp', label: { zh: '知识点', en: 'Knowledge Points', ko: '지식 포인트' }, icon: 'book' },
    { type: 'article', label: { zh: '专栏文章', en: 'Articles', ko: '칼럼' }, icon: 'fileText' },
    { type: 'athlete', label: { zh: '名人堂', en: 'Hall of Fame', ko: '명예의 전당' }, icon: 'trophy' },
  ]

  const groupedResults = useMemo(() => {
    const groups = { kp: [], article: [], athlete: [] }
    for (const r of results) {
      const type = r.item._type
      if (groups[type] && groups[type].length < GROUP_LIMITS[type]) groups[type].push(r)
    }
    return groups
  }, [results])

  // 按每组最佳结果的相关性动态排序
  const sortedGroups = useMemo(() => {
    return [...dropdownGroups].sort((a, b) => {
      const aItems = groupedResults[a.type]
      const bItems = groupedResults[b.type]
      if (!aItems?.length && !bItems?.length) return 0
      if (!aItems?.length) return 1
      if (!bItems?.length) return -1
      const aTop = aItems[0]
      const bTop = bItems[0]
      const aScore = (aTop.score || 0) + (aTop._precision || 0) * 0.0001
      const bScore = (bTop.score || 0) + (bTop._precision || 0) * 0.0001
      return aScore - bScore
    })
  }, [groupedResults])

  // 扁平列表用于键盘导航（跟随动态排序）
  const flatItems = useMemo(() => {
    return sortedGroups.flatMap(g => groupedResults[g.type] || [])
  }, [sortedGroups, groupedResults])

  const hasResults = flatItems.length > 0

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowDropdown(false)
    }
  }

  const handleResultClick = (item) => {
    saveRecentSearch(query.trim())
    navigate(getResultRoute(item))
    setQuery('')
    setShowDropdown(false)
  }

  // 键盘导航
  const handleKeyDown = (e) => {
    if (!showDropdown || flatItems.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(prev => (prev + 1) % flatItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(prev => (prev - 1 + flatItems.length) % flatItems.length)
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveIdx(-1)
    }
  }

  // 最近搜索
  const recentSearches = useMemo(() => getRecentSearches(), [])

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
      <div ref={heroRef} className="text-center mt-16 mb-26">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest text-white mb-4">
          <Icon name="mountain" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-3">
          {lang === 'zh' ? '攀岩知识库' : lang === 'en' ? 'Climbing Knowledge Base' : '클라이밍 지식 라이브러리'}
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
              onFocus={() => {
                if (hasResults) setShowDropdown(true)
                else if (!query.trim() && recentSearches.length > 0) setShowDropdown(true)
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchReady
                ? (lang === 'zh' ? '搜索知识点、专栏、运动员...' : lang === 'en' ? 'Search knowledge, articles, athletes...' : '지식, 칼럼, 선수 검색...')
                : (lang === 'zh' ? '索引加载中...' : lang === 'en' ? 'Loading...' : '로딩 중...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors shadow-sm"
            />
          </div>

          {/* 下拉面板 */}
          {showDropdown && (
            <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-stone-card rounded-xl border border-stone-border shadow-lg overflow-hidden z-50 text-left max-h-[420px] overflow-y-auto">

              {/* 空查询：最近搜索 */}
              {!query.trim() && recentSearches.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2 px-1">
                    {lang === 'zh' ? '最近搜索' : lang === 'en' ? 'Recent Searches' : '최근 검색'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => { setQuery(q); setShowDropdown(true) }}
                        className="px-2.5 py-1 rounded-full text-xs bg-stone-bg border border-stone-border hover:border-forest/40 hover:bg-forest-light transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 有查询结果：分组展示 */}
              {query.trim() && hasResults && (
                <>
                  {/* 动态排序的分组 */}
                  {sortedGroups.map(({ type, label, icon }, groupIdx) => {
                    const items = groupedResults[type]
                    if (!items || items.length === 0) return null
                    return (
                      <div key={type} className={sortedGroups.slice(0, groupIdx).some(g => groupedResults[g.type]?.length > 0) ? 'border-t border-stone-border' : ''}>
                        <div className="px-4 pt-3 pb-1.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <Icon name={icon} size={12} />
                          {label[lang] || label.zh}
                        </div>
                        {items.map((r) => {
                          const idx = flatItems.indexOf(r)
                          return (
                            <button
                              key={r.item.id}
                              type="button"
                              onClick={() => handleResultClick(r.item)}
                              className={`w-full text-left px-4 py-2 hover:bg-stone-bg transition-colors flex items-center gap-3 ${idx === activeIdx ? 'bg-stone-bg' : ''}`}
                            >
                              {type === 'article' && r.item.emoji && <span className="text-base shrink-0">{r.item.emoji}</span>}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{lang === 'zh' ? r.item.title_zh : lang === 'en' ? r.item.title_en : (r.item.title_ko || r.item.title_en)}</div>
                                <div className="text-xs text-text-secondary mt-0.5 truncate">
                                  {type === 'kp' && (
                                    <>
                                      {lang === 'zh' ? r.item.sectionTitle_zh : lang === 'en' ? r.item.sectionTitle_en : (r.item.sectionTitle_ko || r.item.sectionTitle_en)}
                                      {' · '}
                                      {lang === 'zh' ? r.item.subTitle_zh : lang === 'en' ? r.item.subTitle_en : (r.item.subTitle_ko || r.item.subTitle_en)}
                                    </>
                                  )}
                                  {type === 'article' && (
                                    <>
                                      {lang === 'zh' ? r.item.categoryTitle_zh : lang === 'en' ? r.item.categoryTitle_en : (r.item.categoryTitle_ko || r.item.categoryTitle_en)}
                                      {r.item.readingTime ? ` · ${r.item.readingTime} min` : ''}
                                    </>
                                  )}
                                  {type === 'athlete' && (
                                    lang === 'zh' ? r.item.terms_zh : lang === 'en' ? r.item.terms_en : (r.item.terms_ko || r.item.terms_en)
                                  )}
                                </div>
                              </div>
                              <Icon name="chevronRight" size={14} className="text-text-secondary shrink-0" />
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}

                  {/* 查看全部 */}
                  <div className="border-t border-stone-border">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center px-4 py-2.5 text-sm text-forest hover:bg-forest-light transition-colors font-medium"
                    >
                      {lang === 'zh' ? '查看全部结果 →' : lang === 'en' ? 'View all results →' : '전체 결과 보기 →'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </form>

        {/* 热门知识点滚动标签 */}
        <TrendingKPs />
      </div>

      {/* ==================== 1. 攀岩知识库 ==================== */}
      <div ref={sectionKbRef} className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(74,124,89,0.20),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(93,64,55,0.14),_transparent_40%)]" />

        {/* Banner header */}
        <div className="relative px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="book" size={22} style={{ color: '#4A7C59' }} />
                {lang === 'zh' ? '攀岩知识库' : lang === 'en' ? 'Climbing Knowledge Base' : '클라이밍 지식 라이브러리'}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed max-w-2xl">
                {lang === 'zh'
                  ? '系统化的攀岩知识体系，涵盖技术、训练、装备、安全等 10 大领域'
                  : lang === 'en'
                  ? 'A systematic knowledge base covering technique, training, gear, safety and more across 10 domains'
                  : '기술, 훈련, 장비, 안전 등 10개 분야를 아우르는 체계적인 클라이밍 지식 베이스'}
              </p>
            </div>
            <Link
              to="/knowledge"
              className="flex items-center gap-1.5 text-sm font-medium text-forest hover:underline shrink-0"
            >
              {lang === 'zh' ? `查看全部 ${sections.length} 个领域` : lang === 'en' ? `View all ${sections.length} domains` : `전체 ${sections.length}개 분야 보기`}
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Preview: 横向滚动所有知识领域 */}
        <div className="pb-6 sm:pb-8">
          <div className="flex gap-3 overflow-x-auto py-2 -my-2 pl-6 pr-6 sm:pl-8 sm:pr-8 scrollbar-hide">
            {sections.slice(0, 10).map((section) => (
              <Link
                key={section.id}
                to={`/section/${section.slug}`}
                className="group card-hover flex flex-col bg-stone-card backdrop-blur-sm rounded-xl border border-stone-border/60 p-4 hover:border-forest/30 transition-colors shrink-0 w-[160px]"
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
                  {lang === 'zh' ? '查看更多' : lang === 'en' ? 'View more' : '더 보기'}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ==================== 2. 攀岩专栏 ==================== */}
      <div ref={sectionArticleRef} className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(91,127,191,0.20),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(74,107,166,0.16),_transparent_40%)]" />

        {/* Banner header */}
        <div className="relative px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="fileText" size={22} className="text-teal" />
                {lang === 'zh' ? '攀岩专栏' : lang === 'en' ? 'Climbing Column' : '클라이밍 칼럼'}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed max-w-2xl">
                {lang === 'zh'
                  ? '深度解答攀岩者最关心的问题——从入门到进阶的必读指南'
                  : lang === 'en'
                  ? 'In-depth answers to the most common climbing questions — essential guides from beginner to advanced'
                  : '클라이머들이 가장 궁금해하는 질문에 대한 심층 답변'}
              </p>
            </div>
            <Link
              to="/articles"
              className="flex items-center gap-1.5 text-sm font-medium text-teal hover:underline shrink-0"
            >
              {lang === 'zh' ? `查看全部 ${articleRegistry.articles.length} 篇 →` : lang === 'en' ? `View all ${articleRegistry.articles.length} articles →` : `전체 ${articleRegistry.articles.length}편 보기 →`}
            </Link>
          </div>
        </div>

        {/* Horizontal scroll: [分类标签+2篇文章] × 4 categories in one row */}
        <div className="pb-8">
          <div className="flex gap-6 overflow-x-auto py-2 -my-2 pl-6 pr-6 sm:pl-8 sm:pr-8 scrollbar-hide">
            {articleRegistry.categories.map((cat) => {
              const catArticles = articleRegistry.articles.filter(a => a.category === cat.id)
              return (
                <div key={cat.id} className="shrink-0 flex flex-col gap-2.5" style={{ width: '460px' }}>
                  {/* Category label row */}
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/articles/category/${cat.id}`}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                    >
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Icon name={cat.icon} size={11} />
                      </span>
                      <span className="text-sm font-bold">{t(cat.title)}</span>
                    </Link>
                    <Link
                      to={`/articles/category/${cat.id}`}
                      className="text-xs font-medium hover:underline"
                      style={{ color: cat.color }}
                    >
                      {catArticles.length}{lang === 'zh' ? ' 篇 →' : ' →'}
                    </Link>
                  </div>
                  {/* 2 article cards side by side */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {catArticles.slice(0, 2).map(article => (
                      <ArticleCard key={article.id} article={article} variant="small" />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ==================== 3. 攀岩名人堂 ==================== */}
      <div ref={sectionHofRef} className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(166,138,42,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(140,116,34,0.16),_transparent_40%)]" />

        {/* Banner header */}
        <div className="relative px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="trophy" size={22} className="text-gold" />
                {lang === 'zh' ? '攀岩名人堂' : lang === 'en' ? 'Climbing Hall of Fame' : '클라이밍 명예의 전당'}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed max-w-2xl">
                {lang === 'zh'
                  ? '收录攀岩历史与当代最具代表性的人物，集中展示他们的成就、风格与影像'
                  : lang === 'en'
                  ? 'Defining figures from climbing history and the modern era — achievements, style, and media'
                  : '클라이밍 역사와 현대를 대표하는 인물들 — 업적, 스타일, 미디어'}
              </p>
            </div>
            <Link
              to="/hall-of-fame"
              className="flex items-center gap-1.5 text-sm font-medium text-gold hover:underline shrink-0"
            >
              {lang === 'zh' ? `查看全部 ${allAthletes.length} 位` : lang === 'en' ? `View all ${allAthletes.length}` : `전체 ${allAthletes.length}명 보기`}
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Preview: 全部运动员横向滚动 — 复用名人堂富卡片 */}
        <div className="pb-8">
          <div className="flex gap-4 overflow-x-auto py-2 -my-2 pl-6 pr-6 sm:pl-8 sm:pr-8 scrollbar-hide">
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
                  className="group card-hover flex flex-col overflow-hidden rounded-[1.25rem] border border-stone-border bg-stone-card shadow-sm transition-colors hover:border-forest/30 shrink-0 w-[260px] sm:w-[300px]"
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
                  {lang === 'zh' ? `查看全部 ${allAthletes.length} 位` : lang === 'en' ? `View all ${allAthletes.length}` : `전체 ${allAthletes.length}명 보기`}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ==================== 4. 伤痛档案 ==================== */}
      <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(196,91,82,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(168,75,67,0.14),_transparent_40%)]" />

        {/* Banner header */}
        <div className="relative px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="medkit" size={22} className="text-amber" />
                {lang === 'zh' ? '伤痛档案' : lang === 'en' ? 'Injury Archive' : '부상 기록'}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed max-w-2xl">
                {lang === 'zh'
                  ? '来自真实攀岩者的受伤经历——了解风险，做好预防。分享你的故事，帮助更多人安全攀岩。'
                  : lang === 'en'
                  ? 'Real injury stories from climbers — understand risks, learn prevention. Share your story to help others climb safely.'
                  : '실제 클라이머들의 부상 경험 — 위험을 이해하고 예방하세요. 여러분의 이야기를 공유해 다른 클라이머의 안전을 도와주세요.'}
              </p>
            </div>
            <Link
              to="/injuries"
              className="flex items-center gap-1.5 text-sm font-medium text-amber hover:underline shrink-0"
            >
              {lang === 'zh' ? '查看档案' : lang === 'en' ? 'View Archive' : '기록 보기'}
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Preview: CTA */}
        <div className="relative px-6 pb-6 sm:px-8">
          <Link
            to="/injuries"
            className="card-hover flex items-center gap-4 bg-stone-card backdrop-blur-sm rounded-xl border border-stone-border/60 p-5 hover:border-amber/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-light flex items-center justify-center shrink-0">
              <Icon name="messageCircle" size={22} className="text-amber" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">
                {lang === 'zh' ? '分享你的攀岩受伤经历' : lang === 'en' ? 'Share your climbing injury experience' : '클라이밍 부상 경험 공유하기'}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {lang === 'zh'
                  ? '记录受伤部位、攀岩类型、恢复过程，帮助其他攀岩者做好预防'
                  : lang === 'en'
                  ? 'Document the body part, climbing type, and recovery to help others prevent injuries'
                  : '부상 부위, 클라이밍 유형, 회복 과정을 기록해 다른 클라이머의 부상 예방을 도와주세요'}
              </p>
            </div>
            <Icon name="chevronRight" size={16} className="text-text-secondary shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  )
}
