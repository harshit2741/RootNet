import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Pause, Flag, MessagesSquare, Headphones, EyeOff } from 'lucide-react'
import { useStore } from '../store'
import { Card, Hero, Seg, consentTag, Art } from '../components/ui'

const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`

export default function Library() {
  const s = useStore()
  const vis = s.records.filter((r) => r.status === 'approved' && r.consent !== 'restricted' && r.card)
  const [f, setF] = useState('All'); const [sel, setSel] = useState(vis[0]?.id)
  const [pos, setPos] = useState(0); const [playing, setPlaying] = useState(false); const t = useRef()
  const list = vis.filter((r) => f === 'All' || r.card.subject === f)
  const r = vis.find((x) => x.id === sel) || vis[0]
  useEffect(() => { setPos(0); setPlaying(false); clearInterval(t.current) }, [sel])
  useEffect(() => () => clearInterval(t.current), [])
  const toggle = () => { if (playing) { clearInterval(t.current); setPlaying(false); return } setPlaying(true); t.current = setInterval(() => setPos((p) => { if (p >= r.secs) { clearInterval(t.current); setPlaying(false); return 0 } return p + 4 }), 250) }
  const hidden = s.records.filter((x) => x.consent === 'restricted').length
  const mission = r?.card?.mission && s.missions.find((m) => m.id === r.card.mission)
  return (
    <>
      <Hero eyebrow="Explore · Village library" title="What our village knows," emph="linked to what you learn." chips={<><Seg value={f} onChange={setF} label="Subject" options={['All', ...new Set(vis.map((x) => x.card.subject))]} /><span className="t2">Every card is checked by a teacher before it appears.</span></>} />
      <div className="grid split-md">
        <div className="stack-s">
          {list.map((x) => (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} className="card" aria-pressed={x.id === r?.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer', borderColor: x.id === r?.id ? 'var(--accent)' : undefined }}>
              <div style={{ height: 56, borderRadius: 12, overflow: 'hidden' }}><Art kind={x.art} /></div>
              <div><b>{x.title}</b><div className="xs t3">{x.who} · {x.card.subject}</div><div className="xs t3 row" style={{ gap: 4 }}><Headphones size={11} />{x.listens} listens</div></div>
            </button>
          ))}
          {hidden > 0 && <p className="xs t3 row" style={{ gap: 6, padding: '6px 4px' }}><EyeOff size={13} />{hidden} restricted record{hidden > 1 ? 's are' : ' is'} private and never shown here.</p>}
        </div>
        {r && (
          <Card data-tour="libcard" style={{ display: 'grid', gap: 20 }}>
            <div style={{ height: 200, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }}><Art kind={r.art} /></div>
            <div className="between" style={{ alignItems: 'flex-start' }}>
              <div><h2 style={{ fontSize: '1.6rem' }}>{r.title}</h2><p className="t2">{r.who} · {r.role} · speaks {r.lang}</p></div>
              <div className="row">{consentTag(r.consent)}<span className="tag acc">{r.card.subject} · {r.card.concept}</span></div>
            </div>
            <div className="well" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
              <button className="btn primary icon" onClick={toggle} aria-label={playing ? 'Pause' : `Play ${r.who}’s recording`}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
              <div style={{ flex: 1 }}><div className="track"><motion.i animate={{ width: `${(pos / r.secs) * 100}%` }} transition={{ ease: 'linear', duration: .25 }} /></div><div className="between mono xs t3" style={{ marginTop: 6 }}><span>{mmss(pos)}</span><span>{r.who.toUpperCase()} · {r.lang.toUpperCase()} · {mmss(r.secs)}</span></div></div>
            </div>
            <div><p className="eyebrow">What {r.who} knows</p><p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginTop: 10 }}>{r.card.summary}</p></div>
            <div className="grid g2">
              <div className="well" style={{ padding: 16 }}><p className="mono xs t3" style={{ letterSpacing: '.12em' }}>TRY THESE</p><ol style={{ margin: '8px 0 0', paddingLeft: 20, display: 'grid', gap: 6 }}>{r.card.qs.map((q) => <li key={q}>{q}</li>)}</ol></div>
              <div className="well" style={{ padding: 16 }}><p className="mono xs t3" style={{ letterSpacing: '.12em' }}>DO IT</p><p style={{ marginTop: 8 }}>{r.card.activity}</p></div>
            </div>
            <div className="row">{mission && <span className="chip acc"><Flag size={14} />Mission: {mission.title} · {mission.week.toLowerCase()}</span>}<Link to="/student/ask" className="btn"><MessagesSquare size={15} />Ask Buddy about this</Link></div>
            <p className="xs t3">Shared by {r.who} on {r.date} as “{r.consent === 'public' ? 'Public' : 'School only'}”. {r.who} can change this or take it back at any time.</p>
          </Card>
        )}
      </div>
    </>
  )
}
