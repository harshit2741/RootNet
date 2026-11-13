import { useState } from 'react'
import { Languages, CheckCircle2, Mic, PenLine, CircleDashed, Volume2, Send } from 'lucide-react'
import { useStore } from '../store'
import { DESK, KHASI, COUNTING } from '../i18n'
import { Card, CardH, Hero, Kpi, Tabs, Note, Seg } from '../components/ui'
import { speak } from '../speak'

const ST = { approved: <span className="tag ok"><CheckCircle2 size={11} />Approved</span>, recording: <span className="tag info"><Mic size={11} />Elder recording</span>, draft: <span className="tag warn"><PenLine size={11} />Draft · needs review</span>, open: <span className="tag"><CircleDashed size={11} />Not started</span> }

export default function LanguageDesk() {
  const s = useStore()
  const [rows, setRows] = useState(DESK); const [tab, setTab] = useState('queue'); const [txt, setTxt] = useState({})
  const n = (k) => rows.filter((r) => r.status === k).length
  return (
    <>
      <Hero eyebrow="Programme · Language Desk" title="Ka Ktien Khasi:" emph="the village translates, the AI doesn’t." mood="happy" say="The Language Desk. The village translates the app into Khasi. Elders record how each phrase should sound, and teachers approve it."
        chips={<><Seg value={s.lang} onChange={s.setLang} label="Language on screens" options={[['en', 'English'], ['kha', 'English + Khasi']]} /><span className="t2">Open AI translation is weak for Khasi, so people do it.</span></>} />
      <div className="kpis" data-tour="kpis">
        <Kpi label="Approved words" icon={CheckCircle2} k="var(--c1)" value={n('approved') + 10} meta="Includes numbers 1–10" track={{ value: n('approved') + 10, max: 40 }} />
        <Kpi label="Waiting for an elder’s recording" icon={Mic} k="var(--c2)" value={n('recording')} meta="Kong Bandarisha, Bah Lamare" />
        <Kpi label="Drafts to review" icon={PenLine} k="var(--c4)" value={n('draft')} meta="From teachers and Class 7" />
        <Kpi label="Screens with Khasi" icon={Languages} k="var(--c3)" value="38" unit="%" meta="Student screens first" track={{ value: 38, target: 60 }} />
      </div>
      <Card data-tour="desk">
        <Tabs value={tab} onChange={setTab} items={[['queue', 'Translation queue', rows.filter((r) => r.status !== 'approved').length], ['words', 'Approved words'], ['numbers', 'Numbers']]} />
        {tab === 'queue' && <div className="scroll-x"><table className="table">
          <thead><tr><th>English phrase</th><th>Khasi</th><th>Status</th><th>Who</th><th /></tr></thead>
          <tbody>{rows.filter((r) => r.status !== 'approved').map((r) => (
            <tr key={r.en}><td className="b">{r.en}</td>
              <td style={{ minWidth: 220 }}>{r.kh || (r.status === 'open' ? <input className="input" style={{ height: 38 }} placeholder="Type the Khasi phrase…" value={txt[r.en] || ''} onChange={(e) => setTxt({ ...txt, [r.en]: e.target.value })} aria-label={`Khasi for ${r.en}`} /> : <span className="t3 sm">Awaiting the elder</span>)}</td>
              <td>{ST[r.status]}</td><td className="xs t3">{r.by}</td>
              <td>{r.status === 'open' && <button className="btn small" disabled={!txt[r.en]} onClick={() => { setRows(rows.map((x) => (x.en === r.en ? { ...x, kh: txt[r.en], status: 'draft', by: 'Draft by you · needs elder review' } : x))); s.toast('Sent for elder review.') }}><Send size={13} />Submit</button>}
                {r.status === 'draft' && <button className="btn small" onClick={() => { setRows(rows.map((x) => (x.en === r.en ? { ...x, status: 'recording', by: 'Recording requested from Kong Bandarisha' } : x))); s.toast('Recording requested from Kong Bandarisha.', 'river') }}><Mic size={13} />Ask elder</button>}</td>
            </tr>))}</tbody>
        </table></div>}
        {tab === 'words' && <div className="grid g3">{Object.entries(KHASI).map(([en, kh]) => (
          <button key={en} type="button" className="well" onClick={() => speak(kh, null, 'calm')} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
            <Volume2 size={18} color="var(--p)" /><div><b className="mono" style={{ fontSize: '1.15rem' }}>{kh}</b><div className="xs t3">{en}</div></div>
          </button>))}</div>}
        {tab === 'numbers' && <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))' }}>{COUNTING.map((c) => <div key={c.n} className="well" style={{ padding: 14, textAlign: 'center' }}><b className="mono" style={{ fontSize: '1.8rem' }}>{c.n}</b><div className="mono" style={{ color: 'var(--p)' }}>{c.w}</div></div>)}</div>}
      </Card>
      <Note>Only words checked against published Khasi word lists appear on screens today. Every new phrase is drafted by a teacher or older student, voiced by an elder, and approved before children see it. Garo and Pnar can be added the same way.</Note>
    </>
  )
}
