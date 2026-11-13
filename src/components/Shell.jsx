import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Sparkles, MessagesSquare, BookOpen, LayoutDashboard, Users, ClipboardCheck, Flag, Bot, Mic, HeartHandshake, Server, LineChart, ShieldCheck, Sun, Moon, Search, Bell, Presentation, ChevronLeft, ChevronRight, ChevronsUpDown, PanelLeftClose, PanelLeftOpen, Menu, ChevronUp, ChevronDown, X, BatteryCharging, Cpu, WifiOff, CornerDownLeft, AlertTriangle, Gift, BatteryLow } from 'lucide-react'
import { useStore } from '../store'
import { DEVICES } from '../data'
import { Seg, Toasts, Modal } from './ui'
import Tour, { TourPrompt, useTour } from './Tour'
import Intro from './Intro'
import PhoneStage from './Phone'
import { PlayCircle, Clapperboard, BookHeart, Trophy, Languages } from 'lucide-react'
import { KHASI } from '../i18n'

export const ROLES = [
  { id: 'teacher', label: 'Teacher', sub: 'Classroom command', icon: LayoutDashboard, home: '/teacher', dot: '#0E9F6E' },
  { id: 'student', label: 'Student', sub: 'Learning space', icon: Sparkles, home: '/student', dot: '#7C3AED' },
  { id: 'village', label: 'Village Voice', sub: 'Knowledge holders', icon: Mic, home: '/village', dot: '#EA6A12' },
  { id: 'parent', label: 'Parent', sub: 'Family view', icon: HeartHandshake, home: '/parent', dot: '#DB2777' },
  { id: 'hub', label: 'Hub admin', sub: 'Digital Didi / Dada', icon: Server, home: '/hub', dot: '#0284C7' },
  { id: 'impact', label: 'Impact', sub: 'School committee', icon: LineChart, home: '/impact', dot: '#4F46E5' },
]
export const roleOf = (path) => ROLES.find((r) => r.id === path.split('/')[1])?.id || null

function useNav() {
  const s = useStore()
  const pend = s.records.filter((r) => r.status === 'pending').length
  const stuck = s.groups.filter((g) => g.status === 'stuck').length
  return {
    teacher: [['Classroom', [['/teacher', 'Command center', LayoutDashboard, stuck, true], ['/teacher/groups', 'Groups & skills', Users], ['/teacher/approvals', 'Approvals', ClipboardCheck, pend]]], ['Programme', [['/teacher/missions', 'Missions & passport', Flag], ['/teacher/language', 'Language desk', Languages], ['/teacher/assistant', 'Teaching assistant', Bot]]]],
    student: [['Learn', [['/student', 'Home', Home], ['/student/class', 'Buddy’s Class', Clapperboard], ['/student/practice', 'Practise with Buddy', Sparkles], ['/student/ask', 'Ask Buddy', MessagesSquare]]], ['Explore', [['/student/stories', 'Story Circle', BookHeart], ['/student/library', 'Village library', BookOpen, null, false, 'kot'], ['/student/leaderboard', 'Group League', Trophy]]]],
    village: [['Village Voice', [['/village', 'My recordings', Mic, null, false, 'shnong']]]],
    parent: [['Family', [['/parent', 'My child', HeartHandshake]]]],
    hub: [['Operations', [['/hub', 'Hub health', Server]]]],
    impact: [['Programme', [['/impact', 'Pilot impact', LineChart]]]],
  }
}
const TITLES = { '/teacher': 'Command center', '/teacher/groups': 'Groups & skills', '/teacher/approvals': 'Approvals', '/teacher/missions': 'Missions & passport', '/teacher/assistant': 'Teaching assistant', '/student': 'Home', '/student/practice': 'Practise with Buddy', '/student/ask': 'Ask Buddy', '/student/library': 'Village library', '/student/class': 'Buddy’s Class', '/student/stories': 'Story Circle', '/student/leaderboard': 'Group League', '/teacher/language': 'Language desk', '/village': 'My recordings', '/parent': 'My child', '/hub': 'Hub health', '/impact': 'Pilot impact' }

function Logo() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><path d="M12 21V10" /><path d="M12 13c-4 0-6-3-6-7 3.5 0 6 2.5 6 7Z" /><path d="M12 11c0-4.5 2.5-7 6-7 0 4-2 7-6 7Z" /><path d="M12 21c-2.5 0-5 1-6.5 2M12 21c2.5 0 5 1 6.5 2" /></svg>
}

