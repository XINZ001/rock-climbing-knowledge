import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import Fuse from 'fuse.js'
import sectionsIndex from '../data/sections.json'
import searchSynonyms from '../data/search-synonyms.json'
import kpRegistry from '../data/kp-registry.json'

const AppContext = createContext(null)

const sectionDataModules = import.meta.glob('../data/section-*.json')

export function AppProvider({ children }) {
  const [sections] = useState(sectionsIndex.sections)
  const [loadedSections, setLoadedSections] = useState({})
  const [searchIndex, setSearchIndex] = useState(null)
  const [searchIndexLoose, setSearchIndexLoose] = useState(null)
  const [searchReady, setSearchReady] = useState(false)
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'zh')

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const loadSectionData = useCallback(async (sectionId) => {
    if (loadedSections[sectionId]) return loadedSections[sectionId]

    const section = sections.find(s => s.id === sectionId)
    if (!section) return null

    const fileName = `section-${sectionId.split('-')[1]}`
    const matchingKey = Object.keys(sectionDataModules).find(key => key.includes(fileName))

    if (!matchingKey) return null

    try {
      const mod = await sectionDataModules[matchingKey]()
      const data = mod.default || mod
      setLoadedSections(prev => ({ ...prev, [sectionId]: data }))
      return data
    } catch {
      return null
    }
  }, [loadedSections, sections])

  // Build search index after initial render
  useEffect(() => {
    const buildIndex = async () => {
      const allDocs = []

      const loadPromises = Object.entries(sectionDataModules).map(async ([key, loader]) => {
        try {
          const mod = await loader()
          return mod.default || mod
        } catch {
          return null
        }
      })

      const allData = await Promise.all(loadPromises)

      allData.forEach(data => {
        if (!data?.subSections) return
        const section = sections.find(s => s.id === data.sectionId)
        if (!section) return

        data.subSections.forEach(sub => {
          if (!sub.knowledgePoints) return
          sub.knowledgePoints.forEach(kp => {
            const registryEntry = kpRegistry.registry.find(r => r.id === kp.id)
            const keywords = registryEntry?.keywords?.join(' ') || ''
            allDocs.push({
              id: kp.id,
              sectionId: data.sectionId,
              sectionSlug: section.slug,
              sectionTitle_zh: section.title.zh,
              sectionTitle_en: section.title.en,
              subSectionSlug: sub.slug,
              subTitle_zh: sub.title.zh,
              subTitle_en: sub.title.en,
              title_zh: kp.title.zh,
              title_en: kp.title.en,
              content_zh: kp.content?.zh || '',
              content_en: kp.content?.en || '',
              terms_zh: (kp.terms || []).map(t => t.zh).join(' '),
              terms_en: (kp.terms || []).map(t => t.en).join(' '),
              tags: (kp.tags || []).join(' '),
              keywords,
              synonyms: searchSynonyms[kp.id] || ''
            })
          })
        })

        // Also cache loaded data
        setLoadedSections(prev => ({ ...prev, [data.sectionId]: data }))
      })

      if (allDocs.length > 0) {
        const fuse = new Fuse(allDocs, {
          keys: [
            { name: 'title_zh', weight: 3.0 },
            { name: 'title_en', weight: 3.0 },
            { name: 'terms_zh', weight: 2.5 },
            { name: 'terms_en', weight: 2.5 },
            { name: 'synonyms', weight: 2.0 },
            { name: 'keywords', weight: 2.0 },
            { name: 'tags', weight: 1.5 },
            { name: 'content_zh', weight: 1.0 },
            { name: 'content_en', weight: 1.0 }
          ],
          threshold: 0.4,
          includeMatches: true,
          minMatchCharLength: 1,
          ignoreLocation: true
        })
        setSearchIndex(fuse)

        // Loose fallback index for "did you mean" suggestions
        const fuseLoose = new Fuse(allDocs, {
          keys: [
            { name: 'title_zh', weight: 3.0 },
            { name: 'title_en', weight: 3.0 },
            { name: 'terms_zh', weight: 2.5 },
            { name: 'terms_en', weight: 2.5 },
            { name: 'synonyms', weight: 2.0 },
            { name: 'keywords', weight: 2.0 },
            { name: 'tags', weight: 1.5 },
            { name: 'content_zh', weight: 1.0 },
            { name: 'content_en', weight: 1.0 }
          ],
          threshold: 0.6,
          includeMatches: false,
          minMatchCharLength: 1,
          ignoreLocation: true
        })
        setSearchIndexLoose(fuseLoose)
      }
      setSearchReady(true)
    }

    buildIndex()
  }, [sections])

  const search = useCallback((query) => {
    if (!searchIndex || !query.trim()) return []
    return searchIndex.search(query.trim()).slice(0, 20)
  }, [searchIndex])

  // Loose search for "did you mean" suggestions (threshold 0.6)
  const searchSuggest = useCallback((query) => {
    if (!searchIndexLoose || !query.trim()) return []
    return searchIndexLoose.search(query.trim()).slice(0, 5)
  }, [searchIndexLoose])

  const t = useCallback((obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return obj[lang] || obj.zh || obj.en || ''
  }, [lang])

  return (
    <AppContext.Provider value={{
      sections,
      loadedSections,
      loadSectionData,
      search,
      searchSuggest,
      searchReady,
      lang,
      setLang,
      t
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
