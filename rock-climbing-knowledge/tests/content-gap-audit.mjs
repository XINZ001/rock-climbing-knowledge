#!/usr/bin/env node
/**
 * content-gap-audit.mjs — 内容缺口自动检测工具
 *
 * 设计思路（三层检测模型）:
 * ────────────────────────────────────────
 * Layer 1: Search Coverage  — "搜得到吗？" → Fuse.js 是否返回结果
 * Layer 2: Content Relevance — "内容对吗？" → 返回的KP内容是否真正回答了用户问题
 * Layer 3: Content Depth     — "够深吗？"   → 直接相关的KP内容是否充分
 *
 * 之前我们只做了 Layer 1（search-benchmark.mjs）。
 * 这个工具补上 Layer 2 和 Layer 3。
 *
 * 使用方式:
 *   node tests/content-gap-audit.mjs                    # 审计所有 marquee 查询
 *   node tests/content-gap-audit.mjs --full              # 审计所有 test cases
 *   node tests/content-gap-audit.mjs --query "泵了"       # 审计单个查询
 */

import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Fuse from 'fuse.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA = join(ROOT, 'src', 'data')

// ── Load Data ──────────────────────────────────────────────────────────

function loadAllDocs() {
  const sectionsIndex = JSON.parse(readFileSync(join(DATA, 'sections.json'), 'utf-8'))
  const kpRegistry = JSON.parse(readFileSync(join(DATA, 'kp-registry.json'), 'utf-8'))
  const searchSynonyms = JSON.parse(readFileSync(join(DATA, 'search-synonyms.json'), 'utf-8'))
  const articleRegistry = JSON.parse(readFileSync(join(DATA, 'article-registry.json'), 'utf-8'))
  const athleteRegistry = JSON.parse(readFileSync(join(DATA, 'athlete-registry.json'), 'utf-8'))

  const sectionFiles = readdirSync(DATA).filter(f => /^section-\d+-\w+\.json$/.test(f))
  const docs = []

  for (const file of sectionFiles) {
    const data = JSON.parse(readFileSync(join(DATA, file), 'utf-8'))
    if (!data?.subSections) continue
    for (const sub of data.subSections) {
      if (!sub.knowledgePoints) continue
      for (const kp of sub.knowledgePoints) {
        const reg = kpRegistry.registry.find(r => r.id === kp.id)
        docs.push({
          id: kp.id,
          _type: 'kp',
          title_zh: kp.title?.zh || '',
          title_en: kp.title?.en || '',
          title_ko: kp.title?.ko || '',
          content_zh: kp.content?.zh || '',
          content_en: kp.content?.en || '',
          content_ko: kp.content?.ko || '',
          terms_zh: (kp.terms || []).map(t => t.zh).join(' '),
          terms_en: (kp.terms || []).map(t => t.en).join(' '),
          terms_ko: (kp.terms || []).map(t => t.ko || '').join(' '),
          tags: (kp.tags || []).join(' '),
          keywords: (reg?.keywords || []).join(' '),
          synonyms: searchSynonyms[kp.id] || '',
          // 原始内容，用于 Layer 2 检测
          _rawContent: kp.content?.zh || '',
          _rawTitle: kp.title?.zh || '',
          _contentLength: (kp.content?.zh || '').length,
        })
      }
    }
  }

  for (const article of articleRegistry.articles) {
    docs.push({
      id: article.id, _type: 'article',
      title_zh: article.title?.zh || '', title_en: article.title?.en || '',
      title_ko: article.title?.ko || '',
      content_zh: article.subtitle?.zh || '', content_en: article.subtitle?.en || '',
      content_ko: article.subtitle?.ko || '',
      terms_zh: '', terms_en: '', terms_ko: '',
      tags: (article.tags || []).join(' '),
      keywords: (article.seo?.keywords || []).join(' '),
      synonyms: '',
      _rawContent: article.subtitle?.zh || '',
      _rawTitle: article.title?.zh || '',
      _contentLength: (article.subtitle?.zh || '').length,
    })
  }

  for (const athlete of athleteRegistry.athletes) {
    docs.push({
      id: athlete.athleteId, _type: 'athlete',
      title_zh: athlete.athleteName?.zh || '', title_en: athlete.athleteName?.en || '',
      title_ko: athlete.athleteName?.ko || '',
      content_zh: (athlete.tagline?.zh || '') + ' ' + (athlete.overview?.zh || ''),
      content_en: (athlete.tagline?.en || '') + ' ' + (athlete.overview?.en || ''),
      content_ko: (athlete.tagline?.ko || '') + ' ' + (athlete.overview?.ko || ''),
      terms_zh: athlete.nationality?.zh || '', terms_en: athlete.nationality?.en || '',
      terms_ko: athlete.nationality?.ko || '',
      tags: [athlete.category, athlete.subcategory].filter(Boolean).join(' '),
      keywords: '', synonyms: '',
      _rawContent: (athlete.tagline?.zh || '') + ' ' + (athlete.overview?.zh || ''),
      _rawTitle: athlete.athleteName?.zh || '',
      _contentLength: ((athlete.overview?.zh || '')).length,
    })
  }

  return docs
}

