import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { Icon } from '../utils/icons'
import UserAvatar from '../components/ui/UserAvatar'

// 攀爬类型选项（不严格区分维度，列出常见叫法供用户自选）
const CLIMBING_TYPES = [
  { value: 'bouldering', zh: '抱石', en: 'Bouldering' },
  { value: 'sport', zh: '运动攀', en: 'Sport Climbing' },
  { value: 'trad', zh: '传统攀', en: 'Trad Climbing' },
  { value: 'top-rope', zh: '顶绳', en: 'Top Rope' },
  { value: 'lead', zh: '先锋', en: 'Lead Climbing' },
  { value: 'speed', zh: '速度攀', en: 'Speed Climbing' },
  { value: 'multi-pitch', zh: '多段', en: 'Multi-pitch' },
  { value: 'big-wall', zh: '大岩壁', en: 'Big Wall' },
  { value: 'alpine', zh: '高山攀岩', en: 'Alpine' },
  { value: 'deep-water-solo', zh: '深水独攀', en: 'Deep Water Solo' },
  { value: 'ice', zh: '冰攀', en: 'Ice Climbing' },
  { value: 'indoor', zh: '室内', en: 'Indoor' },
]

// 攀岩年限
const EXPERIENCE_OPTIONS = [
  { value: '<6m', zh: '不到半年', en: 'Less than 6 months' },
  { value: '6-12m', zh: '半年到一年', en: '6–12 months' },
  { value: '1-2y', zh: '1–2 年', en: '1–2 years' },
  { value: '2-5y', zh: '2–5 年', en: '2–5 years' },
  { value: '5-10y', zh: '5–10 年', en: '5–10 years' },
  { value: '10y+', zh: '10 年以上', en: '10+ years' },
]

// 攀爬频率
const FREQUENCY_OPTIONS = [
  { value: '1', zh: '每周 1 次', en: '1x / week' },
  { value: '2-3', zh: '每周 2–3 次', en: '2–3x / week' },
  { value: '4-5', zh: '每周 4–5 次', en: '4–5x / week' },
  { value: '6+', zh: '几乎每天', en: 'Almost daily' },
]

// 攀爬风格
const CLIMBING_STYLES = [
  { value: 'power', zh: '力量型', en: 'Power' },
  { value: 'technique', zh: '技巧型', en: 'Technique' },
  { value: 'endurance', zh: '耐力型', en: 'Endurance' },
  { value: 'balanced', zh: '均衡型', en: 'Balanced' },
]

// 抱石难度等级
const BOULDER_GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V10+']
// 运动攀难度等级
const SPORT_GRADES = ['5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a+']

