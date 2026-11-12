// Sample data for the prototype. All names are fictional and chosen to fit a Khasi-speaking village in Meghalaya.
// In the real hub this lives in SQLite on the school laptop.

export const AV = ['#B8213F', '#1F8A5B', '#C77A08', '#2B6CB0', '#6D4CC2', '#0E7C86', '#9A3412', '#4D7C0F']
export const avColor = (s) => AV[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AV.length]
export const initials = (n) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

// Seeded random so the sample data is the same on every load
function rng(seed) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280) }

export const GROUPS = [
  { id: 'orchid', name: 'Orchid', subject: 'Maths', level: 1, status: 'stuck', last: '4 min ago', note: 'Wrong 3 times on “12 ÷ 4” after both hints', streak: 3 },
  { id: 'pine', name: 'Pine', subject: 'English', level: 1, status: 'ok', last: '2 min ago', streak: 5 },
  { id: 'bamboo', name: 'Bamboo', subject: 'Maths', level: 2, status: 'ok', last: '1 min ago', streak: 6 },
  { id: 'river', name: 'River', subject: 'English', level: 2, status: 'ok', last: '3 min ago', streak: 4 },
  { id: 'hornbill', name: 'Hornbill', subject: 'Maths', level: 3, status: 'ok', last: '5 min ago', streak: 8 },
  { id: 'cloud', name: 'Cloud', subject: 'English', level: 3, status: 'idle', last: '18 min ago', streak: 2 },
]

const NAMES = {
  orchid: ['Riti', 'Daphi', 'Banshan', 'Ibashisha'],
  pine: ['Wanda', 'Ilarihun', 'Lamphrang', 'Mebanshai'],
  bamboo: ['Ibadahun', 'Shanbor', 'Riwanka'],
  river: ['Badaphira', 'Teibor', 'Larisa', 'Phidalin'],
  hornbill: ['Aiborlang', 'Evanisha', 'Dabiang'],
  cloud: ['Synshar', 'Iaisha', 'Wankit'],
}
export const STUDENTS = Object.entries(NAMES).flatMap(([g, list], gi) =>
  list.map((name, i) => ({ id: `${g}-${i}`, name, group: g, age: 8 + ((gi + i) % 5), xp: 220 + ((gi * 7 + i * 13) % 9) * 45 })))

export const SKILLS = {
  Maths: ['Number sense', 'Add & subtract', 'Multiply', 'Divide', 'Fractions', 'Measurement', 'Patterns', 'Money'],
  English: ['Letter sounds', 'Sight words', 'Naming words', 'Sentence order', 'Past tense', 'Read aloud', 'Retell a story', 'New words'],
}
// mastery 0..4 per child per skill, shaped by the child's group level
export const MASTERY = (() => {
  const r = rng(7); const m = {}
  STUDENTS.forEach((s) => {
    const g = GROUPS.find((x) => x.id === s.group)
    m[s.id] = {}
    Object.entries(SKILLS).forEach(([subj, list]) => list.forEach((sk, k) => {
      const base = subj === g.subject ? g.level + 0.4 : 1.6
      const hard = k / list.length * 2.2
      m[s.id][sk] = Math.max(0, Math.min(4, Math.round(base + 1 - hard + (r() - 0.5) * 1.6)))
    }))
  })
  m['orchid-0']['Divide'] = 0; m['orchid-1']['Divide'] = 1; m['orchid-2']['Divide'] = 0
  return m
})()

