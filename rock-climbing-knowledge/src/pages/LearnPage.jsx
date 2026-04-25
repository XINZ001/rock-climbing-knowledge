import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import PageSEO from '../components/PageSEO'
import TrendingKPs from '../components/ui/TrendingKPs'

/* ── Problem-based entries (按问题找) ── */
const PROBLEMS = [
  { id: 'reach', emoji: '🤏', zh: '够不到远点', en: "Can't reach holds", ko: '홀드에 손이 안 닿아요' },
  { id: 'pump', emoji: '💪', zh: '容易 pump / 脱力', en: 'Getting pumped quickly', ko: '빨리 펌핑돼요' },
  { id: 'slip', emoji: '🦶', zh: '站不稳 / 脱落', en: 'Slipping off footholds', ko: '발이 미끄러져요' },
  { id: 'finger', emoji: '🤕', zh: '手指疼痛', en: 'Finger pain', ko: '손가락이 아파요' },
  { id: 'fear', emoji: '😰', zh: '怕坠落', en: 'Fear of falling', ko: '떨어지는 게 무서워요' },
  { id: 'read', emoji: '🧩', zh: '读线读不懂', en: "Can't read routes", ko: '루트를 못 읽겠어요' },
  { id: 'plateau', emoji: '📉', zh: '瓶颈期突破不了', en: 'Stuck at a plateau', ko: '정체기를 못 벗어나요' },
  { id: 'outdoor', emoji: '🏔️', zh: '想去户外不敢', en: 'Afraid to climb outdoors', ko: '야외 클라이밍이 두려워요' },
]

/* ── Level-based entries (按阶段学) ── */
const LEVELS = [
  { id: 'v0-v1', label: 'V0–V1', zh: '入门期', en: 'Beginner', ko: '입문기', color: '#4A7C59', desc: { zh: '基本动作、安全规则、攀岩礼仪', en: 'Basic movements, safety, etiquette', ko: '기본 동작, 안전, 에티켓' } },
  { id: 'v2-v3', label: 'V2–V3', zh: '基础期', en: 'Foundation', ko: '기초기', color: '#3B6B9E', desc: { zh: '脚法精度、身体姿态、基础体能', en: 'Footwork, body position, basic fitness', ko: '풋워크, 자세, 기초 체력' } },
  { id: 'v4-v5', label: 'V4–V5', zh: '进阶期', en: 'Intermediate', ko: '중급기', color: '#9B6B2F', desc: { zh: '动态技术、读线能力、系统训练', en: 'Dynamic moves, route reading, training', ko: '다이나믹 무브, 루트 리딩, 훈련' } },
  { id: 'v6-plus', label: 'V6+', zh: '高级', en: 'Advanced', ko: '고급', color: '#8B3A3A', desc: { zh: '项目策略、周期化训练、心理管理', en: 'Projecting, periodization, mental game', ko: '프로젝팅, 주기화, 멘탈' } },
]

/* ── Tag-based entries (按主题翻) ── */
const TOPICS = [
  { id: 'footwork', emoji: '🦶', zh: '脚法', en: 'Footwork', ko: '풋워크', section: '03' },
  { id: 'handholds', emoji: '✊', zh: '手法', en: 'Handholds', ko: '핸드홀드', section: '03' },
  { id: 'body', emoji: '🧘', zh: '身体姿态', en: 'Body Position', ko: '자세', section: '03' },
  { id: 'dynamic', emoji: '⚡', zh: '动态技术', en: 'Dynamic Moves', ko: '다이나믹', section: '03' },
  { id: 'physical', emoji: '💪', zh: '体能训练', en: 'Physical Training', ko: '체력 훈련', section: '02' },
  { id: 'mental', emoji: '🧠', zh: '心理', en: 'Mental Game', ko: '멘탈', section: '04' },
  { id: 'safety', emoji: '🛡️', zh: '安全', en: 'Safety', ko: '안전', section: '06' },
  { id: 'gear', emoji: '🎒', zh: '装备', en: 'Gear', ko: '장비', section: '05' },
  { id: 'injury', emoji: '🩹', zh: '伤痛防治', en: 'Injury Prevention', ko: '부상 예방', section: '07' },
  { id: 'outdoor', emoji: '🏕️', zh: '户外', en: 'Outdoor', ko: '아웃도어', section: '08' },
  { id: 'route-reading', emoji: '🗺️', zh: '读线', en: 'Route Reading', ko: '루트 리딩', section: '03' },
  { id: 'competition', emoji: '🏆', zh: '比赛', en: 'Competition', ko: '대회', section: '10' },
]

