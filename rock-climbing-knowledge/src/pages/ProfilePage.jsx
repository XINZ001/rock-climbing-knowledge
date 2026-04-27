import { useState, useEffect } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import PageSEO from '../components/PageSEO'
import { getDiagnosisHistory } from '../lib/diagnosis'
import { supabase } from '../lib/supabase'
import {
  createFeedComment,
  fetchFeedComments,
  fetchMyFeedActivity,
  toggleFeedBookmark,
  toggleFeedLike,
} from '../lib/community'
import { fetchQuestProgress, loadLocalQuestProgress } from '../lib/questProgress'
import diagnosisTree from '../data/diagnosis-tree.json'
import questData from '../data/quests.json'
import feedPosts from '../data/feed-registry.json'
import feedProfiles from '../data/profiles-registry.json'
import { FeedCard, PostDetailModal } from './FeedPage'

const personaMap = Object.fromEntries(
  (diagnosisTree.personas || []).map((p) => [p.id, p])
)

const feedPostMap = Object.fromEntries(feedPosts.map((post) => [post.id, post]))

function formatActivityDate(value, lang) {
  if (!value) return ''
  return new Date(value).toLocaleDateString(
    lang === 'zh' ? 'zh-CN' : lang === 'ko' ? 'ko-KR' : 'en-US',
    { month: 'short', day: 'numeric' }
  )
}

function normalizeFeedComment(comment) {
  return {
    id: comment.id,
    text: comment.content,
    timestamp: comment.created_at,
    author: comment.profiles?.username || '攀岩者',
  }
}

