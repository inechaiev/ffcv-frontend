import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, MapPin, Trophy, Flag, Hash } from 'lucide-react'
import type { ReactNode } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { TeamCrest } from '@/components/team-crest'
import { formatLongDate, formatShortDate, formatTime } from '@/lib/format'
import { isFinished, type Match } from '@/lib/types'

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan/15 text-navy">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate font-display text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

export function MatchDetail({ match }: { match: Match }) {
  const finished = isFinished(match)
  const statusLabel = finished ? 'Finalizado' : 'Programado'
  const mapsUrl = match.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location)}`
    : null

  return (
    <>
      <header className="relative overflow-hidden bg-navy text-navy-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(120% 90% at 12% -10%, oklch(0.32 0.12 265) 0%, transparent 55%), radial-gradient(90% 80% at 100% 0%, oklch(0.28 0.11 250) 0%, transparent 50%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan/0 via-cyan to-cyan/0"
        />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-10 pt-6 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <BrandLogo />
            <SiteNav />
          </div>

          <div className="mt-8 text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-navy-foreground/60">
              {formatShortDate(match.match_date)}
              {match.jornada != null ? ` · Jornada ${match.jornada}` : ''}
            </p>
            {match.location ? (
              <a
                href={mapsUrl ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm text-navy-foreground/70 underline decoration-cyan/60 underline-offset-4 transition hover:text-cyan"
              >
                {match.location}
              </a>
            ) : null}

            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
              <div className="flex flex-col items-center gap-2 md:flex-row md:justify-end md:gap-4">
                <TeamCrest name={match.home_team} size={56} />
                <span className="text-center font-display text-lg font-extrabold text-balance md:text-right md:text-2xl">
                  {match.home_team}
                </span>
              </div>

              <div className="flex flex-col items-center">
                {finished ? (
                  <span className="font-display text-4xl font-extrabold tabular-nums md:text-5xl">
                    {match.home_score ?? 0}
                    <span className="mx-2 text-navy-foreground/40">-</span>
                    {match.away_score ?? 0}
                  </span>
                ) : (
                  <span className="rounded-xl bg-navy-deep px-4 py-2 font-display text-2xl font-extrabold text-cyan ring-1 ring-cyan/40 tabular-nums md:text-3xl">
                    {formatTime(match.match_time)}
                  </span>
                )}
                <span className="mt-2 rounded-full bg-orange/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-orange">
                  {statusLabel}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 md:flex-row md:justify-start md:gap-4">
                <TeamCrest name={match.away_team} size={56} />
                <span className="text-center font-display text-lg font-extrabold text-balance md:text-left md:text-2xl">
                  {match.away_team}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-4 w-full max-w-5xl px-4 pb-16 md:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-navy/5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
              Información del partido
            </h2>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-bold text-orange transition hover:brightness-110"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow
              icon={CalendarDays}
              label="Fecha"
              value={formatLongDate(match.match_date)}
            />
            <DetailRow icon={Clock} label="Hora" value={formatTime(match.match_time)} />
            <DetailRow
              icon={MapPin}
              label="Lugar"
              value={mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange underline decoration-orange/40 underline-offset-4 transition hover:brightness-110"
                >
                  {match.location}
                </a>
              ) : 'Por confirmar'}
            />
            <DetailRow icon={Flag} label="Estado" value={statusLabel} />
            {match.jornada != null ? (
              <DetailRow icon={Hash} label="Jornada" value={String(match.jornada)} />
            ) : null}
            {match.league_name ? (
              <DetailRow
                icon={Trophy}
                label="Competición"
                value={match.league_name}
              />
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Enfrentamiento
            </p>
            <p className="mt-1 font-display text-base font-bold text-foreground">
              {match.home_team} <span className="text-muted-foreground">vs</span>{' '}
              {match.away_team}
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
