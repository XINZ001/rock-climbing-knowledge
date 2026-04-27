import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../utils/icons'

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
  const navigate = useNavigate()

  // expandedSection: slug = 展开, null = 用户未手动操作, '__none__' = 用户主动全部折叠
  const [expandedSection, setExpandedSection] = useState(null)

  // 根据当前页面自动展开对应 section
  useEffect(() => {
    if (sectionSlug) setExpandedSection(sectionSlug)
  }, [])

  const handleSectionClick = (section) => {
    const currentExpanded = expandedSection === '__none__' ? null : (expandedSection || sectionSlug)
    if (currentExpanded === section.slug) {
      // 已展开 → 折叠
      setExpandedSection('__none__')
    } else {
      // 未展开 → 展开 + 跳转
      setExpandedSection(section.slug)
      if (sectionSlug !== section.slug) {
        navigate(`/section/${section.slug}`)
      }
    }
  }

  // expandedSection 优先：用户手动操作 > URL 自动推断
  const actualExpanded = expandedSection === '__none__' ? null : (expandedSection || sectionSlug)

  return (
    <nav className="h-full flex flex-col">
      {/* 可滚动区域 */}
      <div className="flex-1 min-h-0 overflow-y-auto py-3 px-2">
        {/* ── 知识库 10 大章节 ── */}
        <div className="mt-1 space-y-0.5">
          {sections.map((section) => {
            const isActive = sectionSlug === section.slug
            const isExpanded = actualExpanded === section.slug
            return (
              <div key={section.id}>
                <button
                  onClick={() => handleSectionClick(section)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-forest-light text-forest font-medium' : 'hover:bg-stone-bg'
                  }`}
                >
                  <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs shrink-0" style={{ backgroundColor: section.color }}>
                    {section.number}
                  </span>
                  <span className="flex-1 text-left truncate">{t(section.title)}</span>
                  <Icon name={isExpanded ? 'chevronDown' : 'chevronRight'} size={14} className="text-text-secondary shrink-0" />
                </button>
                <AccordionPanel isOpen={isExpanded}>
                  <div className="ml-7 mt-0.5 space-y-0.5 pb-1">
                    <Link
                      to={`/section/${section.slug}`}
                      className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                        isActive && !subSlug ? 'text-forest font-medium bg-forest-light' : 'text-text-secondary hover:text-text-primary hover:bg-stone-bg'
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
                          className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                            isSubActive ? 'text-forest font-medium bg-forest-light' : 'text-text-secondary hover:text-text-primary hover:bg-stone-bg'
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
      </div>

      {/* 底部固定区：语言切换 — 仅移动端 */}
      <div className="lg:hidden shrink-0 px-4 py-3 border-t border-stone-border flex items-center justify-end">
        <MobileLangDropdown lang={lang} setLang={setLang} />
      </div>
    </nav>
  )
}
