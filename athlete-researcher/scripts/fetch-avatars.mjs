#!/usr/bin/env node
/**
 * Fetch athlete avatars from Wikipedia and save to athlete-researcher/athlete-avatars/.
 * Run from repo root: node athlete-researcher/scripts/fetch-avatars.mjs
 * Uses Wikipedia REST API: https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REGISTRY_PATH = join(ROOT, 'rock-climbing-knowledge', 'src', 'data', 'athlete-registry.json')
const AVATARS_DIR = join(ROOT, 'athlete-researcher', 'athlete-avatars')
const RESULTS_PATH = join(ROOT, 'athlete-researcher', 'athlete-avatar-results.json')
const OVERRIDES_PATH = join(ROOT, 'athlete-researcher', 'athlete-avatar-overrides.json')

// Wikipedia page title overrides when en name doesn't match (e.g. disambiguation)
const WIKI_TITLE_OVERRIDES = {
  'John Gill': 'John_Gill_(climber)',
  'John Long': 'John_Long_(climber)',
  'John Sherman': 'John_Sherman_(climber)',
  'Wolfgang Gullich': 'Wolfgang_Güllich',
  'Alex Honnold': 'Alex_Honnold',
  'Tommy Caldwell': 'Tommy_Caldwell',
}

function wikiTitle(en) {
  const override = WIKI_TITLE_OVERRIDES[en]
  if (override) return override
  return en.replace(/\s+/g, '_').replace(/’/g, "'")
}

/** Slug to Wikipedia-style title: colin-duffy -> Colin_Duffy */
function slugToWikiTitle(slug) {
  if (!slug) return null
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('_')
}

async function fetchWikipediaThumbnail(title, lang = 'en') {
  const host = lang === 'zh' ? 'zh.wikipedia.org' : 'en.wikipedia.org'
  const url = `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  const res = await fetch(url, { headers: { 'User-Agent': 'ClimbingKnowledgeBot/1.0' } })
  if (!res.ok) return null
  const data = await res.json()
  const thumb = data.thumbnail?.source
  return thumb || null
}

/** Try multiple title variants and zh wiki for Chinese athletes. Returns { url, source } or null. */
async function tryMultipleTitles(athlete) {
  const en = athlete.athleteName?.en || ''
  const zh = athlete.athleteName?.zh || ''
  const slug = athlete.slug || ''
  const isChinese = !!athlete.isChineseRepresentative

  const enTitles = []
  if (en) {
    enTitles.push(wikiTitle(en))
    enTitles.push(`${en.replace(/\s+/g, '_')}_(climber)`)
    enTitles.push(`${en.replace(/\s+/g, '_')}_(sport_climber)`)
  }
  if (slug) enTitles.push(slugToWikiTitle(slug))

  for (const title of enTitles) {
    if (!title) continue
    const url = await fetchWikipediaThumbnail(title, 'en')
    if (url) return { url, source: 'Wikipedia (en)' }
    await new Promise((r) => setTimeout(r, 200))
  }

  if (isChinese && zh) {
    const zhTitle = zh.replace(/\s+/g, '_')
    const url = await fetchWikipediaThumbnail(zhTitle, 'zh')
    if (url) return { url, source: 'Wikipedia (zh)' }
    await new Promise((r) => setTimeout(r, 200))
  }

  return null
}

/** Search Wikimedia Commons for first image URL. Query e.g. "Janja Garnbret climber". */
async function fetchCommonsSearch(query) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=3&format=json&origin=*`
  const res = await fetch(searchUrl, { headers: { 'User-Agent': 'ClimbingKnowledgeBot/1.0' } })
  if (!res.ok) return null
  const data = await res.json()
  const hits = data.query?.search || []
  for (const hit of hits) {
    const title = hit.title
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`
    const infoRes = await fetch(infoUrl, { headers: { 'User-Agent': 'ClimbingKnowledgeBot/1.0' } })
    if (!infoRes.ok) continue
    const infoData = await infoRes.json()
    const pages = infoData.query?.pages || {}
    const page = Object.values(pages)[0]
    const url = page?.imageinfo?.[0]?.url
    if (url) return url
    await new Promise((r) => setTimeout(r, 150))
  }
  return null
}

/** Convert Wikipedia thumbnail URL to raw Commons file URL (sometimes downloads when thumb fails). */
function toRawCommonsUrl(thumbUrl) {
  try {
    const u = new URL(thumbUrl)
    if (!u.hostname.includes('wikimedia.org') || !u.pathname.includes('/thumb/')) return null
    const path = u.pathname
    const match = path.match(/\/thumb\/(.+)\/\d+px-.+$/)
    if (!match) return null
    return `https://upload.wikimedia.org/wikipedia/commons/${match[1]}`
  } catch (_) {}
  return null
}

