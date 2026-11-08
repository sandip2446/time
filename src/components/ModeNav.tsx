import { Clock3, Timer, Watch } from 'lucide-react'

export type Mode = 'clock' | 'stopwatch' | 'timer'

const items: { id: Mode; label: string; icon: typeof Clock3 }[] = [
  { id: 'clock', label: 'Clock', icon: Clock3 },
  { id: 'stopwatch', label: 'Stopwatch', icon: Watch },
  { id: 'timer', label: 'Timer', icon: Timer },
]

type Props = {
  mode: Mode
  onChange: (mode: Mode) => void
  ink: string
  muted: string
}

export function ModeNav({ mode, onChange, ink, muted }: Props) {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1 sm:gap-2"
      aria-label="Clock modes"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const active = mode === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className="group flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold tracking-wide transition-all duration-300 sm:px-3.5"
            style={{
              color: active ? ink : muted,
              background: active ? 'rgba(255,255,255,0.28)' : 'transparent',
              boxShadow: active
                ? 'inset 0 0 0 1px rgba(255,255,255,0.35)'
                : 'none',
            }}
          >
            <Icon
              size={16}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="hidden sm:inline">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
