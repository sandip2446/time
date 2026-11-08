import { useCallback, useEffect, useRef, useState } from 'react'
import { playAlarmRing, stopAlarmRing, unlockAudio } from '../lib/ring'

export function useTimer(initialMs = 5 * 60_000) {
  const [duration, setDuration] = useState(initialMs)
  const [remaining, setRemaining] = useState(initialMs)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [ringing, setRinging] = useState(false)
  const endsAt = useRef<number | null>(null)

  const silence = useCallback(() => {
    stopAlarmRing()
    setRinging(false)
  }, [])

  useEffect(() => {
    return () => stopAlarmRing()
  }, [])

  useEffect(() => {
    if (!running) return

    let frame = 0
    const tick = () => {
      if (endsAt.current == null) return
      const left = Math.max(0, endsAt.current - performance.now())
      setRemaining(left)
      if (left <= 0) {
        setRunning(false)
        setDone(true)
        endsAt.current = null
        setRinging(true)
        void playAlarmRing()
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])

  const setDurationMs = useCallback(
    (ms: number) => {
      silence()
      const next = Math.max(0, Math.min(Math.round(ms), 99 * 3_600_000))
      setDuration(next)
      setRemaining(next)
      setDone(false)
      setRunning(false)
      endsAt.current = null
    },
    [silence],
  )

  const setMinutes = useCallback(
    (minutes: number) => {
      setDurationMs(minutes * 60_000)
    },
    [setDurationMs],
  )

  const start = useCallback(() => {
    if (remaining <= 0) return
    silence()
    // Unlock audio during the Start tap so the ring can play when time hits 0
    void unlockAudio()
    endsAt.current = performance.now() + remaining
    setDone(false)
    setRunning(true)
  }, [remaining, silence])

  const pause = useCallback(() => {
    if (endsAt.current != null) {
      setRemaining(Math.max(0, endsAt.current - performance.now()))
      endsAt.current = null
    }
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    silence()
    endsAt.current = null
    setRemaining(duration)
    setRunning(false)
    setDone(false)
  }, [duration, silence])

  return {
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
  }
}
