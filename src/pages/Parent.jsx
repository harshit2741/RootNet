import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, MessageSquareQuote, ShieldCheck, Stamp, Check } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS } from '../data'
import { Glass, CardHead, PageHead, Avatar, Modal, Notice } from '../components/ui'
import Mascot from '../components/Mascot'

const LADDERS = {
  Reading: ['Beginner', 'Letters', 'Words', 'Paragraph', 'Story'],
  Maths: ['Beginner', 'Numbers 1–9', 'Numbers 10–99', 'Subtraction', 'Division'],
}
const KIDS = {
  'orchid-0': { Reading: [1, 2], Maths: [1, 2], days: [1, 1, 0, 1, 1], note: 'Riti counts confidently now. She is still learning to share things into equal groups. Try sharing 12 pebbles among 4 cups at home.' },
  'bamboo-0': { Reading: [2, 3], Maths: [2, 4], days: [1, 1, 1, 1, 1], note: 'Ibadahun found the repeating unit in Bah Kynsai’s weave and explained it to his group. Ask him to show you the pattern on a basket at home.' },
  'river-0': { Reading: [2, 3], Maths: [2, 2], days: [1, 0, 1, 1, 0], note: 'Badaphira reads short paragraphs aloud now. She likes the river story. Ask her to retell it to you.' },
}

function Ladder({ label, steps, from, to }) {
  return (
    <div className="stack-sm">
      <div className="between"><b>{label}</b><span className="pill leaf">Up {to - from} step{to - from === 1 ? '' : 's'}</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length},1fr)`, gap: 6 }}>
        {steps.map((st, i) => (
          <div key={st} style={{ display: 'grid', gap: 6, justifyItems: 'center', textAlign: 'center' }}>
            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * .08 }} style={{ originY: 1, height: 18 + i * 12, width: '100%', borderRadius: 10, background: i <= to ? (i <= from ? 'var(--leaf)' : 'var(--gold)') : 'var(--well)', position: 'relative' }}>
              {i === to && <span style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)' }}><Mascot size={30} float={false} mood="happy" /></span>}
            </motion.div>
            <span className="tiny" style={{ fontWeight: i === to ? 700 : 400, color: i === to ? 'var(--ink)' : 'var(--ink-3)' }}>{st}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Parent() {
  const s = useStore()
  const [kid, setKid] = useState('orchid-0'); const [optOut, setOptOut] = useState(false)
  const child = STUDENTS.find((k) => k.id === kid); const d = KIDS[kid]
  const g = s.groups.find((x) => x.members.includes(kid))
  const stamps = s.passport.filter((p) => p.who === child.name)
  return (
    <>
      <PageHead eyebrow="For parents and guardians" title={`How ${child.name} is doing`} lede="Simple pictures, no marks or ranks. This page is also printed and shown at school, since not every family has a phone.">
        <label className="sr-only" htmlFor="kid">Choose your child</label>
        <select id="kid" className="select" style={{ width: 'auto' }} value={kid} onChange={(e) => setKid(e.target.value)}>{Object.keys(KIDS).map((k) => <option key={k} value={k}>{STUDENTS.find((x) => x.id === k).name}</option>)}</select>
      </PageHead>
      <div className="grid split-wide">
        <Glass strong className="pad-lg stack" style={{ gap: 22 }}>
          <div className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={child.name} size="lg" /><div><h2 style={{ fontSize: '1.4rem' }}>{child.name}, age {child.age}</h2><p className="muted small">{g?.name} group · Level {g?.level} {g?.subject}</p></div></div>
          <p className="small faint">Green shows where {child.name} started in June. Gold shows the steps climbed since then.</p>
          <Ladder label="Reading" steps={LADDERS.Reading} from={d.Reading[0]} to={d.Reading[1]} />
          <Ladder label="Maths" steps={LADDERS.Maths} from={d.Maths[0]} to={d.Maths[1]} />
          <div className="well" style={{ padding: 16, display: 'grid', gap: 6 }}>
            <span className="row" style={{ gap: 8 }}><MessageSquareQuote size={18} color="var(--accent)" /><b>A note from Ms. Lyngdoh</b></span>
            <p>{d.note}</p>
          </div>
        </Glass>
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="This week" sub="Days practised at school" />
            <div className="row" style={{ gap: 10 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                <div key={day} style={{ display: 'grid', justifyItems: 'center', gap: 4 }}>
                  <span className={d.days[i] ? 'neu-in' : 'neu'} style={{ width: 42, height: 42, borderRadius: 14, display: 'grid', placeItems: 'center', color: d.days[i] ? 'var(--leaf)' : 'var(--ink-3)' }}>{d.days[i] ? <Check size={18} /> : '·'}</span>
                  <span className="tiny faint">{day}</span>
                </div>
              ))}
            </div>
          </Glass>
          <Glass>
            <CardHead title="Skill Passport stamps"><Stamp size={18} color="var(--gold)" /></CardHead>
            {stamps.length ? stamps.map((p) => <div key={p.id} className="between" style={{ padding: '6px 0' }}><span className="small">{p.skill}</span>{p.t && p.m ? <span className="pill leaf">Stamped</span> : <span className="pill gold">Being checked</span>}</div>) : <p className="small faint">{child.name} will earn stamps from this month’s missions.</p>}
          </Glass>
          <Glass>
            <CardHead title="Come to Roots Day"><CalendarDays size={18} color="var(--river)" /></CardHead>
            <p className="small"><b>Friday 28 November, 11 am</b> at the school. Children will interview Bah Kynsai and Kong Iba. Everyone is welcome.</p>
          </Glass>
          <Glass>
            <CardHead title="Your choices"><ShieldCheck size={18} color="var(--river)" /></CardHead>
            <p className="small">{optOut === true ? `You have withdrawn consent. ${child.name} will learn with printed cards instead, and their practice data will be deleted from the hub.` : `You gave consent on 4 October for ${child.name} to use ROOTS at school. Only first names are stored, on the school laptop, never online.`}</p>
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn sm" onClick={() => setOptOut(optOut === true ? false : 'ask')}>{optOut === true ? 'Give consent again' : 'Withdraw consent'}</button>
              <button className="btn sm ghost" onClick={() => s.toast(`A printed copy of ${child.name}’s data will be ready at school.`, 'privacy')}>Ask for my child’s data</button>
            </div>
          </Glass>
        </div>
      </div>
      <Notice>Levels follow the simple steps used in ASER surveys, so families can see progress without marks or comparisons with other children.</Notice>
      <Modal open={optOut === 'ask'} onClose={() => setOptOut(false)} title="Withdraw consent?">
        <div className="stack">
          <p className="small muted">{child.name} can still join every group activity with printed hint cards. Their practice records will be deleted from the hub within 7 days. You can change your mind at any time by telling the teacher.</p>
          <div className="row"><button className="btn primary" onClick={() => { setOptOut(true); s.toast('Consent withdrawn. The teacher has been told.', 'privacy') }}>Withdraw</button><button className="btn ghost" onClick={() => setOptOut(false)}>Cancel</button></div>
        </div>
      </Modal>
    </>
  )
}
