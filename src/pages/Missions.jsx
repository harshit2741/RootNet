import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flag, Check, Gift, CalendarDays, Sparkles, Package } from 'lucide-react'
import { useStore } from '../store'
import { Glass, CardHead, PageHead, Art, Avatar } from '../components/ui'

const QUESTIONS = {
  r1: ['Who taught you to weave, and how old were you?', 'How do you know when a strip is the right length?', 'Why does the pattern have to repeat exactly?', 'How many baskets can you make in a week?'],
  r2: ['How do you know the seedlings are ready to move?', 'What happens if the rain comes late?', 'How do you measure the space between plants?', 'Which months are the busiest on the terraces?'],
}

export default function Missions() {
  const s = useStore()
  const [sel, setSel] = useState('pattern')
  const [iq, setIq] = useState(null)
  const m = s.missions.find((x) => x.id === sel)
  const rec = s.records.find((r) => r.id === m.from)
  const [steps, setSteps] = useState({ pattern: [true, true, false, false, false], market: [false, false, false, false], bridge: [false, false, false, false] })
  const tick = (i) => setSteps({ ...steps, [sel]: steps[sel].map((v, k) => (k === i ? !v : v)) })
  const doneN = steps[sel].filter(Boolean).length
  const dividends = s.records.filter((r) => r.dividend)
  return (
    <>
      <PageHead eyebrow="Teacher · real-world learning" title="Missions & Skill Passport" lede="Each week, one village skill becomes a hands-on team mission. A skill enters a child’s passport only when both the teacher and the village mentor have checked it." />
      <div className="grid g3">
        {s.missions.map((x) => {
          const r = s.records.find((y) => y.id === x.from)
          return (
            <button key={x.id} type="button" onClick={() => setSel(x.id)} className="glass" aria-pressed={sel === x.id}
              style={{ textAlign: 'left', padding: 0, overflow: 'hidden', cursor: 'pointer', outline: sel === x.id ? '2px solid var(--accent)' : 'none' }}>
              <div style={{ height: 96 }}><Art kind={r.art} /></div>
              <div style={{ padding: 16, display: 'grid', gap: 6 }}>
                <div className="between"><b style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{x.title}</b><span className={`pill ${x.status === 'active' ? 'accent' : ''}`}>{x.week}</span></div>
                <span className="small faint">From {r.who}’s “{r.title}”</span>
                <div className="row" style={{ gap: 6 }}>{x.tags.map((t) => <span key={t} className="pill gold">{t}</span>)}</div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid split-wide">
        <Glass strong className="pad-lg">
          <CardHead title={m.title} sub={`${doneN} of ${m.steps.length} steps done`}><Flag size={20} color="var(--gold)" /></CardHead>
          <div className="stack-sm">
            {m.steps.map((st, i) => (
              <motion.button key={st} type="button" whileTap={{ scale: .98 }} onClick={() => tick(i)} className={steps[sel][i] ? 'neu-in' : 'neu'}
                style={{ border: 0, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', cursor: 'pointer', color: 'inherit' }} aria-pressed={steps[sel][i]}>
                <span style={{ width: 26, height: 26, borderRadius: 9, display: 'grid', placeItems: 'center', flex: 'none', background: steps[sel][i] ? 'var(--leaf)' : 'var(--well)', color: '#fff' }}>{steps[sel][i] ? <Check size={15} /> : <span className="tiny faint">{i + 1}</span>}</span>
                <span style={{ textDecoration: steps[sel][i] ? 'line-through' : 'none', opacity: steps[sel][i] ? .65 : 1 }}>{st}</span>
              </motion.button>
            ))}
          </div>
          <div className="divider" style={{ margin: '16px 0' }} />
          <div className="stack-sm">
            <span className="small row" style={{ gap: 6 }}><Package size={15} /><b>Materials:</b> {m.materials}</span>
            <span className="small"><b>Mentor:</b> {rec.who} ({rec.role.toLowerCase()})</span>
            <span className="label" style={{ marginTop: 6 }}>Teams on this mission</span>
            <div className="row">{s.groups.map((g) => <button key={g.id} type="button" className="btn sm" aria-pressed={m.assigned.includes(g.id)} onClick={() => s.assignMission(m.id, g.id)}>{m.assigned.includes(g.id) && <Check size={13} />}{g.name}</button>)}</div>
          </div>
        </Glass>
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="Roots Day planner" sub="Friday 28 November · 11 am"><CalendarDays size={18} color="var(--river)" /></CardHead>
            <p className="small muted">Children interview a knowledge holder and record them. They become the village’s archivists.</p>
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn sm" onClick={() => setIq('r1')}><Sparkles size={14} />Interview questions for Bah Kynsai</button>
              <button className="btn sm" onClick={() => setIq('r2')}><Sparkles size={14} />…for Kong Iba</button>
            </div>
            {iq && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="well" style={{ padding: 12, marginTop: 12 }}>
              <span className="pill violet" style={{ marginBottom: 8 }}><Sparkles size={11} />AI draft · edit before printing</span>
              <ol style={{ margin: '6px 0 0', paddingLeft: 20, display: 'grid', gap: 4 }} className="small">{QUESTIONS[iq].map((q) => <li key={q}>{q}</li>)}</ol>
            </motion.div>}
          </Glass>
          <Glass>
            <CardHead title="Knowledge Dividends" sub="What each contributor gets back"><Gift size={18} color="var(--accent)" /></CardHead>
            <div className="stack-sm">
              {dividends.map((r) => (
                <div key={r.id} className="between" style={{ padding: '6px 0', borderTop: '1px solid var(--glass-line)' }}>
                  <span className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={r.who} /><span className="small"><b>{r.who}</b><br /><span className="faint">{r.dividend.item}</span></span></span>
                  {r.dividend.status === 'delivered' ? <span className="pill leaf">Given {r.dividend.on}</span> : <button className="btn sm" onClick={() => { s.deliverDividend(r.id); s.toast(`Dividend given to ${r.who}.`) }}>Mark given</button>}
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </div>

      <Glass>
        <CardHead title="Skill Passport entries" sub="Evidence is a photo plus a checklist. Tap a tick to verify." />
        <div className="scroll-x">
          <table className="table">
            <thead><tr><th>Evidence</th><th>Child</th><th>Skill shown</th><th>Mission</th><th>Teacher</th><th>Mentor</th><th>Status</th></tr></thead>
            <tbody>{s.passport.map((p) => {
              const mm = s.missions.find((x) => x.id === p.mission); const rr = s.records.find((y) => y.id === mm.from)
              return (
                <tr key={p.id}>
                  <td><div style={{ width: 54, height: 38, borderRadius: 8, overflow: 'hidden' }}><Art kind={rr.art} /></div></td>
                  <td><span className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={p.who} /><span><b>{p.who}</b><br /><span className="tiny faint">{p.team}</span></span></span></td>
                  <td>{p.skill}</td><td className="small">{mm.title}</td>
                  {['t', 'm'].map((k) => <td key={k}><button type="button" className={p[k] ? 'btn sm icon primary' : 'btn sm icon'} aria-pressed={p[k]} aria-label={`${k === 't' ? 'Teacher' : 'Mentor'} verified`} onClick={() => s.togglePassport(p.id, k)}>{p[k] ? <Check size={15} /> : null}</button></td>)}
                  <td>{p.t && p.m ? <span className="pill leaf">Verified</span> : p.t ? <span className="pill gold">Needs mentor</span> : p.m ? <span className="pill gold">Needs teacher</span> : <span className="pill">Not checked</span>}</td>
                </tr>
              )
            })}</tbody>
          </table>
        </div>
      </Glass>
    </>
  )
}
