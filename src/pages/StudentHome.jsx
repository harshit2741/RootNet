import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Star, Award, Check, Lock, Sparkles, BookOpen, Flag, Play, MessagesSquare, Medal, Target } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS, PATH, BADGES } from '../data'
import { Glass, CardHead, Avatar, Ring, Art, Bar } from '../components/ui'
import Mascot from '../components/Mascot'

const OFFS = [0, 64, 92, 56, -8, -64]

export function GroupPicker() {
  const { groups, activeGroup, setActiveGroup } = useStore()
  return (
    <div className="row" role="group" aria-label="Which group is using this tablet?">
      <span className="small faint">On this tablet:</span>
      {groups.map((g) => (
        <button key={g.id} type="button" className="btn sm" aria-pressed={g.id === activeGroup} onClick={() => setActiveGroup(g.id)}>{g.name}<span className="faint tiny">L{g.level} {g.subject}</span></button>
      ))}
    </div>
  )
}

export default function StudentHome() {
  const s = useStore(); const nav = useNavigate()
  const g = s.groups.find((x) => x.id === s.activeGroup)
  const kids = g.members.map((id) => STUDENTS.find((k) => k.id === id))
  const stamps = s.passport.filter((p) => p.team === g.name)
  const card = s.records.find((r) => r.id === 'r1')
  const hour = 10
  const greet = hour < 12 ? 'Good morning' : 'Good afternoon'
  const questDone = Math.min(3, 1 + s.log.filter((l) => l.g === g.name && l.t === 'just now' && l.ok).length)
  return (
    <>
      <GroupPicker />
      <Glass strong className="pad-lg">
        <div className="hero-grid">
          <Mascot size={118} mood="cheer" />
          <div className="stack-sm">
            <p className="eyebrow">{greet}, {g.name} group</p>
            <h1>Today’s quest: crack 3 pattern puzzles</h1>
            <p className="muted">You’re on Level {g.level} {g.subject}. Remember: try first, then I’ll help.</p>
            <div className="row" style={{ marginTop: 6 }}>
              <Link to="/student/practice" className="btn primary"><Sparkles size={17} />Practise with Buddy</Link>
              <Link to="/student/ask" className="btn"><MessagesSquare size={17} />Ask Buddy</Link>
            </div>
          </div>
          <div className="neu" style={{ padding: 14, borderRadius: 24, display: 'grid', justifyItems: 'center', gap: 4 }}>
            <Ring value={Math.round(questDone / 3 * 100)} size={92} stroke={9} tone="accent" label="Quest progress" />
            <span className="tiny faint num">{questDone} of 3 done</span>
          </div>
        </div>
      </Glass>

      <div className="grid g4">
        {[
          [Flame, 'gold', 'Group streak', `${g.streak} days`, 'Practised every school day'],
          [Star, 'accent', 'Group stars', s.xp.toLocaleString('en-IN'), '+40 for every clear explanation'],
          [Award, 'leaf', 'Badges', `${BADGES.filter((b) => b.got).length}/${BADGES.length}`, 'Brave Try is your newest'],
          [Target, 'river', 'Solved without a hint', `${Math.round(g.clean / g.done * 100)}%`, 'This week'],
        ].map(([I, t, k, v, d]) => (
          <Glass key={k} className="stat"><span className="k"><span className="ic" style={{ background: `var(--${t}-soft)`, color: `var(--${t})` }}><I size={17} /></span>{k}</span><span className="v num">{v}</span><span className="d faint">{d}</span></Glass>
        ))}
      </div>

      <div className="grid split-wide">
        <Glass>
          <CardHead title="Your learning path" sub="Unit 4 · Patterns in our village"><span className="pill accent">Level {g.level}</span></CardHead>
          <div className="path">
            {PATH.map((n, i) => {
              const Icon = n.kind === 'done' ? Check : n.kind === 'village' ? BookOpen : n.kind === 'current' ? Play : n.id.startsWith('m') ? Flag : Lock
              const go = () => n.kind === 'current' ? nav('/student/practice') : n.kind === 'village' ? nav('/student/library') : n.kind === 'done' ? nav('/student/practice') : null
              return (
                <motion.div key={n.id} className="node-wrap" style={{ transform: `translateX(${OFFS[i]}px)` }} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .07 }}>
                  <button type="button" className={`node ${n.kind}`} onClick={go} aria-label={`${n.label}${n.kind === 'locked' ? ' (locked)' : ''}`} disabled={n.kind === 'locked'}>
                    {n.kind === 'current' && <span className="ring" />}<Icon />
                  </button>
                  <span className="node-label">{n.label}{n.kind === 'current' && <><br /><span className="pill accent" style={{ marginTop: 4 }}>Start here</span></>}</span>
                </motion.div>
              )
            })}
          </div>
        </Glass>

        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="Today’s team" sub="Roles move one place after every question" />
            <div className="stack-sm">
              {kids.map((k, i) => (
                <div key={k.id} className="between" style={{ padding: '6px 0' }}>
                  <span className="row" style={{ gap: 10 }}><Avatar name={k.name} /><b>{k.name}</b></span>
                  <span className={`pill ${['accent', 'river', 'leaf', ''][(i + g.rot) % kids.length] || ''}`}>{['Reader', 'Solver', 'Checker', 'Helper'][(i + g.rot) % kids.length]}</span>
                </div>
              ))}
            </div>
          </Glass>

          <Glass>
            <CardHead title="Village voice of the day"><Link to="/student/library" className="btn sm ghost">Library</Link></CardHead>
            <div className="grid" style={{ gridTemplateColumns: '96px 1fr', gap: 14, alignItems: 'center' }}>
              <div style={{ height: 96, borderRadius: 16, overflow: 'hidden' }}><Art kind={card.art} /></div>
              <div className="stack-sm">
                <b>{card.title}</b>
                <span className="small faint">{card.who} · {card.role} · {card.card.subject}</span>
                <Link to="/student/library" className="btn sm" style={{ justifySelf: 'start' }}><Play size={14} />Listen ({Math.floor(card.secs / 60)}:{String(card.secs % 60).padStart(2, '0')})</Link>
              </div>
            </div>
          </Glass>

          <Glass>
            <CardHead title="Badges" sub="Earned by thinking, not by speed" />
            <div className="grid g3" style={{ gap: 8 }}>
              {BADGES.map((b) => (
                <div key={b.id} className={`badge-tile well ${b.got ? '' : 'locked'}`} title={b.desc}>
                  <span className="medal" style={{ background: `color-mix(in srgb, ${b.color} 18%, transparent)`, color: b.color }}><Medal size={26} /></span>
                  <span className="tiny" style={{ fontWeight: 600 }}>{b.name}</span>
                </div>
              ))}
            </div>
          </Glass>

          <Glass>
            <CardHead title="Skill Passport stamps" sub={`${g.name} group`}></CardHead>
            {stamps.length ? stamps.map((p) => (
              <div key={p.id} className="stack-sm" style={{ padding: '8px 0' }}>
                <div className="between"><b className="small">{p.who}: {p.skill}</b>{p.t && p.m ? <span className="pill leaf">Stamped</span> : <span className="pill gold">Waiting for check</span>}</div>
                <Bar value={(p.t ? 1 : 0) + (p.m ? 1 : 0)} max={2} tone={p.t && p.m ? '' : 'gold'} />
              </div>
            )) : <p className="small faint">Finish a mission step to earn your first stamp.</p>}
          </Glass>
        </div>
      </div>
    </>
  )
}