function Palette({ open, onClose }) {
  const nav = useNavigate(); const s = useStore()
  const [q, setQ] = useState(''); const [i, setI] = useState(0)
  const items = useMemo(() => [
    ...Object.entries(TITLES).map(([to, l]) => ({ l, k: ROLES.find((r) => r.id === to.split('/')[1]).label, run: () => nav(to) })),
    { l: 'Privacy & safety', k: 'Trust', run: () => nav('/privacy') },
    { l: s.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', k: 'Action', run: () => s.setTheme(s.theme === 'dark' ? 'light' : 'dark') },
    { l: s.collapsed ? 'Expand control panel' : 'Collapse control panel', k: 'Action', run: () => s.setCollapsed(!s.collapsed) },
    { l: 'Present mode', k: 'Action', run: () => s.setPresent(true) },
  ], [s.theme, s.collapsed]) // eslint-disable-line react-hooks/exhaustive-deps
  const list = items.filter((x) => (x.l + ' ' + x.k).toLowerCase().includes(q.toLowerCase()))
  useEffect(() => { if (open) { setQ(''); setI(0) } }, [open])
  const go = (x) => { x.run(); onClose() }
  return (
    <Modal open={open} onClose={onClose} width={600}>
      <div className="palette" onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(v + 1, list.length - 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(v - 1, 0)) } if (e.key === 'Enter' && list[i]) go(list[i]) }}>
        <div className="row" style={{ flexWrap: 'nowrap', gap: 6 }}><Search size={18} className="t3" /><input autoFocus className="input" placeholder="Jump to a dashboard or run an action…" value={q} onChange={(e) => { setQ(e.target.value); setI(0) }} aria-label="Search" /></div>
        <div style={{ marginTop: 8, display: 'grid', gap: 2 }}>
          {list.map((x, k) => <button key={x.l} type="button" className={`pal-item ${k === i ? 'on' : ''}`} onMouseEnter={() => setI(k)} onClick={() => go(x)}>{x.l}<small>{x.k}</small>{k === i && <CornerDownLeft size={14} className="t3" />}</button>)}
          {!list.length && <p className="t3 sm" style={{ padding: 12 }}>Nothing matches “{q}”.</p>}
        </div>
      </div>
    </Modal>
  )
}

function Notifications() {
  const s = useStore(); const nav = useNavigate(); const [open, setOpen] = useState(false); const [seen, setSeen] = useState(false); const ref = useRef()
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  const list = [
    ...s.groups.filter((g) => g.status === 'stuck').map((g) => ({ i: AlertTriangle, c: 'var(--warn)', t: `${g.name} group needs help`, d: g.note, to: '/teacher' })),
    ...s.records.filter((r) => r.status === 'pending').map((r) => ({ i: ClipboardCheck, c: 'var(--accent)', t: `Lesson card ready: ${r.title}`, d: `${r.who} · AI draft to approve`, to: '/teacher/approvals' })),
    ...DEVICES.filter((d) => d.battery < 25).map((d) => ({ i: BatteryLow, c: 'var(--crit)', t: `${d.name} battery ${d.battery}%`, d: 'Charge before tomorrow’s class', to: '/hub' })),
    ...s.records.filter((r) => r.dividend?.status === 'ready').map((r) => ({ i: Gift, c: 'var(--c4)', t: `Dividend ready for ${r.who}`, d: r.dividend.item, to: '/teacher/missions' })),
  ]
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button className="ctl icon" aria-label={`Notifications, ${list.length}`} aria-expanded={open} onClick={() => { setOpen(!open); setSeen(true) }}><Bell size={18} />{!seen && list.length > 0 && <span className="dot-hot" />}</button>
      <AnimatePresence>{open && (
        <motion.div className="pop" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          <div className="between" style={{ padding: '6px 8px 10px' }}><b>Notifications</b><span className="tag">{list.length}</span></div>
          {list.map((x, k) => <button key={k} type="button" className="pal-item" onClick={() => { nav(x.to); setOpen(false) }} style={{ alignItems: 'flex-start' }}><x.i size={17} color={x.c} style={{ marginTop: 2, flex: 'none' }} /><span><span className="b sm" style={{ display: 'block' }}>{x.t}</span><span className="xs t3">{x.d}</span></span></button>)}
        </motion.div>)}</AnimatePresence>
    </div>
  )
}

