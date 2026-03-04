#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_PATH="${1:-$ROOT_DIR/yt_climbing_knowledge.db}"
SCHEMA_PATH="$ROOT_DIR/yt_climbing_knowledge_schema.sql"

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "sqlite3 is required but not found." >&2
  exit 1
fi

mkdir -p "$(dirname "$DB_PATH")"
sqlite3 "$DB_PATH" < "$SCHEMA_PATH"

echo "Initialized DB: $DB_PATH"
