import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Info, AlertTriangle, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useStore } from '../store'
import { avColor, initials } from '../data'
import { useTokens } from './charts'
import { Volume2 } from 'lucide-react'
import Mascot from './Mascot'
import { speak } from '../speak'

export function Card({ as: Tag = 'section', pad = true, tight, top, k, className = '', style, children, ...rest }) {
  return <Tag className={`card ${pad ? (tight ? 'tight' : 'pad') : ''} ${top ? 'accent-top' : ''} ${className}`} style={{ ...(k ? { '--k': k } : {}), ...style }} {...rest}>{children}</Tag>
}
export function CardH({ title, sub, children }) {
  return <div className="card-h"><div><h2>{title}</h2>{sub && <p className="sub">{sub}</p>}</div>{children && <div className="row">{children}</div>}</div>
}

export function Hero({ eyebrow, title, emph, chips, right, mood = 'wave', say }) {
  const text = say || `${title} ${emph || ''}`
  return (
    <header className="hero" data-tour="hero">
      <div style={{ minWidth: 0, flex: '1 1 480px' }}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title} {emph && <span className="grad">{emph}</span>}</h1>
        {chips && <div className="chips">{chips}</div>}
      </div>
      <div className="hero-art">
        {right}
        <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Mascot size={112} mood={mood} />
          <button type="button" className="speak" onClick={() => speak(text)} aria-label="Read this aloud"><Volume2 size={16} />Read aloud</button>
        </div>
      </div>
    </header>
  )
}

export function Clock({ label = 'IST · HUB LIVE' }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000)
  const p = (n) => String(n).padStart(2, '0')
  return (
    <div className="clock hide-m">
      <span className="dot pulse" />
      <div><div className="t num">{p(ist.getHours())}:{p(ist.getMinutes())}:{p(ist.getSeconds())}</div><small>{label}</small></div>
    </div>
  )
}

export function Track({ value, max = 100, target, k }) {
  return (
    <div className="track" style={k ? { '--k': k } : undefined} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <motion.i initial={{ width: 0 }} animate={{ width: `${Math.min(100, (value / max) * 100)}%` }} transition={{ duration: .9, ease: [.2, .7, .2, 1] }} />
      {target != null && <b style={{ left: `${(target / max) * 100}%` }} title={`Target ${target}`} />}
    </div>
  )
}

export function Spark({ data, dataKey, k = 'accent', h = 46 }) {
  const t = useTokens(); const c = t[k] || t.accent
  const id = `sp-${dataKey}-${k}`
  return (
    <div style={{ height: h, marginTop: 6 }}>
      <ResponsiveContainer><AreaChart data={data} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
        <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity=".35" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
        <Area type="monotone" dataKey={dataKey} stroke={c} strokeWidth={2} fill={`url(#${id})`} dot={false} isAnimationActive={false} />
      </AreaChart></ResponsiveContainer>
    </div>
  )
}

/* KPI card: label + icon, big mono value, meta line, then a progress track with target or a sparkline */
export function Kpi({ label, icon: Icon, k = 'var(--c1)', value, unit, of, meta, track, spark }) {
  return (
    <Card pad={false} top k={k} className="kpi">
      <div className="lab">{Icon && <span className="ib"><Icon size={20} /></span>}<span>{label}</span></div>
      <div className="val num">{value}{of != null && <small>/ {of}</small>}{unit && <small>{unit}</small>}</div>
      {meta && <div className="meta">{meta}</div>}
      {track && <div className="foot-k"><Track k={k} {...track} /></div>}
      {spark && <Spark {...spark} />}
    </Card>
  )
}

/* Rotating alert banner with segmented progress, like a story bar */
export function Banner({ items }) {
  const [i, setI] = useState(0)
  const n = items.length
  useEffect(() => { if (n < 2) return; const t = setTimeout(() => setI((x) => (x + 1) % n), 6500); return () => clearTimeout(t) }, [i, n])
  if (!n) return null
  const it = items[i % n]; const Ic = it.icon || AlertTriangle
  const col = { crit: 'var(--crit)', warn: 'var(--warn)', info: 'var(--info)', ok: 'var(--ok)' }[it.tone || 'warn']
  return (
    <Card pad={false} className="banner" aria-live="polite" data-tour="banner">
      <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'center', gap: 16 }}>
        <span className="ic" style={{ background: `color-mix(in srgb, ${col} 14%, transparent)`, color: col }}><Ic size={22} /></span>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }} style={{ flex: 1, minWidth: 0 }}>
            <b style={{ fontSize: '1.08rem', display: 'block' }}>{it.title}</b>
            <span className="t2 sm">{it.sub}</span>
          </motion.div>
        </AnimatePresence>
        <div className="row hide-m" style={{ flexWrap: 'nowrap' }}>
          {it.action && <button className="btn" onClick={it.action.onClick}>{it.action.label}</button>}
          <button className="btn icon" aria-label="Previous alert" onClick={() => setI((i - 1 + n) % n)}><ChevronLeft size={17} /></button>
          <button className="btn icon" aria-label="Next alert" onClick={() => setI((i + 1) % n)}><ChevronRight size={17} /></button>
        </div>
      </div>
      <div className="segbar" style={{ gridTemplateColumns: `repeat(${n},1fr)` }}>
        {items.map((_, k) => <i key={k + '-' + i} className={k < i ? 'done' : k === i ? 'on' : ''} style={{ '--dur': '6.5s' }} />)}
      </div>
    </Card>
  )
}

