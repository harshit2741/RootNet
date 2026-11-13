import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Lightbulb, Users, CheckCircle2, Volume2, ArrowRight, Timer, Info } from 'lucide-react'
import { useStore } from '../store'
import { QUESTIONS, STUDENTS } from '../data'
import { checkAnswer, intentOf, BUDDY_LINES } from '../buddy'
import { Card, CardH, Hero, Avatar, Note, statusTag } from '../components/ui'
import Chat from '../components/Chat'
import { GroupSelect } from './StudentHome'
import { khasiNumber } from '../i18n'

let mid = 0
const pick = (a) => a[Math.floor(Math.random() * a.length)]

export default function Practice() {
  const s = useStore()
  const g = s.groups.find((x) => x.id === s.activeGroup)
  const list = QUESTIONS.filter((q) => q.subject === g.subject && q.level === g.level)
  const q = list[g.qi % list.length]
  const kids = g.members.map((id) => STUDENTS.find((k) => k.id === id))
  const roles = kids.map((k, i) => ({ ...k, role: ['Reader', 'Solver', 'Checker', 'Helper'][(i + g.rot) % kids.length] }))
  const who = (r) => roles.find((x) => x.role === r)?.name
  const [reader, solver, checker] = [who('Reader'), who('Solver'), who('Checker')]

  const [msgs, setMsgs] = useState([]); const [typing, setTyping] = useState(false)
  const [st, setSt] = useState({ stage: 'attempt', tries: 0, unlocked: 0, opened: 0, correct: false })
  const [disc, setDisc] = useState(0)
  const stRef = useRef(st); stRef.current = st
  const timer = useRef()
  const add = (m) => setMsgs((x) => [...x, { id: ++mid, ...m }])
  const say = (items, delay = 600) => { setTyping(true); setTimeout(() => { setTyping(false); items.forEach((m) => add({ from: 'buddy', ...m })) }, delay) }

  useEffect(() => {
    clearInterval(timer.current); setDisc(0)
    setSt({ stage: 'attempt', tries: 0, unlocked: 0, opened: 0, correct: false })
    setMsgs([{ id: ++mid, from: 'sys', text: `QUESTION ${g.qi % list.length + 1} OF ${list.length} · LEVEL ${g.level} ${g.subject.toUpperCase()} · ${q.skill.toUpperCase()}` }])
    say([{ text: <><b>{reader}</b>, you’re the Reader. Read this aloud to your group:</>, node: <div className="inset"><span style={{ fontSize: '1.15rem', fontWeight: 700 }}>{q.text}</span>{useStore.getState().lang === 'kha' && (q.text.match(/\d+/g) || []).filter((n) => +n <= 99).length > 0 && <span className="xs t2">In Khasi: {(q.text.match(/\d+/g) || []).filter((n) => +n <= 99).map((n) => `${n} = ${khasiNumber(+n)}`).join(' · ')}</span>}</div> }, { text: <><b>{solver}</b>, type your group’s try when you’re ready. A guess is a good start.</> }], 400)
    return () => clearInterval(timer.current)
  }, [g.id, g.qi]) // eslint-disable-line react-hooks/exhaustive-deps

  const openHint = () => {
    const c = stRef.current
    if (c.tries === 0) return say([{ text: pick(BUDDY_LINES.needTry) }])
    if (c.opened >= 3) return say([{ text: 'Every hint is open. Talk it over and try again.' }])
    if (c.opened >= c.unlocked) return say([{ text: 'Try once more first. The next hint opens after another try.' }])
    const i = c.opened; setSt({ ...c, opened: i + 1 })
    if (i < 2) say([{ text: <><span className="tag acc" style={{ marginBottom: 6 }}><Lightbulb size={11} />{i === 0 ? 'Hint 1 · a nudge' : 'Hint 2 · from village life'}</span><br />{q.hints[i]}</> }], 450)
    else { say([{ text: <><span className="tag info" style={{ marginBottom: 6 }}><Users size={11} />Discuss together · 1 minute</span><br />{q.hints[2]}</> }], 450); setDisc(60); clearInterval(timer.current); timer.current = setInterval(() => setDisc((d) => { if (d <= 1) { clearInterval(timer.current); return 0 } return d - 1 }), 1000) }
  }
  const finish = (text) => {
    const c = stRef.current
    add({ from: 'me', text, who: `${checker} · Checker` })
    if (text.length < 14) return say([{ text: BUDDY_LINES.explainShort }])
    setSt({ ...c, stage: 'done' })
    const hints = Math.min(2, c.opened)
    s.logAttempt({ g: g.name, q: q.text, tries: c.tries, hints, ok: c.correct, explained: true, t: 'just now' })
    const patch = { done: g.done + 1, clean: g.clean + (c.correct && c.opened === 0 ? 1 : 0), last: 'just now' }
    if (c.correct && c.tries <= 2 && g.status !== 'stuck') patch.status = 'ok'
    if (c.correct) s.addXP(c.opened === 0 ? 60 : 40)
    s.updateGroup(g.id, patch)
    say([{ text: <>{pick(BUDDY_LINES.explainGood)} {c.correct ? <b>+{c.opened === 0 ? 60 : 40} stars.</b> : 'Your teacher will look at this one with you.'}</>, node: <div className="inset sm"><span>Answer: <b>{q.show}</b></span><span className="t3 mono xs">{c.tries} {c.tries === 1 ? 'TRY' : 'TRIES'} · {hints} HINT{hints === 1 ? '' : 'S'} · EXPLAINED BY {checker.toUpperCase()}</span></div> }])
  }
  const onSend = (text) => {
    const c = stRef.current
    if (c.stage === 'explain') return finish(text)
    if (c.stage === 'done') { add({ from: 'me', text }); return say([{ text: 'Great work. Select “Next question” when your group is ready.' }]) }
    const it = intentOf(text)
    add({ from: 'me', text, who: it === 'attempt' ? `${solver} · Solver` : undefined })
    if (it === 'hint') return openHint()
    if (it === 'answer') return say([{ text: pick(BUDDY_LINES.refuse) }])
    if (it === 'read') return say([{ text: <>Here it is again: <b>{q.text}</b></> }])
    const tries = c.tries + 1
    if (checkAnswer(q, text)) { setSt({ ...c, tries, stage: 'explain', correct: true }); say([{ text: <>{pick(BUDDY_LINES.right)} {BUDDY_LINES.explainAsk(checker)}</> }]) }
    else if (tries >= 4) { setSt({ ...c, tries, stage: 'explain', unlocked: 3 }); s.updateGroup(g.id, { status: 'stuck', note: `Answer shown after 4 tries on “${q.text}”` }); say([{ text: <>That was a tough one. The answer is <b>{q.show}</b>. {checker}, can you explain why it’s right? Your teacher has been told so they can help.</> }]) }
    else { setSt({ ...c, tries, unlocked: Math.min(3, tries) }); say([{ text: <>{pick(BUDDY_LINES.wrong)}{['Hint 1 is ready.', 'Hint 2 is ready: an example from village life.', 'Time to discuss together, then try once more.'][tries - 1]}</> }]) }
  }
  const rungs = [['Hint 1', 'A gentle nudge', Lightbulb], ['Hint 2', 'A village example', Lightbulb], ['Discuss', 'Talk it through', Users]]
  return (
    <>
      <Hero eyebrow="Learn · Practise with Buddy" title="Try first." emph="Hints open one step at a time." chips={<><GroupSelect /><span className="t2">The Checker explains every answer before it is saved.</span></>} />
      <div className="grid split">
        <Chat title="Buddy" subtitle="Study buddy · runs on the school laptop · no internet" badge={<span className="tag acc">Hints, never answers</span>}
          messages={msgs} typing={typing} onSend={onSend} quick={st.stage === 'attempt' ? ['Give me a hint', 'Just tell me the answer', 'Read it again'] : []}
          onQuick={(x) => (x === 'Give me a hint' ? (add({ from: 'me', text: x }), openHint()) : onSend(x))}
          placeholder={st.stage === 'explain' ? `${checker}: it’s right because…` : st.stage === 'done' ? 'Well done' : `${solver}: type your group’s try…`} inputLabel="Your group's answer"
          note="Hints were written ahead of time and checked by your teacher. Buddy can make mistakes; ask your teacher if something seems wrong." />
        <div className="stack">
          <Card data-tour="ladder">
            <CardH title="Hint ladder" sub={st.tries ? `${st.tries} ${st.tries === 1 ? 'try' : 'tries'} so far` : 'Locked until your group tries'} />
            <div className="stack-s">
              {rungs.map(([a, b, I], i) => {
                const state = i < st.opened ? 'open' : i < st.unlocked && i === st.opened ? 'ready' : 'locked'
                return (
                  <button key={a} type="button" className="well" disabled={state !== 'ready'} onClick={() => { add({ from: 'me', text: `Open ${a}` }); openHint() }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', textAlign: 'left', cursor: state === 'ready' ? 'pointer' : 'default', color: 'inherit', borderColor: state === 'ready' ? 'var(--accent)' : undefined, opacity: state === 'locked' ? .55 : 1 }}>
                    {state === 'locked' ? <Lock size={16} className="t3" /> : state === 'open' ? <CheckCircle2 size={16} color="var(--ok)" /> : <I size={16} color="var(--accent)" />}
                    <span style={{ flex: 1 }}><b className="sm">{a}</b><span className="xs t3" style={{ display: 'block' }}>{b}</span></span>
                    <span className="mono xs t3">{state === 'locked' ? `TRY ${i + 1}` : state === 'ready' ? 'OPEN' : 'DONE'}</span>
                  </button>
                )
              })}
              <AnimatePresence>{disc > 0 && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="well" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}><Timer size={17} /><span className="mono" style={{ fontSize: '1.3rem' }}>0:{String(disc).padStart(2, '0')}</span><button className="btn small" style={{ marginLeft: 'auto' }} onClick={() => { clearInterval(timer.current); setDisc(0) }}>We discussed</button></motion.div>}</AnimatePresence>
            </div>
          </Card>
          {st.stage === 'done' && <button className="btn primary" onClick={() => s.updateGroup(g.id, { qi: g.qi + 1, rot: g.rot + 1 })}>Next question<ArrowRight size={16} /></button>}
          <Card>
            <CardH title="Roles this question"><button className="btn small ghost" onClick={() => s.toast('Reading aloud with the hub’s offline voice (simulated here).', 'river')}><Volume2 size={14} />Read aloud</button></CardH>
            <div className="stack-s">{roles.map((r) => <div key={r.id} className="between"><span className="row" style={{ gap: 10 }}><Avatar name={r.name} /><b className="sm">{r.name}</b></span><span className={`tag ${r.role === 'Checker' ? 'acc' : ''}`}>{r.role}</span></div>)}</div>
          </Card>
          <Card tight><div className="between"><span className="sm t2">Teacher sees</span>{statusTag(g.status)}</div></Card>
          <Note icon={Info}>Demo: the answer is <b className="b">{q.show}</b>. Type a wrong answer to unlock hints, or ask for the answer to see Buddy decline.</Note>
        </div>
      </div>
    </>
  )
}
