import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WifiOff, ShieldCheck, Users, ArrowRight, IndianRupee, Volume2, Sprout, Play, Lightbulb } from 'lucide-react'
import { Card, CardH, Hero, Note } from '../components/ui'
import { ROLES } from '../components/Shell'
import { useTour } from '../components/Tour'

const DESC = {
  teacher: 'See every group live, catch who is stuck, approve lesson cards the AI drafts for you.',
  student: 'Quests, a learning path through the village, and Buddy who helps you think.',
  village: 'Farmers, artisans and elders record what they know, in their own voice.',
  parent: 'Progress in simple steps. No marks, no ranks, full control of consent.',
  hub: 'Devices, storage, power and backups, explained in plain words.',
  impact: 'Learning levels, village participation, budget and the pilot plan.',
}
const WHY = [
  [WifiOff, 'var(--c2)', 'Works with no internet', 'The school laptop is the hub. Tablets join its own Wi-Fi. New content arrives by pen drive.'],
  [Volume2, 'var(--c5)', 'Read aloud everywhere', 'Every page has a Read aloud button for slow readers and elders.'],
  [Users, 'var(--c3)', 'One tablet per group', 'Groups of 3–4 share a device with rotating roles. No passwords, no personal phones.'],
  [Sprout, 'var(--c1)', 'The village is the curriculum', 'Recordings from farmers, artisans and elders become lesson cards linked to the syllabus.'],
  [Lightbulb, 'var(--c4)', 'Hints, never answers', 'Try first, then a nudge, then a village example. The Checker explains every answer.'],
  [IndianRupee, 'var(--c6)', '₹50,000 once, ≈ ₹0 a year', 'Open-source software and a small AI on the laptop. No subscriptions.'],
]

export default function Welcome() {
  const start = useTour((t) => t.start)
  return (
    <>
      <Hero eyebrow="ROOTS · Offline village learning hub" title="The village is" emph="the classroom." mood="cheer"
        say="The village is the classroom. Children learn at their own level, farmers, artisans and elders become the curriculum, and Buddy helps children think without giving answers."
        chips={<><button className="btn gold" onClick={start}><Play size={17} />Watch the 3-minute demo</button><Link to="/student" className="chip" style={{ textDecoration: 'none', height: 44 }}>Start learning<ArrowRight size={15} /></Link><span className="t2">Built for a remote village in Northeast India</span></>} />

      <div className="grid g3" data-tour="roles">
        {ROLES.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}>
            <Link to={r.home} className="card" style={{ display: 'block', textDecoration: 'none', overflow: 'hidden', height: '100%' }}>
              <div style={{ background: r.dot, color: '#fff', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                <span style={{ width: 48, height: 48, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.22)' }}><r.icon size={24} /></span>
                <div><h2 style={{ color: '#fff' }}>{r.label}</h2><span className="xs" style={{ opacity: .85, fontWeight: 800 }}>{r.sub}</span></div>
              </div>
              <div style={{ padding: '16px 20px 20px', display: 'grid', gap: 12 }}>
                <p className="sm t2">{DESC[r.id]}</p>
                <span className="sm row" style={{ gap: 6, color: r.dot, fontWeight: 800 }}>Open <ArrowRight size={15} /></span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardH title="Why it works in a village" sub="Designed around slow internet, few devices and very different levels in one classroom" />
        <div className="grid g3">
          {WHY.map(([I, c, t, d]) => (
            <div key={t} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ width: 46, height: 46, borderRadius: 15, display: 'grid', placeItems: 'center', background: c, color: '#fff', flex: 'none', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.15)' }}><I size={22} /></span>
              <div><b>{t}</b><p className="sm t2">{d}</p></div>
            </div>
          ))}
        </div>
      </Card>
      <Note icon={ShieldCheck}>Clickable prototype for the ProdMad 6.0 ROOTS case. All data is fictional; recording, AI and sync are simulated. <Link to="/privacy/prototype">Prototype disclaimer</Link>.</Note>
    </>
  )
}
