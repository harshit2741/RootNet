import { Fragment, useMemo, useState } from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts'
import { GripVertical, Wand2, Lightbulb, Info } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS, SKILLS, MASTERY } from '../data'
import { Glass, CardHead, PageHead, Seg, Avatar, Modal, Notice } from '../components/ui'
import { useTokens, Tip } from '../components/charts'

const LEVELS = ['Not yet', 'Starting', 'Getting there', 'Confident', 'Mastered']

function Builder() {
  const s = useStore()
  const [drag, setDrag] = useState(null); const [over, setOver] = useState(null); const [open, setOpen] = useState(false)
  const kid = (id) => STUDENTS.find((k) => k.id === id)
  const drop = (gid) => { if (drag) { const from = s.groups.find((g) => g.members.includes(drag)); if (from?.id !== gid) { s.moveStudent(drag, gid); s.toast(`${kid(drag).name} moved to ${s.groups.find((g) => g.id === gid).name}.`) } } setDrag(null); setOver(null) }
  const suggestions = [
    { id: 'bamboo-2', to: 'hornbill', why: 'Mastered patterns and multiplication; solved 9 of 10 without hints' },
    { id: 'orchid-3', to: 'pine', why: 'Stronger in English than Maths right now; placement check: Word level' },
  ]
  return (
    <>
      <Glass>
        <CardHead title="Group builder" sub="Drag a child to another group. Groups of 3–4 work best on one tablet.">
          <button className="btn sm primary" onClick={() => setOpen(true)}><Wand2 size={15} />Suggest from placement check</button>
        </CardHead>
        <div className="grid g3" style={{ gap: 12 }}>
          {s.groups.map((g) => (
            <div key={g.id} className={`well dropzone ${over === g.id ? 'over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setOver(g.id) }} onDragLeave={() => setOver(null)} onDrop={() => drop(g.id)}>
              <div className="between"><b style={{ fontFamily: 'var(--font-display)' }}>{g.name}</b><span className="pill">L{g.level} {g.subject}</span></div>
              {g.members.map((id) => (
                <div key={id} className="kid" draggable onDragStart={() => setDrag(id)} onDragEnd={() => { setDrag(null); setOver(null) }}>
                  <GripVertical size={14} className="faint" /><Avatar name={kid(id).name} /><span style={{ flex: 1 }}>{kid(id).name}</span>
                  <label className="sr-only" htmlFor={`mv-${id}`}>Move {kid(id).name} to</label>
                  <select id={`mv-${id}`} className="select" style={{ width: 'auto', padding: '4px 8px', fontSize: '.75rem', boxShadow: 'none', background: 'transparent' }} value={g.id} onChange={(e) => { s.moveStudent(id, e.target.value); s.toast(`${kid(id).name} moved.`) }}>
                    {s.groups.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                </div>
              ))}
              <span className={`tiny ${g.members.length > 4 || g.members.length < 3 ? '' : 'faint'}`} style={{ color: g.members.length > 4 || g.members.length < 3 ? 'var(--warn)' : undefined }}>{g.members.length} children{g.members.length > 4 ? ' · too many for one tablet' : g.members.length < 3 ? ' · add one more' : ''}</span>
            </div>
          ))}
        </div>
      </Glass>
      <Modal open={open} onClose={() => setOpen(false)} title="Suggestions from the placement check">
        <div className="stack">
          <p className="small muted">Based on this week’s practice and a 10-question placement check (ASER-style levels). You decide; nothing moves until you apply it.</p>
          {suggestions.map((x) => { const k = kid(x.id); const from = s.groups.find((g) => g.members.includes(x.id)); const to = s.groups.find((g) => g.id === x.to); return (
            <div key={x.id} className="well" style={{ padding: 12, display: 'grid', gap: 6 }}>
              <div className="row"><Avatar name={k.name} /><b>{k.name}</b><span className="small faint">{from?.name} → {to.name}</span></div>
              <span className="small">{x.why}</span>
            </div>) })}
          <div className="row"><button className="btn primary" onClick={() => { suggestions.forEach((x) => s.moveStudent(x.id, x.to)); setOpen(false); s.toast('Groups updated from the placement check.') }}>Apply both</button><button className="btn ghost" onClick={() => setOpen(false)}>Not now</button></div>
        </div>
      </Modal>
    </>
  )
}

function Heatmap() {
  const s = useStore(); const t = useTokens()
  const [subj, setSubj] = useState('Maths'); const [sel, setSel] = useState('orchid-0'); const [grp, setGrp] = useState('all')
  const skills = SKILLS[subj]
  const kids = STUDENTS.filter((k) => grp === 'all' || s.groups.find((g) => g.id === grp)?.members.includes(k.id))
  const col = (v) => [`color-mix(in srgb, var(--accent) 55%, transparent)`, `color-mix(in srgb, var(--warn) 45%, transparent)`, `color-mix(in srgb, var(--gold) 45%, transparent)`, `color-mix(in srgb, var(--leaf) 45%, transparent)`, `var(--leaf)`][v]
  const avg = useMemo(() => skills.map((sk) => ({ sk, v: kids.reduce((a, k) => a + MASTERY[k.id][sk], 0) / Math.max(1, kids.length) })), [subj, grp, kids.length])
  const weakest = [...avg].sort((a, b) => a.v - b.v)[0]
  const child = STUDENTS.find((k) => k.id === sel)
  const radar = skills.map((sk) => ({ skill: sk, Child: MASTERY[sel][sk], Class: +(STUDENTS.reduce((a, k) => a + MASTERY[k.id][sk], 0) / STUDENTS.length).toFixed(1) }))
  return (
    <div className="grid split">
      <Glass>
        <CardHead title="Skills heatmap" sub="Each square is one child and one skill. Click a name to see that child.">
          <Seg value={subj} onChange={setSubj} options={['Maths', 'English']} label="Subject" />
          <select className="select" style={{ width: 'auto' }} value={grp} onChange={(e) => setGrp(e.target.value)} aria-label="Filter by group"><option value="all">All groups</option>{s.groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
        </CardHead>
        <div className="scroll-x">
          <div className="heat" style={{ gridTemplateColumns: `110px repeat(${skills.length}, minmax(34px,1fr))`, minWidth: 520 }}>
            <span />
            {skills.map((sk) => <span key={sk} className="col tiny">{sk}</span>)}
            {kids.map((k) => (
              <Fragment key={k.id}>
                <button key={k.id + 'n'} type="button" className="lab" onClick={() => setSel(k.id)} style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 0, color: sel === k.id ? 'var(--accent)' : undefined, textAlign: 'left' }}>{k.name}</button>
                {skills.map((sk) => { const v = MASTERY[k.id][sk]; return <span key={k.id + sk} className="cell num" title={`${k.name} · ${sk}: ${LEVELS[v]}`} style={{ background: col(v), color: v >= 4 ? '#fff' : 'var(--ink)' }}>{v}</span> })}
              </Fragment>
            ))}
            <span className="lab tiny faint" style={{ marginTop: 6 }}>Class average</span>
            {avg.map((a) => <span key={a.sk} className="cell num tiny" style={{ background: 'var(--well)', marginTop: 6 }}>{a.v.toFixed(1)}</span>)}
          </div>
        </div>
        <div className="legend" style={{ marginTop: 12 }}>{LEVELS.map((l, i) => <span key={l}><i style={{ background: col(i) }} />{i} {l}</span>)}</div>
        <div style={{ marginTop: 12 }}><Notice icon={Lightbulb} tone="gold"><b>{weakest.sk}</b> is the class’s weakest {subj} skill (average {weakest.v.toFixed(1)} of 4). Next mission idea: a hands-on activity with real objects from the village.</Notice></div>
      </Glass>
      <Glass>
        <CardHead title={child.name} sub={`${s.groups.find((g) => g.members.includes(sel))?.name} group · age ${child.age}`}><Avatar name={child.name} size="lg" /></CardHead>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <RadarChart data={radar} outerRadius="70%">
              <PolarGrid stroke={t['glass-line']} />
              <PolarAngleAxis dataKey="skill" tick={{ fill: t['ink-2'], fontSize: 10 }} />
              <Radar name="Class average" dataKey="Class" stroke={t['ink-3']} fill={t['ink-3']} fillOpacity={.12} />
              <Radar name={child.name} dataKey="Child" stroke={t.accent} fill={t.accent} fillOpacity={.3} />
              <Tooltip content={<Tip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="legend"><span><i style={{ background: t.accent }} />{child.name}</span><span><i style={{ background: t['ink-3'] }} />Class average</span></div>
        <div className="divider" style={{ margin: '12px 0' }} />
        <p className="small"><b>Strongest:</b> {[...skills].sort((a, b) => MASTERY[sel][b] - MASTERY[sel][a])[0]}<br /><b>Needs practice:</b> {[...skills].sort((a, b) => MASTERY[sel][a] - MASTERY[sel][b])[0]}</p>
        <p className="tiny faint" style={{ marginTop: 8 }}>Levels come from practice on the hub and the teacher’s own checks. They guide grouping; they are never shown as marks or ranks to children.</p>
      </Glass>
    </div>
  )
}

export default function Groups() {
  const [tab, setTab] = useState('heat')
  return (
    <>
      <PageHead eyebrow="Teacher" title="Groups & skills" lede="See where every child is, skill by skill, and regroup them by level. Children are grouped by what they can do, not by age.">
        <Seg value={tab} onChange={setTab} label="View" options={[['heat', 'Skills heatmap'], ['build', 'Group builder']]} />
      </PageHead>
      {tab === 'heat' ? <Heatmap /> : <Builder />}
      <Notice icon={Info}>Grouping follows the Teaching at the Right Level approach: short level checks, then practice in small groups at that level, with regrouping every two weeks.</Notice>
    </>
  )
}
