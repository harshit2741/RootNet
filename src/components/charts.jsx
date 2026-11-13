import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store'

// Recharts needs real colour values: read the theme tokens, re-read when theme or dashboard changes.
const KEYS = ['text', 'text-2', 'text-3', 'line', 'line-2', 'surface-2', 'accent', 'accent-2', 'ok', 'warn', 'crit', 'info', 'c1', 'c2', 'c3', 'c4', 'c5']
export function useTokens() {
  const theme = useStore((s) => s.theme)
  const { pathname } = useLocation()
  const read = () => { const cs = getComputedStyle(document.documentElement); return Object.fromEntries(KEYS.map((k) => [k, cs.getPropertyValue('--' + k).trim()])) }
  const [t, setT] = useState(read)
  useEffect(() => { const id = requestAnimationFrame(() => setT(read())); return () => cancelAnimationFrame(id) }, [theme, pathname])
  return t
}

export function Tip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="tip">
      {label != null && <b style={{ display: 'block', marginBottom: 4 }}>{label}</b>}
      {payload.map((p) => <div key={p.dataKey || p.name} className="row" style={{ gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.payload?.fill }} />{p.name}: <b className="mono num">{p.value}{unit}</b></div>)}
    </div>
  )
}
export const axis = (t) => ({ stroke: t['text-3'], fontSize: 11, tickLine: false, axisLine: false, fontFamily: 'JetBrains Mono Variable, monospace' })
