#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_PATH="${1:-$ROOT_DIR/yt_climbing_knowledge.db}"

"$ROOT_DIR/scripts/init_db.sh" "$DB_PATH"
node "$ROOT_DIR/scripts/import_knowledge_points.mjs" --db "$DB_PATH"
node "$ROOT_DIR/scripts/build_channels_seed.mjs" --output "$ROOT_DIR/seeds/yt_channels_seed.csv"

if [[ -n "${YOUTUBE_API_KEY:-}" ]]; then
  node "$ROOT_DIR/scripts/fetch_youtube_channels.mjs" \
    --db "$DB_PATH" \
    --seed "$ROOT_DIR/seeds/yt_channels_seed.csv" \
    --api-key "$YOUTUBE_API_KEY"

  node "$ROOT_DIR/scripts/fetch_channel_videos.mjs" \
    --db "$DB_PATH" \
    --api-key "$YOUTUBE_API_KEY"

  node "$ROOT_DIR/scripts/auto_match_videos_to_kp.mjs" \
    --db "$DB_PATH" \
    --min-score 20 \
    --model heuristic-v1

  "$ROOT_DIR/scripts/export_mapping_table.sh" \
    "$DB_PATH" \
    "$ROOT_DIR/output/yt_video_knowledge_mapping.csv"
else
  echo "YOUTUBE_API_KEY not set. Completed local setup only (schema + knowledge points + channel seeds)."
fi

echo "Pipeline complete. DB: $DB_PATH"
