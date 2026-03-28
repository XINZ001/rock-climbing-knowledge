import { useSearchParams, Link } from 'react-router-dom'
import { useMemo, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { search, searchSuggest, searchReady, lang } = useApp()

  const results = useMemo(() => {
    if (!query.trim()) return []
    return search(query)
  }, [query, search])

  // Looser suggestions shown only when main search returns nothing
  const suggestions = useMemo(() => {
    if (!searchReady || results.length > 0 || !query.trim()) return []
    return searchSuggest(query)
  }, [searchReady, results, query, searchSuggest])

  // Log failed queries to localStorage for future synonym improvements
  useEffect(() => {
    if (searchReady && results.length === 0 && query.trim()) {
      try {
        const failed = JSON.parse(localStorage.getItem('failedSearches') || '[]')
        if (!failed.includes(query.trim())) {
          failed.push(query.trim())
          localStorage.setItem('failedSearches', JSON.stringify(failed.slice(-100)))
        }
      } catch {
        // ignore localStorage errors
      }
    }
  }, [searchReady, results, query])

  // Group by section
  const grouped = useMemo(() => {
    const groups = {}
    results.forEach(r => {
      const key = r.item.sectionSlug
      if (!groups[key]) {
        groups[key] = {
          sectionTitle: lang === 'zh' ? r.item.sectionTitle_zh : lang === 'en' ? r.item.sectionTitle_en : (r.item.sectionTitle_ko || r.item.sectionTitle_en),
          items: []
        }
      }
      groups[key].items.push(r)
    })
    return groups
  }, [results, lang])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-1">
        {lang === 'zh' ? '搜索结果' : lang === 'en' ? 'Search Results' : '검색 결과'}
      </h1>
      {query && (
        <p className="text-sm text-text-secondary mb-6">
          "{query}" — {lang === 'zh' ? `找到 ${results.length} 个结果` : lang === 'en' ? `${results.length} results found` : `${results.length}개 결과`}
        </p>
      )}

      {!searchReady && (
        <p className="text-sm text-text-secondary py-8 text-center">
          {lang === 'zh' ? '搜索索引加载中...' : lang === 'en' ? 'Loading search index...' : '검색 인덱스 로딩 중...'}
        </p>
      )}

      {searchReady && results.length === 0 && query && (
        <div className="text-center py-10 text-text-secondary">
          <p>{lang === 'zh' ? `未找到与 "${query}" 相关的结果` : lang === 'en' ? `No results found for "${query}"` : `"${query}"에 대한 결과를 찾을 수 없습니다`}</p>
          <p className="text-xs mt-2">
            {lang === 'zh' ? '尝试使用不同的关键词，或切换中英文搜索' : lang === 'en' ? 'Try different keywords, or switch between Chinese and English' : '다른 키워드를 시도하거나 언어를 전환해 보세요'}
          </p>

          {suggestions.length > 0 && (
            <div className="mt-6 text-left max-w-sm mx-auto">
              <p className="text-xs font-semibold text-text-secondary mb-2">
                {lang === 'zh' ? '💡 你是否在找：' : lang === 'en' ? '💡 Did you mean:' : '💡 혹시 찾으시는 건:'}
              </p>
              <div className="space-y-1.5">
                {suggestions.map(r => (
                  <Link
                    key={r.item.id}
                    to={`/section/${r.item.sectionSlug}/${r.item.subSectionSlug}#${r.item.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-card border border-stone-border hover:border-forest/40 transition-colors text-sm"
                  >
                    <span className="font-medium">
                      {lang === 'zh' ? r.item.title_zh : lang === 'en' ? r.item.title_en : (r.item.title_ko || r.item.title_en)}
                    </span>
                    <span className="text-xs text-text-secondary ml-auto">
                      {lang === 'zh' ? r.item.subTitle_zh : lang === 'en' ? r.item.subTitle_en : (r.item.subTitle_ko || r.item.subTitle_en)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([sectionSlug, group]) => (
          <div key={sectionSlug}>
            <h2 className="text-sm font-semibold text-text-secondary mb-2">{group.sectionTitle}</h2>
            <div className="space-y-2">
              {group.items.map(r => (
                <Link
                  key={r.item.id}
                  to={`/section/${r.item.sectionSlug}/${r.item.subSectionSlug}#${r.item.id}`}
                  className="card-hover block bg-stone-card rounded-lg border border-stone-border p-4 hover:border-forest/30 transition-colors"
                >
                  <div className="font-medium text-sm">
                    {lang === 'zh' ? r.item.title_zh : lang === 'en' ? r.item.title_en : (r.item.title_ko || r.item.title_en)}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {lang === 'zh' ? r.item.subTitle_zh : lang === 'en' ? r.item.subTitle_en : (r.item.subTitle_ko || r.item.subTitle_en)}
                  </div>
                  {r.item.terms_zh && (
                    <div className="text-xs text-text-secondary mt-1 truncate">
                      {r.item.terms_zh}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
