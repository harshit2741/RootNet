import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar as RBar, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Area, Line, AreaChart } from 'recharts'
import { TrendingUp, Target, Clock, Users, Gift, BookOpen, Copy, CheckCircle2, Circle, Wallet } from 'lucide-react'
import { useStore } from '../store'
import { ASER, TREND } from '../data'
import { Glass, CardHead, PageHead, Seg, Bar, Notice } from '../components/ui'
import { useTokens, Tip, axis } from '../components/charts'

const BUDGET = [
  ['Community adoption & training', 12000, 'accent'], ['UPS / solar power bank', 6000, 'gold'], ['2 refurbished tablets', 10000, 'river'],
  ['Printing (cards, passports)', 4000, 'leaf'], ['1 TB drive', 3500, 'violet'], ['Transport & logistics', 3500, 'ink-3'],
  ['Speaker + 2 mics', 3000, 'river'], ['Mission materials', 3000, 'leaf'], ['Contingency', 3000, 'ink-3'], ['Wi-Fi router', 2000, 'violet'],
]
const PHASES = [
  ['Months 1–2', 'Listen & capture', 'Map knowledge holders, agree consent rules, baseline test, train teachers and Digital Didis, first 30 records', 'done'],
  ['Months 3–4', 'Learn & make', 'Daily level-group practice, monthly Roots Day, weekly missions, passports', 'now'],
  ['Months 5–6', 'Return & improve', 'Deliver Knowledge Dividends, endline test, document, decide what to expand', 'next'],
]

