import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import ScrollToTop from '../ui/ScrollToTop'
import AuthModal from '../auth/AuthModal'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../../utils/icons'
import UserAvatar from '../ui/UserAvatar'

/* ── Inline SVG Icons ─────────────────────────────────── */

function CompassIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.15" stroke="currentColor" />
    </svg>
  )
}

function BookIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}

/* ── Nav configuration ────────────────────────────────── */

const navItems = [
  { label: '知识库', path: '/', icon: BookIcon },
  { label: '发现', path: '/discover', icon: CompassIcon },
  { label: '我的', path: '/profile', icon: UserIcon },
]

const langOptions = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
]

/* ── Helper: is a nav item active? ────────────────────── */

function isActive(itemPath, currentPath) {
  if (itemPath === '/') {
    return currentPath === '/' || currentPath.startsWith('/learn') || currentPath.startsWith('/knowledge') || currentPath.startsWith('/section') || currentPath.startsWith('/articles') || currentPath.startsWith('/hall-of-fame') || currentPath.startsWith('/search')
  }
  if (itemPath === '/discover') {
    return currentPath.startsWith('/discover')
  }
  if (itemPath === '/profile') {
    return currentPath.startsWith('/profile') || currentPath.startsWith('/settings') || currentPath.startsWith('/climbing-profile')
  }
  return currentPath.startsWith(itemPath)
}

/* ── Main Layout ──────────────────────────────────────── */

export default function FeedLayout() {
  const [authOpen, setAuthOpen] = useState(false)
  const [topbarScrolled, setTopbarScrolled] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [feedSearchQuery, setFeedSearchQuery] = useState('')
  const languageMenuRef = useRef(null)
  const location = useLocation()
  const { lang, setLang } = useApp()
  const { user, profile } = useAuth()
  const showBottomNav = ['/', '/learn', '/discover', '/train', '/profile'].includes(location.pathname)
  const showTopMenu = location.pathname === '/' || location.pathname === '/learn' || location.pathname === '/discover' || location.pathname === '/profile'
  const topMenuVisibilityClass = location.pathname === '/discover'
    ? 'hidden md:block'
    : location.pathname === '/profile'
      ? 'hidden lg:block'
      : ''
  const showFeedSearch = location.pathname === '/discover'
  const topbarSolid = topbarScrolled || showFeedSearch || location.pathname === '/profile'

  useEffect(() => {
    const handleScroll = () => setTopbarScrolled(window.scrollY > 64)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setLanguageMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="min-h-screen bg-stone-bg">
      {showTopMenu && (
        <div
          className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${topMenuVisibilityClass} ${
            topbarSolid
              ? 'bg-stone-bg/88 shadow-[0_8px_24px_rgba(92,72,50,0.10)] backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <Link
              to="/"
              aria-label={lang === 'zh' ? '攀岩知识库首页' : lang === 'en' ? 'Climbing Knowledge Home' : '클라이밍 지식 홈'}
              className={`transition-all duration-300 ${
                topbarSolid
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-1 opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto'
              }`}
            >
              <img
                src="/images/logo/climbing-knowledge-logo-white.svg"
                alt=""
                aria-hidden="true"
                className="home-logo-mark h-7 w-auto"
              />
            </Link>

            <nav className="ml-6 hidden items-center gap-1 lg:flex">
              <Link
                to="/"
                className={`relative px-3 py-1.5 text-sm transition-colors hover:text-white ${
                  isActive('/', location.pathname)
                    ? 'font-semibold text-white'
                    : 'font-medium text-white/58'
                }`}
              >
                {lang === 'zh' ? '知识库' : lang === 'en' ? 'Knowledge' : '지식'}
              </Link>
              <Link
                to="/discover"
                className={`relative px-3 py-1.5 text-sm transition-colors hover:text-white ${
                  location.pathname === '/discover'
                    ? 'font-semibold text-white'
                    : 'font-medium text-white/58'
                }`}
              >
                {lang === 'zh' ? '发现' : lang === 'en' ? 'Discover' : '발견'}
              </Link>
            </nav>

            {showFeedSearch && (
              <div className="mx-4 hidden max-w-md flex-1 md:block">
                <div className="relative">
                  <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    value={feedSearchQuery}
                    onChange={(event) => setFeedSearchQuery(event.target.value)}
                    placeholder={lang === 'zh' ? '搜索帖子...' : lang === 'en' ? 'Search posts...' : '게시글 검색...'}
                    className="h-9 w-full rounded-full border border-stone-border bg-stone-card/80 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <div ref={languageMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen((open) => !open)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
                    topbarSolid
                      ? 'border border-stone-border bg-stone-card/70 text-text-primary hover:bg-stone-card'
                      : 'border border-white/15 bg-black/18 text-white/88 hover:bg-white/12'
                  }`}
                  aria-label={lang === 'zh' ? '切换语言' : lang === 'en' ? 'Change language' : '언어 변경'}
                >
                  <Icon name="globe" size={17} />
                </button>
                {languageMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-28 overflow-hidden rounded-xl border border-stone-border bg-stone-card shadow-lg">
                    {langOptions.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => {
                          setLang(option.code)
                          setLanguageMenuOpen(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                          option.code === lang
                            ? 'bg-stone-bg font-semibold text-text-primary'
                            : 'text-text-secondary hover:bg-stone-bg hover:text-text-primary'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {user ? (
                <Link
                  to="/profile"
                  className={`flex h-9 items-center gap-2 rounded-full border px-2.5 pr-3 text-sm font-medium backdrop-blur-md transition-colors ${
                    topbarSolid
                      ? 'border-stone-border bg-stone-card/70 text-text-primary hover:bg-stone-card'
                      : 'border-white/15 bg-black/18 text-white/88 hover:bg-white/12'
                  }`}
                >
                  <UserAvatar name={profile?.username || (lang === 'zh' ? '攀岩者' : lang === 'en' ? 'Climber' : '클라이머')} size={24} />
                  <span className="hidden sm:inline max-w-[86px] truncate">
                    {profile?.username || (lang === 'zh' ? '我的' : lang === 'en' ? 'Me' : '나')}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className={`h-9 rounded-full border px-4 text-sm font-semibold backdrop-blur-md transition-colors ${
                    topbarSolid
                      ? 'border-stone-border bg-stone-card/80 text-text-primary hover:bg-stone-card'
                      : 'border-white/15 bg-black/18 text-white/90 hover:bg-white/12'
                  }`}
                >
                  {lang === 'zh' ? '登录 / 注册' : lang === 'en' ? 'Sign in' : '로그인'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── Main Content ── */}
      <main className={`${showBottomNav ? 'pb-14' : 'pb-0'} lg:pb-0 min-h-screen bg-stone-bg`}>
        <Outlet context={{ onOpenAuth: () => setAuthOpen(true), feedSearchQuery, setFeedSearchQuery }} />
      </main>

      {/* ── Bottom Bar (mobile <1024px) ── */}
      {showBottomNav && (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-stone-card/90 backdrop-blur-lg border-t border-stone-border z-30 flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ label, path, icon }) => {
          const active = isActive(path, location.pathname)
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 no-underline transition-colors btn-press ${
                active ? 'text-forest' : 'text-text-secondary'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-forest rounded-full" />
              )}
              {icon({ className: `shrink-0 transition-transform duration-200 ${active ? 'scale-110' : ''}` })}
              <span className={`text-[10px] leading-tight transition-all ${active ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          )
        })}
      </nav>
      )}

      {/* ── Utilities ── */}
      <ScrollToTop />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  )
}
