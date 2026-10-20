import type { Metadata } from 'next'
import { MatchesView } from '@/components/matches-view'
import { getAllMatches } from '@/lib/matches'
import { firstQueryParam, scheduleMetadata } from '@/lib/site'

export const revalidate = 60

type PartidosPageProps = {
  searchParams: Promise<{ league?: string | string[]; jornada?: string | string[] }>
}

export async function generateMetadata({ searchParams }: PartidosPageProps): Promise<Metadata> {
  const params = await searchParams
  return scheduleMetadata(firstQueryParam(params.league), firstQueryParam(params.jornada))
}

export default async function PartidosPage({ searchParams }: PartidosPageProps) {
  const params = await searchParams
  return (
    <MatchesView
      matches={await getAllMatches()}
      initialView="schedule"
      initialLeague={firstQueryParam(params.league)}
      initialJornada={firstQueryParam(params.jornada)}
    />
  )
}