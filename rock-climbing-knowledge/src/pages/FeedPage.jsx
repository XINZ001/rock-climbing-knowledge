import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import posts from '../data/feed-registry.json'
import profiles from '../data/profiles-registry.json'
import Avatar from '../components/ui/Avatar'

/* ================================================================
   FeedPage — Xiaohongshu-style masonry community feed
   Self-contained: all helpers, data maps, sub-components inline.
   ================================================================ */

// ── Seeded random from post id ──────────────────────────────────
function seededRandom(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i)
    h |= 0
  }
  h = Math.abs(h)
  return ((h * 9301 + 49297) % 233280) / 233280
}

function getLikes(postId) {
  return Math.floor(seededRandom(postId) * 1950 + 50)
}

function formatLikes(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

function getInitial(name) {
  if (!name) return '?'
  return name.charAt(0)
}

// ── Shuffle with seed (deterministic) ───────────────────────────
function shuffleSeeded(arr, seed) {
  // Step 1: basic seeded shuffle
  const a = [...arr]
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h) + seed.charCodeAt(i)
    h |= 0
  }
  for (let i = a.length - 1; i > 0; i--) {
    h = Math.abs(((h * 9301 + 49297) % 233280))
    const j = h % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // Step 2: spread authors — no same author within 3 consecutive posts
  for (let i = 2; i < a.length; i++) {
    if (a[i].author === a[i-1].author || a[i].author === a[i-2].author) {
      // Find the next post with a different author and swap
      for (let j = i + 1; j < Math.min(i + 20, a.length); j++) {
        if (a[j].author !== a[i-1].author && a[j].author !== a[i-2].author) {
          ;[a[i], a[j]] = [a[j], a[i]]
          break
        }
      }
    }
  }
  return a
}

// ── Card Type Config ────────────────────────────────────────────
const CARD_TYPE_CONFIG = {
  teach:        { emoji: '\u{1F4DA}', tag: '教学',   ratio: 1.25 },
  principle:    { emoji: '\u{1F4D0}', tag: '原理',   ratio: 1.25 },
  breakthrough: { emoji: '\u{1F4A1}', tag: '突破',   ratio: 1.33 },
  pitfall:      { emoji: '\u26A0\uFE0F',  tag: '踩坑',   ratio: 1.33 },
  story:        { emoji: '\u{1F4D6}', tag: '故事',   ratio: 1.33 },
  case:         { emoji: '\u{1F3D4}\uFE0F',  tag: '案例',   ratio: 1.33 },
  quote:        { emoji: '\u{1F4AC}', tag: '语录',   ratio: 1 },
  data:         { emoji: '\u{1F4CA}', tag: '数据',   ratio: 0.75 },
  compare:      { emoji: '\u2696\uFE0F',  tag: '对比',   ratio: 0.75 },
  roast:        { emoji: '\u{1F525}', tag: '吐槽',   ratio: 1.15 },
  quiz:         { emoji: '\u2753',    tag: '测试',   ratio: 1.15 },
  myth:         { emoji: '\u{1F9EA}', tag: '辟谣',   ratio: 1.15 },
  checklist:    { emoji: '\u2705',    tag: '清单',   ratio: 1.15 },
  rx:           { emoji: '\u{1F48A}', tag: '处方',   ratio: 1.15 },
  gear:         { emoji: '\u{1F392}', tag: '装备',   ratio: 1.15 },
}

// ── Persona Cover Styles ────────────────────────────────────────
const PERSONA_COVER_STYLES = {
  'coach-wang':       { bg: 'linear-gradient(160deg, #2D5A3D, #4A7C59)', text: '#fff' },
  'v4-zhang':         { bg: 'linear-gradient(160deg, #FFF5F0, #FFE8D6)', text: '#5D3A1A' },
  'doctor-chen':      { bg: 'linear-gradient(160deg, #1a3a5c, #3B6B9E)', text: '#fff' },
  'outdoor-feng':     { bg: 'linear-gradient(160deg, #3E2723, #795548)', text: '#fff' },
  'flash-ge':         { bg: 'linear-gradient(160deg, #1a1a2e, #16213e)', text: '#FFD700' },
  'desk-zhou':        { bg: 'linear-gradient(160deg, #37474F, #607D8B)', text: '#fff' },
  'mama-chen':        { bg: 'linear-gradient(160deg, #880E4F, #C2185B)', text: '#fff' },
  'retired-wang':     { bg: 'linear-gradient(160deg, #4E342E, #795548)', text: '#fff' },
  'youth-chen':       { bg: 'linear-gradient(160deg, #1565C0, #42A5F5)', text: '#fff' },
  'flexi-lisa':       { bg: 'linear-gradient(160deg, #6A1B9A, #AB47BC)', text: '#fff' },
  'nutri-lin':        { bg: 'linear-gradient(160deg, #2E7D32, #66BB6A)', text: '#fff' },
  'gear-tony':        { bg: 'linear-gradient(160deg, #E65100, #FF9800)', text: '#fff' },
  'photo-zhao':       { bg: 'linear-gradient(160deg, #4A148C, #7B1FA2)', text: '#fff' },
  'debug-climb':      { bg: 'linear-gradient(160deg, #263238, #455A64)', text: '#4FC3F7' },
  'book-self-coached':{ bg: 'linear-gradient(160deg, #1B5E20, #388E3C)', text: '#fff' },
  'book-physics':     { bg: 'linear-gradient(160deg, #0D47A1, #1976D2)', text: '#fff' },
  'book-injury':      { bg: 'linear-gradient(160deg, #B71C1C, #E53935)', text: '#fff' },
  'book-training':    { bg: 'linear-gradient(160deg, #E65100, #F57C00)', text: '#fff' },
  'book-warrior':     { bg: 'linear-gradient(160deg, #3E2723, #5D4037)', text: '#fff' },
  'pro-ondra':        { bg: 'linear-gradient(160deg, #3E2723, #5D4037)', text: '#fff' },
  'pro-janja':        { bg: 'linear-gradient(160deg, #1B4D3E, #2E7D32)', text: '#fff' },
  'pro-honnold':      { bg: 'linear-gradient(160deg, #2C1F0E, #4E342E)', text: '#fff' },
  'pro-magnus':       { bg: 'linear-gradient(160deg, #B71C1C, #E53935)', text: '#fff' },
  'pro-tomoa':        { bg: 'linear-gradient(160deg, #1A237E, #283593)', text: '#fff' },
  'pro-ashima':       { bg: 'linear-gradient(160deg, #4A148C, #7B1FA2)', text: '#fff' },
  'pro-sharma':       { bg: 'linear-gradient(160deg, #BF360C, #E64A19)', text: '#fff' },
  'fun-spider':       { bg: 'linear-gradient(160deg, #283593, #5C6BC0)', text: '#fff' },
  'fun-a2':           { bg: 'linear-gradient(160deg, #E57373, #FFCDD2)', text: '#B71C1C' },
  'fun-510a':         { bg: 'linear-gradient(160deg, #FF6F00, #FFB300)', text: '#fff' },
  'fun-core':         { bg: 'linear-gradient(160deg, #D84315, #FF7043)', text: '#fff' },
  'fun-chalk':        { bg: 'linear-gradient(160deg, #E0E0E0, #F5F5F5)', text: '#424242' },
  'fun-crack':        { bg: 'linear-gradient(160deg, #3E2723, #6D4C41)', text: '#fff' },
  'fun-v0':           { bg: 'linear-gradient(160deg, #546E7A, #90A4AE)', text: '#fff' },
  'fun-timer':        { bg: 'linear-gradient(160deg, #C62828, #EF5350)', text: '#fff' },
  'newbie-xiaomei':   { bg: 'linear-gradient(160deg, #81D4FA, #B3E5FC)', text: '#1A3A5C' },
}

