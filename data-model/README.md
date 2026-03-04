# YouTube x 攀岩知识点数据流水线

本目录提供一套可执行流水线，基于：
- [yt_climbing_knowledge_schema.sql](/Users/xinz/Documents/skill library/rock climbing/data-model/yt_climbing_knowledge_schema.sql)

目标：
1. 收集知名攀岩 YouTube 频道及其全部视频
2. 自动匹配视频到知识点
3. 导出可审核的总表

## 目录
- `yt_climbing_knowledge_schema.sql`: SQLite schema
- `scripts/init_db.sh`: 初始化数据库
- `scripts/import_knowledge_points.mjs`: 从 `section-*.json` 导入知识点
- `scripts/build_channels_seed.mjs`: 从现有 `videos.json` 生成频道 seed CSV
- `scripts/fetch_youtube_channels.mjs`: 用 YouTube API 将 seed 解析为真实频道并入库
- `scripts/fetch_channel_videos.mjs`: 抓取频道 uploads 全部视频并入库
- `scripts/auto_match_videos_to_kp.mjs`: 按标题/描述做自动知识点匹配
- `scripts/export_mapping_table.sh`: 导出映射结果 CSV

## 前置
- `sqlite3`
- `node >= 18`
- YouTube Data API Key（用于网络抓取）

## 一键顺序（推荐）
```bash
cd '/Users/xinz/Documents/skill library/rock climbing'

# 1) 初始化 DB
./data-model/scripts/init_db.sh ./data-model/yt_climbing_knowledge.db

# 2) 导入知识点
node ./data-model/scripts/import_knowledge_points.mjs \
  --db ./data-model/yt_climbing_knowledge.db

# 3) 生成频道 seed
node ./data-model/scripts/build_channels_seed.mjs \
  --output ./data-model/seeds/yt_channels_seed.csv

# 4) 解析频道（需要 API key）
node ./data-model/scripts/fetch_youtube_channels.mjs \
  --db ./data-model/yt_climbing_knowledge.db \
  --seed ./data-model/seeds/yt_channels_seed.csv \
  --api-key "$YOUTUBE_API_KEY"

# 5) 抓取频道全部视频（需要 API key）
node ./data-model/scripts/fetch_channel_videos.mjs \
  --db ./data-model/yt_climbing_knowledge.db \
  --api-key "$YOUTUBE_API_KEY"

# 6) 自动匹配知识点
node ./data-model/scripts/auto_match_videos_to_kp.mjs \
  --db ./data-model/yt_climbing_knowledge.db \
  --min-score 20 \
  --model heuristic-v1

# 7) 导出可审核表
./data-model/scripts/export_mapping_table.sh \
  ./data-model/yt_climbing_knowledge.db \
  ./data-model/output/yt_video_knowledge_mapping.csv
```

## 结果文件
- DB: `data-model/yt_climbing_knowledge.db`
- 频道 seed: `data-model/seeds/yt_channels_seed.csv`
- 映射导出: `data-model/output/yt_video_knowledge_mapping.csv`

## 说明
- `auto_match_videos_to_kp.mjs` 是启发式匹配（用于首轮批处理），结果会写入 `yt_video_kp_matches`，状态为 `auto`。
- 建议对 `primary` 且高分的视频优先人工复核，再批量 `approved`。
