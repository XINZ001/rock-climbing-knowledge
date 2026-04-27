import { useState, useEffect, useCallback, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import ScrollToTop from '../ui/ScrollToTop'
import AuthModal from '../auth/AuthModal'

// Routes where the knowledge-scope sidebar is relevant.
// Other pages wrapped by Layout (settings, climbing-profile, quests, diagnosis…) don't get it.
const KNOWLEDGE_SCOPE_PREFIXES = [
  '/knowledge',
  '/knowledge-index',
  '/section',
  '/search',
]

function isKnowledgeScopePath(pathname) {
  return KNOWLEDGE_SCOPE_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
}

export default function Layout() {
  const location = useLocation()
  const showSidebar = useMemo(() => isKnowledgeScopePath(location.pathname), [location.pathname])

  // Mobile sidebar is a bottom sheet triggered by the hamburger.
  // Desktop sidebar is always-open when in knowledge scope (no toggle).
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [headerSaveAction, setHeaderSaveAction] = useState(null)

  const closeSheet = useCallback(() => setMobileSheetOpen(false), [])

  // Auto-close mobile sheet on route change
  useEffect(() => {
    Promise.resolve().then(() => setMobileSheetOpen(false))
  }, [location.pathname])

  // Lock body scroll while mobile sheet is open
  useEffect(() => {
    if (mobileSheetOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [mobileSheetOpen])

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onToggleSidebar={() => setMobileSheetOpen(v => !v)}
        onCloseSidebar={closeSheet}
        onOpenAuth={() => setAuthOpen(true)}
        sidebarOpen={mobileSheetOpen}
        showMobileMenu={showSidebar}
        saveAction={headerSaveAction}
      />

      <div className="flex flex-1">
        {/* Desktop sidebar: always open on knowledge-scope routes, hidden otherwise */}
        {showSidebar && (
          <aside className="hidden lg:block shrink-0 w-60 bg-stone-sidebar border-r border-stone-border sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <Sidebar />
          </aside>
        )}

        {/* Mobile: bottom sheet (knowledge-scope routes only) */}
        {showSidebar && (
          <div className="lg:hidden">
            <button
              type="button"
              aria-label="关闭菜单"
              className={`fixed inset-0 w-full h-full bg-black/50 z-40 transition-opacity duration-300 border-none outline-none cursor-default ${
                mobileSheetOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={closeSheet}
              onTouchEnd={closeSheet}
            />
            <aside
              className={`fixed left-0 right-0 bottom-0 max-h-[82vh] bg-stone-card rounded-t-2xl z-50 shadow-2xl overflow-hidden transition-transform duration-300 ease-out flex flex-col ${
                mobileSheetOpen ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              {/* Grab handle */}
              <div className="shrink-0 pt-2.5 pb-1 flex justify-center">
                <span className="w-9 h-1 rounded-full bg-stone-border" />
              </div>
              {/* Sheet header */}
              <div className="shrink-0 px-4 pb-2 flex items-center justify-between border-b border-stone-border">
                <span className="text-sm font-semibold text-text-primary">目录</span>
                <button
                  onClick={closeSheet}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-stone-bg transition-colors"
                  aria-label="关闭"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <Sidebar />
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            <Outlet context={{ onOpenAuth: () => setAuthOpen(true), setHeaderSaveAction }} />
          </div>
        </main>
      </div>

      <ScrollToTop />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  )
}
