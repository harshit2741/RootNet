import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Target, Activity, Users, Clock as ClockIc, TrendingUp, Lightbulb, BookOpen, Stamp, AlertTriangle, ClipboardCheck, BatteryLow, CalendarDays, ArrowUpRight, LayoutGrid, Rows3 } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS, TREND } from '../data'
import { Card, CardH, Hero, Clock, Banner, Kpi, Feed, Tabs, Avatar, Track, statusTag } from '../components/ui'
import { useTokens, Tip, axis } from '../components/charts'

const DAYS = [{ d: 'Mon', Maths: 14, English: 11 }, { d: 'Tue', Maths: 17, English: 12 }, { d: 'Wed', Maths: 12, English: 15 }, { d: 'Thu', Maths: 19, English: 13 }, { d: 'Fri', Maths: 9, English: 7 }]

export function teacherFeed(s) {
  return [
    ...s.log.slice(0, 4).map((l) => ({ k: l.ok ? 'ok' : 'warn', t: '10:4' + (l.tries % 10), a: `${l.g} group`, b: `${l.ok ? 'solved' : 'saw answer'} · ${l.q}` })),
    { k: 'acc', t: '10:38', a: 'Village Voice', b: 'Kong Bandarisha recorded “How the river got its name”' },
    { k: 'info', t: '10:31', a: 'Hub', b: 'Tablet B battery 41% · charging advised' },
    { k: 'c3', t: '02:10', a: 'AI', b: 'Hints pre-generated for 12 new questions' },
  ]
}