function Workspace({ role, collapsed }) {
  const [open, setOpen] = useState(false); const ref = useRef(); const r = ROLES.find((x) => x.id === role) || { label: 'All dashboards', sub: 'Choose a space', icon: LayoutDashboard }
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button className="ws" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Switch dashboard" title={collapsed ? `${r.label} · switch dashboard` : undefined}>
        <span className="ic"><r.icon size={16} /></span>
        <span className="hide-c" style={{ flex: 1, minWidth: 0 }}><b style={{ display: 'block', fontSize: '.95rem' }}>{r.label}</b><span className="xs t3">{r.sub}</span></span>
        <ChevronsUpDown size={15} className="hide-c" style={{ opacity: .7 }} />
      </button>
      {open && <div className="ws-menu" style={collapsed ? { width: 240 } : undefined}>
        {ROLES.map((x) => <Link key={x.id} to={x.home} className={x.id === role ? 'on' : ''} onClick={() => setOpen(false)}><i style={{ background: x.dot }} />{x.label}<span className="xs t3" style={{ marginLeft: 'auto' }}>{x.sub}</span></Link>)}
      </div>}
    </div>
  )
}

export default function Shell({ children }) {
  const s = useStore(); const loc = useLocation(); const navTo = useNavigate()
  const role = roleOf(loc.pathname)
  const NAV = useNav()
  const [pal, setPal] = useState(false); const [mob, setMob] = useState(false)
  const introOn = useTour((t) => t.intro)
  // set theme + per-dashboard accent before children render so charts read the right colours
  document.documentElement.dataset.theme = s.theme
  document.documentElement.dataset.view = role || 'student'
  useEffect(() => { if (!useTour.getState().running) window.scrollTo(0, 0); setMob(false) }, [loc.pathname])
  useEffect(() => { let seen = false; try { seen = !!localStorage.getItem('roots:toured') } catch { /* storage off */ } if (!seen) { const t = setInterval(() => { const st = useTour.getState(); if (!st.intro && !st.running) { st.setPrompt(true); clearInterval(t) } }, 1400); return () => clearInterval(t) } }, [])
  useEffect(() => {
    const k = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(true) }
      if (e.key === 'Escape' && useStore.getState().present) s.setPresent(false)
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') { e.preventDefault(); s.setCollapsed(!useStore.getState().collapsed) }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const r = ROLES.find((x) => x.id === role)
  const page = TITLES[loc.pathname] || (loc.pathname.startsWith('/privacy') ? 'Privacy & safety' : 'Welcome')
  const online = DEVICES.filter((d) => d.status === 'online').length
  const sections = role ? NAV[role] : []
  return (
    <>
      <div className={`shell ${s.collapsed ? 'collapsed' : ''} ${s.present ? 'present' : ''} ${mob ? 'mobile-open' : ''}`} onClick={(e) => { if (mob && e.target.classList?.contains('shell')) setMob(false) }}>
        <aside className="side" aria-label="Control panel">
          <div className="side-in">
            <Link to="/" className="brand" title="ROOTS OS">
              <span className="mark"><Logo /></span>
              <span className="hide-c"><b>ROOTS <span>OS</span></b><small>Offline village learning hub</small></span>
            </Link>
            <Workspace role={role} collapsed={s.collapsed} />
            {sections.map(([label, items]) => (
              <div key={label} className="stack-s">
                <span className="nav-label">{label}</span>
                <nav className="nav">{items.map(([to, l, I, c, hot, khw]) => <NavLink key={to} to={to} end title={s.collapsed ? l : undefined} className={({ isActive }) => (isActive ? 'active' : '')}><I /><span className="hide-c">{l}{s.lang === 'kha' && khw && <span className="kh">{khw}</span>}</span>{c ? <span className={`cnt ${hot ? 'hot' : ''}`}>{c}</span> : null}</NavLink>)}</nav>
              </div>
            ))}
            <div className="stack-s">
              <span className="nav-label">Trust</span>
              <nav className="nav"><NavLink to="/privacy" title={s.collapsed ? 'Privacy & safety' : undefined} className={({ isActive }) => (isActive ? 'active' : '')}><ShieldCheck /><span className="hide-c">Privacy & safety</span></NavLink></nav>
            </div>
            <div className="side-widget hide-c">
              <div className="row" style={{ flexWrap: 'nowrap', gap: 12 }}>
                <span style={{ width: 40, height: 40, borderRadius: 13, display: 'grid', placeItems: 'center', background: 'var(--p-soft)', color: 'var(--p)', flex: 'none' }}><BatteryCharging size={20} /></span>
                <div><b className="mono" style={{ fontSize: '1.15rem' }}>100%</b><div className="xs t3">Hub on mains · UPS ready</div></div>
              </div>
              <span className="row xs" style={{ gap: 6, color: 'var(--ok)', fontWeight: 800 }}><i className="dot pulse" />Offline · all services local</span>
              <div className="row2">
                <div><b className="mono">{online}/{DEVICES.length}</b><div className="xs t3">Devices on Wi-Fi</div></div>
                <div><b className="mono row" style={{ gap: 5 }}><Cpu size={13} />Ready</b><div className="xs t3">Small AI model</div></div>
              </div>
            </div>
            <button className="collapse-btn hide-m" onClick={() => s.setCollapsed(!s.collapsed)} aria-label={s.collapsed ? 'Expand control panel' : 'Collapse control panel'} title="Ctrl + \">{s.collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}<span className="hide-c" style={{ fontSize: '.86rem' }}>Collapse panel</span></button>
          </div>
        </aside>

        <div className="main">
          {!s.present && <header className="top">
            <button className="ctl icon show-m" aria-label="Open control panel" onClick={() => setMob(true)}><Menu size={18} /></button>
            <nav className="crumbs" aria-label="Breadcrumb">
              {r && <><Link to={r.home} className="hide-m">{r.label}</Link><span className="t3 hide-m">/</span></>}
              <b>{page}</b>

            </nav>
            <span className="grow" />
            <div className="period hide-m hide-l" role="group" aria-label="Reporting period">
              <button aria-label="Previous week" onClick={() => s.setWeek(s.week - 1)}><ChevronLeft size={16} /></button>
              <div><b className="sm">Week {s.week} · Nov 2026</b><small>PILOT · MONTH 3</small></div>
              <button aria-label="Next week" onClick={() => s.setWeek(s.week + 1)}><ChevronRight size={16} /></button>
            </div>
            <button className="ctl hide-m" onClick={() => setPal(true)} aria-label="Search, Ctrl K"><Search size={16} /><span className="t2" style={{ fontWeight: 500 }}>Search</span><kbd>⌘K</kbd></button>
            <button className="ctl icon show-m" onClick={() => setPal(true)} aria-label="Search"><Search size={17} /></button>
            <button className="ctl demo" onClick={() => useTour.getState().start()} data-tour="demo-btn"><PlayCircle size={17} /><span className="hide-m">Watch demo</span></button>
            <Notifications />
            <button className="ctl icon hide-m" onClick={() => s.setPresent(true)} aria-label="Present mode" title="Present"><Presentation size={17} /></button>
            <Seg value={s.lang} onChange={s.setLang} label="Language" options={[['en', <><Languages size={14} />EN</>], ['kha', 'Khasi']]} />
            <Seg value={s.theme} onChange={s.setTheme} label="Theme" options={[['light', <><Sun size={14} /><span className="hide-m">Light</span></>], ['dark', <><Moon size={14} /><span className="hide-m">Dark</span></>]]} />
          </header>}
          {s.present && <button className="ctl" style={{ position: 'fixed', top: 16, right: 16, zIndex: 30 }} onClick={() => s.setPresent(false)}><X size={16} />Exit presentation <kbd>Esc</kbd></button>}
          {role === 'student' ? <main className="content stage-wrap" id="main"><PhoneStage>{children}</PhoneStage></main> : <main className="content" id="main">{children}</main>}
          {s.footOpen && !s.present ? (
            <footer className="foot">
              <span>© 2026 ROOTS <span className="t3">(prototype)</span> · ProdMad 6.0 · all data illustrative</span>
              <span className="grow" />
              <Link to="/privacy">Privacy policy</Link><Link to="/privacy/children">Children’s data</Link><Link to="/privacy/ai">AI use</Link><Link to="/privacy/knowledge">Community knowledge</Link><Link to="/privacy/access">Accessibility</Link><Link to="/privacy/prototype">Data disclaimer</Link>
              <button className="btn small icon" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ChevronUp size={15} /></button>
              <button className="btn small icon" aria-label="Hide footer" onClick={() => s.setFootOpen(false)}><X size={15} /></button>
            </footer>
          ) : !s.present && <button className="btn small foot-mini" onClick={() => s.setFootOpen(true)}><ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} />Legal & privacy</button>}
        </div>
      </div>
      <Palette open={pal} onClose={() => setPal(false)} />
      <Tour />
      <TourPrompt />
      {introOn && <Intro onDone={() => useTour.getState().setIntro(false)} />}
      <Toasts />
    </>
  )
}
