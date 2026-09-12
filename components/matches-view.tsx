'use client'

import { CalendarDays, CalendarX2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FilterBar } from '@/components/filter-bar'
import { MatchCard } from '@/components/match-card'
import { SiteHeader } from '@/components/site-header'
import { formatLongDate, matchSortKey } from '@/lib/format'
import type { Match } from '@/lib/types'

function normalizeJornada(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const number = Number(String(value).trim())
  return Number.isFinite(number) ? number : null
}

function normalizeLeagueName(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  const normalized = String(value).trim()
  return normalized ? normalized : null
}

function getGroupName(leagueName: string | null): string | null {
  if (!leagueName) return null
  const match = leagueName.match(/(?:\(|-|·)\s*((?:GRUP|Grupo|Grup)\b[^)]*|Nord|Sud|Únic)\s*\)?$/i)
  return match?.[1]?.trim() ?? null
}

export function MatchesView({ matches }: { matches: Match[] }) {
  const [search, setSearch] = useState('')
  const [league, setLeague] = useState('all')
  const [group, setGroup] = useState('all')
  const [jornada, setJornada] = useState<number | null>(null)
  const [date, setDate] = useState('')

  const leagues = useMemo(() => {
    const set = new Set<string>()
    for (const m of matches) {
      const normalized = normalizeLeagueName(m.league_name)
      if (normalized) set.add(normalized)
    }
    return [...set].sort((a, b) => {
      const aNum = Number(a)
      const bNum = Number(b)
      if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum
      return a.localeCompare(b)
    })
  }, [matches])

  const jornadas = useMemo(() => {
    const map = new Map<number, string | null>()
    for (const m of matches.filter((match) => {
      if (league !== 'all' && normalizeLeagueName(match.league_name) !== league) return false
      if (group !== 'all' && getGroupName(normalizeLeagueName(match.league_name)) !== group) return false
      return true
    })) {
      const normalized = normalizeJornada(m.jornada)
      if (normalized == null) continue
      if (!map.has(normalized)) map.set(normalized, m.match_date)
    }
    return [...map.entries()]
      .map(([value, d]) => ({ value, date: d }))
      .sort((a, b) => a.value - b.value)
  }, [matches, league, group])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return matches
      .filter((m) => {
        if (league !== 'all' && normalizeLeagueName(m.league_name) !== league) return false
        if (group !== 'all' && getGroupName(normalizeLeagueName(m.league_name)) !== group) return false
        if (jornada !== null && normalizeJornada(m.jornada) !== jornada) return false
        if (date && m.match_date !== date) return false
        if (q) {
          const hay = `${m.home_team} ${m.away_team}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
      .sort((a, b) =>
        matchSortKey(a.match_date, a.match_time).localeCompare(
          matchSortKey(b.match_date, b.match_time),
        ),
      )
  }, [matches, league, group, jornada, date, search])

  const groups = useMemo(() => {
    const map = new Map<string, Match[]>()
    for (const m of filtered) {
      const leagueKey = normalizeLeagueName(m.league_name) ?? 'sin-liga'
      const jornadaKey = normalizeJornada(m.jornada)?.toString() ?? 'sin-jornada'
      const key = `${m.match_date ?? 'sin-fecha'}|${leagueKey}|${jornadaKey}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(m)
    }

    return [...map.entries()].map(([key, list]) => {
      const [dateKey, leagueKey, jornadaKey] = key.split('|')
      return {
        key,
        dateKey,
        leagueLabel: leagueKey === 'sin-liga' ? 'Sin competición' : leagueKey,
        jornada: jornadaKey === 'sin-jornada' ? null : jornadaKey,
        list,
      }
    })
  }, [filtered])

  const selectedLeagueLabel =
    league === 'all' ? 'Competiciones' : league

  const leagueLabels = useMemo(
    () => Object.fromEntries(leagues.map((value) => [value, value])),
    [leagues],
  )

  const groupOptions = useMemo(
    () => ['all', ...new Set(leagues.map((value) => getGroupName(value)).filter(Boolean) as string[])],
    [leagues],
  )

  const hasFilters = search || league !== 'all' || group !== 'all' || jornada !== null || date
  const clearAll = () => {
    setSearch('')
    setLeague('all')
    setGroup('all')
    setJornada(null)
    setDate('')
  }

  return (
    <>
      <SiteHeader
        title={selectedLeagueLabel}
        search={search}
        onSearchChange={setSearch}
      />

      <main className="mx-auto -mt-4 w-full max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-navy/5 md:p-6">
          <FilterBar
            leagues={leagues}
            leagueLabels={leagueLabels}
            league={league}
            onLeagueChange={setLeague}
            group={group}
            onGroupChange={setGroup}
            groupOptions={groupOptions}
            jornadas={jornadas}
            jornada={jornada}
            onJornadaChange={setJornada}
          />

          <div className="mt-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="inline-block font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
                {selectedLeagueLabel}
              </h2>
              <div className="mt-1 h-0.5 w-24 rounded-full bg-orange" />
              <p className="mt-2 text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'partido' : 'partidos'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative flex items-center">
                <CalendarDays
                  className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label="Filtrar por fecha"
                  className="h-11 rounded-lg border border-input bg-card pl-9 pr-3 text-sm font-medium text-foreground outline-none transition focus:ring-2 focus:ring-orange"
                />
              </label>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex h-11 items-center gap-1 rounded-lg border border-input px-3 text-sm font-semibold text-muted-foreground transition hover:border-orange hover:text-orange"
                >
                  <X className="h-4 w-4" /> Limpiar
                </button>
              ) : null}
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <CalendarX2 className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="font-display text-lg font-bold text-foreground">
                No hay partidos
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                No se han encontrado partidos con los filtros seleccionados. Prueba a
                cambiar la jornada, la fecha o el término de búsqueda.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-8">
              {groups.map(({ key, dateKey, leagueLabel, jornada, list }) => (
                <section key={key}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {formatLongDate(dateKey === 'sin-fecha' ? null : dateKey)}
                    </h3>
                    <span className="text-sm text-muted-foreground">{leagueLabel}</span>
                    {jornada ? (
                      <span className="text-sm text-muted-foreground">
                        · Jornada {jornada}
                      </span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {list.map((m) => (
                      <MatchCard key={String(m.match_id)} match={m} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <SiteFooter />
      </main>
    </>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-10 text-center text-sm text-muted-foreground">
      <p>
        Copyright © {new Date().getFullYear()}. Todos los derechos reservados.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-orange">
        <span>Aviso Legal</span>
        <span className="text-border">·</span>
        <span>Política de Privacidad</span>
        <span className="text-border">·</span>
        <span>Política de Cookies</span>
      </div>
    </footer>
  )
}