export default function TeacherOverview() {
  const s = useStore(); const nav = useNavigate(); const t = useTokens()
  const [view, setView] = useState('board')
  const gs = s.groups
  const stuck = gs.filter((g) => g.status === 'stuck'); const pend = s.records.filter((r) => r.status === 'pending')
  const active = gs.filter((g) => g.status !== 'idle').length
  const done = gs.reduce((a, g) => a + g.done, 0), clean = gs.reduce((a, g) => a + g.clean, 0), rate = Math.round(clean / done * 100)
  const approved = s.records.filter((r) => r.status === 'approved').length
  const verified = s.passport.filter((p) => p.t && p.m).length
  const banners = [
    ...stuck.map((g) => ({ tone: 'warn', icon: AlertTriangle, title: `${g.name} group: wrong again after both hints`, sub: `Level ${g.level} ${g.subject} · ${g.note}`, action: { label: 'Open their screen', onClick: () => { s.setActiveGroup(g.id); nav('/student/practice') } } })),
    ...(pend.length ? [{ tone: 'info', icon: ClipboardCheck, title: `${pend.length} AI-drafted lesson card${pend.length > 1 ? 's' : ''} waiting for you`, sub: pend.map((r) => `${r.who}: ${r.title}`).join(' · '), action: { label: 'Review', onClick: () => nav('/teacher/approvals') } }] : []),
    { tone: 'crit', icon: BatteryLow, title: 'Phone 2 (Hornbill) at 18% battery', sub: 'Charge before tomorrow’s first class · Hub admin notified', action: { label: 'Open hub', onClick: () => nav('/hub') } },
    { tone: 'ok', icon: CalendarDays, title: 'Roots Day in 16 days: Friday 28 November', sub: 'Bah Kynsai and Kong Iba confirmed · interview questions drafted', action: { label: 'Plan', onClick: () => nav('/teacher/missions') } },
  ]
  return (
    <>
      <Hero eyebrow="Command center · Classroom" title={`Good morning, ${s.teacher || 'Ms. Lyngdoh'}.`} emph={`${STUDENTS.length} children are learning at their level.`}
        chips={<><span className="chip acc"><i className="dot" />Week {s.week} · Learn & make</span><span className="chip">Thu 12 Nov 2026</span><span className="t2">{stuck.length} needs help · {pend.length} cards to approve · {active} of {gs.length} groups live</span></>}
        right={<Clock />} />
      <Banner items={banners} />
      <div className="kpis" data-tour="kpis">
        <Kpi label="Solved before a hint" icon={Target} k="var(--c1)" value={rate} unit="%" meta={<>Week 1 <b>38%</b> · target <b>70%</b></>} track={{ value: rate, target: 70 }} />
        <Kpi label="Practice sessions this week" icon={Activity} k="var(--c2)" value="92" meta={<span className="delta up">▲ 5.7% vs last week</span>} spark={{ data: TREND, dataKey: 'sessions', k: 'c2' }} />
        <Kpi label="Groups practising" icon={Users} k="var(--c3)" value={active} of={gs.length} meta={<><b>{STUDENTS.length}</b> children · <b>3</b> levels · <b>2</b> subjects</>} track={{ value: active, max: gs.length }} />
        <Kpi label="Your time saved" icon={ClockIc} k="var(--c1)" value="4.5" unit="h/wk" meta={<>Target band <b>4–6 h</b> · drafting, grouping, hints</>} track={{ value: 4.5, max: 6, target: 4 }} />
        <Kpi label="Moved up a level" icon={TrendingUp} k="var(--c2)" value="57" unit="%" meta={<>Reading <b>57%</b> · Maths <b>62%</b> · since June</>} track={{ value: 57, target: 60 }} />
        <Kpi label="Hints per question" icon={Lightbulb} k="var(--c4)" value="1.0" meta={<span className="delta up">▼ from 1.9 in week 1</span>} spark={{ data: TREND, dataKey: 'hints', k: 'c4' }} />
        <Kpi label="Lesson cards in library" icon={BookOpen} k="var(--c3)" value={approved} of={approved + pend.length} meta={<><b>{pend.length}</b> waiting · <b>6</b> knowledge holders</>} track={{ value: approved, max: approved + pend.length }} />
        <Kpi label="Passport skills verified" icon={Stamp} k="var(--c4)" value={verified} of={s.passport.length} meta={<>Teacher + mentor ticks · <b>Pattern Detective</b></>} track={{ value: verified, max: s.passport.length }} />
      </div>
      <Feed items={teacherFeed(s)} />

      <Card data-tour="board">
        <div className="between" style={{ marginBottom: 6 }}>
          <div className="row" style={{ flexWrap: 'nowrap', gap: 14 }}>
            <span className="bot" style={{ width: 44, height: 44, borderRadius: 13 }}><LayoutGrid size={20} /></span>
            <div><h2 style={{ fontSize: '1.2rem' }}>Every group, live</h2><p className="mono xs t3" style={{ letterSpacing: '.04em' }}>{gs.length} groups · {STUDENTS.length} children · grouped by level, not age</p></div>
          </div>
          <div className="row" style={{ gap: 26 }}>
            {[['ok', gs.filter((g) => g.status === 'ok').length, 'ON TRACK'], ['warn', stuck.length, 'NEEDS HELP'], ['text-3', gs.filter((g) => g.status === 'idle').length, 'IDLE']].map(([c, n, l]) => (
              <div key={l} style={{ textAlign: 'right' }}><b className="mono" style={{ fontSize: '1.6rem', color: `var(--${c})` }}>{n}</b><div className="mono xs t3" style={{ letterSpacing: '.12em' }}>{l}</div></div>
            ))}
          </div>
        </div>
        <Tabs value={view} onChange={setView} items={[['board', <><LayoutGrid size={15} />By level</>], ['table', <><Rows3 size={15} />Table</>]]} />
        {view === 'board' ? (
          <div className="grid g3">
            {[1, 2, 3].map((l) => (
              <div key={l} className="stack" style={{ gap: 10 }}>
                <div className="between"><span className="mono xs t3" style={{ letterSpacing: '.14em' }}>LEVEL {l}</span><span className="xs t3">{gs.filter((g) => g.level === l).reduce((a, g) => a + g.members.length, 0)} children</span></div>
                {gs.filter((g) => g.level === l).map((g) => {
                  const ready = g.level < 3 && !g.moved && g.done >= 7 && g.clean / g.done >= .8
                  return (
                    <motion.div layout key={g.id} className="well" style={{ padding: 16, display: 'grid', gap: 10 }}>
                      <div className="between"><b style={{ fontSize: '1.02rem' }}>{g.name}</b>{statusTag(g.status)}</div>
                      <div className="between"><span className="tag">{g.subject}</span><span className="avs">{g.members.map((id) => <Avatar key={id} name={STUDENTS.find((k) => k.id === id).name} />)}</span></div>
                      <Track value={g.clean} max={g.done} k={g.status === 'stuck' ? 'var(--warn)' : 'var(--accent)'} />
                      <span className="xs t3 mono num">{g.done} solved · {g.clean} no hint · {g.last}</span>
                      {ready && <button className="btn small" onClick={() => { s.updateGroup(g.id, { level: g.level + 1, qi: 0, moved: true }); s.toast(`${g.name} moved up to Level ${g.level + 1}.`) }}><ArrowUpRight size={14} />Ready to move to Level {g.level + 1}</button>}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="scroll-x"><table className="table">
            <thead><tr><th>Group</th><th>Level</th><th>Children</th><th>Solved</th><th>Without a hint</th><th>Status</th><th>Last active</th><th /></tr></thead>
            <tbody>{gs.map((g) => <tr key={g.id}><td className="b">{g.name}</td><td>L{g.level} {g.subject}</td><td><span className="avs">{g.members.map((id) => <Avatar key={id} name={STUDENTS.find((k) => k.id === id).name} />)}</span></td><td className="mono">{g.done}</td><td style={{ minWidth: 140 }}><div className="row" style={{ flexWrap: 'nowrap' }}><div style={{ flex: 1 }}><Track value={g.clean} max={g.done} /></div><span className="mono xs">{Math.round(g.clean / g.done * 100)}%</span></div></td><td>{statusTag(g.status)}</td><td className="t3 sm">{g.last}</td><td><button className="btn small ghost" onClick={() => { s.setActiveGroup(g.id); nav('/student/practice') }}>Open</button></td></tr>)}</tbody>
          </table></div>
        )}
      </Card>

      <div className="grid split-7-5">
        <Card>
          <CardH title="Practice this week" sub="Questions attempted per day"><div className="legend"><span><i style={{ background: t.c2 }} />Maths</span><span><i style={{ background: t.c4 }} />English</span></div></CardH>
          <div style={{ height: 250 }}><ResponsiveContainer><BarChart data={DAYS} barGap={4}><CartesianGrid vertical={false} stroke={t.line} /><XAxis dataKey="d" {...axis(t)} /><YAxis {...axis(t)} width={28} /><Tooltip content={<Tip />} cursor={{ fill: t['surface-2'] }} /><Bar dataKey="Maths" fill={t.c2} radius={[6, 6, 0, 0]} maxBarSize={22} /><Bar dataKey="English" fill={t.c4} radius={[6, 6, 0, 0]} maxBarSize={22} /></BarChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <CardH title="Practice log" sub="Saved on the hub, never online"><Link className="btn small ghost" to="/teacher/groups">Skills</Link></CardH>
          <div className="stack-s">
            {s.log.slice(0, 5).map((l, i) => (
              <div key={i} className="between" style={{ padding: '9px 0', borderTop: i ? '1px solid var(--line)' : 0, flexWrap: 'nowrap' }}>
                <div style={{ minWidth: 0 }}><b className="sm">{l.g}</b><div className="xs t3" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.q}</div></div>
                <div className="row" style={{ flexWrap: 'nowrap', gap: 8 }}><span className="mono xs t3">{l.tries}t · {l.hints}h</span>{l.ok ? <span className="tag ok">Solved</span> : <span className="tag warn">Shown</span>}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
