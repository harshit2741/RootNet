import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, Undo2, ShieldCheck, Quote, Headphones, Archive, CheckCircle2, Mic } from 'lucide-react'
import { useStore } from '../store'
import { Glass, CardHead, PageHead, consentPill, Art, Notice } from '../components/ui'

const SUBJECTS = ['Maths', 'English', 'Science', 'Social Studies']

function DraftCard({ r }) {
  const s = useStore()
  const [c, setC] = useState({ ...r.card, q1: r.card.qs[0], q2: r.card.qs[1] })
  const set = (k) => (e) => setC({ ...c, [k]: e.target.value })
  const approve = () => { s.approveRecord(r.id, { subject: c.subject, concept: c.concept, summary: c.summary, activity: c.activity, qs: [c.q1, c.q2] }); s.toast(r.consent === 'restricted' ? 'Saved to the archive only. Children will not see it.' : `Published. “${r.title}” is now in the village library.`) }
  const checks = [
    ['Uses only the contributor’s own words', true],
    ['Adds no cultural facts of its own', true],
    [`Consent is “${r.consent === 'public' ? 'Public' : r.consent === 'school' ? 'School only' : 'Restricted'}”`, true],
    ['Questions don’t contain their answers', true],
  ]
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}>
      <Glass strong className="pad-lg">
        <div className="grid split-card">
          <div className="stack">
            <div style={{ aspectRatio: '3/2', borderRadius: 18, overflow: 'hidden' }}><Art kind={r.art} /></div>
            <div><b style={{ fontSize: '1.05rem' }}>{r.title}</b><p className="small faint">{r.who} · {r.role} · speaks {r.lang} · {r.date}</p></div>
            <div className="row">{consentPill(r.consent)}<span className="pill"><Headphones size={11} />{Math.floor(r.secs / 60)}:{String(r.secs % 60).padStart(2, '0')}</span></div>
            <div className="well small" style={{ padding: 12, fontStyle: 'italic' }}><Quote size={14} className="faint" /> {r.summary}</div>
            <div className="stack-sm">{checks.map(([t]) => <span key={t} className="tiny row" style={{ gap: 6, flexWrap: 'nowrap' }}><CheckCircle2 size={13} color="var(--leaf)" />{t}</span>)}</div>
          </div>
          <div className="stack">
            <div className="between"><span className="pill violet"><Sparkles size={12} />AI draft · please check</span><span className="tiny faint">Drafted overnight on the hub by the small model</span></div>
            <div className="grid g2">
              <div className="field"><label htmlFor={`${r.id}-s`}>Subject</label><select id={`${r.id}-s`} className="select" value={c.subject} onChange={set('subject')}>{SUBJECTS.map((x) => <option key={x}>{x}</option>)}</select></div>
              <div className="field"><label htmlFor={`${r.id}-c`}>Concept in the syllabus</label><input id={`${r.id}-c`} className="input" value={c.concept} onChange={set('concept')} /></div>
            </div>
            <div className="field"><label htmlFor={`${r.id}-sum`}>What {r.who} knows (children see this)</label><textarea id={`${r.id}-sum`} className="textarea" value={c.summary} onChange={set('summary')} /></div>
            <div className="field"><label htmlFor={`${r.id}-a`}>Activity</label><textarea id={`${r.id}-a`} className="textarea" style={{ minHeight: 64 }} value={c.activity} onChange={set('activity')} /></div>
            <div className="grid g2">
              <div className="field"><label htmlFor={`${r.id}-q1`}>Question 1</label><textarea id={`${r.id}-q1`} className="textarea" style={{ minHeight: 64 }} value={c.q1} onChange={set('q1')} /></div>
              <div className="field"><label htmlFor={`${r.id}-q2`}>Question 2</label><textarea id={`${r.id}-q2`} className="textarea" style={{ minHeight: 64 }} value={c.q2} onChange={set('q2')} /></div>
            </div>
            <div className="row">
              <button className="btn primary" onClick={approve}><Check size={17} />{r.consent === 'restricted' ? 'Approve for archive only' : 'Approve and publish'}</button>
              <button className="btn" onClick={() => { s.rejectRecord(r.id); s.toast('Sent back. The contributor will be asked about it on the next visit.', 'river') }}><Undo2 size={16} />Send back</button>
              {r.consent === 'school' && <span className="small faint">Only children in this school will see it.</span>}
            </div>
          </div>
        </div>
      </Glass>
    </motion.div>
  )
}

export default function Approvals() {
  const s = useStore()
  const pend = s.records.filter((r) => r.status === 'pending')
  const done = s.records.filter((r) => ['approved', 'archived', 'returned', 'withdrawn'].includes(r.status))
  return (
    <>
      <PageHead eyebrow="Teacher" title="Lesson cards to approve" lede="The hub’s AI turns each Village Voice into a draft lesson card overnight, so you only need to check it. Nothing reaches children until you approve it.">
        <span className="pill violet num">{pend.length} waiting</span>
      </PageHead>
      <Notice icon={ShieldCheck}>The AI suggests the subject, concept and questions from the contributor’s summary. It never adds facts about culture or tradition, and it never sees records marked Restricted.</Notice>
      <AnimatePresence mode="popLayout">
        {pend.length ? pend.map((r) => <DraftCard key={r.id} r={r} />) : (
          <Glass key="empty" className="pad-lg" style={{ textAlign: 'center' }}>
            <CheckCircle2 size={34} color="var(--leaf)" />
            <h2 style={{ marginTop: 8 }}>All caught up</h2>
            <p className="muted small">New Village Voices will appear here with an AI-drafted card.</p>
            <Link to="/village" className="btn" style={{ marginTop: 12 }}><Mic size={16} />Record a Village Voice</Link>
          </Glass>
        )}
      </AnimatePresence>
      <Glass>
        <CardHead title="History" sub="Approved, archived and returned records" />
        <div className="scroll-x">
          <table className="table">
            <thead><tr><th>Record</th><th>Contributor</th><th>Linked to</th><th>Consent</th><th>Status</th></tr></thead>
            <tbody>{done.map((r) => (
              <tr key={r.id}><td><b>{r.title}</b></td><td>{r.who}</td><td className="small">{r.card ? `${r.card.subject} · ${r.card.concept}` : '—'}</td><td>{consentPill(r.consent)}</td>
                <td>{r.status === 'approved' ? <span className="pill leaf">In library</span> : r.status === 'archived' ? <span className="pill"><Archive size={11} />Archive only</span> : r.status === 'withdrawn' ? <span className="pill danger">Withdrawn</span> : <span className="pill gold">Sent back</span>}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Glass>
    </>
  )
}
