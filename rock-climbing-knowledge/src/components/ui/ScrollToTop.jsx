import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '../../utils/icons'

// Routes where the floating scroll-to-top button should not appear.
// The Feed page has its own masonry flow and tab bar — adding a FAB clutters it.
const HIDDEN_ROUTES = new Set(['/'])

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (HIDDEN_ROUTES.has(pathname)) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`btn-press fixed bottom-20 right-5 lg:bottom-6 lg:right-6 z-30 w-10 h-10 bg-forest text-stone-950 rounded-full shadow-lg flex items-center justify-center hover:bg-forest-dark transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <Icon name="arrowUp" size={18} />
    </button>
  )
}