const PERSONA_EMOJI = {
  'coach-wang': '\u{1F9D7}', 'v4-zhang': '\u{1F602}', 'doctor-chen': '\u{1FA7A}', 'outdoor-feng': '\u26F0\uFE0F',
  'flash-ge': '\u26A1', 'desk-zhou': '\u{1F4BB}', 'mama-chen': '\u{1F469}\u200D\u{1F467}', 'retired-wang': '\u{1F9D3}',
  'youth-chen': '\u{1F3CB}\uFE0F', 'flexi-lisa': '\u{1F9D8}', 'nutri-lin': '\u{1F957}', 'gear-tony': '\u{1F392}',
  'photo-zhao': '\u{1F4F8}', 'debug-climb': '\u{1F41B}',
  'book-self-coached': '\u{1F4D5}', 'book-physics': '\u{1F4D7}', 'book-injury': '\u{1F4D9}', 'book-training': '\u{1F4D8}', 'book-warrior': '\u{1F4D3}',
  'pro-ondra': '\u{1F3C6}', 'pro-janja': '\u{1F947}', 'pro-honnold': '\u{1F3D4}\uFE0F', 'pro-magnus': '\u{1F3AC}',
  'pro-tomoa': '\u{1F1EF}\u{1F1F5}', 'pro-ashima': '\u{1F338}', 'pro-sharma': '\u{1F549}\uFE0F',
  'fun-spider': '\u{1F577}\uFE0F', 'fun-a2': '\u{1FA79}', 'fun-510a': '\u{1F45F}', 'fun-core': '\u{1F525}',
  'fun-chalk': '\u{1F90D}', 'fun-crack': '\u270A', 'fun-v0': '\u{1F9F1}', 'fun-timer': '\u23F1\uFE0F',
  'newbie-xiaomei': '\u{1F64B}\u200D\u2640\uFE0F',
}

// ── Illustration Map ────────────────────────────────────────────
const ILLUSTRATION_FILES = [
  'ill-008-kp-flagging.webp','ill-010-kp-drop-knee.webp','ill-013-kp-stemming.webp',
  'ill-016-kp-knee-bar.webp','ill-017-kp-opposition-compression.webp','ill-018-kp-push-pull.webp',
  'ill-019-kp-climbing-posture.webp','ill-020-kp-hip-control.webp','ill-021-kp-cog-movement.webp',
  'ill-022-kp-full-crimp-half-crimp-open-hand.webp','ill-027-kp-undercling-sidepull-gaston.webp',
  'ill-028-kp-claw-hook-grip.webp','ill-030-kp-jug-hold.webp','ill-032-kp-edging.webp',
  'ill-033-kp-smearing.webp','ill-034-kp-toe-hook.webp','ill-035-kp-heel-hook.webp',
  'ill-036-kp-foot-switching.webp','ill-037-kp-foot-precision.webp','ill-039-kp-dyno-technique.webp',
  'ill-040-kp-deadpoint.webp','ill-041-kp-lunge-types.webp','ill-042-kp-campus-moves.webp',
  'ill-043-kp-figure-four.webp','ill-044-kp-route-reading-basics.webp','ill-045-kp-sequence-planning.webp',
  'ill-046-kp-onsight-flash-redpoint.webp','ill-047-kp-crux-analysis.webp','ill-048-kp-slab-technique.webp',
  'ill-049-kp-overhang-technique.webp','ill-050-kp-roof-technique.webp','ill-051-kp-arete-mantle.webp',
  'ill-052-kp-crack-hand-jam.webp','ill-053-kp-crack-foot-body-jam.webp',
  'ill-058-kp-core-role.webp','ill-059-kp-core-training.webp','ill-061-kp-hangboard-training.webp',
  'ill-064-kp-endurance-types.webp','ill-066-kp-4x4-training.webp','ill-074-kp-fear-management.webp',
  'ill-075-kp-desensitization.webp','ill-076-kp-flow-state.webp','ill-077-kp-periodization.webp',
  'ill-078-kp-projecting-strategy.webp','ill-079-kp-plateau-breaking.webp',
  'ill-080-kp-attention-management.webp','ill-081-kp-training-log.webp','ill-082-kp-working-linking.webp',
  'ill-083-kp-goal-setting.webp','ill-088-kp-bouldering-fall.webp','ill-095-kp-gym-etiquette.webp',
  'ill-101-kp-skin-management.webp','ill-102-kp-climber-nutrition.webp','ill-103-kp-sleep-recovery.webp',
  'ill-105-kp-indoor-outdoor-diff.webp','ill-107-kp-crack-climbing-systems.webp',
  'ill-110-kp-multi-pitch.webp','ill-118-kp-kids-development.webp',
  'ill-120-kp-elderly-training-adjustments.webp','ill-122-kp-adaptive-types.webp',
  'ill-124-kp-lead-competition.webp','ill-125-kp-speed-competition.webp',
  'ill-129-kp-isolation-zone.webp','ill-130-kp-competition-anxiety.webp',
  'ill-133-fun-a2.webp','ill-134-fun-core.webp','ill-135-fun-510a.webp',
  'ill-136-fun-v0.webp','ill-137-fun-spider.webp','ill-138-fun-crack.webp',
  'ill-139-fun-chalk.webp','ill-140-fun-timer.webp',
  'ill-001-kp-lever-biomechanics.webp','ill-003-kp-kinetic-chain.webp',
  'ill-005-kp-cog-principles.webp','ill-006-kp-inertia-momentum.webp',
]