export function Feed({ items }) {
  const col = { ok: 'var(--ok)', warn: 'var(--warn)', info: 'var(--info)', acc: 'var(--accent)', c3: 'var(--c3)' }
  const row = items.map((x, i) => <span key={i}><i className="dot" style={{ color: col[x.k] || 'var(--accent)' }} /><span className="t3">{x.t}</span><b>{x.a}</b><span>·</span>{x.b}</span>)
  return (
    <div className="card feed" aria-label="Live feed" data-tour="feed">
      <span className="lbl"><i className="dot pulse" />LIVE FEED</span>
      <div className="mask"><div className="run">{row}{row}</div></div>
    </div>
  )
}

export function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs" role="tablist">
      {items.map(([v, l, c]) => <button key={v} type="button" role="tab" aria-selected={value === v} onClick={() => onChange(v)}>{l}{c != null && <span className="tag">{c}</span>}</button>)}
    </div>
  )
}

export function Seg({ value, onChange, options, label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button> })}
    </div>
  )
}

export function Avatar({ name, lg }) {
  return <span className={`av ${lg ? 'lg' : ''}`} style={{ background: avColor(name) }} title={name} aria-hidden="true">{initials(name)}</span>
}
export function Toggle({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="toggle" onClick={() => onChange(!checked)} />
}
export const statusTag = (s) => s === 'stuck' ? <span className="tag warn"><i className="dot" />Needs help</span> : s === 'idle' ? <span className="tag"><i className="dot" />Idle</span> : <span className="tag ok"><i className="dot" />On track</span>
export const consentTag = (c) => c === 'public' ? <span className="tag ok">Public</span> : c === 'school' ? <span className="tag info">School only</span> : <span className="tag">Restricted</span>

export function Modal({ open, onClose, title, children, width }) {
  useEffect(() => { if (!open) return; const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} className="card modal" style={width ? { width } : undefined} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            {title && <div className="between" style={{ marginBottom: 14 }}><h2>{title}</h2><button className="btn small icon ghost" onClick={onClose} aria-label="Close"><X size={16} /></button></div>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const I = { leaf: CheckCircle2, river: Info, warn: AlertTriangle, privacy: ShieldCheck }
  const C = { leaf: 'var(--ok)', river: 'var(--info)', warn: 'var(--warn)', privacy: 'var(--info)' }
  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence>{toasts.map((t) => { const Ic = I[t.tone] || CheckCircle2; return <motion.div key={t.id} className="toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}><Ic size={18} color={C[t.tone] || C.leaf} />{t.text}</motion.div> })}</AnimatePresence>
    </div>
  )
}

export function Note({ icon: Icon = Info, tone = 'info', children }) {
  const c = `var(--${tone})`
  return <div className="row sm" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 14, border: `1px solid color-mix(in srgb, ${c} 30%, transparent)`, background: `color-mix(in srgb, ${c} 7%, transparent)` }}><Icon size={17} color={c} style={{ flex: 'none', marginTop: 2 }} /><div className="t2">{children}</div></div>
}

/* Abstract illustrations for village records (no people) */
export function Art({ kind }) {
  const F = (c, o = 1) => ({ fill: c, opacity: o })
  const A = 'var(--accent)', B = 'var(--accent-2)', L = 'var(--line-2)', S = 'var(--surface-2)'
  let b
  if (kind === 'weave') b = <>{[...Array(12)].map((_, i) => <rect key={i} x={i * 10} width="9" height="80" style={F(i % 3 === 0 ? A : B, i % 3 === 0 ? .9 : .35)} />)}{[...Array(8)].map((_, j) => <rect key={'h' + j} x={j % 2 ? 0 : 5} y={j * 10 + 3} width="120" height="4" style={F('var(--surface)', .7)} />)}</>
  else if (kind === 'paddy') b = <><rect width="120" height="80" style={F(S)} />{[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M0 ${20 + j * 13} Q60 ${8 + j * 13} 120 ${22 + j * 13} V80 H0Z`} style={F(j % 2 ? A : B, .14 + j * .1)} />)}</>
  else if (kind === 'river') b = <><rect width="120" height="80" style={F(S)} /><path d="M0 46 L30 18 L52 38 L76 12 L120 44 V80 H0Z" style={F(B, .3)} /><path d="M0 64 Q30 52 60 64 T120 62 V80 H0Z" style={F(A, .55)} /></>
  else if (kind === 'market') b = <><rect width="120" height="80" style={F(S)} /><rect x="10" y="48" width="100" height="6" rx="2" style={F(L)} />{[24, 46, 68, 90].map((x, i) => <g key={i}>{[[0, 0], [-5, 0], [5, 0], [-2.5, -5], [2.5, -5], [0, -10]].map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={42 + dy} r="3.6" style={F(A, .8)} />)}</g>)}<path d="M8 22 L60 8 L112 22 Z" style={F(B, .5)} /></>
  else if (kind === 'bridge') b = <><rect width="120" height="80" style={F(S)} /><path d="M0 70 Q60 58 120 70 V80 H0Z" style={F(B, .4)} /><path d="M6 44 H114 M6 30 H114" style={{ stroke: A }} strokeWidth="2.5" />{[...Array(6)].map((_, i) => <path key={i} d={`M${6 + i * 18} 44 L${15 + i * 18} 30 L${24 + i * 18} 44`} style={{ stroke: A, fill: 'none', opacity: .7 }} strokeWidth="2" />)}</>
  else b = <><rect width="120" height="80" style={F(S)} />{[[20, 50, 16], [48, 40, 20], [78, 48, 17], [102, 42, 14]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} style={F(i % 2 ? A : B, .35)} />)}</>
  return <svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">{b}</svg>
}
