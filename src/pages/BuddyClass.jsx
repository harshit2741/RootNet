import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Star, Volume2, VolumeX, Clock } from 'lucide-react'
import { useStore } from '../store'
import { LESSONS } from '../content'
import { COUNTING } from '../i18n'
import { Card, CardH, Hero } from '../components/ui'
import Mascot from '../components/Mascot'
import { speak, stopSpeaking, chime } from '../speak'

function Visual({ step }) {
  if (step.vis === 'intro' || step.vis === 'quiz') return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: 290, textAlign: 'center', gap: 14 }}>
      <motion.p key={step.chalk || step.q} className="chalk" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{step.chalk || step.q}</motion.p>
      <svg width="200" height="40" aria-hidden="true"><path d="M5 30 Q50 5 100 25 T195 20" stroke="#FFE27A" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="6 8" /></svg>
    </div>
  )
  if (step.vis === 'numbers') { const [a, b] = step.range; return (
    <div className="row" style={{ justifyContent: 'center', gap: 14, minHeight: 290 }}>
      {COUNTING.filter((x) => x.n >= a && x.n <= b).map((x, i) => <motion.div key={x.n} className="ncard" initial={{ opacity: 0, scale: .5, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: i * .9, type: 'spring' }}><b>{x.n}</b><span>{x.w}</span></motion.div>)}
    </div>) }
  if (step.vis === 'pattern') return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: 290, gap: 10 }}>
      <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>{[...Array(step.n)].map((_, i) => <motion.div key={i} initial={{ height: 0 }} animate={{ height: 150 }} transition={{ delay: i * .18 }} style={{ width: 26, borderRadius: 6, background: i % 3 === 0 ? '#FF5A1F' : '#FFE27A', outline: step.n > 10 && i === 13 ? '3px solid #fff' : 'none' }} />)}</div>
      <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>{[...Array(step.n)].map((_, i) => <span key={i} className="chalk-s" style={{ width: 26, textAlign: 'center', fontSize: '.8rem' }}>{i + 1}</span>)}</div>
    </div>
  )
  if (step.vis === 'share') return (
    <div style={{ position: 'relative', height: 290 }}>
      {[0, 1, 2, 3].map((b) => <div key={b} style={{ position: 'absolute', bottom: 8, left: `${8 + b * 23}%`, width: '18%', height: 70, borderRadius: '8px 8px 20px 20px', background: '#8A5A2B', display: 'grid', placeItems: 'end center', paddingBottom: 6 }}><span className="chalk-s" style={{ fontSize: '.8rem' }}>Family {b + 1}</span></div>)}
      {[...Array(12)].map((_, i) => { const b = i % 4, slot = Math.floor(i / 4); return <motion.div key={i} initial={{ left: '44%', top: 20 + (i % 4) * 8 }} animate={{ left: `${10 + b * 23 + slot * 4.5}%`, top: 150 }} transition={{ delay: .6 + i * .45, type: 'spring', stiffness: 90 }} style={{ position: 'absolute', width: 18, height: 44, borderRadius: 6, background: '#FFE27A', boxShadow: '0 3px 0 #C98300' }} /> })}
    </div>
  )
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: 290, gap: 10, textAlign: 'center' }}>
      <div className="row" style={{ gap: 10 }}>{[0, 1, 2].map((i) => <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: [0, 1.3, 1], rotate: 0 }} transition={{ delay: i * .25 }}><Star size={54} fill="#FFE27A" color="#FFE27A" /></motion.span>)}</div>
      <p className="chalk">Lesson complete! +50 stars</p>
    </div>
  )
}

