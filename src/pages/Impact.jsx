import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Area, Line, AreaChart } from 'recharts'
import { TrendingUp, Target, Clock as ClockIc, Users, Gift, BookOpen, Copy, CheckCircle2, Circle, Wallet, Calculator, Headphones, IndianRupee, AlertTriangle, CalendarDays } from 'lucide-react'
import { useStore } from '../store'
import { ASER, TREND } from '../data'
import { Card, CardH, Hero, Clock, Kpi, Seg, Track, Banner, Feed, Note } from '../components/ui'
import { useTokens, Tip, axis } from '../components/charts'

const BUDGET = [['Community adoption & training', 12000, 'c1'], ['2 refurbished tablets', 10000, 'c2'], ['UPS / solar power bank', 6000, 'c4'], ['Printing', 4000, 'c3'], ['1 TB drive', 3500, 'c5'], ['Transport & logistics', 3500, 'text-3'], ['Speaker + 2 mics', 3000, 'c2'], ['Mission materials', 3000, 'c1'], ['Contingency', 3000, 'text-3'], ['Wi-Fi router', 2000, 'c3']]
const PHASES = [['Months 1–2', 'Listen & capture', 'Consent rules, baseline test, training, first 30 records', 'done'], ['Months 3–4', 'Learn & make', 'Daily level groups, monthly Roots Day, weekly missions', 'now'], ['Months 5–6', 'Return & improve', 'Dividends, endline test, decide what to expand', 'next']]

