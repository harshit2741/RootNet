import { motion } from 'framer-motion'

// Buddy: an original hornbill study buddy. Moods: happy, think, cheer, listen.
export default function Mascot({ size = 96, mood = 'happy', float = true, title = 'Buddy the hornbill' }) {
  const wing = mood === 'cheer' ? -48 : mood === 'listen' ? -12 : 0
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={title}
      animate={float ? { y: [0, -4, 0] } : undefined} transition={float ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}>
      <ellipse cx="58" cy="114" rx="30" ry="4" fill="rgba(0,0,0,.12)" />
      {/* tail */}
      <path d="M34 90 L14 110 L28 113 L42 97 Z" fill="#F4F1E8" />
      <path d="M18 106 L14 110 L28 113 L31 109 Z" fill="#1B2622" />
      {/* body */}
      <ellipse cx="54" cy="80" rx="30" ry="27" fill="#1F2B27" />
      <ellipse cx="60" cy="88" rx="16" ry="16" fill="#F4F1E8" />
      {/* wing */}
      <motion.path d="M36 68 C30 84, 42 100, 62 98 C50 90, 44 80, 48 66 Z" fill="#2E3E37"
        style={{ originX: '46px', originY: '68px' }} animate={{ rotate: wing }} transition={{ type: 'spring', stiffness: 140, damping: 9 }} />
      {/* feet */}
      <path d="M50 104 v6 M62 104 v6" stroke="#E8890C" strokeWidth="4" strokeLinecap="round" />
      {/* head */}
      <circle cx="62" cy="44" r="22" fill="#1F2B27" />
      <path d="M44 56 C50 66, 70 66, 78 56 C70 60, 52 60, 44 56 Z" fill="#F4F1E8" />
      {/* casque + bill */}
      <path d="M75 35 C81 22, 101 20, 111 33 C101 31, 89 33, 79 41 Z" fill="#E8590C" />
      <path d="M78 41 C93 37, 107 44, 115 59 C104 55, 92 53, 79 54 Z" fill="#F5B51B" />
      <path d="M80 48 C92 47, 104 51, 113 57" stroke="#C47F07" strokeWidth="1.4" fill="none" />
      {/* eye */}
      <circle cx="67" cy="41" r="8.5" fill="#7CC8DA" />
      {mood === 'happy' || mood === 'cheer'
        ? <path d="M61.5 42.5 Q67 35.5 72.5 42.5" stroke="#10201A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        : <>
            <circle cx="67" cy="41" r="5.6" fill="#fff" />
            <circle cx={mood === 'think' ? 69 : 68} cy={mood === 'think' ? 39 : 41.5} r="3.1" fill="#10201A" />
            <circle cx={mood === 'think' ? 70 : 69.3} cy={mood === 'think' ? 38 : 40.3} r="1" fill="#fff" />
          </>}
      <circle cx="56" cy="50" r="3.2" fill="#F48FA0" opacity=".55" />
      {mood === 'think' && <g fill="var(--ink-3)"><circle cx="96" cy="14" r="2.4" /><circle cx="104" cy="9" r="3" /><circle cx="113" cy="4" r="3.6" /></g>}
      {mood === 'cheer' && <g stroke="#F5B51B" strokeWidth="2.5" strokeLinecap="round"><path d="M22 30 l-6 -6" /><path d="M30 22 l-2 -8" /><path d="M16 42 l-8 -2" /></g>}
    </motion.svg>
  )
}
