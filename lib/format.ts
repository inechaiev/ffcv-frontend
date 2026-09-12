const CAP = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function parseDate(date: string): Date | null {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const europeanMatch = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  const parts = isoMatch
    ? [Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3])]
    : europeanMatch
      ? [Number(europeanMatch[3]), Number(europeanMatch[2]), Number(europeanMatch[1])]
      : null
  if (!parts) return null
  const parsed = new Date(parts[0], parts[1] - 1, parts[2])
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** Supports both "2026-09-12" and "12/09/2026". */
export function formatLongDate(date: string | null): string {
  if (!date) return 'Fecha por confirmar'
  const d = parseDate(date)
  if (!d) return date
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
  return formatted.replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Supports both "2026-09-12" and "12/09/2026". */
export function formatShortDate(date: string | null): string {
  if (!date) return '—'
  const d = parseDate(date)
  if (!d) return date
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
  if (!date) return `9999-99-99T${formatTime(time)}`
  const parsed = parseDate(date)
  const normalized = parsed
    ? `${parsed.getFullYear().toString().padStart(4, '0')}-${(parsed.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${parsed.getDate().toString().padStart(2, '0')}`
    : date
  return `${normalized}T${formatTime(time)}`
}
