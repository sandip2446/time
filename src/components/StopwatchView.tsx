import { Flag, Pause, Play, RotateCcw } from 'lucide-react'
import { useStopwatch } from '../hooks/useStopwatch'
import { formatDuration, msToParts, pad } from '../lib/time'
import { DigitalDisplay } from './DigitalDisplay'

type Props = {
  ink: string
  muted: string
  immersive?: boolean
}

export function StopwatchView({ ink, muted, immersive = false }: Props) {
  const { elapsed, running, laps, start, pause, reset, lap } = useStopwatch()
  const { hours, minutes, seconds, centiseconds } = msToParts(elapsed)
  const parts =
    hours > 0
      ? [pad(hours), pad(minutes), pad(seconds)]
      : [pad(minutes), pad(seconds)]

  return (
    <section className="animate-sweep-in flex h-full min-h-0 w-full flex-col">
      <div className="min-h-0 flex-1">
        <DigitalDisplay
          parts={parts}
          fraction={pad(centiseconds)}
          ink={ink}
          muted={muted}
          ariaLabel="Stopwatch elapsed"
          bold
          fillScreen
        />
      </div>

      {!immersive && (
        <div className="controls-bar flex shrink-0 flex-col items-center gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={reset}
              aria-label="Reset"
              className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.28)',
                color: ink,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
              }}
            >
              <RotateCcw size={22} />
            </button>
            {running ? (
              <button
                type="button"
                onClick={pause}
                aria-label="Pause"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sea text-sand transition-transform active:scale-95"
              >
                <Pause size={26} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={start}
                aria-label="Start"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sea text-sand transition-transform active:scale-95"
              >
                <Play size={26} fill="currentColor" className="ml-0.5" />
              </button>
            )}
            <button
              type="button"
              onClick={lap}
              aria-label="Lap"
              className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.28)',
                color: ink,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
              }}
            >
              <Flag size={22} />
            </button>
          </div>

          {laps.length > 0 && (
            <ul className="max-h-28 w-full max-w-md space-y-1.5 overflow-y-auto px-4">
              {laps.map((lapMs, i) => {
                const lapNum = laps.length - i
                const prev = laps[i + 1] ?? 0
                const split = lapMs - prev
                return (
                  <li
                    key={`${lapMs}-${i}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.16)',
                      color: ink,
                    }}
                  >
                    <span style={{ color: muted }}>Lap {lapNum}</span>
                    <span className="font-mono tabular-nums">
                      {formatDuration(split, true)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
