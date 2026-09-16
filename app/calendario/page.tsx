import { MatchesView } from '@/components/matches-view'
import { getAllMatches } from '@/lib/matches'

export const revalidate = 60

export default async function CalendarioPage() {
  return <MatchesView matches={await getAllMatches()} initialView="calendar" />
}