import { MatchesView } from '@/components/matches-view'
import { createClient } from '@/lib/supabase/server'
import type { Match } from '@/lib/types'

export const revalidate = 60

export default async function Page() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(
      'match_id, league_id, league_name, jornada, home_team, away_team, match_date, match_time, location, status, home_score, away_score',
    )
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true })

  if (error) {
    console.log('[v0] Error loading matches:', error.message)
  }

  return <MatchesView matches={(data as Match[]) ?? []} />
}
