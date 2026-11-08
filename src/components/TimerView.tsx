import { BellOff, Pause, Play, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import { msToParts, pad } from '../lib/time'
import { CustomTimerPicker } from './CustomTimerPicker'
import { DigitalDisplay } from './DigitalDisplay'

type Props = {
  ink: string
  muted: string
  immersive?: boolean
  onEnterFullscreen?: () => void
}

const CUSTOM_KEY = 'meridian-custom-timer-ms'

const presets = [
  { label: '1m', minutes: 1 },
  { label: '5m', minutes: 5 },
  { label: '10m', minutes: 10 },
  { label: '25m', minutes: 25 },
]

function readSavedCustom() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    if (!raw) return 3 * 60_000
    const n = Number(raw)
    return Number.isFinite(n) && n > 0 ? n : 3 * 60_000
  } catch {
    return 3 * 60_000
  }
}

export function TimerView({
  ink,
  muted,
  immersive = false,
  onEnterFullscreen,
}: Props) {
  const {
    duration,
    remaining,
    running,
    done,
    ringing,
    setMinutes,
    setDurationMs,
    start,
    pause,
    reset,
    silence,
  } = useTimer(5 * 60_000)

  const [showCustom, setShowCustom] = useState(false)
  const [customActive, setCustomActive] = useState(false)

  const { hours, minutes, seconds } = msToParts(remaining)
  const parts =
    hours > 0
      ? [pad(hours), pad(minutes), pad(seconds)]
      : [pad(minutes), pad(seconds)]

  const hideChrome = immersive

  const applyCustom = (ms: number) => {
    setDurationMs(ms)
    setCustomActive(true)
    try {
      localStorage.setItem(CUSTOM_KEY, String(ms))
    } catch {
      /* ignore */
    }
  }

  const presetActive = (minutes: number) =>
    !customActive &&
    Math.round(duration / 60_000) === minutes &&
    duration % 60_000 < 1000

  return (
    <section className="animate-sweep-in flex h-full min-h-0 w-full flex-col">
      <div
        className="min-h-0 flex-1"
        onClick={() => {
          if (ringing) silence()
        }}
      >
        <DigitalDisplay
          parts={parts}
          ink={done || ringing ? '#ef4444' : ink}
          muted={muted}
          bold
          fillScreen
          caption={
            hideChrome || running
              ? undefined
              : ringing
                ? 'Time is up — tap to silence'
                : done
                  ? 'Time is up'
                  : undefined
          }
          ariaLabel="Timer remaining"
        />
      </div>

      {!hideChrome && (
        <div className="controls-bar flex shrink-0 flex-col items-center gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {showCustom && !running && (
            <CustomTimerPicker
              ink={ink}
              muted={muted}
              disabled={running}
              durationMs={customActive ? duration : readSavedCustom()}
              onApply={applyCustom}
            />
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                disabled={running}
                onClick={() => {
                  setMinutes(p.minutes)
                  setCustomActive(false)
                  setShowCustom(false)
                }}
                className="min-h-11 rounded-xl px-4 py-2.5 font-mono text-sm font-medium transition-all active:scale-95 disabled:opacity-40"
                style={{
                  color: ink,
                  background: presetActive(p.minutes)
                    ? 'rgba(15,118,110,0.28)'
                    : 'rgba(255,255,255,0.2)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.28)',
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              disabled={running}
              onClick={() => {
                setShowCustom((v) => {
                  const next = !v
                  if (next) {
                    applyCustom(customActive ? duration : readSavedCustom())
                  }
                  return next
                })
              }}
              className="flex min-h-11 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
              style={{
                color: ink,
                background:
                  showCustom || customActive
                    ? 'rgba(15,118,110,0.28)'
                    : 'rgba(255,255,255,0.2)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.28)',
              }}
              aria-pressed={showCustom}
            >
              <SlidersHorizontal size={16} strokeWidth={2.2} />
              Custom
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={reset}
              aria-label="Reset timer"
              className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.28)',
                color: ink,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
              }}
            >
              <RotateCcw size={22} />
            </button>
            {ringing ? (
              <button
                type="button"
                onClick={silence}
                aria-label="Silence alarm"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white transition-transform active:scale-95"
              >
                <BellOff size={26} />
              </button>
            ) : running ? (
              <button
                type="button"
                onClick={pause}
                aria-label="Pause timer"
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sea text-sand transition-transform active:scale-95"
              >
                <Pause size={26} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  start()
                  onEnterFullscreen?.()
                }}
                aria-label="Start timer"
                disabled={remaining <= 0}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sea text-sand transition-transform active:scale-95 disabled:opacity-40"
              >
                <Play size={26} fill="currentColor" className="ml-0.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {hideChrome && ringing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
          <p
            className="rounded-full px-4 py-2 text-sm font-semibold tracking-wide"
            style={{
              color: ink,
              background: 'rgba(0,0,0,0.35)',
            }}
          >
            Tap anywhere to silence
          </p>
        </div>
      )}
    </section>
  )
}