export default function Impact() {
  const s = useStore(); const t = useTokens()
  const [subj, setSubj] = useState('Reading'); const [range, setRange] = useState('all')
  const data = range === 'all' ? TREND : TREND.slice(-4)
  const holders = new Set(s.records.map((r) => r.who)).size
  const delivered = s.records.filter((r) => r.dividend?.status === 'delivered').length
  const summary = `ROOTS pilot, week 8: 57% of children moved up at least one reading level and 62% in maths. Questions solved before a hint rose from 38% to 63%. Teachers saved about 4.5 hours a week. ${holders} knowledge holders shared ${s.records.length} recordings; 24 lesson cards; ${delivered} Knowledge Dividends given. Running cost about ₹0 a year.`
  return (
    <>
      <Hero eyebrow="Programme · Pilot impact" title="Week 8 of 26." emph="Children are climbing levels."
        chips={<><span className="chip acc"><i className="dot" />Month 3 · Learn & make</span><span className="chip">₹50,000 one-time · ≈ ₹0 / year</span><Seg value={range} onChange={setRange} label="Range" options={[['4', 'Last 4 weeks'], ['all', 'All 8 weeks']]} /><button className="btn small" onClick={() => { navigator.clipboard?.writeText(summary).catch(() => {}); s.toast('Summary copied for the committee meeting.', 'river') }}><Copy size={14} />Copy summary</button></>}
        right={<Clock label="IST · PILOT LIVE" />} />
      <Banner items={[
        { tone: 'ok', icon: TrendingUp, title: 'Reading: 9 children moved up at least one level since June', sub: 'Biggest shift from Letter to Word level · ASER-style check by teachers' },
        { tone: 'warn', icon: AlertTriangle, title: 'Division is still the weakest maths skill', sub: 'Class average 0.9 of 4 · hands-on sharing mission planned for next week' },
        { tone: 'info', icon: CalendarDays, title: 'Endline test due in Month 6', sub: 'Same ASER-style tool as the June baseline, run by teachers' },
      ]} />
      <div className="kpis" data-tour="kpis">
        <Kpi label="Moved up a reading level" icon={TrendingUp} k="var(--c1)" value="57" unit="%" meta={<>Target <b>60%</b> by Month 6</>} track={{ value: 57, target: 60 }} />
        <Kpi label="Moved up a maths level" icon={Calculator} k="var(--c2)" value="62" unit="%" meta={<>Target <b>60%</b> · ahead of plan</>} track={{ value: 62, target: 60 }} />
        <Kpi label="Solved before a hint" icon={Target} k="var(--c3)" value="63" unit="%" meta={<span className="delta up">▲ from 38% in week 1</span>} spark={{ data, dataKey: 'solved', k: 'c3' }} />
        <Kpi label="Teacher time saved" icon={ClockIc} k="var(--c4)" value="4.5" unit="h/wk" meta={<>Target band <b>4–6 h</b></>} spark={{ data, dataKey: 'hours', k: 'c4' }} />
        <Kpi label="Knowledge holders" icon={Users} k="var(--c2)" value={holders} of="10" meta={<><b>{s.records.length}</b> recordings · 3 roles</>} track={{ value: holders, max: 10, target: 8 }} />
        <Kpi label="Lesson cards made" icon={BookOpen} k="var(--c1)" value="24" of="30" meta={<>Target <b>30</b> by Month 6</>} track={{ value: 24, max: 30, target: 30 }} />
        <Kpi label="Times children listened" icon={Headphones} k="var(--c4)" value="72" meta={<span className="delta up">▲ 11 this week</span>} spark={{ data, dataKey: 'listens', k: 'c4' }} />
        <Kpi label="Budget used" icon={IndianRupee} k="var(--c3)" value="₹46.8" of="50 k" meta={<>Community <b>₹12k</b> (≥ ₹10k required)</>} track={{ value: 46.8, max: 50, target: 50 }} />
      </div>
      <Feed items={[{ k: 'ok', t: 'W8', a: 'Reading', b: 'Badaphira moved Word → Paragraph' }, { k: 'acc', t: 'W8', a: 'Village', b: 'Kong Bandarisha joined as 6th knowledge holder' }, { k: 'info', t: 'W8', a: 'Teachers', b: '4.5 hours saved · self-reported Friday' }, { k: 'warn', t: 'W8', a: 'Maths', b: 'Division mission scheduled for Orchid group' }, { k: 'c3', t: 'W7', a: 'Dividend', b: 'Price card given to Kong Rida' }]} />
      <div className="grid g2" data-tour="charts">
        <Card>
          <CardH title="Learning levels: June vs now" sub="Children at each ASER-style level (21 children)"><Seg value={subj} onChange={setSubj} options={['Reading', 'Maths']} label="Subject" /></CardH>
          <div style={{ height: 260 }}><ResponsiveContainer><BarChart data={ASER[subj]} barGap={3}><CartesianGrid vertical={false} stroke={t.line} /><XAxis dataKey="level" {...axis(t)} interval={0} /><YAxis {...axis(t)} width={24} allowDecimals={false} /><Tooltip content={<Tip unit=" children" />} cursor={{ fill: t['surface-2'] }} /><Bar name="June" dataKey="base" fill={t['text-3']} radius={[6, 6, 0, 0]} maxBarSize={24} /><Bar name="Now" dataKey="now" fill={t.accent} radius={[6, 6, 0, 0]} maxBarSize={24} /></BarChart></ResponsiveContainer></div>
          <div className="legend"><span><i style={{ background: t['text-3'] }} />June baseline</span><span><i style={{ background: t.accent }} />Now (week 8)</span></div>
        </Card>
        <Card>
          <CardH title="Thinking before asking" sub="% solved before a hint (left) and hints per question (right)" />
          <div style={{ height: 260 }}><ResponsiveContainer><ComposedChart data={data}><defs><linearGradient id="ia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.accent} stopOpacity=".3" /><stop offset="1" stopColor={t.accent} stopOpacity="0" /></linearGradient></defs><CartesianGrid vertical={false} stroke={t.line} /><XAxis dataKey="w" {...axis(t)} /><YAxis yAxisId="l" {...axis(t)} width={34} domain={[0, 100]} unit="%" /><YAxis yAxisId="r" orientation="right" {...axis(t)} width={28} domain={[0, 2.5]} /><Tooltip content={<Tip />} /><Area yAxisId="l" name="Solved before a hint (%)" type="monotone" dataKey="solved" stroke={t.accent} strokeWidth={2.5} fill="url(#ia)" dot={{ r: 3, fill: t.accent }} isAnimationActive={false} /><Line yAxisId="r" name="Hints per question" type="monotone" dataKey="hints" stroke={t.c2} strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} /></ComposedChart></ResponsiveContainer></div>
          <div className="legend"><span><i style={{ background: t.accent }} />Solved before a hint</span><span><i style={{ background: t.c2 }} />Hints per question</span></div>
        </Card>
        <Card>
          <CardH title="The village as curriculum" sub="Running totals: lesson cards and listens" />
          <div style={{ height: 230 }}><ResponsiveContainer><AreaChart data={data}><CartesianGrid vertical={false} stroke={t.line} /><XAxis dataKey="w" {...axis(t)} /><YAxis {...axis(t)} width={26} /><Tooltip content={<Tip />} /><Area name="Listens" type="monotone" dataKey="listens" stroke={t.c4} fill={t.c4} fillOpacity={.14} strokeWidth={2} isAnimationActive={false} /><Area name="Lesson cards" type="monotone" dataKey="cards" stroke={t.c1} fill={t.c1} fillOpacity={.2} strokeWidth={2} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
          <div className="legend"><span><i style={{ background: t.c4 }} />Listens</span><span><i style={{ background: t.c1 }} />Lesson cards</span><span className="row" style={{ gap: 5 }}><Gift size={13} />{delivered} dividends given</span></div>
        </Card>
        <Card>
          <CardH title="₹50,000 one-time budget" sub="Hardware under half · ₹12,000 for the community"><Wallet size={18} color="var(--accent)" /></CardH>
          <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2, marginBottom: 14 }}>{BUDGET.map(([n, v, c]) => <i key={n} title={`${n}: ₹${v.toLocaleString('en-IN')}`} style={{ width: `${v / 500}%`, background: `var(--${c})` }} />)}</div>
          <div className="grid g2" style={{ gap: '6px 20px' }}>{BUDGET.map(([n, v, c]) => <div key={n} className="between sm" style={{ flexWrap: 'nowrap' }}><span className="row t2" style={{ gap: 8, flexWrap: 'nowrap' }}><i style={{ width: 8, height: 8, borderRadius: 2, background: `var(--${c})`, flex: 'none' }} />{n}</span><b className="mono xs">₹{v.toLocaleString('en-IN')}</b></div>)}</div>
          <hr className="hr" style={{ margin: '14px 0' }} />
          <div className="between"><b>Recurring cost per year</b><b className="mono" style={{ color: 'var(--ok)' }}>≈ ₹0</b></div>
        </Card>
      </div>
      <Card>
        <CardH title="Pilot plan and ownership" sub="6 months · the School Management Committee owns the hub after the pilot" />
        <div className="grid g3">{PHASES.map(([w, n, d, st]) => (
          <div key={n} className="well" style={{ padding: 16, display: 'grid', gap: 8, borderColor: st === 'now' ? 'var(--accent)' : undefined }}>
            <div className="between"><span className="row" style={{ gap: 8 }}>{st === 'done' ? <CheckCircle2 size={18} color="var(--ok)" /> : <Circle size={18} color={st === 'now' ? 'var(--accent)' : 'var(--text-3)'} />}<b>{n}</b></span><span className="mono xs t3">{w}</span></div>
            <span className="sm t2">{d}</span>
            <Track value={st === 'done' ? 100 : st === 'now' ? 45 : 0} />
          </div>))}</div>
      </Card>
      <Note>Illustrative numbers. In the pilot, levels come from a short ASER-style test run by teachers in June and again at the end; practice numbers come from the hub’s own log.</Note>
    </>
  )
}
