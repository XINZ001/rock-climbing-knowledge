import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // 获取用户资料
  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    // 获取当前 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    // 监听登录/登出状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // 邮箱注册
  async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          locale: navigator.language?.startsWith('zh') ? 'zh' : 'en'
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  // 检测邮箱是否已注册（统一入口分流用）
  // 直接调用 Supabase RPC，无需 Edge Function
  async function checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .rpc('check_email_exists', { email_input: email.toLowerCase() })
      if (error) {
        return { exists: false, error: error.message }
      }
      return { exists: !!data, error: null }
    } catch (err) {
      return { exists: false, error: err.message }
    }
  }

  // 邮箱登录
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  // 登出
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // 更新用户资料
  async function updateProfile(updates) {
    if (!user) return { error: { message: 'Not logged in' } }
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()
    if (data) setProfile(data)
    return { data, error }
  }

  const value = {
    user,
    profile,
    loading,
    checkEmailExists,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
