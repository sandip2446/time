/** Repeating alarm ring until stopped. */

let audioCtx: AudioContext | null = null
let repeatTimer: ReturnType<typeof setInterval> | null = null
let vibeTimer: ReturnType<typeof setInterval> | null = null
let active = false

function getCtx() {
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    audioCtx = new Ctx()
  }
  return audioCtx
}

/** Call from a user tap (Start) so iOS/Safari allow the later alarm. */
export async function unlockAudio() {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }
    // Tiny silent blip keeps the context warm on mobile
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    gain.gain.value = 0.0001
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.01)
  } catch {
    /* ignore */
  }
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume = 0.35,
  type: OscillatorType = 'square',
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

/** Classic phone-style double ring burst. */
function playBurst(ctx: AudioContext) {
  const t = ctx.currentTime + 0.02
  // First trill
  tone(ctx, 880, t, 0.12, 0.4, 'square')
  tone(ctx, 1175, t + 0.12, 0.12, 0.38, 'square')
  tone(ctx, 880, t + 0.24, 0.12, 0.4, 'square')
  tone(ctx, 1175, t + 0.36, 0.14, 0.4, 'square')
  // Pause then second trill
  tone(ctx, 880, t + 0.7, 0.12, 0.4, 'square')
  tone(ctx, 1175, t + 0.82, 0.12, 0.38, 'square')
  tone(ctx, 880, t + 0.94, 0.12, 0.4, 'square')
  tone(ctx, 1397, t + 1.06, 0.18, 0.42, 'square')
}

function vibratePulse() {
  try {
    navigator.vibrate?.([200, 80, 200, 80, 400])
  } catch {
    /* ignore */
  }
}

export function isAlarmRinging() {
  return active
}

export async function playAlarmRing() {
  stopAlarmRing()
  active = true

  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }
    playBurst(ctx)
    vibratePulse()

    repeatTimer = setInterval(() => {
      if (!active) return
      try {
        const c = getCtx()
        if (c.state === 'suspended') {
          void c.resume().then(() => playBurst(c))
        } else {
          playBurst(c)
        }
      } catch {
        stopAlarmRing()
      }
    }, 1800)

    vibeTimer = setInterval(() => {
      if (!active) return
      vibratePulse()
    }, 1800)
  } catch {
    active = false
    // Still try vibration if audio fails
    vibratePulse()
    vibeTimer = setInterval(() => {
      if (!active) return
      vibratePulse()
    }, 1800)
  }
}

export function stopAlarmRing() {
  active = false
  if (repeatTimer != null) {
    clearInterval(repeatTimer)
    repeatTimer = null
  }
  if (vibeTimer != null) {
    clearInterval(vibeTimer)
    vibeTimer = null
  }
  try {
    navigator.vibrate?.(0)
  } catch {
    /* ignore */
  }
}
