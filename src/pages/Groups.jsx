import { Fragment, useMemo, useState } from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts'
import { GripVertical, Wand2, Lightbulb, Grid3x3, UsersRound } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS, SKILLS, MASTERY } from '../data'
import { Card, CardH, Hero, Seg, Tabs, Avatar, Modal, Note } from '../components/ui'
import { useTokens, Tip } from '../components/charts'

const LEVELS = ['Not yet', 'Starting', 'Getting there', 'Confident', 'Mastered']
const kidOf = (id) => STUDENTS.find((k) => k.id === id)

function Heatmap() {
  const s = useStore(); const t = useTokens()
  const [subj, setSubj] = useState('Maths'); const [sel, setSel] = useState('orchid-0'); const [grp, setGrp] = useState('all')
  const skills = SKILLS[subj]
  const kids = STUDENTS.filter((k) => grp === 'all' || s.groups.find((g) => g.id === grp)?.members.includes(k.id))
  const col = (v) => `color-mix(in srgb, var(--accent) ${[6, 22, 42, 66, 92][v]}%, transparent)`
  const avg = useMemo(() => skills.map((sk) => ({ sk, v: kids.reduce((a, k) => a + MASTERY[k.id][sk], 0) / Math.max(1, kids.length) })), [subj, grp, kids.length]) // eslint-disable-line react-hooks/exhaustive-deps
  const weakest = [...avg].sort((a, b) => a.v - b.v)[0]
  const child = kidOf(sel)
  const radar = skills.map((sk) => ({ skill: sk, Child: MASTERY[sel][sk], Class: +(STUDENTS.reduce((a, k) => a + MASTERY[k.id][sk], 0) / STUDENTS.length).toFixed(1) }))
  return (
    <div className="grid split">
      <Card data-tour="heat">
        <CardH title="Skills heatmap" sub="One square per child per skill, 0–4. Select a name to compare.">
          <Seg value={subj} onChange={setSubj} options={['Maths', 'English']} label="Subject" />
          <select className="select" style={{ width: 'auto', height: 36 }} value={grp} onChange={(e) => setGrp(e.target.value)} aria-label="Filter by group"><option value="all">All groups</option>{s.groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        </CardH>
        <div className="scroll-x">
          <div className="heat" style={{ gridTemplateColumns: `112px repeat(${skills.length}, minmax(38px,1fr))`, minWidth: 540 }}>
            <span />{skills.map((sk) => <span key={sk} className="cl">{sk}</span>)}
            {kids.map((k) => (
              <Fragment key={k.id}>
                <button type="button" className="rl" onClick={() => setSel(k.id)} style={{ color: sel === k.id ? 'var(--accent)' : undefined }}>{k.name}</button>
                {skills.map((sk) => { const v = MASTERY[k.id][sk]; return <span key={sk} className="c" title={`${k.name} · ${sk}: ${LEVELS[v]}`} style={{ background: col(v), color: v >= 3 ? 'var(--on-accent)' : 'var(--text)' }}>{v}</span> })}
              </Fragment>
            ))}
            <span className="rl t3 xs" style={{ marginTop: 6 }}>Class average</span>
            {avg.map((a) => <span key={a.sk} className="c xs" style={{ marginTop: 6, border: '1px solid var(--line-2)' }}>{a.v.toFixed(1)}</span>)}
          </div>
        </div>
        <div className="legend" style={{ marginTop: 14 }}>{LEVELS.map((l, i) => <span key={l}><i style={{ background: col(i), border: '1px solid var(--line)' }} />{i} {l}</span>)}</div>
        <div style={{ marginTop: 14 }}><Note icon={Lightbulb} tone="warn"><b className="b">{weakest.sk}</b> is the weakest {subj} skill ({weakest.v.toFixed(1)} of 4). Suggested: a hands-on activity with real village objects this week.</Note></div>
      </Card>
      <Card>
        <CardH title={child.name} sub={`${s.groups.find((g) => g.members.includes(sel))?.name} group · age ${child.age}`}><Avatar name={child.name} lg /></CardH>
        <div style={{ height: 250 }}>
          <ResponsiveContainer><RadarChart data={radar} outerRadius="70%">
            <PolarGrid stroke={t.line} /><PolarAngleAxis dataKey="skill" tick={{ fill: t['text-2'], fontSize: 10 }} />
            <Radar name="Class average" dataKey="Class" stroke={t['text-3']} fill={t['text-3']} fillOpacity={.1} />
            <Radar name={child.name} dataKey="Child" stroke={t.accent} fill={t.accent} fillOpacity={.28} />
            <Tooltip content={<Tip />} />
          </RadarChart></ResponsiveContainer>
        </div>
        <div className="legend"><span><i style={{ background: t.accent }} />{child.name}</span><span><i style={{ background: t['text-3'] }} />Class average</span></div>
        <hr className="hr" style={{ margin: '16px 0' }} />
        <div className="grid g2" style={{ gap: 10 }}>
          <div className="well" style={{ padding: 12 }}><span className="xs t3">Strongest</span><div className="b sm">{[...skills].sort((a, b) => MASTERY[sel][b] - MASTERY[sel][a])[0]}</div></div>
          <div className="well" style={{ padding: 12 }}><span className="xs t3">Needs practice</span><div className="b sm">{[...skills].sort((a, b) => MASTERY[sel][a] - MASTERY[sel][b])[0]}</div></div>
        </div>
        <p className="xs t3" style={{ marginTop: 12 }}>Levels guide grouping only. They are never shown to children as marks or ranks.</p>
      </Card>
    </div>
  )
}

function Builder() {
  const s = useStore()
  const [drag, setDrag] = useState(null); const [over, setOver] = useState(null); const [open, setOpen] = useState(false)
  const drop = (gid) => { if (drag) { const from = s.groups.find((g) => g.members.includes(drag)); if (from?.id !== gid) { s.moveStudent(drag, gid); s.toast(`${kidOf(drag).name} moved to ${s.groups.find((g) => g.id === gid).name}.`) } } setDrag(null); setOver(null) }
  const sugg = [{ id: 'bamboo-2', to: 'hornbill', why: 'Mastered patterns and multiplying; 9 of 10 solved without hints' }, { id: 'orchid-3', to: 'pine', why: 'Placement check: Word level in English; stronger there than in Maths' }]
  return (
    <Card>
      <CardH title="Group builder" sub="Drag a child to another group, or use the menu on each card. 3–4 children per tablet works best."><button className="btn primary" onClick={() => setOpen(true)}><Wand2 size={16} />Suggest from placement check</button></CardH>
      <div className="grid g3">
        {s.groups.map((g) => (
          <div key={g.id} className={`zone ${over === g.id ? 'over' : ''}`} onDragOver={(e) => { e.preventDefault(); setOver(g.id) }} onDragLeave={() => setOver(null)} onDrop={() => drop(g.id)}>
            <div className="between"><b>{g.name}</b><span className="tag">L{g.level} {g.subject}</span></div>
            {g.members.map((id) => (
              <div key={id} className="kid" draggable onDragStart={() => setDrag(id)} onDragEnd={() => { setDrag(null); setOver(null) }}>
                <GripVertical size={14} className="t3" /><Avatar name={kidOf(id).name} /><span style={{ flex: 1 }}>{kidOf(id).name}</span>
                <select aria-label={`Move ${kidOf(id).name}`} className="select" style={{ width: 'auto', height: 28, padding: '0 6px', fontSize: '.75rem', border: 0, background: 'transparent' }} value={g.id} onChange={(e) => { s.moveStudent(id, e.target.value); s.toast(`${kidOf(id).name} moved.`) }}>{s.groups.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
              </div>
            ))}
            <span className="xs" style={{ color: g.members.length > 4 || g.members.length < 3 ? 'var(--warn)' : 'var(--text-3)' }}>{g.members.length} children{g.members.length > 4 ? ' · too many for one tablet' : g.members.length < 3 ? ' · add one more' : ''}</span>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Suggested moves">
        <div className="stack">
          <p className="sm t2">From this week’s practice and the 10-question placement check (ASER-style levels). Nothing changes until you apply.</p>
          {sugg.map((x) => { const from = s.groups.find((g) => g.members.includes(x.id)); const to = s.groups.find((g) => g.id === x.to); return <div key={x.id} className="well" style={{ padding: 14, display: 'grid', gap: 6 }}><div className="row"><Avatar name={kidOf(x.id).name} /><b>{kidOf(x.id).name}</b><span className="mono xs t3">{from?.name} → {to.name}</span></div><span className="sm t2">{x.why}</span></div> })}
          <div className="row"><button className="btn primary" onClick={() => { sugg.forEach((x) => s.moveStudent(x.id, x.to)); setOpen(false); s.toast('Groups updated from the placement check.') }}>Apply both</button><button className="btn ghost" onClick={() => setOpen(false)}>Not now</button></div>
        </div>
      </Modal>
    </Card>
  )
}

export default function Groups() {
  const [tab, setTab] = useState('heat')
  return (
    <>
      <Hero eyebrow="Classroom · Groups & skills" title="Group by what children can do," emph="not by age." chips={<span className="t2">Teaching at the Right Level: short level checks, small-group practice, regroup every two weeks.</span>} />
      <div>
        <Tabs value={tab} onChange={setTab} items={[['heat', <><Grid3x3 size={15} />Skills heatmap</>], ['build', <><UsersRound size={15} />Group builder</>]]} />
        {tab === 'heat' ? <Heatmap /> : <Builder />}
      </div>
    </>
  )
}
