import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WifiOff, ShieldCheck, Lightbulb, Users, ArrowRight, Info } from 'lucide-react'
import Mascot from '../components/Mascot'
import { Glass, Notice } from '../components/ui'
import { ROLES } from '../components/Shell'

const DESC = {
  student: 'Learn at your level with your group. Buddy helps you think and never gives the answer.',
  teacher: 'See every group at a glance, catch who is stuck, approve lesson cards the AI drafts for you.',
  village: 'Farmers, artisans and elders share what they know in their own voice. You control who sees it.',
  parent: 'See your child’s progress and Skill Passport in simple pictures.',
  hub: 'For the Digital Didi/Dada: devices, storage, backups and power on the school hub.',
  impact: 'For the School Management Committee: is learning improving, and is the village taking part?',
}
const TONE = { student: 'accent', teacher: 'river', village: 'gold', parent: 'leaf', hub: 'violet', impact: 'leaf' }

export default function Welcome() {
  return (
    <>
      <Glass className="pad-lg" strong style={{ overflow: 'hidden' }}>
        <div className="hero-2">
          <div className="stack" style={{ gap: 16 }}>
            <p className="eyebrow">Offline village learning hub</p>
            <h1 style={{ fontSize: 'clamp(2.1rem,4.2vw,3.4rem)' }}>The village is <span style={{ color: 'var(--accent)' }}>the classroom.</span></h1>
            <p className="muted" style={{ fontSize: '1.05rem', maxWidth: '54ch' }}>Children learn at their own level in small groups. Farmers, artisans and elders become the curriculum. Buddy, a small AI that runs on the school laptop, helps children think and never does the thinking for them.</p>
            <div className="row"><Link to="/student" className="btn primary">Start as a student <ArrowRight size={17} /></Link><Link to="/teacher" className="btn">Open the teacher view</Link></div>
            <div className="row small faint" style={{ gap: 16 }}>
              <span className="row" style={{ gap: 6 }}><WifiOff size={15} />Works with no internet</span>
              <span className="row" style={{ gap: 6 }}><Lightbulb size={15} />Hints, never answers</span>
              <span className="row" style={{ gap: 6 }}><ShieldCheck size={15} />Consent-first</span>
              <span className="row" style={{ gap: 6 }}><Users size={15} />One device per group</span>
            </div>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', position: 'relative' }}>
            <div className="neu" style={{ width: 260, height: 260, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
              <Mascot size={210} mood="cheer" />
            </div>
            <motion.div className="glass strong" style={{ position: 'absolute', top: 10, left: 0, padding: '10px 14px', borderRadius: 16, maxWidth: 220 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}>
              <p className="small"><b>Khublei!</b> I’m Buddy. Show me your try, and I’ll help you take the next step.</p>
            </motion.div>
          </div>
        </div>
      </Glass>

      <div className="between"><h2>Who is using ROOTS right now?</h2><span className="small faint">Each view is designed for a different person in the village</span></div>
      <div className="grid g3">
        {ROLES.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}>
            <Link to={r.home} className="glass role-card" style={{ color: 'inherit', height: '100%' }}>
              <span className="ic" style={{ background: `var(--${TONE[r.id]}-soft)`, color: `var(--${TONE[r.id]})` }}><r.icon /></span>
              <h3 style={{ fontSize: '1.15rem' }}>{r.label}</h3>
              <p className="small muted">{DESC[r.id]}</p>
              <span className="small row" style={{ gap: 6, color: 'var(--accent)', fontWeight: 600 }}>Open <ArrowRight size={15} /></span>
            </Link>
          </motion.div>
        ))}
      </div>
      <Notice icon={Info}>This is a clickable prototype for the ProdMad 6.0 ROOTS case. Everything you see uses fictional sample data and runs in your browser. Recording, the AI model and syncing are simulated. <Link to="/privacy/prototype">Read the prototype disclaimer</Link>.</Notice>
    </>
  )
}
