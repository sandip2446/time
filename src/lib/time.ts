export function pad(n: number, digits = 2) {
  return String(n).padStart(digits, '0')
}

export function formatDigital(date: Date, hour12 = true) {
  const h = hour12 ? date.getHours() % 12 || 12 : date.getHours()
  return {
    hours: pad(h),
    minutes: pad(date.getMinutes()),
    seconds: pad(date.getSeconds()),
    period: date.getHours() >= 12 ? 'PM' : 'AM',
  }
}

export function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export type DayPhase = 'dawn' | 'morning' | 'day' | 'golden' | 'dusk' | 'night'

export function getDayPhase(date: Date): DayPhase {
  const h = date.getHours() + date.getMinutes() / 60
  if (h >= 5 && h < 7) return 'dawn'
  if (h >= 7 && h < 11) return 'morning'
  if (h >= 11 && h < 16) return 'day'
  if (h >= 16 && h < 18.5) return 'golden'
  if (h >= 18.5 && h < 21) return 'dusk'
  return 'night'
}

export const skyThemes: Record<
  DayPhase,
  { from: string; via: string; to: string; ink: string; muted: string }
> = {
  dawn: {
    from: '#f7d9c4',
    via: '#f0b7a0',
    to: '#8eb8c9',
    ink: '#1a2428',
    muted: '#4a5560',
  },
  morning: {
    from: '#e8f4f2',
    via: '#c5e4df',
    to: '#9ec9c4',
    ink: '#0c1a1a',
    muted: '#3d5554',
  },
  day: {
    from: '#eaf4fb',
    via: '#cfe4f5',
    to: '#a8cce8',
    ink: '#0c1a22',
    muted: '#3d5566',
  },
  golden: {
    from: '#f8e6c8',
    via: '#e8c48a',
    to: '#c9a06a',
    ink: '#1f160c',
    muted: '#5c4a32',
  },
  dusk: {
    from: '#d4b8d8',
    via: '#8f7fb8',
    to: '#3d4a7a',
    ink: '#f5f0f8',
    muted: '#d0c6dc',
  },
  night: {
    from: '#1a2744',
    via: '#121c33',
    to: '#0a101f',
    ink: '#e8eef8',
    muted: '#9aa8c0',
  },
}

export function msToParts(ms: number) {
  const total = Math.max(0, Math.floor(ms))
  const hours = Math.floor(total / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  const centiseconds = Math.floor((total % 1000) / 10)
  return { hours, minutes, seconds, centiseconds }
}

export function formatDuration(ms: number, showHours = false) {
  const { hours, minutes, seconds, centiseconds } = msToParts(ms)
  const base = `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
  return showHours || hours > 0 ? `${pad(hours)}:${base}` : base
}
