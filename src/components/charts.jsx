import { useEffect, useState } from 'react'
import { useStore } from '../store'

// Recharts needs real colour values, so read the theme tokens and re-read when the theme changes.
const KEYS = ['ink', 'ink-2', 'ink-3', 'accent', 'gold', 'leaf', 'river', 'warn', 'violet', 'glass-line', 'well', 'hill-3']
export function useTokens() {
  const theme = useStore((s) => s.theme)
  const read = () => { const cs = getComputedStyle(document.documentElement); return Object.fromEntries(KEYS.map((k) => [k, cs.getPropertyValue('--' + k).trim()])) }
  const [t, setT] = useState(read)
  useEffect(() => { const id = requestAnimationFrame(() => setT(read())); return () => cancelAnimationFrame(id) }, [theme])
  return t
}

export function Tip({ active, payload, label, unit = '', fmt }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tip">
      {label != null && <b style={{ display: 'block', marginBottom: 4 }}>{label}</b>}
      {payload.map((p) => <div key={p.dataKey || p.name} className="row" style={{ gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.payload?.fill }} />{p.name}: <b className="num">{fmt ? fmt(p.value) : p.value}{unit}</b></div>)}
    </div>
  )
}
export const axis = (t) => ({ stroke: t['ink-3'], fontSize: 11, tickLine: false, axisLine: false })
