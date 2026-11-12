import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Laptop, Tablet, Smartphone, HardDrive, Usb, BatteryCharging, Cpu, Wifi, RefreshCw, History, Zap, CheckSquare, Square, Feather, Battery } from 'lucide-react'
import { useStore } from '../store'
import { DEVICES, STORAGE, HUB_EVENTS } from '../data'
import { Glass, CardHead, PageHead, Toggle, Bar, Notice } from '../components/ui'
import { useTokens, Tip } from '../components/charts'

const KIND = { laptop: Laptop, tablet: Tablet, phone: Smartphone }
const TASKS = ['Charge all tablets and phones overnight', 'Check the UPS battery light is green', 'Back up the hub to the 1 TB drive', 'Plug in any pen drive brought from town', 'Print next week’s hint and mission cards']

function useJob() {
  const [p, setP] = useState(null); const t = useRef()
  const run = (done) => { clearInterval(t.current); setP(0); t.current = setInterval(() => setP((x) => { if (x >= 100) { clearInterval(t.current); done?.(); setTimeout(() => setP(null), 600); return 100 } return x + 5 }), 120) }
  return [p, run]
}

export default function Hub() {
  const s = useStore(); const t = useTokens()
  const [ai, setAi] = useState(true)
  const [tasks, setTasks] = useState([true, true, false, false, false])
  const [backup, runBackup] = useJob(); const [pack, runPack] = useJob()
  const [lastBackup, setLastBackup] = useState('Yesterday 17:40')
  const used = STORAGE.reduce((a, x) => a + x.gb, 0), total = 1000
  const pie = [...STORAGE.map((x) => ({ name: x.name, value: x.gb, fill: t[x.color.match(/--([\w-]+)/)[1]] })), { name: 'Free', value: +(total - used).toFixed(1), fill: t.well }]
  return (
    <>
      <PageHead eyebrow="Hub admin · for the Digital Didi / Dada" title="Hub health" lede="Everything the school needs to keep ROOTS running with no IT team: devices, storage, backups, power and the AI model. No technical words needed." />
      <div className="grid g4">
        {[[Wifi, 'leaf', 'Devices connected', `${DEVICES.filter((d) => d.status === 'online').length}/${DEVICES.length}`, 'On ROOTS-HUB Wi-Fi'], [HardDrive, 'river', 'Storage used', `${used.toFixed(0)} GB`, 'of 1 TB external drive'], [BatteryCharging, 'gold', 'Power', 'Mains', 'UPS charged · lasts about 3 h'], [Cpu, 'violet', 'AI model', ai ? 'Ready' : 'Off', ai ? 'Hints for 148 questions stored' : 'Using saved hints only']].map(([I, tone, k, v, d]) => (
          <Glass key={k} className="stat"><span className="k"><span className="ic" style={{ background: `var(--${tone}-soft)`, color: `var(--${tone})` }}><I size={17} /></span>{k}</span><span className="v num">{v}</span><span className="d faint">{d}</span></Glass>
        ))}
      </div>
      <div className="grid split-main">
        <Glass>
          <CardHead title="Devices" sub="Tablets and phones join the hub’s own Wi-Fi. No internet needed." />
          <div className="grid g3" style={{ gap: 12 }}>
            {DEVICES.map((d) => { const I = KIND[d.kind]; const low = d.battery < 25; return (
              <div key={d.id} className="neu" style={{ padding: 14, display: 'grid', gap: 8, opacity: d.status === 'offline' ? .6 : 1 }}>
                <div className="between"><I size={22} color="var(--ink-2)" /><span className={`pill ${d.status === 'online' ? 'leaf' : ''}`}><span className="dot" />{d.status === 'online' ? 'Online' : 'Offline'}</span></div>
                <b className="small">{d.name}</b>
                <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>{d.plugged ? <BatteryCharging size={15} color="var(--leaf)" /> : <Battery size={15} color={low ? 'var(--warn)' : 'var(--ink-3)'} />}<div style={{ flex: 1 }}><Bar value={d.battery} tone={low ? 'accent' : ''} /></div><span className="tiny num">{d.battery}%</span></div>
                <span className="tiny faint num">{d.ip} · seen {d.last}</span>
                {low && <span className="tiny" style={{ color: 'var(--warn)' }}>Charge before tomorrow’s class</span>}
              </div>) })}
          </div>
        </Glass>
        <div className="stack" style={{ gap: 16 }}>
          <Glass>
            <CardHead title="Storage" sub="1 TB external drive" />
            <div style={{ height: 150 }}><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={44} outerRadius={66} startAngle={90} endAngle={-270} stroke="none">{pie.map((p) => <Cell key={p.name} fill={p.fill} />)}</Pie><Tooltip content={<Tip unit=" GB" />} /></PieChart></ResponsiveContainer></div>
            <div className="stack-sm">{STORAGE.map((x) => <div key={x.name} className="between small"><span className="row" style={{ gap: 8 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: x.color }} />{x.name}</span><b className="num">{x.gb} GB</b></div>)}</div>
          </Glass>
          <Glass>
            <CardHead title="AI on the hub"><Cpu size={18} color="var(--violet)" /></CardHead>
            <div className="between"><span className="small">Small model (writes hints overnight)</span><Toggle checked={ai} onChange={(v) => { setAi(v); s.toast(v ? 'AI model switched on.' : 'AI off. Children still get every saved hint; practice works as normal.', 'river') }} label="AI model on or off" /></div>
            <div className="between" style={{ marginTop: 10 }}><span className="small row" style={{ gap: 6 }}><Feather size={15} />Lite mode for old tablets</span><Toggle checked={s.lite} onChange={s.setLite} label="Lite mode" /></div>
            <p className="tiny faint" style={{ marginTop: 10 }}>If the AI is off or slow, ROOTS keeps working: saved hints, search, missions and passports don’t need it.</p>
          </Glass>
        </div>
      </div>
      <div className="grid g3">
        <Glass>
          <CardHead title="Backup" sub={`Last: ${lastBackup}`}><HardDrive size={18} color="var(--river)" /></CardHead>
          {backup != null ? <div className="stack-sm"><Bar value={backup} /><span className="tiny faint num">Copying to the 1 TB drive… {backup}%</span></div> : <button className="btn primary" onClick={() => runBackup(() => { setLastBackup('Just now'); s.toast('Backup finished. Keep the drive in the locked cupboard.') })}><RefreshCw size={16} />Back up now</button>}
          <p className="tiny faint" style={{ marginTop: 10 }}>If the laptop breaks, plug this drive into any computer and everything comes back.</p>
        </Glass>
        <Glass>
          <CardHead title="Get new content" sub="When there is no internet"><Usb size={18} color="var(--gold)" /></CardHead>
          {pack != null ? <div className="stack-sm"><Bar value={pack} tone="gold" /><span className="tiny faint num">Importing content pack… {pack}%</span></div> : <button className="btn" onClick={() => runPack(() => s.toast('3 new Kolibri lessons added from the pen drive.'))}><Usb size={16} />Import from pen drive</button>}
          <p className="tiny faint" style={{ marginTop: 10 }}>Or leave the hub on overnight: it syncs updates by itself whenever a signal appears.</p>
        </Glass>
        <Glass>
          <CardHead title="Weekly checklist" sub={`${tasks.filter(Boolean).length} of ${TASKS.length} done`}><CheckSquare size={18} color="var(--leaf)" /></CardHead>
          <div className="stack-sm">{TASKS.map((x, i) => <button key={x} type="button" onClick={() => setTasks(tasks.map((v, k) => (k === i ? !v : v)))} className="row small" style={{ border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left', flexWrap: 'nowrap', padding: '3px 0', color: 'inherit' }} aria-pressed={tasks[i]}>{tasks[i] ? <CheckSquare size={17} color="var(--leaf)" /> : <Square size={17} className="faint" />}<span style={{ textDecoration: tasks[i] ? 'line-through' : 'none', opacity: tasks[i] ? .6 : 1 }}>{x}</span></button>)}</div>
        </Glass>
      </div>
      <Glass>
        <CardHead title="What happened on the hub" sub="Plain-language event log"><History size={18} /></CardHead>
        <div className="stack-sm">
          {HUB_EVENTS.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .05 }} className="row" style={{ flexWrap: 'nowrap', padding: '8px 0', borderTop: i ? '1px solid var(--glass-line)' : 0 }}>
              <span className="ic" style={{ width: 30, height: 30, borderRadius: 10, display: 'grid', placeItems: 'center', background: `var(--${{ ai: 'violet', backup: 'river', sync: 'gold', power: 'warn' }[e.k]}-soft)`, color: `var(--${{ ai: 'violet', backup: 'river', sync: 'gold', power: 'warn' }[e.k]})`, flex: 'none' }}>{{ ai: <Cpu size={15} />, backup: <HardDrive size={15} />, sync: <Usb size={15} />, power: <Zap size={15} /> }[e.k]}</span>
              <span className="small" style={{ flex: 1 }}>{e.e}</span><span className="tiny faint num">{e.t}</span>
            </motion.div>
          ))}
        </div>
      </Glass>
      <Notice>Running cost after the pilot: about ₹0 a year apart from electricity. All software is open-source and the hub needs no subscription.</Notice>
    </>
  )
}
