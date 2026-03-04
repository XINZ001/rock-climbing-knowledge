import { useState } from 'react'
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
  if (ytMatch) {
    return { platform: 'youtube', id: ytMatch[1] }
  }
  const biliMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/)
  if (biliMatch) {
    return { platform: 'bilibili', id: biliMatch[1] }
  }
  return null
}

export default function KnowledgePoint({ point, video, illustrations }) {
  const { t, lang } = useApp()
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  if (!point) return null

  const content = lang === 'zh' ? point.content?.zh : point.content?.en
  const crossRefs = resolveCrossRefs(point.crossRefs)

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
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
              {/* Expand hint */}
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

      {/* Point-specific video */}
      {video && (
        <div className="mt-4 rounded-lg border border-stone-border bg-stone-card p-3">
          <div className="text-xs font-semibold text-text-secondary mb-1">
            {lang === 'zh' ? '相关视频' : 'Related Video'}
          </div>
          {(() => {
            const playableUrl = video.embedUrl || video.url
            const embed = getEmbedInfo(playableUrl)
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
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-forest transition-colors"
                  >
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
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-forest transition-colors"
                  >
                    {t(video.title)}
                  </a>
                  <div className="text-xs text-text-secondary">{video.channel}</div>
                </div>
              )
            }

            return (
              <div className="space-y-1">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-forest transition-colors"
                >
                  {t(video.title)}
                </a>
                <div className="text-xs text-text-secondary">{video.channel}</div>
                <div className="text-xs text-text-secondary">
                  {lang === 'zh'
                    ? '该链接不是单条可嵌入视频（如频道页/网站页），仅可外链打开。'
                    : 'This link is not a single embeddable video (e.g. channel/web page), so it opens externally.'}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
