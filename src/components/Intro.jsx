import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Laptop, ShieldCheck } from 'lucide-react'
import { glassBreak } from '../speak'

// Opening screen: says clearly that this is an illustrative site, then the glass shatters into the app.
function shardsFrom(cols = 7, rows = 5) {
  let s = 7; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const P = []; for (let y = 0; y <= rows; y++) { P.push([]); for (let x = 0; x <= cols; x++) { const edge = x === 0 || y === 0 || x === cols || y === rows; P[y].push([x / cols * 100 + (edge ? 0 : (r() - .5) * 9), y / rows * 100 + (edge ? 0 : (r() - .5) * 11)]) } }
  const out = []
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const a = P[y][x], b = P[y][x + 1], c = P[y + 1][x + 1], d = P[y + 1][x]
    const tris = r() > .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]
    tris.forEach((t) => out.push({ pts: t, cx: (t[0][0] + t[1][0] + t[2][0]) / 3, cy: (t[0][1] + t[1][1] + t[2][1]) / 3, rot: (r() - .5) * 140, sp: .6 + r() * .8 }))
  }
  return out
}
function cracksFrom(ix, iy) {
  let s = 3; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  return [...Array(14)].map((_, k) => {
    const ang = (k / 14) * Math.PI * 2 + r() * .3; let x = ix, y = iy; let d = `M${x} ${y}`
    for (let j = 0; j < 6; j++) { const len = 4 + r() * 9; const a = ang + (r() - .5) * .6; x += Math.cos(a) * len; y += Math.sin(a) * len * 1.6; d += ` L${x.toFixed(1)} ${y.toFixed(1)}` }
    return d
  })
}

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState('show') // show → crack → shatter
  const [hit] = useState([50, 72])
  const shards = useMemo(() => shardsFrom(), [])
  const cracks = useMemo(() => cracksFrom(hit[0], hit[1]), [hit])
  const finish = () => { try { sessionStorage.setItem('roots:intro', '1') } catch { /* storage off */ } onDone() }
  const smash = (e) => {
    if (phase !== 'show') return
    setPhase('crack'); glassBreak()
    setTimeout(() => setPhase('shatter'), 380)
    setTimeout(finish, 1700)
  }
  useEffect(() => { const k = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); smash() } if (e.key === 'Escape') finish() }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }) // eslint-disable-line react-hooks/exhaustive-deps
  const dash = [['Teacher', '#0E9F6E'], ['Student', '#7C3AED'], ['Village Voice', '#EA6A12'], ['Parent', '#DB2777'], ['Hub admin', '#0284C7'], ['Impact', '#4F46E5']]
  return (
    <>
      {phase !== 'shatter' && (
        <div className="intro" role="dialog" aria-modal="true" aria-label="About this prototype">
          <div className="intro-bg" />
          <motion.div className="intro-glass" initial={{ opacity: 0, y: 16, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .8, ease: [.2, .8, .2, 1] }}>
            <div className="intro-top">
              <span className="intro-pill"><i />Illustrative prototype</span>
              <span className="intro-brand">ROOTS · Offline village learning hub</span>
            </div>
            <h1>Everything behind this glass is a <span className="hl">preview.</span></h1>
            <p className="intro-lede">These dashboards show how ROOTS works, using sample data. <b>The product itself runs locally</b>, on a single school laptop, with no internet connection required.</p>
            <div className="intro-cards">
              {[[Sparkles, '#A78BFA', 'What you will see', 'Six dashboards and their features. All names and figures are fictional.'],
                [Laptop, '#34D399', 'Our core product runs locally', 'One laptop is the hub. Tablets join its own Wi-Fi. No cloud, no subscription, about ₹0 a year.'],
                [ShieldCheck, '#FBBF24', 'Nothing leaves this page', 'This preview runs in your browser and sends nothing to any server.']].map(([I, c, t, d], i) => (
                <motion.div key={t} className="intro-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 + i * .12, duration: .55 }}>
                  <span className="ic" style={{ color: c, background: `color-mix(in srgb, ${c} 16%, transparent)`, borderColor: `color-mix(in srgb, ${c} 35%, transparent)` }}><I size={20} /></span>
                  <b>{t}</b><p>{d}</p>
                </motion.div>))}
            </div>
            <motion.div className="intro-foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .85, duration: .6 }}>
              <div className="row" style={{ gap: 16 }}>
                <button className="intro-btn" onClick={smash}>Break the glass & enter<ArrowRight size={18} /></button>
                <button type="button" className="intro-skip" onClick={finish}>Skip</button>
              </div>
              <div className="intro-dash">{dash.map(([n, c]) => <span key={n}><i style={{ background: c }} />{n}</span>)}</div>
            </motion.div>
          </motion.div>
          {phase === 'crack' && <svg className="cracks" viewBox="0 0 100 100" preserveAspectRatio="none">{cracks.map((d, k) => <motion.path key={k} d={d} fill="none" stroke="rgba(255,255,255,.85)" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.4 }} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .3 }} />)}</svg>}
        </div>
      )}
      {phase === 'shatter' && shards.map((sh, k) => {
        const dx = sh.cx - hit[0], dy = sh.cy - hit[1], dist = Math.hypot(dx, dy) || 1
        return <motion.div key={k} className="shard" style={{ clipPath: `polygon(${sh.pts.map((p) => `${p[0]}% ${p[1]}%`).join(',')})` }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: (dx / dist) * 260 * sh.sp, y: (dy / dist) * 200 * sh.sp + 520, rotate: sh.rot, opacity: 0 }}
          transition={{ duration: 1.3, delay: dist * .004, ease: [.3, .1, .6, 1] }} />
      })}
    </>
  )
}
