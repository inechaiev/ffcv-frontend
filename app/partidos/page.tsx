import { MatchesView } from '@/components/matches-view'
import { getAllMatches } from '@/lib/matches'

export const revalidate = 60

type PartidosPageProps = {
  searchParams: Promise<{ league?: string | string[]; jornada?: string | string[] }>
}

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export default async function PartidosPage({ searchParams }: PartidosPageProps) {
  const params = await searchParams
  return (
    <MatchesView
      matches={await getAllMatches()}
      initialView="schedule"
      initialLeague={firstParam(params.league)}
      initialJornada={firstParam(params.jornada)}
    />
  )
}