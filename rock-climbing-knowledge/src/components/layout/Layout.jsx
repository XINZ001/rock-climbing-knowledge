import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 bg-stone-sidebar border-r border-stone-border sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden">
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        <div className="lg:hidden">
          <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`fixed left-0 top-14 bottom-0 w-72 bg-stone-card border-r border-stone-border z-50 shadow-xl overflow-hidden transition-transform duration-300 ease-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
          <Footer />
        </main>
      </div>

      <ScrollToTop />
    </div>
  )
}
