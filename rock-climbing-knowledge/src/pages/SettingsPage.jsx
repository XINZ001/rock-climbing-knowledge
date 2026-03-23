import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Icon } from '../utils/icons'

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth()

  const [username, setUsername] = useState(profile?.username || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState('')

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">请先登录后再访问设置页面。</p>
      </div>
    )
  }

  const handleUpdateUsername = async (e) => {
    e.preventDefault()
    if (!username.trim()) return
    setSaving(true)
    setSaveMsg('')
    const { error } = await updateProfile({ username: username.trim() })
    setSaveMsg(error ? error.message : '昵称已更新')
    setSaving(false)
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (!currentPw) {
      setPwMsg('请输入当前密码')
      return
    }
    if (newPw.length < 6) {
      setPwMsg('新密码至少 6 位')
      return
    }
    if (currentPw === newPw) {
      setPwMsg('新密码不能与当前密码相同')
      return
    }
    setPwSaving(true)
    setPwMsg('')

    // 先用当前密码重新登录验证身份
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPw
    })
    if (verifyError) {
      setPwMsg('当前密码不正确')
      setPwSaving(false)
      return
    }

    // 验证通过，更新密码
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwMsg(error ? error.message : '密码已更新')
    setPwSaving(false)
    if (!error) {
      setCurrentPw('')
      setNewPw('')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">个人设置</h1>

      {/* 修改昵称 */}
      <section className="bg-stone-card rounded-xl border border-stone-border p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Icon name="edit" size={18} className="text-text-secondary" />
          修改昵称
        </h2>
        <form onSubmit={handleUpdateUsername} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">昵称</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              required
            />
          </div>
          {saveMsg && (
            <p className={`text-sm rounded-lg px-3 py-2 ${saveMsg.includes('已更新') ? 'text-forest bg-forest-light' : 'text-red-500 bg-red-50'}`}>
              {saveMsg}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </form>
      </section>

      {/* 修改密码 */}
      <section className="bg-stone-card rounded-xl border border-stone-border p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Icon name="lock" size={18} className="text-text-secondary" />
          修改密码
        </h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">当前密码</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="请输入当前密码"
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">新密码</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="至少 6 位"
              minLength={6}
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              required
            />
          </div>
          {pwMsg && (
            <p className={`text-sm rounded-lg px-3 py-2 ${pwMsg.includes('已更新') ? 'text-forest bg-forest-light' : 'text-red-500 bg-red-50'}`}>
              {pwMsg}
            </p>
          )}
          <button
            type="submit"
            disabled={pwSaving}
            className="px-4 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {pwSaving ? '更新中...' : '更新密码'}
          </button>
        </form>
      </section>
    </div>
  )
}
