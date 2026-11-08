import { Maximize2, Minimize2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { ClockView } from './components/ClockView'
import { ModeNav, type Mode } from './components/ModeNav'
import { SkyBackground } from './components/SkyBackground'
import { StopwatchView } from './components/StopwatchView'
import { TimerView } from './components/TimerView'
import { useFullscreen } from './hooks/useFullscreen'
import { useNow } from './hooks/useNow'
import { getDayPhase, skyThemes } from './lib/time'

export default function App() {
  const now = useNow(40)
  const [mode, setMode] = useState<Mode>('clock')
  const [hour12, setHour12] = useState(true)
  const shellRef = useRef<HTMLDivElement>(null)
  const { immersive, enter, exit, toggle } = useFullscreen(shellRef)

  const phase = getDayPhase(now)
  const theme = skyThemes[phase]

  return (
    <div
      ref={shellRef}
      className="app-shell relative flex h-dvh max-h-dvh flex-col overflow-hidden"
      style={{ color: theme.ink }}
    >
      <SkyBackground phase={phase} />

      {!immersive && (
        <header className="app-chrome animate-sweep-in z-10 flex shrink-0 items-center justify-between gap-2 px-[max(0.75rem,env(safe-area-inset-left))] pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:gap-3 sm:px-[max(1.5rem,env(safe-area-inset-left))]">
          <div className="flex min-w-0 items-baseline gap-2">
            <h1
              className="font-display text-xl font-bold tracking-tight sm:text-2xl"
              style={{ color: theme.ink }}
            >
              Meridian
            </h1>
            <span
              className="hidden text-[0.65rem] font-medium uppercase tracking-[0.2em] md:inline"
              style={{ color: theme.muted }}
            >
              {phase}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <ModeNav
              mode={mode}
              onChange={setMode}
              ink={theme.ink}
              muted={theme.muted}
            />
            <button
              type="button"
              onClick={() => void enter()}
              aria-label="Full screen"
              title="Full screen"
              className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold tracking-wide transition-all active:scale-95"
              style={{
                color: theme.ink,
                background: 'rgba(255,255,255,0.22)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)',
              }}
            >
              <Maximize2 size={16} strokeWidth={2.2} />
              <span className="hidden sm:inline">Full screen</span>
            </button>
          </div>
        </header>
      )}

      {immersive && (
        <button
          type="button"
          onClick={() => void exit()}
          aria-label="Exit full screen"
          title="Exit full screen"
          className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-20 flex h-11 w-11 items-center justify-center rounded-xl opacity-35 transition-opacity hover:opacity-100 active:scale-95"
          style={{
            color: theme.ink,
            background: 'rgba(255,255,255,0.12)',
          }}
        >
          <Minimize2 size={18} strokeWidth={2.2} />
        </button>
      )}

      <main
        className={`relative z-10 flex min-h-0 flex-1 flex-col ${
          immersive
            ? 'px-0'
            : 'px-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]'
        }`}
        onDoubleClick={() => void toggle()}
      >
        {mode === 'clock' && (
          <ClockView
            now={now}
            ink={theme.ink}
            muted={theme.muted}
            hour12={hour12}
            onToggleFormat={() => setHour12((v) => !v)}
            immersive={immersive}
          />
        )}
        {mode === 'stopwatch' && (
          <StopwatchView
            ink={theme.ink}
            muted={theme.muted}
            immersive={immersive}
          />
        )}
        {mode === 'timer' && (
          <TimerView
            ink={theme.ink}
            muted={theme.muted}
            immersive={immersive}
            onEnterFullscreen={() => void enter()}
          />
        )}
      </main>
    </div>
  )
}
