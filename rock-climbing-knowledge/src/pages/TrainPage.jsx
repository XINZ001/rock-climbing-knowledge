import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import PageSEO from '../components/PageSEO'
import questData from '../data/quests.json'

const QUEST_STORAGE_KEY = 'quest-progress'

function loadQuestProgress() {
  try { return JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY)) || {} }
  catch { return {} }
}

export default function TrainPage() {
  const { lang } = useApp()
  const [questProgress] = useState(loadQuestProgress)

  const tt = (zh, en, ko) => lang === 'zh' ? zh : lang === 'en' ? en : (ko || en)

  // Quest stats
  const questStats = useMemo(() => {
    const total = questData.quests.length
    const completed = questData.quests.filter(q => (questProgress[q.id]?.times || 0) >= 1).length
    const totalCompletions = questData.quests.reduce((sum, q) => sum + (questProgress[q.id]?.times || 0), 0)
    return { total, completed, totalCompletions }
  }, [questProgress])

  const tools = [
    {
      id: 'diagnosis',
      icon: '📊',
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      title: { zh: '能力诊断', en: 'Ability Diagnosis', ko: '능력 진단' },
      desc: { zh: '回答几个问题，找到你的攀岩弱项和提升方向', en: 'Answer a few questions to find your weaknesses', ko: '몇 가지 질문에 답하고 약점을 찾으세요' },
      cta: { zh: '开始诊断', en: 'Start Diagnosis', ko: '진단 시작' },
      link: '/diagnosis',
      stat: null,
    },
    {
      id: 'quests',
      icon: '🎯',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
      title: { zh: '每日微任务', en: 'Daily Quests', ko: '데일리 퀘스트' },
      desc: { zh: '具体可执行的小挑战，完成后解锁成就卡', en: 'Bite-sized challenges with achievement cards', ko: '작은 도전으로 성취 카드 잠금해제' },
      cta: { zh: '查看任务', en: 'View Quests', ko: '퀘스트 보기' },
      link: '/quests',
      stat: `${questStats.completed}/${questStats.total}`,
    },
    {
      id: 'injuries',
      icon: '🩹',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.2)',
      title: { zh: '伤痛日记', en: 'Injury Diary', ko: '부상 일기' },
      desc: { zh: '记录受伤与恢复过程，管理你的身体状态', en: 'Track injuries and recovery over time', ko: '부상과 회복을 기록하세요' },
      cta: { zh: '查看记录', en: 'View Records', ko: '기록 보기' },
      link: '/injuries',
      stat: null,
    },
    {
      id: 'mbti',
      icon: '🐒',
      color: '#EC4899',
      bgColor: 'rgba(236, 72, 153, 0.08)',
      borderColor: 'rgba(236, 72, 153, 0.2)',
      title: { zh: '攀岩人格测试', en: 'Climbing Persona (SBTI)', ko: '클라이밍 유형 테스트' },
      desc: { zh: '12 道题，测出你的攀岩动物人格', en: '12 questions to discover your climbing animal', ko: '12문항으로 나의 클라이밍 동물 찾기' },
      cta: { zh: '开始测试', en: 'Take the Quiz', ko: '테스트 시작' },
      link: '/climbing-mbti',
      stat: null,
    },
  ]

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-8">
      <PageSEO path="/train" />

      {/* Hero */}
      <div className="text-center mb-10 mt-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 text-white mb-4">
          <span className="text-2xl">💪</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {tt('今天练什么？', 'What to train today?', '오늘 뭘 연습할까요?')}
        </h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          {tt(
            '诊断弱项、完成任务、记录伤痛——让每次训练更有方向',
            'Diagnose weaknesses, complete quests, track injuries',
            '약점 진단, 퀘스트 완료, 부상 기록'
          )}
        </p>
      </div>

      {/* Quick Stats Bar */}
      {questStats.totalCompletions > 0 && (
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span>🎯</span>
            <span>{tt(`已完成 ${questStats.totalCompletions} 次训练`, `${questStats.totalCompletions} total completions`, `총 ${questStats.totalCompletions}회 완료`)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📊</span>
            <span>{tt(`解锁 ${questStats.completed}/${questStats.total} 任务`, `${questStats.completed}/${questStats.total} unlocked`, `${questStats.completed}/${questStats.total} 잠금해제`)}</span>
          </div>
        </div>
      )}

      {/* Tool Cards */}
      <div className="space-y-4">
        {tools.map(tool => (
          <Link
            key={tool.id}
            to={tool.link}
            className="group block rounded-2xl border bg-stone-card p-5 hover:shadow-md transition-all"
            style={{ borderColor: tool.borderColor, background: tool.bgColor }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: `${tool.color}15` }}
              >
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold">{tool.title[lang] || tool.title.zh}</h3>
                  {tool.stat && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tool.color}20`, color: tool.color }}>
                      {tool.stat}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {tool.desc[lang] || tool.desc.zh}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                  style={{ color: tool.color }}
                >
                  {tool.cta[lang] || tool.cta.zh}
                  <Icon name="chevronRight" size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom link to learn */}
      <div className="text-center mt-10">
        <Link to="/learn" className="text-sm text-text-secondary hover:text-forest transition-colors">
          {tt('想先学知识？去「学」→', 'Want to learn first? Go to Learn →', '먼저 배우고 싶다면? 학습 →')}
        </Link>
      </div>
    </div>
  )
}
