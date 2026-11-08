import { useEffect, useState } from 'react'

/** High-frequency clock tick for smooth analog hands. */
export function useNow(intervalMs = 50) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let frame = 0
    let last = 0

    const tick = (t: number) => {
      if (t - last >= intervalMs) {
        setNow(new Date())
        last = t
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [intervalMs])

  return now
}
