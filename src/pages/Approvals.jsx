import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Check, Undo2, ShieldCheck, Headphones, CheckCircle2, Mic, Quote } from 'lucide-react'
import { useStore } from '../store'
import { Card, CardH, Hero, Tabs, Art, consentTag, Note } from '../components/ui'

const SUBJECTS = ['Maths', 'English', 'Science', 'Social Studies']
const STATUS = { approved: <span className="tag ok">In library</span>, archived: <span className="tag">Archive only</span>, returned: <span className="tag warn">Sent back</span>, withdrawn: <span className="tag crit">Withdrawn</span>, pending: <span className="tag acc">To review</span> }

function Editor({ r }) {
  const s = useStore()
  const [c, setC] = useState(null)
  useEffect(() => { setC(r.card ? { ...r.card, q1: r.card.qs[0], q2: r.card.qs[1] } : null) }, [r.id]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!c) return null
  const ro = r.status !== 'pending'
  const set = (k) => (e) => setC({ ...c, [k]: e.target.value })
  return (
    <Card data-tour="editor">
      <div className="grid" style={{ gridTemplateColumns: '180px minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ aspectRatio: '1', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }}><Art kind={r.art} /></div>
        <div className="stack-s">
          <div className="row">{STATUS[r.status]}{consentTag(r.consent)}<span className="tag"><Headphones size={11} />{Math.floor(r.secs / 60)}:{String(r.secs % 60).padStart(2, '0')}</span></div>
          <h2 style={{ fontSize: '1.35rem', marginTop: 4 }}>{r.title}</h2>
          <span className="t2 sm">{r.who} · {r.role} · speaks {r.lang} · recorded {r.date}</span>
          <div className="well sm t2" style={{ padding: '10px 12px', marginTop: 8 }}><Quote size={13} className="t3" /> {r.summary}</div>
        </div>
      </div>
      <hr className="hr" style={{ margin: '20px 0' }} />
      <div className="between" style={{ marginBottom: 14 }}><span className="tag acc"><Sparkles size={12} />{ro ? 'Approved card' : 'AI draft · check before approving'}</span><span className="xs t3">Uses only the contributor’s own words</span></div>
      <fieldset disabled={ro} style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 14 }}>
        <div className="grid g2">
          <div className="field"><label htmlFor="ap-s">Subject</label><select id="ap-s" className="select" value={c.subject} onChange={set('subject')}>{SUBJECTS.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div className="field"><label htmlFor="ap-c">Concept in the syllabus</label><input id="ap-c" className="input" value={c.concept} onChange={set('concept')} /></div>
        </div>
        <div className="field"><label htmlFor="ap-sum">What {r.who} knows (children see this)</label><textarea id="ap-sum" className="textarea" value={c.summary} onChange={set('summary')} /></div>
        <div className="field"><label htmlFor="ap-a">Activity</label><input id="ap-a" className="input" value={c.activity} onChange={set('activity')} /></div>
        <div className="grid g2">
          <div className="field"><label htmlFor="ap-q1">Question 1</label><input id="ap-q1" className="input" value={c.q1} onChange={set('q1')} /></div>
          <div className="field"><label htmlFor="ap-q2">Question 2</label><input id="ap-q2" className="input" value={c.q2} onChange={set('q2')} /></div>
        </div>
      </fieldset>
      {!ro && <>
        <div className="row" style={{ gap: 16, margin: '16px 0 4px' }}>{['Contributor’s words only', 'No cultural facts added', 'Questions don’t reveal answers', 'Consent respected'].map((x) => <span key={x} className="xs t2 row" style={{ gap: 5 }}><CheckCircle2 size={13} color="var(--ok)" />{x}</span>)}</div>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary" onClick={() => { s.approveRecord(r.id, { subject: c.subject, concept: c.concept, summary: c.summary, activity: c.activity, qs: [c.q1, c.q2] }); s.toast(r.consent === 'restricted' ? 'Saved to the archive only.' : `Published “${r.title}” to the village library.`) }}><Check size={16} />{r.consent === 'restricted' ? 'Approve for archive only' : 'Approve and publish'}</button>
          <button className="btn" onClick={() => { s.rejectRecord(r.id); s.toast('Sent back to the contributor.', 'river') }}><Undo2 size={15} />Send back</button>
        </div>
      </>}
    </Card>
  )
}

export default function Approvals() {
  const s = useStore()
  const [tab, setTab] = useState('queue')
  const pend = s.records.filter((r) => r.status === 'pending')
  const hist = s.records.filter((r) => r.status !== 'pending' && r.card)
  const list = tab === 'queue' ? pend : hist
  const [sel, setSel] = useState(pend[0]?.id)
  const cur = list.find((r) => r.id === sel) || list[0]
  return (
    <>
      <Hero eyebrow="Classroom · Approvals" title="The AI drafts." emph="You decide what children see." chips={<><span className="chip acc"><Sparkles size={14} />{pend.length} drafts waiting</span><span className="t2">Drafted overnight on the hub from each contributor’s own summary.</span></>} />
      <Note icon={ShieldCheck}>The AI never adds facts about culture or tradition and never sees Restricted records. Nothing reaches children until a teacher approves it.</Note>
      <div className="grid split-md">
        <Card tight>
          <Tabs value={tab} onChange={(v) => { setTab(v); setSel(null) }} items={[['queue', 'To review', pend.length], ['hist', 'History', hist.length]]} />
          <div className="stack-s">
            {list.map((r) => (
              <button key={r.id} type="button" onClick={() => setSel(r.id)} className="well" aria-pressed={cur?.id === r.id}
                style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 12, padding: 10, textAlign: 'left', cursor: 'pointer', borderColor: cur?.id === r.id ? 'var(--accent)' : undefined, background: cur?.id === r.id ? 'color-mix(in srgb,var(--accent) 7%,transparent)' : undefined }}>
                <div style={{ height: 48, borderRadius: 10, overflow: 'hidden' }}><Art kind={r.art} /></div>
                <div style={{ minWidth: 0 }}><b className="sm" style={{ display: 'block' }}>{r.title}</b><span className="xs t3">{r.who} · {r.card?.subject}</span></div>
              </button>
            ))}
            {!list.length && <div style={{ padding: 20, textAlign: 'center' }}><CheckCircle2 size={26} color="var(--ok)" /><p className="b" style={{ marginTop: 8 }}>All caught up</p><Link to="/village" className="btn small" style={{ marginTop: 10 }}><Mic size={14} />Record a Village Voice</Link></div>}
          </div>
        </Card>
        {cur ? <Editor r={cur} /> : <Card><CardH title="Nothing selected" sub="Pick a record on the left." /></Card>}
      </div>
    </>
  )
}