export const QUESTIONS = [
  { id: 'm1a', subject: 'Maths', level: 1, skill: 'Divide', text: '12 ÷ 4 = ?', num: 3, show: '3', hints: ['How many groups of 4 can you make from 12?', 'Share 12 bundles of paddy among 4 families, one bundle at a time. How many does each family get?', 'Is sharing the same as dividing? Talk about why.'] },
  { id: 'm1b', subject: 'Maths', level: 1, skill: 'Add & subtract', text: 'One coop has 9 hens and another has 6. How many hens are there in all?', num: 15, show: '15 hens', hints: ['Do we put the two groups together, or take one away?', 'Count the 9 hens in the first coop, then keep counting on: 10, 11, …', 'Can you make 10 first to make it easier? Show how.'] },
  { id: 'm2a', subject: 'Maths', level: 2, skill: 'Patterns', text: 'A basket pattern repeats every 3 strips: dark, light, light. What colour is strip 14?', accept: ['light'], show: 'Light', hints: ['Find the repeating unit. Which strip numbers are dark?', 'Bah Kynsai weaves dark, light, light. Strips 1, 4, 7 and 10 are dark. Keep going to 14.', 'How could you find strip 100 without counting every strip?'] },
  { id: 'm2b', subject: 'Maths', level: 2, skill: 'Measurement', text: 'A paddy field is 8 m long and 5 m wide. What is its perimeter?', num: 26, show: '26 m', hints: ['Perimeter means the distance all the way around the edge.', 'Walk around a paddy field: 8 steps, then 5, then 8, then 5. Add every side.', 'Why does each side length count twice?'] },
  { id: 'm2c', subject: 'Maths', level: 2, skill: 'Multiply', text: 'Each basket needs 6 bamboo strips. How many strips for 7 baskets?', num: 42, show: '42 strips', hints: ['Is this adding the same number again and again?', 'Bah Kynsai lays out 6 strips for each basket. Count in 6s, seven times.', 'Which is quicker: adding 6 seven times or using a times table? Why?'] },
  { id: 'm3a', subject: 'Maths', level: 3, skill: 'Money', text: 'Ginger sells for ₹60 a kilo on market day. What do 2.5 kg cost?', num: 150, show: '₹150', hints: ['Split 2.5 kg into 2 kg and 0.5 kg. Price each part.', 'On market day, half a kilo of ginger costs half of ₹60. Add that to the price of 2 kg.', 'Is there another way? Try counting 5 half-kilos.'] },
  { id: 'm3b', subject: 'Maths', level: 3, skill: 'Fractions', text: 'A water tank holds 240 litres. A family uses 3/4 of it in a week. How many litres are left?', num: 60, show: '60 litres', hints: ['If 3/4 is used, what fraction is left?', 'Fill 4 equal buckets from the 240-litre tank. 3 buckets are used. How much is in the last one?', 'Is it easier to find 3/4 first or 1/4 first? Why?'] },
  { id: 'e1a', subject: 'English', level: 1, skill: 'Sentence order', text: 'Choose the right word: The children ___ to school every day. (go / goes)', accept: ['go'], show: 'go', hints: ['Is “children” one person or many?', 'We say “The farmer goes to the field.” So we say “The farmers ___ to the field.”', 'When do we add -es to a doing word?'] },
  { id: 'e1b', subject: 'English', level: 1, skill: 'Naming words', text: 'Which word is a naming word (noun)? run / basket / quickly', accept: ['basket'], show: 'basket', hints: ['A naming word names a person, place or thing.', 'Can you touch it? Kong Iba carries a ___ to the field.', 'Find three more naming words you can see in the classroom.'] },
  { id: 'e2a', subject: 'English', level: 2, skill: 'Sentence order', text: 'Put the words in order: river / the / near / grows / bamboo', accept: ['bamboo grows near the river'], show: 'Bamboo grows near the river.', hints: ['What is the sentence about? Start with that word.', 'Where does bamboo grow in our village? “___ grows ___ the river.”', 'Can the words go in another order and still make sense?'] },
  { id: 'e2b', subject: 'English', level: 2, skill: 'Past tense', text: 'Fill the gap: Yesterday it ___ (rain) all day.', accept: ['rained'], show: 'rained', hints: ['“Yesterday” means the past. How do we show the past?', 'Today the rain falls on the paddy. Yesterday it ___ on the paddy all day too.', 'What other words tell us something already happened?'] },
  { id: 'e3a', subject: 'English', level: 3, skill: 'Past tense', text: 'What is the past tense of “weave”?', accept: ['wove'], show: 'wove', hints: ['It is not “weaved”. The sound inside the word changes.', 'Today Kong Iba weaves a basket. Yesterday she ___ a basket.', 'Which other doing words change in the middle like this? Try sing and swim.'] },
  { id: 'e3b', subject: 'English', level: 3, skill: 'New words', text: 'Write a word that means the opposite of “ancient”.', accept: ['new', 'modern', 'young', 'recent'], show: 'new / modern', hints: ['“Ancient” means very, very old.', 'The old wooden bridge is ancient. The concrete bridge built last year is ___.', 'Is “new” the same as “modern”? When would you use each?'] },
]

