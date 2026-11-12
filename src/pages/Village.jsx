import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, Square, Camera, Globe2, School, Lock, Send, Headphones, BookOpen, Gift, Trash2, ShieldCheck, Mic2 } from 'lucide-react'
import { useStore } from '../store'
import { Glass, CardHead, PageHead, Art, consentPill, Modal, Notice, Avatar } from '../components/ui'
import { artFor, draftCard } from '../buddy'

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const CONSENT = [
  ['public', 'Public', Globe2, 'Children, families and visitors can see it'],
  ['school', 'School only', School, 'Only children and teachers in this school'],
  ['restricted', 'Restricted', Lock, 'Kept in the archive. Never shown to children'],
]

export default function Village() {
  const s = useStore()
  const people = [...new Set(s.records.map((r) => r.who))]
  const [who, setWho] = useState('Bah Kynsai')
  const me = s.records.find((r) => r.who === who)
  const mine = s.records.filter((r) => r.who === who)
  const [rec, setRec] = useState(false); const [secs, setSecs] = useState(0); const [got, setGot] = useState(0)
  const [photo, setPhoto] = useState(null); const [title, setTitle] = useState(''); const [summary, setSummary] = useState(''); const [consent, setConsent] = useState('school')
  const [withdraw, setWithdraw] = useState(null)
  const t = useRef()
  useEffect(() => () => clearInterval(t.current), [])
  const toggleRec = () => {
    if (rec) { clearInterval(t.current); setRec(false); setGot(Math.max(1, secs)); return }
    setRec(true); setSecs(0); t.current = setInterval(() => setSecs((x) => x + 1), 1000)
  }
  const onPhoto = (e) => { const f = e.target.files?.[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => setPhoto(fr.result); fr.readAsDataURL(f) }
  const send = () => {
    if (!title.trim() || summary.trim().length < 20) { s.toast('Add a title and a short summary (one full sentence).', 'warn'); return }
    if (rec) toggleRec()
    const r = { id: 'r' + Date.now(), who, role: me?.role || 'Elder', lang: me?.lang || 'Khasi', title: title.trim(), summary: summary.trim(), consent, secs: got || 60, status: 'pending', date: '12 Nov', listens: 0, photo,
      dividend: { item: (me?.role || 'Elder') === 'Farmer' ? 'Crop calendar card' : (me?.role || '') === 'Artisan' ? 'Printed record of the craft' : 'Recording saved for the family', status: 'planned' } }
    r.art = artFor(draftCard(r).subject)
    s.addRecord(r); s.toast('Sent to the teacher. It will appear in the library after approval.')
    setTitle(''); setSummary(''); setPhoto(null); setGot(0); setSecs(0); setConsent('school')
  }
  const listens = mine.reduce((a, r) => a + (r.listens || 0), 0)
  const cards = mine.filter((r) => r.status === 'approved').length
  const divs = mine.filter((r) => r.dividend?.status === 'delivered').length
  return (
    <>
      <PageHead eyebrow="Village Voice · for farmers, artisans and elders" title={`Khublei, ${who}`} lede="Share what you know in your own voice and your own language. You decide who may hear it, and you can change your mind at any time.">
        <label className="sr-only" htmlFor="who">Who is using this phone?</label>
        <select id="who" className="select" style={{ width: 'auto' }} value={who} onChange={(e) => setWho(e.target.value)}>{people.map((p) => <option key={p}>{p}</option>)}</select>
      </PageHead>

      <div className="grid g4">
        {[[Mic2, 'accent', 'Recordings shared', mine.length], [Headphones, 'river', 'Times children listened', listens], [BookOpen, 'leaf', 'Lesson cards made', cards], [Gift, 'gold', 'Dividends received', divs]].map(([I, tone, k, v]) => (
          <Glass key={k} className="stat"><span className="k"><span className="ic" style={{ background: `var(--${tone}-soft)`, color: `var(--${tone})` }}><I size={17} /></span>{k}</span><span className="v num">{v}</span></Glass>
        ))}
      </div>

      <div className="grid split-wide">
        <Glass strong className="pad-lg stack" style={{ gap: 20 }}>
          <CardHead title="Record something new" sub="Big buttons, few words. A teacher or older student can help type." />
          <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
            <motion.button type="button" className={`rec ${rec ? 'on' : ''}`} onClick={toggleRec} whileTap={{ scale: .96 }} aria-label={rec ? 'Stop recording' : 'Start recording'}>
              <span className="core">{rec ? <Square size={30} fill="currentColor" /> : <Mic />}</span>
            </motion.button>
            <div className={`wave ${rec ? 'on' : ''}`} aria-hidden="true">{[...Array(26)].map((_, i) => <i key={i} />)}</div>
            <span className="num" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>{mmss(rec ? secs : got)}</span>
            <span className="small faint">{rec ? 'Recording… tap the square to stop' : got ? 'Recorded. Tap to record again.' : 'Tap the big button and speak'}</span>
            <span className="tiny faint">In the real hub this uses the phone’s microphone and saves to the school laptop. Here it is simulated.</span>
          </div>
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <div className="neu-in" style={{ width: 86, height: 86, borderRadius: 18, overflow: 'hidden', display: 'grid', placeItems: 'center', flex: 'none' }}>{photo ? <img src={photo} alt="Chosen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera className="faint" />}</div>
            <label className="btn" style={{ position: 'relative', overflow: 'hidden' }}><Camera size={17} />Add a photo<input type="file" accept="image/*" onChange={onPhoto} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} /></label>
            <span className="tiny faint">Photos of things, not of children.</span>
          </div>
          <div className="field"><label htmlFor="vt">What is it about?</label><input id="vt" className="input" placeholder="e.g. How I choose bamboo for baskets" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="field"><label htmlFor="vs">Short summary in English (2–3 lines)</label><textarea id="vs" className="textarea" placeholder="A teacher or older student can type this. The AI uses only these words to draft a lesson card." value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
          <div className="field">
            <span className="label">Who may hear this?</span>
            <div className="grid g3" style={{ gap: 10 }}>
              {CONSENT.map(([k, l, I, d]) => (
                <button key={k} type="button" className={consent === k ? 'neu-in' : 'neu'} aria-pressed={consent === k} onClick={() => setConsent(k)}
                  style={{ border: consent === k ? '2px solid var(--accent)' : '2px solid transparent', padding: 14, display: 'grid', gap: 6, justifyItems: 'center', textAlign: 'center', cursor: 'pointer', color: consent === k ? 'var(--accent)' : 'var(--ink)' }}>
                  <I size={26} /><b>{l}</b><span className="tiny faint">{d}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="btn primary" style={{ minHeight: 54, fontSize: '1rem' }} onClick={send}><Send size={18} />Send to the teacher</button>
        </Glass>

        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="My recordings" sub="Change who can hear each one, or take it back" />
            <div className="stack">
              {mine.map((r) => (
                <div key={r.id} className="well" style={{ padding: 12, display: 'grid', gap: 10 }}>
                  <div className="row" style={{ flexWrap: 'nowrap' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', flex: 'none' }}>{r.photo ? <img src={r.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Art kind={r.art} />}</div>
                    <div style={{ flex: 1, minWidth: 0 }}><b className="small">{r.title}</b><div className="tiny faint">{r.date} · {mmss(r.secs)} · {r.listens || 0} listens</div></div>
                    {r.status === 'withdrawn' ? <span className="pill danger">Withdrawn</span> : r.status === 'pending' ? <span className="pill gold">With teacher</span> : r.status === 'approved' ? <span className="pill leaf">In library</span> : r.status === 'archived' ? <span className="pill">Archive</span> : <span className="pill">Sent back</span>}
                  </div>
                  {r.status !== 'withdrawn' && <div className="between">
                    <div className="seg" role="group" aria-label={`Who may hear ${r.title}`}>{CONSENT.map(([k, l]) => <button key={k} type="button" aria-pressed={r.consent === k} onClick={() => { s.setConsent(r.id, k); s.toast(`Updated: “${r.title}” is now ${l}.`, 'privacy') }}>{l}</button>)}</div>
                    <button className="btn sm ghost" onClick={() => setWithdraw(r)}><Trash2 size={14} />Take back</button>
                  </div>}
                </div>
              ))}
            </div>
          </Glass>
          <Glass>
            <CardHead title="What you get back" sub="The Knowledge Dividend"><Gift size={18} color="var(--gold)" /></CardHead>
            {mine.filter((r) => r.dividend).map((r) => <div key={r.id} className="between" style={{ padding: '6px 0' }}><span className="small">{r.dividend.item}</span>{r.dividend.status === 'delivered' ? <span className="pill leaf">Received {r.dividend.on}</span> : <span className="pill">{r.dividend.status === 'ready' ? 'Ready' : 'Coming'}</span>}</div>)}
            {!mine.some((r) => r.dividend) && <p className="small faint">Share a recording to receive something useful back.</p>}
          </Glass>
          <Notice icon={ShieldCheck}>Your knowledge stays yours. The school only uses it in the way you choose. <Link to="/privacy/knowledge">Read your rights</Link>.</Notice>
        </div>
      </div>

      <Modal open={!!withdraw} onClose={() => setWithdraw(null)} title="Take this recording back?">
        {withdraw && <div className="stack">
          <div className="row"><Avatar name={withdraw.who} /><b>{withdraw.title}</b></div>
          <p className="small muted">It will be removed from the library and from every tablet at the next sync. Lesson cards made from it will be hidden. You can share it again later.</p>
          <div className="row"><button className="btn primary" onClick={() => { s.withdrawRecord(withdraw.id); s.toast('Taken back. It is no longer shown anywhere.', 'privacy'); setWithdraw(null) }}>Yes, take it back</button><button className="btn ghost" onClick={() => setWithdraw(null)}>Keep sharing</button></div>
        </div>}
      </Modal>
    </>
  )
}
