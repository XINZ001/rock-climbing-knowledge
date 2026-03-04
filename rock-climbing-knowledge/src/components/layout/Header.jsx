import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../utils/icons'

export default function Header({ onToggleSidebar }) {
  const { search, searchReady, lang, setLang, t } = useApp()
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

  const handleSubmit = (e) => {
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

  return (
    <header className="sticky top-0 z-40 bg-stone-card border-b border-stone-border shadow-sm">
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md hover:bg-stone-sidebar transition-colors"
        >
          <Icon name="menu" size={22} />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Icon name="mountain" size={24} className="text-forest" />
          <span className="font-semibold text-lg hidden sm:inline">攀岩知识库</span>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-auto relative">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              placeholder={searchReady
                ? (lang === 'zh' ? '搜索知识点 / Search...' : 'Search...')
                : (lang === 'zh' ? '索引加载中...' : 'Loading index...')}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
            />
          </div>

          {showDropdown && (
            <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-stone-card rounded-lg border border-stone-border shadow-lg overflow-hidden z-50">
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
                onClick={handleSubmit}
                className="w-full text-center px-4 py-2 text-sm text-forest hover:bg-forest-light transition-colors font-medium"
              >
                {lang === 'zh' ? '查看全部结果 →' : 'View all results →'}
              </button>
            </div>
          )}
        </form>

        <button
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="px-2.5 py-1 rounded-md border border-stone-border text-xs font-medium hover:bg-stone-sidebar transition-colors shrink-0"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </div>
    </header>
  )
}
