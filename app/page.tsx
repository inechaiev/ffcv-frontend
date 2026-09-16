import { MatchesView } from '@/components/matches-view'
import { createClient } from '@/lib/supabase/server'
import type { Match } from '@/lib/types'

export const revalidate = 60

const MATCH_SELECT =
  'match_id, league_id, league_name, jornada, home_team, away_team, match_date, match_time, location, status, home_score, away_score'

function isJuvenilLeague(value: string | null | undefined): boolean {
  return Boolean(value && value.toLowerCase().includes('juvenil'))
}

async function getAllMatches(): Promise<Match[]> {
  const supabase = createClient()
  const pageSize = 1000
  const allMatches: Match[] = []

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from('matches')
      .select(MATCH_SELECT)
      .order('match_id', { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.log('[v0] Error loading matches:', error.message)
      return allMatches
    }

    allMatches.push(...((data as Match[]) ?? []))
    if (!data || data.length < pageSize) break
  }

  return allMatches.filter((match) => !isJuvenilLeague(match.league_name))
}

export default async function Page() {
  return <MatchesView matches={await getAllMatches()} />
}
