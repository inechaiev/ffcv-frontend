'use client'

import { CalendarX2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FilterBar } from '@/components/filter-bar'
import { MatchCard } from '@/components/match-card'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { formatLongDate, matchSortKey } from '@/lib/format'
import { isFinished, type Match } from '@/lib/types'

type ViewMode = 'schedule' | 'calendar'

const leagueOrder = [
  '905431605', '905431822', '905431823', '905431607', '905431608', '905431609',
  '905431612', '905431613', '905431614', '905431615', '905431619', '905431616',
  '905431621', '905431622', '905431623', '905431624', '905431625', '905431626',
  '905431627', '905431628', '905431629', '905431630', '905431631', '905432483',
  '905431519', '905431877', '905431926', '905431927',
]

const femaleLeagueIds = new Set(['905431519', '905431877', '905431926', '905431927'])

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

function parseDateInput(value: string | null): Date | null {
  if (!value) return null
  const normalized = value.trim()
  if (!normalized) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const [year, month, day] = normalized.split('-').map(Number)
    const parsed = new Date(year, month - 1, day)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) {
    const [day, month, year] = normalized.split('/').map(Number)
    const parsed = new Date(year, month - 1, day)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function toISODate(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(date).replace(/^(\w)/, (char) => char.toUpperCase())
}

const competitionLabels: Record<string, string> = {
  '905431519': 'Tercera Federación de Fútbol Femenino - Grupo VI',
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
  '905431822': 'Lliga Comunitat - Grup Nord',
  '905431823': 'Lliga Comunitat - Grup Sud',
  '905431877': 'Lliga Autonòmica Valenta',
  '905431926': '1ª Regional Valenta - Grup 1',
  '905431927': '1ª Regional Valenta - Grup 2',
  '905432483': 'VI La Nostra Copa',
}

function isJuvenilLeague(value: string | null | undefined): boolean {
  return Boolean(value && value.toLowerCase().includes('juvenil'))
}

function displayLeagueName(match: Match): string {
  return competitionLabels[normalizeLeagueId(match.league_id) ?? '']
    ?? normalizeLeagueName(match.league_name)
    ?? `Liga ${normalizeLeagueId(match.league_id) ?? 'sin nombre'}`
}

export function MatchesView({ matches, initialView }: { matches: Match[]; initialView: ViewMode }) {
  const visibleMatches = useMemo(
    () => matches.filter((match) => {
      const leagueName = normalizeLeagueName(match.league_name)
      const displayName = displayLeagueName(match)
      return !isJuvenilLeague(leagueName) && !isJuvenilLeague(displayName)
    }),
    [matches],
  )

  const [search, setSearch] = useState('')
  const [league, setLeague] = useState('')
  const [jornada, setJornada] = useState<number | null>(null)
  const [viewMode] = useState<ViewMode>(initialView)
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const init = new Date()
    init.setDate(1)
    return init
  })
  const [selectedDate, setSelectedDate] = useState<string>(() => toISODate(new Date()))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLeague = params.get('league')
    const urlJornada = normalizeJornada(params.get('jornada'))
    if (urlLeague) setLeague(urlLeague)
    if (urlJornada !== null) setJornada(urlJornada)
  }, [])

  const leagues = useMemo(() => {
    return [...new Set(visibleMatches.map((m) => normalizeLeagueId(m.league_id)).filter(Boolean) as string[])]
      .filter((id) => {
        const label = displayLeagueName(visibleMatches.find((match) => normalizeLeagueId(match.league_id) === id) ?? { league_id: id, league_name: null } as Match)
        return !isJuvenilLeague(label)
      })
      .sort((a, b) => {
        const aIndex = leagueOrder.indexOf(a)
        const bIndex = leagueOrder.indexOf(b)
        return (aIndex === -1 ? leagueOrder.length : aIndex) - (bIndex === -1 ? leagueOrder.length : bIndex)
      })
  }, [visibleMatches])

  const leagueLabels = useMemo(
    () => Object.fromEntries(
      leagues.map((value) => {
        const firstMatch = visibleMatches.find((match) => normalizeLeagueId(match.league_id) === value)
        return [value, displayLeagueName(firstMatch ?? { league_id: value, league_name: null } as Match)]
      }),
    ),
    [leagues, visibleMatches],
  )

  const jornadas = useMemo(() => {
    const map = new Map<number, string | null>()
    for (const m of visibleMatches.filter((match) => normalizeLeagueId(match.league_id) === league)) {
      const normalized = normalizeJornada(m.jornada)
      if (normalized == null) continue
      if (!map.has(normalized)) map.set(normalized, m.match_date)
    }
    return [...map.entries()]
      .map(([value, d]) => ({ value, date: d }))
      .sort((a, b) => a.value - b.value)
  }, [visibleMatches, league])

  // Jornada closest to today that still has pending (unfinished) matches, falling back to the most recent one.
  const currentJornada = useMemo(() => {
    if (!jornadas.length) return null

    const leagueMatches = visibleMatches.filter((m) => normalizeLeagueId(m.league_id) === league)
    const sorted = [...jornadas].sort((a, b) => {
      const dateA = parseDateInput(a.date)
      const dateB = parseDateInput(b.date)
      if (dateA && dateB) return dateA.getTime() - dateB.getTime()
      if (dateA) return -1
      if (dateB) return 1
      return a.value - b.value
    })

    const upcoming = sorted.find((j) =>
      leagueMatches.some((m) => normalizeJornada(m.jornada) === j.value && !isFinished(m)),
    )
    return upcoming ? upcoming.value : sorted[sorted.length - 1].value
  }, [jornadas, visibleMatches, league])

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
    if (league && !leagues.includes(league)) {
      setLeague(leagues[0] ?? '')
    }
  }, [league, leagues])

  useEffect(() => {
    if (jornadas.length && !jornadas.some((item) => item.value === jornada)) {
      setJornada(currentJornada ?? jornadas[0].value)
    }
  }, [jornadas, jornada, currentJornada])

  useEffect(() => {
    if (!league || jornada === null) return
    const url = new URL(window.location.href)
    url.pathname = '/'
    url.searchParams.set('league', league)
    url.searchParams.set('jornada', String(jornada))
    window.history.replaceState(null, '', `${url.pathname}?${url.searchParams.toString()}`)
  }, [league, jornada])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return visibleMatches
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
  }, [visibleMatches, league, jornada, search])

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

  const matchesByDay = useMemo(() => {
    const map = new Map<string, Match[]>()
    for (const match of visibleMatches) {
      const date = parseDateInput(match.match_date)
      if (!date) continue
      const key = toISODate(date)
      const bucket = map.get(key) ?? []
      bucket.push(match)
      bucket.sort((a, b) => matchSortKey(a.match_date, a.match_time).localeCompare(matchSortKey(b.match_date, b.match_time)))
      map.set(key, bucket)
    }
    return map
  }, [visibleMatches])

  const monthMatchDates = useMemo(() => {
    const set = new Set<string>()
    for (const [dateKey] of matchesByDay) {
      const parsed = parseDateInput(dateKey)
      if (!parsed) continue
      if (parsed.getFullYear() === calendarMonth.getFullYear() && parsed.getMonth() === calendarMonth.getMonth()) {
        set.add(dateKey)
      }
    }
    return set
  }, [calendarMonth, matchesByDay])

  useEffect(() => {
    const currentMonthMatchDates = [...monthMatchDates].sort()
    const today = new Date()
    const isCurrentMonth = calendarMonth.getFullYear() === today.getFullYear() &&
      calendarMonth.getMonth() === today.getMonth()
    const todayKey = toISODate(today)
    setSelectedDate((current) => {
      const currentDate = parseDateInput(current)
      const currentIsInMonth = currentDate &&
        currentDate.getFullYear() === calendarMonth.getFullYear() &&
        currentDate.getMonth() === calendarMonth.getMonth()
      if (currentIsInMonth) return current
      if (isCurrentMonth) return todayKey
      return currentMonthMatchDates[0] ?? toISODate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1))
    })
  }, [calendarMonth, monthMatchDates])

  const selectedDateMatches = useMemo(() => {
    if (!selectedDate) return []
    return (matchesByDay.get(selectedDate) ?? []).sort((a, b) =>
      matchSortKey(a.match_date, a.match_time).localeCompare(matchSortKey(b.match_date, b.match_time)),
    )
  }, [matchesByDay, selectedDate])

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const startOfMonth = new Date(year, month, 1)
    const offset = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1
    const startOfGrid = new Date(year, month, 1 - offset)
    const days: Date[] = []

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(startOfGrid)
      date.setDate(startOfGrid.getDate() + index)
      days.push(date)
    }

    return days
  }, [calendarMonth])

  const selectedLeagueLabel = leagueLabels[league] ?? 'Competiciones'

  const hasFilters = search
  const clearAll = () => {
    setSearch('')
  }

  const weekdays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

  return (
    <>
      <SiteHeader
        title={viewMode === 'calendar' ? 'Calendario' : selectedLeagueLabel}
        search={viewMode === 'schedule' ? search : undefined}
        onSearchChange={viewMode === 'schedule' ? setSearch : undefined}
        showSearch={viewMode === 'schedule'}
        activeView={viewMode}
      />

      <main className="mx-auto -mt-4 w-full max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-navy/5 md:p-6">
          {viewMode === 'schedule' ? (
            <>
              <FilterBar
                leagues={leagues}
                leagueLabels={leagueLabels}
                femaleLeagueIds={femaleLeagueIds}
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

                      <div className="space-y-3">
                        {list.map((match) => (
                          <MatchCard key={match.match_id} match={match} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-border bg-secondary/30 p-4 md:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition hover:border-orange hover:text-orange"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="text-center">
                      <p className="font-display text-xl font-extrabold uppercase tracking-wide text-foreground md:text-2xl">
                        {monthLabel(calendarMonth)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition hover:border-orange hover:text-orange"
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {weekdays.map((day) => (
                      <div key={day} className="px-1 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-2">
                    {calendarDays.map((day) => {
                      const isoDay = toISODate(day)
                      const isCurrentMonth = day.getMonth() === calendarMonth.getMonth()
                      const hasMatch = monthMatchDates.has(isoDay)
                      const isSelected = selectedDate === isoDay

                      return (
                        <button
                          key={isoDay}
                          type="button"
                          onClick={() => setSelectedDate(isoDay)}
                          className={[
                            'flex min-h-20 flex-col items-center justify-start rounded-xl border p-2 text-center transition',
                            isSelected
                              ? 'border-orange bg-orange/10 ring-2 ring-orange/30'
                              : 'border-border bg-card hover:border-orange/60 hover:bg-secondary/70',
                            !isCurrentMonth ? 'text-muted-foreground/60' : 'text-foreground',
                          ].join(' ')}
                        >
                          <span className="font-display text-sm font-bold">
                            {day.getDate()}
                          </span>
                          {hasMatch ? <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> : <span className="mt-2 h-2 w-2 rounded-full bg-transparent" aria-hidden="true" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
                      {selectedDate ? formatLongDate(selectedDate) : 'Sin partidos'}
                    </h3>
                    {selectedDate ? (
                      <span className="rounded-full bg-orange/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-orange">
                        {selectedDateMatches.length} {selectedDateMatches.length === 1 ? 'partido' : 'partidos'}
                      </span>
                    ) : null}
                  </div>

                  {selectedDateMatches.length ? (
                    <div className="space-y-3">
                      {selectedDateMatches.map((match) => (
                        <MatchCard
                          key={match.match_id}
                          match={match}
                          showCompetition
                          competitionLabel={displayLeagueName(match)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/20 px-6 py-12 text-center">
                      <CalendarX2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                      <p className="text-sm text-muted-foreground">
                        No hay partidos programados para esta fecha.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <SiteFooter />
      </main>
    </>
  )
}
