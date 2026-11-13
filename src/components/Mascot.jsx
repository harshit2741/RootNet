import { motion } from 'framer-motion'

// Buddy: an original hornbill guide. Moods: happy, think, cheer, wave.
export default function Mascot({ size = 110, mood = 'happy', float = true, talking = false }) {
  const wing = mood === 'cheer' ? -50 : mood === 'wave' ? -30 : 0
  return (
    <motion.svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Buddy the hornbill"
      animate={talking ? { y: [0, -3, 0], rotate: [0, -2, 2, 0] } : float ? { y: [0, -5, 0] } : undefined} transition={talking ? { duration: .7, repeat: Infinity } : float ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}>
      <ellipse cx="58" cy="114" rx="28" ry="4" fill="rgba(0,0,0,.15)" />
      <path d="M34 90 L14 110 L28 113 L42 97 Z" fill="#FFFFFF" /><path d="M18 106 L14 110 L28 113 L31 109 Z" fill="#1B1D2A" />
      <ellipse cx="54" cy="80" rx="30" ry="27" fill="#23263A" />
      <ellipse cx="60" cy="88" rx="16" ry="16" fill="#FFFFFF" />
      <motion.path d="M36 68 C30 84, 42 100, 62 98 C50 90, 44 80, 48 66 Z" fill="#363A55" style={{ originX: '46px', originY: '68px' }} animate={{ rotate: mood === 'wave' ? [0, -35, 0, -35, 0] : wing }} transition={mood === 'wave' ? { duration: 1.6, repeat: Infinity, repeatDelay: 1.2 } : { type: 'spring', stiffness: 140, damping: 9 }} />
      <path d="M50 104 v6 M62 104 v6" stroke="#FF9F1C" strokeWidth="4" strokeLinecap="round" />
      <circle cx="62" cy="44" r="22" fill="#23263A" />
      <path d="M44 56 C50 66, 70 66, 78 56 C70 60, 52 60, 44 56 Z" fill="#FFFFFF" />
      <path d="M75 35 C81 22, 101 20, 111 33 C101 31, 89 33, 79 41 Z" fill="#FF5A1F" />
      <path d="M78 41 C93 37, 107 44, 115 59 C104 55, 92 53, 79 54 Z" fill="#FFC21A" />
      <motion.path d="M79 49 C92 49, 104 52, 113 58 C102 58, 90 57, 79 55 Z" fill="#E9A400" style={{ originX: '79px', originY: '50px' }} animate={talking ? { rotate: [0, 9, 2, 11, 0] } : { rotate: 0 }} transition={talking ? { duration: .55, repeat: Infinity } : { duration: .2 }} />
      <path d="M80 48 C92 47, 104 51, 113 57" stroke="#D18A00" strokeWidth="1.4" fill="none" />
      <circle cx="67" cy="41" r="8.5" fill="#7DD3E8" />
      {mood === 'happy' || mood === 'cheer'
        ? <path d="M61.5 42.5 Q67 35.5 72.5 42.5" stroke="#10121C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        : <><circle cx="67" cy="41" r="5.6" fill="#fff" /><circle cx={mood === 'think' ? 69 : 68} cy={mood === 'think' ? 39 : 41.5} r="3.1" fill="#10121C" /><circle cx="69.3" cy="40" r="1" fill="#fff" /></>}
      <circle cx="56" cy="50" r="3.2" fill="#FF8FA3" opacity=".6" />
      {mood === 'cheer' && <g stroke="#FFC21A" strokeWidth="3" strokeLinecap="round"><path d="M22 30 l-6 -6" /><path d="M30 22 l-2 -8" /><path d="M16 42 l-8 -2" /></g>}
    </motion.svg>
  )
}
