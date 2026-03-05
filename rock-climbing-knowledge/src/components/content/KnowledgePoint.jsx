import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { useApp } from '../../context/AppContext'
import { resolveCrossRefs } from '../../utils/crossRefResolver'
import { Icon } from '../../utils/icons'
import ImageLightbox from '../ui/ImageLightbox'

function getEmbedInfo(url = '') {
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/
  )
  if (ytMatch) return { platform: 'youtube', id: ytMatch[1] }
  const biliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/)
  if (biliMatch) return { platform: 'bilibili', id: biliMatch[1] }
  return null
}

function VideoEmbed({ video, t }) {
  const embed = getEmbedInfo(video.url)
  if (embed?.platform === 'youtube') {
    return (
      <div className="space-y-2">
        <div className="relative w-full overflow-hidden rounded-md border border-stone-border" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${embed.id}`}
            title={t(video.title)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-forest transition-colors">
          {t(video.title)}
        </a>
        <div className="text-xs text-text-secondary">{video.channel}</div>
      </div>
    )
  }
  if (embed?.platform === 'bilibili') {
    return (
      <div className="space-y-2">
        <div className="relative w-full overflow-hidden rounded-md border border-stone-border" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://player.bilibili.com/player.html?bvid=${embed.id}&high_quality=1`}
            title={t(video.title)}
            allowFullScreen
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-forest transition-colors">
          {t(video.title)}
        </a>
        <div className="text-xs text-text-secondary">{video.channel}</div>
      </div>
    )
  }
  return null
}

function VideoCard({ video, t, onClick }) {
  const platformLabel = video.platform === 'bilibili' ? 'B站' : 'YouTube'
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-1 p-2 rounded-md border border-stone-border bg-stone-sidebar hover:border-forest/40 hover:bg-forest-light transition-colors text-left w-full"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium line-clamp-2 text-text-primary">{t(video.title)}</span>
        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] bg-stone-card border border-stone-border text-text-secondary uppercase">{platformLabel}</span>
      </div>
      <div className="text-[11px] text-text-secondary">{video.channel}</div>
    </button>
  )
}

export default function KnowledgePoint({ point, videos, illustrations }) {
  const { t, lang } = useApp()
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [videosExpanded, setVideosExpanded] = useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)

  useEffect(() => { setSelectedVideoIndex(0) }, [point.id])

  if (!point) return null

  const content = lang === 'zh' ? point.content?.zh : point.content?.en
  const crossRefs = resolveCrossRefs(point.crossRefs)

  const videoList = Array.isArray(videos) ? videos : []
  const clampedIndex = Math.min(selectedVideoIndex, videoList.length - 1)
  const primaryVideo = videoList[clampedIndex] || null
  const extraVideos = videoList.filter((_, i) => i !== clampedIndex)

  return (
    <div id={point.id} className="scroll-mt-20">
      <h3 className="text-lg font-semibold mb-1">
        {t(point.title)}
        {lang === 'zh' && point.title.en && (
          <span className="text-sm font-normal text-text-secondary ml-2">
            {point.title.en}
          </span>
        )}
      </h3>

      {/* Terms */}
      {point.terms && point.terms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {point.terms.map((term, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-sidebar text-xs"
            >
              <span>{term.zh}</span>
              <span className="text-text-secondary">{term.en}</span>
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      {content && (
        <div className="markdown-content text-sm leading-relaxed text-text-primary/90">
          <Markdown>{content}</Markdown>
        </div>
      )}

      {/* Expert Insights */}
      {point.expertInsights && point.expertInsights.length > 0 && (
        <div className="mt-4 space-y-3">
          {point.expertInsights.map((insight, i) => (
            <div
              key={i}
              className="bg-forest-light border-l-4 border-forest rounded-r-lg p-4"
            >
              <div className="text-xs font-semibold text-forest mb-1.5">
                {lang === 'zh' ? '💡 专家补充' : '💡 Expert Insight'}
              </div>
              <p className="text-sm leading-relaxed text-text-primary/90">
                {lang === 'zh' ? insight.zh : insight.en}
              </p>
              {insight.source && (
                <div className="mt-2">
                  {insight.sourceUrl ? (
                    <a
                      href={insight.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-forest hover:text-forest-dark transition-colors"
                    >
                      — {insight.source} ↗
                    </a>
                  ) : (
                    <span className="text-xs text-text-secondary">
                      — {insight.source}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Illustrations */}
      {illustrations && illustrations.length > 0 && (
        <div className={`mt-4 flex flex-wrap gap-3 ${illustrations.length === 1 ? '' : 'justify-start'}`}>
          {illustrations.map((src, i) => (
            <div
              key={i}
              className="group relative rounded-lg overflow-hidden border border-stone-border bg-stone-card cursor-pointer hover:border-forest/40 transition-colors"
              style={{
                maxWidth: illustrations.length === 1
                  ? 320
                  : illustrations.length === 2
                    ? 'calc(50% - 6px)'
                    : 'calc(33.333% - 8px)',
                minWidth: 160,
                flex: illustrations.length === 1 ? '0 0 auto' : '1 1 0',
              }}
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={src}
                alt=""
                className="w-full h-auto block"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
              <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex >= 0 && illustrations && (
        <ImageLightbox
          images={illustrations}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
        />
      )}

      {/* Tags */}
      {point.tags && point.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {point.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-amber-light text-amber border border-amber/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Cross references */}
      {crossRefs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Icon name="link" size={12} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">{lang === 'zh' ? '相关：' : 'Related: '}</span>
          {crossRefs.map(ref => (
            <Link
              key={ref.id}
              to={ref.path}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-forest-light text-forest hover:bg-forest hover:text-white transition-colors"
            >
              {t(ref.title)}
            </Link>
          ))}
        </div>
      )}

      {/* Further Reading */}
      {point.furtherReading && point.furtherReading.length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-text-secondary mb-1.5">
            {lang === 'zh' ? '📚 延伸阅读' : '📚 Further Reading'}
          </div>
          <div className="space-y-1">
            {point.furtherReading.map((item, i) => (
              <div key={i} className="flex items-baseline gap-1.5 text-xs">
                <span className="text-text-secondary shrink-0">•</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest hover:text-forest-dark transition-colors truncate"
                >
                  {item.title}
                </a>
                <span className="text-text-secondary shrink-0">{item.source}</span>
                <span className="px-1 py-0 rounded text-[10px] bg-stone-sidebar text-text-secondary uppercase shrink-0">
                  {item.language}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos: primary embed + collapsible extras */}
      {primaryVideo && (
        <div className="mt-4 rounded-lg border border-stone-border bg-stone-card p-3">
          <div className="text-xs font-semibold text-text-secondary mb-2">
            {lang === 'zh' ? '相关视频' : 'Related Video'}
          </div>

          <VideoEmbed video={primaryVideo} t={t} />

          {extraVideos.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setVideosExpanded(v => !v)}
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-forest transition-colors"
              >
                <span>{videosExpanded ? '▼' : '▶'}</span>
                <span>
                  {videosExpanded
                    ? lang === 'zh' ? '收起' : 'Collapse'
                    : lang === 'zh'
                      ? `更多相关视频 (${extraVideos.length})`
                      : `More videos (${extraVideos.length})`}
                </span>
              </button>

              {videosExpanded && (
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {extraVideos.map((v, i) => (
                    <VideoCard
                      key={v.url}
                      video={v}
                      t={t}
                      onClick={() => {
                        const realIndex = videoList.indexOf(v)
                        setSelectedVideoIndex(realIndex)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
