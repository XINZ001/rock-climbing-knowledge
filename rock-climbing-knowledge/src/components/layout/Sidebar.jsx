import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
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

export default function Sidebar({ onNavigate }) {
  const { sections, t, lang } = useApp()
  const { sectionSlug, subSlug } = useParams()
  const [expanded, setExpanded] = useState(sectionSlug || null)

  // Auto-expand when navigating to a new section
  useEffect(() => {
    if (sectionSlug) setExpanded(sectionSlug)
  }, [sectionSlug])

  const toggleSection = (slug) => {
    setExpanded(expanded === slug ? null : slug)
  }

  return (
    <nav className="h-full overflow-y-auto py-3 px-2">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-bg transition-colors mb-1"
      >
        <Icon name="home" size={16} />
        <span>{lang === 'zh' ? '首页' : 'Home'}</span>
      </Link>

      <div className="mt-2 space-y-0.5">
        {sections.map((section) => {
          const isActive = sectionSlug === section.slug
          const isExpanded = expanded === section.slug

          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.slug)}
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
                    {lang === 'zh' ? '概览' : 'Overview'}
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
