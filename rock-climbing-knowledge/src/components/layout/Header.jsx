import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../../utils/icons'
import UserAvatar from '../ui/UserAvatar'
import ThemeToggle from '../ui/ThemeToggle'

function UserMenu() {
  const { profile, signOut } = useAuth()
  const { lang } = useApp()
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

  const defaultNames = { zh: '攀岩者', en: 'Climber', ko: '클라이머' }
  const displayName = profile?.username || (defaultNames[lang] || defaultNames.zh)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-stone-sidebar transition-colors"
      >
        <UserAvatar name={displayName} size={28} />
        <span className="text-sm font-medium hidden lg:inline max-w-[80px] truncate">
          {displayName}
        </span>
        <Icon name="chevronDown" size={12} className="text-text-secondary" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-stone-card rounded-lg border border-stone-border shadow-lg overflow-hidden z-50">
          <button
            onClick={() => handleNav('/profile')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-bg transition-colors text-left"
          >
            <Icon name="user" size={14} className="text-text-secondary" />
            {lang === 'zh' ? '个人主页' : lang === 'en' ? 'My Profile' : '마이페이지'}
          </button>
          <div className="border-t border-stone-border" />
          <button
            onClick={() => handleNav('/climbing-profile')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-bg transition-colors text-left"
          >
            <Icon name="mountain" size={14} className="text-text-secondary" />
            {lang === 'zh' ? '攀岩档案' : lang === 'en' ? 'Climbing Profile' : '클라이밍 프로필'}
          </button>
          <div className="border-t border-stone-border" />
          <button
            onClick={() => handleNav('/settings')}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-bg transition-colors text-left"
          >
            <Icon name="edit" size={14} className="text-text-secondary" />
            {lang === 'zh' ? '个人设置' : lang === 'en' ? 'Settings' : '설정'}
          </button>
          <div className="border-t border-stone-border" />
          <button
            onClick={async () => { await signOut(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-bg transition-colors text-left text-red-500"
          >
            <Icon name="logOut" size={14} />
            {lang === 'zh' ? '退出登录' : lang === 'en' ? 'Sign out' : '로그아웃'}
          </button>
        </div>
      )}
    </div>
  )
}

const langOptions = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
]

function LanguageDropdown({ lang, setLang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = langOptions.find((o) => o.code === lang) || langOptions[0]

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-stone-border text-xs font-medium hover:bg-stone-sidebar transition-colors"
      >
        {current.label}
        <Icon name="chevronDown" size={10} className="text-text-secondary" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-28 bg-stone-card rounded-lg border border-stone-border shadow-lg overflow-hidden z-50">
          {langOptions.map((opt) => (
            <button
              key={opt.code}
              onClick={() => { setLang(opt.code); setOpen(false) }}
              className={`w-full px-3 py-2 text-xs text-left transition-colors ${
                opt.code === lang
                  ? 'bg-forest-light text-forest font-semibold'
                  : 'hover:bg-stone-bg text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header({ onToggleSidebar, onOpenAuth, sidebarOpen, onCloseSidebar, showMobileMenu = true }) {
  const { lang, setLang } = useApp()
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-[55] border-b border-stone-border header-glass header-scrolled">
      <div className="flex items-center px-4 h-14">
        {/* 左侧：Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <Link to="/" className="flex items-center gap-2" onClick={sidebarOpen ? onCloseSidebar : undefined}>
            <Icon name="mountain" size={24} className="text-forest" />
            <span className="font-semibold text-lg">{lang === 'zh' ? '攀岩知识库' : lang === 'en' ? 'Xin Library' : '클라이밍 지식'}</span>
          </Link>
        </div>

        {/* 中间留空 */}
        <div className="flex-1" />

        {/* 右侧 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 语言切换 — 桌面端 */}
          <LanguageDropdown lang={lang} setLang={setLang} />

          {/* 暗色模式切换 — 桌面端 */}
          <ThemeToggle size={18} className="hidden lg:flex w-8 h-8" />

          {/* 登录状态 */}
          {!loading && (
            user ? (
              <>
                {/* 桌面端：完整用户菜单 */}
                <div className="hidden lg:block">
                  <UserMenu />
                </div>
                {/* 移动端：头像图标 */}
                <button
                  onClick={() => {}}
                  className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-stone-sidebar transition-colors"
                >
                  <UserAvatar name={profile?.username || (lang === 'zh' ? '攀岩者' : lang === 'en' ? 'Climber' : '클라이머')} size={24} />
                </button>
              </>
            ) : (
              <>
                {/* 桌面端：完整登录按钮 */}
                <button
                  onClick={onOpenAuth}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors"
                >
                  <Icon name="user" size={14} />
                  {lang === 'zh' ? '登录' : lang === 'en' ? 'Sign in' : '로그인'}
                </button>
                {/* 移动端：仅用户图标 */}
                <button
                  onClick={onOpenAuth}
                  className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-stone-sidebar transition-colors"
                >
                  <Icon name="user" size={22} className="text-text-secondary" />
                </button>
              </>
            )
          )}

          {/* 汉堡菜单 / 关闭 — 仅在知识范围路由下显示，三条线 ↔ X 动效 */}
          {showMobileMenu && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden relative flex items-center justify-center w-9 h-9 rounded-md hover:bg-stone-sidebar transition-colors"
            aria-label={sidebarOpen ? '关闭菜单' : '打开菜单'}
          >
            <span className="flex flex-col items-center justify-center w-[20px] h-[20px]">
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-out text-text-secondary ${sidebarOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-out text-text-secondary mt-[3px] ${sidebarOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-out text-text-secondary mt-[3px] ${sidebarOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </span>
          </button>
          )}
        </div>
      </div>
    </header>
  )
}
