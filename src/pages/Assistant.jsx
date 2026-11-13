import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot, Cpu, ShieldCheck, Moon, ArrowRight, Copy } from 'lucide-react'
import { useStore } from '../store'
import { teacherAssist } from '../buddy'
import { Card, CardH, Hero } from '../components/ui'
import Chat from '../components/Chat'

let mid = 5000
const CHIPS = ['Which groups are stuck?', 'Who is ready to move up?', 'What are the weakest skills?', 'Summarise this week', 'Draft a mission from Kong Iba’s recording', 'Make tomorrow’s print pack', 'Write a note for parents about Roots Day']

export default function Assistant() {
  const s = useStore(); const loc = useLocation()
  const [msgs, setMsgs] = useState([{ id: ++mid, from: 'buddy', text: 'Good morning. I can read today’s practice, suggest groups and draft things for you to check. What do you need?' }])
  const [typing, setTyping] = useState(false); const asked = useRef(false)
  const send = (text) => {
    setMsgs((m) => [...m, { id: ++mid, from: 'me', text }]); setTyping(true)
    setTimeout(() => {
      const r = teacherAssist(text, useStore.getState())
      const node = <>
        {r.table && <div className="inset scroll-x"><table className="table" style={{ fontSize: '.8rem' }}><thead><tr>{r.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{r.table.rows.map((row, i) => <tr key={i}>{row.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody></table></div>}
        {r.card && <div className="inset"><b>{r.card.title}</b>{r.card.lines.map((l) => <span key={l} className="sm">{l}</span>)}<button type="button" className="btn small" style={{ justifySelf: 'start', marginTop: 6 }} onClick={() => { navigator.clipboard?.writeText([r.card.title, ...r.card.lines].join('\n')).catch(() => {}); s.toast('Copied. Edit it before you use it.', 'river') }}><Copy size={13} />Copy draft</button></div>}
        {r.actions && <div className="row" style={{ marginTop: 10 }}>{r.actions.map((a) => <Link key={a.to} to={a.to} className="btn small">{a.label}<ArrowRight size={13} /></Link>)}</div>}
      </>
      setTyping(false); setMsgs((m) => [...m, { id: ++mid, from: 'buddy', text: r.text, node }])
    }, 750)
  }
  useEffect(() => { if (loc.state?.ask && !asked.current) { asked.current = true; send(loc.state.ask) } }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Hero eyebrow="Programme · Teaching assistant" title="Ask about your class" emph="in plain words." chips={<span className="t2">Reads only this class’s data on the hub. Drafts for you to check. Never decides about a child.</span>} />
      <div className="grid split">
        <Chat title="Teaching assistant" subtitle="Small open model on the school laptop · no internet" icon={Bot} badge={<span className="tag acc">Drafts for you to check</span>}
          messages={msgs} typing={typing} onSend={send} quick={CHIPS} placeholder="Ask about your class…" inputLabel="Your question" note="AI drafts can be wrong. Check every draft before you use it." />
        <div className="stack">
          <Card>
            <CardH title="Model on this hub"><Cpu size={18} color="var(--accent)" /></CardH>
            <div className="stack-s sm">{[['Model', 'Gemma 3 1B class, quantised'], ['Runs on', 'Laptop CPU, no GPU'], ['Speed', '≈18 tokens/sec'], ['Internet', 'None needed'], ['Last overnight run', 'Today 02:10']].map(([a, b]) => <div key={a} className="between" style={{ padding: '6px 0', borderTop: '1px solid var(--line)' }}><span className="t3">{a}</span><b className="mono xs">{b}</b></div>)}</div>
          </Card>
          <Card>
            <CardH title="Why one laptop is enough"><Moon size={18} color="var(--accent)" /></CardH>
            <p className="sm t2">Hints and lesson-card drafts are written overnight and stored. In class the hub mostly looks them up, so six groups can practise at once. The live model only answers short questions like these.</p>
          </Card>
          <Card>
            <CardH title="Guardrails"><ShieldCheck size={18} color="var(--accent)" /></CardH>
            <ul className="sm t2 stack-s" style={{ margin: 0, paddingLeft: 18 }}><li>Reads only class data on this hub</li><li>Never sees Restricted village records</li><li>Suggests; the teacher decides</li><li>No ranking or labelling of children</li></ul>
          </Card>
        </div>
      </div>
    </>
  )
}
