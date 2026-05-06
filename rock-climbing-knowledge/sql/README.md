# SQL Notes

This directory keeps one-off SQL and schema recovery notes for the Supabase project.

## Files

| File | Purpose |
|---|---|
| `create-check-email-rpc.sql` | Defines the `check_email_exists(email_input text)` RPC used by the auth UI to pre-check registered email addresses. Run this in Supabase SQL Editor when setting up a new project. |
| `create-diagnosis-results.sql` | Creates `diagnosis_results`, its indexes, and its RLS policies for the climbing animal diagnosis feature. |
| `schema-backup-2026-05-06.sql` | Partial public-schema snapshot exported from Supabase Dashboard Schema visualization. It is for disaster-recovery reference, not a directly replayable migration. |

## Schema Snapshot Coverage

`schema-backup-2026-05-06.sql` is a 70% coverage backup from Supabase Dashboard's context-only schema export.

It covers the 15 `public` tables, their columns, types, default values, primary keys, foreign keys, and the `media.media_type` check constraint.

It does not include Row-Level Security policies, RPC functions such as `check_email_exists` or `get_feed_post_stats`, non-primary-key indexes, triggers, storage bucket policies, or fully normalized array element types. Treat the file header as the source of truth for the exact coverage and known gaps.

## Replaying In A New Supabase Project

Do not paste `schema-backup-2026-05-06.sql` directly into a new Supabase SQL Editor and expect it to work. Supabase marks this export as context-only; the table order and constraints may not be executable as written.

For a manual rebuild:

1. Create a new Supabase project.
2. Read `schema-backup-2026-05-06.sql` and reorder table creation by FK dependency. Create parent tables before child tables, or create tables first and add foreign keys afterward.
3. Fix context-only type placeholders before running SQL. For example, columns shown as `ARRAY` need concrete element types such as `text[]` or `date[]`, using defaults in the snapshot as hints.
4. Replay the table definitions in dependency-safe order.
5. Run `create-check-email-rpc.sql`.
6. Run or reconcile `create-diagnosis-results.sql`. If `diagnosis_results` was already created from the snapshot, apply only the missing indexes and RLS policies from that file.
7. Manually recreate missing RLS policies, RPCs, indexes, triggers, and storage bucket policies from the live project or future complete exports.
8. Verify app flows that touch Supabase: auth, profiles, community posts, injuries, feed interactions, quests, and diagnosis history.

For a fully automated restore, prefer a real schema dump from `pg_dump --schema-only` or `supabase db dump`. The snapshot in this directory is a safety net, not a migration source.

## Refreshing The Snapshot

1. Go to Supabase Dashboard -> Database -> Schema visualization.
2. Copy the context-only SQL output.
3. Create a new dated file such as `schema-backup-YYYY-MM-DD.sql`.
4. Preserve the explanatory header style from `schema-backup-2026-05-06.sql`, update the date/source notes, then replace the snapshot body with the fresh Dashboard output.
5. Update this README if coverage changes or new SQL files are added.

Never commit database connection strings, service role keys, or any other secrets to git.