const ILLUSTRATION_MAP = {}
ILLUSTRATION_FILES.forEach(f => {
  const m = f.match(/^ill-\d+-(.+)\.webp$/)
  if (m) ILLUSTRATION_MAP[m[1]] = '/images/feed/' + f
})

const FUN_AUTHOR_MAP = {
  'fun-a2': 'fun-a2', 'fun-core': 'fun-core', 'fun-510a': 'fun-510a',
  'fun-v0': 'fun-v0', 'fun-spider': 'fun-spider', 'fun-crack': 'fun-crack',
  'fun-chalk': 'fun-chalk', 'fun-timer': 'fun-timer',
}

const IMAGE_COVER_TYPES = new Set(['teach', 'principle', 'story', 'case', 'gear', 'pitfall', 'breakthrough', 'rx', 'checklist'])

function getIllustration(post) {
  if (FUN_AUTHOR_MAP[post.author] && ILLUSTRATION_MAP[FUN_AUTHOR_MAP[post.author]]) {
    return ILLUSTRATION_MAP[FUN_AUTHOR_MAP[post.author]]
  }
  for (const kp of (post.sourceKP || [])) {
    if (ILLUSTRATION_MAP[kp]) return ILLUSTRATION_MAP[kp]
  }
  return null
}

// Texture backgrounds for text-only covers
const TEXTURES = [
  '/images/textures/texture-concrete-01.webp',
  '/images/textures/texture-concrete-02.webp',
  '/images/textures/texture-concrete-03.webp',
  '/images/textures/texture-concrete-04.webp',
  '/images/textures/texture-concrete-05.webp',
  '/images/textures/texture-concrete-06.webp',
  '/images/textures/texture-wall-01.webp',
  '/images/textures/texture-wall-02.webp',
  '/images/textures/texture-wall-03.webp',
  '/images/textures/texture-wall-04.webp',
  '/images/textures/texture-wall-05.webp',
  '/images/textures/texture-rock-01.webp',
  '/images/textures/texture-rock-02.webp',
  '/images/textures/texture-rock-03.webp',
  '/images/textures/texture-rock-04.webp',
  '/images/textures/texture-rock-05.webp',
]

// Character scene images (3 per character)
const SCENE_MAP = {
  'coach-wang': ['scn-001-coach-wang','scn-002-coach-wang','scn-003-coach-wang'],
  'newbie-xiaomei': ['scn-004-xiaobai','scn-005-xiaobai','scn-006-xiaobai'],
  'v4-zhang': ['scn-007-v4-zhang','scn-008-v4-zhang','scn-009-v4-zhang'],
  'doctor-chen': ['scn-010-doctor-chen','scn-011-doctor-chen','scn-012-doctor-chen'],
  'outdoor-feng': ['scn-013-outdoor-feng','scn-014-outdoor-feng','scn-015-outdoor-feng'],
  'flash-ge': ['scn-016-flash-ge','scn-017-flash-ge','scn-018-flash-ge'],
  'desk-zhou': ['scn-019-desk-zhou','scn-020-desk-zhou','scn-021-desk-zhou'],
  'mama-chen': ['scn-022-mama-chen','scn-023-mama-chen','scn-024-mama-chen'],
  'retired-wang': ['scn-025-retired-wang','scn-026-retired-wang','scn-027-retired-wang'],
  'youth-chen': ['scn-028-youth-chen','scn-029-youth-chen','scn-030-youth-chen'],
  'flexi-lisa': ['scn-031-flexi-lisa','scn-032-flexi-lisa','scn-033-flexi-lisa'],
  'nutri-lin': ['scn-034-nutri-lin','scn-035-nutri-lin','scn-036-nutri-lin'],
  'gear-tony': ['scn-037-gear-tony','scn-038-gear-tony','scn-039-gear-tony'],
  'photo-zhao': ['scn-040-photo-zhao','scn-041-photo-zhao','scn-042-photo-zhao'],
  'debug-climb': ['scn-043-debug-climb','scn-044-debug-climb','scn-045-debug-climb'],
  'pro-ondra': ['scn-046-pro-ondra','scn-047-pro-ondra','scn-048-pro-ondra'],
  'pro-janja': ['scn-049-pro-janja','scn-050-pro-janja','scn-051-pro-janja'],
  'pro-honnold': ['scn-052-pro-honnold','scn-053-pro-honnold','scn-054-pro-honnold'],
  'pro-magnus': ['scn-055-pro-magnus','scn-056-pro-magnus','scn-057-pro-magnus'],
  'pro-tomoa': ['scn-058-pro-tomoa','scn-059-pro-tomoa','scn-060-pro-tomoa'],
  'pro-ashima': ['scn-061-pro-ashima','scn-062-pro-ashima','scn-063-pro-ashima'],
  'pro-sharma': ['scn-064-pro-sharma','scn-065-pro-sharma','scn-066-pro-sharma'],
  'fun-spider': ['scn-067-fun-spider','scn-068-fun-spider','scn-069-fun-spider'],
  'fun-a2': ['scn-070-fun-a2','scn-071-fun-a2','scn-072-fun-a2'],
  'fun-510a': ['scn-073-fun-510a','scn-074-fun-510a','scn-075-fun-510a'],
  'fun-core': ['scn-076-fun-core','scn-077-fun-core','scn-078-fun-core'],
  'fun-chalk': ['scn-079-fun-chalk','scn-080-fun-chalk','scn-081-fun-chalk'],
  'fun-crack': ['scn-082-fun-crack','scn-083-fun-crack','scn-084-fun-crack'],
  'fun-v0': ['scn-085-fun-v0','scn-086-fun-v0','scn-087-fun-v0'],
  'fun-timer': ['scn-088-fun-timer','scn-089-fun-timer','scn-090-fun-timer'],
}