// ── Fuse.js Config (mirrors AppContext) ────────────────────────────────

function buildFuse(docs) {
  return new Fuse(docs, {
    keys: [
      { name: 'title_zh', weight: 3.0 }, { name: 'title_en', weight: 3.0 }, { name: 'title_ko', weight: 3.0 },
      { name: 'terms_zh', weight: 2.5 }, { name: 'terms_en', weight: 2.5 }, { name: 'terms_ko', weight: 2.5 },
      { name: 'synonyms', weight: 2.0 }, { name: 'keywords', weight: 2.0 },
      { name: 'tags', weight: 1.5 },
      { name: 'content_zh', weight: 1.0 }, { name: 'content_en', weight: 1.0 }, { name: 'content_ko', weight: 1.0 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 1,
    ignoreLocation: true,
  })
}

// ── Layer 2: Content Relevance ─────────────────────────────────────────
// 检查搜索结果的实际内容是否包含查询的核心概念

function extractKeyTerms(query) {
  // 从查询中提取核心词（去掉虚词）
  const stopWords = ['怎么', '怎样', '如何', '什么', '哪些', '哪个', '了', '的', '吗', '呢', '吧', '不', '没']
  let terms = [query] // 完整查询作为一个term

  // 拆分成2-3字的子串
  for (let len = 2; len <= Math.min(query.length, 4); len++) {
    for (let i = 0; i <= query.length - len; i++) {
      const sub = query.slice(i, i + len)
      if (!stopWords.some(sw => sub === sw)) {
        terms.push(sub)
      }
    }
  }

  // 去重
  return [...new Set(terms)]
}

function scoreContentRelevance(query, doc) {
  const terms = extractKeyTerms(query)
  const searchableText = doc._rawTitle + ' ' + doc._rawContent

  let hits = 0
  const matched = []
  for (const term of terms) {
    if (searchableText.includes(term)) {
      hits++
      matched.push(term)
    }
  }

  const ratio = terms.length > 0 ? hits / terms.length : 0

  let label
  if (ratio >= 0.3 || matched.some(m => m === query)) label = 'DIRECT'
  else if (ratio > 0) label = 'RELATED'
  else label = 'MISMATCH'

  return { label, ratio, matched, terms, searchableText: searchableText.slice(0, 100) }
}

// ── Layer 3: Content Depth ─────────────────────────────────────────────

function scoreContentDepth(doc) {
  const len = doc._contentLength
  if (len >= 400) return { label: 'DEEP', len }
  if (len >= 200) return { label: 'ADEQUATE', len }
  if (len > 0) return { label: 'THIN', len }
  return { label: 'EMPTY', len }
}

// ── Main Audit ─────────────────────────────────────────────────────────

function auditQuery(fuse, query, topN = 8) {
  const results = fuse.search(query).slice(0, topN)

  const audited = results.map(r => {
    const relevance = scoreContentRelevance(query, r.item)
    const depth = scoreContentDepth(r.item)
    return {
      id: r.item.id,
      type: r.item._type,
      title: r.item._rawTitle,
      fuseScore: r.score,
      relevance,
      depth,
    }
  })

  const directCount = audited.filter(a => a.relevance.label === 'DIRECT').length
  const kpDirectCount = audited.filter(a => a.relevance.label === 'DIRECT' && a.type === 'kp').length

  let verdict
  if (kpDirectCount >= 3) verdict = '✅ GOOD'
  else if (kpDirectCount >= 2 || directCount >= 3) verdict = '🟡 FAIR'
  else if (directCount >= 1) verdict = '⚠️ THIN'
  else verdict = '❌ GAP'

  return {
    query,
    resultCount: results.length,
    directCount,
    kpDirectCount,
    verdict,
    results: audited,
  }
}

// ── Marquee Queries ────────────────────────────────────────────────────

const MARQUEE_QUERIES = [
  '怕高怎么办', '泵了', '怎么选鞋', '零基础入门', '练指力', '手皮破了',
  '腿软不敢爬', '卡级了', '脚法怎么练', '开胯拉伸', '第一次户外', '手指疼',
]

// ── CLI ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const singleQuery = args.find(a => !a.startsWith('--'))
const fullMode = args.includes('--full')

const docs = loadAllDocs()
const fuse = buildFuse(docs)

console.log('═══════════════════════════════════════════════════════')
console.log('  内容缺口审计 (Content Gap Audit)')
console.log('  Layer 1: Search Coverage  ← search-benchmark.mjs')
console.log('  Layer 2: Content Relevance ← 本工具')
console.log('  Layer 3: Content Depth     ← 本工具')
console.log('═══════════════════════════════════════════════════════')
console.log(`索引: ${docs.filter(d => d._type === 'kp').length} KPs, ${docs.filter(d => d._type === 'article').length} articles, ${docs.filter(d => d._type === 'athlete').length} athletes`)
console.log()

let queries
if (singleQuery) {
  queries = [singleQuery]
} else if (fullMode) {
  const testCases = JSON.parse(readFileSync(join(__dirname, 'search-test-cases.json'), 'utf-8'))
  queries = testCases.map(tc => tc.query)
} else {
  queries = MARQUEE_QUERIES
}

const allResults = []
for (const q of queries) {
  const result = auditQuery(fuse, q)
  allResults.push(result)

  console.log(`${result.verdict}  "${q}" → ${result.resultCount} results (${result.directCount} direct, ${result.kpDirectCount} KP-direct)`)

  for (const r of result.results.slice(0, 6)) {
    const relIcon = r.relevance.label === 'DIRECT' ? '✅' : r.relevance.label === 'RELATED' ? '🟡' : '❌'
    const depthIcon = r.depth.label === 'DEEP' ? '📗' : r.depth.label === 'ADEQUATE' ? '📘' : r.depth.label === 'THIN' ? '📙' : '📕'
    console.log(`   ${relIcon}${depthIcon} ${r.id} [${r.type}] "${r.title.slice(0, 25)}" (${r.depth.len}字) matched=[${r.relevance.matched.slice(0, 4).join(',')}]`)
  }
  console.log()
}

// ── Summary ────────────────────────────────────────────────────────────

console.log('────────────────────────────────────────────────────')
console.log('  汇总')
console.log('────────────────────────────────────────────────────')

const good = allResults.filter(r => r.verdict.includes('GOOD')).length
const fair = allResults.filter(r => r.verdict.includes('FAIR')).length
const thin = allResults.filter(r => r.verdict.includes('THIN')).length
const gap = allResults.filter(r => r.verdict.includes('GAP')).length

console.log(`✅ GOOD (3+ direct KPs): ${good}`)
console.log(`🟡 FAIR (2 direct):       ${fair}`)
console.log(`⚠️  THIN (1 direct):       ${thin}`)
console.log(`❌ GAP  (0 direct):        ${gap}`)
console.log()

if (thin + gap > 0) {
  console.log('需要内容补充的查询:')
  for (const r of allResults.filter(r => r.verdict.includes('THIN') || r.verdict.includes('GAP'))) {
    console.log(`  "${r.query}" — ${r.kpDirectCount} KP direct match`)
    // Suggest action
    if (r.kpDirectCount === 0) {
      console.log(`    → 建议: 新建专题KP，或在最相关的现有KP中大幅补充此话题内容`)
    } else {
      console.log(`    → 建议: 在相关KP中补充"${r.query}"相关的实操内容段落`)
    }
  }
}
