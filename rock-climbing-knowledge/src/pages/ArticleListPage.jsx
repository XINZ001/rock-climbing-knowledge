import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icon } from '../utils/icons'
import ArticleCard from '../components/article/ArticleCard'
import PageSEO from '../components/PageSEO'
import articleRegistry from '../data/article-registry.json'

const categoryIcons = { beginner: 'rocket', progression: 'trendingUp', training: 'dumbbell', outdoor: 'sun' }

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized
  const int = Number.parseInt(value, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function ArticleListPage() {
  const { t, lang } = useApp()
  const { categories, articles } = articleRegistry

  const articlesByCategory = useMemo(() => {
    const map = {}
    categories.forEach(cat => {
      map[cat.id] = articles.filter(a => a.category === cat.id)
    })
    return map
  }, [articles, categories])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageSEO
        path="/articles"
        title={lang === 'zh' ? '攀岩专栏 | 攀岩知识库' : lang === 'en' ? 'Climbing Column | Climbing Knowledge Base' : '클라이밍 칼럼 | 클라이밍 지식 라이브러리'}
      />

      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-forest transition-colors mb-6"
      >
        <Icon name="chevronLeft" size={16} />
        {lang === 'zh' ? '首页' : lang === 'en' ? 'Home' : '홈'}
      </Link>

      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Icon name="fileText" size={28} style={{ color: '#00897B' }} />
          {lang === 'zh' ? '攀岩专栏' : lang === 'en' ? 'Climbing Column' : '클라이밍 칼럼'}
        </h1>
        {lang === 'zh' && (
          <p className="text-sm text-text-secondary mt-0.5">Climbing Column</p>
        )}
        <p className="text-sm text-text-secondary mt-2 leading-relaxed max-w-2xl">
          {lang === 'zh'
            ? '深度解答攀岩者最关心的问题——从入门到进阶的必读指南'
            : lang === 'en'
            ? 'In-depth answers to the most common climbing questions — essential guides from beginner to advanced'
            : '클라이머들이 가장 궁금해하는 질문에 대한 심층 답변 — 초급부터 고급까지의 필독 가이드'}
        </p>
      </div>

      {/* Category sections */}
      <div className="space-y-10">
        {categories.map(cat => {
          const catArticles = articlesByCategory[cat.id] || []
          const previewArticles = catArticles.slice(0, 4)
          const hasMore = catArticles.length > 4

          return (
            <section key={cat.id}>
              {/* Category header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon name={categoryIcons[cat.id] || 'book'} size={16} />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">{t(cat.title)}</h2>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {t(cat.description)}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/articles/category/${cat.id}`}
                  className="flex items-center gap-1 text-sm font-medium shrink-0 transition-colors hover:underline"
                  style={{ color: cat.color }}
                >
                  {lang === 'zh'
                    ? `全部 ${catArticles.length} 篇 →`
                    : lang === 'en'
                    ? `All ${catArticles.length} →`
                    : `전체 ${catArticles.length}편 →`}
                </Link>
              </div>

              {/* Article grid — show up to 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {previewArticles.map(article => (
                  <ArticleCard key={article.id} article={article} variant="large" />
                ))}
              </div>

              {/* "View all" button if more than 4 */}
              {hasMore && (
                <div className="mt-4 text-center">
                  <Link
                    to={`/articles/category/${cat.id}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium border transition-colors hover:text-white"
                    style={{
                      color: cat.color,
                      borderColor: hexToRgba(cat.color, 0.3),
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = cat.color
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = cat.color
                    }}
                  >
                    {lang === 'zh'
                      ? `查看全部${t(cat.title)}文章`
                      : lang === 'en'
                      ? `View all ${t(cat.title)} articles`
                      : `${t(cat.title)} 전체 보기`}
                    <Icon name="chevronRight" size={14} />
                  </Link>
                </div>
              )}

              {catArticles.length === 0 && (
                <div className="text-center py-8 text-text-secondary text-sm rounded-xl bg-stone-bg/50 border border-dashed border-stone-border">
                  {lang === 'zh' ? '即将上线' : lang === 'en' ? 'Coming soon' : '곧 제공됩니다'}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
