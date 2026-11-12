// The "intelligence" of the hub, simulated with rules for this prototype.
// In the real hub: a rules engine gates hints, keyword retrieval searches approved village records,
// and a small open model (Gemma 3 1B class, CPU only) writes hint wording and lesson-card drafts overnight.
// The model never sees restricted records and never gives final answers.

import { SKILLS, MASTERY, STUDENTS } from './data'

export const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s.]/g, ' ').replace(/\s+/g, ' ').trim()
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function checkAnswer(q, a) {
  if (q.num != null) {
    const m = a.replace(/[,₹]/g, '').match(/-?\d+(\.\d+)?/)
    return !!m && Math.abs(parseFloat(m[0]) - q.num) < 1e-9
  }
  const n = norm(a).replace(/\./g, ''); const w = n.split(' ')
  return q.accept.some((x) => (x.includes(' ') ? n === x : w.includes(x)))
}

export function intentOf(text) {
  const t = norm(text)
  if (/(just|please)?\s*(tell|give|show) (me )?(the )?answer|what is the answer|answer please|solve it|you do it/.test(t)) return 'answer'
  if (/^(hint|help|i m stuck|im stuck|stuck|i don t know|i dont know|no idea|clue)\b/.test(t) || t === 'hint') return 'hint'
  if (/^(read|repeat|say it again|again)/.test(t)) return 'read'
  return 'attempt'
}

export const BUDDY_LINES = {
  needTry: [
    'Show me your try first, even a guess! Hints unlock after a try.',
    'I know you can start this. Write any answer you think of, and then I can help.',
  ],
  refuse: [
    'I won’t give you the answer, because then I’d be the one learning! Let’s crack it together. What do you think the first step is?',
    'Answers are more fun when they’re yours. Tell me which part feels tricky and I’ll give you a nudge.',
  ],
  wrong: ['Not yet, but that try helps! ', 'Close thinking. Let’s look again. ', 'Good try. Mistakes show us where to look. '],
  right: ['Yes! That’s it.', 'You got it!', 'Brilliant work, team!'],
  explainAsk: (name) => `Before we save it: ${name}, you’re the Checker. Can you explain why it’s right, in your own words?`,
  explainShort: 'Tell me a little more. Use “because…” in your sentence.',
  explainGood: ['That’s a clear explanation. Saved to your group’s log!', 'Lovely reasoning. Saved!'],
}

export function draftCard(r) {
  const t = (r.title + ' ' + r.summary).toLowerCase(); const w = r.who
  const first = (r.summary.match(/[^.!?]+[.!?]?/g) || [r.summary]).slice(0, 2).join(' ').replace(/\s+/g, ' ').trim()
  let d
  if (/weav|basket|pattern|loom|cloth|shawl/.test(t)) d = { subject: 'Maths', concept: 'Repeating patterns', activity: 'Copy the pattern with paper strips. Mark every place where it starts again.', qs: [`What part of ${w}’s pattern repeats?`, 'Draw the pattern for 12 strips. How many times does the unit repeat?'], mission: 'pattern' }
  else if (/bridge|triangle|build|pole|knot/.test(t)) d = { subject: 'Science', concept: 'Strong shapes and structures', activity: 'Build a square and a triangle from sticks and string. Press each one. Which keeps its shape?', qs: [`Why does ${w} use that shape?`, 'Where else in the village do you see this shape holding things up?'], mission: 'bridge' }
  else if (/paddy|rice|seed|harvest|crop|season|soil|rain|terrace|plant/.test(t)) d = { subject: 'Science', concept: 'Seasons and how plants grow', activity: `Plant 3 seeds in the school garden. Measure them every week, the way ${w} watches the seedlings.`, qs: [`Why does ${w} wait for the rain before moving the seedlings?`, 'In which months are the seedlings in the field? Make a season wheel.'], mission: null }
  else if (/market|price|sell|rupee|kg|cost|money|heap/.test(t)) d = { subject: 'Maths', concept: 'Money and unit price', activity: 'Set up a pretend market stall. Price 3 things and make change for a customer.', qs: [`How does ${w} decide the price?`, 'If one costs ₹15, what do 4 cost?'], mission: 'market' }
  else if (/story|river|legend|song|name|grandmother|grandfather|long ago/.test(t)) d = { subject: 'English', concept: 'Story order and retelling', activity: 'Listen together. Retell the story in 4 pictures: the beginning, two middle parts and the end.', qs: ['What happened first in the story?', `Retell ${w}’s story in three sentences of your own.`], mission: null }
  else d = { subject: 'English', concept: 'New words from the village', activity: 'Listen and write down 5 new words. Use each one in a sentence.', qs: ['Which new word did you hear?', 'Use it in a sentence about your home.'], mission: null }
  return { ...d, summary: `${w} shares: ${first}`, ai: true }
}
export const artFor = (subject) => ({ Maths: 'weave', Science: 'paddy', English: 'river' }[subject] || 'grove')