export default function Impact() {
  const s = useStore(); const t = useTokens()
  const [subj, setSubj] = useState('Reading'); const [range, setRange] = useState('all')
  const data = range === 'all' ? TREND : TREND.slice(-4)
  const aser = ASER[subj]
  const moved = { Reading: 57, Maths: 62 }
  const recs = s.records
  const holders = new Set(recs.map((r) => r.who)).size
  const delivered = recs.filter((r) => r.dividend?.status === 'delivered').length
  const summary = `ROOTS pilot, week 8: ${moved.Reading}% of children moved up at least one reading level and ${moved.Maths}% in maths. Questions solved before opening a hint rose from 38% to 63%. Teachers saved about 4.5 hours a week. ${holders} knowledge holders shared ${recs.length} recordings; 24 lesson cards made; ${delivered} Knowledge Dividends given. Running cost: about ₹0 a year.`
  return (
    <>
      <PageHead eyebrow="For the School Management Committee" title="Pilot impact" lede="Are children learning more, and is the village taking part? Outcomes first, activity second. Week 8 of the 6-month pilot.">
        <Seg value={range} onChange={setRange} label="Time range" options={[['4', 'Last 4 weeks'], ['all', 'All 8 weeks']]} />
        <button className="btn" onClick={() => { try { navigator.clipboard.writeText(summary).catch(() => {}) } catch { /* blocked */ } s.toast('Summary copied for the SMC meeting.', 'river') }}><Copy size={16} />Copy summary</button>
      </PageHead>
      <div className="grid g4">
        {[[TrendingUp, 'leaf', 'Moved up ≥1 reading level', `${moved.Reading}%`, 'Baseline (June) vs now'], [Target, 'accent', 'Solved before a hint', '63%', 'from 38% in week 1'], [Clock, 'violet', 'Teacher time saved', '4.5 h/wk', 'Drafting, grouping, hints'], [Users, 'gold', 'Knowledge holders', holders, `${recs.length} recordings shared`]].map(([I, tone, k, v, d]) => (
          <Glass key={k} className="stat"><span className="k"><span className="ic" style={{ background: `var(--${tone}-soft)`, color: `var(--${tone})` }}><I size={17} /></span>{k}</span><span className="v num">{v}</span><span className="d faint">{d}</span></Glass>
        ))}
      </div>
      <div className="grid g2">
        <Glass>
          <CardHead title="Learning levels: start vs now" sub="Number of children at each ASER-style level (21 children)"><Seg value={subj} onChange={setSubj} options={['Reading', 'Maths']} label="Subject" /></CardHead>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={aser} barGap={3}>
                <CartesianGrid vertical={false} stroke={t['glass-line']} /><XAxis dataKey="level" {...axis(t)} interval={0} /><YAxis {...axis(t)} width={26} allowDecimals={false} />
                <Tooltip content={<Tip unit=" children" />} cursor={{ fill: t.well }} />
                <RBar name="June baseline" dataKey="base" fill={t['ink-3']} radius={[6, 6, 0, 0]} maxBarSize={28} />
                <RBar name="Now (week 8)" dataKey="now" fill={t.leaf} radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="legend"><span><i style={{ background: t['ink-3'] }} />June baseline</span><span><i style={{ background: t.leaf }} />Now</span><span className="faint">{moved[subj]}% moved up at least one level</span></div>
        </Glass>
        <Glass>
          <CardHead title="Thinking before asking" sub="% solved before opening a hint, and hints used per question" />
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <ComposedChart data={data}>
                <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.accent} stopOpacity=".3" /><stop offset="1" stopColor={t.accent} stopOpacity="0" /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke={t['glass-line']} /><XAxis dataKey="w" {...axis(t)} />
                <YAxis yAxisId="l" {...axis(t)} width={32} domain={[0, 100]} unit="%" /><YAxis yAxisId="r" orientation="right" {...axis(t)} width={30} domain={[0, 2.5]} />
                <Tooltip content={<Tip />} />
                <Area yAxisId="l" name="Solved before a hint (%)" type="monotone" dataKey="solved" stroke={t.accent} strokeWidth={2.5} fill="url(#ga)" dot={{ r: 3, fill: t.accent }} />
                <Line yAxisId="r" name="Hints per question" type="monotone" dataKey="hints" stroke={t.river} strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="legend"><span><i style={{ background: t.accent }} />Solved before a hint (left)</span><span><i style={{ background: t.river }} />Hints per question (right)</span></div>
        </Glass>
        <Glass>
          <CardHead title="The village as curriculum" sub="Lesson cards made and times children listened (running total)" />
          <div style={{ height: 230 }}>
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid vertical={false} stroke={t['glass-line']} /><XAxis dataKey="w" {...axis(t)} /><YAxis {...axis(t)} width={28} />
                <Tooltip content={<Tip />} />
                <Area name="Listens" type="monotone" dataKey="listens" stroke={t.gold} fill={t.gold} fillOpacity={.18} strokeWidth={2} />
                <Area name="Lesson cards" type="monotone" dataKey="cards" stroke={t.leaf} fill={t.leaf} fillOpacity={.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="legend"><span><i style={{ background: t.gold }} />Listens</span><span><i style={{ background: t.leaf }} />Lesson cards</span><span className="row" style={{ gap: 4 }}><Gift size={13} />{delivered} dividends given</span></div>
        </Glass>
        <Glass>
          <CardHead title="Teacher hours saved per week" sub="Self-reported by teachers each Friday" />
          <div style={{ height: 230 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid vertical={false} stroke={t['glass-line']} /><XAxis dataKey="w" {...axis(t)} /><YAxis {...axis(t)} width={28} unit="h" />
                <Tooltip content={<Tip unit=" h" />} cursor={{ fill: t.well }} />
                <RBar name="Hours saved" dataKey="hours" fill={t.violet} radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Glass>
      </div>
      <div className="grid split-wide">
        <Glass>
          <CardHead title="Pilot plan" sub="6 months · we are in month 3" />
          <div className="stack">
            {PHASES.map(([when, name, what, st]) => (
              <div key={name} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                {st === 'done' ? <CheckCircle2 size={22} color="var(--leaf)" style={{ flex: 'none' }} /> : <Circle size={22} color={st === 'now' ? 'var(--accent)' : 'var(--ink-3)'} style={{ flex: 'none' }} />}
                <div className="stack-sm" style={{ flex: 1 }}>
                  <div className="row"><b>{name}</b><span className="tiny faint">{when}</span>{st === 'now' && <span className="pill accent">Now</span>}</div>
                  <span className="small muted">{what}</span>
                  {st !== 'next' && <Bar value={st === 'done' ? 100 : 45} tone={st === 'now' ? 'accent' : ''} />}
                </div>
              </div>
            ))}
          </div>
          <div className="divider" style={{ margin: '14px 0' }} />
          <p className="small"><b>Who owns it after the pilot:</b> the School Management Committee owns the hub. Two trained Digital Didis/Dadas keep it running. The village controls consent and checks skills. The library keeps growing with every Roots Day.</p>
        </Glass>
        <Glass>
          <CardHead title="₹50,000 one-time budget" sub="Hardware under half; ₹12,000 for the community"><Wallet size={18} color="var(--gold)" /></CardHead>
          <div style={{ display: 'flex', height: 18, borderRadius: 9, overflow: 'hidden', marginBottom: 12 }}>{BUDGET.map(([n, v, c]) => <i key={n} title={`${n}: ₹${v.toLocaleString('en-IN')}`} style={{ width: `${v / 500}%`, background: `var(--${c})`, opacity: c === 'ink-3' ? .5 : 1 }} />)}</div>
          <div className="stack-sm">{BUDGET.map(([n, v, c]) => <div key={n} className="between small"><span className="row" style={{ gap: 8 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: `var(--${c})` }} />{n}</span><b className="num">₹{v.toLocaleString('en-IN')}</b></div>)}</div>
          <div className="divider" style={{ margin: '12px 0' }} />
          <div className="between"><b>Recurring cost per year</b><b className="num" style={{ color: 'var(--leaf)' }}>≈ ₹0</b></div>
          <p className="tiny faint">Apart from electricity and occasional mobile data. All software is open-source.</p>
        </Glass>
      </div>
      <Notice icon={BookOpen}>Sample numbers for the prototype. In the pilot, levels come from a short ASER-style test in June (baseline) and November (endline), run by teachers. Practice numbers come from the hub’s own log.</Notice>
    </>
  )
}