function getSceneImage(post) {
  const scenes = SCENE_MAP[post.author]
  if (!scenes) return null
  // Use seeded random to pick one of 3 scenes and decide whether to show it (~30%)
  const r = seededRandom(post.id + 'scn')
  if (r > 0.30) return null  // 70% of posts don't use scene image
  const idx = Math.floor(seededRandom(post.id + 'scnidx') * scenes.length)
  return `/images/scenes/${scenes[idx]}.webp`
}

function getTexture(postId) {
  const idx = Math.abs(seededRandom(postId + 'tex') * TEXTURES.length) | 0
  return TEXTURES[idx % TEXTURES.length]
}

function getPersonaStyle(authorId) {
  return PERSONA_COVER_STYLES[authorId] || { bg: 'linear-gradient(160deg, #666, #999)', text: '#fff' }
}

function coverGradient(color, type) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const darkR = Math.max(0, r - 40)
  const darkG = Math.max(0, g - 40)
  const darkB = Math.max(0, b - 40)
  if (type === 'quote') {
    return `linear-gradient(135deg, rgba(${r},${g},${b},0.85), rgba(${darkR},${darkG},${darkB},0.95))`
  }
  return `linear-gradient(145deg, rgb(${r},${g},${b}), rgb(${darkR},${darkG},${darkB}))`
}

function extractNumber(title) {
  const m = title.match(/(\d+[\.\d]*)\s*(%|cm|mm|kg|秒|次|度|倍|分钟|小时)/)
  if (m) return { num: m[1] + m[2], rest: title.replace(m[0], '').trim() }
  const m2 = title.match(/(\d+[\.\d]*)/)
  if (m2) return { num: m2[1], rest: title.replace(m2[0], '').trim() }
  return null
}

// ── Tab Definitions ─────────────────────────────────────────────
const TABS = [
  { label: '推荐',  filter: null },
  { label: '技术',  filter: p => p.section === 's03' },
  { label: '体能',  filter: p => p.section === 's02' },
  { label: '伤病',  filter: p => p.section === 's07' },
  { label: '安全',  filter: p => p.section === 's06' },
  { label: '心理',  filter: p => p.section === 's04' },
  { label: '户外',  filter: p => p.section === 's08' },
  { label: '名人',  filter: p => p.author.startsWith('pro-') },
]

// ── Pre-shuffle posts once ──────────────────────────────────────
const shuffledPosts = shuffleSeeded(posts, 'climb2026')

// ── Section Slug Map ────────────────────────────────────────────
const SECTION_SLUG_MAP = {
  s01: 'overview', s02: 'physical', s03: 'technique',
  s04: 'mental', s05: 'gear', s06: 'safety',
  s07: 'injury', s08: 'outdoor', s09: 'special',
  s10: 'competition',
}

function buildKpRoute(post) {
  if (!post.section || !post.subsection || !post.sourceKP || !post.sourceKP[0]) return null
  const sectionSlug = SECTION_SLUG_MAP[post.section]
  if (!sectionSlug) return null
  return `/section/${sectionSlug}/${post.subsection}#${post.sourceKP[0]}`
}

// ── localStorage helpers ────────────────────────────────────────
const LIKES_KEY = 'feed-likes'
const BOOKMARKS_KEY = 'feed-bookmarks'
const COMMENTS_KEY = 'feed-comments'
const VIEWED_KEY = 'feed-viewed'

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveSet(key, s) {
  localStorage.setItem(key, JSON.stringify([...s]))
}

function loadComments() {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveComments(c) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(c))
}

// ── Relative time formatter ─────────────────────────────────────
function relativeTime(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 172800000) return '昨天'
  return Math.floor(diff / 86400000) + '天前'
}

// ── Toast Component ─────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[2000] pointer-events-none transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: `translate(-50%, ${visible ? '0' : '10px'})` }}
    >
      <div className="bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg">
        {message}
      </div>
    </div>
  )
}

// ── SVG Icons (inline) ──────────────────────────────────────────
const HeartIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const StarIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const CommentIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)

const ShareIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const BookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
)

const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

