import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { submitInjuryReport, updateInjuryReport, fetchInjuryReport } from '../lib/injuries'
import { uploadMedia } from '../lib/community'
import { supabase } from '../lib/supabase'
import {
  BODY_PARTS, INJURY_TYPES, CLIMBING_TYPES,
  EXPERIENCE_LEVELS, FREQUENCY_OPTIONS, RECOVERY_DURATIONS,
} from '../lib/injuries'
import { Icon } from '../utils/icons'

function SelectField({ label, value, onChange, options, lang, required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
      >
        <option value="">{placeholder || '请选择'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {lang === 'zh' ? opt.label.zh : opt.label.en}
          </option>
        ))}
      </select>
    </div>
  )
}

function MultiSelectChips({ label, selected, onChange, options, lang }) {
  const toggle = (val) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    )
  }
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                active
                  ? 'bg-forest text-white border-forest'
                  : 'bg-stone-bg border-stone-border hover:border-forest text-text-secondary'
              }`}
            >
              {lang === 'zh' ? opt.label.zh : opt.label.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TriStateField({ label, value, onChange }) {
  const opts = [
    { val: 'yes', text: '是' },
    { val: 'no', text: '否' },
    { val: 'unsure', text: '不确定' },
  ]
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        {opts.map((o) => (
          <button
            key={o.val}
            type="button"
            onClick={() => onChange(o.val)}
            className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
              value === o.val
                ? 'bg-forest text-white border-forest'
                : 'bg-stone-bg border-stone-border hover:border-forest text-text-secondary'
            }`}
          >
            {o.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function InjuryFormPage() {
  const { id: editId } = useParams()
  const isEdit = Boolean(editId)
  const { user } = useAuth()
  const { lang } = useApp()
  const { onOpenAuth } = useOutletContext()
  const navigate = useNavigate()

  // 必填
  const [bodyParts, setBodyParts] = useState([])
  const [injuryType, setInjuryType] = useState('')
  const [description, setDescription] = useState('')
  const [injuryCause, setInjuryCause] = useState('')
  const [climbingType, setClimbingType] = useState('')

  // 攀岩背景
  const [usualGrade, setUsualGrade] = useState('')
  const [injuryGrade, setInjuryGrade] = useState('')
  const [experience, setExperience] = useState('')
  const [frequency, setFrequency] = useState('')

  // 选填
  const [didWarmUp, setDidWarmUp] = useState('')
  const [wasFatigued, setWasFatigued] = useState('')
  const [soughtMedical, setSoughtMedical] = useState(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [recoveryDuration, setRecoveryDuration] = useState('')
  const [advice, setAdvice] = useState('')

  // "其他"自定义输入
  const [otherBodyPart, setOtherBodyPart] = useState('')
  const [otherInjuryType, setOtherInjuryType] = useState('')

  // 媒体
  const [files, setFiles] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 攀岩档案数据（用于自动填充和回写）
  const [climbingProfile, setClimbingProfile] = useState(null)

  const [loadingEdit, setLoadingEdit] = useState(isEdit)

  // 编辑模式：加载已有数据
  useEffect(() => {
    if (!isEdit || !user) return
    async function loadExisting() {
      const { data } = await fetchInjuryReport(editId)
      if (data && data.user_id === user.id) {
        const d = data.injury_details?.[0] || data.injury_details
        setDescription(data.description || '')
        if (d) {
          // 处理 body_parts 中的 other:xxx 格式
          const bps = (d.body_parts || []).map(bp => {
            if (bp.startsWith('other:')) { setOtherBodyPart(bp.slice(6)); return 'other' }
            return bp
          })
          setBodyParts(bps)
          // 处理 injury_type 中的 other:xxx 格式
          if (d.injury_type?.startsWith('other:')) {
            setOtherInjuryType(d.injury_type.slice(6))
            setInjuryType('other')
          } else {
            setInjuryType(d.injury_type || '')
          }
          setInjuryCause(d.injury_cause || '')
          setClimbingType(d.climbing_type || '')
          setUsualGrade(d.usual_grade || '')
          setInjuryGrade(d.injury_grade || '')
          setExperience(d.climbing_experience || '')
          setFrequency(d.climbing_frequency || '')
          setDidWarmUp(d.did_warm_up || '')
          setWasFatigued(d.was_fatigued || '')
          setSoughtMedical(d.sought_medical)
          setDiagnosis(d.diagnosis || '')
          setRecoveryDuration(d.recovery_duration || '')
          setAdvice(d.advice_to_others || '')
        }
      }
      setLoadingEdit(false)
    }
    loadExisting()
  }, [isEdit, editId, user])

  // 新建模式：自动填充攀岩档案
  useEffect(() => {
    if (!user || isEdit) return
    async function loadProfile() {
      const { data } = await supabase
        .from('climbing_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setClimbingProfile(data)
        if (!experience && data.experience) setExperience(data.experience)
        if (!frequency && data.frequency) setFrequency(data.frequency)
        if (!usualGrade) {
          const grade = data.boulder_grade || data.sport_grade
          if (grade) setUsualGrade(grade)
        }
      }
    }
    loadProfile()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Icon name="alertTriangle" size={48} className="text-amber mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">需要登录</h2>
        <p className="text-text-secondary mb-6">请先登录后再提交你的伤痛经历。</p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-dark transition-colors"
        >
          登录 / 注册
        </button>
      </div>
    )
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files)
    if (files.length + newFiles.length > 5) {
      setError('最多上传 5 个文件')
      return
    }
    setFiles([...files, ...newFiles])
  }

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (bodyParts.length === 0) { setError('请选择受伤部位'); return }
    setError('')
    setSubmitting(true)

    // 处理"其他"自定义值
    const finalBodyParts = bodyParts.map(bp =>
      bp === 'other' && otherBodyPart ? `other:${otherBodyPart}` : bp
    )
    const finalInjuryType = injuryType === 'other' && otherInjuryType
      ? `other:${otherInjuryType}`
      : injuryType

    const bodyPartLabel = bodyParts[0] === 'other' && otherBodyPart
      ? otherBodyPart
      : BODY_PARTS.find(b => b.value === bodyParts[0])?.label.zh || bodyParts[0]
    const injuryTypeLabel = injuryType === 'other' && otherInjuryType
      ? otherInjuryType
      : INJURY_TYPES.find(t => t.value === injuryType)?.label.zh || injuryType

    const payload = {
      title: `${bodyPartLabel}${injuryTypeLabel}`,
      description,
      bodyParts: finalBodyParts,
      injuryType: finalInjuryType,
      injuryCause,
      climbingType,
      usualGrade,
      injuryGrade,
      climbingExperience: experience,
      climbingFrequency: frequency,
      didWarmUp: didWarmUp || null,
      wasFatigued: wasFatigued || null,
      soughtMedical: soughtMedical,
      diagnosis: diagnosis || null,
      recoveryDuration: recoveryDuration || null,
      adviceToOthers: advice || null,
    }

    let resultId
    if (isEdit) {
      const { error: updateError } = await updateInjuryReport(editId, payload)
      if (updateError) {
        setError(updateError.message)
        setSubmitting(false)
        return
      }
      resultId = editId
    } else {
      const { data, error: submitError } = await submitInjuryReport(payload)
      if (submitError) {
        setError(submitError.message)
        setSubmitting(false)
        return
      }
      resultId = data.post.id

      // 上传媒体文件
      if (files.length > 0 && resultId) {
        for (let i = 0; i < files.length; i++) {
          await uploadMedia(resultId, files[i], i)
        }
      }
    }

    // 将本次填写的数据回写到攀岩档案（仅填充空字段）
    try {
      const updates = {}
      if (experience && (!climbingProfile || !climbingProfile.experience)) {
        updates.experience = experience
      }
      if (frequency && (!climbingProfile || !climbingProfile.frequency)) {
        updates.frequency = frequency
      }
      if (usualGrade && climbingProfile && !climbingProfile.boulder_grade && !climbingProfile.sport_grade) {
        // 尝试判断是抱石还是运动攀难度
        if (usualGrade.toUpperCase().startsWith('V')) {
          updates.boulder_grade = usualGrade
        } else {
          updates.sport_grade = usualGrade
        }
      }
      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString()
        if (climbingProfile) {
          await supabase.from('climbing_profiles').update(updates).eq('user_id', user.id)
        } else {
          await supabase.from('climbing_profiles').insert({ user_id: user.id, ...updates })
        }
      }
    } catch (e) {
      // 回写失败不影响主流程
    }

    setSubmitting(false)
    navigate(`/injuries/${resultId}`)
  }

  if (loadingEdit) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-text-secondary">加载中...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        {isEdit
          ? (lang === 'zh' ? '编辑伤痛记录' : 'Edit Injury Report')
          : (lang === 'zh' ? '分享你的伤痛经历' : 'Share Your Injury Story')
        }
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        {isEdit
          ? '修改你之前提交的伤痛记录。'
          : '你的经历可以帮助其他攀岩者了解风险、做好预防。所有提交内容将公开展示。'
        }
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── 受伤信息 ── */}
        <section className="bg-stone-card rounded-xl border border-stone-border p-6 space-y-5">
          <h2 className="font-semibold text-lg">受伤信息</h2>

          <MultiSelectChips
            label="受伤部位（可多选）*"
            selected={bodyParts}
            onChange={setBodyParts}
            options={BODY_PARTS}
            lang={lang}
          />
          {bodyParts.includes('other') && (
            <div className="-mt-2">
              <input
                type="text"
                value={otherBodyPart}
                onChange={(e) => setOtherBodyPart(e.target.value)}
                placeholder={lang === 'zh' ? '请输入具体部位' : 'Please specify'}
                className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              />
            </div>
          )}

          <SelectField
            label="受伤类型 *"
            value={injuryType}
            onChange={setInjuryType}
            options={INJURY_TYPES}
            lang={lang}
            required
          />
          {injuryType === 'other' && (
            <div className="-mt-2">
              <input
                type="text"
                value={otherInjuryType}
                onChange={(e) => setOtherInjuryType(e.target.value)}
                placeholder={lang === 'zh' ? '请输入具体伤害类型' : 'Please specify'}
                className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">受伤经过 *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="当时发生了什么？怎么受伤的？"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors resize-y"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">自己认为的原因 *</label>
            <textarea
              value={injuryCause}
              onChange={(e) => setInjuryCause(e.target.value)}
              placeholder="你觉得是什么导致了这次受伤？"
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors resize-y"
              required
            />
          </div>

          <SelectField
            label="攀岩类型 *"
            value={climbingType}
            onChange={setClimbingType}
            options={CLIMBING_TYPES}
            lang={lang}
            required
          />
        </section>

        {/* ── 攀岩背景（关于你） ── */}
        <section className="bg-stone-card rounded-xl border border-stone-border p-6 space-y-5">
          <h2 className="font-semibold text-lg">攀岩背景</h2>
          {climbingProfile && (experience || usualGrade || frequency) && (
            <p className="text-xs text-text-secondary -mt-2">以下信息已从你的攀岩档案中自动填入</p>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">日常水平 *</label>
            <input
              type="text"
              value={usualGrade}
              onChange={(e) => setUsualGrade(e.target.value)}
              placeholder="如 V3, 5.10a"
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="攀岩年限 *"
              value={experience}
              onChange={setExperience}
              options={EXPERIENCE_LEVELS}
              lang={lang}
              required
            />
            <SelectField
              label="攀岩频率 *"
              value={frequency}
              onChange={setFrequency}
              options={FREQUENCY_OPTIONS}
              lang={lang}
              required
            />
          </div>
        </section>

        {/* ── 受伤场景（受伤那一刻） ── */}
        <section className="bg-stone-card rounded-xl border border-stone-border p-6 space-y-5">
          <h2 className="font-semibold text-lg">受伤场景</h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">受伤时攀爬的难度 *</label>
            <input
              type="text"
              value={injuryGrade}
              onChange={(e) => setInjuryGrade(e.target.value)}
              placeholder="如 V5, 5.11c"
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              required
            />
          </div>

          <TriStateField label="受伤前是否热身？" value={didWarmUp} onChange={setDidWarmUp} />
          <TriStateField label="当时是否处于疲劳状态？" value={wasFatigued} onChange={setWasFatigued} />
        </section>

        {/* ── 就医与恢复 ── */}
        <section className="bg-stone-card rounded-xl border border-stone-border p-6 space-y-5">
          <h2 className="font-semibold text-lg">
            就医与恢复
            <span className="text-sm font-normal text-text-secondary ml-2">（选填）</span>
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2">是否就医？</label>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setSoughtMedical(val)}
                  className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
                    soughtMedical === val
                      ? 'bg-forest text-white border-forest'
                      : 'bg-stone-bg border-stone-border hover:border-forest text-text-secondary'
                  }`}
                >
                  {val ? '是' : '否'}
                </button>
              ))}
            </div>
          </div>

          {soughtMedical && (
            <div>
              <label className="block text-sm font-medium mb-1.5">诊断结果</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="医生怎么说的？"
                className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
              />
            </div>
          )}

          <SelectField
            label="恢复时长"
            value={recoveryDuration}
            onChange={setRecoveryDuration}
            options={RECOVERY_DURATIONS}
            lang={lang}
          />
        </section>

        {/* ── 经验分享 ── */}
        <section className="bg-stone-card rounded-xl border border-stone-border p-6 space-y-5">
          <h2 className="font-semibold text-lg">
            经验分享
            <span className="text-sm font-normal text-text-secondary ml-2">（选填，鼓励填写）</span>
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">给其他攀岩者的建议</label>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="经历这次受伤后，你想提醒其他人什么？"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-stone-bg border border-stone-border text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors resize-y"
            />
          </div>
        </section>

        {/* ── 媒体上传（仅新建时） ── */}
        {!isEdit && <section className="bg-stone-card rounded-xl border border-stone-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">
            照片 / 视频
            <span className="text-sm font-normal text-text-secondary ml-2">（选填，最多 5 个）</span>
          </h2>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-stone-bg rounded-lg text-sm">
                  <Icon name={f.type.startsWith('video') ? 'camera' : 'camera'} size={14} className="text-text-secondary" />
                  <span className="max-w-[120px] truncate">{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600">
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length < 5 && (
            <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-stone-border rounded-xl cursor-pointer hover:border-forest hover:bg-forest-light/30 transition-colors">
              <Icon name="plus" size={20} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">点击上传照片或视频</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </section>}

        {/* 错误提示 */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* 提交 */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            {isEdit ? '修改后将即时更新' : '提交即表示同意公开展示此内容'}
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-forest text-white font-medium hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {submitting ? (isEdit ? '保存中...' : '提交中...') : (isEdit ? '保存' : '提交')}
          </button>
        </div>
      </form>
    </div>
  )
}
