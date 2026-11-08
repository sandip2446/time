import type { DayPhase } from '../lib/time'
import { skyThemes } from '../lib/time'

type Props = {
  phase: DayPhase
}

export function SkyBackground({ phase }: Props) {
  const theme = skyThemes[phase]

  return (
    <div
      className="sky-layer pointer-events-none absolute inset-0 -z-10"
      style={{
        background: `linear-gradient(165deg, ${theme.from} 0%, ${theme.via} 48%, ${theme.to} 100%)`,
      }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute -top-24 left-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            phase === 'night' || phase === 'dusk'
              ? 'radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%)',
        }}
      />
    </div>
  )
}