/* ---------- Ask Buddy: village-knowledge chat for children ---------- */
const GLOSSARY = [
  { k: ['pattern', 'repeat', 'repeating'], a: 'A pattern is something that repeats in the same order. The part that repeats is called the unit. In Bah Kynsai’s basket the unit is dark, light, light.', q: 'Can you find a pattern on your clothes or your house?' },
  { k: ['perimeter', 'around', 'boundary'], a: 'Perimeter is the distance all the way around the edge of a shape. If you walked around a paddy field and counted every step, that’s its perimeter.', q: 'How would you find the perimeter of our school ground?' },
  { k: ['fraction', 'half', 'quarter'], a: 'A fraction is a part of a whole. If a jackfruit is cut into 4 equal pieces and you eat 1, you ate one quarter (1/4).', q: 'If you share a roti equally with one friend, what fraction do you each get?' },
  { k: ['noun', 'naming word'], a: 'A naming word (noun) names a person, place or thing: basket, river, Kong Iba, school.', q: 'Name three things you can see right now. Those are nouns!' },
  { k: ['past tense', 'yesterday', 'past'], a: 'We use the past tense for things that already happened. Most words add -ed (rain → rained), but some change inside (weave → wove).', q: 'What did you do yesterday? Say it in a sentence.' },
  { k: ['triangle', 'shape', 'strong'], a: 'A triangle keeps its shape when you push it. That’s why builders, like Bah Wanbok with his bamboo bridge, tie poles into triangles.', q: 'Where else do you see triangles holding something up?' },
  { k: ['season', 'monsoon', 'rain'], a: 'Seasons are parts of the year with different weather. Farmers like Kong Iba plant paddy when the monsoon rain fills the terraces.', q: 'What changes in the village when the rain comes?' },
  { k: ['division', 'divide', 'share', 'sharing'], a: 'Dividing means sharing equally. 12 bundles of paddy shared among 4 families gives each family the same number.', q: 'Try it with 12 pebbles and 4 friends. How many does each friend get?' },
]

export function askBuddy(text, records) {
  const t = norm(text)
  if (!t) return { text: 'Ask me anything about what our village and school library have taught us!' }
  if (/^(hi|hello|hey|khublei|good morning|namaste)\b/.test(t)) return { text: 'Khublei! I’m Buddy. Ask me about patterns, plants, stories or anything the village has shared with our school.', chips: ['What is a pattern?', 'Why use triangles in a bridge?', 'Tell me a village story'] }
  if (/(phone number|address|where do you live|password|my photo|whatsapp|instagram)/.test(t)) return { text: 'Let’s keep personal things private. I don’t ask for or keep phone numbers, addresses or passwords, and you shouldn’t share them in a chat. If something worries you, tell your teacher.', tone: 'privacy' }
  if (/\d+\s*([x×*÷/+\-]|times|divided by|plus|minus)\s*\d+/.test(t) || /(solve|homework|answer to|do my)/.test(t)) {
    const op = /÷|\/|divided/.test(t) ? 'Think about sharing: how many equal groups can you make?' : /x|×|\*|times/.test(t) ? 'Think of it as equal groups. How many groups, and how many in each?' : /-|minus/.test(t) ? 'Start with the bigger number and count back. Where do you land?' : 'Start with the bigger number and count on.'
    return { text: `I won’t solve it for you, but I’ll walk with you. ${op} Try it and tell me what you get. Or open Practice with your group so I can give hints step by step.`, link: { label: 'Practise with my group', to: '/student/practice' } }
  }
  if (/sacred grove|grove rules/.test(t)) return { text: 'That knowledge is kept private by the person who shared it. Only they and the School Management Committee can open it. Some knowledge isn’t for everyone, and we respect that.', tone: 'privacy' }

  const visible = records.filter((r) => r.status === 'approved' && r.consent !== 'restricted' && r.card)
  if (/story|stories|legend/.test(t)) {
    const pend = records.find((r) => r.status === 'pending' && /story|river/.test(r.title.toLowerCase()))
    return { text: `The stories in our library so far come from village work, like ${visible.map((r) => r.who).slice(0, 3).join(', ')}.${pend ? ` ${pend.who}’s story “${pend.title}” is waiting for your teacher to approve it. It will appear here soon!` : ''}`, sources: visible.slice(0, 3) }
  }
  const words = t.split(' ').filter((w) => w.length > 3)
  const scored = visible.map((r) => {
    const hay = norm(`${r.title} ${r.summary} ${r.card.concept} ${r.card.subject} ${r.card.summary}`)
    return { r, s: words.reduce((a, w) => a + (hay.includes(w.replace(/s$/, '')) ? 1 : 0), 0) }
  }).sort((a, b) => b.s - a.s)
  const g = GLOSSARY.find((x) => x.k.some((k) => t.includes(k)))
  if (g) return { text: g.a, follow: g.q, sources: scored[0]?.s ? [scored[0].r] : [] }
  if (scored[0]?.s) {
    const r = scored[0].r
    return { text: `Here’s what ${r.who} shared: ${r.card.summary}`, follow: r.card.qs[0], sources: [r] }
  }
  return { text: 'I don’t know that one yet. I only know what our school library and the village have shared, so I won’t guess. You could ask your teacher, or we could ask an elder on Roots Day!', chips: ['What is a pattern?', 'When is paddy planted?', 'Why use triangles in a bridge?'] }
}

