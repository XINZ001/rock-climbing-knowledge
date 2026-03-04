#!/bin/bash
# 用法: ./create-snapshot.sh <版本号> <简短说明>
# 示例: ./create-snapshot.sh v1.0 "原始正文"

VERSION=$1
DESC=$2
DATE=$(date +%Y-%m-%d)
DIR_NAME="${VERSION}_${DATE}_${DESC}"
SNAPSHOT_DIR="content-snapshots/${DIR_NAME}"
DATA_DIR="rock-climbing-knowledge/src/data"

# 创建快照目录
mkdir -p "$SNAPSHOT_DIR"

# 复制所有 section 文件和关键索引
cp "$DATA_DIR"/section-*.json "$SNAPSHOT_DIR/"
cp "$DATA_DIR/kp-registry.json" "$SNAPSHOT_DIR/"
cp "$DATA_DIR/videos.json" "$SNAPSHOT_DIR/"

# 生成元信息
cat > "$SNAPSHOT_DIR/_snapshot-info.json" << EOF
{
  "version": "content-${VERSION}",
  "date": "${DATE}",
  "description": "${DESC}",
  "scope": "all section files + kp-registry + videos",
  "gitTag": "content-${VERSION}",
  "createdBy": "create-snapshot.sh"
}
EOF

echo "✅ 快照已创建: ${SNAPSHOT_DIR}"
echo "   包含 $(ls "$SNAPSHOT_DIR"/*.json | wc -l | tr -d ' ') 个文件"
echo "   总大小: $(du -sh "$SNAPSHOT_DIR" | cut -f1)"
