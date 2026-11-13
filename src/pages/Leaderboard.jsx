import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ArrowUp, ArrowDown, Minus, Gift, Star, Timer, ShieldCheck } from 'lucide-react'
import { useStore } from '../store'
import { STUDENTS } from '../data'
import { BOARD_TODAY, BOARD_WEEK, POINTS, STARS, PRIZES, TOP10 } from '../content'
import { avColor, initials } from '../data'
import { Info, Eye, EyeOff, X } from 'lucide-react'
import { Card, CardH, Hero, Tabs, Avatar, Note } from '../components/ui'

const PODIUM = ['var(--c2)', 'var(--c4)', 'var(--c5)']

function Countdown() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const end = new Date(now); end.setHours(16, 0, 0, 0); if (end <= now) end.setDate(end.getDate() + 1)
  const d = Math.floor((end - now) / 1000), p = (n) => String(n).padStart(2, '0')
  return <span className="mono num">{p(Math.floor(d / 3600))}:{p(Math.floor((d % 3600) / 60))}:{p(d % 60)}</span>
}


const RING = { 1: 'var(--c4)', 2: 'var(--c6)', 3: 'var(--c2)' }
function Top10() {
  const [shown, setShown] = useState(true)
  const pod = [TOP10[1], TOP10[0], TOP10[2]]
  return (
    <Card pad={false} className="lb" data-tour="top10">
      <div className="lb-h" style={{ flexDirection: 'column', gap: 2 }}><h2>Top 10 learners today</h2><span className="xs t3">Effort points out of 100 · average time to first try</span></div>
      <div className="lb-pod">
        {pod.map((x) => { const big = x.rank === 1; const sz = big ? 84 : 62; return (
          <motion.div key={x.name} className="lb-p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: big ? .1 : .25, type: 'spring' }} style={{ paddingBottom: big ? 14 : 0 }}>
            {big && <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Trophy size={22} color="var(--c4)" fill="var(--c4)" /></motion.span>}
            <span className="lb-av" style={{ width: sz, height: sz, background: avColor(x.name), '--ring': RING[x.rank], fontSize: big ? '1.5rem' : '1.1rem' }}>{initials(x.name)}<span className="lb-badge">{x.rank}</span></span>
            <b style={{ marginTop: 14, fontSize: big ? '1.05rem' : '.95rem' }}>{x.name}</b>
            <span className="xs t3">{x.team}</span>
            <span className="row" style={{ gap: 6, justifyContent: 'center' }}><span className="lb-score">{x.score}<small>/100</small></span><span className="lb-time">{x.secs}s</span></span>
          </motion.div>) })}
      </div>
      <div style={{ filter: shown ? 'none' : 'blur(3px)', opacity: shown ? 1 : .5, transition: '.3s' }}>
        {TOP10.slice(3).map((x, i) => (
          <motion.div key={x.name} className="lb-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 + i * .05 }}>
            <span className="mono t3" style={{ fontSize: '1.05rem' }}>{x.rank}</span>
            <span className="av" style={{ background: avColor(x.name) }}>{initials(x.name)}</span>
            <span><b className="sm">{x.name}</b> <span className="xs t3">· {x.team}</span></span>
            <span className="lb-score">{x.score}<small>/100</small></span>
            <span className="lb-time" style={{ justifySelf: 'end' }}>{x.secs}s</span>
          </motion.div>))}
      </div>
      <div className="lb-foot"><Info size={17} />{shown ? 'Leaderboard is currently visible to learners' : 'Hidden from learners · only the teacher can see it'}
        <button className="btn small" onClick={() => setShown(!shown)} style={{ marginLeft: 6 }}>{shown ? <><EyeOff size={14} />Hide</> : <><Eye size={14} />Show</>}</button></div>
    </Card>
  )
}

