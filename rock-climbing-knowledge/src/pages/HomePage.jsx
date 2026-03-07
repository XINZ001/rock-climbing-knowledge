import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'

export default function HomePage() {
  const { sections, t, lang } = useApp()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest text-white mb-4">
          <Icon name="mountain" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-3">
          {lang === 'zh' ? '攀岩知识库' : 'Climbing Knowledge Base'}
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mx-auto">
          {lang === 'zh' ? 'Climbing Knowledge Base' : '攀岩知识库'}
        </p>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl mx-auto">
          {lang === 'zh'
            ? '系统化的攀岩知识体系，涵盖技术、训练、装备、安全等 10 大领域'
            : 'A systematic climbing knowledge base covering technique, training, gear, safety and more across 10 domains'}
        </p>
      </div>

      <Link
        to="/hall-of-fame"
        className="group relative mb-10 block overflow-hidden rounded-[1.75rem] border border-stone-border bg-stone-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(199,161,42,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(74,124,89,0.18),_transparent_40%)]" />
        <div className="relative flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="max-w-2xl">
            <h2 className="mt-4 text-2xl font-bold">
              {lang === 'zh' ? '攀岩名人堂' : 'Climbing Hall of Fame'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary leading-relaxed">
              {lang === 'zh'
                ? '收录 John Gill、Lynn Hill、Janja Garnbret、潘愚非等代表人物，集中查看他们的生平、风格、访谈与相关影像。'
                : 'Featuring figures such as John Gill, Lynn Hill, Janja Garnbret, and Pan Yufei, with biography, style, interviews, and related media.'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-forest">
            <span>{lang === 'zh' ? '进入名人堂' : 'Open Hall of Fame'}</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </Link>

      {/* Section grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`/section/${section.slug}`}
            className="group block bg-stone-card rounded-xl border border-stone-border p-5 hover:shadow-md hover:border-stone-border/80 transition-all"
          >
            <div className="flex items-start gap-3">
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: section.color }}
              >
                <Icon name={section.icon} size={20} />
              </span>
              <div className="min-w-0">
                <h2 className="font-semibold text-base leading-tight">{t(section.title)}</h2>
                {lang === 'zh' && section.title.en && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    {section.title.en}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-3 line-clamp-2">
              {t(section.description)}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-text-secondary">
              <span>
                {section.subSections.length}
                {lang === 'zh' ? ' 个子分类' : ' subcategories'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
