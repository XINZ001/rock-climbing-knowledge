import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import Breadcrumb from '../components/content/Breadcrumb'
import KnowledgePoint from '../components/content/KnowledgePoint'
import videosData from '../data/videos.json'
import illustrationRegistry from '../data/illustration-registry.json'

function isEmbeddableVideo(url = '') {
  return (
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/.test(url) ||
    /bilibili\.com\/video\/(BV[\w]+)/.test(url)
  )
}

function canRenderInline(video) {
  if (!video) return false
  return isEmbeddableVideo(video.embedUrl || video.url || '')
}

export default function TopicPage() {
  const { sectionSlug, subSlug } = useParams()
  const { sections, loadSectionData, t, lang } = useApp()
  const [sectionData, setSectionData] = useState(null)
  const [loading, setLoading] = useState(true)

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
          {lang === 'zh' ? '未找到该页面' : 'Page not found'}
        </h1>
        <Link to="/" className="text-forest hover:underline text-sm">
          {lang === 'zh' ? '返回首页' : 'Back to Home'}
        </Link>
      </div>
    )
  }

  const subData = sectionData?.subSections?.find(s => s.slug === subSlug)
  const knowledgePoints = subData?.knowledgePoints || []
  const videos = videosData[subMeta?.id] || []
  const videosByKnowledgePoint = useMemo(() => {
    if (!knowledgePoints.length || !videos.length) return {}

    const mapping = new Map()
    const unassignedVideos = []

    videos.forEach(video => {
      if (!canRenderInline(video)) return
      if (video.knowledgePointId) {
        mapping.set(video.knowledgePointId, video)
      } else {
        unassignedVideos.push(video)
      }
    })

    // Prefer embeddable videos to maximize inline playback.
    unassignedVideos.sort((a, b) => {
      const aEmbed = isEmbeddableVideo(a.url) ? 1 : 0
      const bEmbed = isEmbeddableVideo(b.url) ? 1 : 0
      return bEmbed - aEmbed
    })

    const remainingPoints = knowledgePoints.filter(kp => !mapping.has(kp.id))
    remainingPoints.forEach((kp, idx) => {
      const fallbackVideo = unassignedVideos[idx]
      if (fallbackVideo) mapping.set(kp.id, fallbackVideo)
    })

    return Object.fromEntries(mapping)
  }, [knowledgePoints, videos])

  // Scroll to hash on load
  useEffect(() => {
    if (!loading && window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
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
              {lang === 'zh' ? '目录' : 'Contents'}
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
                <KnowledgePoint point={kp} video={videosByKnowledgePoint[kp.id]} illustrations={illustrationRegistry[kp.id]} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center py-12 text-text-secondary">
            <p className="text-sm">
              {lang === 'zh' ? '该分类的内容正在建设中' : 'Content for this category is under construction'}
            </p>
            <Link to={`/section/${sectionSlug}`} className="text-forest hover:underline text-sm mt-2 inline-block">
              {lang === 'zh' ? '返回' : 'Back to'} {t(section.title)}
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