async function downloadImage(url, filepath) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ClimbingKnowledgeBot/1.0 (https://github.com/rock-climbing-knowledge)',
      Accept: 'image/*',
      Referer: 'https://en.wikipedia.org/',
    },
    redirect: 'follow',
  })
  if (!res.ok) return false
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(filepath, buf)
  return true
}

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname
    if (pathname.includes('.jpg') || pathname.includes('.jpeg')) return 'jpg'
    if (pathname.includes('.png')) return 'png'
    if (pathname.includes('.webp')) return 'webp'
  } catch (_) {}
  return 'jpg'
}

async function main() {
  if (!existsSync(REGISTRY_PATH)) {
    console.error('Registry not found:', REGISTRY_PATH)
    process.exit(1)
  }
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'))
  const athletes = registry.athletes || []

  let existingById = {}
  if (existsSync(RESULTS_PATH)) {
    const existing = JSON.parse(readFileSync(RESULTS_PATH, 'utf8'))
    existingById = Object.fromEntries((existing || []).map((r) => [r.athleteId, r]))
  }

  let overrides = {}
  if (existsSync(OVERRIDES_PATH)) {
    try {
      overrides = JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'))
    } catch (_) {}
  }

  mkdirSync(AVATARS_DIR, { recursive: true })

  const results = []
  let ok = 0
  let fail = 0

  for (let i = 0; i < athletes.length; i++) {
    const a = athletes[i]
    const id = a.athleteId
    const en = a.athleteName?.en || a.athleteName?.zh || a.slug || id
    const existing = existingById[id]
    const hasFile = existing?.localFile && existsSync(join(AVATARS_DIR, existing.localFile))

    process.stdout.write(`[${i + 1}/${athletes.length}] ${id} ${en} ... `)
    if (hasFile) {
      console.log('skip (have)')
      results.push(existing)
      ok++
      continue
    }

    try {
      let thumbUrl = overrides[id] || null
      let source = thumbUrl ? 'override (Google/manual)' : ''
      if (!thumbUrl) {
        const found = await tryMultipleTitles(a)
        thumbUrl = found?.url || null
        source = found?.source || ''
      }
      if (!thumbUrl) {
        const commonsUrl = await fetchCommonsSearch(en)
        if (commonsUrl) {
          thumbUrl = commonsUrl
          source = 'Commons search'
        }
        await new Promise((r) => setTimeout(r, 250))
      }
      if (!thumbUrl) {
        console.log('no thumbnail')
        results.push({ athleteId: id, athleteNameEn: en, avatarUrl: '', source: '', licenseOrNote: 'Wikipedia/Commons: no thumbnail' })
        fail++
        await new Promise((r) => setTimeout(r, 300))
        continue
      }
      const ext = extFromUrl(thumbUrl)
      const filepath = join(AVATARS_DIR, `${id}.${ext}`)
      let downloaded = await downloadImage(thumbUrl, filepath)
      if (!downloaded && thumbUrl && toRawCommonsUrl(thumbUrl)) {
        const rawUrl = toRawCommonsUrl(thumbUrl)
        if (rawUrl !== thumbUrl) downloaded = await downloadImage(rawUrl, filepath)
        if (downloaded) thumbUrl = rawUrl
      }
      if (downloaded) {
        console.log('saved')
        results.push({
          athleteId: id,
          athleteNameEn: en,
          avatarUrl: thumbUrl,
          source: source || 'Wikipedia',
          licenseOrNote: source.includes('override') ? 'Manual/Google; verify license' : 'Wikipedia/Commons; verify license for production',
          localFile: `${id}.${ext}`,
        })
        ok++
      } else {
        console.log('download failed')
        results.push({ athleteId: id, athleteNameEn: en, avatarUrl: thumbUrl, source: source || 'Wikipedia', licenseOrNote: 'download failed', localFile: '' })
        fail++
      }
    } catch (e) {
      console.log('error:', e.message)
      results.push({ athleteId: id, athleteNameEn: en, avatarUrl: '', source: '', licenseOrNote: `Error: ${e.message}`, localFile: '' })
      fail++
    }
    await new Promise((r) => setTimeout(r, 400))
  }

  writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2), 'utf8')
  console.log(`\nDone. Total with avatar: ${ok}. Still missing: ${fail}. Results: ${RESULTS_PATH}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
