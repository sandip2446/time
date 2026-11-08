import { useCallback, useEffect, useState, type RefObject } from 'react'

type DocWithWebkit = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

type ElWithWebkit = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

function getFullscreenElement() {
  const doc = document as DocWithWebkit
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

async function requestFs(el: HTMLElement) {
  const node = el as ElWithWebkit
  if (el.requestFullscreen) {
    await el.requestFullscreen()
    return
  }
  if (node.webkitRequestFullscreen) {
    await node.webkitRequestFullscreen()
  }
}

async function exitFs() {
  const doc = document as DocWithWebkit
  if (document.fullscreenElement && document.exitFullscreen) {
    await document.exitFullscreen()
    return
  }
  if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
    await doc.webkitExitFullscreen()
  }
}

/**
 * Immersive / fullscreen mode.
 * Uses the Fullscreen API when available; always hides app chrome.
 */
export function useFullscreen(shellRef: RefObject<HTMLElement | null>) {
  const [immersive, setImmersive] = useState(false)

  const enter = useCallback(async () => {
    setImmersive(true)
    try {
      const el = shellRef.current ?? document.documentElement
      if (!getFullscreenElement()) {
        await requestFs(el)
      }
    } catch {
      /* iOS / blocked — immersive UI still applies */
    }
  }, [shellRef])

  const exit = useCallback(async () => {
    setImmersive(false)
    try {
      if (getFullscreenElement()) {
        await exitFs()
      }
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(async () => {
    if (immersive) await exit()
    else await enter()
  }, [immersive, enter, exit])

  useEffect(() => {
    const onFsChange = () => {
      if (!getFullscreenElement()) {
        setImmersive(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setImmersive(false)
      }
      if (
        e.key.toLowerCase() === 'f' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        const tag = (e.target as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        void toggle()
      }
    }

    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
      window.removeEventListener('keydown', onKey)
    }
  }, [toggle])

  return { immersive, enter, exit, toggle }
}
