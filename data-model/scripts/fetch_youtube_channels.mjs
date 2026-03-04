#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
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
  console.error('Usage: node fetch_youtube_channels.mjs --db <db_path> --seed <seed_csv> --api-key <youtube_api_key>')
  process.exit(1)
}

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let inQuote = false
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i]
    if (inQuote) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else if (c === '"') {
        inQuote = false
      } else {
        cur += c
      }
    } else if (c === ',') {
      out.push(cur)
      cur = ''
    } else if (c === '"') {
      inQuote = true
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out
}

function csvToObjects(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim()
  if (!raw) return []
  const lines = raw.split(/\r?\n/)
  const header = parseCsvLine(lines[0])
  const rows = []
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue
    const cols = parseCsvLine(line)
    const obj = {}
    header.forEach((k, idx) => {
      obj[k] = cols[idx] ?? ''
    })
    rows.push(obj)
  }
  return rows
}

function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function parseHandle(url) {
  const m = url.match(/youtube\.com\/@([^/?#]+)/)
  return m ? m[1] : null
}

function parseChannelIdFromUrl(url) {
  const m = url.match(/youtube\.com\/channel\/(UC[\w-]+)/)
  return m ? m[1] : null
}

async function ytGet(endpoint, params) {
  const usp = new URLSearchParams(params)
  const res = await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}?${usp.toString()}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`YouTube API error ${res.status}: ${text}`)
  }
  return res.json()
}

async function resolveChannel(apiKey, seed) {
  const directId = parseChannelIdFromUrl(seed.channel_url)
  if (directId) {
    const data = await ytGet('channels', {
      part: 'snippet,statistics,contentDetails',
      id: directId,
      key: apiKey
    })
    return data.items?.[0] || null
  }

  const handle = parseHandle(seed.channel_url)
  if (handle) {
    let data = await ytGet('channels', {
      part: 'snippet,statistics,contentDetails',
      forHandle: handle,
      key: apiKey
    })
    if (data.items?.length) return data.items[0]

    data = await ytGet('search', {
      part: 'snippet',
      type: 'channel',
      q: `@${handle}`,
      maxResults: '1',
      key: apiKey
    })
    const chId = data.items?.[0]?.snippet?.channelId
    if (!chId) return null

    const chData = await ytGet('channels', {
      part: 'snippet,statistics,contentDetails',
      id: chId,
      key: apiKey
    })
    return chData.items?.[0] || null
  }

  return null
}

const args = parseArgs(process.argv)
if (!args.db || !args.seed || !args['api-key']) usage()

const seeds = csvToObjects(args.seed)
if (!seeds.length) {
  console.error(`Seed CSV is empty: ${args.seed}`)
  process.exit(1)
}

let sql = 'BEGIN TRANSACTION;\n'
let success = 0
const unresolved = []

for (const s of seeds) {
  if (!/youtube\.com\//.test(s.channel_url || '')) continue
  try {
    const item = await resolveChannel(args['api-key'], s)
    if (!item) {
      unresolved.push(s)
      continue
    }

    const channelId = item.id
    const handle = item.snippet?.customUrl || parseHandle(s.channel_url) || null
    const channelName = item.snippet?.title || s.channel_name || ''
    const channelUrl = `https://www.youtube.com/channel/${channelId}`
    const subs = item.statistics?.subscriberCount ? Number(item.statistics.subscriberCount) : null
    const vcount = item.statistics?.videoCount ? Number(item.statistics.videoCount) : null

    sql += `INSERT INTO yt_channels (yt_channel_id, yt_handle, channel_name, channel_url, country_code, primary_language, subscriber_count, published_video_count, last_synced_at) VALUES (${sqlEscape(channelId)}, ${sqlEscape(handle)}, ${sqlEscape(channelName)}, ${sqlEscape(channelUrl)}, ${sqlEscape(s.country_code || null)}, ${sqlEscape(s.primary_language || null)}, ${subs ?? 'NULL'}, ${vcount ?? 'NULL'}, datetime('now')) ON CONFLICT(yt_channel_id) DO UPDATE SET yt_handle=excluded.yt_handle, channel_name=excluded.channel_name, channel_url=excluded.channel_url, country_code=COALESCE(excluded.country_code, yt_channels.country_code), primary_language=COALESCE(excluded.primary_language, yt_channels.primary_language), subscriber_count=excluded.subscriber_count, published_video_count=excluded.published_video_count, last_synced_at=datetime('now');\n`
    success += 1
  } catch (err) {
    unresolved.push({ ...s, error: err.message })
  }
}

sql += 'COMMIT;\n'
execFileSync('sqlite3', [args.db], { input: sql, stdio: ['pipe', 'inherit', 'inherit'] })

if (unresolved.length) {
  const out = path.join(path.dirname(args.seed), 'yt_channels_unresolved.json')
  fs.writeFileSync(out, JSON.stringify(unresolved, null, 2))
  console.log(`Unresolved channels: ${unresolved.length} -> ${out}`)
}

console.log(`Resolved/Upserted channels: ${success}`)
console.log(`DB: ${args.db}`)