// ══════════════════════════════════════════════════════════════════
//  CardCover — renders the cover area for a feed card
// ══════════════════════════════════════════════════════════════════
function CardCover({ post, profile, isDetail = false }) {
  const cfg = CARD_TYPE_CONFIG[post.cardType] || CARD_TYPE_CONFIG.teach
  const pStyle = getPersonaStyle(post.author)
  const pType = profile ? profile.personaType : 'original'
  const storyEmoji = PERSONA_EMOJI[post.author] || '\u{1F4DD}'
  const illUrl = getIllustration(post)
  // Use short coverText for covers, full title for detail view
  const displayText = isDetail ? post.title : (post.coverText || post.title)

  // Custom fonts per persona type
  const COVER_FONTS = {
    original: "'CoverRounded', 'PingFang SC', sans-serif",
    book:     "'CoverSerif', Georgia, 'Songti SC', serif",
    athlete:  "'CoverDisplay', 'SF Pro Display', sans-serif",
    fun:      "'CoverHandwriting', 'PingFang SC', cursive",
    crossover:"'CoverDisplay', 'SF Pro Text', sans-serif",
  }
  const coverFontStyle = { fontFamily: COVER_FONTS[pType] || COVER_FONTS.original }

  const texture = getTexture(post.id)
  const textureOverlay = (
    <img src={texture} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-multiply pointer-events-none" />
  )

  // Character scene image cover (30% of posts with matching character)
  const sceneUrl = getSceneImage(post)
  if (sceneUrl) {
    return (
      <div className="absolute inset-0">
        <img src={sceneUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    )
  }

  // KP illustration cover
  if (illUrl && IMAGE_COVER_TYPES.has(post.cardType) && seededRandom(post.id + 'img') > 0.35) {
    return (
      <div className="absolute inset-0">
        <img
          src={illUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    )
  }

  // Quote cover
  if (post.cardType === 'quote') {
    let bgStyle, textColor, markColor
    if (pType === 'book') {
      const borderColor = profile ? profile.avatarColor : '#888'
      bgStyle = { background: '#FAF8F0', borderTop: `4px solid ${borderColor}` }
      textColor = '#333'
      markColor = 'rgba(0,0,0,0.08)'
    } else if (pType === 'athlete') {
      bgStyle = { background: 'linear-gradient(160deg, #1a1a1a, #2d2d2d)' }
      textColor = '#fff'
      markColor = 'rgba(255,255,255,0.1)'
    } else {
      bgStyle = { background: pStyle.bg }
      textColor = pStyle.text
      markColor = pStyle.text === '#fff' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
    }
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5 py-4" style={bgStyle}>
        {textureOverlay}
        <div
          className={`absolute top-2 left-4 font-serif leading-none select-none ${isDetail ? 'text-[80px]' : 'text-[56px]'}`}
          style={{ color: markColor }}
        >
          {'\u201C'}
        </div>
        {storyEmoji !== '\u{1F4DD}' && (
          <div className="text-[32px] mb-2 relative z-[1]">{storyEmoji}</div>
        )}
        <div
          className={`relative z-[1] leading-snug ${isDetail ? 'text-2xl' : 'text-[23px] leading-[1.35] line-clamp-4'}`}
          style={{ color: textColor, ...coverFontStyle }}
        >
          {displayText}
        </div>
      </div>
    )
  }

  // Data cover: big number + label
  if (post.cardType === 'data') {
    const extracted = extractNumber(post.title)
    if (extracted) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4" style={{ background: pStyle.bg }}>
          {textureOverlay}
          <div className="text-[36px] font-black tracking-tight leading-none mb-2 relative z-[1]" style={{ color: pStyle.text, ...coverFontStyle }}>
            {extracted.num}
          </div>
          <div className="text-xs font-medium opacity-80 text-center line-clamp-2" style={{ color: pStyle.text, ...coverFontStyle }}>
            {extracted.rest || displayText}
          </div>
        </div>
      )
    }
  }

  // Myth / Rx cover: big emoji + title
  if (post.cardType === 'myth' || post.cardType === 'rx') {
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5 py-4" style={{ background: pStyle.bg }}>
        {textureOverlay}
        <div className="text-[36px] mb-3 relative z-[1]">{cfg.emoji}</div>
        <div
          className={`relative z-[1] leading-snug ${isDetail ? 'text-2xl' : 'text-[23px] leading-[1.35] line-clamp-3'}`}
          style={{ color: pStyle.text, ...coverFontStyle }}
        >
          {displayText}
        </div>
      </div>
    )
  }

  // Default: emoji + gradient + texture + title
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5 py-4" style={{ background: pStyle.bg }}>
      {textureOverlay}
      <div className="text-[28px] mb-2 relative z-[1]">{storyEmoji}</div>
      <div
        className={`relative z-[1] leading-snug ${isDetail ? 'text-2xl' : 'text-[23px] leading-[1.35] line-clamp-3'}`}
        style={{ color: pStyle.text, ...coverFontStyle }}
      >
        {displayText}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  FeedCard — a single card in the masonry grid
