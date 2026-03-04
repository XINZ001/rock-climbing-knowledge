#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_PATH="${1:-$ROOT_DIR/yt_climbing_knowledge.db}"
OUT_CSV="${2:-$ROOT_DIR/output/yt_video_knowledge_mapping.csv}"

mkdir -p "$(dirname "$OUT_CSV")"

printf '%s\n' "channel_name,yt_handle,yt_video_id,video_title,video_url,published_at,view_count,relevance_tier,relevance_score,kp_id,kp_name_zh,kp_name_en,match_reason,current_review_status" > "$OUT_CSV"

sqlite3 -csv "$DB_PATH" "
SELECT
  c.channel_name,
  c.yt_handle,
  v.yt_video_id,
  v.title AS video_title,
  v.video_url,
  v.published_at,
  v.view_count,
  m.relevance_tier,
  m.relevance_score,
  k.kp_id,
  k.kp_name_zh,
  k.kp_name_en,
  m.match_reason,
  m.current_review_status
FROM yt_video_kp_matches m
JOIN yt_videos v ON v.yt_video_id = m.yt_video_id
JOIN yt_channels c ON c.yt_channel_id = v.yt_channel_id
JOIN knowledge_points_catalog k ON k.kp_id = m.kp_id
ORDER BY c.channel_name, v.published_at DESC, m.relevance_score DESC;
" >> "$OUT_CSV"

echo "Exported: $OUT_CSV"