/** 药丸按钮组 */
function PillGroup({ options, value, onChange, multi = false, lang, activeColor = 'forest' }) {
  const isActive = (v) => multi ? (value || []).includes(v) : value === v

  const handleClick = (v) => {
    if (multi) {
      const arr = value || []
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
    } else {
      onChange(value === v ? '' : v)
    }
  }

  const activeCls = activeColor === 'amber'
    ? 'bg-amber text-white border-amber'
    : 'bg-forest text-white border-forest'
  const inactiveCls = activeColor === 'amber'
    ? 'border-stone-border hover:border-amber hover:text-amber'
    : 'border-stone-border hover:border-forest hover:text-forest'

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleClick(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            isActive(opt.value) ? activeCls : inactiveCls
          }`}
        >
          {lang === 'zh' ? opt.zh : opt.en}
        </button>
      ))}
    </div>
  )
}

export default function ClimbingProfilePage() {
  const { user, profile } = useAuth()
  const { lang } = useApp()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // 表单状态
  const [form, setForm] = useState({
    experience: '',
    climbing_types: [],
    frequency: '',
    style: '',
    boulder_grade: '',
    sport_grade: '',
    favorite_gyms: '',
    favorite_crags: '',
    goal: '',
    bio: '',
  })

  // 加载已有档案
  useEffect(() => {
    if (!user) return
    async function load() {
      const { data } = await supabase
        .from('climbing_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setForm({
          experience: data.experience || '',
          climbing_types: data.climbing_types || [],
          frequency: data.frequency || '',
          style: data.style || '',
          boulder_grade: data.boulder_grade || '',
          sport_grade: data.sport_grade || '',
          favorite_gyms: data.favorite_gyms || '',
          favorite_crags: data.favorite_crags || '',
          goal: data.goal || '',
          bio: data.bio || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">请先登录后再查看攀岩档案。</p>
      </div>
    )
  }

  const t = (zh, en) => lang === 'zh' ? zh : en
  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')

    const payload = {
      user_id: user.id,
      ...form,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('climbing_profiles')
      .upsert(payload, { onConflict: 'user_id' })

    setSaveMsg(error ? error.message : t('已保存', 'Saved'))
    setSaving(false)
    if (!error) setTimeout(() => setSaveMsg(''), 3000)
  }

  const displayName = profile?.username || '攀岩者'
  const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors'

  // 根据选择的攀爬类型决定显示哪些难度选择器
  const types = form.climbing_types || []
  const showBoulderGrade = types.includes('bouldering')
  const showRouteGrade = types.some((t) => ['sport', 'trad', 'lead', 'top-rope', 'multi-pitch', 'big-wall', 'alpine', 'deep-water-solo', 'indoor'].includes(t))

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* 页面标题 — 与个人设置一致 */}
      <h1 className="text-2xl font-bold mb-8">{t('攀岩档案', 'Climbing Profile')}</h1>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">{t('加载中…', 'Loading…')}</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">

          {/* ── 个人信息 ── */}
          <section className="bg-stone-card rounded-xl border border-stone-border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="user" size={18} className="text-text-secondary" />
              {t('个人信息', 'Personal Info')}
            </h2>
            <div className="flex items-center gap-4 mb-5">
              <UserAvatar name={displayName} size={48} />
              <div>
                <p className="font-medium">{displayName}</p>
                <p className="text-xs text-text-secondary">{user.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('个人简介', 'Bio')}</label>
              <textarea
                value={form.bio}
                onChange={(e) => set('bio')(e.target.value)}
                placeholder={t('随便写点关于你攀岩的故事…', 'Tell us about your climbing journey…')}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>
          </section>

          {/* ── 攀岩经验 ── */}
          <section className="bg-stone-card rounded-xl border border-stone-border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="mountain" size={18} className="text-text-secondary" />
              {t('攀岩经验', 'Climbing Experience')}
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">{t('攀岩年限', 'Years Climbing')}</label>
                <PillGroup options={EXPERIENCE_OPTIONS} value={form.experience} onChange={set('experience')} lang={lang} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('攀爬类型', 'Climbing Types')}
                  <span className="text-text-secondary font-normal ml-1">({t('可多选，不用在意分类是否重叠', 'multiple, categories may overlap')})</span>
                </label>
                <PillGroup options={CLIMBING_TYPES} value={form.climbing_types} onChange={set('climbing_types')} multi lang={lang} activeColor="forest" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('攀爬频率', 'Frequency')}</label>
                <PillGroup options={FREQUENCY_OPTIONS} value={form.frequency} onChange={set('frequency')} lang={lang} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('攀爬风格', 'Style')}</label>
                <PillGroup options={CLIMBING_STYLES} value={form.style} onChange={set('style')} lang={lang} />
              </div>
            </div>
          </section>

          {/* ── 难度等级（根据选择的攀爬类型动态显示） ── */}
          {(showBoulderGrade || showRouteGrade) && (
            <section className="bg-stone-card rounded-xl border border-stone-border p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Icon name="trophy" size={18} className="text-text-secondary" />
                {t('最高完攀难度', 'Highest Grade')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {showBoulderGrade && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('抱石', 'Bouldering')}</label>
                    <select
                      value={form.boulder_grade}
                      onChange={(e) => set('boulder_grade')(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">{t('未设置', 'Not set')}</option>
                      {BOULDER_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                )}
                {showRouteGrade && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('线路攀', 'Route')}</label>
                    <select
                      value={form.sport_grade}
                      onChange={(e) => set('sport_grade')(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">{t('未设置', 'Not set')}</option>
                      {SPORT_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── 场地偏好 ── */}
          <section className="bg-stone-card rounded-xl border border-stone-border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="mapPin" size={18} className="text-text-secondary" />
              {t('常去的地方', 'Favorite Places')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('常去的岩馆', 'Gyms')}</label>
                <input
                  type="text"
                  value={form.favorite_gyms}
                  onChange={(e) => set('favorite_gyms')(e.target.value)}
                  placeholder={t('你常去哪些岩馆？', 'Where do you usually climb indoors?')}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('常去的岩场', 'Crags')}</label>
                <input
                  type="text"
                  value={form.favorite_crags}
                  onChange={(e) => set('favorite_crags')(e.target.value)}
                  placeholder={t('你常去哪些岩场？', 'Where do you usually climb outdoors?')}
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* ── 目标 ── */}
          <section className="bg-stone-card rounded-xl border border-stone-border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Icon name="target" size={18} className="text-text-secondary" />
              {t('攀岩目标', 'Climbing Goal')}
            </h2>
            <input
              type="text"
              value={form.goal}
              onChange={(e) => set('goal')(e.target.value)}
              placeholder={t('例如：今年完攀 V6、参加一次野攀…', 'e.g. Send V6 this year…')}
              className={inputCls}
            />
          </section>

          {/* 保存按钮 */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
            >
              {saving ? t('保存中…', 'Saving…') : t('保存', 'Save')}
            </button>
            {saveMsg && (
              <p className={`text-sm rounded-lg px-3 py-2 ${saveMsg === t('已保存', 'Saved') ? 'text-forest bg-forest-light' : 'text-red-500 bg-red-50'}`}>
                {saveMsg}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
