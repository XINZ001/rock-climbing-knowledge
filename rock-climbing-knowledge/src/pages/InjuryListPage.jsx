import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { fetchInjuryReports, BODY_PARTS, CLIMBING_TYPES } from '../lib/injuries'
import { supabase } from '../lib/supabase'
import { Icon } from '../utils/icons'
import UserAvatar from '../components/ui/UserAvatar'

// 根据受伤部位生成渐变色
const BODY_PART_GRADIENTS = {
  finger:   ['#E8927C', '#D4654E'],
  wrist:    ['#D4915E', '#B8724A'],
  elbow:    ['#C4A265', '#A6844D'],
  shoulder: ['#7EA88E', '#5E8A6E'],
  back:     ['#7C9DB8', '#5B7E9A'],
  knee:     ['#9B8EC4', '#7D6EA8'],
  ankle:    ['#C48E9B', '#A86E7D'],
  foot:     ['#8EB8B0', '#6E9A92'],
  other:    ['#A0A0A0', '#808080'],
}

// 受伤部位的简单图标（SVG path）
const BODY_PART_ICONS = {
  finger:   'M12 2C9.24 2 7 4.24 7 7v8c0 .55.45 1 1 1h1v-4.5c0-.28.22-.5.5-.5s.5.22.5.5V16h2v-6.5c0-.28.22-.5.5-.5s.5.22.5.5V16h2v-6.5c0-.28.22-.5.5-.5s.5.22.5.5V16h1c.55 0 1-.45 1-1V7c0-2.76-2.24-5-5-5z',
  wrist:    'M12 2a4 4 0 00-4 4v5a2 2 0 002 2h4a2 2 0 002-2V6a4 4 0 00-4-4zm0 16v4m-3-4v3m6-3v3',
  elbow:    'M16 4l-2 6-3 2v8M8 4l2 6 3 2',
  shoulder: 'M12 4a3 3 0 100 6 3 3 0 000-6zm-6 8c0-2 2-3 6-3s6 1 6 3v2H6v-2z',
  back:     'M12 2v20M8 6c2 0 3 1 4 3 1-2 2-3 4-3M8 12h8M8 18c2 0 3-1 4-3 1 2 2 3 4 3',
  knee:     'M12 2v6m0 0a3 3 0 110 6 3 3 0 010-6zm0 6v8',
  ankle:    'M12 2v8a4 4 0 100 8h4',
  foot:     'M4 18c0-4 3-6 8-6s8 2 8 6M8 12V6m8 6V8',
  other:    'M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
}

