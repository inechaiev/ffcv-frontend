'use client'

import { CalendarX2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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

function normalizeLeagueId(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  const normalized = String(value).trim()
  return normalized || null
}

const competitionLabels: Record<string, string> = {
  '905431519': 'Tercera Federación de Fútbol Femenino - Grupo VI',
  '905431547': 'Lliga Comunitat Juvenil - Nord',
  '905431548': 'Lliga Comunitat Juvenil - Sud',
  '905431605': 'Tercera Federación - Grup VI',
  '905431607': 'Primera FFCV - Grup 1',
  '905431608': 'Primera FFCV - Grup 2',
  '905431609': 'Primera FFCV - Grup 3',
  '905431612': 'Segona FFCV - Grup 1',
  '905431613': 'Segona FFCV - Grup 2',
  '905431614': 'Segona FFCV - Grup 3',
  '905431615': 'Segona FFCV - Grup 4',
  '905431616': 'Segona FFCV - Grup 6',
  '905431619': 'Segona FFCV - Grup 5',
  '905431621': 'Tercera FFCV - Grup 1',
  '905431622': 'Tercera FFCV - Grup 2',
  '905431623': 'Tercera FFCV - Grup 3',
  '905431624': 'Tercera FFCV - Grup 4',
  '905431625': 'Tercera FFCV - Grup 5',
  '905431626': 'Tercera FFCV - Grup 6',
  '905431627': 'Tercera FFCV - Grup 7',
  '905431628': 'Tercera FFCV - Grup 8',
  '905431629': 'Tercera FFCV - Grup 9',
  '905431630': 'Tercera FFCV - Grup 10',
  '905431631': 'Tercera FFCV - Grup 11',
  '905431637': 'Segona FFCV Juvenil - Grup 1',
  '905431638': 'Segona FFCV Juvenil - Grup 2',
  '905431639': 'Segona FFCV Juvenil - Grup 3',
  '905431640': 'Segona FFCV Juvenil - Grup 4',
  '905431641': 'Segona FFCV Juvenil - Grup 5',
  '905431642': 'Segona FFCV Juvenil - Grup 6',
  '905431822': 'Lliga Comunitat - Grup Nord',
  '905431823': 'Lliga Comunitat - Grup Sud',
  '905431877': 'Lliga Autonòmica Valenta - Grup Únic',
  '905431879': 'Liga Nacional Juvenil - Grup VIII',
  '905431881': 'Primera FFCV Juvenil - Grup 1',
  '905431882': 'Primera FFCV Juvenil - Grup 2',
  '905431883': 'Primera FFCV Juvenil - Grup 3',
  '905431926': '1ª Regional Valenta - Grup 1',
  '905431927': '1ª Regional Valenta - Grup 2',
  '905432483': 'VI La Nostra Copa',
}

function displayLeagueName(match: Match): string {
  return competitionLabels[normalizeLeagueId(match.league_id) ?? '']
    ?? normalizeLeagueName(match.league_name)
    ?? `Liga ${normalizeLeagueId(match.league_id) ?? 'sin nombre'}`
}

export function MatchesView({ matches }: { matches: Match[] }) {
  const [search, setSearch] = useState('')
  const [league, setLeague] = useState('')
  const [jornada, setJornada] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLeague = params.get('league')
    const urlJornada = normalizeJornada(params.get('jornada'))
    if (urlLeague) setLeague(urlLeague)
    if (urlJornada !== null) setJornada(urlJornada)
  }, [])

  const leagues = useMemo(() => {
    return [...new Set(matches.map((m) => normalizeLeagueId(m.league_id)).filter(Boolean) as string[])]
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }, [matches])

  const leagueLabels = useMemo(
    () => Object.fromEntries(
      leagues.map((value) => {
        const firstMatch = matches.find((match) => normalizeLeagueId(match.league_id) === value)
        return [value, displayLeagueName(firstMatch ?? { league_id: value, league_name: null } as Match)]
      }),
    ),
    [leagues, matches],
  )

  const jornadas = useMemo(() => {
    const map = new Map<number, string | null>()
    for (const m of matches.filter((match) => normalizeLeagueId(match.league_id) === league)) {
      const normalized = normalizeJornada(m.jornada)
      if (normalized == null) continue
      if (!map.has(normalized)) map.set(normalized, m.match_date)
    }
    return [...map.entries()]
      .map(([value, d]) => ({ value, date: d }))
      .sort((a, b) => a.value - b.value)
  }, [matches, league])

  useEffect(() => {
    if (!leagues.length) return
    const preferred = leagues.find((id) => id === '905431605') ?? leagues.find((id) => {
      const label = leagueLabels[id] ?? ''
      return label.toLocaleLowerCase().includes('tercera federación') &&
        label.toLocaleLowerCase().includes('grup vi')
    })
    const nextLeague = league && leagues.includes(league) ? league : preferred ?? leagues[0]
    if (nextLeague !== league) setLeague(nextLeague)
  }, [leagues, league, leagueLabels])

  useEffect(() => {
    if (jornadas.length && !jornadas.some((item) => item.value === jornada)) {
      setJornada(jornadas[0].value)
    }
  }, [jornadas, jornada])

  useEffect(() => {
    if (!league || jornada === null) return
    const url = new URL(window.location.href)
    url.searchParams.set('league', league)
    url.searchParams.set('jornada', String(jornada))
    window.history.replaceState(null, '', `${url.pathname}?${url.searchParams.toString()}`)
  }, [league, jornada])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return matches
      .filter((m) => {
        if (normalizeLeagueId(m.league_id) !== league) return false
        if (normalizeJornada(m.jornada) !== jornada) return false
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
  }, [matches, league, jornada, search])

  const groups = useMemo(() => {
    const map = new Map<string, Match[]>()
    for (const m of filtered) {
      const key = m.match_date ?? 'sin-fecha'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(m)
    }

    return [...map.entries()].map(([key, list]) => {
      return {
        key,
        dateKey: key,
        list,
      }
    })
  }, [filtered])

  const selectedLeagueLabel = leagueLabels[league] ?? 'Competiciones'

  const hasFilters = search
  const clearAll = () => {
    setSearch('')
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
              {groups.map(({ key, dateKey, list }) => (
                <section key={key}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {formatLongDate(dateKey === 'sin-fecha' ? null : dateKey)}
                    </h3>
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
