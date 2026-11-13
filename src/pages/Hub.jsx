import { useRef, useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Laptop, Tablet, Smartphone, HardDrive, Usb, BatteryCharging, Cpu, Wifi, RefreshCw, Zap, CheckSquare, Square, Feather, Battery, BatteryLow, Download } from 'lucide-react'
import { useStore } from '../store'
import { DEVICES, STORAGE, HUB_EVENTS } from '../data'
import { Card, CardH, Hero, Kpi, Toggle, Track, Banner, Note, Clock } from '../components/ui'
import { useTokens, Tip } from '../components/charts'

const KIND = { laptop: Laptop, tablet: Tablet, phone: Smartphone }
const TASKS = ['Charge all tablets and phones overnight', 'Check the UPS battery light is green', 'Back up the hub to the 1 TB drive', 'Plug in any pen drive brought from town', 'Print next week’s hint and mission cards']
const SC = ['c2', 'accent', 'c3', 'c4']

function useJob() { const [p, setP] = useState(null); const t = useRef(); const run = (done) => { clearInterval(t.current); setP(0); t.current = setInterval(() => setP((x) => { if (x >= 100) { clearInterval(t.current); done?.(); setTimeout(() => setP(null), 500); return 100 } return x + 5 }), 110) }; return [p, run] }

