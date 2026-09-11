const CAP = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "2026-09-12" -> "Sábado 12 de Septiembre de 2026" */
export function formatLongDate(date: string | null): string {
  if (!date) return 'Fecha por confirmar'
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
  return formatted.replace(/\b\w/g, (c) => c.toUpperCase())
}

/** "2026-09-12" -> "12 sept" */
export function formatShortDate(date: string | null): string {
  if (!date) return '—'
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return CAP(
    new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(d),
  )
}

/** Normalizes "17:30:00" or "17:30" -> "17:30". */
export function formatTime(time: string | null): string {
  if (!time) return '--:--'
  const match = time.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return time
  return `${match[1].padStart(2, '0')}:${match[2]}`
}

/** Stable sort key from date + time. */
export function matchSortKey(date: string | null, time: string | null): string {
  return `${date ?? '9999-99-99'}T${formatTime(time)}`
}
