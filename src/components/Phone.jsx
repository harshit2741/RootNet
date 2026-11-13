import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Clapperboard, Sparkles, BookHeart, Trophy, WifiOff, BatteryMedium, Signal, Smartphone, Wifi, Users, Volume2, Lightbulb, Languages, Flame } from 'lucide-react'
import { useStore } from '../store'

// Student screens are shown inside a phone, because children will use phones and shared tablets.
const INFO = {
  '/student': ['Home', ['Daily quests with a reward chest', 'Learning path through the village', 'Village Tree grows with the whole class', 'Khasi word of the day']],
  '/student/class': ['Buddy’s Class', ['Cartoon hornbill tutor that talks', 'Chalkboard animations', 'Quick quizzes with instant cheers']],
  '/student/practice': ['Practise with Buddy', ['Hints stay locked until the group tries', 'Village examples as hints', 'Checker explains before saving']],
  '/student/ask': ['Ask Buddy', ['Answers only from approved lessons', 'Always shows the source', 'Refuses to solve sums for you']],
  '/student/stories': ['Story Circle', ['Elders’ folk tales, riddles, songs', 'Narrated picture-book scenes', 'Questions to talk about']],
  '/student/leaderboard': ['Leaderboard', ['Daily Top 10 learners', 'Group league and weekly prizes', 'Teacher can hide it any time']],
  '/student/library': ['Village library', ['Lesson cards from village voices', 'Hear the contributor speak', 'Linked to the school syllabus']],
}
const TABS = [['/student', 'Home', Home], ['/student/class', 'Class', Clapperboard], ['/student/practice', 'Practise', Sparkles], ['/student/stories', 'Stories', BookHeart], ['/student/leaderboard', 'League', Trophy]]

function StatusTime() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 15000); return () => clearInterval(i) }, [])
  const ist = new Date(t.getTime() + (t.getTimezoneOffset() + 330) * 60000)
  return <b>{ist.getHours()}:{String(ist.getMinutes()).padStart(2, '0')}</b>
}

export default function PhoneStage({ children }) {
  const { pathname } = useLocation(); const ref = useRef()
  const s = useStore(); const g = s.groups.find((x) => x.id === s.activeGroup)
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0 }, [pathname])
  const [title, points] = INFO[pathname] || INFO['/student']
  return (
    <div className="stage">
      <aside className="stage-side hide-m">
        <span className="eyebrow">Student app · on a phone</span>
        <h2 style={{ fontSize: '1.6rem', marginTop: 8 }}>Built for the phones children already share.</h2>
        <p className="t2" style={{ marginTop: 10 }}>Works on a basic Android phone or shared tablet. The school laptop serves it over its own Wi-Fi, so no mobile data is used.</p>
        <div className="stack-s" style={{ marginTop: 18 }}>
          {[[Smartphone, 'Any basic phone or tablet'], [Wifi, 'Hub Wi-Fi, no mobile data'], [Users, 'One device per group of 3–4'], [Volume2, 'Read aloud on every screen']].map(([I, t]) => <span key={t} className="row sm" style={{ flexWrap: 'nowrap' }}><span className="stage-ic"><I size={16} /></span>{t}</span>)}
        </div>
      </aside>
      <div className="phone-wrap">
        <span className="halo" aria-hidden="true" />
        {[[WifiOff, 'Works offline', 'f1'], [Volume2, 'Read aloud', 'f2'], [Lightbulb, 'Hints, not answers', 'f3'], [Languages, 'Khasi words', 'f4']].map(([I, t, c]) => <span key={t} className={`float-chip ${c}`} aria-hidden="true"><I size={14} />{t}</span>)}
        <div className="phone" aria-label="Student app on a phone">
          <div className="phone-screen">
            <span className="island" aria-hidden="true"><i /></span>
            <div className="phone-status"><StatusTime /><span className="row" style={{ gap: 5 }}><Signal size={14} /><WifiOff size={14} /><BatteryMedium size={17} /></span></div>
            <div className="phone-app">
              <span className="row" style={{ gap: 10, flexWrap: 'nowrap' }}><span className="phone-logo">R</span><span><b style={{ display: 'block', lineHeight: 1.1 }}>ROOTS</b><span className="xs t3">Learn together</span></span></span>
              <span className="row" style={{ gap: 6, flexWrap: 'nowrap' }}><span className="phone-pill"><Flame size={13} />{g.streak}</span><span className="phone-pill acc">{g.name}</span></span>
            </div>
            <div className="phone-scroll content" ref={ref}>{children}</div>
            <nav className="phone-tabs" aria-label="Student app tabs">
              {TABS.map(([to, l, I]) => <NavLink key={to} to={to} end className={({ isActive }) => (isActive ? 'on' : '')}><span className="ti"><I size={20} /></span><span>{l}</span></NavLink>)}
            </nav>
            <span className="home-bar" aria-hidden="true" />
          </div>
        </div>
      </div>
      <aside className="stage-side hide-m">
        <span className="eyebrow">On this screen</span>
        <h2 style={{ fontSize: '1.3rem', marginTop: 8 }}>{title}</h2>
        <ul className="stage-list">{points.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="xs t3" style={{ marginTop: 16 }}>Tap the tabs at the bottom of the phone to move around, just like a child would.</p>
      </aside>
    </div>
  )
}
