import type { Metadata } from 'next'
import { competitionLabels, normalizeLeagueId } from '@/lib/leagues'

export const siteUrl = 'https://matchvlc.online'

export function firstQueryParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export function scheduleMetadata(
  leagueValue: string | null,
  jornadaValue: string | null,
): Metadata {
  const leagueId = normalizeLeagueId(leagueValue)
  const leagueName = leagueId ? competitionLabels[leagueId] : null
  const jornada = jornadaValue && Number.isFinite(Number(jornadaValue)) ? String(Number(jornadaValue)) : null

  if (!leagueName || !leagueId) {
    return {
      title: { absolute: 'MatchVLC | Resultados y Horarios del Fútbol Valenciano' },
      description:
        'Resultados, horarios y jornadas de las ligas de la Comunitat Valenciana. Busca tu equipo y competición en MatchVLC.',
      alternates: { canonical: siteUrl },
    }
  }

  const round = jornada ? ` · Jornada ${jornada}` : ''
  const params = new URLSearchParams({ league: leagueId })
  if (jornada) params.set('jornada', jornada)

  return {
    title: `${leagueName}${round}`,
    description: `Resultados y horarios de ${leagueName}${jornada ? `, jornada ${jornada}` : ''}. Consulta los partidos de los equipos de esta competición en MatchVLC.`,
    alternates: { canonical: `${siteUrl}/?${params.toString()}` },
  }
}
