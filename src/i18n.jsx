// Local-language layer. Only words checked against published Khasi sources are shown on screen
// (numbers: Omniglot; nouns: Intercontinental Dictionary Series / grammar examples).
// Everything else goes through the community Language Desk, where elders and teachers approve translations.
import { useStore } from './store'

export const KHASI = {
  village: 'shnong', child: 'khynnah', children: 'ki khynnah', river: 'wah', bird: 'sim', cave: 'krem', mother: 'kmie', father: 'kpa',
  hen: 'syiar', fish: 'kha', stone: 'maw', new: 'thymmai', year: 'snem', far: 'jngai', book: 'kot', school: 'skul', sing: 'rwai',
  hello: 'Khublei', language: 'Ka Ktien Khasi',
}
const UNITS = ['', 'wei', 'ár', 'lái', 'sáw', 'san', 'hinriw', 'hinniew', 'phrá', 'khyndái']
export function khasiNumber(n) {
  n = Math.round(n)
  if (n < 1 || n > 99) return null
  if (n < 10) return UNITS[n]
  if (n === 10) return 'shi-phew'
  if (n < 20) return `khad-${UNITS[n - 10]}`
  const t = Math.floor(n / 10), u = n % 10
  return `${UNITS[t]}-phew${u ? '-' + UNITS[u] : ''}`
}
export const COUNTING = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ n, w: khasiNumber(n) }))
export const WORD_OF_DAY = [
  { en: 'village', kh: 'shnong', use: 'Our shnong has a river and a school.' },
  { en: 'river', kh: 'wah', use: 'The wah is full after the rain.' },
  { en: 'bird', kh: 'sim', use: 'A sim sits on the bamboo fence.' },
  { en: 'book', kh: 'kot', use: 'Open your kot to the story page.' },
]

export function useKhasi() { return useStore((s) => s.lang === 'kha') }

/* Inline helper: shows the Khasi word under/next to an English word when Khasi is on */
export function Kh({ k, children }) {
  const on = useKhasi()
  if (!on || !KHASI[k]) return children ?? null
  return <span>{children}<span className="kh">{KHASI[k]}</span></span>
}

/* Phrases moving through the community Language Desk */
export const DESK = [
  ...Object.entries(KHASI).slice(0, 10).map(([en, kh]) => ({ en, kh, status: 'approved', by: 'Checked against published word lists + Kong Bandarisha' })),
  { en: 'Try first, then ask for a hint', kh: '', status: 'recording', by: 'Recording requested from Kong Bandarisha' },
  { en: 'Explain why it is right', kh: '', status: 'recording', by: 'Recording requested from Bah Lamare' },
  { en: 'Well done, team!', kh: '', status: 'draft', by: 'Draft by Class 7 students · needs elder review' },
  { en: 'Listen to the story', kh: '', status: 'draft', by: 'Draft by Ms. Lyngdoh · needs elder review' },
  { en: 'Who may hear this recording?', kh: '', status: 'open', by: 'Not started' },
  { en: 'Send to the teacher', kh: '', status: 'open', by: 'Not started' },
]
