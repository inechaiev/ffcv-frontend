import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'
import { TeamCrest } from '@/components/team-crest'
import { formatLongDate, formatTime } from '@/lib/format'
import { hasScore, isFinished, type Match } from '@/lib/types'

function TeamRow({ name, score, showScore }: { name: string; score: Match['home_score']; showScore: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <TeamCrest name={name} />
      <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-foreground">
        {name}
      </span>
      {showScore ? (
        <span className="font-display text-xl font-extrabold text-score tabular-nums">
          {score}
        </span>
      ) : null}
    </div>
  )
}

function formatDateLabel(value: string | null): string {
  if (!value) return 'Fecha por confirmar'
  const date = new Date(value.includes('/') ? value.split('/').reverse().join('-') : value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function MatchCard({
  match,
  showCompetition = false,
  competitionLabel,
}: {
  match: Match
  showCompetition?: boolean
  competitionLabel?: string
}) {
  const finished = isFinished(match)
  const showScore = finished || (hasScore(match.home_score) && hasScore(match.away_score))
  const mapsUrl = match.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location)}`
    : null

  return (
    <div className="group flex items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-orange/50 hover:shadow-md">
      <div className="flex flex-1 flex-col">
        <Link
          href={`/match/${match.match_id}`}
          className="flex flex-1 flex-col justify-center gap-3 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <span>{formatLongDate(match.match_date ?? null).replace(/^\w/, (c) => c.toUpperCase())}</span>
            <span className="text-orange">{formatTime(match.match_time)}</span>
          </div>

          {showCompetition ? (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
              <span className="truncate">{competitionLabel ?? match.league_name ?? 'Competición'}</span>
              {match.jornada != null ? <span className="shrink-0 text-orange">Jornada {match.jornada}</span> : null}
            </div>
          ) : null}

          <TeamRow name={match.home_team} score={match.home_score} showScore={showScore} />
          <TeamRow name={match.away_team} score={match.away_score} showScore={showScore} />
        </Link>

        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            title="Abrir ubicación en Google Maps"
            className="relative z-10 mx-4 mb-4 flex items-center gap-2 border-t border-border pt-2 text-xs text-muted-foreground transition hover:text-orange"
          >
            <MapPin className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
            <span className="truncate">{match.location}</span>
          </a>
        ) : (
          <div className="mx-4 mb-4 flex items-center gap-2 border-t border-border pt-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
            <span className="truncate">Lugar por confirmar</span>
          </div>
        )}
      </div>

      <Link
        href={`/match/${match.match_id}`}
        className="flex w-28 shrink-0 flex-col items-center justify-center gap-1.5 border-l border-border bg-secondary/50 px-2"
      >
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
      </Link>
    </div>
  )
}
