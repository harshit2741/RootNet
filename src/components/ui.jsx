import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Info, AlertTriangle, X } from 'lucide-react'
import { useStore } from '../store'
import { avColor, initials } from '../data'

export function Glass({ as: Tag = 'section', className = '', strong, pad = true, children, ...rest }) {
  return <Tag className={`glass ${strong ? 'strong' : ''} ${pad ? 'pad' : ''} ${className}`} {...rest}>{children}</Tag>
}

export function PageHead({ eyebrow, title, lede, children }) {
  return (
    <header className="page-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {children && <div className="row">{children}</div>}
    </header>
  )
}

export function CardHead({ title, sub, children }) {
  return (
    <div className="card-head">
      <div><h2>{title}</h2>{sub && <p className="small faint">{sub}</p>}</div>
      {children && <div className="row">{children}</div>}
    </div>
  )
}

export function Stat({ icon: Icon, tone = 'leaf', label, value, delta, deltaUp = true, sub, children }) {
  return (
    <Glass className="stat">
      <span className="k"><span className="ic" style={{ background: `var(--${tone}-soft)`, color: `var(--${tone})` }}>{Icon && <Icon size={17} />}</span>{label}</span>
      <div className="between" style={{ alignItems: 'flex-end' }}>
        <span className="v num">{value}</span>
        {children}
      </div>
      {(delta || sub) && <span className="d faint">{delta && <b className={deltaUp ? 'up' : 'down'}>{delta}</b>} {sub}</span>}
    </Glass>
  )
}

export function Avatar({ name, size, className = '' }) {
  return <span className={`av ${size === 'lg' ? 'lg' : ''} ${className}`} style={{ background: avColor(name) }} title={name} aria-hidden="true">{initials(name)}</span>
}

export function Toggle({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="toggle" onClick={() => onChange(!checked)} />
}

export function Seg({ value, onChange, options, label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => {
        const [v, l] = Array.isArray(o) ? o : [o, o]
        return <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button>
      })}
    </div>
  )
}

export function Bar({ value, max = 100, tone = '' }) {
  return <div className={`bar ${tone}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><i style={{ width: `${Math.min(100, (value / max) * 100)}%` }} /></div>
}

export function Ring({ value, size = 64, stroke = 7, tone = 'leaf', label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label || `${value}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--well)" strokeWidth={stroke} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`var(--${tone})`} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1, ease: 'easeOut' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" style={{ font: `700 ${size / 4.4}px var(--font-display)`, fill: 'var(--ink)' }}>{value}%</text>
    </svg>
  )
}

export const statusPill = (s) => s === 'stuck' ? <span className="pill warn"><span className="dot" />Needs help</span> : s === 'idle' ? <span className="pill"><span className="dot" />Idle</span> : <span className="pill leaf"><span className="dot" />On track</span>
export const consentPill = (c) => c === 'public' ? <span className="pill leaf">Public</span> : c === 'school' ? <span className="pill river">School only</span> : <span className="pill">Restricted</span>

export function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} className="glass strong pad-lg modal" initial={{ y: 20, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="between" style={{ marginBottom: 14 }}><h2>{title}</h2><button className="btn sm icon ghost" onClick={onClose} aria-label="Close"><X size={16} /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const Ic = { leaf: CheckCircle2, river: Info, warn: AlertTriangle, privacy: ShieldCheck }
  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => { const I = Ic[t.tone] || CheckCircle2; return (
          <motion.div key={t.id} className="glass strong toast" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }}>
            <I size={18} color={`var(--${t.tone === 'privacy' ? 'river' : t.tone})`} />{t.text}
          </motion.div>) })}
      </AnimatePresence>
    </div>
  )
}

export function Notice({ icon: Icon = Info, tone = 'river', children }) {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 14, background: `var(--${tone}-soft)`, color: 'var(--ink)', flexWrap: 'nowrap' }}>
      <Icon size={17} style={{ color: `var(--${tone})`, flex: 'none', marginTop: 2 }} /><div className="small">{children}</div>
    </div>
  )
}

