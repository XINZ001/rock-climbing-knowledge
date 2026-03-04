#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

const args = parseArgs(process.argv)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..', '..')
const videosJson = args.input || path.join(root, 'rock-climbing-knowledge', 'src', 'data', 'videos.json')
const outCsv = args.output || path.join(root, 'data-model', 'seeds', 'yt_channels_seed.csv')

const data = JSON.parse(fs.readFileSync(videosJson, 'utf8'))
const channelMap = new Map()

for (const entries of Object.values(data)) {
  for (const v of entries) {
    const url = String(v.url || '').trim()
    const isYoutubeChannel = /youtube\.com\/(?:@|channel\/|c\/|user\/)/.test(url)
    if (!isYoutubeChannel) continue

    const channelName = String(v.channel || '').trim() || 'Unknown'
    if (!channelMap.has(url)) {
      channelMap.set(url, {
        channel_name: channelName,
        channel_url: url,
        primary_language: v.lang || '',
        country_code: ''
      })
    }
  }
}

const rows = [...channelMap.values()].sort((a, b) => a.channel_name.localeCompare(b.channel_name, 'zh-Hans-CN'))

const header = ['channel_name', 'channel_url', 'primary_language', 'country_code']
const csvLines = [header.join(',')]
for (const r of rows) {
  const vals = header.map((k) => {
    const raw = String(r[k] ?? '')
    if (/[,"\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`
    return raw
  })
  csvLines.push(vals.join(','))
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true })
fs.writeFileSync(outCsv, csvLines.join('\n') + '\n')

console.log(`Seed file written: ${outCsv}`)
console.log(`Channels: ${rows.length}`)
