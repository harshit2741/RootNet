import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { create } from 'zustand'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Sparkles } from 'lucide-react'
import Mascot from './Mascot'
import { speak, stopSpeaking, chime, voices, bestVoice, setVoice, setSpeed } from '../speak'

// The auto demo: a self-playing guided tour across every dashboard.
export const STEPS = [
  { route: '/', sel: 'hero', title: 'Welcome to ROOTS!', text: 'Here, the whole village becomes the classroom. Children learn at their own level, elders become teachers, and Buddy helps kids think. Let’s take a quick tour!' },
  { route: '/', sel: 'roles', title: 'Six spaces, six colours!', text: 'Students, teachers, elders, parents, the hub helper and the school committee. Each one gets a space built just for them.' },
  { route: '/student', sel: 'hero', title: 'Meet the student space!', text: 'Three or four friends share one tablet. No passwords! They just pick their group. And see that button? Every page can be read aloud.' },
  { route: '/student', sel: 'quest', title: 'Daily quests!', text: 'Small goals, every single day. Finish all three, and the treasure chest opens!' },
  { route: '/student', sel: 'tree', title: 'The Village Tree!', text: 'Every question the class solves adds a leaf. Together, they grow one tree. How cool is that?' },
  { route: '/student/class', sel: 'class', title: 'Buddy’s Class!', text: 'A cartoon hornbill tutor! Buddy talks, draws on the chalkboard and asks quick questions. Kids even count to ten in Khasi. Wei, ár, lái!' },
  { route: '/student/practice', sel: 'chat', title: 'Practice time!', text: 'Watch! The group types a wrong answer. Does Buddy give away the answer? No way! It unlocks a hint instead.', act: 'dark', extra: 2500 },
  { route: '/student/practice', sel: 'ladder', title: 'The hint ladder.', text: 'Hints stay locked until you try. First a nudge, then a village example, then talk it over. And the Checker must explain the answer!' },
  { route: '/student/practice', sel: 'chat', title: 'Nice try, kids!', text: 'They ask Buddy to just give the answer. Buddy says no, kindly, and asks for the first step instead.', act: 'just tell me the answer', extra: 2000 },
  { route: '/student/stories', sel: 'story', title: 'Story Circle!', text: 'Folk tales, riddles, songs, games and life lessons, told by elders in their own voice. Not just history. Everything the village remembers!' },
  { route: '/student/leaderboard', sel: 'top10', title: 'The daily Top 10!', text: 'Points for trying first, explaining and helping others. The board resets every day. And on Saturday, the winners lift the Hornbill Cup, woven by Bah Kynsai!' },
  { route: '/student/ask', sel: 'chat', title: 'Ask Buddy anything!', text: 'It answers only from lessons the teachers approved, and always shows its source. Watch it refuse to do the sum!', act: 'What is 45 × 3?', extra: 2500 },
  { route: '/village', sel: 'record', title: 'Village Voice!', text: 'An elder taps one big button and speaks, in their own language. Then they choose who may hear it.' },
  { route: '/village', sel: 'myrec', title: 'Their knowledge, their choice.', text: 'They can change their mind, or take a recording back, any time. And every story earns them a thank-you gift.' },
  { route: '/teacher', sel: 'banner', title: 'The teacher’s command center!', text: 'Alerts pop up right here. A group that is stuck. A lesson card waiting. A tablet running low.' },
  { route: '/teacher', sel: 'kpis', title: 'The numbers that matter.', text: 'Questions solved before opening a hint jumped from thirty-eight to sixty-three percent! Kids are thinking more.' },
  { route: '/teacher', sel: 'board', title: 'Every group, live!', text: 'Grouped by level, not by age. Ready for harder work? One tap moves them up.' },
  { route: '/teacher/approvals', sel: 'editor', title: 'The AI drafts. The teacher decides.', text: 'Overnight, the small AI turns each recording into a lesson card. The teacher checks it, and only then do children see it.' },
  { route: '/teacher/language', sel: 'desk', title: 'Speaking Khasi, the right way.', text: 'Free AI cannot handle Khasi well. So the village translates! Students draft, elders record, and teachers approve.' },
  { route: '/teacher/assistant', sel: 'chat', title: 'A helper for every teacher.', text: 'Ask in plain words. It reads only class data, right here on the laptop.', act: 'Which groups are stuck?', extra: 2500 },
  { route: '/parent', sel: 'ladders', title: 'For parents: progress, not marks.', text: 'Simple steps show how far a child has climbed. And yes, it is printed for families without phones.' },
  { route: '/hub', sel: 'kpis', title: 'Run by the village!', text: 'A trained Digital Didi looks after devices, power and backups. Running cost? About zero rupees a year!' },
  { route: '/impact', sel: 'charts', title: 'Proof it works.', text: 'Reading and maths levels are climbing, and the whole village is taking part. All for a one-time fifty thousand rupees.' },
  { route: '/privacy', sel: 'hero', title: 'Safe by design.', text: 'Data never leaves the school. Parents give consent. No ads, no tracking. And community knowledge stays with the community.' },
  { route: '/', sel: 'hero', title: 'That’s ROOTS!', text: 'The village is not waiting to be taught. It is ready to teach. Thank you for watching!' },
]

