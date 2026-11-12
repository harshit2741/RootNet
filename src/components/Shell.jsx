import { useEffect } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Sparkles, MessagesSquare, BookOpen, LayoutDashboard, Users, ClipboardCheck, Flag, Bot, Mic, HeartHandshake, Server, LineChart, ShieldCheck, Sun, Moon, Feather, WifiOff, GraduationCap } from 'lucide-react'
import { useStore } from '../store'
import { Toggle, Toasts } from './ui'

export const ROLES = [
  { id: 'student', label: 'Student', icon: GraduationCap, home: '/student' },
  { id: 'teacher', label: 'Teacher', icon: LayoutDashboard, home: '/teacher' },
  { id: 'village', label: 'Village Voice', icon: Mic, home: '/village' },
  { id: 'parent', label: 'Parent', icon: HeartHandshake, home: '/parent' },
  { id: 'hub', label: 'Hub admin', icon: Server, home: '/hub' },
  { id: 'impact', label: 'Impact', icon: LineChart, home: '/impact' },
]

function useNav() {
  const s = useStore()
  const pend = s.records.filter((r) => r.status === 'pending').length
  const stuck = s.groups.filter((g) => g.status === 'stuck').length
  return {
    student: [['/student', 'My learning space', Home], ['/student/practice', 'Practise with Buddy', Sparkles], ['/student/ask', 'Ask Buddy', MessagesSquare], ['/student/library', 'Village library', BookOpen]],
    teacher: [['/teacher', 'Class overview', LayoutDashboard, stuck, 'warn'], ['/teacher/groups', 'Groups & skills', Users], ['/teacher/approvals', 'Approvals', ClipboardCheck, pend], ['/teacher/missions', 'Missions & passport', Flag], ['/teacher/assistant', 'Teaching assistant', Bot]],
    village: [['/village', 'My Village Voices', Mic]],
    parent: [['/parent', 'My child', HeartHandshake]],
    hub: [['/hub', 'Hub health', Server]],
    impact: [['/impact', 'Pilot impact', LineChart]],
  }
}

export function roleOf(path) {
  const r = path.split('/')[1]
  return ROLES.find((x) => x.id === r)?.id || null
}

function Scenery() {
  return (
    <div className="scenery" aria-hidden="true">
      <div className="sun" />
      <svg viewBox="0 0 1440 560" preserveAspectRatio="none">
        <path d="M0 250 C160 170 300 210 430 160 C560 110 690 190 820 150 C980 100 1110 170 1240 130 C1340 100 1400 120 1440 110 V560 H0Z" style={{ fill: 'var(--hill-1)' }} />
        <path d="M0 330 C140 280 260 320 400 270 C560 214 700 300 860 260 C1010 222 1150 290 1290 250 C1370 228 1420 240 1440 236 V560 H0Z" style={{ fill: 'var(--hill-2)' }} opacity=".9" />
        <path d="M0 420 C180 360 330 410 520 370 C700 332 860 400 1040 362 C1200 330 1340 372 1440 350 V560 H0Z" style={{ fill: 'var(--hill-3)' }} opacity=".75" />
        <path d="M0 500 C220 450 420 492 640 462 C860 432 1060 488 1260 458 C1350 445 1410 452 1440 448 V560 H0Z" style={{ fill: 'var(--hill-4)' }} opacity=".55" />
        <path d="M0 300 C300 290 520 320 760 300 C1000 280 1200 310 1440 296" style={{ stroke: 'var(--mist)', fill: 'none' }} strokeWidth="26" opacity=".35" />
      </svg>
    </div>
  )
}

export default function Shell({ children }) {
  const { theme, setTheme, lite, setLite } = useStore()
  const loc = useLocation(); const nav = useNavigate()
  const role = roleOf(loc.pathname)
  const NAV = useNav()
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.dataset.lite = String(lite) }, [theme, lite])
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  const items = role ? NAV[role] : []
  const Item = ([to, label, Icon, count, tone]) => (
    <NavLink key={to} to={to} end className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
      <Icon />{label}{count ? <span className={`count ${tone || ''}`}>{count}</span> : null}
    </NavLink>
  )
  return (
    <>
      <Scenery />
      <div className="app">
        <aside className="side" aria-label="Main navigation">
          <div className="glass">
            <Link to="/" className="logo" aria-label="ROOTS home">
              <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="11" style={{ fill: 'var(--accent)' }} /><path d="M17 26 V14 M17 18 C12 18 10 14 10 10 C14 10 17 13 17 18 M17 16 C22 16 24 12 24 8 C20 8 17 11 17 16 M17 26 C14 26 11 28 9 30 M17 26 C20 26 23 28 25 30" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
              <span><b>ROOTS</b><small>The village is the classroom</small></span>
            </Link>
            <div className="weave" />
            {role && <><p className="eyebrow" style={{ padding: '0 8px' }}>{ROLES.find((r) => r.id === role).label}</p><nav className="navlist">{items.map(Item)}</nav></>}
            <div className="divider" />
            <p className="eyebrow" style={{ padding: '0 8px' }}>Switch view</p>
            <nav className="navlist" aria-label="Switch view">
              {ROLES.filter((r) => r.id !== role).map((r) => <NavLink key={r.id} to={r.home} className="navitem"><r.icon />{r.label}</NavLink>)}
            </nav>
            <div className="sidefoot">
              <NavLink to="/privacy" className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}><ShieldCheck />Privacy & safety</NavLink>
              <div className="well" style={{ padding: 12, display: 'grid', gap: 10 }}>
                <div className="between"><span className="small row" style={{ gap: 6 }}><Feather size={15} />Lite mode</span><Toggle checked={lite} onChange={setLite} label="Lite mode: turns off glass blur for older tablets" /></div>
                <p className="tiny faint">Turns off glass effects so older tablets stay fast.</p>
              </div>
            </div>
          </div>
        </aside>
        <div className="main">
          <div className="glass topbar">
            <span className="pill leaf"><WifiOff size={13} />Offline · ROOTS-HUB Wi-Fi</span>
            <span className="pill gold">Prototype · sample data</span>
            <span className="spacer" />
            <label className="sr-only" htmlFor="role-switch">Switch view</label>
            <select id="role-switch" className="select" style={{ width: 'auto', minHeight: 40, padding: '6px 12px' }} value={role || ''} onChange={(e) => nav(ROLES.find((r) => r.id === e.target.value).home)}>
              {!role && <option value="">Choose a view…</option>}
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label} view</option>)}
            </select>
            <button type="button" className="btn icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
          {role && <nav className="mobile-nav" aria-label="Section navigation">{items.map(Item)}<NavLink to="/privacy" className="navitem"><ShieldCheck />Privacy</NavLink></nav>}
          <main className="content" id="main">{children}</main>
          <footer className="footer">
            <span>© 2026 ROOTS · ProdMad 6.0 prototype</span>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/privacy/children">Children’s data</Link>
            <Link to="/privacy/ai">How the AI works</Link>
            <Link to="/privacy/knowledge">Community knowledge rights</Link>
            <Link to="/privacy/access">Accessibility</Link>
            <Link to="/privacy/prototype">Prototype disclaimer</Link>
            <span style={{ flexBasis: '100%' }}>All people, names and numbers shown are fictional sample data. This prototype stores nothing on a server: everything stays in your browser.</span>
          </footer>
        </div>
      </div>
      <Toasts />
    </>
  )
}