/* Illustrations for village records. Drawn, not photographed, so no real people appear. */
export function Art({ kind, className = '', style }) {
  const S = (v, o = 1) => ({ fill: `var(--${v})`, opacity: o })
  let b = null
  if (kind === 'weave') b = <>{[...Array(12)].map((_, i) => <rect key={i} x={i * 10} y="0" width="9" height="80" style={S(i % 3 === 0 ? 'accent' : 'gold', i % 3 === 0 ? 1 : 0.55)} />)}{[...Array(8)].map((_, j) => <rect key={'h' + j} x={j % 2 ? 0 : 5} y={j * 10 + 3} width="120" height="4" style={S('mist', 0.65)} />)}</>
  else if (kind === 'paddy') b = <><rect width="120" height="80" style={S('hill-1')} />{[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M0 ${20 + j * 13} Q60 ${8 + j * 13} 120 ${22 + j * 13} V80 H0Z`} style={S(j % 2 ? 'hill-3' : 'leaf', 0.35 + j * 0.13)} />)}{[...Array(9)].map((_, i) => <path key={'s' + i} d={`M${12 + i * 12} 34 v-8 M${10 + i * 12} 30 l2-4 2 4`} style={{ stroke: 'var(--hill-4)', fill: 'none' }} strokeWidth="1.5" />)}<circle cx="100" cy="14" r="7" style={S('gold')} /></>
  else if (kind === 'river') b = <><rect width="120" height="80" style={S('hill-1')} /><path d="M0 46 L30 18 L52 38 L76 12 L120 44 V80 H0Z" style={S('hill-3', 0.7)} /><path d="M0 64 Q30 52 60 64 T120 62 V80 H0Z" style={S('river', 0.8)} /><path d="M10 70 q10 -4 20 0 M60 72 q10 -4 20 0" style={{ stroke: 'var(--mist)', fill: 'none' }} strokeWidth="1.5" /><circle cx="96" cy="18" r="7" style={S('gold')} /></>
  else if (kind === 'market') b = <><rect width="120" height="80" style={S('hill-1')} /><rect x="10" y="44" width="100" height="8" rx="2" style={S('hill-4')} />{[[24, 38], [46, 38], [68, 38], [90, 38]].map(([x, y], i) => <g key={i}>{[[0, 0], [-5, 0], [5, 0], [-2.5, -5], [2.5, -5], [0, -10]].map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={y + dy} r="3.6" style={S('gold')} />)}</g>)}<path d="M8 20 L60 6 L112 20 Z" style={S('accent', 0.85)} /><rect x="14" y="20" width="3" height="26" style={S('ink-3')} /><rect x="103" y="20" width="3" height="26" style={S('ink-3')} /></>
  else if (kind === 'bridge') b = <><rect width="120" height="80" style={S('hill-1')} /><path d="M0 70 Q60 58 120 70 V80 H0Z" style={S('river', 0.7)} /><path d="M6 44 H114" style={{ stroke: 'var(--gold)' }} strokeWidth="4" />{[...Array(6)].map((_, i) => <path key={i} d={`M${6 + i * 18} 44 L${15 + i * 18} 30 L${24 + i * 18} 44`} style={{ stroke: 'var(--hill-4)', fill: 'none' }} strokeWidth="2.5" />)}<path d="M6 30 H114" style={{ stroke: 'var(--hill-4)' }} strokeWidth="2" /></>
  else b = <><rect width="120" height="80" style={S('hill-1')} />{[[20, 50, 16], [48, 40, 20], [78, 48, 17], [102, 42, 14]].map(([x, y, r], i) => <g key={i}><rect x={x - 2} y={y} width="4" height={80 - y} style={S('ink-3')} /><circle cx={x} cy={y} r={r} style={S('hill-4', 0.8)} /></g>)}</>
  return <svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" className={className} style={{ width: '100%', height: '100%', display: 'block', ...style }} aria-hidden="true">{b}</svg>
}
