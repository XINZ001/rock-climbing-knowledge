import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'
import ScrollToTop from '../ui/ScrollToTop'
import AuthModal from '../auth/AuthModal'

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

function FlaskIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4 20h16l-6-10.5V3" />
      <path d="M7 16h10" />
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

function SearchIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function DumbbellIcon({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11" />
      <rect x="2" y="4.5" width="4" height="15" rx="1.5" />
      <rect x="18" y="4.5" width="4" height="15" rx="1.5" />
      <rect x="6.5" y="8" width="11" height="8" rx="1" />
    </svg>
  )
}

/* ── Nav configuration ────────────────────────────────── */

const navItems = [
  { label: '发现', path: '/', icon: CompassIcon },
  { label: '学', path: '/learn', icon: BookIcon },
  { label: '练', path: '/train', icon: DumbbellIcon },
]

/* ── Helper: is a nav item active? ────────────────────── */

function isActive(itemPath, currentPath) {
  if (itemPath === '/') return currentPath === '/'
  if (itemPath === '/learn') {
    return currentPath.startsWith('/learn') || currentPath.startsWith('/section') || currentPath.startsWith('/articles') || currentPath.startsWith('/hall-of-fame') || currentPath.startsWith('/search')
  }
  if (itemPath === '/train') {
    return currentPath.startsWith('/train') || currentPath.startsWith('/injuries')
  }
  return currentPath.startsWith(itemPath)
}

/* ── Main Layout ──────────────────────────────────────── */

export default function FeedLayout() {
  const [authOpen, setAuthOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-stone-bg">
      {/* ── Left Sidebar (desktop ≥1024px) ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[180px] flex-col bg-stone-sidebar border-r border-stone-border z-30">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-4 h-14 text-text-primary font-semibold text-base no-underline shrink-0">
          🪨 攀岩社区
        </Link>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-3 pt-2">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path, location.pathname)
            return (
              <Link
                key={path}
                to={path}
                className={`h-12 rounded-xl flex items-center gap-3 px-4 no-underline transition-colors ${
                  active
                    ? 'bg-forest-light text-forest font-semibold'
                    : 'text-text-secondary hover:bg-stone-bg'
                }`}
              >
                <Icon className="shrink-0" />
                <span className="text-sm">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Theme toggle at bottom */}
        <div className="px-4 pb-4 shrink-0">
          <ThemeToggle />
        </div>
      </aside>


      {/* ── Main Content ── */}
      <main className="lg:ml-[180px] pb-14 lg:pb-0 min-h-screen bg-stone-bg">
        <Outlet context={{ onOpenAuth: () => setAuthOpen(true) }} />
      </main>

      {/* ── Bottom Bar (mobile <1024px) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-stone-card/90 backdrop-blur-lg border-t border-stone-border z-30 flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ label, path, icon: Icon }) => {
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
              <Icon className={`shrink-0 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
              <span className={`text-[10px] leading-tight transition-all ${active ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── Utilities ── */}
      <ScrollToTop />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  )
}
