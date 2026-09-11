import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { TeamCrest } from '@/components/team-crest'
import { formatTime } from '@/lib/format'
import { isFinished, type Match } from '@/lib/types'

function TeamRow({ name, score, finished }: { name: string; score: number | null; finished: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <TeamCrest name={name} />
      <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-foreground">
        {name}
      </span>
      {finished ? (
        <span className="font-display text-xl font-extrabold text-score tabular-nums">
          {score ?? 0}
        </span>
      ) : null}
    </div>
  )
}

export function MatchCard({ match }: { match: Match }) {
  const finished = isFinished(match)
  return (
    <Link
      href={`/match/${match.match_id}`}
      className="group flex items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-orange/50 hover:shadow-md"
    >
      <div className="flex flex-1 flex-col justify-center gap-3 p-4">
        <TeamRow name={match.home_team} score={match.home_score} finished={finished} />
        <TeamRow name={match.away_team} score={match.away_score} finished={finished} />
      </div>

      <div className="flex w-28 shrink-0 flex-col items-center justify-center gap-1.5 border-l border-border bg-secondary/50 px-2">
        {finished ? (
          <>
            <span className="rounded-full bg-score/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-score">
              Final
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition group-hover:text-orange">
              Detalles <ChevronRight className="h-3 w-3" />
            </span>
          </>
        ) : (
          <>
            <span className="font-display text-lg font-extrabold text-foreground tabular-nums">
              {formatTime(match.match_time)}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-orange">
              Ver detalles <ChevronRight className="h-3 w-3" />
            </span>
          </>
        )}
      </div>
    </Link>
  )
}
