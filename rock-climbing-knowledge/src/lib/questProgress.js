import { supabase } from './supabase'

export const QUEST_PROGRESS_STORAGE_KEY = 'quest-progress'

export function loadLocalQuestProgress() {
  try {
    return JSON.parse(localStorage.getItem(QUEST_PROGRESS_STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export function saveLocalQuestProgress(progress) {
  localStorage.setItem(QUEST_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
}

function normalizeDates(dates) {
  return [...new Set((dates || []).map(String))].sort()
}

function rowsToProgress(rows) {
  return Object.fromEntries((rows || []).map((row) => [
    row.quest_id,
    {
      times: Math.max(row.times || 0, (row.dates || []).length),
      dates: normalizeDates(row.dates),
    },
  ]))
}

function mergeEntries(localEntry = {}, remoteEntry = {}) {
  const dates = normalizeDates([...(localEntry.dates || []), ...(remoteEntry.dates || [])])
  return {
    times: Math.max(localEntry.times || 0, remoteEntry.times || 0, dates.length),
    dates,
  }
}

export function mergeQuestProgress(localProgress, remoteRows) {
  const remoteProgress = rowsToProgress(remoteRows)
  const merged = { ...localProgress }

  Object.keys(remoteProgress).forEach((questId) => {
    merged[questId] = mergeEntries(localProgress[questId], remoteProgress[questId])
  })

  Object.keys(localProgress || {}).forEach((questId) => {
    if (questId.startsWith('_')) return
    merged[questId] = mergeEntries(localProgress[questId], remoteProgress[questId])
  })

  return merged
}

export async function fetchQuestProgress() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: loadLocalQuestProgress(), error: null }

  const { data, error } = await supabase
    .from('user_quest_progress')
    .select('quest_id, times, dates')
    .eq('user_id', user.id)

  if (error) return { data: loadLocalQuestProgress(), error }

  const merged = mergeQuestProgress(loadLocalQuestProgress(), data || [])
  saveLocalQuestProgress(merged)
  return { data: merged, error: null }
}

export async function recordQuestCompletion(questId) {
  const today = new Date().toISOString().slice(0, 10)
  const localProgress = loadLocalQuestProgress()
  const localEntry = localProgress[questId] || { times: 0, dates: [] }
  const localDates = normalizeDates([...(localEntry.dates || []), today])
  const alreadyDoneToday = (localEntry.dates || []).includes(today)

  const nextEntry = {
    times: alreadyDoneToday ? Math.max(localEntry.times || 0, localDates.length) : Math.max((localEntry.times || 0) + 1, localDates.length),
    dates: localDates,
  }
  const nextLocal = {
    ...localProgress,
    [questId]: nextEntry,
    _lastCompleted: { id: questId, date: today },
  }
  saveLocalQuestProgress(nextLocal)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: nextLocal, error: null }

  const { data: existing, error: fetchError } = await supabase
    .from('user_quest_progress')
    .select('quest_id, times, dates')
    .eq('quest_id', questId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchError) return { data: nextLocal, error: fetchError }

  const mergedEntry = mergeEntries(nextEntry, existing || {})
  const { error } = await supabase
    .from('user_quest_progress')
    .upsert({
      user_id: user.id,
      quest_id: questId,
      times: mergedEntry.times,
      dates: mergedEntry.dates,
      updated_at: new Date().toISOString(),
    })

  return { data: nextLocal, error }
}
