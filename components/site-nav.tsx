import Link from 'next/link'

const ITEMS = [
  { label: 'PARTIDOS', href: '/', active: true },
  { label: 'CLASIFICACIONES', href: '/' },
  { label: 'SANCIONES', href: '/' },
  { label: 'RANKINGS', href: '/' },
  { label: 'NOTICIAS', href: '/' },
]

export function SiteNav() {
  return (
    <nav aria-label="Principal" className="flex flex-wrap items-center gap-2 md:gap-3">
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={
            item.active
              ? 'rounded-full bg-orange px-5 py-2.5 font-display text-xs font-bold tracking-wide text-primary-foreground shadow-lg shadow-orange/30 transition hover:brightness-110 md:text-sm'
              : 'rounded-full border border-cyan/50 bg-navy-deep/40 px-5 py-2.5 font-display text-xs font-bold tracking-wide text-navy-foreground transition hover:border-cyan hover:bg-navy-deep/70 md:text-sm'
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
