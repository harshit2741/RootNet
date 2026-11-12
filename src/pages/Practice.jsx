import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Lightbulb, Users, MessageCircleQuestion, CheckCircle2, Volume2, ArrowRight, Timer } from 'lucide-react'
import { useStore } from '../store'
import { QUESTIONS, STUDENTS } from '../data'
import { checkAnswer, intentOf, BUDDY_LINES } from '../buddy'
import { Glass, CardHead, Avatar, PageHead, Notice, statusPill } from '../components/ui'
import Chat from '../components/Chat'
import { GroupPicker } from './StudentHome'

let mid = 0
const pick = (a) => a[Math.floor(Math.random() * a.length)]

function Confetti({ show }) {
  const bits = useMemo(() => [...Array(26)].map((_, i) => ({ x: (Math.random() - .5) * 520, y: -Math.random() * 300 - 80, r: Math.random() * 360, c: ['var(--accent)', 'var(--gold)', 'var(--leaf)', 'var(--river)'][i % 4] })), [show])
  return (
    <AnimatePresence>
      {show && <div aria-hidden="true" style={{ position: 'fixed', left: '50%', top: '55%', zIndex: 40, pointerEvents: 'none' }}>
        {bits.map((b, i) => <motion.i key={i} style={{ position: 'absolute', width: 9, height: 14, borderRadius: 3, background: b.c }} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: b.x, y: [0, b.y, b.y + 260], rotate: b.r, opacity: [1, 1, 0] }} transition={{ duration: 1.6, ease: 'easeOut' }} />)}
      </div>}
    </AnimatePresence>
  )
}