export const RECORDS = [
  { id: 'r1', who: 'Bah Kynsai', role: 'Artisan', lang: 'Khasi', title: 'Three-strip bamboo weave', summary: 'I weave baskets with one dark strip and two light strips, again and again. If I lose count, the basket bends. I measure strips with my hand span.', consent: 'public', secs: 160, art: 'weave', status: 'approved', date: '2 Nov', listens: 34,
    card: { subject: 'Maths', concept: 'Repeating patterns', summary: 'Bah Kynsai weaves baskets with a pattern that repeats every three strips: one dark, two light. If he loses count, the basket bends.', activity: 'Make a paper-strip weave with the same dark-light-light unit. Mark each place where the pattern starts again.', qs: ['What is the repeating unit in Bah Kynsai’s weave?', 'A basket has 30 strips. How many are dark?'], mission: 'pattern' },
    dividend: { item: 'Printed visual record of his 3 weave patterns', status: 'delivered', on: '3 Nov' } },
  { id: 'r5', who: 'Kong Rida', role: 'Farmer', lang: 'Khasi', title: 'Selling oranges on market day', summary: 'I sell oranges in heaps of ten. On market day I give one extra orange when someone buys three heaps. I count change on my fingers.', consent: 'public', secs: 132, art: 'market', status: 'approved', date: '29 Oct', listens: 21,
    card: { subject: 'Maths', concept: 'Money and grouping in tens', summary: 'Kong Rida sells oranges in heaps of ten and gives one extra orange when someone buys three heaps.', activity: 'Run a pretend orange stall. Make heaps of ten and practise giving change.', qs: ['How many oranges are in 3 heaps, plus the extra one?', 'A heap costs ₹40. What do 3 heaps cost?'], mission: 'market' },
    dividend: { item: 'Price card for her stall, with heaps and prices', status: 'delivered', on: '1 Nov' } },
  { id: 'r6', who: 'Bah Wanbok', role: 'Artisan', lang: 'Khasi', title: 'How we build a bamboo bridge', summary: 'We tie bamboo into triangles because a triangle does not bend. Before the rains we check every knot. Four people carry the long poles together.', consent: 'school', secs: 188, art: 'bridge', status: 'approved', date: '26 Oct', listens: 17,
    card: { subject: 'Science', concept: 'Strong shapes and structures', summary: 'Bah Wanbok ties bamboo into triangles because a triangle does not bend. The bridge is checked before every rainy season.', activity: 'Build a square and a triangle from sticks and string. Press each one. Which keeps its shape?', qs: ['Why does Bah Wanbok use triangles?', 'Where else in the village can you see triangles holding things up?'], mission: 'bridge' },
    dividend: { item: 'Drawing of his bridge design, laminated', status: 'ready' } },
  { id: 'r2', who: 'Kong Iba', role: 'Farmer', lang: 'Khasi', title: 'When we transplant paddy', summary: 'We move the paddy seedlings when they are about 25 days old and the rain has filled the terraces. We plant them in rows, a hand apart.', consent: 'public', secs: 118, art: 'paddy', status: 'pending', date: '11 Nov', listens: 0,
    dividend: { item: 'Crop calendar card for her terraces', status: 'ready' } },
  { id: 'r3', who: 'Kong Bandarisha', role: 'Elder', lang: 'Khasi', title: 'How the river got its name', summary: 'My grandmother told this story. Long ago two sisters walked to the hills, and where the younger one rested, a river began to flow.', consent: 'school', secs: 204, art: 'river', status: 'pending', date: '12 Nov', listens: 0,
    dividend: { item: 'Her story saved on a pen drive for her family', status: 'planned' } },
  { id: 'r4', who: 'Bah Lamare', role: 'Elder', lang: 'Khasi', title: 'Rules of the sacred grove', summary: 'Kept in the hub archive. Only the contributor and the School Management Committee can open it.', consent: 'restricted', secs: 95, art: 'grove', status: 'archived', date: '28 Oct', listens: 0, dividend: null },
]

