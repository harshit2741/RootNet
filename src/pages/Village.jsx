import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, Square, Camera, Globe2, School, Lock, Send, Headphones, BookOpen, Gift, Trash2, ShieldCheck, Mic2 } from 'lucide-react'
import { useStore } from '../store'
import { Card, CardH, Hero, Kpi, Art, Modal, Note, Avatar, Seg } from '../components/ui'
import { artFor, draftCard } from '../buddy'

const mmss = (x) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`
const CONSENT = [['public', 'Public', Globe2, 'Children, families and visitors'], ['school', 'School only', School, 'Children and teachers here'], ['restricted', 'Restricted', Lock, 'Archive only, never shown']]
const STATUS = { withdrawn: <span className="tag crit">Withdrawn</span>, pending: <span className="tag warn">With teacher</span>, approved: <span className="tag ok">In library</span>, archived: <span className="tag">Archive</span>, returned: <span className="tag">Sent back</span> }

export default function Village() {
  const s = useStore()
  const people = [...new Set(s.records.map((r) => r.who))]
  const [who, setWho] = useState('Bah Kynsai')
  const me = s.records.find((r) => r.who === who); const mine = s.records.filter((r) => r.who === who)
  const [rec, setRec] = useState(false); const [secs, setSecs] = useState(0); const [got, setGot] = useState(0)
  const [photo, setPhoto] = useState(null); const [title, setTitle] = useState(''); const [summary, setSummary] = useState(''); const [consent, setConsent] = useState('school')
  const [withdraw, setWithdraw] = useState(null); const t = useRef()
  useEffect(() => () => clearInterval(t.current), [])
  const toggleRec = () => { if (rec) { clearInterval(t.current); setRec(false); setGot(Math.max(1, secs)); return } setRec(true); setSecs(0); t.current = setInterval(() => setSecs((x) => x + 1), 1000) }
  const onPhoto = (e) => { const f = e.target.files?.[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => setPhoto(fr.result); fr.readAsDataURL(f) }
  const send = () => {
    if (!title.trim() || summary.trim().length < 20) return s.toast('Add a title and a one-sentence summary.', 'warn')
    if (rec) toggleRec()
    const role = me?.role || 'Elder'
    const r = { id: 'r' + Date.now(), who, role, lang: me?.lang || 'Khasi', title: title.trim(), summary: summary.trim(), consent, secs: got || 60, status: 'pending', date: '12 Nov', listens: 0, photo, dividend: { item: role === 'Farmer' ? 'Crop calendar card' : role === 'Artisan' ? 'Printed record of the craft' : 'Recording saved for the family', status: 'planned' } }
    r.art = artFor(draftCard(r).subject); s.addRecord(r); s.toast('Sent to the teacher for approval.')
    setTitle(''); setSummary(''); setPhoto(null); setGot(0); setSecs(0); setConsent('school')
  }
  return (
    <>
      <Hero eyebrow="Village Voice · Knowledge holders" title={`Khublei, ${who}.`} emph="Your knowledge, your choice."
        chips={<><label className="chip" style={{ paddingRight: 4 }}><span className="t3">Using this phone</span><select value={who} onChange={(e) => setWho(e.target.value)} aria-label="Contributor" style={{ border: 0, background: 'transparent', fontWeight: 700, outline: 'none' }}>{people.map((p) => <option key={p}>{p}</option>)}</select></label><span className="t2">Share in your own voice and language. Change who can hear it at any time.</span></>} />
      <div className="kpis" data-tour="kpis">
        <Kpi label="Recordings shared" icon={Mic2} k="var(--c4)" value={mine.length} meta={<>{mine.filter((r) => r.status === 'pending').length} with the teacher</>} />
        <Kpi label="Times children listened" icon={Headphones} k="var(--c2)" value={mine.reduce((a, r) => a + (r.listens || 0), 0)} meta="Across all your cards" />
        <Kpi label="Lesson cards made" icon={BookOpen} k="var(--c1)" value={mine.filter((r) => r.status === 'approved').length} meta="Linked to the school syllabus" />
        <Kpi label="Dividends received" icon={Gift} k="var(--c3)" value={mine.filter((r) => r.dividend?.status === 'delivered').length} of={mine.filter((r) => r.dividend).length} meta="Something useful back" />
      </div>
      <div className="grid split-7-5">
        <Card data-tour="record">
          <CardH title="Record something new" sub="Big buttons, few words. A teacher or older student can help type." />
          <div style={{ display: 'grid', justifyItems: 'center', gap: 10, padding: '6px 0 18px' }}>
            <motion.button type="button" className={`rec ${rec ? 'on' : ''}`} onClick={toggleRec} whileTap={{ scale: .96 }} aria-label={rec ? 'Stop recording' : 'Start recording'}><span className="core">{rec ? <Square size={26} fill="currentColor" /> : <Mic size={30} />}</span></motion.button>
            <div className={`wave ${rec ? 'on' : ''}`} aria-hidden="true">{[...Array(30)].map((_, i) => <i key={i} />)}</div>
            <span className="mono" style={{ fontSize: '1.8rem' }}>{mmss(rec ? secs : got)}</span>
            <span className="sm t3">{rec ? 'Recording… select the square to stop' : got ? 'Recorded. Select to record again.' : 'Select the button and speak'}</span>
          </div>
          <div className="stack">
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <div className="well" style={{ width: 64, height: 64, overflow: 'hidden', display: 'grid', placeItems: 'center', flex: 'none' }}>{photo ? <img src={photo} alt="Chosen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={20} className="t3" />}</div>
              <label className="btn" style={{ position: 'relative', overflow: 'hidden' }}><Camera size={16} />Add a photo<input type="file" accept="image/*" onChange={onPhoto} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} /></label>
              <span className="xs t3">Photos of things, not children.</span>
            </div>
            <div className="field"><label htmlFor="vt">What is it about?</label><input id="vt" className="input" placeholder="e.g. How I choose bamboo for baskets" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="field"><label htmlFor="vs">Short summary in English (2–3 lines)</label><textarea id="vs" className="textarea" placeholder="The AI drafts a lesson card from these words only." value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
            <div className="field"><span className="flabel">Who may hear this?</span>
              <div className="grid g3" style={{ gap: 10 }}>{CONSENT.map(([k, l, I, d]) => <button key={k} type="button" aria-pressed={consent === k} onClick={() => setConsent(k)} className="well" style={{ padding: 14, display: 'grid', gap: 6, justifyItems: 'center', textAlign: 'center', cursor: 'pointer', color: consent === k ? 'var(--accent)' : 'var(--text)', borderColor: consent === k ? 'var(--accent)' : undefined, background: consent === k ? 'color-mix(in srgb,var(--accent) 8%,transparent)' : undefined }}><I size={22} /><b className="sm">{l}</b><span className="xs t3">{d}</span></button>)}</div>
            </div>
            <button className="btn primary" style={{ height: 50 }} onClick={send}><Send size={17} />Send to the teacher</button>
            <p className="xs t3">In the real hub this records with the phone and saves to the school laptop. Here it is simulated.</p>
          </div>
        </Card>
        <div className="stack">
          <Card data-tour="myrec">
            <CardH title="My recordings" sub="Change who can hear each one, or take it back" />
            <div className="stack-s">{mine.map((r, i) => (
              <div key={r.id} style={{ padding: '12px 0', borderTop: i ? '1px solid var(--line)' : 0, display: 'grid', gap: 10 }}>
                <div className="row" style={{ flexWrap: 'nowrap' }}><div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flex: 'none' }}>{r.photo ? <img src={r.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Art kind={r.art} />}</div><div style={{ flex: 1, minWidth: 0 }}><b className="sm">{r.title}</b><div className="mono xs t3">{r.date} · {mmss(r.secs)} · {r.listens || 0} LISTENS</div></div>{STATUS[r.status]}</div>
                {r.status !== 'withdrawn' && <div className="between"><Seg value={r.consent} onChange={(k) => { s.setConsent(r.id, k); s.toast(`“${r.title}” is now ${CONSENT.find((c) => c[0] === k)[1]}.`, 'privacy') }} label={`Who may hear ${r.title}`} options={CONSENT.map(([k, l]) => [k, l])} /><button className="btn small ghost" onClick={() => setWithdraw(r)}><Trash2 size={14} />Take back</button></div>}
              </div>))}</div>
          </Card>
          <Card>
            <CardH title="What you get back" sub="The Knowledge Dividend"><Gift size={18} color="var(--accent)" /></CardH>
            {mine.filter((r) => r.dividend).map((r) => <div key={r.id} className="between" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}><span className="sm">{r.dividend.item}</span>{r.dividend.status === 'delivered' ? <span className="tag ok">Received {r.dividend.on}</span> : <span className="tag">{r.dividend.status === 'ready' ? 'Ready' : 'Coming'}</span>}</div>)}
          </Card>
          <Note icon={ShieldCheck}>Your knowledge stays yours. The school uses it only the way you choose. <Link to="/privacy/knowledge">Read your rights</Link>.</Note>
        </div>
      </div>
      <Modal open={!!withdraw} onClose={() => setWithdraw(null)} title="Take this recording back?">
        {withdraw && <div className="stack"><div className="row"><Avatar name={withdraw.who} /><b>{withdraw.title}</b></div><p className="sm t2">It is removed from the library and from every tablet at the next sync. Lesson cards made from it are hidden. You can share it again later.</p><div className="row"><button className="btn primary" onClick={() => { s.withdrawRecord(withdraw.id); s.toast('Taken back. It is no longer shown anywhere.', 'privacy'); setWithdraw(null) }}>Yes, take it back</button><button className="btn ghost" onClick={() => setWithdraw(null)}>Keep sharing</button></div></div>}
      </Modal>
    </>
  )
}
