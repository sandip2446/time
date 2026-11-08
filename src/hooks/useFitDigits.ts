import { useLayoutEffect, useRef, useState } from 'react'

type Options = {
  /** Use nearly the entire stage with no soft max size. */
  fill?: boolean
}

/** Visual vertical stretch applied in CSS for fill mode — budget for it when fitting. */
const FILL_SCALE_Y_PORTRAIT = 1.35
const FILL_SCALE_Y_LANDSCAPE = 1.28

/** Scale digits to fill the available box in any orientation. */
export function useFitDigits(deps: unknown[] = [], options: Options = {}) {
  const { fill = false } = options
  const stageRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(fill ? 140 : 64)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const board = boardRef.current
    if (!stage || !board) return

    const measure = () => {
      const portrait = window.matchMedia('(orientation: portrait)').matches
      const sw = stage.clientWidth
      const sh = stage.clientHeight
      if (sw < 40 || sh < 40) return

      const probe = 100
      board.style.fontSize = `${probe}px`
      const bw = Math.max(board.scrollWidth, board.offsetWidth)
      const bh = Math.max(board.scrollHeight, board.offsetHeight)
      if (bw < 1 || bh < 1) return

      const scaleY = fill
        ? portrait
          ? FILL_SCALE_Y_PORTRAIT
          : FILL_SCALE_Y_LANDSCAPE
        : 1

      // Fill almost the full stage; leave a tiny margin
      const pad = fill ? 0.99 : portrait ? 0.9 : 0.88
      const byW = (sw * pad) / (bw / probe)
      // transform scaleY doesn't affect layout box — reserve height for the stretch
      const byH = (sh * pad) / ((bh / probe) * scaleY)
      const hardMax = fill ? 1200 : portrait ? 340 : 420
      const next = Math.max(36, Math.min(byW, byH, hardMax))
      setFontSize(next)
      board.style.fontSize = `${next}px`
    }

    const run = () => {
      measure()
      if (document.fonts?.ready) {
        void document.fonts.ready.then(measure)
      }
    }

    run()
    const t1 = window.setTimeout(run, 60)
    const t2 = window.setTimeout(run, 250)

    const ro = new ResizeObserver(run)
    ro.observe(stage)
    window.addEventListener('orientationchange', run)
    window.addEventListener('resize', run)
    document.addEventListener('fullscreenchange', run)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      ro.disconnect()
      window.removeEventListener('orientationchange', run)
      window.removeEventListener('resize', run)
      document.removeEventListener('fullscreenchange', run)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, fill])

  return { stageRef, boardRef, fontSize }
}
