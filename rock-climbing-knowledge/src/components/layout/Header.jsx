import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../../utils/icons'
import UserAvatar from '../ui/UserAvatar'

function UserMenu() {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleNav = (path) => {
    navigate(path)
    setOpen(false)
  }

  const displayName = profile?.username || '攀岩者'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-stone-sidebar transition-colors"
      >
        <UserAvatar name={displayName} size={28} />
        <span className="text-sm font-medium hidden sm:inline max-w-[80px] truncate">
          {displayName}
        </span>
        <Icon name="chevronDown" size={12} className="text-text-secondary" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-stone-card rounded-lg border border-stone-border shadow-lg overflow-hidden z-50">
          <button
            onClick={() => handleNav('/climbing-profile')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-bg transition-colors text-left"
          >
            <Icon name="mountain" size={14} className="text-text-secondary" />
            攀岩档案
          </button>
          <div className="border-t border-stone-border" />
          <button
            onClick={() => handleNav('/settings')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-bg transition-colors text-left"
          >
            <Icon name="user" size={14} className="text-text-secondary" />
            个人设置
          </button>
          <div className="border-t border-stone-border" />
          <button
            onClick={async () => { await signOut(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-bg transition-colors text-left text-red-500"
          >
            <Icon name="logOut" size={14} />
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}

export default function Header({ onToggleSidebar, onOpenAuth }) {
  const { lang, setLang } = useApp()
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  // 判断当前板块用于高亮
  const isKnowledge = location.pathname === '/knowledge' || location.pathname.startsWith('/section') || location.pathname.startsWith('/search')
  const isHallOfFame = location.pathname.startsWith('/hall-of-fame')
  const isInjuries = location.pathname.startsWith('/injuries')

  const navItems = [
    { label: lang === 'zh' ? '知识库' : 'Knowledge', to: '/knowledge', active: isKnowledge, icon: 'book' },
    { label: lang === 'zh' ? '名人堂' : 'Hall of Fame', to: '/hall-of-fame', active: isHallOfFame, icon: 'trophy' },
    { label: lang === 'zh' ? '伤痛档案' : 'Injury Archive', to: '/injuries', active: isInjuries, icon: 'medkit' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-stone-card border-b border-stone-border shadow-sm">
      <div className="flex items-center px-4 h-14">
        {/* 左侧：Logo + 菜单按钮（桌面端） */}
        <div className="flex items-center gap-1 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="mountain" size={24} className="text-forest" />
            <span className="font-semibold text-lg">攀岩知识库</span>
          </Link>
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:bg-stone-sidebar transition-colors ml-1"
          >
            <Icon name="menu" size={18} className="text-text-secondary" />
          </button>
        </div>

        {/* 中间：三个顶级导航按钮居中 — 桌面端 */}
        <nav className="hidden sm:flex items-center justify-center gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-forest-light text-forest'
                  : 'text-text-secondary hover:bg-stone-bg hover:text-text-primary'
              }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧 */}
        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          {/* 语言切换 — 桌面端 */}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="hidden sm:inline-flex px-2.5 py-1 rounded-md border border-stone-border text-xs font-medium hover:bg-stone-sidebar transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>

          {/* 登录状态 */}
          {!loading && (
            user ? (
              <>
                {/* 桌面端：完整用户菜单 */}
                <div className="hidden sm:block">
                  <UserMenu />
                </div>
                {/* 移动端：头像图标 */}
                <button
                  onClick={() => {}}
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-stone-sidebar transition-colors"
                >
                  <UserAvatar name={profile?.username || '攀岩者'} size={24} />
                </button>
              </>
            ) : (
              <>
                {/* 桌面端：完整登录按钮 */}
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors"
                >
                  <Icon name="user" size={14} />
                  {lang === 'zh' ? '登录' : 'Sign in'}
                </button>
                {/* 移动端：仅用户图标 */}
                <button
                  onClick={onOpenAuth}
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-stone-sidebar transition-colors"
                >
                  <Icon name="user" size={22} className="text-text-secondary" />
                </button>
              </>
            )
          )}

          {/* 汉堡菜单 — 手机端右侧 */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-stone-sidebar transition-colors"
          >
            <Icon name="menu" size={22} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  )
}
