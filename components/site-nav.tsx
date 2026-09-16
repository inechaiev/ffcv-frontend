'use client'

import Link from 'next/link'

type ViewMode = 'schedule' | 'calendar'

type SiteNavProps = {
  activeView?: ViewMode
  onViewChange?: (view: ViewMode) => void
}

const ITEMS: Array<{ key: ViewMode; label: string }> = [
  { key: 'schedule', label: 'PARTIDOS' },
  { key: 'calendar', label: 'CALENDARIO' },
]

export function SiteNav({ activeView = 'schedule', onViewChange }: SiteNavProps) {
  return (
    <nav aria-label="Principal" className="flex flex-wrap items-center gap-2 md:gap-3">
      {ITEMS.map((item) => {
        const isActive = activeView === item.key

        return (
          <Link
            key={item.key}
            href={item.key === 'schedule' ? '/partidos' : '/calendario'}
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? 'rounded-full bg-orange px-5 py-2.5 font-display text-xs font-bold tracking-wide text-primary-foreground shadow-lg shadow-orange/30 transition hover:brightness-110 md:text-sm'
                : 'rounded-full border border-cyan/50 bg-navy-deep/40 px-5 py-2.5 font-display text-xs font-bold tracking-wide text-navy-foreground transition hover:border-cyan hover:bg-navy-deep/70 md:text-sm'
            }
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