export default function BuddyClass() {
  const s = useStore()
  const [lid, setLid] = useState('count'); const lesson = LESSONS.find((l) => l.id === lid)
  const [i, setI] = useState(0); const [playing, setPlaying] = useState(false); const [talking, setTalking] = useState(false)
  const [voiceOn, setVoiceOn] = useState(true); const [picked, setPicked] = useState(null); const [shake, setShake] = useState(0)
  const timer = useRef()
  const step = lesson.steps[i]
  const stop = () => { clearTimeout(timer.current); stopSpeaking(); setTalking(false) }
  useEffect(() => () => stop(), [])
  useEffect(() => { stop(); setI(0); setPicked(null); setPlaying(false) }, [lid])
  const advance = () => setI((x) => Math.min(lesson.steps.length - 1, x + 1))
  useEffect(() => {
    if (!playing) return
    setPicked(null); setTalking(true)
    const after = () => { setTalking(false); if (step.vis !== 'quiz' && step.vis !== 'win') timer.current = setTimeout(advance, step.vis === 'share' ? 3200 : step.vis === 'numbers' ? 1200 : 700); if (step.vis === 'win') { chime('win'); s.addXP(50); setPlaying(false) } }
    if (!(voiceOn && speak(step.say, after, 'buddy'))) timer.current = setTimeout(after, Math.max(3500, step.say.length * 55))
    return () => clearTimeout(timer.current)
  }, [i, playing]) // eslint-disable-line react-hooks/exhaustive-deps
  const answer = (o) => {
    setPicked(o)
    if (o === step.answer) { chime('win'); setTalking(true); speak(['Yes! Super!', 'Correct! Well done!', 'That’s right!'][i % 3], () => { setTalking(false); timer.current = setTimeout(advance, 400) }, 'buddy') || setTimeout(advance, 1200) }
    else { setShake((x) => x + 1); setTalking(true); speak('Hmm, not quite. Try again!', () => setTalking(false), 'buddy') }
  }
  return (
    <>
      <Hero eyebrow="Learn · Buddy’s Class" title="Learn with Buddy," emph="the hornbill tutor!" mood="cheer" say="Learn with Buddy, the hornbill tutor! Pick a lesson and press play."
        chips={<><span className="chip acc">3-minute cartoon lessons</span><span className="t2">Buddy talks, draws on the board and asks quick questions.</span></>} />
      <div className="grid g3">
        {LESSONS.map((l) => (
          <button key={l.id} type="button" onClick={() => setLid(l.id)} className="card" aria-pressed={lid === l.id} style={{ padding: 16, textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center', borderColor: lid === l.id ? 'var(--p)' : undefined, boxShadow: lid === l.id ? '0 4px 0 var(--p)' : undefined }}>
            <span style={{ width: 52, height: 52, borderRadius: 16, display: 'grid', placeItems: 'center', background: l.color, color: '#fff', flex: 'none', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.15)' }}><Play size={22} /></span>
            <div><b>{l.title}</b><div className="xs t3 row" style={{ gap: 6 }}>{l.tag} · <Clock size={11} />{l.mins} min</div></div>
          </button>
        ))}
      </div>
      <div className="grid split-7-5" data-tour="class">
        <div className="board"><AnimatePresence mode="wait"><motion.div key={lid + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Visual step={step} /></motion.div></AnimatePresence>
          <div className="row" style={{ position: 'absolute', left: 20, bottom: 14, gap: 6 }}>{lesson.steps.map((_, k) => <i key={k} style={{ width: k === i ? 22 : 8, height: 8, borderRadius: 4, background: k <= i ? '#FFE27A' : 'rgba(255,255,255,.3)', transition: 'width .3s' }} />)}</div>
        </div>
        <Card>
          <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: 12 }}>
            <Mascot size={120} mood={picked && picked === step.answer ? 'cheer' : step.vis === 'quiz' ? 'think' : 'happy'} talking={talking} />
            <motion.div key={lid + i} className="bubble-t" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} style={{ flex: 1, marginTop: 10 }}>{step.say}</motion.div>
          </div>
          {step.vis === 'quiz' && (
            <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} className="grid" style={{ gridTemplateColumns: `repeat(${step.options.length},1fr)`, gap: 10, marginTop: 18 }}>
              {step.options.map((o) => <button key={o} className={`btn opt ${picked === o ? (o === step.answer ? 'primary' : '') : ''}`} style={picked === o && o !== step.answer ? { borderColor: 'var(--crit)', color: 'var(--crit)' } : undefined} onClick={() => answer(o)}>{o}</button>)}
            </motion.div>
          )}
          <hr className="hr" style={{ margin: '18px 0 14px' }} />
          <div className="between">
            <div className="row" style={{ gap: 8 }}>
              <button className="btn primary" onClick={() => { if (playing) { stop(); setPlaying(false) } else { chime('start'); setPlaying(true) } }}>{playing ? <><Pause size={16} />Pause</> : <><Play size={16} />{i === 0 ? 'Start lesson' : 'Play'}</>}</button>
              <button className="btn icon" aria-label="Next step" onClick={() => { stop(); advance() }}><SkipForward size={16} /></button>
              <button className="btn icon" aria-label="Restart lesson" onClick={() => { stop(); setI(0); setPicked(null) }}><RotateCcw size={16} /></button>
            </div>
            <button className="btn small ghost" aria-pressed={voiceOn} onClick={() => { setVoiceOn(!voiceOn); stopSpeaking() }}>{voiceOn ? <Volume2 size={15} /> : <VolumeX size={15} />}{voiceOn ? 'Voice on' : 'Voice off'}</button>
          </div>
          <p className="xs t3" style={{ marginTop: 12 }}>Step {i + 1} of {lesson.steps.length}. Buddy’s voice uses the tablet’s built-in speech, so it works offline.</p>
        </Card>
      </div>
    </>
  )
}
