export type Match = {
  match_id: number | string
  league_id: number | string | null
  jornada: number | null
  home_team: string
  away_team: string
  match_date: string | null // ISO date, e.g. "2026-09-12"
  match_time: string | null // e.g. "17:30:00" or "17:30"
  location: string | null
  status: string | null // e.g. "finished" | "scheduled" | "live"
  home_score: number | null
  away_score: number | null
}

export function isFinished(m: Pick<Match, 'status' | 'home_score' | 'away_score'>): boolean {
  const s = (m.status ?? '').toLowerCase()
  if (['finished', 'played', 'ft', 'final', 'finalizado', 'jugado'].includes(s)) return true
  // Fall back to score presence when status is unknown.
  return m.home_score != null && m.away_score != null
}
