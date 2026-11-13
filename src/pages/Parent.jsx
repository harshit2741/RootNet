import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MessageSquareQuote, ShieldCheck, Stamp, Check, BookOpenText, Calculator, CalendarCheck } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS } from '../data'
import { Card, CardH, Hero, Avatar, Modal, Note, Kpi } from '../components/ui'

const LADDERS = { Reading: ['Beginner', 'Letters', 'Words', 'Paragraph', 'Story'], Maths: ['Beginner', '1–9', '10–99', 'Subtraction', 'Division'] }
const KIDS = {
  'orchid-0': { Reading: [1, 2], Maths: [1, 2], days: [1, 1, 0, 1, 1], note: 'Riti counts confidently now. She is still learning to share things into equal groups. Try sharing 12 pebbles among 4 cups at home.' },
  'bamboo-0': { Reading: [2, 3], Maths: [2, 4], days: [1, 1, 1, 1, 1], note: 'Ibadahun found the repeating unit in Bah Kynsai’s weave and explained it to his group. Ask him to show you the pattern on a basket at home.' },
  'river-0': { Reading: [2, 3], Maths: [2, 2], days: [1, 0, 1, 1, 0], note: 'Badaphira now reads short paragraphs aloud. She likes the river story; ask her to retell it to you.' },
}

