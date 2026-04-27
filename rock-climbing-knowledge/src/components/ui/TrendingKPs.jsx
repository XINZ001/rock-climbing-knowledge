import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import kpRegistry from '../../data/kp-registry.json'

// 复用 KpLink 的跳转逻辑：navigate to /section/{slug}/{subSlug}#{kp-id}

/**
 * 热门知识点双行 marquee 滚动标签
 * - 上排向左滚动，下排向右滚动
 * - hover 整个区域时两排立即停住（无跳动）
 * - 使用 requestAnimationFrame 手动驱动，避免 CSS animation 暂停跳帧
 */

// KP 标签：点击直接跳转到知识点
const ROW1_KPS = [
  'kp-drop-knee', 'kp-heel-hook', 'kp-flagging',
  'kp-hangboard-training', 'kp-dyno-technique',
  'kp-climbing-shoes',
]
const ROW2_KPS = [
  'kp-twist-lock', 'kp-crack-hand-jam',
  'kp-campus-training', 'kp-fear-management',
  'kp-anchor-building',
]

// 搜索词标签：点击跳转到搜索结果页，口语化、接地气
// sectionId 用于染色，与对应知识领域一致
// q: { zh, en, ko } — 显示文案 & 搜索关键词均按当前语言
const ROW1_QUERIES = [
  { q: { zh: '怕高怎么办', en: 'fear of heights', ko: '높은 곳이 무서워요' }, emoji: '😰', sectionId: 'section-04' },
  { q: { zh: '泵了', en: 'forearm pump', ko: '펌핑' }, emoji: '💪', sectionId: 'section-02' },
  { q: { zh: '怎么选鞋', en: 'climbing shoes', ko: '암벽화 추천' }, emoji: '👟', sectionId: 'section-05' },
  { q: { zh: '零基础入门', en: 'beginner guide', ko: '초보자 가이드' }, emoji: '🌱', sectionId: 'section-01' },
  { q: { zh: '练指力', en: 'finger strength', ko: '손가락 훈련' }, emoji: '🤏', sectionId: 'section-02' },
  { q: { zh: '手皮破了', en: 'skin care', ko: '손 피부 관리' }, emoji: '🩹', sectionId: 'section-07' },
]
const ROW2_QUERIES = [
  { q: { zh: '腿软不敢爬', en: 'scared to climb', ko: '무서워서 못 올라가요' }, emoji: '🦵', sectionId: 'section-04' },
  { q: { zh: '卡级了', en: 'hit a plateau', ko: '정체기 극복' }, emoji: '📊', sectionId: 'section-04' },
  { q: { zh: '脚法怎么练', en: 'footwork drills', ko: '풋워크 연습' }, emoji: '🦶', sectionId: 'section-03' },
  { q: { zh: '开胯拉伸', en: 'hip flexibility', ko: '고관절 스트레칭' }, emoji: '🧘', sectionId: 'section-02' },
  { q: { zh: '第一次户外', en: 'first outdoor climb', ko: '첫 야외 등반' }, emoji: '⛰️', sectionId: 'section-08' },
  { q: { zh: '手指疼', en: 'finger pain', ko: '손가락 통증' }, emoji: '🤕', sectionId: 'section-07' },
]

