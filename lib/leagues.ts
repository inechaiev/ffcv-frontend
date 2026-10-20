import type { Match } from '@/lib/types'

export const competitionLabels: Record<string, string> = {
  '905431519': 'Tercera Federación de Fútbol Femenino - Grupo VI',
  '905431605': 'Tercera Federación - Grup VI',
  '905431607': 'Primera FFCV - Grup 1',
  '905431608': 'Primera FFCV - Grup 2',
  '905431609': 'Primera FFCV - Grup 3',
  '905431612': 'Segona FFCV - Grup 1',
  '905431613': 'Segona FFCV - Grup 2',
  '905431614': 'Segona FFCV - Grup 3',
  '905431615': 'Segona FFCV - Grup 4',
  '905431616': 'Segona FFCV - Grup 6',
  '905431619': 'Segona FFCV - Grup 5',
  '905431621': 'Tercera FFCV - Grup 1',
  '905431622': 'Tercera FFCV - Grup 2',
  '905431623': 'Tercera FFCV - Grup 3',
  '905431624': 'Tercera FFCV - Grup 4',
  '905431625': 'Tercera FFCV - Grup 5',
  '905431626': 'Tercera FFCV - Grup 6',
  '905431627': 'Tercera FFCV - Grup 7',
  '905431628': 'Tercera FFCV - Grup 8',
  '905431629': 'Tercera FFCV - Grup 9',
  '905431630': 'Tercera FFCV - Grup 10',
  '905431631': 'Tercera FFCV - Grup 11',
  '905431822': 'Lliga Comunitat - Grup Nord',
  '905431823': 'Lliga Comunitat - Grup Sud',
  '905431877': 'Lliga Autonòmica Valenta',
  '905431926': '1ª Regional Valenta - Grup 1',
  '905431927': '1ª Regional Valenta - Grup 2',
  '905432483': 'VI La Nostra Copa',
  '907115182': 'V La Nostra Copa Valenta - Eliminatorias',
}

export function normalizeLeagueId(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  const normalized = String(value).trim()
  return normalized || null
}

export function leagueLabel(match: Pick<Match, 'league_id' | 'league_name'>): string {
  const id = normalizeLeagueId(match.league_id)
  if (id && competitionLabels[id]) return competitionLabels[id]
  const name = match.league_name?.trim()
  if (name) return name
  return id ? `Liga ${id}` : 'Competición'
}

export function roundHref(match: Pick<Match, 'league_id' | 'jornada'>): string | null {
  const id = normalizeLeagueId(match.league_id)
  if (!id) return null
  const params = new URLSearchParams({ league: id })
  if (match.jornada != null && Number.isFinite(Number(match.jornada))) {
    params.set('jornada', String(Number(match.jornada)))
  }
  return `/?${params.toString()}`
}