function InjuryCard({ report, lang }) {
  const details = report.injury_details?.[0] || report.injury_details
  if (!details) return null

  const bodyPartLabels = (details.body_parts || []).map((bp) => {
    const found = BODY_PARTS.find((b) => b.value === bp)
    return found ? (lang === 'zh' ? found.label.zh : found.label.en) : bp
  })

  const climbingLabel = CLIMBING_TYPES.find((c) => c.value === details.climbing_type)
  const likeCount = report.likes?.length || 0
  const commentCount = report.comments?.length || 0

  // 获取第一张图片
  const mediaItems = (report.media || []).sort((a, b) => a.display_order - b.display_order)
  const firstImage = mediaItems.find((m) => m.media_type === 'image')
  const imageUrl = firstImage
    ? supabase.storage.from('community-media').getPublicUrl(firstImage.storage_path).data.publicUrl
    : null

  // 无图时的渐变色
  const primaryBodyPart = details.body_parts?.[0] || 'other'
  const [gradFrom, gradTo] = BODY_PART_GRADIENTS[primaryBodyPart] || BODY_PART_GRADIENTS.other
  const iconPath = BODY_PART_ICONS[primaryBodyPart] || BODY_PART_ICONS.other

  return (
    <Link
      to={`/injuries/${report.id}`}
      className="group block rounded-xl overflow-hidden bg-stone-card border border-stone-border hover:shadow-lg hover:border-stone-border/80 transition-all break-inside-avoid mb-3"
    >
      {/* 图片区域 */}
      {imageUrl ? (
        <div className="relative w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={report.title}
            className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
            style={{ aspectRatio: '4 / 5' }}
          />
        </div>
      ) : (
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            aspectRatio: '4 / 4',
            background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`,
          }}
        >
          {/* 受伤部位图标 */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-16 h-16"
          >
            <path d={iconPath} />
          </svg>
          {/* 装饰性纹理 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
        </div>
      )}

      {/* 文字区域 */}
      <div className="p-3.5">
        {/* 标题 */}
        <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">{report.title}</h3>

        {/* 描述 */}
        <p className="text-xs text-text-secondary line-clamp-2 mb-2.5">{report.description}</p>

        {/* 底部：用户 + 互动 */}
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <UserAvatar name={report.profiles?.username || '匿名'} size={16} />
            {report.profiles?.username || '匿名'}
          </span>
          <span className="flex items-center gap-0.5">
            <Icon name="heart" size={13} /> {likeCount}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function InjuryListPage() {
  const { lang } = useApp()
  const { user } = useAuth()
  const { onOpenAuth } = useOutletContext()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterBodyPart, setFilterBodyPart] = useState('')
  const [filterClimbingType, setFilterClimbingType] = useState('')

  useEffect(() => {
    loadReports()
  }, [filterBodyPart, filterClimbingType])

  async function loadReports() {
    setLoading(true)
    const { data } = await fetchInjuryReports({
      bodyPart: filterBodyPart || undefined,
      climbingType: filterClimbingType || undefined,
    })
    setReports(data || [])
    setLoading(false)
  }

  return (
    <div className="relative">
      {/* 全景渐变背景 */}
      <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top_left,_rgba(212,145,61,0.18),_transparent_50%),radial-gradient(circle_at_top_right,_rgba(180,60,60,0.14),_transparent_45%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-[240px] h-[80px] bg-gradient-to-b from-transparent to-stone-bg pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {lang === 'zh' ? '伤痛档案' : 'Injury Archive'}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-text-secondary leading-relaxed">
              {lang === 'zh'
                ? '来自真实攀岩者的受伤经历——了解风险，做好预防。分享你的故事，帮助更多人安全攀岩。'
                : 'Real injury stories from climbers — understand risks, learn prevention. Share your story to help others climb safely.'}
            </p>
          </div>
          <Link
            to={user ? '/injuries/new' : '#'}
            onClick={(e) => {
              if (!user) { e.preventDefault(); onOpenAuth() }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors shrink-0"
          >
            <Icon name="plus" size={16} />
            {lang === 'zh' ? '分享我的经历' : 'Share My Story'}
          </Link>
        </div>

      {/* 免责声明 */}
      <div className="bg-amber-light border border-amber/20 rounded-xl px-4 py-3 mb-6 text-sm text-text-secondary">
        <Icon name="alertTriangle" size={14} className="text-amber inline mr-1.5" />
        本页面内容为用户自述经历，不构成医学建议。受伤后请及时就医。
      </div>

      {/* 筛选器 — pill 风格 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* 部位筛选 */}
        <button
          onClick={() => setFilterBodyPart('')}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            !filterBodyPart
              ? 'bg-amber text-white border-amber'
              : 'bg-stone-card border-stone-border text-text-secondary hover:border-amber/40'
          }`}
        >
          {lang === 'zh' ? '全部部位' : 'All parts'}
        </button>
        {BODY_PARTS.filter(bp => bp.value !== 'other').map((bp) => (
          <button
            key={bp.value}
            onClick={() => setFilterBodyPart(filterBodyPart === bp.value ? '' : bp.value)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              filterBodyPart === bp.value
                ? 'bg-amber text-white border-amber'
                : 'bg-stone-card border-stone-border text-text-secondary hover:border-amber/40'
            }`}
          >
            {lang === 'zh' ? bp.label.zh : bp.label.en}
          </button>
        ))}

        {/* 分隔 */}
        <div className="w-px h-6 bg-stone-border self-center mx-1" />

        {/* 攀岩类型筛选 */}
        {CLIMBING_TYPES.map((ct) => (
          <button
            key={ct.value}
            onClick={() => setFilterClimbingType(filterClimbingType === ct.value ? '' : ct.value)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              filterClimbingType === ct.value
                ? 'bg-forest text-white border-forest'
                : 'bg-stone-card border-stone-border text-text-secondary hover:border-forest/40'
            }`}
          >
            {lang === 'zh' ? ct.label.zh : ct.label.en}
          </button>
        ))}
      </div>

      {/* 案例列表 — 瀑布流双列 */}
      {loading ? (
        <div className="text-center py-16 text-text-secondary">加载中...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <Icon name="fileText" size={48} className="text-stone-border mx-auto mb-4" />
          <p className="text-text-secondary mb-4">
            {lang === 'zh' ? '还没有人分享过伤痛经历' : 'No injury stories yet'}
          </p>
          <Link
            to={user ? '/injuries/new' : '#'}
            onClick={(e) => {
              if (!user) { e.preventDefault(); onOpenAuth() }
            }}
            className="text-forest font-medium hover:underline"
          >
            {lang === 'zh' ? '成为第一个分享者 →' : 'Be the first to share →'}
          </Link>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
          {reports.map((report) => (
            <InjuryCard key={report.id} report={report} lang={lang} />
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