export const MISSIONS = [
  { id: 'pattern', title: 'Pattern Detective', from: 'r1', week: 'This week', status: 'active', skills: ['Patterns', 'Measurement', 'Money'], tags: ['Geometry', 'Measurement', 'Costing'], materials: 'Paper strips, ruler, 2 real baskets', assigned: ['bamboo', 'hornbill'],
    steps: ['Recreate a strip of Bah Kynsai’s weave with paper strips', 'Find and mark the repeating unit', 'Measure one strip and the whole basket in cm', 'Work out how much bamboo one basket needs and what it costs', 'Compare two weave designs and explain the difference'] },
  { id: 'market', title: 'Market Day Maths', from: 'r5', week: 'Next week', status: 'planned', skills: ['Money', 'Add & subtract'], tags: ['Money', 'Grouping in tens'], materials: 'Real or paper oranges, price cards, coins', assigned: ['orchid', 'pine'],
    steps: ['Interview Kong Rida about her prices', 'Make heaps of ten and price them', 'Run the stall: buyers and sellers swap', 'Record every sale and check the total'] },
  { id: 'bridge', title: 'Build a Bridge', from: 'r6', week: 'In 2 weeks', status: 'planned', skills: ['Measurement'], tags: ['Shapes', 'Forces'], materials: 'Sticks, string, small weights', assigned: [],
    steps: ['Watch Bah Wanbok’s recording', 'Build square and triangle frames', 'Test which holds more stones', 'Draw your design and explain it'] },
]

export const PASSPORT = [
  { id: 'p1', who: 'Ibadahun', team: 'Bamboo', mission: 'pattern', skill: 'Finds the repeating unit', t: true, m: true, date: '10 Nov' },
  { id: 'p2', who: 'Riwanka', team: 'Bamboo', mission: 'pattern', skill: 'Measures strip length in cm', t: true, m: false, date: '11 Nov' },
  { id: 'p3', who: 'Evanisha', team: 'Hornbill', mission: 'pattern', skill: 'Compares two weave designs', t: true, m: false, date: '11 Nov' },
  { id: 'p4', who: 'Aiborlang', team: 'Hornbill', mission: 'pattern', skill: 'Works out the cost of bamboo needed', t: false, m: false, date: '12 Nov' },
  { id: 'p5', who: 'Riti', team: 'Orchid', mission: 'market', skill: 'Counts in tens with real objects', t: true, m: true, date: '5 Nov' },
]

export const LOG = [
  { g: 'Orchid', q: '12 ÷ 4 = ?', tries: 3, hints: 2, ok: false, explained: false, t: '4 min ago' },
  { g: 'Bamboo', q: 'Perimeter of an 8 m × 5 m field', tries: 1, hints: 0, ok: true, explained: true, t: '6 min ago' },
  { g: 'River', q: 'Bamboo grows near the river', tries: 2, hints: 1, ok: true, explained: true, t: '9 min ago' },
  { g: 'Hornbill', q: 'Ginger at ₹60 a kilo, 2.5 kg', tries: 1, hints: 0, ok: true, explained: true, t: '12 min ago' },
  { g: 'Pine', q: 'The children ___ to school', tries: 2, hints: 1, ok: true, explained: true, t: '15 min ago' },
]

// Pilot metrics (weeks 1–8 of the 6-month pilot)
export const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
export const TREND = [
  { w: 'W1', solved: 38, hints: 1.9, sessions: 41, hours: 1.0, cards: 2, listens: 6 },
  { w: 'W2', solved: 44, hints: 1.7, sessions: 58, hours: 1.6, cards: 5, listens: 15 },
  { w: 'W3', solved: 47, hints: 1.6, sessions: 66, hours: 2.2, cards: 8, listens: 27 },
  { w: 'W4', solved: 52, hints: 1.4, sessions: 71, hours: 2.9, cards: 11, listens: 41 },
  { w: 'W5', solved: 55, hints: 1.3, sessions: 78, hours: 3.4, cards: 15, listens: 52 },
  { w: 'W6', solved: 58, hints: 1.2, sessions: 84, hours: 3.8, cards: 18, listens: 63 },
  { w: 'W7', solved: 60, hints: 1.1, sessions: 87, hours: 4.1, cards: 21, listens: 71 },
  { w: 'W8', solved: 63, hints: 1.0, sessions: 92, hours: 4.5, cards: 24, listens: 72 },
]
// ASER-style levels: share of the 21 children at each level
export const ASER = {
  Reading: [
    { level: 'Beginner', base: 5, now: 2 }, { level: 'Letter', base: 6, now: 4 }, { level: 'Word', base: 5, now: 6 },
    { level: 'Paragraph', base: 3, now: 5 }, { level: 'Story', base: 2, now: 4 },
  ],
  Maths: [
    { level: 'Beginner', base: 4, now: 1 }, { level: 'Numbers 1–9', base: 6, now: 4 }, { level: 'Numbers 10–99', base: 6, now: 7 },
    { level: 'Subtraction', base: 3, now: 6 }, { level: 'Division', base: 2, now: 3 },
  ],
}