export default function Hub() {
  const s = useStore(); const t = useTokens()
  const [ai, setAi] = useState(true); const [tasks, setTasks] = useState([true, true, false, false, false])
  const [backup, runBackup] = useJob(); const [pack, runPack] = useJob(); const [last, setLast] = useState('Yesterday 17:40')
  const used = STORAGE.reduce((a, x) => a + x.gb, 0)
  const pie = [...STORAGE.map((x, i) => ({ name: x.name, value: x.gb, fill: t[SC[i]] })), { name: 'Free', value: +(1000 - used).toFixed(1), fill: t.line }]
  const online = DEVICES.filter((d) => d.status === 'online').length
  return (
    <>
      <Hero eyebrow="Operations · Hub health" title="Everything runs in the village." emph="No IT team needed." chips={<><span className="chip acc"><i className="dot pulse" />All services local</span><span className="t2">Devices, storage, backups, power and the AI model in plain language.</span></>} right={<Clock label="IST · HUB UPTIME 6D 4H" />} />
      <Banner items={[
        { tone: 'crit', icon: BatteryLow, title: 'Phone 2 (Hornbill) at 18%', sub: 'Charge before tomorrow’s first class' },
        { tone: 'info', icon: Usb, title: 'Content pack available on pen drive', sub: '3 new Kolibri lessons brought from town on 10 Nov' },
        { tone: 'ok', icon: Zap, title: 'Last power cut handled by UPS', sub: '9 Nov · hub ran 47 minutes on battery with no data loss' },
      ]} />
      <div className="kpis" data-tour="kpis">
        <Kpi label="Devices connected" icon={Wifi} k="var(--c1)" value={online} of={DEVICES.length} meta="On the ROOTS-HUB Wi-Fi" track={{ value: online, max: DEVICES.length }} />
        <Kpi label="Storage used" icon={HardDrive} k="var(--c2)" value={used.toFixed(0)} unit="GB" meta={<>of <b>1 TB</b> external drive</>} track={{ value: used, max: 1000, target: 800 }} />
        <Kpi label="Power" icon={BatteryCharging} k="var(--c4)" value="Mains" meta="UPS charged · about 3 h backup" track={{ value: 100 }} />
        <Kpi label="AI model" icon={Cpu} k="var(--c3)" value={ai ? 'Ready' : 'Off'} meta={ai ? 'Hints stored for 148 questions' : 'Saved hints still work'} />
      </div>
      <div className="grid split-7-5">
        <Card>
          <CardH title="Devices" sub="Tablets and phones join the hub’s own Wi-Fi" />
          <div className="scroll-x"><table className="table">
            <thead><tr><th>Device</th><th>Status</th><th>Battery</th><th>Address</th><th>Seen</th></tr></thead>
            <tbody>{DEVICES.map((d) => { const I = KIND[d.kind]; const low = d.battery < 25; return (
              <tr key={d.id} style={{ opacity: d.status === 'offline' ? .55 : 1 }}>
                <td><span className="row" style={{ flexWrap: 'nowrap' }}><I size={17} className="t3" /><b className="sm">{d.name}</b></span></td>
                <td>{d.status === 'online' ? <span className="tag ok"><i className="dot" />Online</span> : <span className="tag">Offline</span>}</td>
                <td style={{ minWidth: 150 }}><div className="row" style={{ flexWrap: 'nowrap' }}>{d.plugged ? <BatteryCharging size={15} color="var(--ok)" /> : low ? <BatteryLow size={15} color="var(--crit)" /> : <Battery size={15} className="t3" />}<div style={{ flex: 1 }}><Track value={d.battery} k={low ? 'var(--crit)' : 'var(--accent)'} /></div><span className="mono xs">{d.battery}%</span></div></td>
                <td className="mono xs t3">{d.ip}</td><td className="sm t3">{d.last}</td>
              </tr>) })}</tbody>
          </table></div>
        </Card>
        <div className="stack">
          <Card>
            <CardH title="Storage" sub="1 TB external drive" />
            <div className="row" style={{ flexWrap: 'nowrap', gap: 16 }}>
              <div style={{ width: 130, height: 130, flex: 'none' }}><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} startAngle={90} endAngle={-270} stroke="none">{pie.map((p) => <Cell key={p.name} fill={p.fill} />)}</Pie><Tooltip content={<Tip unit=" GB" />} /></PieChart></ResponsiveContainer></div>
              <div className="stack-s" style={{ flex: 1 }}>{STORAGE.map((x, i) => <div key={x.name} className="between sm" style={{ flexWrap: 'nowrap' }}><span className="row t2" style={{ gap: 8, flexWrap: 'nowrap' }}><i style={{ width: 8, height: 8, borderRadius: 2, background: t[SC[i]] }} />{x.name}</span><b className="mono xs">{x.gb} GB</b></div>)}</div>
            </div>
          </Card>
          <Card>
            <CardH title="AI and display" />
            <div className="stack-s">
              <div className="between"><span className="sm row" style={{ gap: 8 }}><Cpu size={15} className="t3" />Small model (writes hints overnight)</span><Toggle checked={ai} onChange={(v) => { setAi(v); s.toast(v ? 'AI model on.' : 'AI off. Saved hints keep practice working.', 'river') }} label="AI model" /></div>
              <div className="between"><span className="sm row" style={{ gap: 8 }}><Feather size={15} className="t3" />Lite mode for older tablets</span><Toggle checked={s.lite} onChange={s.setLite} label="Lite mode" /></div>
            </div>
          </Card>
        </div>
      </div>
      <div className="grid g3">
        <Card>
          <CardH title="Backup" sub={`Last: ${last}`}><HardDrive size={18} color="var(--accent)" /></CardH>
          {backup != null ? <div className="stack-s"><Track value={backup} /><span className="mono xs t3">COPYING TO 1 TB DRIVE · {backup}%</span></div> : <button className="btn primary" onClick={() => runBackup(() => { setLast('Just now'); s.toast('Backup finished. Keep the drive in the locked cupboard.') })}><RefreshCw size={15} />Back up now</button>}
          <p className="xs t3" style={{ marginTop: 12 }}>If the laptop breaks, plug this drive into any computer and everything comes back.</p>
        </Card>
        <Card>
          <CardH title="New content" sub="Without internet"><Usb size={18} color="var(--accent)" /></CardH>
          {pack != null ? <div className="stack-s"><Track value={pack} /><span className="mono xs t3">IMPORTING · {pack}%</span></div> : <button className="btn" onClick={() => runPack(() => s.toast('3 new Kolibri lessons added from the pen drive.'))}><Download size={15} />Import from pen drive</button>}
          <p className="xs t3" style={{ marginTop: 12 }}>Or leave the hub on overnight: it syncs updates whenever a signal appears.</p>
        </Card>
        <Card>
          <CardH title="Weekly checklist" sub={`${tasks.filter(Boolean).length} of ${TASKS.length} done`} />
          <div className="stack-s">{TASKS.map((x, i) => <button key={x} type="button" aria-pressed={tasks[i]} onClick={() => setTasks(tasks.map((v, k) => (k === i ? !v : v)))} className="row sm" style={{ border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left', flexWrap: 'nowrap', padding: '3px 0', color: 'inherit' }}>{tasks[i] ? <CheckSquare size={17} color="var(--accent)" /> : <Square size={17} className="t3" />}<span style={{ textDecoration: tasks[i] ? 'line-through' : 'none', color: tasks[i] ? 'var(--text-3)' : 'var(--text)' }}>{x}</span></button>)}</div>
        </Card>
      </div>
      <Card>
        <CardH title="Event log" sub="What happened on the hub, in plain language" />
        <div className="stack-s">{HUB_EVENTS.map((e, i) => <div key={i} className="row" style={{ flexWrap: 'nowrap', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : 0 }}><span className="mono xs t3" style={{ width: 120, flex: 'none' }}>{e.t}</span><span className="tag" style={{ width: 70, justifyContent: 'center' }}>{e.k.toUpperCase()}</span><span className="sm">{e.e}</span></div>)}</div>
      </Card>
      <Note>Running cost after the pilot: about ₹0 a year apart from electricity. All software is open-source; no subscriptions.</Note>
    </>
  )
}
