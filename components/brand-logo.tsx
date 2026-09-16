import Link from 'next/link'

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Inicio">
      <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-navy-deep ring-1 ring-cyan/40">
        <span className="font-display text-2xl font-extrabold italic tracking-tighter text-navy-foreground">
          F<span className="text-orange">F</span>
        </span>
        <span className="absolute -top-1 right-1 flex gap-0.5">
          <span className="h-1 w-1 rounded-full bg-cyan" />
          <span className="h-1 w-1 rounded-full bg-cyan/70" />
          <span className="h-1 w-1 rounded-full bg-cyan/40" />
        </span>
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan">
          Portal del
        </span>
        <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy-foreground/80">
          Fútbol
        </span>
        <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy-foreground/80">
          Valenciano
        </span>
      </span>
    </Link>
  )
}
