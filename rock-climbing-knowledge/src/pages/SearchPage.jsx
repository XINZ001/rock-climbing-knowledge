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
          sectionTitle: lang === 'zh' ? r.item.sectionTitle_zh : r.item.sectionTitle_en,
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
        {lang === 'zh' ? '搜索结果' : 'Search Results'}
      </h1>
      {query && (
        <p className="text-sm text-text-secondary mb-6">
          "{query}" — {lang === 'zh' ? `找到 ${results.length} 个结果` : `${results.length} results found`}
        </p>
      )}

      {!searchReady && (
        <p className="text-sm text-text-secondary py-8 text-center">
          {lang === 'zh' ? '搜索索引加载中...' : 'Loading search index...'}
        </p>
      )}

      {searchReady && results.length === 0 && query && (
        <div className="text-center py-10 text-text-secondary">
          <p>{lang === 'zh' ? `未找到与 "${query}" 相关的结果` : `No results found for "${query}"`}</p>
          <p className="text-xs mt-2">
            {lang === 'zh' ? '尝试使用不同的关键词，或切换中英文搜索' : 'Try different keywords, or switch between Chinese and English'}
          </p>

          {suggestions.length > 0 && (
            <div className="mt-6 text-left max-w-sm mx-auto">
              <p className="text-xs font-semibold text-text-secondary mb-2">
                {lang === 'zh' ? '💡 你是否在找：' : '💡 Did you mean:'}
              </p>
              <div className="space-y-1.5">
                {suggestions.map(r => (
                  <Link
                    key={r.item.id}
                    to={`/section/${r.item.sectionSlug}/${r.item.subSectionSlug}#${r.item.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-card border border-stone-border hover:border-forest/40 transition-colors text-sm"
                  >
                    <span className="font-medium">
                      {lang === 'zh' ? r.item.title_zh : r.item.title_en}
                    </span>
                    <span className="text-xs text-text-secondary ml-auto">
                      {lang === 'zh' ? r.item.subTitle_zh : r.item.subTitle_en}
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
                  className="block bg-stone-card rounded-lg border border-stone-border p-4 hover:shadow-sm hover:border-forest/30 transition-all"
                >
                  <div className="font-medium text-sm">
                    {lang === 'zh' ? r.item.title_zh : r.item.title_en}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {lang === 'zh' ? r.item.subTitle_zh : r.item.subTitle_en}
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
