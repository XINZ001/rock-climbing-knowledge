import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../utils/icons'
import ThemeToggle from '../ui/ThemeToggle'

const langOptions = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
]

function MobileLangDropdown({ lang, setLang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = langOptions.find((o) => o.code === lang) || langOptions[0]

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-stone-border text-xs font-medium hover:bg-stone-bg transition-colors"
      >
        <Icon name="globe" size={14} className="text-text-secondary" />
        {current.label}
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={10} className="text-text-secondary" />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-28 bg-stone-card rounded-lg border border-stone-border shadow-lg overflow-hidden z-50">
          {langOptions.map((opt) => (
            <button
              key={opt.code}
              onClick={() => { setLang(opt.code); setOpen(false) }}
              className={`w-full px-3 py-2 text-xs text-left transition-colors ${
                opt.code === lang
                  ? 'bg-forest-light text-forest font-semibold'
                  : 'hover:bg-stone-bg text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AccordionPanel({ isOpen, children }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(isOpen ? 'auto' : '0px')

  useEffect(() => {
    if (isOpen) {
      setHeight(ref.current.scrollHeight + 'px')
      const timer = setTimeout(() => setHeight('auto'), 200)
      return () => clearTimeout(timer)
    } else {
      if (ref.current) {
        setHeight(ref.current.scrollHeight + 'px')
        requestAnimationFrame(() => setHeight('0px'))
      }
    }
  }, [isOpen])

  return (
    <div
      ref={ref}
      style={{ height }}
      className="overflow-hidden transition-[height] duration-200 ease-out"
    >
      {children}
    </div>
  )
}

export default function Sidebar({ onNavigate }) {
  const { sections, t, lang, setLang } = useApp()
  const { sectionSlug, subSlug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [manualExpanded, setManualExpanded] = useState(null)
  const knowledgeActive = location.pathname === '/knowledge' || location.pathname.startsWith('/section')
  const articlesActive = location.pathname.startsWith('/articles')
  const hallOfFameActive = location.pathname.startsWith('/hall-of-fame')
  const injuriesActive = location.pathname.startsWith('/injuries')
  const expanded = sectionSlug || manualExpanded

  const toggleSection = (slug) => {
    setManualExpanded(expanded === slug ? null : slug)
  }

  const handleSectionClick = (section) => {
    onNavigate?.()
    if (sectionSlug !== section.slug) {
      navigate(`/section/${section.slug}`)
    }
    setManualExpanded(expanded === section.slug ? null : section.slug)
  }

  return (
    <nav className="h-full overflow-y-auto py-3 px-2 flex flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-bg transition-colors mb-1"
      >
        <Icon name="home" size={16} />
        <span>{lang === 'zh' ? '首页' : lang === 'en' ? 'Home' : '홈'}</span>
      </Link>

      <Link
        to="/knowledge"
        onClick={onNavigate}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          knowledgeActive ? 'bg-forest-light text-forest' : 'hover:bg-stone-bg'
        }`}
      >
        <Icon name="book" size={16} />
        <span>{lang === 'zh' ? '攀岩知识库' : lang === 'en' ? 'Knowledge Base' : '지식 라이브러리'}</span>
      </Link>

      <Link
        to="/articles"
        onClick={onNavigate}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          articlesActive ? 'bg-teal-light text-teal' : 'hover:bg-stone-bg'
        }`}
      >
        <Icon name="fileText" size={16} />
        <span>{lang === 'zh' ? '攀岩专栏' : lang === 'en' ? 'Climbing Column' : '클라이밍 칼럼'}</span>
      </Link>

      <Link
        to="/hall-of-fame"
        onClick={onNavigate}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          hallOfFameActive ? 'bg-gold-light text-gold' : 'hover:bg-stone-bg'
        }`}
      >
        <Icon name="trophy" size={16} />
        <span>{lang === 'zh' ? '攀岩名人堂' : lang === 'en' ? 'Hall of Fame' : '명예의 전당'}</span>
      </Link>

      <Link
        to="/injuries"
        onClick={onNavigate}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          injuriesActive ? 'bg-amber-light text-amber' : 'hover:bg-stone-bg'
        }`}
      >
        <Icon name="medkit" size={16} />
        <span>{lang === 'zh' ? '伤痛档案' : lang === 'en' ? 'Injury Archive' : '부상 기록'}</span>
      </Link>

      <div className="mt-2 space-y-0.5">
        {sections.map((section) => {
          const isActive = sectionSlug === section.slug
          const isExpanded = expanded === section.slug

          return (
            <div key={section.id}>
              <button
                onClick={() => handleSectionClick(section)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-forest-light text-forest font-medium' : 'hover:bg-stone-bg'
                }`}
              >
                <span
                  className="w-5 h-5 rounded flex items-center justify-center text-white text-xs shrink-0"
                  style={{ backgroundColor: section.color }}
                >
                  {section.number}
                </span>
                <span className="flex-1 text-left truncate">{t(section.title)}</span>
                <Icon
                  name={isExpanded ? 'chevronDown' : 'chevronRight'}
                  size={14}
                  className={`text-text-secondary shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-0' : ''
                  }`}
                />
              </button>

              <AccordionPanel isOpen={isExpanded}>
                <div className="ml-7 mt-0.5 space-y-0.5 pb-1">
                  <Link
                    to={`/section/${section.slug}`}
                    onClick={onNavigate}
                    className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                      isActive && !subSlug
                        ? 'text-forest font-medium bg-forest-light'
                        : 'text-text-secondary hover:text-text-primary hover:bg-stone-bg'
                    }`}
                  >
                    {lang === 'zh' ? '概览' : lang === 'en' ? 'Overview' : '개요'}
                  </Link>
                  {section.subSections.map((sub) => {
                    const isSubActive = isActive && subSlug === sub.slug
                    return (
                      <Link
                        key={sub.id}
                        to={`/section/${section.slug}/${sub.slug}`}
                        onClick={onNavigate}
                        className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                          isSubActive
                            ? 'text-forest font-medium bg-forest-light'
                            : 'text-text-secondary hover:text-text-primary hover:bg-stone-bg'
                        }`}
                      >
                        {t(sub.title)}
                      </Link>
                    )
                  })}
                </div>
              </AccordionPanel>
            </div>
          )
        })}
      </div>

      {/* 语言切换 + 暗色模式 — 仅移动端可见（桌面端在 Header 中） */}
      <div className="lg:hidden px-3 py-2 mt-auto border-t border-stone-border flex items-center justify-between">
        <ThemeToggle size={18} className="w-8 h-8" />
        <MobileLangDropdown lang={lang} setLang={setLang} />
      </div>
    </nav>
  )
}
