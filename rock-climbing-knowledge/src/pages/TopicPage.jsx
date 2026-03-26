import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import Breadcrumb from '../components/content/Breadcrumb'
import KnowledgePoint from '../components/content/KnowledgePoint'
import { useUserRegion } from '../hooks/useUserRegion'
import { filterAndRankVideos } from '../utils/videoFilter'
import videosData from '../data/videos.json'
import illustrationRegistry from '../data/illustration-registry.json'
import PageSEO from '../components/PageSEO'

export default function TopicPage() {
  const { sectionSlug, subSlug } = useParams()
  const { sections, loadSectionData, t, lang } = useApp()
  const [sectionData, setSectionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isMainlandChina, loading: regionLoading } = useUserRegion()

  const section = sections.find(s => s.slug === sectionSlug)
  const subMeta = section?.subSections.find(s => s.slug === subSlug)

  useEffect(() => {
    if (!section) return
    setLoading(true)
    loadSectionData(section.id).then(data => {
      setSectionData(data)
      setLoading(false)
    })
  }, [section, loadSectionData])

  if (!section || !subMeta) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-semibold mb-2">
          {lang === 'zh' ? '未找到该页面' : lang === 'en' ? 'Page not found' : '페이지를 찾을 수 없습니다'}
        </h1>
        <Link to="/" className="text-forest hover:underline text-sm">
          {lang === 'zh' ? '返回首页' : lang === 'en' ? 'Back to Home' : '홈으로 돌아가기'}
        </Link>
      </div>
    )
  }

  const subData = sectionData?.subSections?.find(s => s.slug === subSlug)
  const knowledgePoints = subData?.knowledgePoints || []

  // Deduplicate videos across KPs on the same page: a video shown for an earlier KP
  // won't appear again for a later one on the same page.
  const videosPerKp = useMemo(() => {
    if (regionLoading || knowledgePoints.length === 0) return {}
    const seenUrls = new Set()
    const result = {}
    for (const kp of knowledgePoints) {
      const ranked = filterAndRankVideos(videosData[kp.id] || [], isMainlandChina, lang)
      const deduped = ranked.filter(v => !seenUrls.has(v.url))
      deduped.forEach(v => seenUrls.add(v.url))
      result[kp.id] = deduped
    }
    return result
  }, [knowledgePoints, isMainlandChina, lang, regionLoading])

  // Scroll to hash on load
  useEffect(() => {
    if (!loading && window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading])

  const topicTitle = subMeta ? (lang === 'zh' ? subMeta.title.zh : lang === 'en' ? subMeta.title.en : (subMeta.title.ko || subMeta.title.en)) : ''
  const sectionTitle = section ? (lang === 'zh' ? section.title.zh : lang === 'en' ? section.title.en : (section.title.ko || section.title.en)) : ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PageSEO
        title={`${topicTitle} — ${sectionTitle}`}
        description={lang === 'zh'
          ? `攀岩知识库「${sectionTitle}」模块：${topicTitle}的详细讲解与实用技巧。`
          : lang === 'en'
          ? `Climbing Knowledge Base — ${sectionTitle}: detailed guide and practical tips on ${topicTitle}.`
          : `클라이밍 지식 라이브러리 — ${sectionTitle}: ${topicTitle}에 대한 상세 가이드와 실용 팁.`}
        path={`/section/${sectionSlug}/${subSlug}`}
      />
      <Breadcrumb section={section} subSection={subMeta} />

      <div className="mt-6">
        <h1 className="text-2xl font-bold">
          {t(subMeta.title)}
          {lang === 'zh' && subMeta.title.en && (
            <span className="text-base font-normal text-text-secondary ml-3">
              {subMeta.title.en}
            </span>
          )}
        </h1>

        {subData?.overview && (
          <p className="text-text-secondary mt-2 text-sm leading-relaxed">
            {t(subData.overview)}
          </p>
        )}

        {/* Table of Contents */}
        {knowledgePoints.length > 1 && (
          <nav className="mt-6 p-4 bg-stone-sidebar rounded-lg border border-stone-border">
            <h2 className="text-xs font-semibold text-text-secondary uppercase mb-2">
              {lang === 'zh' ? '目录' : lang === 'en' ? 'Contents' : '목차'}
            </h2>
            <ul className="space-y-1">
              {knowledgePoints.map(kp => (
                <li key={kp.id}>
                  <a
                    href={`#${kp.id}`}
                    className="text-sm text-text-secondary hover:text-forest transition-colors"
                  >
                    {t(kp.title)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Knowledge Points */}
        {loading ? (
          <div className="mt-8 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-5 bg-stone-border rounded w-1/3 mb-3" />
                <div className="h-3 bg-stone-border rounded w-full mb-2" />
                <div className="h-3 bg-stone-border rounded w-4/5 mb-2" />
                <div className="h-3 bg-stone-border rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : knowledgePoints.length > 0 ? (
          <div className="mt-6 space-y-8">
            {knowledgePoints.map(kp => (
              <div key={kp.id} className="pb-6 border-b border-stone-border last:border-b-0">
                <KnowledgePoint
                  point={kp}
                  videos={videosPerKp[kp.id] || []}
                  illustrations={illustrationRegistry[kp.id]}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center py-12 text-text-secondary">
            <p className="text-sm">
              {lang === 'zh' ? '该分类的内容正在建设中' : lang === 'en' ? 'Content for this category is under construction' : '이 카테고리의 콘텐츠는 준비 중입니다'}
            </p>
            <Link to={`/section/${sectionSlug}`} className="text-forest hover:underline text-sm mt-2 inline-block">
              {lang === 'zh' ? '返回' : lang === 'en' ? 'Back to' : '돌아가기:'} {t(section.title)}
            </Link>
          </div>
        )}
      </div>

      {/* Navigation between sub-sections */}
      <div className="mt-10 flex justify-between items-center border-t border-stone-border pt-4">
        {(() => {
          const idx = section.subSections.findIndex(s => s.slug === subSlug)
          const prev = idx > 0 ? section.subSections[idx - 1] : null
          const next = idx < section.subSections.length - 1 ? section.subSections[idx + 1] : null
          return (
            <>
              {prev ? (
                <Link to={`/section/${sectionSlug}/${prev.slug}`} className="text-sm text-forest hover:underline">
                  ← {t(prev.title)}
                </Link>
              ) : <span />}
              {next ? (
                <Link to={`/section/${sectionSlug}/${next.slug}`} className="text-sm text-forest hover:underline">
                  {t(next.title)} →
                </Link>
              ) : <span />}
            </>
          )
        })()}
      </div>
    </div>
  )
}
