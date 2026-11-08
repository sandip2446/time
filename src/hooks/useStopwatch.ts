import { useCallback, useEffect, useRef, useState } from 'react'

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const startedAt = useRef<number | null>(null)
  const baseElapsed = useRef(0)

  useEffect(() => {
    if (!running) return

    let frame = 0
    const tick = () => {
      if (startedAt.current != null) {
        setElapsed(baseElapsed.current + (performance.now() - startedAt.current))
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])

  const start = useCallback(() => {
    startedAt.current = performance.now()
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    if (startedAt.current != null) {
      baseElapsed.current += performance.now() - startedAt.current
      startedAt.current = null
    }
    setElapsed(baseElapsed.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    startedAt.current = null
    baseElapsed.current = 0
    setElapsed(0)
    setRunning(false)
    setLaps([])
  }, [])

  const lap = useCallback(() => {
    setLaps((prev) => [elapsed, ...prev])
  }, [elapsed])

  return { elapsed, running, laps, start, pause, reset, lap }
}