export default function Practice() {
  const s = useStore()
  const g = s.groups.find((x) => x.id === s.activeGroup)
  const list = QUESTIONS.filter((q) => q.subject === g.subject && q.level === g.level)
  const q = list[g.qi % list.length]
  const kids = g.members.map((id) => STUDENTS.find((k) => k.id === id))
  const roles = kids.map((k, i) => ({ ...k, role: ['Reader', 'Solver', 'Checker', 'Helper'][(i + g.rot) % kids.length] }))
  const reader = roles.find((r) => r.role === 'Reader')?.name, solver = roles.find((r) => r.role === 'Solver')?.name, checker = roles.find((r) => r.role === 'Checker')?.name

  const [msgs, setMsgs] = useState([])
  const [typing, setTyping] = useState(false)
  const [st, setSt] = useState({ stage: 'attempt', tries: 0, unlocked: 0, opened: 0, revealed: false, correct: false })
  const [disc, setDisc] = useState(0)
  const [party, setParty] = useState(false)
  const [mood, setMood] = useState('happy')
  const stRef = useRef(st); stRef.current = st
  const timer = useRef()

  const add = (m) => setMsgs((x) => [...x, { id: ++mid, ...m }])
  const say = (items, delay = 650) => { setTyping(true); setTimeout(() => { setTyping(false); items.forEach((m) => add({ from: 'buddy', ...m })) }, delay) }

  useEffect(() => {
    clearInterval(timer.current); setDisc(0); setParty(false); setMood('happy')
    setSt({ stage: 'attempt', tries: 0, unlocked: 0, opened: 0, revealed: false, correct: false })
    setMsgs([{ id: ++mid, from: 'sys', text: `Question ${g.qi % list.length + 1} of ${list.length} · Level ${g.level} ${g.subject} · ${q.skill}` }])
    say([{ text: <><b>{reader}</b>, you’re the Reader. Read this aloud to your group:</>, node: <div className="card-in"><span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>{q.text}</span></div> },
         { text: <><b>{solver}</b>, type your group’s try when you’re ready. Even a guess is a great start.</> }], 500)
    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.id, g.qi])

  const openHint = () => {
    const c = stRef.current
    if (c.tries === 0) { say([{ text: pick(BUDDY_LINES.needTry), mood: 'think' }]); return }
    if (c.opened >= 3) { say([{ text: 'You’ve opened every hint. Talk it over and try again. I believe in you!' }]); return }
    if (c.opened >= c.unlocked) { say([{ text: 'Try once more first. The next hint opens after another try.', mood: 'think' }]); return }
    const i = c.opened
    setSt({ ...c, opened: i + 1 })
    if (i < 2) say([{ text: <><span className="pill gold" style={{ marginBottom: 6 }}><Lightbulb size={12} />{i === 0 ? 'Hint 1 · a nudge' : 'Hint 2 · from village life'}</span><br />{q.hints[i]}</>, mood: 'think' }], 500)
    else {
      say([{ text: <><span className="pill river" style={{ marginBottom: 6 }}><Users size={12} />Discuss together · 1 minute</span><br />{q.hints[2]}</> }], 500)
      setDisc(60); clearInterval(timer.current)
      timer.current = setInterval(() => setDisc((d) => { if (d <= 1) { clearInterval(timer.current); return 0 } return d - 1 }), 1000)
    }
  }

  const finish = (text) => {
    const c = stRef.current
    add({ from: 'me', text, who: `${checker} · Checker` })
    if (text.length < 14) { say([{ text: BUDDY_LINES.explainShort, mood: 'think' }]); return }
    setSt({ ...c, stage: 'done' })
    const hintsUsed = Math.min(2, c.opened)
    s.logAttempt({ g: g.name, q: q.text, tries: c.tries, hints: hintsUsed, ok: c.correct, explained: true, t: 'just now' })
    const patch = { done: g.done + 1, clean: g.clean + (c.correct && c.opened === 0 ? 1 : 0), last: 'just now' }
    if (c.correct && c.tries <= 2 && g.status !== 'stuck') patch.status = 'ok'
    if (c.correct) s.addXP(c.opened === 0 ? 60 : 40)
    s.updateGroup(g.id, patch)
    if (c.correct) { setParty(true); setMood('cheer'); setTimeout(() => setParty(false), 1700) }
    say([{ text: <>{pick(BUDDY_LINES.explainGood)} {c.correct ? <b>+{c.opened === 0 ? 60 : 40} stars</b> : 'Your teacher will look at this one with you.'}</>, mood: 'cheer',
      node: <div className="card-in small"><span>Answer: <b>{q.show}</b></span><span className="faint">{c.tries} {c.tries === 1 ? 'try' : 'tries'} · {hintsUsed} hint{hintsUsed === 1 ? '' : 's'} · explained by {checker}</span></div> }])
  }

  const onSend = (text) => {
    const c = stRef.current
    if (c.stage === 'explain') return finish(text)
    if (c.stage === 'done') { add({ from: 'me', text }); say([{ text: 'Great work! Tap “Next question” when your group is ready.' }]); return }
    const it = intentOf(text)
    add({ from: 'me', text, who: it === 'attempt' ? `${solver} · Solver` : undefined })
    if (it === 'hint') return openHint()
    if (it === 'answer') { say([{ text: pick(BUDDY_LINES.refuse), mood: 'think' }]); return }
    if (it === 'read') { say([{ text: <>Here it is again: <b>{q.text}</b></> }]); return }
    const tries = c.tries + 1
    if (checkAnswer(q, text)) {
      setSt({ ...c, tries, stage: 'explain', correct: true }); setMood('cheer')
      say([{ text: <>{pick(BUDDY_LINES.right)} {BUDDY_LINES.explainAsk(checker)}</>, mood: 'cheer' }])
    } else if (tries >= 4) {
      setSt({ ...c, tries, stage: 'explain', revealed: true, unlocked: 3 })
      s.updateGroup(g.id, { status: 'stuck', note: `Answer shown after 4 tries on “${q.text}”` })
      say([{ text: <>That was a tough one. Here’s the answer: <b>{q.show}</b>. {checker}, can you explain why it’s right? I’ve also let your teacher know so they can help.</> }])
    } else {
      const unlocked = Math.min(3, tries)
      setSt({ ...c, tries, unlocked })
      say([{ text: <>{pick(BUDDY_LINES.wrong)}{['Hint 1 is ready. Tap “Give me a hint” or open it on the ladder.', 'Hint 2 is ready: an example from village life.', 'Time to discuss together. Open the discussion step, then try once more.'][tries - 1]}</>, mood: 'think' }])
    }
  }

  const rungs = [['Hint 1', 'A gentle nudge', Lightbulb], ['Hint 2', 'A village example', Lightbulb], ['Discuss', 'Talk it through', Users]]
  const quick = st.stage === 'attempt' ? ['Give me a hint', 'Just tell me the answer', 'Read it again'] : []
  return (
    <>
      <PageHead eyebrow="Learn at my level" title="Practise with Buddy" lede="Your group shares one tablet. Try first. Hints open one step at a time. The Checker explains before anything is saved." />
      <GroupPicker />
      <Confetti show={party} />
      <div className="grid split">
        <Chat title="Buddy" subtitle="Your study buddy · runs on the school laptop, no internet needed" mood={mood}
          badge={<span className="pill violet">Hints, never answers</span>}
          messages={msgs} typing={typing} onSend={onSend} quick={quick}
          onQuick={(qq) => qq === 'Give me a hint' ? (add({ from: 'me', text: qq }), openHint()) : onSend(qq)}
          placeholder={st.stage === 'explain' ? `${checker}: it’s right because…` : st.stage === 'done' ? 'Well done!' : `${solver}: type your group’s try…`}
          inputLabel="Your group's answer"
          note="Buddy uses hints written ahead of time and checked by your teacher. Buddy can make mistakes. If something seems wrong, ask your teacher." />
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="Hint ladder" sub={st.tries ? `${st.tries} ${st.tries === 1 ? 'try' : 'tries'} so far` : 'Locked until you try'} />
            <div className="stack-sm">
              {rungs.map(([a, b, I], i) => {
                const state = i < st.opened ? 'open' : i < st.unlocked && i === st.opened ? 'ready' : 'locked'
                return (
                  <button key={a} type="button" className={state === 'ready' ? 'btn' : 'btn ghost'} disabled={state !== 'ready'} onClick={() => { add({ from: 'me', text: `Open ${a}` }); openHint() }}
                    style={{ justifyContent: 'flex-start', minHeight: 54, opacity: state === 'locked' ? .55 : 1, color: state === 'open' ? 'var(--leaf)' : state === 'ready' ? 'var(--accent)' : undefined }}>
                    {state === 'locked' ? <Lock size={16} /> : state === 'open' ? <CheckCircle2 size={16} /> : <I size={16} />}
                    <span style={{ textAlign: 'left' }}><b>{a}</b><br /><span className="tiny faint">{b} · {state === 'locked' ? `opens after try ${i + 1}` : state === 'ready' ? 'tap to open' : 'opened'}</span></span>
                  </button>
                )
              })}
              <AnimatePresence>{disc > 0 && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="neu-in" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}><Timer size={18} /><span className="num" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>0:{String(disc).padStart(2, '0')}</span><button className="btn sm" style={{ marginLeft: 'auto' }} onClick={() => { clearInterval(timer.current); setDisc(0) }}>We discussed</button></motion.div>}</AnimatePresence>
            </div>
          </Glass>
          <Glass>
            <CardHead title="Roles this question" />
            <div className="stack-sm">
              {roles.map((r) => <div key={r.id} className="between"><span className="row" style={{ gap: 10 }}><Avatar name={r.name} /><span className="small"><b>{r.name}</b></span></span><span className={`pill ${{ Reader: 'accent', Solver: 'river', Checker: 'leaf' }[r.role] || ''}`}>{r.role}</span></div>)}
              <button className="btn sm ghost" style={{ justifySelf: 'start', marginTop: 4 }} onClick={() => s.toast('Reading aloud with the hub’s offline voice (simulated here).', 'river')}><Volume2 size={15} />Read the question aloud</button>
            </div>
          </Glass>
          {st.stage === 'done' && <button className="btn primary" onClick={() => s.updateGroup(g.id, { qi: g.qi + 1, rot: g.rot + 1 })}>Next question <ArrowRight size={17} /></button>}
          <Glass>
            <CardHead title="What your teacher sees" />
            <div className="row">{statusPill(g.status)}<span className="small faint num">{g.done} solved · {g.clean} without a hint</span></div>
          </Glass>
          <Notice icon={MessageCircleQuestion}>Demo tip: the answer to this question is <b>{q.show}</b>. Type a wrong answer to watch the hints unlock, or ask Buddy for the answer to see it say no.</Notice>
        </div>
      </div>
    </>
  )
}
