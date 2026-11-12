import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Pause, Flag, MessagesSquare, Headphones, EyeOff } from 'lucide-react'
import { useStore } from '../store'
import { Glass, PageHead, Seg, consentPill, Art, CardHead } from '../components/ui'

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function Library() {
  const s = useStore()
  const vis = s.records.filter((r) => r.status === 'approved' && r.consent !== 'restricted' && r.card)
  const [f, setF] = useState('All')
  const [sel, setSel] = useState(vis[0]?.id)
  const [pos, setPos] = useState(0); const [playing, setPlaying] = useState(false)
  const t = useRef()
  const list = vis.filter((r) => f === 'All' || r.card.subject === f)
  const r = vis.find((x) => x.id === sel) || vis[0]
  useEffect(() => { setPos(0); setPlaying(false); clearInterval(t.current) }, [sel])
  useEffect(() => () => clearInterval(t.current), [])
  const toggle = () => {
    if (playing) { clearInterval(t.current); setPlaying(false); return }
    setPlaying(true)
    t.current = setInterval(() => setPos((p) => { if (p >= r.secs) { clearInterval(t.current); setPlaying(false); return 0 } return p + 4 }), 250)
  }
  const hidden = s.records.filter((x) => x.consent === 'restricted').length
  const mission = r?.card?.mission && s.missions.find((m) => m.id === r.card.mission)
  return (
    <>
      <PageHead eyebrow="Village library" title="What our village knows" lede="Every card comes from a real voice in the village, linked to what you learn in school. A teacher checks each one before it appears here." />
      <div className="grid split-lib">
        <div className="stack">
          <Seg value={f} onChange={setF} label="Filter by subject" options={['All', ...new Set(vis.map((x) => x.card.subject))]} />
          {list.map((x) => (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} className="glass" aria-pressed={x.id === r?.id}
              style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, padding: 10, textAlign: 'left', cursor: 'pointer', outline: x.id === r?.id ? '2px solid var(--accent)' : 'none' }}>
              <div style={{ height: 64, borderRadius: 14, overflow: 'hidden' }}><Art kind={x.art} /></div>
              <div className="stack-sm" style={{ gap: 2 }}><b>{x.title}</b><span className="tiny faint">{x.who} · {x.card.subject}</span><span className="tiny faint row" style={{ gap: 4 }}><Headphones size={12} />{x.listens} listens</span></div>
            </button>
          ))}
          {hidden > 0 && <p className="tiny faint row" style={{ gap: 6 }}><EyeOff size={13} />{hidden} restricted record{hidden > 1 ? 's are' : ' is'} kept private and never shown here.</p>}
        </div>
        {r && (
          <Glass strong className="pad-lg stack" style={{ gap: 18 }}>
            <div style={{ height: 210, borderRadius: 20, overflow: 'hidden' }}><Art kind={r.art} /></div>
            <div className="between">
              <div><h2 style={{ fontSize: '1.6rem' }}>{r.title}</h2><p className="muted">{r.who} · {r.role} · speaks {r.lang}</p></div>
              <div className="row">{consentPill(r.consent)}<span className="pill accent">{r.card.subject} · {r.card.concept}</span></div>
            </div>
            <div className="neu" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
              <button className="btn primary icon" onClick={toggle} aria-label={playing ? 'Pause' : `Play ${r.who}’s recording`}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
              <div style={{ flex: 1 }}>
                <div className="bar accent"><motion.i animate={{ width: `${(pos / r.secs) * 100}%` }} transition={{ ease: 'linear', duration: .25 }} /></div>
                <div className="between tiny faint num" style={{ marginTop: 4 }}><span>{mmss(pos)}</span><span>{r.who} speaking in {r.lang} · {mmss(r.secs)}</span></div>
              </div>
            </div>
            <div><p className="eyebrow">What {r.who} knows</p><p style={{ fontSize: '1.12rem', lineHeight: 1.6, marginTop: 6 }}>{r.card.summary}</p></div>
            <div className="grid g2">
              <div className="well" style={{ padding: 16, borderLeft: '4px solid var(--gold)' }}><p className="eyebrow">Try these</p><ol style={{ margin: '8px 0 0', paddingLeft: 20, display: 'grid', gap: 6 }}>{r.card.qs.map((q) => <li key={q}>{q}</li>)}</ol></div>
              <div className="well" style={{ padding: 16, borderLeft: '4px solid var(--leaf)' }}><p className="eyebrow">Do it</p><p style={{ marginTop: 8 }}>{r.card.activity}</p></div>
            </div>
            <div className="row">
              {mission && <span className="btn gold" role="note"><Flag size={16} />Mission: {mission.title} · {mission.week.toLowerCase()}</span>}
              <Link to="/student/ask" className="btn"><MessagesSquare size={16} />Ask Buddy about this</Link>
            </div>
            <p className="tiny faint">Shared by {r.who} on {r.date} with “{r.consent === 'public' ? 'Public' : 'School only'}” consent. {r.who} can change this or take it back at any time.</p>
          </Glass>
        )}
      </div>
    </>
  )
}
