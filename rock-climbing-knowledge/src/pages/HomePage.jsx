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
