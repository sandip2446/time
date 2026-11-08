import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { pad } from '../lib/time'

type Props = {
  ink: string
  muted: string
  disabled?: boolean
  /** Current timer duration in ms — used to seed values when opening */
  durationMs: number
  onApply: (ms: number) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function Unit({
  label,
  value,
  max,
  ink,
  muted,
  disabled,
  onChange,
}: {
  label: string
  value: number
  max: number
  ink: string
  muted: string
  disabled?: boolean
  onChange: (n: number) => void
}) {
  const [text, setText] = useState(pad(value))

  useEffect(() => {
    setText(pad(value))
  }, [value])

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        disabled={disabled}
        aria-label={`Increase ${label}`}
        onClick={() => onChange(clamp(value + 1, 0, max))}
        className="flex h-10 w-14 items-center justify-center rounded-xl transition-transform active:scale-95 disabled:opacity-40"
        style={{
          color: ink,
          background: 'rgba(255,255,255,0.18)',
        }}
      >
        <ChevronUp size={20} />
      </button>

      <label className="flex flex-col items-center gap-0.5">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={disabled}
          value={text}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
            setText(raw)
            if (raw === '') return
            onChange(clamp(Number(raw), 0, max))
          }}
          onBlur={() => {
            const n = clamp(Number(text || '0'), 0, max)
            setText(pad(n))
            onChange(n)
          }}
          className="w-16 appearance-none border-0 bg-transparent text-center font-mono text-3xl font-bold tabular-nums outline-none disabled:opacity-40"
          style={{ color: ink }}
          aria-label={label}
        />
        <span
          className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]"
          style={{ color: muted }}
        >
          {label}
        </span>
      </label>

      <button
        type="button"
        disabled={disabled}
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(clamp(value - 1, 0, max))}
        className="flex h-10 w-14 items-center justify-center rounded-xl transition-transform active:scale-95 disabled:opacity-40"
        style={{
          color: ink,
          background: 'rgba(255,255,255,0.18)',
        }}
      >
        <ChevronDown size={20} />
      </button>
    </div>
  )
}

export function CustomTimerPicker({
  ink,
  muted,
  disabled,
  durationMs,
  onApply,
}: Props) {
  const seed = () => {
    const total = Math.max(0, Math.floor(durationMs / 1000))
    return {
      h: Math.floor(total / 3600),
      m: Math.floor((total % 3600) / 60),
      s: total % 60,
    }
  }

  const [h, setH] = useState(() => seed().h)
  const [m, setM] = useState(() => seed().m)
  const [s, setS] = useState(() => seed().s)

  useEffect(() => {
    if (disabled) return
    const next = seed()
    setH(next.h)
    setM(next.m)
    setS(next.s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs])

  const apply = (nh: number, nm: number, ns: number) => {
    const hours = clamp(nh, 0, 99)
    const minutes = clamp(nm, 0, 59)
    const seconds = clamp(ns, 0, 59)
    setH(hours)
    setM(minutes)
    setS(seconds)
    onApply((hours * 3600 + minutes * 60 + seconds) * 1000)
  }

  return (
    <div
      className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl px-4 py-3"
      style={{
        background: 'rgba(255,255,255,0.12)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)',
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: muted }}
      >
        Custom timer
      </p>

      <div className="flex items-center gap-2 sm:gap-3">
        <Unit
          label="hr"
          value={h}
          max={99}
          ink={ink}
          muted={muted}
          disabled={disabled}
          onChange={(n) => apply(n, m, s)}
        />
        <span
          className="pb-5 font-mono text-2xl font-bold"
          style={{ color: muted }}
        >
          :
        </span>
        <Unit
          label="min"
          value={m}
          max={59}
          ink={ink}
          muted={muted}
          disabled={disabled}
          onChange={(n) => apply(h, n, s)}
        />
        <span
          className="pb-5 font-mono text-2xl font-bold"
          style={{ color: muted }}
        >
          :
        </span>
        <Unit
          label="sec"
          value={s}
          max={59}
          ink={ink}
          muted={muted}
          disabled={disabled}
          onChange={(n) => apply(h, m, n)}
        />
      </div>
    </div>
  )
}
