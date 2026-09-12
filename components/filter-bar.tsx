'use client'

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import { formatShortDate } from '@/lib/format'

type JornadaOption = { value: number; date: string | null }

type FilterBarProps = {
  leagues: (number | string)[]
  leagueLabels: Record<string, string>
  league: string
  onLeagueChange: (v: string) => void
  group: string
  onGroupChange: (v: string) => void
  groupOptions: string[]
  jornadas: JornadaOption[]
  jornada: number | null
  onJornadaChange: (v: number | null) => void
}

function Field({
  label,
  children,
  highlight,
}: {
  label: string
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="relative">
        {children}
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
    </label>
  )
}

const selectClass =
  'h-11 w-full appearance-none rounded-lg border bg-card pl-3 pr-9 text-sm font-medium text-foreground outline-none transition focus:ring-2'

export function FilterBar({
  leagues,
  leagueLabels,
  league,
  onLeagueChange,
  group,
  onGroupChange,
  groupOptions,
  jornadas,
  jornada,
  onJornadaChange,
}: FilterBarProps) {
  const stripRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    stripRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Field label="Competición" highlight>
          <select
            value={league}
            onChange={(e) => onLeagueChange(e.target.value)}
            className={`${selectClass} border-orange ring-2 ring-orange/40 focus:ring-orange`}
          >
            <option value="all">Todas las competiciones</option>
            {leagues.map((l) => {
              const value = String(l)
              return (
                <option key={value} value={value}>
                  {leagueLabels[value] ?? value}
                </option>
              )
            })}
          </select>
        </Field>
        <Field label="Grupo">
          <select
            value={group}
            onChange={(e) => onGroupChange(e.target.value)}
            className={`${selectClass} border-input focus:ring-orange`}
          >
            {groupOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'Todos los grupos' : option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Jornadas anteriores"
          className="grid h-11 w-9 shrink-0 place-items-center rounded-lg bg-orange text-primary-foreground transition hover:brightness-110"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={stripRef}
          className="flex flex-1 gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <JornadaPill
            label="Todas"
            sub="las jornadas"
            active={jornada === null}
            onClick={() => onJornadaChange(null)}
          />
          {jornadas.map((j) => (
            <JornadaPill
              key={j.value}
              label={`J.${j.value}`}
              sub={formatShortDate(j.date)}
              active={jornada === j.value}
              onClick={() => onJornadaChange(j.value)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Jornadas siguientes"
          className="grid h-11 w-9 shrink-0 place-items-center rounded-lg bg-orange text-primary-foreground transition hover:brightness-110"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function JornadaPill({
  label,
  sub,
  active,
  onClick,
}: {
  label: string
  sub: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'flex min-w-[92px] shrink-0 flex-col items-center rounded-xl bg-navy px-4 py-2 ring-2 ring-cyan transition'
          : 'flex min-w-[92px] shrink-0 flex-col items-center rounded-xl bg-secondary px-4 py-2 transition hover:bg-accent'
      }
    >
      <span
        className={
          active
            ? 'font-display text-xs font-semibold text-navy-foreground/80'
            : 'font-display text-xs font-semibold text-muted-foreground'
        }
      >
        {label}
      </span>
      <span
        className={
          active
            ? 'font-display text-sm font-bold text-cyan'
            : 'font-display text-sm font-bold text-foreground'
        }
      >
        {sub}
      </span>
    </button>
  )
}
