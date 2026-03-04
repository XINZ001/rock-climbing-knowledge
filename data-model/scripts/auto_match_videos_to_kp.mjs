#!/usr/bin/env node
import { execFileSync } from 'node:child_process'

function parseArgs(argv) {
  const out = {}
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    out[a.slice(2)] = argv[i + 1]
    i += 1
  }
  return out
}

function usage() {
  console.error('Usage: node auto_match_videos_to_kp.mjs --db <db_path> [--min-score 20] [--model heuristic-v1]')
  process.exit(1)
}

function sqliteJson(dbPath, sql) {
  const out = execFileSync('sqlite3', ['-json', dbPath, sql], { encoding: 'utf8' })
  return out.trim() ? JSON.parse(out) : []
}

function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function normalizeText(s) {
  return String(s || '').toLowerCase()
}

function splitTerms(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean)
  } catch {}
  return String(raw)
    .split(/[，,;；|]+/)
    .map((x) => x.trim())
    .filter(Boolean)
}

function scoreMatch(videoText, kp) {
  let score = 0
  const reasons = []

  const enName = normalizeText(kp.kp_name_en)
  const zhName = kp.kp_name_zh || ''
  if (enName && videoText.includes(enName)) {
    score += 35
    reasons.push(`title/desc contains EN name: ${kp.kp_name_en}`)
  }
  if (zhName && videoText.includes(zhName.toLowerCase())) {
    score += 40
    reasons.push(`title/desc contains ZH name: ${kp.kp_name_zh}`)
  }

  const enTerms = splitTerms(kp.keywords_en)
  const zhTerms = splitTerms(kp.keywords_zh)
  const negTerms = splitTerms(kp.negative_keywords)

  for (const t of enTerms) {
    const term = normalizeText(t)
    if (term.length < 3) continue
    if (videoText.includes(term)) {
      score += 8
      reasons.push(`keyword EN: ${t}`)
    }
  }

  for (const t of zhTerms) {
    if (t.length < 2) continue
    if (videoText.includes(t.toLowerCase())) {
      score += 10
      reasons.push(`keyword ZH: ${t}`)
    }
  }

  for (const t of negTerms) {
    const term = normalizeText(t)
    if (!term) continue
    if (videoText.includes(term)) {
      score -= 12
      reasons.push(`negative keyword: ${t}`)
    }
  }

  // Tiny boost for section-like terms in title.
  const titleText = normalizeText(kp.kp_name_en || '')
  if (titleText && videoText.startsWith(titleText)) score += 6

  return { score: Math.max(0, Math.min(100, score)), reasons }
}

const args = parseArgs(process.argv)
if (!args.db) usage()

const minScore = Number(args['min-score'] ?? 20)
const modelName = args.model ?? 'heuristic-v1'

const videos = sqliteJson(args.db, 'SELECT yt_video_id, title, description FROM yt_videos;')
const kps = sqliteJson(args.db, 'SELECT kp_id, kp_name_zh, kp_name_en, keywords_zh, keywords_en, negative_keywords FROM knowledge_points_catalog;')

if (!videos.length || !kps.length) {
  console.error('No videos or knowledge points found. Ensure imports are done first.')
  process.exit(1)
}

let sql = 'BEGIN TRANSACTION;\n'
sql += `DELETE FROM yt_video_kp_matches WHERE matched_by_model = ${sqlEscape(modelName)};\n`

let inserted = 0
for (const v of videos) {
  const text = normalizeText(`${v.title || ''}\n${v.description || ''}`)
  const scored = []

  for (const kp of kps) {
    const res = scoreMatch(text, kp)
    if (res.score >= minScore) {
      scored.push({ kpId: kp.kp_id, score: res.score, reasons: res.reasons.slice(0, 3).join('; ') })
    }
  }

  if (!scored.length) continue
  scored.sort((a, b) => b.score - a.score)

  const top = scored.slice(0, 3)
  top.forEach((m, idx) => {
    const tier = idx === 0 ? 'primary' : 'secondary'
    sql += `INSERT INTO yt_video_kp_matches (yt_video_id, kp_id, relevance_tier, relevance_score, match_reason, matched_by_model, matched_by_version, matched_at, current_review_status) VALUES (${sqlEscape(v.yt_video_id)}, ${sqlEscape(m.kpId)}, ${sqlEscape(tier)}, ${m.score}, ${sqlEscape(m.reasons)}, ${sqlEscape(modelName)}, '1.0', datetime('now'), 'auto');\n`
    inserted += 1
  })
}

sql += 'COMMIT;\n'
execFileSync('sqlite3', [args.db], { input: sql, stdio: ['pipe', 'inherit', 'inherit'] })

console.log(`Inserted matches: ${inserted}`)
console.log(`Model tag: ${modelName}`)
console.log(`DB: ${args.db}`)