/* ── Section slug map ── */
const SECTION_SLUGS = {
  '01': 'overview', '02': 'physical', '03': 'technique',
  '04': 'mental', '05': 'gear', '06': 'safety',
  '07': 'injury', '08': 'outdoor', '09': 'special', '10': 'competition',
}

export default function LearnPage() {
  const { sections, t, lang, search, searchReady } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const tt = (zh, en, ko) => lang === 'zh' ? zh : lang === 'en' ? en : (ko || en)

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(() => {
      const res = search(query)
      setResults(res.slice(0, 12))
      setShowDropdown(res.length > 0)
      setActiveIdx(-1)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, search])

  // Click outside to close
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

  function getResultRoute(item) {
    if (item._type === 'article') return `/articles/${item.slug}`
    if (item._type === 'athlete') return `/hall-of-fame/${item.slug}`
    return `/section/${item.sectionSlug}/${item.subSectionSlug}#${item.id}`
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowDropdown(false)
    }
  }

  // Count KPs per section
  const sectionKpCounts = useMemo(() => {
    const counts = {}
    sections.forEach(s => {
      counts[s.slug] = (s.subSections || []).length
    })
    return counts
  }, [sections])

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8">
      <PageSEO path="/learn" />

      {/* Hero */}
      <div className="text-center mb-10 mt-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest text-white mb-4">
          <Icon name="book" size={28} />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {tt('想学什么？', 'What do you want to learn?', '무엇을 배우고 싶나요?')}
        </h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          {tt(
            '202 个知识点，4 种方式找到你需要的',
            '202 knowledge points, 4 ways to find what you need',
            '202개 지식 포인트, 4가지 방법으로 찾기'
          )}
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto mb-12">
        <div className="flex items-center rounded-xl bg-stone-card border border-stone-border shadow-sm focus-within:border-forest focus-within:ring-1 focus-within:ring-forest transition-colors">
          <Icon name="search" size={16} className="ml-3.5 shrink-0 text-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setShowDropdown(true) }}
            placeholder={tt(
              '搜索动作、问题、概念...',
              'Search movements, problems, concepts...',
              '동작, 문제, 개념 검색...'
            )}
            className="w-full pl-2.5 pr-4 py-3 bg-transparent text-sm focus:outline-none"
          />
        </div>

        {/* Quick search dropdown */}
        {showDropdown && results.length > 0 && (
          <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-stone-card rounded-xl border border-stone-border shadow-lg overflow-hidden z-50 max-h-[360px] overflow-y-auto">
            {results.map((r, idx) => (
              <button
                key={r.item.id}
                type="button"
                onClick={() => { navigate(getResultRoute(r.item)); setQuery(''); setShowDropdown(false) }}
                className={`w-full text-left px-4 py-2.5 hover:bg-stone-bg transition-colors flex items-center gap-3 ${idx === activeIdx ? 'bg-stone-bg' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t(r.item)}</div>
                  <div className="text-xs text-text-secondary mt-0.5 truncate">
                    {r.item._type === 'kp' && (
                      <>{lang === 'zh' ? r.item.sectionTitle_zh : r.item.sectionTitle_en} · {lang === 'zh' ? r.item.subTitle_zh : r.item.subTitle_en}</>
                    )}
                    {r.item._type === 'article' && tt('专栏文章', 'Article', '칼럼')}
                    {r.item._type === 'athlete' && tt('运动员', 'Athlete', '선수')}
                  </div>
                </div>
                <Icon name="chevronRight" size={14} className="text-text-secondary shrink-0" />
              </button>
            ))}
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="w-full text-center px-4 py-2.5 text-sm text-forest hover:bg-forest-light transition-colors font-medium border-t border-stone-border"
            >
              {tt('查看全部结果 →', 'View all results →', '전체 결과 보기 →')}
            </button>
          </div>
        )}
      </form>

      {/* Trending KPs */}
      <div className="mb-12">
        <TrendingKPs />
      </div>

      {/* ═══════ PATH 1: 按问题找 ═══════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 text-sm">🎯</span>
          <h2 className="text-lg font-bold">{tt('按问题找', 'Find by Problem', '문제로 찾기')}</h2>
          <span className="text-xs text-text-secondary ml-1">{tt('我遇到了具体困难', 'I have a specific issue', '구체적인 문제가 있어요')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROBLEMS.map(p => (
            <Link
              key={p.id}
              to={`/search?q=${encodeURIComponent(p[lang] || p.zh)}`}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-stone-card border border-stone-border hover:border-red-300 hover:bg-red-50/5 transition-colors"
            >
              <span className="text-lg">{p.emoji}</span>
              <span className="text-sm font-medium">{p[lang] || p.zh}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ PATH 2: 按阶段学 ═══════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 text-sm">📈</span>
          <h2 className="text-lg font-bold">{tt('按阶段学', 'Learn by Level', '단계별 학습')}</h2>
          <span className="text-xs text-text-secondary ml-1">{tt('给我这个水平该学的', 'Show me what to learn at my level', '내 레벨에 맞는 내용')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LEVELS.map(lv => (
            <Link
              key={lv.id}
              to={`/search?q=${encodeURIComponent(lv[lang] || lv.zh)}`}
              className="group relative rounded-xl border border-stone-border bg-stone-card p-4 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl" style={{ backgroundColor: lv.color }} />
              <div className="text-lg font-bold mb-1" style={{ color: lv.color }}>{lv.label}</div>
              <div className="text-sm font-medium mb-1">{lv[lang] || lv.zh}</div>
              <div className="text-xs text-text-secondary leading-relaxed">{lv.desc[lang] || lv.desc.zh}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ PATH 3: 按主题翻 ═══════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-600 text-sm">🏷️</span>
          <h2 className="text-lg font-bold">{tt('按主题翻', 'Browse by Topic', '주제별 탐색')}</h2>
          <span className="text-xs text-text-secondary ml-1">{tt('我想看某一类知识', 'I want to browse a category', '특정 카테고리 탐색')}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {TOPICS.map(topic => {
            const sectionSlug = SECTION_SLUGS[topic.section]
            return (
              <Link
                key={topic.id}
                to={`/section/${sectionSlug}`}
                className="flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl bg-stone-card border border-stone-border hover:border-forest/30 hover:bg-forest-light/30 transition-colors text-center"
              >
                <span className="text-xl">{topic.emoji}</span>
                <span className="text-xs font-medium">{topic[lang] || topic.zh}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ═══════ PATH 4: 完整知识库 ═══════ */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 text-sm">📂</span>
            <h2 className="text-lg font-bold">{tt('完整知识库', 'Full Knowledge Base', '전체 지식 라이브러리')}</h2>
          </div>
          <span className="text-xs text-text-secondary">{tt('10 个领域 · 202 个知识点', '10 domains · 202 KPs', '10개 분야 · 202개 지식')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={`/section/${section.slug}`}
              className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-stone-card border border-stone-border hover:border-forest/30 transition-colors"
            >
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: section.color }}
              >
                <Icon name={section.icon} size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{t(section.title)}</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {(section.subSections || []).length} {tt('个子主题', 'subtopics', '개 하위 주제')}
                </div>
              </div>
              <Icon name="chevronRight" size={14} className="text-text-secondary shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ Articles & Hall of Fame quick links ═══════ */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/articles"
            className="flex items-center gap-3.5 px-5 py-4 rounded-xl bg-stone-card border border-stone-border hover:border-teal/30 transition-colors"
          >
            <span className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
              <Icon name="fileText" size={20} className="text-teal" />
            </span>
            <div>
              <div className="text-sm font-semibold">{tt('攀岩专栏', 'Climbing Articles', '클라이밍 칼럼')}</div>
              <div className="text-xs text-text-secondary">{tt('39 篇深度文章', '39 in-depth articles', '39편의 심층 기사')}</div>
            </div>
          </Link>
          <Link
            to="/hall-of-fame"
            className="flex items-center gap-3.5 px-5 py-4 rounded-xl bg-stone-card border border-stone-border hover:border-gold/30 transition-colors"
          >
            <span className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              <Icon name="trophy" size={20} className="text-gold" />
            </span>
            <div>
              <div className="text-sm font-semibold">{tt('攀岩名人堂', 'Hall of Fame', '명예의 전당')}</div>
              <div className="text-xs text-text-secondary">{tt('74 位传奇运动员', '74 legendary athletes', '74명의 전설적 선수')}</div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