/* ---------- Teacher assistant ---------- */
export function teacherAssist(text, s) {
  const t = norm(text)
  const groups = s.groups
  const rate = Math.round(groups.reduce((a, g) => a + g.clean, 0) / groups.reduce((a, g) => a + g.done, 0) * 100)
  if (/stuck|help|alert|struggl/.test(t)) {
    const st = groups.filter((g) => g.status === 'stuck')
    if (!st.length) return { text: 'No group is stuck right now. Every group has solved its last question within 2 hints.' }
    return { text: `${st.length} group${st.length > 1 ? 's need' : ' needs'} you. Suggested next step: sit with them for 5 minutes and use real objects.`, table: { head: ['Group', 'Level', 'What happened'], rows: st.map((g) => [g.name, `L${g.level} ${g.subject}`, g.note || 'Several hints used']) }, actions: [{ label: 'Open dashboard', to: '/teacher' }] }
  }
  if (/move up|ready|level up|promot/.test(t)) {
    const ready = groups.filter((g) => g.level < 3 && g.done >= 7 && g.clean / g.done >= 0.8)
    return { text: ready.length ? `${ready.map((g) => g.name).join(', ')} ${ready.length > 1 ? 'are' : 'is'} ready to move up: 80%+ solved without a hint over at least 7 questions.` : 'No group meets the move-up rule yet (80% solved without a hint over 7+ questions).', table: { head: ['Group', 'Solved', 'Without a hint'], rows: groups.map((g) => [g.name, g.done, `${Math.round(g.clean / g.done * 100)}%`]) }, actions: [{ label: 'Open group builder', to: '/teacher/groups' }] }
  }
  if (/weak|skill|gap|difficult|hard/.test(t)) {
    const avg = Object.values(SKILLS).flat().map((sk) => ({ sk, v: STUDENTS.reduce((a, st) => a + MASTERY[st.id][sk], 0) / STUDENTS.length })).sort((a, b) => a.v - b.v).slice(0, 4)
    return { text: `The weakest skills across the class right now. “${avg[0].sk}” is the biggest gap, so I suggest a hands-on sharing activity tomorrow (pebbles or paddy bundles).`, table: { head: ['Skill', 'Class average (0–4)'], rows: avg.map((a) => [a.sk, a.v.toFixed(1)]) }, actions: [{ label: 'See the skills heatmap', to: '/teacher/groups' }] }
  }
  if (/summar|week|report|how are we/.test(t)) {
    const pend = s.records.filter((r) => r.status === 'pending').length
    const due = s.records.filter((r) => r.dividend && r.dividend.status !== 'delivered').length
    return { text: `This week at a glance: ${rate}% of questions solved before opening a hint (up from 38% in week 1). 92 practice sessions, about 4.5 teacher hours saved. ${pend} lesson card${pend === 1 ? '' : 's'} waiting for you, and ${due} Knowledge Dividend${due === 1 ? '' : 's'} still to give.`, actions: [{ label: 'Open impact report', to: '/impact' }, { label: 'Review approvals', to: '/teacher/approvals' }] }
  }
  if (/mission|activity|plan/.test(t)) {
    return { text: 'Draft mission from Kong Iba’s recording “When we transplant paddy”. Check it before using it.', card: { title: 'Mission draft: Seedling Scientists', lines: ['1. Plant paddy seeds in two trays: one watered daily, one every 3 days', '2. Measure seedling height every 5 days', '3. Make a bar chart of the results', '4. Ask Kong Iba why she waits 25 days before transplanting', 'Skills: Measurement, Science (plant growth). Materials: seeds, trays, ruler'] }, actions: [{ label: 'Open missions', to: '/teacher/missions' }] }
  }
  if (/print|paper|pack|card/.test(t)) {
    return { text: 'Tomorrow’s print pack (works even if devices fail): 6 hint-ladder cards for the questions each group will start with, the Pattern Detective mission sheet for Bamboo and Hornbill, and 2 passport pages waiting for Bah Kynsai’s mentor tick. That’s 14 A4 pages.' }
  }
  if (/parent|message|note|roots day/.test(t)) {
    return { text: 'Draft note for parents (simple English; ask a colleague to read it out in Khasi at pickup):', card: { title: 'Note for parents', lines: ['Roots Day is on Friday 28 November at 11 am.', 'Bah Kynsai and Kong Iba will visit the school. Your children will interview them and record their knowledge.', 'Please come and see your child’s Skill Passport. All are welcome.'] } }
  }
  return { text: 'I can help with: who is stuck, who is ready to move up, the weakest skills, a weekly summary, drafting a mission from a Village Voice, tomorrow’s print pack, and a note for parents. I only use your class data on this hub, and I don’t make final decisions about any child.', chips: ['Which groups are stuck?', 'Who is ready to move up?', 'What are the weakest skills?', 'Summarise this week'] }
}
