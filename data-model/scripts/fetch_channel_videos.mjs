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
  console.error('Usage: node fetch_channel_videos.mjs --db <db_path> --api-key <youtube_api_key> [--max-per-channel 0]')
  process.exit(1)
}

function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function parseISODurationToSec(iso) {
  if (!iso) return null
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return null
  const h = Number(m[1] || 0)
  const min = Number(m[2] || 0)
  const s = Number(m[3] || 0)
  return h * 3600 + min * 60 + s
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

function sqliteJson(dbPath, sql) {
  const out = execFileSync('sqlite3', ['-json', dbPath, sql], { encoding: 'utf8' })
  return out.trim() ? JSON.parse(out) : []
}

const args = parseArgs(process.argv)
if (!args.db || !args['api-key']) usage()

const maxPerChannel = Number(args['max-per-channel'] ?? 0)
const channels = sqliteJson(args.db, 'SELECT yt_channel_id FROM yt_channels ORDER BY channel_name;')
if (!channels.length) {
  console.error('No channels in yt_channels. Run fetch_youtube_channels.mjs first.')
  process.exit(1)
}

let totalInserted = 0
let sql = 'BEGIN TRANSACTION;\n'

for (const ch of channels) {
  const channelId = ch.yt_channel_id

  const channelInfo = await ytGet('channels', {
    part: 'contentDetails',
    id: channelId,
    key: args['api-key']
  })

  const uploadsPlaylist = channelInfo.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylist) continue

  const videoIds = []
  let nextPageToken = null
  do {
    const payload = await ytGet('playlistItems', {
      part: 'contentDetails',
      playlistId: uploadsPlaylist,
      maxResults: '50',
      pageToken: nextPageToken || '',
      key: args['api-key']
    })

    for (const item of payload.items || []) {
      if (item.contentDetails?.videoId) videoIds.push(item.contentDetails.videoId)
      if (maxPerChannel > 0 && videoIds.length >= maxPerChannel) break
    }

    if (maxPerChannel > 0 && videoIds.length >= maxPerChannel) {
      nextPageToken = null
    } else {
      nextPageToken = payload.nextPageToken || null
    }
  } while (nextPageToken)

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50)
    const details = await ytGet('videos', {
      part: 'snippet,contentDetails,statistics,liveStreamingDetails',
      id: batch.join(','),
      key: args['api-key']
    })

    for (const v of details.items || []) {
      const duration = parseISODurationToSec(v.contentDetails?.duration)
      const isShort = duration !== null && duration <= 60 ? 1 : 0
      const isLive = v.snippet?.liveBroadcastContent && v.snippet.liveBroadcastContent !== 'none' ? 1 : 0

      sql += `INSERT INTO yt_videos (yt_video_id, yt_channel_id, title, description, video_url, published_at, duration_seconds, view_count, like_count, comment_count, is_short, is_live_stream, fetched_at) VALUES (${sqlEscape(v.id)}, ${sqlEscape(channelId)}, ${sqlEscape(v.snippet?.title || '')}, ${sqlEscape(v.snippet?.description || '')}, ${sqlEscape(`https://www.youtube.com/watch?v=${v.id}`)}, ${sqlEscape(v.snippet?.publishedAt || null)}, ${duration ?? 'NULL'}, ${v.statistics?.viewCount ? Number(v.statistics.viewCount) : 'NULL'}, ${v.statistics?.likeCount ? Number(v.statistics.likeCount) : 'NULL'}, ${v.statistics?.commentCount ? Number(v.statistics.commentCount) : 'NULL'}, ${isShort}, ${isLive}, datetime('now')) ON CONFLICT(yt_video_id) DO UPDATE SET yt_channel_id=excluded.yt_channel_id, title=excluded.title, description=excluded.description, video_url=excluded.video_url, published_at=excluded.published_at, duration_seconds=excluded.duration_seconds, view_count=excluded.view_count, like_count=excluded.like_count, comment_count=excluded.comment_count, is_short=excluded.is_short, is_live_stream=excluded.is_live_stream, fetched_at=datetime('now');\n`
      totalInserted += 1
    }
  }

  sql += `UPDATE yt_channels SET last_synced_at = datetime('now') WHERE yt_channel_id = ${sqlEscape(channelId)};\n`
}

sql += 'COMMIT;\n'
execFileSync('sqlite3', [args.db], { input: sql, stdio: ['pipe', 'inherit', 'inherit'] })

console.log(`Upserted video rows: ${totalInserted}`)
console.log(`DB: ${args.db}`)
