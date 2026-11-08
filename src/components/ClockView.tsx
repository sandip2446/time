import { formatDigital } from '../lib/time'
import { DigitalDisplay } from './DigitalDisplay'

type Props = {
  now: Date
  ink: string
  muted: string
  hour12: boolean
  onToggleFormat: () => void
  immersive?: boolean
}

export function ClockView({
  now,
  ink,
  muted,
  hour12,
  onToggleFormat,
}: Props) {
  const digital = formatDigital(now, hour12)

  return (
    <section className="animate-sweep-in flex h-full min-h-0 w-full flex-col">
      <div className="min-h-0 flex-1">
        <DigitalDisplay
          parts={[digital.hours, digital.minutes]}
          seconds={digital.seconds}
          ink={ink}
          muted={muted}
          period={hour12 ? digital.period : undefined}
          onTap={onToggleFormat}
          ariaLabel="Toggle 12/24 hour format"
          bold
          fillScreen
        />
      </div>
    </section>
  )
}
