import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Star, Check, Lock, Play, BookOpen, Flag, Puzzle, Headphones, MessageCircleHeart, Gift, Medal, Sprout } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS, PATH, BADGES } from '../data'
import { Card, CardH, Hero, Avatar, Track } from '../components/ui'
import { WORD_OF_DAY } from '../i18n'
import { BOARD_TODAY } from '../content'
import { speak } from '../speak'
import Mascot from '../components/Mascot'
import { Trophy, Volume2, Clapperboard, BookHeart } from 'lucide-react'

const OFFS = [0, 70, 100, 60, -10, -70]

export function GroupSelect() {
  const { groups, activeGroup, setActiveGroup } = useStore()
  return (
    <label className="chip" style={{ paddingRight: 6 }}>
      <span style={{ opacity: .8 }}>On this tablet</span>
      <select value={activeGroup} onChange={(e) => setActiveGroup(e.target.value)} aria-label="Which group is using this tablet?" style={{ border: 0, background: 'transparent', fontWeight: 800, cursor: 'pointer', outline: 'none', color: 'inherit' }}>
        {groups.map((g) => <option key={g.id} value={g.id}>{g.name} · L{g.level} {g.subject}</option>)}
      </select>
    </label>
  )
}

function GoalRing({ value, max }) {
  const r = 34, c = 2 * Math.PI * r
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 4 }} className="hide-m">
      <svg width="92" height="92" viewBox="0 0 92 92" role="img" aria-label={`Daily goal ${value} of ${max}`}>
        <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="10" />
        <motion.circle cx="46" cy="46" r={r} fill="none" stroke="#FFE27A" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / max) }} transition={{ duration: 1 }} transform="rotate(-90 46 46)" />
        <text x="46" y="44" textAnchor="middle" style={{ font: '800 20px var(--display)', fill: '#fff' }}>{value}/{max}</text>
        <text x="46" y="60" textAnchor="middle" style={{ font: '800 9px var(--sans)', fill: 'rgba(255,255,255,.8)', letterSpacing: '.08em' }}>DAILY GOAL</text>
      </svg>
    </div>
  )
}

function VillageTree({ leaves, goal }) {
  const spots = useMemo(() => { const out = []; let s = 11; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280); for (let k = 0; k < 44; k++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); out.push([100 + Math.cos(a) * d * 70, 78 + Math.sin(a) * d * 52, 7 + r() * 4]) } return out }, [])
  const filled = Math.round((leaves / goal) * spots.length)
  return (
    <svg viewBox="0 0 200 180" style={{ width: '100%', maxHeight: 210 }} role="img" aria-label={`Village Tree: ${leaves} of ${goal} leaves`}>
      <ellipse cx="100" cy="168" rx="70" ry="8" fill="var(--surface-2)" />
      <path d="M92 168 C94 140 90 122 96 104 L104 104 C110 122 106 140 108 168 Z" fill="#8A5A2B" />
      <path d="M98 120 C86 110 80 100 70 96 M102 116 C114 106 120 98 132 94" stroke="#8A5A2B" strokeWidth="5" strokeLinecap="round" fill="none" />
      {spots.map(([x, y, r], k) => <motion.circle key={k} cx={x} cy={y} r={r} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: k * .015 }}
        fill={k < filled ? ['#22B573', '#16A34A', '#4ADE80', '#15803D'][k % 4] : 'transparent'} stroke={k < filled ? 'none' : 'var(--line-2)'} strokeWidth="1.5" strokeDasharray={k < filled ? undefined : '2 2'} />)}
      {[[70, 70], [128, 64], [104, 40]].map(([x, y], k) => <circle key={'f' + k} cx={x} cy={y} r="6" fill={k === 0 ? '#FFAE1A' : 'var(--surface)'} stroke="#FFAE1A" strokeWidth="2" />)}
    </svg>
  )
}

