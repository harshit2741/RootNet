import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, BookOpen, Ban, EyeOff, HelpCircle, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { askBuddy } from '../buddy'
import { Glass, CardHead, PageHead, consentPill, Art } from '../components/ui'
import Chat from '../components/Chat'

let mid = 1000
const STARTERS = ['What is a pattern?', 'Why use triangles in a bridge?', 'When is paddy planted?', 'What is 45 × 3?', 'Tell me a village story', 'What are the rules of the sacred grove?']

export default function AskBuddy() {
  const s = useStore()
  const [msgs, setMsgs] = useState([{ id: ++mid, from: 'buddy', text: <>Khublei! I’m Buddy. Ask me about anything our village and school library have taught us. I’ll always tell you <b>where</b> my answer comes from.</> }])
  const [typing, setTyping] = useState(false)
  const [mood, setMood] = useState('happy')
  const [chips, setChips] = useState(STARTERS.slice(0, 4))
  const visible = s.records.filter((r) => r.status === 'approved' && r.consent !== 'restricted')

  const send = (text) => {
    setMsgs((m) => [...m, { id: ++mid, from: 'me', text }])
    setTyping(true); setMood('think')
    setTimeout(() => {
      const r = askBuddy(text, s.records)
      setTyping(false); setMood(r.tone === 'privacy' ? 'listen' : 'happy')
      const node = <>
        {r.follow && <div className="card-in"><span className="tiny faint">Your turn</span><span>{r.follow}</span></div>}
        {r.sources?.length > 0 && <div className="src">{r.sources.map((x) => <span key={x.id} className="pill river"><BookOpen size={11} />{x.who} · {x.title}</span>)}</div>}
        {r.link && <div style={{ marginTop: 10 }}><Link to={r.link.to} className="btn sm primary">{r.link.label}<ArrowRight size={14} /></Link></div>}
        {r.tone === 'privacy' && <div className="src"><span className="pill"><ShieldCheck size={11} />Privacy rule</span></div>}
      </>
      setMsgs((m) => [...m, { id: ++mid, from: 'buddy', text: r.text, node, mood: 'happy' }])
      setChips(r.chips || STARTERS.filter((x) => x !== text).sort(() => Math.random() - .5).slice(0, 4))
    }, 700)
  }

  return (
    <>
      <PageHead eyebrow="Ask Buddy" title="Ask about our village" lede="Buddy answers only from lesson cards your teachers approved and from the school library. It names its source every time, and it never solves your sums for you." />
      <div className="grid split">
        <Chat title="Ask Buddy" subtitle="Searches the hub’s library · offline" mood={mood} badge={<span className="pill river">Shows its sources</span>}
          messages={msgs} typing={typing} onSend={send} quick={chips} placeholder="Ask a question…" inputLabel="Your question"
          voice={() => s.toast('Speaking works on the tablet’s microphone in the real hub. Here, please type.', 'river')}
          note="Buddy is a small AI and can make mistakes. It only knows what the village has shared with the school. Don’t type phone numbers, addresses or passwords." />
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="Buddy’s promises" />
            <ul className="stack-sm" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[[Ban, 'Never gives final answers to practice questions'], [BookOpen, 'Answers only from approved village and library content'], [EyeOff, 'Never shows knowledge marked Restricted'], [ShieldCheck, 'Doesn’t ask for or keep personal details'], [HelpCircle, 'Says “I don’t know” instead of guessing']].map(([I, t]) => (
                <li key={t} className="row small" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}><I size={16} style={{ color: 'var(--leaf)', flex: 'none', marginTop: 2 }} />{t}</li>
              ))}
            </ul>
          </Glass>
          <Glass>
            <CardHead title="What Buddy can read" sub={`${visible.length} approved village lesson cards`} />
            <div className="stack-sm">
              {visible.map((r) => (
                <div key={r.id} className="row" style={{ flexWrap: 'nowrap' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flex: 'none' }}><Art kind={r.art} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}><b className="small">{r.title}</b><div className="tiny faint">{r.who} · {r.card.subject}</div></div>
                  {consentPill(r.consent)}
                </div>
              ))}
            </div>
          </Glass>
          <Glass>
            <CardHead title="Try asking" />
            <div className="quick">{STARTERS.map((q) => <button key={q} type="button" onClick={() => send(q)}>{q}</button>)}</div>
          </Glass>
        </div>
      </div>
    </>
  )
}
