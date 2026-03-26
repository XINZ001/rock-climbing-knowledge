import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { Icon } from '../../utils/icons'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const { lang } = useApp()
  const [tab, setTab] = useState('login') // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const t = (zh, en, ko) => lang === 'zh' ? zh : lang === 'en' ? en : ko

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (tab === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        onClose()
      } else if (tab === 'register') {
        if (!username.trim()) {
          throw { message: t('请输入昵称', 'Please enter a nickname', '닉네임을 입력해 주세요') }
        }
        const { error } = await signUp(email, password, username.trim())
        if (error) throw error
        setMessage(t(
          '注册成功！请查看邮箱确认链接（如果已关闭邮件确认则自动登录）。',
          'Registration successful! Please check your email for a confirmation link.',
          '가입 성공! 이메일에서 확인 링크를 확인해 주세요.'
        ))
        setTimeout(() => onClose(), 1500)
      } else if (tab === 'forgot') {
        const { supabase } = await import('../../lib/supabase')
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setMessage(t(
          '密码重置邮件已发送，请查看邮箱。',
          'Password reset email sent. Please check your inbox.',
          '비밀번호 재설정 이메일을 보냈어요. 받은 편지함을 확인해 주세요.'
        ))
      }
    } catch (err) {
      setError(err.message || t('操作失败，请重试', 'Operation failed. Please try again.', '작업에 실패했어요. 다시 시도해 주세요.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 弹窗主体 */}
      <div className="relative bg-stone-card rounded-2xl border border-stone-border shadow-xl w-full max-w-md overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-stone-bg transition-colors"
        >
          <Icon name="x" size={18} className="text-text-secondary" />
        </button>

        <div className="p-6 pt-8">
          {/* 标题 */}
          <div className="text-center mb-6">
            <Icon name="mountain" size={32} className="text-forest mx-auto mb-2" />
            <h2 className="text-xl font-bold">
              {tab === 'login' && t('登录', 'Log In', '로그인')}
              {tab === 'register' && t('注册', 'Sign Up', '회원가입')}
              {tab === 'forgot' && t('重置密码', 'Reset Password', '비밀번호 재설정')}
            </h2>
          </div>

          {/* Tab 切换（仅在 login/register 时显示） */}
          {tab !== 'forgot' && (
            <div className="flex gap-1 bg-stone-bg rounded-lg p-1 mb-6">
              <button
                onClick={() => { setTab('login'); setError(''); setMessage('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  tab === 'login' ? 'bg-stone-card shadow-sm text-text-primary' : 'text-text-secondary'
                }`}
              >
                {t('登录', 'Log In', '로그인')}
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); setMessage('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  tab === 'register' ? 'bg-stone-card shadow-sm text-text-primary' : 'text-text-secondary'
                }`}
              >
                {t('注册', 'Sign Up', '회원가입')}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 昵称（仅注册） */}
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('昵称', 'Nickname', '닉네임')}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('其他用户将看到这个名字', 'Other users will see this name', '다른 사용자에게 보이는 이름이에요')}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
                  required
                />
              </div>
            )}

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('邮箱', 'Email', '이메일')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
                required
              />
            </div>

            {/* 密码（非 forgot 时显示） */}
            {tab !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('密码', 'Password', '비밀번호')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === 'register'
                    ? t('至少 6 位', 'At least 6 characters', '6자 이상')
                    : t('输入密码', 'Enter password', '비밀번호 입력')}
                  minLength={tab === 'register' ? 6 : undefined}
                  className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
                  required
                />
              </div>
            )}

            {/* 错误/成功提示 */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            {message && (
              <p className="text-sm text-forest bg-forest-light rounded-lg px-3 py-2">{message}</p>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
            >
              {loading ? t('处理中...', 'Processing...', '처리 중...') : (
                tab === 'login' ? t('登录', 'Log In', '로그인') :
                tab === 'register' ? t('注册', 'Sign Up', '회원가입') :
                t('发送重置邮件', 'Send Reset Email', '재설정 이메일 보내기')
              )}
            </button>
          </form>

          {/* 底部链接 */}
          <div className="mt-4 text-center text-sm text-text-secondary">
            {tab === 'login' && (
              <button
                onClick={() => { setTab('forgot'); setError(''); setMessage('') }}
                className="text-forest hover:underline"
              >
                {t('忘记密码？', 'Forgot password?', '비밀번호를 잊으셨나요?')}
              </button>
            )}
            {tab === 'forgot' && (
              <button
                onClick={() => { setTab('login'); setError(''); setMessage('') }}
                className="text-forest hover:underline"
              >
                {t('← 返回登录', '← Back to login', '← 로그인으로 돌아가기')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
