import type { ReactNode } from 'react'
import { useFitDigits } from '../hooks/useFitDigits'

type Props = {
  /** Primary time segments, e.g. ["09","47"] or ["05","00"] */
  parts: string[]
  /** Optional trailing small segment like centiseconds */
  fraction?: string
  /** Small secondary seconds (clock style) */
  seconds?: string
  ink: string
  muted: string
  period?: string
  caption?: ReactNode
  onTap?: () => void
  ariaLabel?: string
  /** Extra-bold display digits */
  bold?: boolean
  /** Grow digits to fill nearly the entire screen */
  fillScreen?: boolean
}

export function DigitalDisplay({
  parts,
  fraction,
  seconds,
  ink,
  muted,
  period,
  caption,
  onTap,
  ariaLabel,
  bold = false,
  fillScreen = false,
}: Props) {
  const { stageRef, boardRef, fontSize } = useFitDigits(
    [
      parts.length,
      Boolean(fraction),
      Boolean(seconds),
      Boolean(period),
      fillScreen,
    ],
    { fill: fillScreen },
  )

  const digits = (
    <>
      {parts.map((part, i) => (
        <span key={`p-${i}`} className="digital-unit">
          {i > 0 && (
            <span className="digital-sep" aria-hidden>
              :
            </span>
          )}
          <span className="digital-digit font-mono tabular-nums tracking-tight">
            {part}
          </span>
        </span>
      ))}
      {fraction != null && (
        <span className="digital-unit digital-fraction">
          <span className="digital-sep" aria-hidden>
            .
          </span>
          <span className="digital-digit digital-frac-digit font-mono tabular-nums tracking-tight">
            {fraction}
          </span>
        </span>
      )}
      {(seconds != null || period) && (
        <span className="digital-meta" style={{ color: ink }}>
          {seconds != null && (
            <span className="digital-seconds font-mono tabular-nums tracking-tight">
              {seconds}
            </span>
          )}
          {period && (
            <span className="digital-period font-semibold tracking-[0.12em]">
              {period}
            </span>
          )}
        </span>
      )}
    </>
  )

  const boardClass = [
    'digital-board',
    'select-none',
    bold || fillScreen ? 'is-bold' : '',
    fillScreen ? 'is-fill' : '',
    seconds != null ? 'has-meta' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center">
      <div
        ref={stageRef}
        className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-0"
      >
        {onTap ? (
          <button
            type="button"
            onClick={onTap}
            aria-label={ariaLabel}
            className="appearance-none border-0 bg-transparent p-0"
            style={{ color: ink }}
          >
            <div ref={boardRef} className={boardClass} style={{ fontSize }}>
              {digits}
            </div>
          </button>
        ) : (
          <div
            ref={boardRef}
            className={boardClass}
            style={{ color: ink, fontSize }}
            aria-label={ariaLabel}
          >
            {digits}
          </div>
        )}
      </div>

      {caption && (
        <div
          className="digital-caption shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center font-display font-medium tracking-wide"
          style={{ color: muted }}
        >
          {caption}
        </div>
      )}
    </div>
  )
}
