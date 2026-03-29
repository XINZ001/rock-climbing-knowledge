import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import PageSEO from '../components/PageSEO'
import { getDiagnosisHistory } from '../lib/diagnosis'
import diagnosisTree from '../data/diagnosis-tree.json'

const personaMap = Object.fromEntries(
  (diagnosisTree.personas || []).map((p) => [p.id, p])
)

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const { lang } = useApp()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const tt = (zh, en, ko) => lang === 'zh' ? zh : lang === 'en' ? en : ko

  useEffect(() => {
    if (!user) return
    getDiagnosisHistory().then(({ data }) => {
      setHistory(data || [])
      setLoading(false)
    })
  }, [user])

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">
          {tt('请先登录', 'Please log in first', '먼저 로그인해 주세요')}
        </p>
      </div>
    )
  }

  const displayName = profile?.username || tt('攀岩者', 'Climber', '클라이머')

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <PageSEO
        title={tt('个人主页', 'My Profile', '마이페이지')}
        path="/profile"
      />

      <div className="max-w-2xl mx-auto">
        {/* User header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center text-xl font-bold text-forest">
            {displayName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{displayName}</h1>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex gap-3 mb-8">
          <Link
            to="/climbing-profile"
            className="flex-1 flex items-center gap-2 rounded-xl border border-stone-border bg-stone-card px-4 py-3 text-sm hover:border-forest/30 transition-colors"
          >
            <Icon name="mountain" size={16} className="text-forest" />
            {tt('攀岩档案', 'Climbing Profile', '클라이밍 프로필')}
          </Link>
          <Link
            to="/settings"
            className="flex-1 flex items-center gap-2 rounded-xl border border-stone-border bg-stone-card px-4 py-3 text-sm hover:border-forest/30 transition-colors"
          >
            <Icon name="edit" size={16} className="text-forest" />
            {tt('个人设置', 'Settings', '설정')}
          </Link>
        </div>

        {/* Diagnosis history */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="text-xl">🐒</span>
              {tt('攀岩动物人格', 'Climbing Animal Persona', '클라이밍 동물 인격')}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-text-secondary text-sm">
              {tt('加载中...', 'Loading...', '로딩 중...')}
            </div>
          ) : history.length === 0 ? (
            <Link
              to="/diagnosis"
              className="block rounded-2xl border-2 border-dashed border-stone-border p-8 text-center hover:border-forest/30 transition-colors"
            >
              <div className="text-4xl mb-3">🐒</div>
              <p className="text-sm font-medium mb-1">
                {tt('还没有测试过', "You haven't taken the test yet", '아직 테스트를 하지 않았어요')}
              </p>
              <p className="text-xs text-text-secondary">
                {tt('测测你的攀岩动物人格，找到你的瓶颈和学习路径', 'Discover your climbing animal persona', '나의 클라이밍 동물을 찾아보세요')}
              </p>
            </Link>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((record, idx) => {
                const persona = personaMap[record.persona_id]
                const date = new Date(record.created_at)
                const dateStr = date.toLocaleDateString(
                  lang === 'zh' ? 'zh-CN' : lang === 'ko' ? 'ko-KR' : 'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )

                // Extract some answers for context
                const answers = record.answers || {}
                const levelStep = diagnosisTree.steps.find((s) => s.id === 'level')
                const levelOpt = levelStep?.options?.find((o) => o.id === answers.level)
                const levelLabel = levelOpt ? (levelOpt.label[lang] || levelOpt.label.zh) : ''

                return (
                  <Link
                    to="/diagnosis"
                    key={record.id}
                    className={`block rounded-2xl border bg-stone-card p-5 hover:border-forest/30 hover:shadow-sm transition-all ${
                      idx === 0 ? 'border-forest/30 shadow-sm' : 'border-stone-border'
                    }`}
                  >
                    {idx === 0 && (
                      <div className="text-xs text-forest font-medium mb-2">
                        {tt('最新结果', 'Latest Result', '최신 결과')}
                      </div>
                    )}

                    {persona ? (
                      <div className="flex items-start gap-4">
                        <div className="text-4xl shrink-0">{persona.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold">
                            {persona.name[lang] || persona.name.zh}
                          </h3>
                          <p className="text-xs text-forest font-medium mt-0.5">
                            {persona.tagline[lang] || persona.tagline.zh}
                          </p>
                          <div className="mt-2 text-xs text-text-secondary flex flex-wrap gap-x-3 gap-y-1">
                            <span>{dateStr}</span>
                            {levelLabel && <span>· {levelLabel}</span>}
                            {(record.fusion_rule_ids || []).length > 0 && (
                              <span>· {record.fusion_rule_ids.length} {tt('项洞察', 'insights', '개 인사이트')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">📊</div>
                        <div>
                          <h3 className="text-sm font-medium">{dateStr}</h3>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {levelLabel}
                          </p>
                        </div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