function Ladder({ label, steps, from, to }) {
  return (
    <div className="stack-s">
      <div className="between"><b>{label}</b><span className="tag ok">Up {to - from} step{to - from === 1 ? '' : 's'} since June</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length},1fr)`, gap: 6, alignItems: 'end' }}>
        {steps.map((st, i) => (
          <div key={st} style={{ display: 'grid', gap: 8, textAlign: 'center' }}>
            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * .06 }} style={{ originY: 1, height: 16 + i * 12, borderRadius: 8, background: i <= from ? 'color-mix(in srgb,var(--accent) 45%,transparent)' : i <= to ? 'var(--accent)' : 'var(--line)', outline: i === to ? '2px solid var(--accent)' : 'none', outlineOffset: 2 }} />
            <span className="xs" style={{ fontWeight: i === to ? 700 : 500, color: i === to ? 'var(--text)' : 'var(--text-3)' }}>{st}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Parent() {
  const s = useStore()
  const [kid, setKid] = useState('orchid-0'); const [opt, setOpt] = useState(false)
  const child = STUDENTS.find((k) => k.id === kid); const d = KIDS[kid]
  const g = s.groups.find((x) => x.members.includes(kid)); const stamps = s.passport.filter((p) => p.who === child.name)
  return (
    <>
      <Hero eyebrow="Family · For parents and guardians" title={`${child.name} is growing,`} emph="one step at a time."
        chips={<><label className="chip" style={{ paddingRight: 4 }}><span className="t3">Your child</span><select value={kid} onChange={(e) => setKid(e.target.value)} aria-label="Choose your child" style={{ border: 0, background: 'transparent', fontWeight: 700, outline: 'none' }}>{Object.keys(KIDS).map((k) => <option key={k} value={k}>{STUDENTS.find((x) => x.id === k).name}</option>)}</select></label><span className="t2">No marks or ranks. This page is also printed for families without a phone.</span></>} />
      <div className="kpis" data-tour="kpis">
        <Kpi label="Reading level" icon={BookOpenText} k="var(--c1)" value={LADDERS.Reading[d.Reading[1]]} meta={<>Started at <b>{LADDERS.Reading[d.Reading[0]]}</b></>} track={{ value: d.Reading[1] + 1, max: 5 }} />
        <Kpi label="Maths level" icon={Calculator} k="var(--c2)" value={LADDERS.Maths[d.Maths[1]]} meta={<>Started at <b>{LADDERS.Maths[d.Maths[0]]}</b></>} track={{ value: d.Maths[1] + 1, max: 5 }} />
        <Kpi label="Days at school this week" icon={CalendarCheck} k="var(--c3)" value={d.days.filter(Boolean).length} of={5} meta="Practised with their group" track={{ value: d.days.filter(Boolean).length, max: 5 }} />
        <Kpi label="Passport stamps" icon={Stamp} k="var(--c4)" value={stamps.filter((p) => p.t && p.m).length} of={Math.max(1, stamps.length)} meta="Checked by teacher and mentor" />
      </div>
      <div className="grid split-7-5">
        <Card data-tour="ladders">
          <div className="row" style={{ flexWrap: 'nowrap', marginBottom: 20 }}><Avatar name={child.name} lg /><div><h2 style={{ fontSize: '1.3rem' }}>{child.name}, age {child.age}</h2><p className="t2 sm">{g?.name} group · Level {g?.level} {g?.subject}</p></div></div>
          <div className="stack" style={{ gap: 26 }}>
            <Ladder label="Reading" steps={LADDERS.Reading} from={d.Reading[0]} to={d.Reading[1]} />
            <Ladder label="Maths" steps={LADDERS.Maths} from={d.Maths[0]} to={d.Maths[1]} />
            <div className="legend"><span><i style={{ background: 'color-mix(in srgb,var(--accent) 45%,transparent)' }} />Where they started (June)</span><span><i style={{ background: 'var(--accent)' }} />Steps climbed since</span></div>
          </div>
          <hr className="hr" style={{ margin: '22px 0' }} />
          <div className="stack-s"><span className="row" style={{ gap: 8 }}><MessageSquareQuote size={17} color="var(--accent)" /><b>A note from Ms. Lyngdoh</b></span><p className="t2">{d.note}</p></div>
        </Card>
        <div className="stack">
          <Card>
            <CardH title="This week" sub="Days practised at school" />
            <div className="row" style={{ gap: 10 }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => <div key={day} style={{ display: 'grid', justifyItems: 'center', gap: 6 }}><span className="well" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', color: d.days[i] ? 'var(--on-accent)' : 'var(--text-3)', background: d.days[i] ? 'var(--accent)' : undefined, borderColor: d.days[i] ? 'transparent' : undefined }}>{d.days[i] ? <Check size={18} /> : '–'}</span><span className="mono xs t3">{day.toUpperCase()}</span></div>)}</div>
          </Card>
          <Card>
            <CardH title="Come to Roots Day"><CalendarDays size={18} color="var(--accent)" /></CardH>
            <p className="sm t2"><b className="b">Friday 28 November, 11 am</b> at the school. Children interview Bah Kynsai and Kong Iba. Everyone is welcome.</p>
          </Card>
          <Card>
            <CardH title="Your choices"><ShieldCheck size={18} color="var(--accent)" /></CardH>
            <p className="sm t2">{opt === true ? `Consent withdrawn. ${child.name} learns with printed cards; practice data will be deleted from the hub within 7 days.` : `You gave consent on 4 October for ${child.name} to use ROOTS. Only first names are stored, on the school laptop, never online.`}</p>
            <div className="row" style={{ marginTop: 12 }}><button className="btn small" onClick={() => setOpt(opt === true ? false : 'ask')}>{opt === true ? 'Give consent again' : 'Withdraw consent'}</button><button className="btn small ghost" onClick={() => s.toast(`A printed copy of ${child.name}’s data will be ready at school.`, 'privacy')}>Ask for my child’s data</button></div>
          </Card>
        </div>
      </div>
      <Note>Levels follow the simple steps used in ASER surveys, so families can see progress without marks or comparisons.</Note>
      <Modal open={opt === 'ask'} onClose={() => setOpt(false)} title="Withdraw consent?">
        <div className="stack"><p className="sm t2">{child.name} can still join every group activity using printed hint cards. Practice records are deleted from the hub within 7 days. You can change your mind at any time.</p><div className="row"><button className="btn primary" onClick={() => { setOpt(true); s.toast('Consent withdrawn. The teacher has been told.', 'privacy') }}>Withdraw</button><button className="btn ghost" onClick={() => setOpt(false)}>Cancel</button></div></div>
      </Modal>
    </>
  )
}