// ══════════════════════════════════════════════════════════════════
function FeedCard({ post, index = 0, onOpenDetail, onOpenProfile, isLiked, onToggleLike, isViewed = false }) {
  const profile = profiles[post.author]
  const cfg = CARD_TYPE_CONFIG[post.cardType] || CARD_TYPE_CONFIG.teach
  const ratio = cfg.ratio + (seededRandom(post.id + 'r') * 0.2 - 0.1)
  const baseLikes = getLikes(post.id)
  const displayLikes = baseLikes + (isLiked ? 1 : 0)
  const color = profile ? profile.avatarColor : '#888'
  const name = profile ? profile.name : post.author

  const shouldAnimate = index < 8
  const [animDone, setAnimDone] = useState(!shouldAnimate)
  useEffect(() => {
    if (!shouldAnimate) return
    const t = setTimeout(() => setAnimDone(true), 50 + index * 50 + 500)
    return () => clearTimeout(t)
  }, [shouldAnimate, index])
  const animClass = shouldAnimate
    ? (animDone ? 'anim-ready anim-done' : 'anim-ready anim-visible')
    : ''
  const animStyle = shouldAnimate && !animDone
    ? { animationDelay: `${index * 50}ms` }
    : undefined

  return (
    <div
      className={`break-inside-avoid mb-3 md:mb-4 cursor-pointer group ${animClass}`}
      style={animStyle}
      onClick={() => onOpenDetail(post)}
    >
      <div
        className={`bg-stone-card rounded-xl overflow-hidden shadow-sm card-hover btn-press transition-opacity duration-300 ${
          isViewed ? 'opacity-60 hover:opacity-95' : ''
        }`}
      >
        {/* Cover */}
        <div className="relative overflow-hidden" style={{ paddingBottom: `${ratio * 100}%` }}>
          <CardCover post={post} profile={profile} />
        </div>

        {/* Body */}
        <div className="px-3 pt-2.5 pb-2">
          <div className="text-sm font-medium text-primary leading-snug line-clamp-2 mb-2">
            {post.title}
          </div>
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-1.5 min-w-0"
              onClick={e => { e.stopPropagation(); onOpenProfile(post.author) }}
            >
              <Avatar
                authorId={post.author}
                name={name}
                color={color}
                personaType={profile?.personaType}
                size={20}
              />
              <span className="text-xs text-secondary truncate">{name}</span>
            </div>
            <button
              className="flex items-center gap-1 text-xs flex-shrink-0 transition-colors"
              style={{ color: isLiked ? '#ef4444' : undefined }}
              onClick={e => { e.stopPropagation(); onToggleLike(post.id) }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              {formatLikes(displayLikes)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  PostDetailModal
// ══════════════════════════════════════════════════════════════════
function PostDetailModal({ post, onClose, onOpenProfile, isLiked, isBookmarked, onToggleLike, onToggleBookmark, comments, onAddComment, onShare, navigate }) {
  const profile = profiles[post.author]
  const baseLikes = getLikes(post.id)
  const displayLikes = baseLikes + (isLiked ? 1 : 0)
  const color = profile ? profile.avatarColor : '#888'
  const name = profile ? profile.name : post.author
  const tag = profile ? profile.tag : ''
  const cfg = CARD_TYPE_CONFIG[post.cardType] || CARD_TYPE_CONFIG.teach
  // Merge preset comments (from characters) with user comments (from localStorage)
  const presetComments = (post.presetComments || []).map(c => ({
    ...c,
    isPreset: true,
    timestamp: c.timestamp || '2026-04-10T10:00:00Z'
  }))
  const userComments = comments[post.id] || []
  const postComments = [...presetComments, ...userComments]
  const [commentText, setCommentText] = useState('')
  const [mobileCommentText, setMobileCommentText] = useState('')
  const [mobileInputFocused, setMobileInputFocused] = useState(false)

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const authorClick = () => { onClose(); setTimeout(() => onOpenProfile(post.author), 300) }

  const kpRoute = buildKpRoute(post)
  const handleKpClick = (e) => {
    e.preventDefault()
    if (kpRoute) {
      onClose()
      setTimeout(() => navigate(kpRoute), 300)
    }
  }

  const handleSubmitComment = (text) => {
    const t = text.trim()
    if (!t) return
    onAddComment(post.id, t)
  }

  // Shared content blocks
  const coverBlock = (
    <div className="relative overflow-hidden min-h-[240px] md:min-h-[400px] md:flex-1">
      <CardCover post={post} profile={profile} isDetail />
    </div>
  )
  const titleBlock = <h2 className="text-lg font-bold text-text-primary mb-3 leading-snug">{post.title}</h2>
  const bodyBlock = <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line mb-4">{post.body}</div>
  const tagsBlock = post.tags && post.tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mb-4">
      {post.tags.map(t => (
        <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-forest/10 text-forest font-medium">{t}</span>
      ))}
    </div>
  )
  const kpBlock = post.kpLink && (
    <a href={kpRoute || '#'} className="inline-flex items-center gap-1.5 text-sm text-forest font-medium hover:underline mb-4" onClick={handleKpClick}>
      <BookIcon /> 查看完整知识点
    </a>
  )
  const ctaBlock = post.cta && (
    <div className="mt-4 p-4 rounded-xl bg-forest/5 border border-forest/10">
      <div className="text-xs text-text-secondary mb-1 font-medium">互动话题</div>
      <div className="text-sm text-text-primary">{post.cta}</div>
    </div>
  )

  const commentsBlock = (
    <div className="mt-6">
      <div className="text-sm font-semibold text-text-primary mb-3">共 {postComments.length} 条评论</div>
      {postComments.length === 0 && (
        <div className="text-xs text-text-secondary py-4 text-center">还没有评论，来说点什么吧</div>
      )}
      <div className="space-y-3">
        {[...postComments].reverse().map(c => {
          const displayName = c.isPreset ? (c.authorName || c.author) : (c.author || '匿名攀岩者')
          return (
          <div key={c.id} className="flex gap-2.5">
            {c.isPreset && c.author ? (
              <Avatar
                authorId={c.author}
                name={displayName}
                color={profiles[c.author]?.avatarColor || '#888'}
                personaType={profiles[c.author]?.personaType}
                size={28}
                className="mt-0.5"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-stone-border flex items-center justify-center text-[10px] text-text-secondary flex-shrink-0 mt-0.5">
                {'\u{1F9D7}'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-text-primary">{displayName}</span>
                <span className="text-[10px] text-text-secondary">{relativeTime(c.timestamp)}</span>
              </div>
              <div className="text-sm text-text-secondary mt-0.5">{c.text}</div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )

  const desktopCommentInput = (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="说点什么..."
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && commentText.trim()) {
            handleSubmitComment(commentText)
            setCommentText('')
          }
        }}
        className="flex-1 h-9 px-4 rounded-full bg-stone-bg border border-stone-border text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-forest/30"
      />
      <button
        onClick={() => { if (commentText.trim()) { handleSubmitComment(commentText); setCommentText('') } }}
        className="px-4 h-9 rounded-full bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors flex-shrink-0"
      >
        发送
      </button>
    </div>
  )

  const actionButtons = (
    <>
      <button
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: isLiked ? '#ef4444' : undefined }}
        onClick={() => onToggleLike(post.id)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
        {formatLikes(displayLikes)}
      </button>
      <button
        className="flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: isBookmarked ? '#f59e0b' : undefined }}
        onClick={() => onToggleBookmark(post.id)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? '#f59e0b' : 'none'} stroke={isBookmarked ? '#f59e0b' : 'currentColor'} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        {isBookmarked ? '已收藏' : '收藏'}
      </button>
      <button className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-forest transition-colors">
        <CommentIcon /> {postComments.length || '评论'}
      </button>
      <button
        className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-forest transition-colors"
        onClick={() => onShare(post.id)}
      >
        <ShareIcon /> 分享
      </button>
    </>
  )

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* ═══ MOBILE (<md): full-screen, 3-layer layout ═══ */}
      <div className="md:hidden flex flex-col h-full bg-stone-card animate-slideUp">
        {/* Top bar: X + avatar + name + 关注 */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-stone-border shrink-0">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-bg flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <Avatar
            authorId={post.author}
            name={name}
            color={color}
            personaType={profile?.personaType}
            size={32}
            className="cursor-pointer"
            onClick={authorClick}
          />
          <div className="flex-1 min-w-0 cursor-pointer" onClick={authorClick}>
            <div className="text-sm font-semibold text-text-primary truncate">{name}</div>
          </div>
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-colors shrink-0">
            关注
          </button>
        </div>

        {/* Middle: scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {coverBlock}
          <div className="px-4 py-4">
            {titleBlock}
            {bodyBlock}
            {tagsBlock}
            {kpBlock}
            {ctaBlock}
            {commentsBlock}
          </div>
        </div>

        {/* Bottom bar: comment input + actions */}
        <div className="shrink-0 border-t border-stone-border bg-stone-card px-4 py-2.5 flex items-center gap-3">
          {mobileInputFocused ? (
            <>
              <input
                type="text"
                autoFocus
                placeholder="说点什么..."
                value={mobileCommentText}
                onChange={e => setMobileCommentText(e.target.value)}
                onBlur={() => { if (!mobileCommentText.trim()) setMobileInputFocused(false) }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && mobileCommentText.trim()) {
                    handleSubmitComment(mobileCommentText)
                    setMobileCommentText('')
                    setMobileInputFocused(false)
                  }
                }}
                className="flex-1 h-9 px-4 rounded-full bg-stone-bg border border-stone-border text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              <button
                onClick={() => { if (mobileCommentText.trim()) { handleSubmitComment(mobileCommentText); setMobileCommentText(''); setMobileInputFocused(false) } }}
                className="px-3 h-9 rounded-full bg-forest text-white text-sm font-medium shrink-0"
              >
                发送
              </button>
            </>
          ) : (
            <>
              <div
                className="flex-1 h-9 px-4 rounded-full bg-stone-bg text-sm text-text-secondary flex items-center cursor-text"
                onClick={() => setMobileInputFocused(true)}
              >
                说点什么...
              </div>
              {actionButtons}
            </>
          )}
        </div>
      </div>

      {/* ═══ DESKTOP (≥md): centered modal, left-right layout ═══ */}
      <div className="hidden md:flex items-center justify-center w-full h-full">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
        <div className="relative bg-stone-card rounded-2xl overflow-hidden shadow-2xl w-[95vw] max-w-[900px] max-h-[90vh] flex flex-row z-10 animate-scaleIn">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors text-lg"
          >
            &times;
          </button>

          {/* Left: cover + actions */}
          <div className="w-[45%] flex-shrink-0 flex flex-col">
            {coverBlock}
            <div className="flex items-center justify-around py-3 border-t border-stone-border">
              {actionButtons}
            </div>
          </div>

          {/* Right: content */}
          <div className="flex-1 overflow-y-auto p-6 border-l border-stone-border">
            <div className="flex items-center gap-3 mb-5">
              <Avatar
                authorId={post.author}
                name={name}
                color={color}
                personaType={profile?.personaType}
                size={40}
                className="cursor-pointer"
                onClick={authorClick}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary cursor-pointer hover:underline" onClick={authorClick}>{name}</div>
                <div className="text-xs text-text-secondary">{tag}</div>
              </div>
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-colors">
                关注
              </button>
            </div>
            {titleBlock}
            {bodyBlock}
            {tagsBlock}
            {kpBlock}
            {ctaBlock}
            {commentsBlock}
            {desktopCommentInput}
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  ProfileModal
// ══════════════════════════════════════════════════════════════════
function ProfileModal({ authorId, onClose, onOpenDetail, likes, onToggleLike }) {
  const profile = profiles[authorId]
  const authorPosts = useMemo(() => shuffledPosts.filter(p => p.author === authorId), [authorId])
  const color = profile ? profile.avatarColor : '#888'

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!profile) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-stone-card rounded-2xl overflow-hidden shadow-2xl w-[95vw] max-w-[480px] max-h-[90vh] overflow-y-auto z-10 animate-scaleIn">
        {/* Banner */}
        <div className="relative h-28" style={{ background: coverGradient(color, 'teach') }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors text-lg"
          >
            &times;
          </button>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <Avatar
              authorId={authorId}
              name={profile.name}
              color={color}
              personaType={profile.personaType}
              size={64}
              className="border-4 border-stone-card"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-12 px-5 pb-2 text-center">
          <div className="text-base font-bold text-primary">{profile.name}</div>
          <div className="text-xs text-secondary mt-1">{profile.tag}</div>
          <div className="flex items-center justify-center gap-8 mt-4">
            <div>
              <div className="text-base font-bold text-primary">{profile.followers}</div>
              <div className="text-xs text-secondary">关注者</div>
            </div>
            <div>
              <div className="text-base font-bold text-primary">{profile.postCount}</div>
              <div className="text-xs text-secondary">帖子</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-5 py-3 text-sm text-secondary leading-relaxed">{profile.bio}</div>

        {/* Hashtags */}
        {profile.hashtags && profile.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {profile.hashtags.map(h => (
              <span key={h} className="px-2.5 py-1 rounded-full text-xs bg-forest/10 text-forest font-medium">
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Pinned post */}
        {profile.pinnedPost && (
          <div className="mx-5 mb-3 p-3 rounded-xl bg-forest/5 border border-forest/10">
            <div className="text-xs text-secondary mb-1 font-medium">{'\u{1F4CC}'} 置顶</div>
            <div className="text-sm text-primary">{profile.pinnedPost}</div>
          </div>
        )}

        {/* Posts grid */}
        {authorPosts.length > 0 && (
          <div className="px-5 pb-5">
            <div className="text-sm font-semibold text-text-primary mb-3">全部帖子 ({authorPosts.length})</div>
            <div className="columns-2 gap-3">
              {authorPosts.map(p => (
                <FeedCard
                  key={p.id}
                  post={p}
                  onOpenDetail={(post) => { onClose(); setTimeout(() => onOpenDetail(post), 300) }}
                  onOpenProfile={() => {}}
                  isLiked={likes.has(p.id)}
                  onToggleLike={onToggleLike}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
//  FeedPage — Main export
// ══════════════════════════════════════════════════════════════════
export default function FeedPage() {
  const context = useOutletContext() || {}
  const { onOpenAuth } = context
  const navigate = useNavigate()

  const [currentTab, setCurrentTab] = useState('推荐')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Interactive state
  const [likes, setLikes] = useState(() => loadSet(LIKES_KEY))
  const [bookmarks, setBookmarks] = useState(() => loadSet(BOOKMARKS_KEY))
  const [comments, setComments] = useState(() => loadComments())
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  // Live viewed set (updates instantly → controls opacity marker)
  const [viewed, setViewed] = useState(() => loadSet(VIEWED_KEY))
  // Snapshot taken once at mount (controls sort order; frozen for the session)
  const viewedSnapshot = useRef(null)
  if (viewedSnapshot.current === null) {
    viewedSnapshot.current = new Set(loadSet(VIEWED_KEY))
  }

  const markViewed = useCallback((postId) => {
    setViewed(prev => {
      if (prev.has(postId)) return prev
      const next = new Set(prev)
      next.add(postId)
      saveSet(VIEWED_KEY, next)
      return next
    })
  }, [])

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }, [])

  const toggleLike = useCallback((postId) => {
    setLikes(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      saveSet(LIKES_KEY, next)
      return next
    })
  }, [])

  const toggleBookmark = useCallback((postId) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      saveSet(BOOKMARKS_KEY, next)
      return next
    })
  }, [])

  const addComment = useCallback((postId, text) => {
    setComments(prev => {
      const next = { ...prev }
      if (!next[postId]) next[postId] = []
      next[postId] = [...next[postId], {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        text,
        timestamp: Date.now(),
        author: '匿名攀岩者',
      }]
      saveComments(next)
      return next
    })
  }, [])

  const handleShare = useCallback((postId) => {
    const url = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(url).then(() => {
      showToast('链接已复制')
    }).catch(() => {
      showToast('复制失败，请手动复制')
    })
  }, [showToast])

  const tabsRef = useRef(null)

  // Filtered posts (all matching). Unread posts first, read-at-mount go to bottom.
  // We use viewedSnapshot (frozen at mount) so cards don't jump around during the session
  // as the user clicks them — they only resettle on refresh.
  const filteredPosts = useMemo(() => {
    let filtered = shuffledPosts
    const tab = TABS.find(t => t.label === currentTab)
    if (tab && tab.filter) {
      filtered = filtered.filter(tab.filter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p => {
        const authorProfile = profiles[p.author]
        const authorName = authorProfile ? authorProfile.name.toLowerCase() : ''
        const tags = (p.tags || []).join(' ').toLowerCase()
        const body = (p.body || '').toLowerCase()
        return p.title.toLowerCase().includes(q)
          || body.includes(q)
          || tags.includes(q)
          || authorName.includes(q)
      })
    }
    const snap = viewedSnapshot.current
    const unread = []
    const read = []
    for (const p of filtered) {
      if (snap.has(p.id)) read.push(p)
      else unread.push(p)
    }
    return [...unread, ...read]
  }, [currentTab, searchQuery])



  const handleOpenDetail = useCallback((post) => {
    setSelectedPost(post)
    markViewed(post.id)
  }, [markViewed])

  const handleCloseDetail = useCallback(() => {
    setSelectedPost(null)
  }, [])

  const handleOpenProfile = useCallback((authorId) => {
    setSelectedProfile(authorId)
  }, [])

  const handleCloseProfile = useCallback(() => {
    setSelectedProfile(null)
  }, [])

  return (
    <div className="min-h-screen bg-stone-bg">
      {/* Search Bar */}
      <div
        className={`sticky top-0 z-40 bg-stone-bg/80 backdrop-blur-xl px-4 py-3 transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_12px_-6px_rgba(0,0,0,0.12)]' : ''
        }`}
      >
        <div className="relative max-w-xl mx-auto">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="搜索帖子..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-stone-card border border-stone-border text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-forest/30 transition-all"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-stone-bg">
        <div
          ref={tabsRef}
          className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${currentTab === tab.label
                  ? 'bg-forest text-white shadow-sm'
                  : 'text-text-secondary hover:bg-stone-sidebar'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="px-3 md:px-4 py-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">
            <div className="text-4xl mb-3">{'\u{1F50D}'}</div>
            <div className="text-sm">没有找到相关帖子</div>
          </div>
        ) : (
          <>
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 mx-auto max-w-[1800px]">
              {filteredPosts.map((post, i) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  index={i}
                  onOpenDetail={handleOpenDetail}
                  onOpenProfile={handleOpenProfile}
                  isLiked={likes.has(post.id)}
                  onToggleLike={toggleLike}
                  isViewed={viewed.has(post.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={handleCloseDetail}
          onOpenProfile={handleOpenProfile}
          isLiked={likes.has(selectedPost.id)}
          isBookmarked={bookmarks.has(selectedPost.id)}
          onToggleLike={toggleLike}
          onToggleBookmark={toggleBookmark}
          comments={comments}
          onAddComment={addComment}
          onShare={handleShare}
          navigate={navigate}
        />
      )}

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          authorId={selectedProfile}
          onClose={handleCloseProfile}
          onOpenDetail={handleOpenDetail}
          likes={likes}
          onToggleLike={toggleLike}
        />
      )}
    </div>
  )
}
