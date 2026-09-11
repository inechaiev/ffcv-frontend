const PALETTE = [
  'oklch(0.55 0.2 25)',
  'oklch(0.5 0.18 265)',
  'oklch(0.55 0.15 155)',
  'oklch(0.6 0.17 60)',
  'oklch(0.5 0.16 200)',
  'oklch(0.45 0.19 300)',
  'oklch(0.55 0.2 10)',
  'oklch(0.5 0.14 230)',
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function initials(name: string): string {
  const words = name
    .replace(/['".]/g, '')
    .split(/\s+/)
    .filter((w) => !['c.d', 'cd', 'u.d', 'ud', 's.c', 'sc', 'c.f', 'cf', 'u.e', 'ue', 'at', 'club'].includes(w.toLowerCase()))
  const source = words.length ? words : name.split(/\s+/)
  return source
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function TeamCrest({ name, size = 28 }: { name: string; size?: number }) {
  const color = PALETTE[hash(name) % PALETTE.length]
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-md font-display font-bold text-white shadow-sm ring-1 ring-black/5"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${color}, color-mix(in oklch, ${color} 65%, black))`,
        fontSize: size * 0.4,
      }}
    >
      {initials(name)}
    </span>
  )
}
