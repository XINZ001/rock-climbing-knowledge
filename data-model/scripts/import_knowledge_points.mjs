#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

function usage() {
  console.error('Usage: node import_knowledge_points.mjs --db <db_path> [--data-dir <src/data_dir>]')
  process.exit(1)
}

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

function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function inferKeywords(kp) {
  const zh = new Set()
  const en = new Set()

  if (kp.title?.zh) zh.add(kp.title.zh)
  if (kp.title?.en) en.add(kp.title.en)

  if (Array.isArray(kp.terms)) {
    for (const t of kp.terms) {
      if (t?.zh) zh.add(t.zh)
      if (t?.en) en.add(t.en)
    }
  }

  return {
    keywordsZh: JSON.stringify([...zh]),
    keywordsEn: JSON.stringify([...en])
  }
}

const args = parseArgs(process.argv)
const dbPath = args.db
if (!dbPath) usage()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..', '..')
const defaultDataDir = path.join(root, 'rock-climbing-knowledge', 'src', 'data')
const dataDir = args['data-dir'] ? path.resolve(args['data-dir']) : defaultDataDir

const files = fs
  .readdirSync(dataDir)
  .filter((f) => /^section-\d{2}-.+\.json$/.test(f))
  .sort()

if (!files.length) {
  console.error(`No section data files found in: ${dataDir}`)
  process.exit(1)
}

let sql = 'BEGIN TRANSACTION;\n'
sql += 'DELETE FROM knowledge_points_catalog;\n'

let count = 0
let duplicateCount = 0
const seenKpIds = new Set()
for (const file of files) {
  const full = path.join(dataDir, file)
  const data = JSON.parse(fs.readFileSync(full, 'utf8'))
  const sectionId = data.sectionId

  for (const sub of data.subSections || []) {
    for (const kp of sub.knowledgePoints || []) {
      if (seenKpIds.has(kp.id)) {
        duplicateCount += 1
        continue
      }
      seenKpIds.add(kp.id)
      const { keywordsZh, keywordsEn } = inferKeywords(kp)
      sql += `INSERT INTO knowledge_points_catalog (kp_id, section_id, sub_section_id, kp_name_zh, kp_name_en, keywords_zh, keywords_en, negative_keywords) VALUES (${sqlEscape(kp.id)}, ${sqlEscape(sectionId)}, ${sqlEscape(sub.id)}, ${sqlEscape(kp.title?.zh || '')}, ${sqlEscape(kp.title?.en || '')}, ${sqlEscape(keywordsZh)}, ${sqlEscape(keywordsEn)}, NULL);\n`
      count += 1
    }
  }
}

sql += 'COMMIT;\n'

execFileSync('sqlite3', [dbPath], { input: sql, stdio: ['pipe', 'inherit', 'inherit'] })
console.log(`Imported knowledge points: ${count}`)
if (duplicateCount > 0) {
  console.log(`Skipped duplicate kp_id rows: ${duplicateCount}`)
}
console.log(`DB: ${dbPath}`)
