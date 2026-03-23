import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'
import AuthModal from '../auth/AuthModal'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const location = useLocation()

  // 手机端路由切换时关闭侧边栏
  useEffect(() => {
    // 仅在小屏时自动关闭
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <div className="flex flex-1">
        {/* 桌面端：固定侧边栏，推挤内容 */}
        <aside
          className={`hidden md:block shrink-0 bg-stone-sidebar border-r border-stone-border sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden transition-[width] duration-300 ease-out ${
            sidebarOpen ? 'w-60' : 'w-0'
          }`}
        >
          <div className="w-60 h-full overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* 手机端：覆盖层侧边栏 */}
        <div className="md:hidden">
          <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`fixed right-0 top-14 bottom-0 w-72 bg-stone-card border-l border-stone-border z-50 shadow-xl overflow-hidden transition-transform duration-300 ease-out ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            <Outlet context={{ onOpenAuth: () => setAuthOpen(true) }} />
          </div>
          <Footer />
        </main>
      </div>

      <ScrollToTop />

      {/* Auth Modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  )
}
