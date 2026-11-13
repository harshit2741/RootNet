// Expressive read-aloud with the device's own voices (offline on most devices).
// Browsers don't support SSML, so we get modulation by speaking sentence by sentence,
// lifting pitch on questions and exclamations, varying pace, and pausing between phrases.

const PREFERRED = [
  /Neerja.*Natural/i, /Aria.*Natural/i, /Jenny.*Natural/i, /Sonia.*Natural/i, /Natural.*India/i, /Natural/i,
  /Google UK English Female/i, /Google US English/i, /Heera/i, /Veena/i, /Rishi/i, /Samantha/i, /Karen/i, /Moira/i,
]
const STYLES = {
  lively: { pitch: 1.12, rate: 1.06 },  // narrator for the demo
  buddy: { pitch: 1.32, rate: 1.08 },   // cartoon tutor
  elder: { pitch: 0.95, rate: 0.92 },   // storyteller
  calm: { pitch: 1.0, rate: 1.0 },
}
let chosen = null
try { chosen = localStorage.getItem('roots:voice') } catch { /* storage off */ }

export function voices() {
  try { return window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)) } catch { return [] }
}
export function bestVoice() {
  const list = voices()
  if (chosen) { const v = list.find((x) => x.name === chosen); if (v) return v }
  for (const re of PREFERRED) { const v = list.find((x) => re.test(x.name)); if (v) return v }
  return list.find((x) => /en[-_]IN/i.test(x.lang)) || list[0] || null
}
export function setVoice(name) { chosen = name; try { localStorage.setItem('roots:voice', name) } catch { /* storage off */ } }

let speedMul = 1
export function setSpeed(m) { speedMul = m }

export function speak(text, onend, style = 'lively') {
  try {
    if (!('speechSynthesis' in window)) return false
    const synth = window.speechSynthesis
    synth.cancel()
    const base = STYLES[style] || STYLES.lively
    const v = bestVoice()
    const parts = String(text).replace(/·/g, ',').replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [String(text)]
    const chunks = parts.map((p) => p.trim()).filter(Boolean)
    if (!chunks.length) return false
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c)
      if (v) { u.voice = v; u.lang = v.lang } else u.lang = 'en-IN'
      let pitch = base.pitch, rate = base.rate
      if (/!$/.test(c)) { pitch += 0.16; rate += 0.05 }          // excitement
      else if (/\?$/.test(c)) { pitch += 0.12; rate -= 0.02 }    // curiosity
      if (c.length < 28) rate += 0.04                            // short punchy lines go faster
      if (i === 0 && style === 'lively') pitch += 0.06           // open with energy
      pitch += (i % 2 ? -0.04 : 0.04)                            // gentle up-down so it never sounds flat
      u.pitch = Math.max(0.6, Math.min(2, pitch))
      u.rate = Math.max(0.7, Math.min(1.6, rate * speedMul))
      if (i === chunks.length - 1 && onend) { u.onend = onend; u.onerror = onend }
      synth.speak(u)
    })
    return true
  } catch { return false }
}
export function stopSpeaking() { try { window.speechSynthesis.cancel() } catch { /* no voice */ } }

// Small cheerful sounds made with Web Audio (no files, works offline)
let ctx
export function chime(kind = 'step') {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    const notes = { step: [784, 1047], start: [523, 659, 784, 1047], win: [659, 784, 988, 1319], tap: [880] }[kind] || [784]
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.09
      o.type = 'triangle'; o.frequency.value = f
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.4)
    })
  } catch { /* audio blocked */ }
}

// Glass-break sound: a burst of filtered noise plus a few bright tinkles.
export function glassBreak() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    const t0 = ctx.currentTime, len = ctx.sampleRate * 0.9
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
    const src = ctx.createBufferSource(); src.buffer = buf
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2200
    const g = ctx.createGain(); g.gain.setValueAtTime(0.35, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.9)
    src.connect(hp).connect(g).connect(ctx.destination); src.start(t0)
    for (let k = 0; k < 7; k++) {
      const o = ctx.createOscillator(), gg = ctx.createGain(), t = t0 + 0.05 + Math.random() * 0.6
      o.type = 'sine'; o.frequency.value = 2500 + Math.random() * 3500
      gg.gain.setValueAtTime(0.0001, t); gg.gain.linearRampToValueAtTime(0.05, t + 0.005); gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
      o.connect(gg).connect(ctx.destination); o.start(t); o.stop(t + 0.3)
    }
  } catch { /* audio blocked */ }
}
