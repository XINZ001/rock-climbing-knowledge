import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { sectionModuleImages } from '../utils/sectionVisuals'
import PageSEO from '../components/PageSEO'

function KnowledgeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[250px] overflow-hidden rounded-2xl border border-stone-border/70 bg-stone-card"
        >
          <div className="h-44 animate-pulse bg-stone-border/60" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-stone-border/70" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-stone-border/55" />
            <div className="pt-5 space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-stone-border/55" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-stone-border/50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function KnowledgePage() {
  const { sections, t, lang } = useApp()

  return (
    <div className="relative">
      <PageSEO
        title={lang === 'zh' ? '知识库' : lang === 'en' ? 'Knowledge Base' : '지식 라이브러리'}
        description={lang === 'zh'
          ? '系统化的攀岩知识体系，从基础概览到高级技术，涵盖身体训练、攀岩技巧、心理建设、装备安全等十大模块。'
          : lang === 'en'
          ? 'A systematic climbing knowledge base covering physical training, techniques, mental skills, gear safety and more across ten modules.'
          : '체계적인 클라이밍 지식 베이스 — 신체 훈련, 기술, 멘탈, 장비 안전 등 10개 모듈을 다룹니다.'}
        path="/knowledge"
      />
      {/* 全景渐变背景 */}
      <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top_left,_rgba(74,124,89,0.18),_transparent_50%),radial-gradient(circle_at_top_right,_rgba(93,64,55,0.14),_transparent_45%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-[240px] h-[80px] bg-gradient-to-b from-transparent to-stone-bg pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-8">
        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {lang === 'zh' ? '攀岩知识库' : lang === 'en' ? 'Climbing Knowledge Base' : '클라이밍 지식 라이브러리'}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-text-secondary leading-relaxed">
            {lang === 'zh'
              ? '系统化的攀岩知识体系，涵盖技术、训练、装备、安全等 10 大领域，助你全面提升攀岩水平。'
              : lang === 'en'
              ? 'A systematic knowledge base covering technique, training, gear, safety and more across 10 domains to help you improve.'
              : '기술, 훈련, 장비, 안전 등 10개 분야를 아우르는 체계적인 클라이밍 지식 베이스로 실력을 향상시키세요.'}
          </p>
        </div>

      {sections.length === 0 ? (
        <KnowledgeGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map((section) => (
          <Link
            key={section.id}
            to={`/section/${section.slug}`}
            className="group card-hover flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-stone-border/70 bg-stone-card text-left transition-colors hover:border-text-primary/20"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={sectionModuleImages[section.slug]}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h2 className="text-xl font-semibold leading-tight text-text-primary">{t(section.title)}</h2>
                {lang === 'zh' && section.title.en && (
                  <p className="mt-0.5 text-xs text-text-secondary">{section.title.en}</p>
                )}
              </div>

              <div className="mt-4 text-xs leading-relaxed text-text-secondary">
                {section.subSections.map((sub, subIndex) => (
                  <span key={sub.id} className="whitespace-nowrap">
                    <span>{t(sub.title)}</span>
                    {subIndex < section.subSections.length - 1 && <span className="mx-1.5 text-text-secondary/45">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
