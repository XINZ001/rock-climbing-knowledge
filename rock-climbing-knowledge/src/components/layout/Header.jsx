import { useState, useRef, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../../utils/icons'
import UserAvatar from '../ui/UserAvatar'

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

function getPageTitle(pathname, search, lang) {
  const tt = (zh, en, ko) => (lang === 'zh' ? zh : lang === 'en' ? en : ko)
  const searchParams = new URLSearchParams(search)
  const query = searchParams.get('q')

  if (pathname === '/search') {
    return {
      title: tt('搜索结果', 'Search Results', '검색 결과'),
      eyebrow: query ? `"${query}"` : tt('知识库搜索', 'Knowledge Search', '지식 검색'),
    }
  }
  if (pathname === '/knowledge' || pathname === '/knowledge-index') {
    return { title: tt('攀岩知识库', 'Knowledge Base', '지식 라이브러리') }
  }
  if (pathname.startsWith('/section/')) {
    const segments = pathname.split('/').filter(Boolean)
    return {
      title: segments.length >= 3
        ? tt('知识点详情', 'Knowledge Detail', '지식 상세')
        : tt('知识领域', 'Knowledge Domain', '지식 분야'),
    }
  }
  if (pathname === '/articles') {
    return { title: tt('攀岩专栏', 'Climbing Column', '클라이밍 칼럼') }
  }
  if (pathname.startsWith('/articles/category/')) {
    return { title: tt('专栏分类', 'Article Category', '칼럼 카테고리') }
  }
  if (pathname.startsWith('/articles/')) {
    return { title: tt('文章详情', 'Article', '글 상세') }
  }
  if (pathname === '/hall-of-fame') {
    return { title: tt('攀岩名人堂', 'Hall of Fame', '명예의 전당') }
  }
  if (pathname.startsWith('/hall-of-fame/')) {
    return { title: tt('运动员档案', 'Athlete Profile', '선수 프로필') }
  }
  if (pathname === '/quests') {
    return { title: tt('每日微任务', 'Daily Quests', '일일 퀘스트') }
  }
  if (pathname === '/diagnosis') {
    return { title: tt('能力诊断', 'Skill Diagnosis', '능력 진단') }
  }
  if (pathname === '/climbing-mbti') {
    return { title: tt('攀岩人格测试', 'Climbing Persona', '클라이밍 성향 테스트') }
  }
  if (pathname === '/injuries') {
    return { title: tt('伤痛档案', 'Injury Archive', '부상 기록') }
  }
  if (pathname === '/injuries/new') {
    return { title: tt('分享受伤经历', 'Share Injury Story', '부상 경험 공유') }
  }
  if (pathname.includes('/edit')) {
    return { title: tt('编辑伤痛档案', 'Edit Injury Story', '부상 기록 편집') }
  }
  if (pathname.startsWith('/injuries/')) {
    return { title: tt('伤痛详情', 'Injury Detail', '부상 상세') }
  }
  if (pathname === '/climbing-profile') {
    return { title: tt('攀岩档案', 'Climbing Profile', '클라이밍 프로필') }
  }
  if (pathname === '/settings') {
    return { title: tt('个人设置', 'Settings', '설정') }
  }
  if (pathname === '/auth/callback') {
    return { title: tt('登录中', 'Signing In', '로그인 중') }
  }
  if (pathname === '/admin/feedback') {
    return { title: tt('反馈管理', 'Feedback', '피드백') }
  }
  return { title: tt('当前页面', 'Current Page', '현재 페이지') }
}

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

export default function Header({ onToggleSidebar, onOpenAuth, sidebarOpen, onCloseSidebar, showMobileMenu = true, saveAction = null }) {
  const { lang, setLang } = useApp()
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const showAccountActions = ['/profile', '/settings', '/climbing-profile'].some(path => location.pathname === path || location.pathname.startsWith(path + '/'))
  const pageTitle = useMemo(
    () => getPageTitle(location.pathname, location.search, lang),
    [location.pathname, location.search, lang]
  )

  const handleBack = async () => {
    if (saveAction?.dirty) {
      const shouldSave = window.confirm(saveAction.confirmMessage || '你有未保存的修改。是否保存后离开？')
      if (!shouldSave) return
      const saved = await saveAction.onSave()
      if (!saved) return
    }
    if (sidebarOpen) onCloseSidebar?.()
    if (window.history.length > 1) navigate(-1)
    else navigate('/learn')
  }

  return (
    <header className="sticky top-0 z-[55] border-b border-stone-border header-glass header-scrolled">
      <div className="flex items-center px-4 h-14">
        {/* 左侧：返回 + 页面状态 */}
        <div className="flex min-w-0 items-center gap-2 shrink">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-stone-sidebar hover:text-text-primary transition-colors"
            aria-label={lang === 'zh' ? '返回' : lang === 'en' ? 'Back' : '뒤로'}
          >
            <Icon name="chevronLeft" size={22} />
          </button>
          <div className="min-w-0">
            {pageTitle.eyebrow && (
              <div className="truncate text-[11px] leading-tight text-text-secondary">
                {pageTitle.eyebrow}
              </div>
            )}
            <h1 className="truncate text-base font-semibold leading-tight text-text-primary">
              {pageTitle.title}
            </h1>
          </div>
        </div>

        {/* 中间留空 */}
        <div className="flex-1" />

        {/* 右侧 */}
        <div className="flex items-center gap-2 shrink-0">
          {saveAction && (
            <button
              type="button"
              onClick={saveAction.onSave}
              disabled={!saveAction.dirty || saveAction.saving}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                saveAction.dirty
                  ? 'bg-forest text-stone-950 hover:bg-forest-dark'
                  : 'bg-stone-sidebar text-text-secondary cursor-default'
              } disabled:opacity-60`}
            >
              {saveAction.saving
                ? (lang === 'zh' ? '保存中' : lang === 'en' ? 'Saving' : '저장 중')
                : (lang === 'zh' ? '保存' : lang === 'en' ? 'Save' : '저장')}
            </button>
          )}

          {/* 语言切换 — 桌面端 */}
          <LanguageDropdown lang={lang} setLang={setLang} />

          {/* 登录状态：只在个人相关页面显示，内容阅读页保持沉浸 */}
          {showAccountActions && !loading && (
            user ? (
              <div className="hidden lg:block">
                <UserMenu />
              </div>
            ) : (
              <>
                {/* 桌面端：完整登录按钮 */}
                <button
                  onClick={onOpenAuth}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest text-stone-950 text-sm font-medium hover:bg-forest-dark transition-colors"
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