export default function Leaderboard() {
  const s = useStore()
  const [tab, setTab] = useState('today'); const [view, setView] = useState('top10')
  const rows = (tab === 'today' ? BOARD_TODAY : BOARD_WEEK).map((r) => ({ ...r, grp: s.groups.find((g) => g.id === r.g) })).sort((a, b) => b.pts - a.pts)
  const top = [rows[1], rows[0], rows[2]]
  const max = rows[0].pts
  return (
    <>
      <Hero eyebrow="Compete · Group League" title="Today’s leaderboard:" emph="every try counts!" mood="cheer" say="Today's league! Every try counts. Points come from trying first, explaining and helping others. The weekly winners get the Hornbill Cup."
        chips={<><span className="chip acc"><Timer size={14} />League closes in <Countdown /></span><span className="chip"><Trophy size={14} />Weekly prizes on Saturday</span><span className="t2">Top 10 learners and the group league.</span></>} />
      <Tabs value={view} onChange={setView} items={[['top10', <><Star size={15} />Top 10 learners</>], ['groups', <><Trophy size={15} />Group league</>]]} />
      <div className="grid split-7-5">
        {view === 'top10' ? <Top10 /> : <Card data-tour="league">
          <Tabs value={tab} onChange={setTab} items={[['today', 'Today'], ['week', 'This week']]} />
          <div className="podium" style={{ margin: '10px 0 20px' }}>
            {top.map((r, k) => { const place = [2, 1, 3][k]; return (
              <div key={r.g} className="pod">
                {place === 1 && <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Trophy size={30} color="var(--c4)" fill="var(--c4)" /></motion.span>}
                <b>{r.grp.name}</b><span className="avs">{r.grp.members.map((id) => <Avatar key={id} name={STUDENTS.find((x) => x.id === id).name} />)}</span>
                <motion.div className="blk" initial={{ height: 0 }} animate={{ height: [110, 150, 90][k] }} transition={{ type: 'spring', delay: k * .1 }} style={{ background: PODIUM[k] }}>{place}</motion.div>
                <span className="mono num">{r.pts} pts</span>
              </div>) })}
          </div>
          <div className="stack-s">
            {rows.map((r, k) => (
              <motion.div key={r.g + tab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * .05 }} className="row" style={{ flexWrap: 'nowrap', padding: '10px 12px', borderRadius: 16, border: '2px solid', borderColor: r.g === s.activeGroup ? 'var(--p)' : 'var(--line)', background: r.g === s.activeGroup ? 'var(--p-soft)' : 'var(--surface)' }}>
                <span className="mono" style={{ width: 28, fontSize: '1.2rem' }}>{k + 1}</span>
                <div style={{ flex: '0 0 130px' }}><b>{r.grp.name}</b>{r.g === s.activeGroup && <span className="tag acc" style={{ marginLeft: 6 }}>You</span>}<div className="xs t3">L{r.grp.level} {r.grp.subject}</div></div>
                <div style={{ flex: 1 }}><div className="track" style={{ '--k': PODIUM[k] || 'var(--p)' }}><motion.i initial={{ width: 0 }} animate={{ width: `${(r.pts / max) * 100}%` }} /></div></div>
                <span className="mono num" style={{ width: 70, textAlign: 'right' }}>{r.pts}</span>
                {tab === 'today' && <span style={{ width: 34, display: 'grid', placeItems: 'center', color: r.delta > 0 ? 'var(--ok)' : r.delta < 0 ? 'var(--crit)' : 'var(--text-3)' }}>{r.delta > 0 ? <ArrowUp size={16} /> : r.delta < 0 ? <ArrowDown size={16} /> : <Minus size={16} />}</span>}
              </motion.div>
            ))}
          </div>
        </Card>}
        <div className="stack">
          <Card>
            <CardH title="This week’s prizes" sub="Given out every Saturday at assembly"><Gift size={20} color="var(--p)" /></CardH>
            <div className="stack-s">{PRIZES.map((p) => <div key={p.t} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}><span style={{ width: 38, height: 38, borderRadius: 12, display: 'grid', placeItems: 'center', background: p.c, color: '#fff', flex: 'none' }}><Trophy size={18} /></span><div><b className="sm">{p.t}</b><div className="xs t3">{p.d}</div></div></div>)}</div>
          </Card>
          <Card>
            <CardH title="Stars of the day" sub="Effort awards, not marks" />
            <div className="stack-s">{STARS.map((x) => <div key={x.who} className="row" style={{ flexWrap: 'nowrap' }}><Avatar name={x.who} /><div style={{ flex: 1 }}><b className="sm">{x.who}</b> <span className="xs t3">· {x.team}</span><div className="xs t2">{x.why}</div></div><Star size={18} fill="var(--c4)" color="var(--c4)" /></div>)}</div>
          </Card>
          <Card>
            <CardH title="How groups earn points" />
            <div className="stack-s">{POINTS.map(([a, b]) => <div key={a} className="between sm"><span>{a}</span><span className="tag acc">+{b}</span></div>)}</div>
          </Card>
        </div>
      </div>
      <Note icon={ShieldCheck}>Fair play built in: points reward effort and explaining (not just right answers), there is also a group league, “Most Improved” lets every level win, the league resets daily, and teachers can hide it at any time. Prizes are made in the village, so they cost almost nothing after the pilot.</Note>
    </>
  )
}
