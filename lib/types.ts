export type Match = {
  match_id: number | string
  league_id: number | string | null
  league_name: string | null
  jornada: number | null
  home_team: string
  away_team: string
  match_date: string | null // ISO date, e.g. "2026-09-12"
  match_time: string | null // e.g. "17:30:00" or "17:30"
  location: string | null
  status: string | null // FFCV codes: "0" programado, "1" finalizado, "3" suspendido, "6" resultado
  home_score: number | string | null
  away_score: number | string | null
}

const SUSPENDED_STATUSES = new Set(['3', 'suspendido', 'suspended'])
const FINISHED_STATUSES = new Set(['finished', 'played', 'ft', 'final', 'finalizado', 'jugado'])

export function hasScore(value: Match['home_score']): boolean {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

export function isSuspended(m: Pick<Match, 'status'>): boolean {
  return SUSPENDED_STATUSES.has((m.status ?? '').trim().toLowerCase())
}

export function isFinished(m: Pick<Match, 'status' | 'home_score' | 'away_score'>): boolean {
  if (isSuspended(m)) return false
  const s = (m.status ?? '').trim().toLowerCase()
  if (FINISHED_STATUSES.has(s)) return true
  // Fall back to score presence when status is unknown.
  return hasScore(m.home_score) && hasScore(m.away_score)
}

export function matchStatusLabel(m: Pick<Match, 'status' | 'home_score' | 'away_score'>): string {
  if (isSuspended(m)) return 'Suspendido'
  if (isFinished(m)) return 'Finalizado'
  return 'Programado'
}
