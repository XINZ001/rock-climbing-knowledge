import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import { sectionModuleImages } from '../utils/sectionVisuals'
import PageSEO from '../components/PageSEO'

export default function SectionPage() {
  const { sectionSlug } = useParams()
  const { sections, t, lang } = useApp()

  const section = sections.find(s => s.slug === sectionSlug)

  if (!section) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-semibold mb-2">
          {lang === 'zh' ? '未找到该分类' : lang === 'en' ? 'Category not found' : '카테고리를 찾을 수 없습니다'}
        </h1>
        <Link to="/" className="text-forest hover:underline text-sm">
          {lang === 'zh' ? '返回首页' : lang === 'en' ? 'Back to Home' : '홈으로 돌아가기'}
        </Link>
      </div>
    )
  }

  const sectionTitle = lang === 'zh' ? section.title.zh : lang === 'en' ? section.title.en : (section.title.ko || section.title.en)
  const sectionDesc = lang === 'zh' ? section.description.zh : lang === 'en' ? section.description.en : (section.description.ko || section.description.en)

  return (
    <div className="relative">
      <PageSEO title={sectionTitle} description={sectionDesc} path={`/section/${sectionSlug}`} />

      <section className="relative min-h-[420px] overflow-hidden text-white">
        <img
          src={sectionModuleImages[section.slug]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.52] saturate-[0.92] brightness-95 contrast-105"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(26,29,33,0.08),_rgba(26,29,33,0.62)_72%),linear-gradient(180deg,_rgba(26,29,33,0.18),_rgba(26,29,33,0.72)_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-stone-bg" />

        <div className="relative mx-auto flex min-h-[420px] max-w-4xl flex-col px-4 pb-14 pt-6">
          <div className="mt-auto max-w-2xl">
            <div className="mb-5 flex items-center gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: section.color }}
              >
                <Icon name={section.icon} size={24} />
              </span>
              <div>
                <h1 className="text-3xl font-bold">{t(section.title)}</h1>
                {lang === 'zh' && section.title.en && (
                  <p className="text-sm text-white/68">{section.title.en}</p>
                )}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/76 sm:text-base">
              {t(section.description)}
            </p>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {section.subSections.map((sub, idx) => (
            <Link
              key={sub.id}
              to={`/section/${section.slug}/${sub.slug}`}
              className="card-hover flex items-center gap-3 bg-stone-card rounded-lg border border-stone-border p-4 hover:border-text-primary/25 transition-colors group"
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: section.color }}
              >
                {section.number}.{idx + 1}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-sm group-hover:text-text-primary transition-colors">{t(sub.title)}</div>
                {lang === 'zh' && sub.title.en && (
                  <div className="text-xs text-text-secondary">{sub.title.en}</div>
                )}
              </div>
              <Icon name="chevronRight" size={16} className="ml-auto text-text-secondary shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