export default function StudentHome() {
  const s = useStore(); const nav = useNavigate()
  const g = s.groups.find((x) => x.id === s.activeGroup)
  const kids = g.members.map((id) => STUDENTS.find((k) => k.id === id))
  const solvedToday = s.log.filter((l) => l.g === g.name && l.t === 'just now' && l.ok).length
  const leaves = 100 + s.groups.reduce((a, x) => a + x.done, 0)
  const quests = [
    { icon: Puzzle, c: 'var(--c3)', t: 'Crack 3 pattern puzzles', v: Math.min(3, 1 + solvedToday), m: 3, to: '/student/practice' },
    { icon: Headphones, c: 'var(--c4)', t: 'Listen to a Village Voice', v: 0, m: 1, to: '/student/library' },
    { icon: MessageCircleHeart, c: 'var(--c5)', t: 'Explain an answer as Checker', v: 1, m: 1, to: '/student/practice' },
  ]
  const qDone = quests.filter((q) => q.v >= q.m).length
  const roles = ['Reader', 'Solver', 'Checker', 'Helper']
  return (
    <>
      <Hero eyebrow={`Learning space · ${g.name} group`} title={`Khublei, ${g.name} team!`} emph="Ready for today’s quest?" mood="wave"
        say={`Khublei, ${g.name} team! Ready for today's quest? Crack three pattern puzzles, listen to a village voice, and explain an answer.`}
        chips={<><GroupSelect /><span className="chip"><Flame size={15} />{g.streak}-day streak</span><span className="chip"><Star size={15} />{s.xp.toLocaleString('en-IN')} stars</span><span className="chip acc">Level {g.level} {g.subject}</span></>}
        right={<GoalRing value={qDone} max={3} />} />

      <div className="grid split-7-5">
        <Card data-tour="path">
          <CardH title="Unit 4 · Patterns in our village" sub="Green: done · Gold: village lesson · Purple: start here"><span className="tag acc">2 of 6 done</span></CardH>
          <div className="path">
            {PATH.map((n, i) => {
              const Icon = n.kind === 'done' ? Check : n.kind === 'village' ? BookOpen : n.kind === 'current' ? Play : n.id.startsWith('m') ? Flag : Lock
              return (
                <motion.div key={n.id} className="node-wrap" style={{ transform: `translateX(${OFFS[i]}px)` }} initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .07, type: 'spring' }}>
                  <button type="button" className={`node ${n.kind}`} disabled={n.kind === 'locked'} aria-label={`${n.label}${n.kind === 'locked' ? ' (locked)' : ''}`} onClick={() => nav(n.kind === 'village' ? '/student/library' : '/student/practice')}>
                    {n.kind === 'current' && <span className="ring" />}<Icon />
                  </button>
                  <span className="node-label">{n.label}{n.kind === 'current' && <><br /><span className="tag acc" style={{ marginTop: 6 }}>Start here</span></>}</span>
                </motion.div>
              )
            })}
          </div>
        </Card>

        <div className="stack">
          <Card data-tour="quest">
            <CardH title="Today’s quests" sub={`${qDone} of 3 complete`} />
            <div className="stack-s">
              {quests.map((q) => (
                <Link key={q.t} to={q.to} className="quest" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="qi" style={{ background: `color-mix(in srgb, ${q.c} 18%, transparent)`, color: q.c }}><q.icon size={20} /></span>
                  <div style={{ flex: 1 }}><b className="sm">{q.t}</b><div style={{ marginTop: 6 }}><Track value={q.v} max={q.m} k={q.c} /></div></div>
                  <span className="mono">{q.v >= q.m ? <Check size={20} color="var(--ok)" /> : `${q.v}/${q.m}`}</span>
                </Link>
              ))}
              <div className="well row" style={{ padding: 12, flexWrap: 'nowrap', gap: 12, background: 'color-mix(in srgb,var(--c4) 14%,transparent)', borderColor: 'color-mix(in srgb,var(--c4) 40%,transparent)' }}>
                <motion.span animate={{ rotate: [0, -8, 8, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 2 }} style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--c4)', color: '#3A2400', flex: 'none' }}><Gift size={22} /></motion.span>
                <span className="sm"><b className="b">Treasure chest:</b> finish all 3 to unlock the <b className="b">Weaver sticker</b> for your group.</span>
              </div>
            </div>
          </Card>

          <Card data-tour="tree">
            <CardH title="Our Village Tree" sub="The whole class grows it together. No rankings."><span className="tag ok"><Sprout size={12} />{leaves} / 200 leaves</span></CardH>
            <VillageTree leaves={leaves} goal={200} />
            <p className="sm t2" style={{ textAlign: 'center' }}>Every question solved adds a leaf. At 200 leaves, the class unlocks a <b className="b">Roots Day surprise</b>.</p>
          </Card>
        </div>
      </div>

      <div className="grid g3">
        <Card style={{ background: 'linear-gradient(135deg, color-mix(in srgb,var(--c4) 22%,var(--surface)), var(--surface))' }}>
          <CardH title="Khasi word of the day" sub="Ka Ktien Khasi" />
          {(() => { const w = WORD_OF_DAY[new Date().getDate() % WORD_OF_DAY.length]; return (
            <div className="stack-s">
              <div className="row"><b className="mono" style={{ fontSize: '2.2rem', color: 'var(--p)' }}>{w.kh}</b><span className="t2">= {w.en}</span></div>
              <span className="sm t2">“{w.use}”</span>
              <button className="btn small" style={{ justifySelf: 'start' }} onClick={() => speak(`${w.kh}. ${w.en}. ${w.use}`, null, 'buddy')}><Volume2 size={14} />Hear it</button>
            </div>) })()}
        </Card>
        <Card style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Mascot size={92} mood="wave" />
          <div className="stack-s"><b>Buddy’s Class is open!</b><span className="sm t2">Today: count to 10 in Khasi, in 3 minutes.</span><Link to="/student/class" className="btn small primary" style={{ justifySelf: 'start' }}><Clapperboard size={14} />Start lesson</Link></div>
        </Card>
        <Card>
          <CardH title="Group League" sub="Today’s standing"><Trophy size={22} color="var(--c4)" /></CardH>
          {(() => { const rows = [...BOARD_TODAY].sort((a, b) => b.pts - a.pts); const k = rows.findIndex((r) => r.g === g.id); return (
            <div className="stack-s"><div className="row"><b className="mono" style={{ fontSize: '2.2rem' }}>#{k + 1}</b><span className="t2">of {rows.length} groups · {rows[k].pts} pts</span></div>
              <div className="row" style={{ gap: 8 }}><Link to="/student/leaderboard" className="btn small"><Trophy size={14} />See the league</Link><Link to="/student/stories" className="btn small"><BookHeart size={14} />Story +5 pts</Link></div></div>) })()}
        </Card>
      </div>

      <div className="grid g2">
        <Card>
          <CardH title="Today’s team" sub="Roles move one place after every question" />
          <div className="grid g2" style={{ gap: 10 }}>{kids.map((k, i) => { const r = roles[(i + g.rot) % kids.length]; return <div key={k.id} className="well row" style={{ padding: 10, flexWrap: 'nowrap' }}><Avatar name={k.name} /><div><b className="sm">{k.name}</b><div className="xs" style={{ color: 'var(--p)', fontWeight: 800 }}>{r}</div></div></div> })}</div>
        </Card>
        <Card>
          <CardH title="Badges" sub="Earned by trying and explaining" />
          <div className="grid g3" style={{ gap: 12 }}>
            {BADGES.map((b, i) => (
              <div key={b.id} title={b.desc} style={{ display: 'grid', justifyItems: 'center', gap: 6, textAlign: 'center', opacity: b.got ? 1 : .35, filter: b.got ? 'none' : 'grayscale(1)' }}>
                <span className="medal" style={{ background: ['var(--c5)', 'var(--c4)', 'var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c6)'][i] }}><Medal size={26} /></span>
                <span className="xs" style={{ fontWeight: 800 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