export const useTour = create((set) => ({
  running: false, i: 0, paused: false, voice: true, prompt: false,
  intro: (() => { try { return !sessionStorage.getItem('roots:intro') } catch { return true } })(),
  setIntro: (intro) => set({ intro }),
  start: () => { try { localStorage.setItem('roots:toured', '1') } catch { /* storage off */ } set({ running: true, i: 0, paused: false, prompt: false }) },
  stop: () => { stopSpeaking(); set({ running: false, paused: false }) },
  go: (i) => set({ i: Math.max(0, Math.min(STEPS.length - 1, i)) }),
  setPaused: (paused) => set({ paused }),
  setVoice: (voice) => set({ voice }),
  setPrompt: (prompt) => set({ prompt }),
}))

export function TourPrompt() {
  const { prompt, setPrompt, start } = useTour()
  return (
    <AnimatePresence>
      {prompt && (
        <motion.div className="tour-card" style={{ right: 24, bottom: 80, left: 'auto', top: 'auto' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} role="dialog" aria-label="Watch the demo">
          <div className="row" style={{ flexWrap: 'nowrap', gap: 14 }}>
            <Mascot size={74} mood="wave" />
            <div className="stack-s"><h3>New here? Let Buddy show you around.</h3><p className="sm t2">A 4-minute guided demo of every dashboard. It plays by itself, with narration.</p></div>
          </div>
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={start}><Play size={16} />Watch the demo</button>
            <button className="btn ghost" onClick={() => { setPrompt(false); try { localStorage.setItem('roots:toured', '1') } catch { /* storage off */ } }}>Explore myself</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Tour() {
  const { running, i, paused, voice, stop, go, setPaused, setVoice: setVoiceOn } = useTour()
  const nav = useNavigate(); const loc = useLocation()
  const [rect, setRect] = useState(null)
  const [vlist, setVlist] = useState([]); const [vname, setVname] = useState(''); const [fast, setFast] = useState(false)
  useEffect(() => { const load = () => { setVlist(voices()); setVname(bestVoice()?.name || '') }; load(); try { window.speechSynthesis.onvoiceschanged = load } catch { /* no voices */ } }, [])
  const timers = useRef([]); const elRef = useRef(null)
  const step = STEPS[i]
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  const next = useCallback(() => { const t = useTour.getState(); if (t.i >= STEPS.length - 1) t.stop(); else t.go(t.i + 1) }, [])

  // move to the step's page, find and frame its element
  useEffect(() => {
    if (!running) return
    clear(); stopSpeaking(); setRect(null)
    if (useTour.getState().voice) chime(i === 0 ? 'start' : i === STEPS.length - 1 ? 'win' : 'step')
    if (loc.pathname !== step.route) nav(step.route)
    later(() => {
      const el = document.querySelector(`[data-tour="${step.sel}"]`); elRef.current = el
      if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      later(() => {
        if (step.act) window.dispatchEvent(new CustomEvent('roots-tour-send', { detail: step.act }))
        if (!useTour.getState().paused) narrate()
      }, 650)
    }, loc.pathname !== step.route ? 650 : 150)
    return clear
  }, [running, i]) // eslint-disable-line react-hooks/exhaustive-deps

  const narrate = () => {
    const words = (step.title + ' ' + step.text).split(' ').length
    const minMs = Math.max(5200, words * 330) + (step.extra || 0)
    const t0 = Date.now(); let fired = false
    const advance = () => { if (!useTour.getState().paused && useTour.getState().running) next() }
    const done = () => { if (fired) return; fired = true; later(advance, Math.max(900, minMs - (Date.now() - t0))) }
    if (useTour.getState().voice && speak(`${step.title} ${step.text}`, done, 'lively')) { later(done, minMs * 1.6 + 4000); return } // fallback if the device voice never reports "finished"
    done()
  }
  useEffect(() => { if (!running) return; if (paused) { clear(); stopSpeaking() } else narrate() }, [paused]) // eslint-disable-line react-hooks/exhaustive-deps

  // keep the spotlight on the element as the page settles and scrolls
  useEffect(() => {
    if (!running) return
    let raf
    const tick = () => { const el = elRef.current && document.contains(elRef.current) ? elRef.current : document.querySelector(`[data-tour="${step.sel}"]`); elRef.current = el; if (el) { const r = el.getBoundingClientRect(); setRect((o) => (o && Math.abs(o.top - r.top) < 1 && Math.abs(o.height - r.height) < 1 && Math.abs(o.left - r.left) < 1 ? o : { top: r.top, left: r.left, width: r.width, height: r.height })) } raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [running, i]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (!running) return; const k = (e) => { if (e.key === 'Escape') stop(); if (e.key === 'ArrowRight') go(useTour.getState().i + 1); if (e.key === 'ArrowLeft') go(useTour.getState().i - 1); if (e.key === ' ') { e.preventDefault(); setPaused(!useTour.getState().paused) } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!running) return null
  const pad = 10, vw = window.innerWidth, vh = window.innerHeight
  const spot = rect ? { top: Math.max(6, rect.top - pad), left: Math.max(6, rect.left - pad), width: Math.min(vw - 12, rect.width + pad * 2), height: Math.min(vh - 12, rect.height + pad * 2) } : null
  const cw = Math.min(420, vw - 32), ch = 290
  let cardPos = { top: vh - ch - 24, left: (vw - cw) / 2 }
  if (spot && spot.width < vw * 0.45 && vw - (spot.left + spot.width) > cw + 40) {
    cardPos = { top: Math.max(80, Math.min(vh - ch - 20, spot.top + spot.height / 2 - ch / 2)), left: spot.left + spot.width + 24 }
  } else if (spot && spot.width < vw * 0.45 && spot.left > cw + 40) {
    cardPos = { top: Math.max(80, Math.min(vh - ch - 20, spot.top + spot.height / 2 - ch / 2)), left: spot.left - cw - 24 }
  } else if (spot) {
    const below = spot.top + spot.height + 16, above = spot.top - ch - 16
    if (below + ch < vh) cardPos = { top: below, left: spot.left + spot.width / 2 - cw / 2 }
    else if (above > 70) cardPos = { top: above, left: spot.left + spot.width / 2 - cw / 2 }
    else cardPos = { top: vh - ch - 24, left: vw - cw - 24 }
    cardPos.left = Math.max(16, Math.min(vw - cw - 16, cardPos.left))
  }
  return (
    <>
      <div className="tour-block" onClick={() => setPaused(true)} aria-hidden="true" />
      {spot ? <div className="tour-spot" style={spot} /> : <div className="tour-spot" style={{ top: vh / 2, left: vw / 2, width: 0, height: 0 }} />}
      <div className="tour-card" style={cardPos} role="dialog" aria-label={`Demo step ${i + 1} of ${STEPS.length}: ${step.title}`} aria-live="polite">
        <div className="row" style={{ flexWrap: 'nowrap', gap: 12, alignItems: 'flex-start' }}>
          <Mascot size={58} mood={step.act ? 'think' : i === STEPS.length - 1 ? 'cheer' : 'happy'} float={false} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="between" style={{ flexWrap: 'nowrap' }}><span className="tag acc"><Sparkles size={11} />Demo · {i + 1} of {STEPS.length}</span><button className="btn small icon ghost" aria-label="End demo" onClick={stop}><X size={16} /></button></div>
            <h3 style={{ marginTop: 6 }}>{step.title}</h3>
            <p className="sm t2" style={{ marginTop: 4 }}>{step.text}</p>
          </div>
        </div>
        <div className="tour-bar" style={{ margin: '14px 0 12px' }}><i style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} /></div>
        <div className="between">
          <div className="row" style={{ gap: 6 }}>
            <button className="btn small icon" aria-label="Previous step" onClick={() => go(i - 1)} disabled={i === 0}><SkipBack size={15} /></button>
            <button className="btn small primary" onClick={() => setPaused(!paused)}>{paused ? <><Play size={15} />Play</> : <><Pause size={15} />Pause</>}</button>
            <button className="btn small icon" aria-label="Next step" onClick={() => (i === STEPS.length - 1 ? stop() : go(i + 1))}><SkipForward size={15} /></button>
          </div>
          <button className="btn small ghost" onClick={() => { const v = !voice; setVoiceOn(v); if (!v) stopSpeaking() }} aria-pressed={voice}>{voice ? <Volume2 size={15} /> : <VolumeX size={15} />}{voice ? 'Narration on' : 'Narration off'}</button>
        </div>
        {voice && vlist.length > 0 && <div className="row" style={{ marginTop: 10, flexWrap: 'nowrap', gap: 8 }}>
          <select className="select" style={{ height: 34, fontSize: '.78rem', flex: 1 }} value={vname} onChange={(e) => { setVoice(e.target.value); setVname(e.target.value) }} aria-label="Narrator voice">{vlist.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/Microsoft |Online |\(Natural\) /g, '')}</option>)}</select>
          <button className="btn small" aria-pressed={fast} onClick={() => { setFast(!fast); setSpeed(fast ? 1 : 1.15) }}>{fast ? '1.15×' : '1×'}</button>
        </div>}
      </div>
    </>
  )
}
