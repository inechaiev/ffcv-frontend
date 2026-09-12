import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MatchDetail } from '@/components/match-detail'
import { createClient } from '@/lib/supabase/server'
import type { Match } from '@/lib/types'

export const revalidate = 60

const SELECT =
  'match_id, league_id, league_name, jornada, home_team, away_team, match_date, match_time, location, status, home_score, away_score'

async function getMatch(matchId: string): Promise<Match | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(SELECT)
    .eq('match_id', matchId)
    .maybeSingle()

  if (error) {
    console.log('[v0] Error loading match:', error.message)
    return null
  }
  return (data as Match) ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ match_id: string }>
}): Promise<Metadata> {
  const { match_id } = await params
  const match = await getMatch(match_id)
  if (!match) return { title: 'Partido no encontrado' }
  const title = `${match.home_team} vs ${match.away_team}`
  return {
    title,
    description: `Detalles del partido ${title}${match.location ? ` en ${match.location}` : ''}.`,
  }
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ match_id: string }>
}) {
  const { match_id } = await params
  const match = await getMatch(match_id)
  if (!match) notFound()

  return <MatchDetail match={match} />
}
