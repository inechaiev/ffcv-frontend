export function SiteFooter() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-7xl border-t border-border px-4 py-8 md:px-8">
      <div className="rounded-2xl bg-navy px-5 py-6 text-navy-foreground md:px-7">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-tight">
          Contacto y Soporte
        </h2>
        <p className="mt-2 text-sm text-navy-foreground/70">
          ¿Falta algún partido o has detectado un error?
        </p>
        <a
          href="mailto:inechaiev@matchvlc.online"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan underline decoration-cyan/40 underline-offset-4 transition hover:text-white"
        >
          <span aria-hidden="true">✉️</span>
          inechaiev@matchvlc.online
        </a>
      </div>
    </footer>
  )
}