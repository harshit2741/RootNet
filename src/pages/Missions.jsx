import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flag, Check, Gift, CalendarDays, Sparkles, Package, Stamp, Target, Users } from 'lucide-react'
import { useStore } from '../store'
import { Card, CardH, Hero, Tabs, Art, Avatar, Kpi } from '../components/ui'

const IQ = {
  r1: ['Who taught you to weave, and how old were you?', 'How do you know when a strip is the right length?', 'Why does the pattern have to repeat exactly?', 'How many baskets can you make in a week?'],
  r2: ['How do you know the seedlings are ready to move?', 'What happens if the rain comes late?', 'How do you measure the space between plants?', 'Which months are the busiest on the terraces?'],
}

export default function Missions() {
  const s = useStore()
  const [tab, setTab] = useState('missions'); const [sel, setSel] = useState('pattern'); const [iq, setIq] = useState('r1')
  const [steps, setSteps] = useState({ pattern: [true, true, false, false, false], market: [false, false, false, false], bridge: [false, false, false, false] })
  const m = s.missions.find((x) => x.id === sel); const rec = s.records.find((r) => r.id === m.from)
  const doneN = steps[sel].filter(Boolean).length
  const verified = s.passport.filter((p) => p.t && p.m).length
  const divs = s.records.filter((r) => r.dividend)
  return (
    <>
      <Hero eyebrow="Programme · Missions & passport" title="Village skills become" emph="real-world learning." chips={<><span className="chip acc"><Flag size={14} />Pattern Detective · this week</span><span className="t2">A skill enters the passport only when the teacher and the village mentor both check it.</span></>} />
      <div className="kpis" data-tour="kpis">
        <Kpi label="Active mission steps" icon={Target} k="var(--c1)" value={doneN} of={m.steps.length} meta={<><b>{m.title}</b></>} track={{ value: doneN, max: m.steps.length }} />
        <Kpi label="Teams on missions" icon={Users} k="var(--c2)" value={new Set(s.missions.flatMap((x) => x.assigned)).size} of={s.groups.length} meta="Across 3 missions" track={{ value: new Set(s.missions.flatMap((x) => x.assigned)).size, max: s.groups.length }} />
        <Kpi label="Passport skills verified" icon={Stamp} k="var(--c3)" value={verified} of={s.passport.length} meta="Teacher + mentor" track={{ value: verified, max: s.passport.length }} />
        <Kpi label="Dividends given" icon={Gift} k="var(--c4)" value={divs.filter((r) => r.dividend.status === 'delivered').length} of={divs.length} meta="Something back for every contributor" track={{ value: divs.filter((r) => r.dividend.status === 'delivered').length, max: divs.length }} />
      </div>
      <div>
        <Tabs value={tab} onChange={setTab} items={[['missions', 'Missions'], ['passport', 'Skill Passport', s.passport.length], ['dividends', 'Knowledge Dividends'], ['roots', 'Roots Day']]} />
        {tab === 'missions' && (
          <div className="grid split-md">
            <div className="stack-s">
              {s.missions.map((x) => { const r = s.records.find((y) => y.id === x.from); return (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} className="card" aria-pressed={sel === x.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer', borderColor: sel === x.id ? 'var(--accent)' : undefined }}>
                  <div style={{ height: 56, borderRadius: 12, overflow: 'hidden' }}><Art kind={r.art} /></div>
                  <div><div className="between"><b>{x.title}</b><span className={`tag ${x.status === 'active' ? 'acc' : ''}`}>{x.week}</span></div><span className="xs t3">From {r.who} · {x.tags.join(', ')}</span></div>
                </button>) })}
            </div>
            <Card>
              <CardH title={m.title} sub={`${doneN} of ${m.steps.length} steps · mentor ${rec.who}`}><Flag size={18} color="var(--accent)" /></CardH>
              <div className="stack-s">
                {m.steps.map((st, i) => (
                  <motion.button key={st} type="button" whileTap={{ scale: .99 }} onClick={() => setSteps({ ...steps, [sel]: steps[sel].map((v, k) => (k === i ? !v : v)) })} aria-pressed={steps[sel][i]} className="well"
                    style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>
                    <span style={{ width: 24, height: 24, borderRadius: 7, display: 'grid', placeItems: 'center', flex: 'none', background: steps[sel][i] ? 'var(--accent)' : 'transparent', border: '1px solid var(--line-2)', color: 'var(--on-accent)' }}>{steps[sel][i] ? <Check size={14} /> : <span className="mono xs t3">{i + 1}</span>}</span>
                    <span style={{ textDecoration: steps[sel][i] ? 'line-through' : 'none', color: steps[sel][i] ? 'var(--text-3)' : 'var(--text)' }}>{st}</span>
                  </motion.button>
                ))}
              </div>
              <hr className="hr" style={{ margin: '18px 0' }} />
              <div className="stack-s">
                <span className="sm row" style={{ gap: 6 }}><Package size={15} className="t3" /><span className="t2">Materials:</span> {m.materials}</span>
                <span className="flabel" style={{ marginTop: 8 }}>Teams on this mission</span>
                <div className="row">{s.groups.map((g) => <button key={g.id} type="button" className="btn small" aria-pressed={m.assigned.includes(g.id)} onClick={() => s.assignMission(m.id, g.id)}>{m.assigned.includes(g.id) && <Check size={13} />}{g.name}</button>)}</div>
              </div>
            </Card>
          </div>
        )}
        {tab === 'passport' && (
          <Card>
            <CardH title="Skill Passport entries" sub="Evidence is a photo of the work plus a checklist. Select a tick to verify." />
            <div className="scroll-x"><table className="table">
              <thead><tr><th>Evidence</th><th>Child</th><th>Skill shown</th><th>Mission</th><th>Teacher</th><th>Mentor</th><th>Status</th></tr></thead>
              <tbody>{s.passport.map((p) => { const mm = s.missions.find((x) => x.id === p.mission); const rr = s.records.find((y) => y.id === mm.from); return (
                <tr key={p.id}><td><div style={{ width: 52, height: 36, borderRadius: 8, overflow: 'hidden' }}><Art kind={rr.art} /></div></td>
                  <td><span className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={p.who} /><span><b>{p.who}</b><br /><span className="xs t3">{p.team}</span></span></span></td>
                  <td>{p.skill}</td><td className="sm t2">{mm.title}</td>
                  {['t', 'm'].map((k) => <td key={k}><button type="button" className={p[k] ? 'btn small icon primary' : 'btn small icon'} aria-pressed={p[k]} aria-label={`${k === 't' ? 'Teacher' : 'Mentor'} verified`} onClick={() => s.togglePassport(p.id, k)}>{p[k] && <Check size={14} />}</button></td>)}
                  <td>{p.t && p.m ? <span className="tag ok">Verified</span> : p.t ? <span className="tag warn">Needs mentor</span> : p.m ? <span className="tag warn">Needs teacher</span> : <span className="tag">Not checked</span>}</td></tr>) })}</tbody>
            </table></div>
          </Card>
        )}
        {tab === 'dividends' && (
          <Card>
            <CardH title="Knowledge Dividends" sub="Every contribution returns something useful to the person who shared it" />
            <div className="scroll-x"><table className="table">
              <thead><tr><th>Contributor</th><th>Shared</th><th>What they get back</th><th>Status</th><th /></tr></thead>
              <tbody>{divs.map((r) => <tr key={r.id}><td><span className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={r.who} /><span><b>{r.who}</b><br /><span className="xs t3">{r.role}</span></span></span></td><td className="sm">{r.title}</td><td className="sm">{r.dividend.item}</td>
                <td>{r.dividend.status === 'delivered' ? <span className="tag ok">Given {r.dividend.on}</span> : <span className={`tag ${r.dividend.status === 'ready' ? 'acc' : ''}`}>{r.dividend.status === 'ready' ? 'Ready' : 'Planned'}</span>}</td>
                <td>{r.dividend.status !== 'delivered' && <button className="btn small" onClick={() => { s.deliverDividend(r.id); s.toast(`Dividend given to ${r.who}.`) }}>Mark given</button>}</td></tr>)}</tbody>
            </table></div>
          </Card>
        )}
        {tab === 'roots' && (
          <div className="grid split-7-5">
            <Card>
              <CardH title="Roots Day · Friday 28 November, 11 am" sub="Children interview knowledge holders and record them"><CalendarDays size={18} color="var(--accent)" /></CardH>
              <div className="row" style={{ marginBottom: 14 }}>{[['r1', 'Bah Kynsai'], ['r2', 'Kong Iba']].map(([k, n]) => <button key={k} className="btn small" aria-pressed={iq === k} onClick={() => setIq(k)}>{n}</button>)}</div>
              <span className="tag acc"><Sparkles size={11} />AI draft · edit before printing</span>
              <ol className="stack-s" style={{ margin: '12px 0 0', paddingLeft: 20 }}>{IQ[iq].map((q) => <li key={q}>{q}</li>)}</ol>
            </Card>
            <Card>
              <CardH title="Run of the day" />
              <div className="stack-s">{[['11:00', 'Welcome and recognition for knowledge holders'], ['11:15', 'Group interviews (Reader asks, Checker records)'], ['12:00', 'Hands-on demonstration'], ['12:30', 'Passport showcase for parents']].map(([t, x]) => <div key={t} className="row" style={{ flexWrap: 'nowrap', padding: '8px 0', borderTop: '1px solid var(--line)' }}><span className="mono sm" style={{ color: 'var(--accent)', width: 52 }}>{t}</span><span className="sm">{x}</span></div>)}</div>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}