function CommentActivityItem({ post, item, tab, lang }) {
  const author = feedProfiles[post?.author]
  const authorName = author?.name || post?.author || '攀岩知识库'
  const metaText = tab.type === 'bookmarks'
    ? (lang === 'zh' ? '收藏于' : lang === 'en' ? 'Saved' : '저장')
    : tab.type === 'likes'
      ? (lang === 'zh' ? '点赞于' : lang === 'en' ? 'Liked' : '좋아요')
      : (lang === 'zh' ? '评论于' : lang === 'en' ? 'Commented' : '댓글')

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center gap-2 text-xs text-text-secondary">
        <span>{tab.icon}</span>
        <span>{metaText}</span>
        <span>·</span>
        <span>{formatActivityDate(item.created_at, lang)}</span>
      </div>
      {tab.type === 'comments' && item.content && (
        <p className="mb-3 line-clamp-2 rounded-xl bg-stone-bg/80 px-3 py-2 text-xs text-text-secondary">
          {item.content}
        </p>
      )}
      <div className="rounded-2xl border border-stone-border bg-stone-bg/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: author?.avatarColor || '#4A7C59' }}
          >
            {authorName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-text-primary">{authorName}</div>
            {author?.tag && <div className="truncate text-[11px] text-text-secondary">{author.tag}</div>}
          </div>
        </div>
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
          {post?.title || item.post_id}
        </div>
        {post?.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-stone-card px-2 py-0.5 text-[10px] text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FeedActivityPanel({ tabs, activeType, onChange, lang, onOpenPost }) {
  const activeTab = tabs.find((tab) => tab.type === activeType) || tabs[0]
  const showPostCards = activeTab.type === 'bookmarks' || activeTab.type === 'likes'

  return (
    <div>
      <div className="mx-auto grid max-w-3xl grid-cols-3">
        {tabs.map((tab) => {
          const active = tab.type === activeTab.type
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() => onChange(tab.type)}
              className={`relative flex items-center justify-center gap-1.5 px-3 py-3 text-sm transition-colors ${
                active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className={active ? 'font-semibold' : 'font-medium'}>{tab.label}</span>
              <span className="text-xs text-text-secondary/70">{tab.items.length}</span>
              {active && <span className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-text-primary" />}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        {activeTab.items.length === 0 ? (
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-border bg-stone-card p-6 text-center">
          <p className="text-sm font-medium text-text-primary">{activeTab.emptyText}</p>
          <p className="mt-1 text-xs text-text-secondary">
            {lang === 'zh' ? '你在发现页的互动会同步到这里。' : lang === 'en' ? 'Your Discover activity will appear here.' : '발견 페이지의 활동이 여기에 표시돼요.'}
          </p>
        </div>
      ) : showPostCards ? (
        <div className="px-3 py-4 md:px-4">
          <div className="mx-auto max-w-[1800px] columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 xl:columns-5">
            {activeTab.items.slice(0, 12).map((item, index) => {
              const post = feedPostMap[item.post_id]
              if (!post) return null
              return (
                <FeedCard
                  key={item.id || `${activeTab.type}-${item.post_id}`}
                  post={post}
                  index={index}
                  onOpenDetail={() => onOpenPost(item.post_id)}
                  onOpenProfile={() => {}}
                  isLiked={activeTab.likedPosts?.has(post.id)}
                  onToggleLike={activeTab.onToggleLike}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4">
          {activeTab.items.slice(0, 12).map((item) => {
            const post = feedPostMap[item.post_id]
            return (
              <button
                key={item.id || `${activeTab.type}-${item.post_id}`}
                type="button"
                onClick={() => onOpenPost(item.post_id)}
                className="flex w-full gap-3 rounded-2xl border border-stone-border bg-stone-card p-4 text-left shadow-sm transition-colors hover:bg-stone-bg/70"
              >
                <CommentActivityItem post={post} item={item} tab={activeTab} lang={lang} />
                <div className="pt-1 text-text-secondary">
                  <Icon name="chevronRight" size={14} />
                </div>
              </button>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}

function ProfileActivitySkeleton() {
  return (
    <div className="px-3 py-1 md:px-4">
      <div className="mx-auto mb-5 grid max-w-3xl grid-cols-3 gap-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2">
            <div className="h-4 w-14 animate-pulse rounded-full bg-stone-border/70" />
            <div className="h-0.5 w-10 rounded-full bg-stone-border/60" />
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-[1800px] columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 xl:columns-5">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="mb-3 break-inside-avoid overflow-hidden rounded-xl bg-stone-card shadow-sm md:mb-4">
            <div className={`animate-pulse bg-stone-border/60 ${item % 3 === 0 ? 'h-52' : item % 3 === 1 ? 'h-40' : 'h-64'}`} />
            <div className="space-y-2 px-3 py-3">
              <div className="h-3.5 w-full animate-pulse rounded-full bg-stone-border/70" />
              <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-stone-border/60" />
              <div className="mt-3 flex items-center justify-between">
                <div className="h-5 w-24 animate-pulse rounded-full bg-stone-border/60" />
                <div className="h-4 w-10 animate-pulse rounded-full bg-stone-border/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GradeMedal({ grade }) {
  return (
    <div className="profile-grade-medal relative isolate inline-flex overflow-hidden rounded-full border border-[#f0cf7a]/90 bg-[linear-gradient(145deg,#744914_0%,#bd8626_34%,#f6d978_58%,#9a6519_100%)] px-3 py-1 text-sm font-black leading-none text-[#2d1a05] shadow-[0_8px_24px_rgba(190,125,22,0.36)]">
      <div className="absolute inset-px rounded-full border border-white/15" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent_42%,rgba(0,0,0,0.18))]" />
      <span className="relative drop-shadow-[0_1px_0_rgba(255,238,184,0.42)]">{grade}</span>
    </div>
  )
}

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const { lang } = useApp()
  const navigate = useNavigate()
  const outletCtx = useOutletContext() || {}
  const onOpenAuth = outletCtx.onOpenAuth
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [feedActivity, setFeedActivity] = useState({ likes: [], bookmarks: [], comments: [] })
  const [activeActivityType, setActiveActivityType] = useState('bookmarks')
  const [feedLikes, setFeedLikes] = useState(() => new Set())
  const [feedBookmarks, setFeedBookmarks] = useState(() => new Set())
  const [feedComments, setFeedComments] = useState({})
  const [selectedFeedPost, setSelectedFeedPost] = useState(null)
  const [questProgress, setQuestProgress] = useState(loadLocalQuestProgress)
  const [climbingProfile, setClimbingProfile] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const tt = (zh, en, ko) => lang === 'zh' ? zh : lang === 'en' ? en : ko

  useEffect(() => {
    if (!user) return
    getDiagnosisHistory().then(({ data }) => {
      setHistory(data || [])
      setLoading(false)
    })
    fetchMyFeedActivity().then(({ data }) => {
      const nextActivity = data || { likes: [], bookmarks: [], comments: [] }
      setFeedActivity(nextActivity)
      setFeedLikes(new Set(nextActivity.likes.map((item) => item.post_id)))
      setFeedBookmarks(new Set(nextActivity.bookmarks.map((item) => item.post_id)))
      setActivityLoading(false)
    })
    fetchQuestProgress().then(({ data }) => {
      setQuestProgress(data || {})
    })
    supabase
      .from('climbing_profiles')
      .select('gender, boulder_grade, sport_grade')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setClimbingProfile(data || null)
      })
  }, [user])

  if (!user) {
    const features = [
      { icon: '🧗', title: tt('攀岩档案', 'Climbing Profile', '클라이밍 프로필'), desc: tt('保存你的等级、目标、偏好和训练背景', 'Save your level, goals, preferences, and training context', '레벨, 목표, 선호도 저장') },
      { icon: '🐒', title: tt('能力诊断与人格', 'Diagnosis & Persona', '진단과 퍼소나'), desc: tt('记录测试结果，持续追踪你的瓶颈和学习路径', 'Keep diagnosis results and track your learning path', '진단 결과와 학습 경로 저장') },
      { icon: '🎯', title: tt('每日微任务', 'Daily Quests', '데일리 퀘스트'), desc: tt('保存完成记录，解锁成就卡并累计升级', 'Save completions, unlock cards, and level up over time', '완료 기록과 성취 카드 저장') },
      { icon: '🩹', title: tt('伤痛档案', 'Injury Log', '부상 기록'), desc: tt('记录受伤与恢复过程，形成自己的安全记录', 'Log injuries and recovery as your personal safety record', '부상과 회복 기록') },
    ]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fadeIn">
        <div className="w-full max-w-md text-center">
          {/* Hero */}
          <div className="relative mx-auto w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center shadow-lg shadow-forest/20">
            <Icon name="user" size={42} className="text-white" />
            <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber flex items-center justify-center text-white text-sm font-bold">✓</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">
            {tt('登录后开启你的个人主页', 'Sign in to open your personal page', '로그인 후 마이페이지 열기')}
          </h1>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            {tt('诊断、任务、伤痛记录和个人设置都会归到这里。登录后，你的训练线索才会被持续保存。', 'Diagnosis, quests, injury logs, and settings all live here. Sign in to keep your climbing progress saved.', '진단, 퀘스트, 부상 기록과 설정을 이곳에 저장하세요.')}
          </p>

          {/* Feature list */}
          <div className="grid gap-2.5 mb-8 text-left">
            {features.map(f => (
              <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-stone-card border border-stone-border">
                <span className="text-2xl leading-none pt-0.5">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text-primary">{f.title}</div>
                  <div className="text-xs text-text-secondary leading-snug mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenAuth}
            className="w-full h-12 rounded-full bg-forest hover:bg-forest-dark text-stone-950 text-sm font-semibold shadow-md shadow-forest/20 btn-press transition-colors"
          >
            {tt('登录 / 注册并保存进度', 'Sign in / Sign up to save progress', '로그인 / 회원가입 후 저장')}
          </button>

          {/* Secondary */}
          <Link
            to="/"
            className="inline-block mt-4 text-xs text-text-secondary hover:text-forest transition-colors"
          >
            {tt('先去发现页逛逛 →', 'Browse Discover first →', '먼저 둘러보기 →')}
          </Link>
        </div>
      </div>
    )
  }

  const displayName = profile?.username || tt('攀岩者', 'Climber', '클라이머')
  const primaryGrade = climbingProfile?.boulder_grade || climbingProfile?.sport_grade || tt('未设置', 'Unset', '미설정')
  const profileHeroImage = climbingProfile?.gender === 'female'
    ? '/images/knowledge-modules/technique.webp'
    : '/images/hero/learn-indoor-overhang-bg.png'
  const questStats = {
    completed: questData.quests.filter(q => (questProgress[q.id]?.times || 0) >= 1).length,
    totalCompletions: questData.quests.reduce((sum, q) => sum + (questProgress[q.id]?.times || 0), 0),
  }
  const latestPersona = history[0]?.persona_id ? personaMap[history[0].persona_id] : null
  const openFeedPost = async (postId) => {
    const post = feedPostMap[postId]
    if (!post) return
    setSelectedFeedPost(post)

    const { data } = await fetchFeedComments(postId)
    setFeedComments((prev) => ({
      ...prev,
      [postId]: (data || []).map(normalizeFeedComment),
    }))
  }

  const handleFeedLike = async (postId) => {
    const { liked, error } = await toggleFeedLike(postId)
    if (error) return
    setFeedLikes((prev) => {
      const next = new Set(prev)
      if (liked) next.add(postId)
      else next.delete(postId)
      return next
    })
    setFeedActivity((prev) => ({
      ...prev,
      likes: liked
        ? [{ post_id: postId, created_at: new Date().toISOString() }, ...prev.likes.filter((item) => item.post_id !== postId)]
        : prev.likes.filter((item) => item.post_id !== postId),
    }))
  }

  const handleFeedBookmark = async (postId) => {
    const { bookmarked, error } = await toggleFeedBookmark(postId)
    if (error) return
    setFeedBookmarks((prev) => {
      const next = new Set(prev)
      if (bookmarked) next.add(postId)
      else next.delete(postId)
      return next
    })
    setFeedActivity((prev) => ({
      ...prev,
      bookmarks: bookmarked
        ? [{ post_id: postId, created_at: new Date().toISOString() }, ...prev.bookmarks.filter((item) => item.post_id !== postId)]
        : prev.bookmarks.filter((item) => item.post_id !== postId),
    }))
  }

  const handleFeedComment = async (postId, text) => {
    const { data, error } = await createFeedComment(postId, text)
    if (error || !data) return
    setFeedComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), normalizeFeedComment(data)],
    }))
    setFeedActivity((prev) => ({
      ...prev,
      comments: [
        { id: data.id, post_id: postId, content: data.content, created_at: data.created_at },
        ...prev.comments.filter((item) => item.id !== data.id),
      ],
    }))
  }

  const handleFeedShare = (postId) => {
    const post = feedPostMap[postId]
    const url = `${window.location.origin}/?post=${encodeURIComponent(postId)}`
    const shareText = post?.title ? `${post.title}\n${url}` : url
    navigator.clipboard?.writeText(shareText)
  }

  const handleSignOut = async () => {
    await signOut()
    setProfileMenuOpen(false)
    navigate('/')
  }

  const activityTabs = [
    {
      type: 'bookmarks',
      icon: '★',
      label: tt('收藏', 'Saved', '저장'),
      emptyText: tt('还没有收藏', 'No saved posts yet', '저장한 글이 없어요'),
      items: feedActivity.bookmarks,
      likedPosts: feedLikes,
      onToggleLike: handleFeedLike,
    },
    {
      type: 'likes',
      icon: '♥',
      label: tt('点赞', 'Liked', '좋아요'),
      emptyText: tt('还没有点赞', 'No likes yet', '좋아요한 글이 없어요'),
      items: feedActivity.likes,
      likedPosts: feedLikes,
      onToggleLike: handleFeedLike,
    },
    {
      type: 'comments',
      icon: '↩',
      label: tt('评论', 'Comments', '댓글'),
      actionText: tt('你评论了这条内容', 'You commented on this post', '댓글을 남긴 글'),
      emptyText: tt('还没有评论', 'No comments yet', '댓글이 없어요'),
      items: feedActivity.comments,
    },
  ]

  return (
    <div className="relative mx-auto w-full py-8 lg:pt-20">
      <PageSEO
        title={tt('个人主页', 'My Profile', '마이페이지')}
        path="/profile"
      />

      <div className="mx-auto max-w-3xl px-4">
        <section className="relative mb-6">
          <div className="relative overflow-hidden rounded-3xl border border-stone-border bg-stone-card shadow-sm">
            <img
              src={profileHeroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/35 to-stone-bg/80" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-card/95 to-transparent" />
            <div className="relative flex min-h-44 items-end px-5 pb-5 pt-20 text-left">
              <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white drop-shadow-sm">{displayName}</h1>
                <GradeMedal grade={primaryGrade} />
              </div>
              <p className="mt-1 text-xs text-white/75">{user.email}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/30"
            aria-label={tt('打开个人菜单', 'Open profile menu', '프로필 메뉴 열기')}
          >
            <span className="flex flex-col items-center justify-center gap-1" aria-hidden="true">
              <span className="h-0.5 w-4 rounded-full bg-current" />
              <span className="h-0.5 w-4 rounded-full bg-current" />
              <span className="h-0.5 w-4 rounded-full bg-current" />
            </span>
          </button>
          {profileMenuOpen && (
            <div className="absolute right-4 top-16 z-30 w-52 overflow-hidden rounded-2xl border border-stone-border bg-stone-card text-left shadow-xl">
              <Link
                to="/climbing-profile"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-4 py-3 text-sm transition-colors hover:bg-stone-bg"
              >
                <div className="font-medium text-text-primary">{tt('攀岩档案', 'Profile', '프로필')}</div>
                <div className="mt-0.5 text-xs text-text-secondary">{tt('等级、目标和偏好', 'Level, goals, and preferences', '레벨, 목표와 선호도')}</div>
              </Link>
              <Link
                to="/diagnosis"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-4 py-3 text-sm transition-colors hover:bg-stone-bg"
              >
                <div className="font-medium text-text-primary">{latestPersona ? (latestPersona.name[lang] || latestPersona.name.zh) : tt('人格测试', 'Persona', '유형 테스트')}</div>
                <div className="mt-0.5 text-xs text-text-secondary">{loading ? tt('加载中', 'Loading', '로딩 중') : tt(`${history.length} 次记录`, `${history.length} records`, `${history.length}개 기록`)}</div>
              </Link>
              <Link
                to="/quests"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-4 py-3 text-sm transition-colors hover:bg-stone-bg"
              >
                <div className="font-medium text-text-primary">{tt('任务图鉴', 'Quests', '퀘스트')}</div>
                <div className="mt-0.5 text-xs text-text-secondary">{tt(`${questStats.completed} 个 · ${questStats.totalCompletions} 次`, `${questStats.completed} done · ${questStats.totalCompletions}x`, `${questStats.completed}개 · ${questStats.totalCompletions}회`)}</div>
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-4 py-3 text-sm transition-colors hover:bg-stone-bg"
              >
                <div className="font-medium text-text-primary">{tt('个人设置', 'Settings', '설정')}</div>
                <div className="mt-0.5 text-xs text-text-secondary">{tt('账号与偏好设置', 'Account and preferences', '계정과 설정')}</div>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full border-t border-stone-border px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors hover:bg-stone-bg"
              >
                {tt('退出登录', 'Sign out', '로그아웃')}
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="mb-6">
          {activityLoading ? (
            <ProfileActivitySkeleton />
          ) : feedActivity.likes.length + feedActivity.bookmarks.length + feedActivity.comments.length === 0 ? (
            <Link
              to="/"
              className="mx-auto block max-w-3xl rounded-2xl border-2 border-dashed border-stone-border p-8 text-center transition-colors hover:border-forest/30"
            >
              <div className="mb-3 text-4xl">🧗</div>
              <p className="mb-1 text-sm font-medium">
                {tt('还没有互动记录', "You don't have activity yet", '아직 활동 기록이 없어요')}
              </p>
              <p className="text-xs text-text-secondary">
                {tt('去发现页点赞、收藏或评论内容后，会出现在这里', 'Like, save, or comment on Discover posts to see them here', '발견 페이지에서 좋아요, 저장, 댓글을 남기면 여기에 표시돼요')}
              </p>
            </Link>
          ) : (
            <FeedActivityPanel
              tabs={activityTabs}
              activeType={activeActivityType}
              onChange={setActiveActivityType}
              lang={lang}
              onOpenPost={openFeedPost}
            />
          )}
      </section>

      {selectedFeedPost && (
        <PostDetailModal
          post={selectedFeedPost}
          onClose={() => setSelectedFeedPost(null)}
          onOpenProfile={() => {}}
          isLiked={feedLikes.has(selectedFeedPost.id)}
          isBookmarked={feedBookmarks.has(selectedFeedPost.id)}
          onToggleLike={handleFeedLike}
          onToggleBookmark={handleFeedBookmark}
          comments={feedComments}
          onAddComment={handleFeedComment}
          onShare={handleFeedShare}
          navigate={navigate}
        />
      )}
    </div>
  )
}
