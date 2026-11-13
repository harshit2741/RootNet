import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, BookOpen, Ban, EyeOff, HelpCircle, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { askBuddy } from '../buddy'
import { Card, CardH, Hero, consentTag, Art } from '../components/ui'
import Chat from '../components/Chat'

let mid = 1000
const STARTERS = ['What is a pattern?', 'Why use triangles in a bridge?', 'When is paddy planted?', 'What is 45 × 3?', 'Tell me a village story', 'What are the rules of the sacred grove?']

export default function AskBuddy() {
  const s = useStore()
  const [msgs, setMsgs] = useState([{ id: ++mid, from: 'buddy', text: <>Khublei! Ask me about anything our village and school library have taught us. I’ll always tell you <b>where</b> my answer comes from.</> }])
  const [typing, setTyping] = useState(false); const [chips, setChips] = useState(STARTERS.slice(0, 4))
  const visible = s.records.filter((r) => r.status === 'approved' && r.consent !== 'restricted')
  const send = (text) => {
    setMsgs((m) => [...m, { id: ++mid, from: 'me', text }]); setTyping(true)
    setTimeout(() => {
      const r = askBuddy(text, s.records)
      const node = <>
        {r.follow && <div className="inset"><span className="mono xs t3">YOUR TURN</span><span>{r.follow}</span></div>}
        {r.sources?.length > 0 && <div className="row" style={{ marginTop: 10, gap: 6 }}>{r.sources.map((x) => <span key={x.id} className="tag info"><BookOpen size={11} />{x.who} · {x.title}</span>)}</div>}
        {r.link && <div style={{ marginTop: 10 }}><Link to={r.link.to} className="btn small primary">{r.link.label}<ArrowRight size={13} /></Link></div>}
        {r.tone === 'privacy' && <div style={{ marginTop: 10 }}><span className="tag"><ShieldCheck size={11} />Privacy rule</span></div>}
      </>
      setTyping(false); setMsgs((m) => [...m, { id: ++mid, from: 'buddy', text: r.text, node }])
      setChips(r.chips || STARTERS.filter((x) => x !== text).slice(0, 4))
    }, 650)
  }
  return (
    <>
      <Hero eyebrow="Learn · Ask Buddy" title="Ask about our village." emph="Every answer shows its source." chips={<span className="t2">Answers only from lesson cards your teachers approved. Never solves your sums.</span>} />
      <div className="grid split">
        <Chat title="Ask Buddy" subtitle="Searches the hub’s library · offline" icon={BookOpen} badge={<span className="tag info">Shows its sources</span>}
          messages={msgs} typing={typing} onSend={send} quick={chips} placeholder="Ask a question…" inputLabel="Your question"
          voice={() => s.toast('Speaking uses the tablet microphone in the real hub. Please type here.', 'river')}
          note="Buddy is a small AI and can make mistakes. Don’t type phone numbers, addresses or passwords." />
        <div className="stack">
          <Card>
            <CardH title="Buddy’s promises" />
            <div className="stack-s">{[[Ban, 'Never gives final answers to practice questions'], [BookOpen, 'Answers only from approved content'], [EyeOff, 'Never shows Restricted knowledge'], [ShieldCheck, 'Doesn’t ask for personal details'], [HelpCircle, 'Says “I don’t know” instead of guessing']].map(([I, x]) => <div key={x} className="row sm t2" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}><I size={15} color="var(--accent)" style={{ flex: 'none', marginTop: 3 }} />{x}</div>)}</div>
          </Card>
          <Card>
            <CardH title="What Buddy can read" sub={`${visible.length} approved village lesson cards`} />
            <div className="stack-s">{visible.map((r) => <div key={r.id} className="row" style={{ flexWrap: 'nowrap' }}><div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flex: 'none' }}><Art kind={r.art} /></div><div style={{ flex: 1, minWidth: 0 }}><b className="sm">{r.title}</b><div className="xs t3">{r.who} · {r.card.subject}</div></div>{consentTag(r.consent)}</div>)}</div>
          </Card>
          <Card><CardH title="Try asking" /><div className="quick">{STARTERS.map((q) => <button key={q} type="button" onClick={() => send(q)}>{q}</button>)}</div></Card>
        </div>
      </div>
    </>
  )
}
