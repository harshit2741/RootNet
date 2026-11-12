import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar as RBar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { Users, Target, AlertTriangle, ClipboardCheck, Clock, Bot, ArrowRight, ArrowUpRight, CalendarDays, Gift, Flag, Sparkles } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS, TREND } from '../data'
import { Glass, CardHead, PageHead, Avatar, Bar, statusPill } from '../components/ui'
import { useTokens, Tip, axis } from '../components/charts'

const DAYS = [
  { d: 'Mon', Maths: 14, English: 11 }, { d: 'Tue', Maths: 17, English: 12 }, { d: 'Wed', Maths: 12, English: 15 },
  { d: 'Thu', Maths: 19, English: 13 }, { d: 'Fri', Maths: 9, English: 7 },
]

export default function TeacherOverview() {
  const s = useStore(); const nav = useNavigate(); const t = useTokens()
  const gs = s.groups
  const stuck = gs.filter((g) => g.status === 'stuck')
  const pend = s.records.filter((r) => r.status === 'pending')
  const active = gs.filter((g) => g.status !== 'idle').length
  const done = gs.reduce((a, g) => a + g.done, 0), clean = gs.reduce((a, g) => a + g.clean, 0)
  const rate = Math.round(clean / done * 100)
  const trend = TREND.map((x, i) => (i === TREND.length - 1 ? { ...x, solved: rate } : x))
  const hintMix = [
    { name: 'No hint', value: clean, fill: t.leaf },
    { name: '1 hint', value: Math.round((done - clean) * .55), fill: t.gold },
    { name: '2 hints', value: Math.round((done - clean) * .3), fill: t.river },
    { name: 'Answer shown', value: Math.max(1, (done - clean) - Math.round((done - clean) * .55) - Math.round((done - clean) * .3)), fill: t.accent },
  ]
  const dues = s.records.filter((r) => r.dividend && r.dividend.status !== 'delivered')
  const mission = s.missions.find((m) => m.status === 'active')

  return (
    <>
      <PageHead eyebrow="Teacher · Thursday 12 November" title="Khublei, Ms. Lyngdoh" lede={`${active} of ${gs.length} groups are practising right now. ${stuck.length ? `${stuck.length} group${stuck.length > 1 ? 's need' : ' needs'} you.` : 'Nobody is stuck.'} ${pend.length} lesson card${pend.length === 1 ? ' is' : 's are'} waiting for your approval.`}>
        <Link to="/teacher/assistant" className="btn"><Bot size={17} />Ask the assistant</Link>
        <Link to="/teacher/approvals" className="btn primary"><ClipboardCheck size={17} />Review {pend.length} card{pend.length === 1 ? '' : 's'}</Link>
      </PageHead>

      <div className="grid g4">
        <Glass className="stat">
          <span className="k"><span className="ic" style={{ background: 'var(--river-soft)', color: 'var(--river)' }}><Users size={17} /></span>Groups practising</span>
          <span className="v num">{active}<span className="faint" style={{ fontSize: '1.2rem' }}>/{gs.length}</span></span>
          <span className="d faint">{STUDENTS.length} children in level groups of 3–4</span>
        </Glass>
        <Glass className="stat">
          <span className="k"><span className="ic" style={{ background: 'var(--leaf-soft)', color: 'var(--leaf)' }}><Target size={17} /></span>Solved before opening a hint</span>
          <div className="between" style={{ alignItems: 'flex-end', flexWrap: 'nowrap' }}>
            <span className="v num">{rate}%</span>
            <div style={{ width: 120, height: 44 }}>
              <ResponsiveContainer><AreaChart data={trend}><defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.leaf} stopOpacity=".35" /><stop offset="1" stopColor={t.leaf} stopOpacity="0" /></linearGradient></defs><Area type="monotone" dataKey="solved" stroke={t.leaf} strokeWidth={2} fill="url(#gs)" dot={false} isAnimationActive={false} /></AreaChart></ResponsiveContainer>
            </div>
          </div>
          <span className="d faint"><b className="up">+{rate - TREND[0].solved} pts</b> since week 1</span>
        </Glass>
        <Glass className="stat" style={stuck.length ? { outline: '2px solid var(--warn)', background: 'linear-gradient(var(--warn-soft),var(--warn-soft)), var(--glass)' } : undefined}>
          <span className="k"><span className="ic" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}><AlertTriangle size={17} /></span>Need help now</span>
          <span className="v num" style={{ color: stuck.length ? 'var(--warn)' : undefined }}>{stuck.length}</span>
          <span className="d faint">Wrong again after both hints</span>
        </Glass>
        <Glass className="stat">
          <span className="k"><span className="ic" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }}><Clock size={17} /></span>Your time saved</span>
          <span className="v num">4.5 h</span>
          <span className="d faint">This week: AI-drafted cards, pre-made hints, auto-grouping</span>
        </Glass>
      </div>

      <div className="grid split-main">
        <Glass>
          <CardHead title="Live class board" sub="Groups by level, not by age"><Link to="/teacher/groups" className="btn sm ghost">Regroup children <ArrowRight size={14} /></Link></CardHead>
          <div className="grid g3" style={{ gap: 12 }}>
            {[1, 2, 3].map((l) => (
              <div key={l} className="well" style={{ padding: 10, display: 'grid', gap: 10, alignContent: 'start' }}>
                <div className="between" style={{ padding: '2px 4px' }}><b>Level {l}</b><span className="tiny faint">{gs.filter((g) => g.level === l).reduce((a, g) => a + g.members.length, 0)} children</span></div>
                {gs.filter((g) => g.level === l).map((g) => {
                  const ready = g.level < 3 && !g.moved && g.done >= 7 && g.clean / g.done >= .8
                  return (
                    <motion.div layout key={g.id} className="glass strong" style={{ padding: 12, borderRadius: 16, display: 'grid', gap: 8, borderLeft: `4px solid var(--${g.status === 'stuck' ? 'warn' : g.status === 'idle' ? 'ink-3' : 'leaf'})` }}>
                      <div className="between"><b style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{g.name}</b>{statusPill(g.status)}</div>
                      <div className="between"><span className="pill">{g.subject}</span><span className="avs">{g.members.map((id) => <Avatar key={id} name={STUDENTS.find((k) => k.id === id).name} />)}</span></div>
                      <Bar value={g.clean} max={g.done} />
                      <span className="tiny faint num">{g.done} solved · {g.clean} without a hint · {g.last}</span>
                      {ready && <button className="btn sm gold" onClick={() => { s.updateGroup(g.id, { level: g.level + 1, qi: 0, moved: true }); s.toast(`${g.name} moved up to Level ${g.level + 1}.`) }}><ArrowUpRight size={14} />Ready: move to Level {g.level + 1}</button>}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        </Glass>
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="Need help now">{stuck.length > 0 && <span className="pill warn num">{stuck.length}</span>}</CardHead>
            {stuck.length ? stuck.map((g) => (
              <div key={g.id} style={{ padding: 12, borderRadius: 14, background: 'var(--warn-soft)', display: 'grid', gap: 8 }}>
                <b style={{ color: 'var(--warn)' }}>{g.name} · L{g.level} {g.subject}</b>
                <span className="small">{g.note}</span>
                <span className="small faint">Suggested: sit with them for 5 minutes and use real objects (pebbles, paddy bundles).</span>
                <div className="row"><button className="btn sm primary" onClick={() => { s.setActiveGroup(g.id); nav('/student/practice') }}>Open their screen</button><button className="btn sm" onClick={() => { s.updateGroup(g.id, { status: 'ok', note: '' }); s.toast(`${g.name} marked as helped.`) }}>I helped them</button></div>
              </div>
            )) : <p className="small faint">Alerts appear when a group is wrong again after both hints, or sees the answer.</p>}
          </Glass>
          <Glass>
            <CardHead title="Teaching assistant" sub="Runs on the hub · uses only your class data"><Bot size={18} color="var(--violet)" /></CardHead>
            <div className="quick">{['Which groups are stuck?', 'Who is ready to move up?', 'What are the weakest skills?', 'Draft a mission'].map((q) => <button key={q} type="button" onClick={() => nav('/teacher/assistant', { state: { ask: q } })}>{q}</button>)}</div>
          </Glass>
          <Glass>
            <CardHead title="Waiting for you"><Link to="/teacher/approvals" className="small" style={{ color: 'var(--accent)', fontWeight: 600 }}>See all</Link></CardHead>
            {pend.length ? pend.map((r) => (
              <div key={r.id} className="between" style={{ padding: '8px 0', borderTop: '1px solid var(--glass-line)' }}>
                <div style={{ minWidth: 0 }}><b className="small">{r.title}</b><div className="tiny faint">{r.who} · {r.card.subject}: {r.card.concept}</div></div>
                <span className="pill violet"><Sparkles size={11} />AI draft</span>
              </div>
            )) : <p className="small faint">Nothing to approve.</p>}
          </Glass>
        </div>
      </div>

      <div className="grid g3">
        <Glass className="span2">
          <CardHead title="Practice this week" sub="Questions attempted per day, by subject">
            <div className="legend"><span><i style={{ background: t.river }} />Maths</span><span><i style={{ background: t.gold }} />English</span></div>
          </CardHead>
          <div style={{ height: 230 }}>
            <ResponsiveContainer>
              <BarChart data={DAYS} barGap={4}>
                <CartesianGrid vertical={false} stroke={t['glass-line']} />
                <XAxis dataKey="d" {...axis(t)} /><YAxis {...axis(t)} width={28} />
                <Tooltip content={<Tip />} cursor={{ fill: t.well }} />
                <RBar dataKey="Maths" fill={t.river} radius={[6, 6, 0, 0]} maxBarSize={26} />
                <RBar dataKey="English" fill={t.gold} radius={[6, 6, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Glass>
        <Glass>
          <CardHead title="How questions get solved" sub="This week, all groups" />
          <div style={{ height: 170 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={hintMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3} stroke="none">{hintMix.map((h) => <Cell key={h.name} fill={h.fill} />)}</Pie>
                <Tooltip content={<Tip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend" style={{ justifyContent: 'center' }}>{hintMix.map((h) => <span key={h.name}><i style={{ background: h.fill }} />{h.name} <b className="num">{h.value}</b></span>)}</div>
        </Glass>
      </div>

      <div className="grid split-main">
        <Glass>
          <CardHead title="Practice log" sub="Every try is saved on the hub, never online" />
          <div className="scroll-x">
            <table className="table">
              <thead><tr><th>Group</th><th>Question</th><th>Tries</th><th>Hints</th><th>Result</th><th>Checker explained</th><th>When</th></tr></thead>
              <tbody>{s.log.slice(0, 7).map((l, i) => <tr key={i}><td><b>{l.g}</b></td><td>{l.q}</td><td className="num">{l.tries}</td><td className="num">{l.hints}</td><td>{l.ok ? <span className="pill leaf">Solved</span> : <span className="pill warn">Answer shown</span>}</td><td>{l.explained ? 'Yes' : <span className="faint">No</span>}</td><td className="faint small">{l.t}</td></tr>)}</tbody>
            </table>
          </div>
        </Glass>
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="Mission this week"><Flag size={18} color="var(--gold)" /></CardHead>
            <b>{mission.title}</b>
            <p className="small faint" style={{ margin: '4px 0 10px' }}>From Bah Kynsai’s weave · {mission.tags.join(', ')}</p>
            <div className="row">{mission.assigned.map((id) => <span key={id} className="pill accent">{gs.find((g) => g.id === id).name}</span>)}<Link to="/teacher/missions" className="btn sm ghost">Manage</Link></div>
          </Glass>
          <Glass>
            <CardHead title="Coming up"><CalendarDays size={18} color="var(--river)" /></CardHead>
            <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
              <div className="neu" style={{ padding: '8px 12px', textAlign: 'center', borderRadius: 14 }}><div className="tiny faint">NOV</div><b style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>28</b></div>
              <div><b>Roots Day</b><p className="small faint">Bah Kynsai and Kong Iba visit. Children interview and record them.</p></div>
            </div>
          </Glass>
          <Glass>
            <CardHead title="Knowledge Dividends due"><Gift size={18} color="var(--accent)" /></CardHead>
            {dues.map((r) => <div key={r.id} className="between" style={{ padding: '6px 0' }}><span className="small"><b>{r.who}</b><br /><span className="faint">{r.dividend.item}</span></span><span className={`pill ${r.dividend.status === 'ready' ? 'leaf' : ''}`}>{r.dividend.status === 'ready' ? 'Ready' : 'Planned'}</span></div>)}
          </Glass>
        </div>
      </div>
    </>
  )
}
