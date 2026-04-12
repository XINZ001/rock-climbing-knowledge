/**
 * 搜索质量自动化测试脚本
 *
 * 用法: node tests/search-benchmark.mjs
 *
 * 功能:
 * 1. 加载与 AppContext 完全一致的 Fuse.js 配置
 * 2. 构建合并 search-synonyms + kp-registry keywords 的搜索索引
 * 3. 逐条跑测试用例，对比期望 ID 是否出现在 top-20 结果中
 * 4. 输出整体通过率 + 按类别汇总 + 失败详情
 */

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import Fuse from 'fuse.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'src', 'data')

// ── 加载数据 ──
const sectionsIndex = JSON.parse(fs.readFileSync(path.join(dataDir, 'sections.json'), 'utf-8'))
const kpRegistry = JSON.parse(fs.readFileSync(path.join(dataDir, 'kp-registry.json'), 'utf-8'))
const searchSynonyms = JSON.parse(fs.readFileSync(path.join(dataDir, 'search-synonyms.json'), 'utf-8'))
const articleRegistry = JSON.parse(fs.readFileSync(path.join(dataDir, 'article-registry.json'), 'utf-8'))
const athleteRegistry = JSON.parse(fs.readFileSync(path.join(dataDir, 'athlete-registry.json'), 'utf-8'))
const testCases = JSON.parse(fs.readFileSync(path.join(__dirname, 'search-test-cases.json'), 'utf-8'))

// ── 加载 section 数据文件 ──
const sectionFiles = fs.readdirSync(dataDir).filter(f => /^section-\d+-\w+\.json$/.test(f))

const allDocs = []
const sections = sectionsIndex.sections

for (const file of sectionFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'))
  if (!data?.subSections) continue
  const section = sections.find(s => s.id === data.sectionId)
  if (!section) continue

  for (const sub of data.subSections) {
    if (!sub.knowledgePoints) continue
    for (const kp of sub.knowledgePoints) {
      const registryEntry = kpRegistry.registry.find(r => r.id === kp.id)
      const keywords = registryEntry?.keywords?.join(' ') || ''
      allDocs.push({
        id: kp.id,
        _type: 'kp',
        sectionId: data.sectionId,
        sectionSlug: section.slug,
        sectionTitle_zh: section.title.zh,
        sectionTitle_en: section.title.en,
        sectionTitle_ko: section.title.ko || '',
        subSectionSlug: sub.slug,
        subTitle_zh: sub.title.zh,
        subTitle_en: sub.title.en,
        subTitle_ko: sub.title.ko || '',
        title_zh: kp.title.zh,
        title_en: kp.title.en,
        title_ko: kp.title.ko || '',
        content_zh: kp.content?.zh || '',
        content_en: kp.content?.en || '',
        content_ko: kp.content?.ko || '',
        terms_zh: (kp.terms || []).map(t => t.zh).join(' '),
        terms_en: (kp.terms || []).map(t => t.en).join(' '),
        terms_ko: (kp.terms || []).map(t => t.ko || '').join(' '),
        tags: (kp.tags || []).join(' '),
        keywords,
        synonyms: searchSynonyms[kp.id] || ''
      })
    }
  }
}

// ── 文章索引 ──
for (const article of articleRegistry.articles) {
  const cat = articleRegistry.categories.find(c => c.id === article.category)
  allDocs.push({
    id: article.id,
    _type: 'article',
    slug: article.slug,
    title_zh: article.title?.zh || '',
    title_en: article.title?.en || '',
    title_ko: article.title?.ko || '',
    content_zh: article.subtitle?.zh || '',
    content_en: article.subtitle?.en || '',
    content_ko: article.subtitle?.ko || '',
    terms_zh: '',
    terms_en: '',
    terms_ko: '',
    tags: (article.tags || []).join(' '),
    keywords: (article.seo?.keywords || []).join(' '),
    synonyms: '',
  })
}

// ── 运动员索引 ──
for (const athlete of athleteRegistry.athletes) {
  allDocs.push({
    id: athlete.athleteId,
    _type: 'athlete',
    slug: athlete.slug,
    title_zh: athlete.athleteName?.zh || '',
    title_en: athlete.athleteName?.en || '',
    title_ko: athlete.athleteName?.ko || '',
    content_zh: (athlete.tagline?.zh || '') + ' ' + (athlete.overview?.zh || ''),
    content_en: (athlete.tagline?.en || '') + ' ' + (athlete.overview?.en || ''),
    content_ko: (athlete.tagline?.ko || '') + ' ' + (athlete.overview?.ko || ''),
    terms_zh: athlete.nationality?.zh || '',
    terms_en: athlete.nationality?.en || '',
    terms_ko: athlete.nationality?.ko || '',
    tags: [athlete.category, athlete.subcategory].filter(Boolean).join(' '),
    keywords: '',
    synonyms: '',
  })
}

// ── 构建 Fuse 索引 (与 AppContext 完全一致) ──
const fuse = new Fuse(allDocs, {
  keys: [
    { name: 'title_zh', weight: 3.0 },
    { name: 'title_en', weight: 3.0 },
    { name: 'title_ko', weight: 3.0 },
    { name: 'terms_zh', weight: 2.5 },
    { name: 'terms_en', weight: 2.5 },
    { name: 'terms_ko', weight: 2.5 },
    { name: 'synonyms', weight: 2.0 },
    { name: 'keywords', weight: 2.0 },
    { name: 'tags', weight: 1.5 },
    { name: 'content_zh', weight: 1.0 },
    { name: 'content_en', weight: 1.0 },
    { name: 'content_ko', weight: 1.0 },
  ],
  threshold: 0.4,
  includeMatches: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
})

