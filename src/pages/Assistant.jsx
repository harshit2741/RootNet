import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot, Cpu, ShieldCheck, Gauge, Moon, ArrowRight, Copy } from 'lucide-react'
import { useStore } from '../store'
import { teacherAssist } from '../buddy'
import { Glass, CardHead, PageHead } from '../components/ui'
import Chat from '../components/Chat'

let mid = 5000
const BotAv = () => <span className="av" style={{ background: 'var(--violet)', width: 34, height: 34 }}><Bot size={18} /></span>
const CHIPS = ['Which groups are stuck?', 'Who is ready to move up?', 'What are the weakest skills?', 'Summarise this week', 'Draft a mission from Kong Iba’s recording', 'Make tomorrow’s print pack', 'Write a note for parents about Roots Day']

export default function Assistant() {
  const s = useStore(); const loc = useLocation()
  const [msgs, setMsgs] = useState([{ id: ++mid, from: 'buddy', avatar: <BotAv />, text: 'Good morning, Ms. Lyngdoh. I can look at today’s practice, suggest groups and draft things for you to check. What do you need?' }])
  const [typing, setTyping] = useState(false)
  const asked = useRef(false)
  const send = (text) => {
    setMsgs((m) => [...m, { id: ++mid, from: 'me', text }])
    setTyping(true)
    setTimeout(() => {
      const r = teacherAssist(text, useStore.getState())
      const node = <>
        {r.table && <div className="card-in scroll-x"><table className="table" style={{ fontSize: '.8rem' }}><thead><tr>{r.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{r.table.rows.map((row, i) => <tr key={i}>{row.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody></table></div>}
        {r.card && <div className="card-in"><b>{r.card.title}</b>{r.card.lines.map((l) => <span key={l} className="small">{l}</span>)}<button type="button" className="btn sm ghost" style={{ justifySelf: 'start', marginTop: 6 }} onClick={() => { try { navigator.clipboard.writeText([r.card.title, ...r.card.lines].join('\n')).catch(() => {}) } catch { /* clipboard blocked */ } s.toast('Copied. Edit it before you use it.', 'river') }}><Copy size={13} />Copy draft</button></div>}
        {r.actions && <div className="row" style={{ marginTop: 10 }}>{r.actions.map((a) => <Link key={a.to} to={a.to} className="btn sm">{a.label}<ArrowRight size={13} /></Link>)}</div>}
      </>
      setTyping(false)
      setMsgs((m) => [...m, { id: ++mid, from: 'buddy', avatar: <BotAv />, text: r.text, node }])
    }, 800)
  }
  useEffect(() => { if (loc.state?.ask && !asked.current) { asked.current = true; send(loc.state.ask) } }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <PageHead eyebrow="Teacher" title="Teaching assistant" lede="Ask in plain words. The assistant reads only this class’s data on the hub, drafts things for you to check, and never makes decisions about a child." />
      <div className="grid split">
        <Chat title="Teaching assistant" subtitle="Small open model on the school laptop · no internet" avatar={<span className="av lg" style={{ background: 'var(--violet)' }}><Bot size={24} /></span>}
          badge={<span className="pill violet">Drafts for you to check</span>} messages={msgs} typing={typing} typingAvatar={<BotAv />} onSend={send} quick={CHIPS} placeholder="Ask about your class…" inputLabel="Your question"
          note="AI drafts can be wrong. Check every draft before you use it. Decisions about children stay with you." />
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="The model on this hub"><Cpu size={18} color="var(--violet)" /></CardHead>
            <div className="stack-sm small">
              <div className="between"><span className="faint">Model</span><b>Gemma 3 1B class, quantised</b></div>
              <div className="between"><span className="faint">Runs on</span><b>Laptop CPU, no GPU</b></div>
              <div className="between"><span className="faint">Speed</span><b className="num">≈18 tokens/sec</b></div>
              <div className="between"><span className="faint">Internet needed</span><b>None</b></div>
              <div className="between"><span className="faint">Last overnight run</span><b className="num">Today 02:10</b></div>
            </div>
          </Glass>
          <Glass>
            <CardHead title="Why one laptop is enough"><Gauge size={18} color="var(--leaf)" /></CardHead>
            <p className="small muted">Hints and lesson-card drafts are written <b>overnight</b> <Moon size={13} style={{ verticalAlign: -2 }} /> and stored. During class the hub mostly looks them up, so six groups can practise at once. The live model only answers short teacher questions like these.</p>
          </Glass>
          <Glass>
            <CardHead title="Guardrails"><ShieldCheck size={18} color="var(--river)" /></CardHead>
            <ul className="small stack-sm" style={{ margin: 0, paddingLeft: 18 }}>
              <li>Reads only class data on this hub</li><li>Never sees restricted village records</li><li>Suggests; the teacher decides</li><li>No ranking or labelling of children</li><li>Every draft is marked until a teacher approves it</li>
            </ul>
          </Glass>
        </div>
      </div>
    </>
  )
}
