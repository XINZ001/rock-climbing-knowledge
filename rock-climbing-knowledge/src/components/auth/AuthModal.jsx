import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../utils/icons'

/**
 * 统一认证入口弹窗
 *
 * 流程：
 *   Step 1 (email)    → 输入邮箱 + 点击"继续"
 *   Step 2 (login)    → 邮箱已注册 → 输入密码登录
 *   Step 2 (register) → 邮箱未注册 → 输入昵称 + 密码注册
 *   Step (forgot)     → 从 login 进入 → 发送重置邮件
 */
export default function AuthModal({ onClose }) {
  const { signIn, signUp, checkEmailExists } = useAuth()
  const { lang } = useApp()

  // step: 'email' | 'login' | 'register' | 'forgot'
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // 动画方向：'forward' 向前推进，'back' 返回
  const [direction, setDirection] = useState('forward')

  const passwordRef = useRef(null)
  const usernameRef = useRef(null)

  const t = (zh, en, ko) => lang === 'zh' ? zh : lang === 'en' ? en : ko

  // 步骤切换后自动聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 'login' && passwordRef.current) passwordRef.current.focus()
      if (step === 'register' && usernameRef.current) usernameRef.current.focus()
    }, 300) // 等动画完成
    return () => clearTimeout(timer)
  }, [step])

  // ─── Step 1: 检测邮箱 ───
  const handleCheckEmail = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // 前端格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('请输入有效的邮箱地址', 'Please enter a valid email', '유효한 이메일을 입력해 주세요'))
      return
    }

    setLoading(true)
    try {
      const { exists, error: checkError } = await checkEmailExists(email)
      if (checkError) {
        // Edge Function 不可用时的降级提示
        console.warn('Email check failed:', checkError)
        // 降级：让用户自己选择（但仍用统一界面）
        setError(t(
          '无法检测邮箱状态，请稍后重试',
          'Unable to check email status. Please try again.',
          '이메일 상태를 확인할 수 없어요. 다시 시도해 주세요.'
        ))
        setLoading(false)
        return
      }
      setDirection('forward')
      setStep(exists ? 'login' : 'register')
    } catch (err) {
      setError(err.message || t('操作失败', 'Operation failed', '작업에 실패했어요'))
    } finally {
      setLoading(false)
    }
  }

  // ─── Step 2a: 登录 ───
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) throw error
      onClose()
    } catch (err) {
      setError(err.message || t('登录失败', 'Login failed', '로그인 실패'))
    } finally {
      setLoading(false)
    }
  }

  // ─── Step 2b: 注册 ───
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) {
      setError(t('请输入昵称', 'Please enter a nickname', '닉네임을 입력해 주세요'))
      return
    }
    setLoading(true)
    try {
      const { data, error } = await signUp(email, password, username.trim())
      if (error) throw error

      // 检测 Supabase 对已存在邮箱的静默返回（identities 为空数组）
      if (data?.user?.identities?.length === 0) {
        setError(t(
          '该邮箱已注册，请直接登录',
          'This email is already registered. Please log in.',
          '이미 등록된 이메일이에요. 로그인해 주세요.'
        ))
        setDirection('forward')
        setStep('login')
        setPassword('')
        setLoading(false)
        return
      }

      setMessage(t(
        '注册成功！请查看邮箱确认链接（如果已关闭邮件确认则自动登录）。',
        'Registration successful! Please check your email for a confirmation link.',
        '가입 성공! 이메일에서 확인 링크를 확인해 주세요.'
      ))
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      setError(err.message || t('注册失败', 'Registration failed', '가입 실패'))
    } finally {
      setLoading(false)
    }
  }

  // ─── 忘记密码 ───
  const handleForgot = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { supabase } = await import('../../lib/supabase')
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      setMessage(t(
        '密码重置邮件已发送，请查看邮箱。',
        'Password reset email sent. Please check your inbox.',
        '비밀번호 재설정 이메일을 보냈어요. 받은 편지함을 확인해 주세요.'
      ))
    } catch (err) {
      setError(err.message || t('操作失败', 'Operation failed', '작업에 실패했어요'))
    } finally {
      setLoading(false)
    }
  }

  // ─── 返回邮箱步骤 ───
  const goBackToEmail = () => {
    setDirection('back')
    setStep('email')
    setPassword('')
    setUsername('')
    setError('')
    setMessage('')
  }

  // ─── 从 forgot 返回 login ───
  const goBackToLogin = () => {
    setDirection('back')
    setStep('login')
    setError('')
    setMessage('')
  }

  // ─── 步骤标题 ───
  const stepTitle = {
    email: t('开始使用', 'Get Started', '시작하기'),
    login: t('欢迎回来', 'Welcome Back', '다시 오신 걸 환영해요'),
    register: t('创建账号', 'Create Account', '계정 만들기'),
    forgot: t('重置密码', 'Reset Password', '비밀번호 재설정'),
  }

  // ─── 动画 class ───
  const animClass = direction === 'forward'
    ? 'animate-slide-in-right'
    : 'animate-slide-in-left'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 弹窗主体 */}
      <div className="relative bg-stone-card rounded-2xl border border-stone-border shadow-xl w-full max-w-md overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-stone-bg transition-colors z-10"
        >
          <Icon name="x" size={18} className="text-text-secondary" />
        </button>

        <div className="p-6 pt-8">
          {/* 标题区域 */}
          <div className="text-center mb-6">
            <img
              src="/images/logo/climbing-knowledge-logo-white.svg"
              alt=""
              aria-hidden="true"
              className="home-logo-mark mx-auto mb-3 h-auto w-36"
            />
            <h2 className="text-xl font-bold" key={step}>
              {stepTitle[step]}
            </h2>
          </div>

          {/* ═══ 邮箱回显条（非 email 步骤时显示） ═══ */}
          {step !== 'email' && (
            <div className="flex items-center justify-between bg-stone-bg rounded-lg px-3 py-2 mb-4">
              <span className="text-sm text-text-secondary truncate">{email}</span>
              <button
                type="button"
                onClick={goBackToEmail}
                className="text-xs text-forest hover:underline ml-2 shrink-0"
              >
                {t('更换', 'Change', '변경')}
              </button>
            </div>
          )}

          {/* ═══ Step: email ═══ */}
          {step === 'email' && (
            <form onSubmit={handleCheckEmail} className={`space-y-4 ${animClass}`}>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('邮箱', 'Email', '이메일')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-forest text-stone-950 text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
              >
                {loading
                  ? t('检测中...', 'Checking...', '확인 중...')
                  : t('继续', 'Continue', '계속')
                }
              </button>
            </form>
          )}

          {/* ═══ Step: login ═══ */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className={`space-y-4 ${animClass}`}>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('密码', 'Password', '비밀번호')}
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('输入密码', 'Enter password', '비밀번호 입력')}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              {message && (
                <p className="text-sm text-forest bg-forest-light rounded-lg px-3 py-2">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-forest text-stone-950 text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
              >
                {loading ? t('登录中...', 'Logging in...', '로그인 중...') : t('登录', 'Log In', '로그인')}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setDirection('forward'); setStep('forgot'); setError(''); setMessage('') }}
                  className="text-sm text-forest hover:underline"
                >
                  {t('忘记密码？', 'Forgot password?', '비밀번호를 잊으셨나요?')}
                </button>
              </div>
            </form>
          )}

          {/* ═══ Step: register ═══ */}
          {step === 'register' && (
            <form onSubmit={handleRegister} className={`space-y-4 ${animClass}`}>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('昵称', 'Nickname', '닉네임')}
                </label>
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('其他用户将看到这个名字', 'Other users will see this name', '다른 사용자에게 보이는 이름이에요')}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('设置密码', 'Set Password', '비밀번호 설정')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('至少 6 位', 'At least 6 characters', '6자 이상')}
                  minLength={6}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              {message && (
                <p className="text-sm text-forest bg-forest-light rounded-lg px-3 py-2">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-forest text-stone-950 text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
              >
                {loading ? t('注册中...', 'Signing up...', '가입 중...') : t('注册', 'Sign Up', '회원가입')}
              </button>
            </form>
          )}

          {/* ═══ Step: forgot ═══ */}
          {step === 'forgot' && (
            <form onSubmit={handleForgot} className={`space-y-4 ${animClass}`}>
              <p className="text-sm text-text-secondary">
                {t(
                  '我们将向你的邮箱发送密码重置链接。',
                  'We will send a password reset link to your email.',
                  '비밀번호 재설정 링크를 이메일로 보내드릴게요.'
                )}
              </p>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              {message && (
                <p className="text-sm text-forest bg-forest-light rounded-lg px-3 py-2">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-forest text-stone-950 text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
              >
                {loading
                  ? t('发送中...', 'Sending...', '보내는 중...')
                  : t('发送重置邮件', 'Send Reset Email', '재설정 이메일 보내기')
                }
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={goBackToLogin}
                  className="text-sm text-forest hover:underline"
                >
                  {t('← 返回登录', '← Back to login', '← 로그인으로 돌아가기')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 过渡动画样式 */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slideInRight 0.25s ease-out; }
        .animate-slide-in-left  { animation: slideInLeft 0.25s ease-out; }
      `}</style>
    </div>
  )
}