// ── 运行测试 ──
console.log(`\n📦 索引总文档数: ${allDocs.length} (KP: ${allDocs.filter(d => d._type === 'kp').length}, 文章: ${allDocs.filter(d => d._type === 'article').length}, 运动员: ${allDocs.filter(d => d._type === 'athlete').length})`)
console.log(`🧪 测试用例数: ${testCases.testCases.length}\n`)
console.log('─'.repeat(80))

let totalPass = 0
let totalFail = 0
let totalSkip = 0
const categoryStats = {}
const failures = []

for (const tc of testCases.testCases) {
  // Skip cases with empty expectedIds (unresolved athlete IDs etc.)
  if (tc.expectedIds.length === 0) {
    totalSkip++
    continue
  }

  const results = fuse.search(tc.query).slice(0, 20)
  const resultIds = results.map(r => r.item.id)

  // A test case passes if at least one expected ID is in top-20
  const foundIds = tc.expectedIds.filter(id => resultIds.includes(id))
  const missedIds = tc.expectedIds.filter(id => !resultIds.includes(id))

  // Calculate hit rate for this case
  const hitRate = foundIds.length / tc.expectedIds.length

  const cat = tc.category || 'uncategorized'
  if (!categoryStats[cat]) categoryStats[cat] = { pass: 0, fail: 0, partial: 0, totalHitRate: 0, count: 0 }
  categoryStats[cat].count++
  categoryStats[cat].totalHitRate += hitRate

  if (hitRate === 1) {
    totalPass++
    categoryStats[cat].pass++
  } else if (hitRate > 0) {
    totalPass++ // partial pass still counts
    categoryStats[cat].partial++
    failures.push({
      query: tc.query,
      category: cat,
      hitRate: `${foundIds.length}/${tc.expectedIds.length}`,
      found: foundIds,
      missed: missedIds,
      topResults: resultIds.slice(0, 5),
    })
  } else {
    totalFail++
    categoryStats[cat].fail++
    failures.push({
      query: tc.query,
      category: cat,
      hitRate: `0/${tc.expectedIds.length}`,
      found: [],
      missed: missedIds,
      topResults: resultIds.slice(0, 5),
    })
  }
}

// ── 输出结果 ──
const total = totalPass + totalFail
console.log(`\n✅ 通过: ${totalPass}/${total}  ❌ 失败: ${totalFail}/${total}  ⏭️ 跳过: ${totalSkip}`)
console.log(`📊 通过率: ${(totalPass / total * 100).toFixed(1)}%\n`)

console.log('─'.repeat(80))
console.log('📂 按类别汇总:\n')
const sortedCats = Object.entries(categoryStats).sort((a, b) => {
  const rateA = a[1].totalHitRate / a[1].count
  const rateB = b[1].totalHitRate / b[1].count
  return rateA - rateB
})
for (const [cat, stats] of sortedCats) {
  const avgHitRate = (stats.totalHitRate / stats.count * 100).toFixed(0)
  const status = stats.fail > 0 ? '❌' : stats.partial > 0 ? '⚠️' : '✅'
  console.log(`  ${status} ${cat.padEnd(16)} 平均命中 ${avgHitRate}%  (全中 ${stats.pass} | 部分 ${stats.partial} | 全miss ${stats.fail})`)
}

if (failures.length > 0) {
  console.log('\n' + '─'.repeat(80))
  console.log(`\n🔍 失败/部分命中详情 (${failures.length} 条):\n`)
  for (const f of failures) {
    const icon = f.found.length === 0 ? '❌' : '⚠️'
    console.log(`${icon} "${f.query}" [${f.category}] 命中 ${f.hitRate}`)
    if (f.found.length > 0) console.log(`   ✓ 命中: ${f.found.join(', ')}`)
    console.log(`   ✗ 遗漏: ${f.missed.join(', ')}`)
    console.log(`   → 实际 top-5: ${f.topResults.join(', ')}`)
    console.log()
  }
}

// ── 输出需要补充同义词的 KP 建议 ──
console.log('─'.repeat(80))
console.log('\n💡 需要补充同义词的 KP (出现在遗漏列表中):\n')
const missedKpCount = {}
for (const f of failures) {
  for (const id of f.missed) {
    if (!missedKpCount[id]) missedKpCount[id] = { count: 0, queries: [] }
    missedKpCount[id].count++
    missedKpCount[id].queries.push(f.query)
  }
}
const sortedMissed = Object.entries(missedKpCount).sort((a, b) => b[1].count - a[1].count)
for (const [id, info] of sortedMissed.slice(0, 30)) {
  const currentSynonyms = searchSynonyms[id] || '(无)'
  console.log(`  ${id} (遗漏 ${info.count} 次)`)
  console.log(`    查询词: ${info.queries.join(', ')}`)
  console.log(`    当前同义词: ${currentSynonyms.slice(0, 80)}...`)
  console.log()
}
