import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../utils/icons'

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

const langOptions = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
]

export default function Sidebar({ onNavigate }) {
  const { sections, t, lang, setLang } = useApp()
  const { sectionSlug, subSlug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [manualExpanded, setManualExpanded] = useState(null)
  const knowledgeActive = location.pathname === '/knowledge' || location.pathname.startsWith('/section')
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
    <nav className="h-full overflow-y-auto py-3 px-2">
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
        to="/hall-of-fame"
        onClick={onNavigate}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          hallOfFameActive ? 'bg-forest-light text-forest' : 'hover:bg-stone-bg'
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

      {/* 语言切换 — 仅移动端可见（桌面端在 Header 中） */}
      <div className="lg:hidden flex gap-1 mt-2 px-3 py-1.5">
        {langOptions.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLang(opt.code)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
              opt.code === lang
                ? 'bg-forest-light text-forest'
                : 'bg-stone-bg text-text-secondary hover:text-text-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

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
    </nav>
  )
}
