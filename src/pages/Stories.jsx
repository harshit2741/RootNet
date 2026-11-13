import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ChevronLeft, ChevronRight, Mic, Eye, Headphones, Languages, MessageCircleQuestion } from 'lucide-react'
import { useStore } from '../store'
import { STORIES } from '../content'
import { Card, CardH, Hero, Seg, Art, Avatar, consentTag, Note } from '../components/ui'
import { speak, stopSpeaking, chime } from '../speak'
import { useKhasi } from '../i18n'

export default function Stories() {
  const s = useStore(); const kh = useKhasi()
  const kinds = ['All', ...new Set(STORIES.map((x) => x.kind))]
  const [kind, setKind] = useState('All'); const [sid, setSid] = useState('s2'); const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false); const [reveal, setReveal] = useState(false); const t = useRef()
  const st = STORIES.find((x) => x.id === sid); const sc = st.scenes[i]; const end = i >= st.scenes.length - 1
  const stop = () => { clearTimeout(t.current); stopSpeaking() }
  useEffect(() => { stop(); setI(0); setPlaying(false); setReveal(false) }, [sid])
  useEffect(() => () => stop(), [])
  useEffect(() => {
    if (!playing) return
    setReveal(false)
    const nxt = () => { if (sc.answer) { setReveal(true); speak(`It's ${sc.answer.toLowerCase()}!`, () => { t.current = setTimeout(go, 900) }, 'lively') || (t.current = setTimeout(go, 2000)) } else t.current = setTimeout(go, 700) }
    const go = () => { if (end) { setPlaying(false); chime('win') } else setI((x) => x + 1) }
    if (!speak(sc.text, nxt, 'elder')) t.current = setTimeout(nxt, Math.max(3500, sc.text.length * 60))
    return () => clearTimeout(t.current)
  }, [i, playing]) // eslint-disable-line react-hooks/exhaustive-deps
  const list = STORIES.filter((x) => kind === 'All' || x.kind === kind)
  return (
    <>
      <Hero eyebrow="Explore · Story Circle" title="Stories from our elders," emph="in their own voice." mood="happy" say="Story Circle. Folk tales, riddles, songs, games and life lessons, told by the elders of our village."
        chips={<><span className="chip acc">Folk tales · riddles · songs · games · values</span><span className="t2">Not just history: everything the village remembers.</span></>} />
      <Seg value={kind} onChange={setKind} label="Story type" options={kinds} />
      <div className="grid split-md">
        <div className="stack-s">
          {list.map((x) => (
            <button key={x.id} type="button" onClick={() => setSid(x.id)} className="card" aria-pressed={sid === x.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer', borderColor: sid === x.id ? 'var(--p)' : undefined, boxShadow: sid === x.id ? '0 4px 0 var(--p)' : undefined }}>
              <div style={{ height: 64, borderRadius: 14, overflow: 'hidden' }}><Art kind={x.art} /></div>
              <div><span className="tag acc">{x.kind}</span><b style={{ display: 'block', marginTop: 4 }}>{x.title}</b><span className="xs t3">{x.teller} · {x.mins} min</span></div>
            </button>
          ))}
        </div>
        <Card data-tour="story">
          <div className="between" style={{ marginBottom: 14 }}>
            <div className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={st.teller} lg /><div><b>{st.teller}</b><div className="xs t3">{st.role} · tells it in {st.lang}</div></div></div>
            <div className="row">{consentTag(st.consent)}<span className="tag"><Languages size={11} />Audio: {st.lang} · Captions: English</span></div>
          </div>
          <div className="scene">
            <AnimatePresence mode="wait"><motion.div key={sid + i} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }} style={{ position: 'absolute', inset: 0 }}><Art kind={sc.art} /></motion.div></AnimatePresence>
            <motion.div key={'c' + sid + i} className="cap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{sc.text}{sc.answer && reveal && <div style={{ color: '#FFE27A', marginTop: 6 }}>Answer: {sc.answer}</div>}</motion.div>
            <span className="tag" style={{ position: 'absolute', top: 14, left: 14 }}>Scene {i + 1} of {st.scenes.length}</span>
          </div>
          <div className="between" style={{ marginTop: 14 }}>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn icon" aria-label="Previous scene" onClick={() => { stop(); setI(Math.max(0, i - 1)); setReveal(false) }}><ChevronLeft size={17} /></button>
              <button className="btn primary" onClick={() => { if (playing) { stop(); setPlaying(false) } else { chime('start'); setPlaying(true) } }}>{playing ? <><Pause size={16} />Pause</> : <><Play size={16} />Listen to the story</>}</button>
              <button className="btn icon" aria-label="Next scene" onClick={() => { stop(); setI(Math.min(st.scenes.length - 1, i + 1)); setReveal(false) }}><ChevronRight size={17} /></button>
              {sc.answer && !reveal && <button className="btn small gold" onClick={() => setReveal(true)}><Eye size={14} />Show answer</button>}
            </div>
            <span className="xs t3 row" style={{ gap: 5 }}><Headphones size={12} />In the pilot: the elder’s own recording plays here{kh ? ' in Khasi' : ''}.</span>
          </div>
          {end && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid g2" style={{ marginTop: 18 }}>
            <div className="well" style={{ padding: 16 }}><b className="row" style={{ gap: 6 }}><MessageCircleQuestion size={16} color="var(--p)" />Talk about it</b><ol style={{ margin: '8px 0 0', paddingLeft: 20, display: 'grid', gap: 6 }}>{st.qs.map((q) => <li key={q} className="sm">{q}</li>)}</ol></div>
            <div className="well" style={{ padding: 16, display: 'grid', gap: 10 }}><span className="sm t2">{st.talk}</span><button className="btn small" style={{ justifySelf: 'start' }} onClick={() => s.toast('Retelling recorded for your teacher (simulated).')}><Mic size={14} />Retell it as a group</button></div>
          </motion.div>}
        </Card>
      </div>
      <Note>Sample stories are original and fictional, written for this prototype. In the pilot, elders record their own stories with consent, and the AI never adds cultural details.</Note>
    </>
  )
}