function hexToRgba(hex, alpha) {
  const n = hex.replace('#', '')
  const v = n.length === 3 ? n.split('').map(c => c + c).join('') : n
  const int = Number.parseInt(v, 16)
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`
}

/**
 * 用 rAF 驱动的 marquee 行
 * direction: 'left' | 'right'
 * speed: px per second
 */
function MarqueeRow({ items, direction, paused, onClickItem }) {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)       // 当前偏移（px）
  const prevTimeRef = useRef(null)
  const rafRef = useRef(null)
  const halfWidthRef = useRef(0)
  const speed = 25 // px/s

  // 测量半宽（一份内容的宽度）用于无缝循环
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    // 总宽度 = 两份内容，取一半
    halfWidthRef.current = track.scrollWidth / 2
  })

  const tick = useCallback((timestamp) => {
    if (prevTimeRef.current === null) {
      prevTimeRef.current = timestamp
    }
    const delta = (timestamp - prevTimeRef.current) / 1000 // seconds
    prevTimeRef.current = timestamp

    if (!paused) {
      const move = speed * delta
      if (direction === 'left') {
        offsetRef.current -= move
        // 当滚过一整份内容时重置，实现无缝
        if (halfWidthRef.current > 0 && offsetRef.current <= -halfWidthRef.current) {
          offsetRef.current += halfWidthRef.current
        }
      } else {
        offsetRef.current += move
        if (halfWidthRef.current > 0 && offsetRef.current >= 0) {
          offsetRef.current -= halfWidthRef.current
        }
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${offsetRef.current}px)`
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [paused, direction])

  useEffect(() => {
    // 右行初始偏移：从 -halfWidth 开始
    if (direction === 'right' && offsetRef.current === 0 && halfWidthRef.current > 0) {
      offsetRef.current = -halfWidthRef.current
    }
    prevTimeRef.current = null
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tick, direction])

  return (
    <div
      className="overflow-hidden relative py-1"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
      }}
    >
      <div
        ref={trackRef}
        className="flex gap-3 w-max will-change-transform"
      >
        {[...items, ...items].map((item, i) => (
          <button
            key={`${item.id}-${i}`}
            onClick={() => onClickItem(item.route)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all duration-150 cursor-pointer hover:scale-105 hover:shadow-sm"
            style={{
              backgroundColor: hexToRgba(item.color, 0.10),
              borderColor: hexToRgba(item.color, 0.25),
              color: item.color,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(item.color, 0.20)
              e.currentTarget.style.borderColor = hexToRgba(item.color, 0.45)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(item.color, 0.10)
              e.currentTarget.style.borderColor = hexToRgba(item.color, 0.25)
            }}
          >
            {item.emoji ? `${item.emoji} ` : ''}{item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function TrendingKPs() {
  const { sections, lang } = useApp()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const colorMap = useMemo(() => {
    const map = {}
    for (const s of sections) {
      map[s.id] = s.color
    }
    return map
  }, [sections])

  // 将 KP ID 列表解析为标签对象
  const resolveKps = (ids) =>
    ids
      .map((id) => {
        const kp = kpRegistry.registry.find((k) => k.id === id)
        if (!kp) return null
        return {
          id: kp.id,
          label: lang === 'zh' ? kp.title.zh : lang === 'en' ? kp.title.en : (kp.title.ko || kp.title.en),
          color: colorMap[kp.sectionId] || '#4A7C59',
          route: `/section/${kp.sectionSlug}/${kp.subSectionSlug}#${kp.id}`,
        }
      })
      .filter(Boolean)

  // 将搜索词列表解析为标签对象（按当前语言）
  const resolveQueries = (queries) =>
    queries.map((item) => {
      const text = item.q[lang] || item.q.zh
      return {
        id: `q-${item.q.zh}`,
        label: text,
        emoji: item.emoji || '',
        color: colorMap[item.sectionId] || '#4A7C59',
        route: `/search?q=${encodeURIComponent(text)}`,
      }
    })

  // 交错合并 KP 标签和搜索词标签：KP, Query, KP, Query, ...
  const interleave = (kps, queries) => {
    const result = []
    const maxLen = Math.max(kps.length, queries.length)
    for (let i = 0; i < maxLen; i++) {
      if (i < kps.length) result.push(kps[i])
      if (i < queries.length) result.push(queries[i])
    }
    return result
  }

  const row1 = useMemo(() => interleave(resolveKps(ROW1_KPS), resolveQueries(ROW1_QUERIES)), [lang, colorMap])
  const row2 = useMemo(() => interleave(resolveKps(ROW2_KPS), resolveQueries(ROW2_QUERIES)), [lang, colorMap])

  const handleClick = useCallback((route) => navigate(route), [navigate])

  if (row1.length === 0 && row2.length === 0) return null

  return (
    <div
      className="mt-5 max-w-lg mx-auto flex flex-col gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {row1.length > 0 && (
        <MarqueeRow items={row1} direction="left" paused={hovered} onClickItem={handleClick} />
      )}
      {row2.length > 0 && (
        <MarqueeRow items={row2} direction="right" paused={hovered} onClickItem={handleClick} />
      )}
    </div>
  )
}