export const DEVICES = [
  { id: 'hub', name: 'School laptop (hub)', kind: 'laptop', battery: 100, plugged: true, status: 'online', ip: '192.168.4.1', last: 'now' },
  { id: 'tA', name: 'Tablet A · Bamboo', kind: 'tablet', battery: 72, status: 'online', ip: '192.168.4.11', last: 'now' },
  { id: 'tB', name: 'Tablet B · Orchid', kind: 'tablet', battery: 41, status: 'online', ip: '192.168.4.12', last: 'now' },
  { id: 'p1', name: 'Phone 1 · River', kind: 'phone', battery: 63, status: 'online', ip: '192.168.4.21', last: 'now' },
  { id: 'p2', name: 'Phone 2 · Hornbill', kind: 'phone', battery: 18, status: 'online', ip: '192.168.4.22', last: '1 min ago' },
  { id: 'p3', name: 'Phone 3 · Village Voice', kind: 'phone', battery: 88, status: 'offline', ip: '—', last: '2 h ago' },
]
export const STORAGE = [
  { name: 'Kolibri content', gb: 92, color: 'var(--river)' },
  { name: 'Village Voices', gb: 6.4, color: 'var(--accent)' },
  { name: 'AI model + hints', gb: 1.6, color: 'var(--violet)' },
  { name: 'Practice logs', gb: 0.3, color: 'var(--gold)' },
]
export const HUB_EVENTS = [
  { t: 'Today 02:10', e: 'Hints pre-generated for 12 new questions', k: 'ai' },
  { t: 'Today 02:04', e: 'Lesson card drafts made for 2 Village Voices', k: 'ai' },
  { t: 'Yesterday 17:40', e: 'Backup to the 1 TB drive finished (8.3 GB changed)', k: 'backup' },
  { t: '10 Nov 21:15', e: 'Content pack imported from pen drive: 3 new Kolibri lessons', k: 'sync' },
  { t: '9 Nov 13:02', e: 'Power cut. Hub ran on UPS for 47 minutes', k: 'power' },
]

export const BADGES = [
  { id: 'try', name: 'Brave Try', desc: 'Tried before asking for a hint, 10 times', got: true, color: 'var(--accent)' },
  { id: 'pattern', name: 'Pattern Spotter', desc: 'Solved 5 pattern questions', got: true, color: 'var(--gold)' },
  { id: 'explain', name: 'Clear Checker', desc: 'Explained an answer to the group', got: true, color: 'var(--leaf)' },
  { id: 'listener', name: 'Good Listener', desc: 'Heard 3 Village Voices', got: true, color: 'var(--river)' },
  { id: 'archivist', name: 'Village Archivist', desc: 'Helped record an elder on Roots Day', got: false, color: 'var(--violet)' },
  { id: 'streak', name: '10-Day Streak', desc: 'Practised 10 school days in a row', got: false, color: 'var(--gold)' },
]

export const PATH = [
  { id: 'n1', label: 'Count in groups', kind: 'done' },
  { id: 'n2', label: 'Spot the repeat', kind: 'done' },
  { id: 'v1', label: 'Village stop: Bah Kynsai’s weave', kind: 'village', record: 'r1' },
  { id: 'n3', label: 'Strip 14 puzzle', kind: 'current' },
  { id: 'n4', label: 'Measure the field', kind: 'locked' },
  { id: 'm1', label: 'Mission: Pattern Detective', kind: 'locked' },
]
