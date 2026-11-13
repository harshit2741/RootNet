// Sample content for the prototype. Stories are ORIGINAL and fictional, written for the demo;
// in the pilot they are recorded by real elders with their consent.

export const STORIES = [
  { id: 's1', title: 'The River That Waited', teller: 'Kong Bandarisha', role: 'Elder', kind: 'Place story', mins: 4, art: 'river', consent: 'school', lang: 'Khasi',
    scenes: [
      { art: 'river', text: 'Long ago, two sisters walked towards the hills, carrying water in bamboo tubes.' },
      { art: 'grove', text: 'The younger sister grew tired and sat under a tall tree to rest.' },
      { art: 'river', text: 'Where she rested, water began to bubble from the ground and ran down the slope.' },
      { art: 'paddy', text: 'The water waited for her each morning, so the people named it the river that waits.' },
    ],
    qs: ['Why did the younger sister stop?', 'What would you name a place near your home? Why?'], talk: 'Many places in our hills have a story behind their name. Ask an elder about one.' },
  { id: 's2', title: 'Why the Hornbill Wears a Golden Crown', teller: 'Bah Hiraw', role: 'Elder', kind: 'Folk tale', mins: 5, art: 'grove', consent: 'public', lang: 'Khasi',
    scenes: [
      { art: 'grove', text: 'Once, the hornbill had a plain grey beak and the hills had very few trees.' },
      { art: 'river', text: 'When the great rains came, the hornbill flew up and down the hills carrying fruit seeds.' },
      { art: 'paddy', text: 'Where the seeds fell, forests grew, full of shade, fruit and birdsong.' },
      { art: 'weave', text: 'The forest gave the hornbill a golden crown, so everyone would know it was the forest’s friend.' },
    ],
    qs: ['How did the hornbill help the hills?', 'What can we do to help the forest near our village?'], talk: 'This is a story, not science. But it is true that birds spread seeds. Can you find a seedling growing far from its tree?' },
  { id: 's3', title: 'Grandmother’s Riddles', teller: 'Kong Bandarisha', role: 'Elder', kind: 'Riddles', mins: 3, art: 'river', consent: 'public', lang: 'Khasi',
    scenes: [
      { art: 'river', text: 'I have no feet, but I run down every hill. What am I?', answer: 'A river' },
      { art: 'grove', text: 'I follow you in the sun, but I hide when night comes. What am I?', answer: 'Your shadow' },
      { art: 'paddy', text: 'I fall from the sky but never get hurt, and I make the paddy smile. What am I?', answer: 'Rain' },
    ],
    qs: ['Which riddle was the hardest?', 'Make up your own riddle about something in the village.'], talk: 'Riddles train us to look for clues, just like maths does.' },
  { id: 's4', title: 'The Planting Song', teller: 'Kong Iba', role: 'Farmer', kind: 'Work song', mins: 3, art: 'paddy', consent: 'public', lang: 'Khasi',
    scenes: [
      { art: 'paddy', text: 'When we plant paddy, we sing so our hands move together, row after row.' },
      { art: 'paddy', text: 'We count each step as we sing: wei, ár, lái, sáw. One, two, three, four.' },
      { art: 'weave', text: 'The song keeps the rows straight and the work light, even on a long day.' },
    ],
    qs: ['Why does singing help people work together?', 'Clap and count to four in Khasi.'], talk: 'Songs carry rhythm, counting and memory. Ask a grandparent for a song they sang while working.' },
  { id: 's5', title: 'Games We Played: Bamboo Stilts', teller: 'Bah Kynsai', role: 'Artisan', kind: 'Childhood games', mins: 4, art: 'bridge', consent: 'public', lang: 'Khasi',
    scenes: [
      { art: 'bridge', text: 'When I was your age, we made stilts from two strong bamboo poles.' },
      { art: 'weave', text: 'We tied a foot-rest at the same height on both poles. If one was higher, you fell!' },
      { art: 'bridge', text: 'To balance, keep looking ahead and take small, quick steps.' },
    ],
    qs: ['Why must both foot-rests be at the same height?', 'Measure two sticks so they are exactly equal.'], talk: 'This game is full of science: balance, measuring and strong materials.' },
  { id: 's6', title: 'The Shared First Harvest', teller: 'Kong Rida', role: 'Farmer', kind: 'Values', mins: 3, art: 'market', consent: 'public', lang: 'Khasi',
    scenes: [
      { art: 'paddy', text: 'In my family, the first basket of every harvest is never kept for ourselves.' },
      { art: 'market', text: 'We share it with a neighbour who had a hard year.' },
      { art: 'grove', text: 'My mother said: a full basket is good, but a full village is better.' },
    ],
    qs: ['Why do you think the family shares the first basket?', 'Tell about a time someone shared with you.'], talk: 'Stories teach values as well as facts.' },
]

export const LESSONS = [
  { id: 'count', title: 'Count to 10 in Khasi', tag: 'Language · Maths', mins: 3, color: 'var(--c4)', steps: [
    { say: 'Khublei, friends! Today we count to ten in Khasi, the language of our village. Ready? Let’s go!', vis: 'intro', chalk: 'Count in Ka Ktien Khasi' },
    { say: 'Listen and repeat after me. One is wei! Two is ár! Three is lái! Four is sáw! Five is san!', vis: 'numbers', range: [1, 5] },
    { say: 'Quick question! Which number is lái?', vis: 'quiz', q: 'Which number is “lái”?', options: ['2', '3', '5'], answer: '3' },
    { say: 'Now the next five! Six is hinriw. Seven is hinniew. Eight is phrá. Nine is khyndái. And ten is shi-phew!', vis: 'numbers', range: [6, 10] },
    { say: 'Last one! How do you say ten in Khasi?', vis: 'quiz', q: 'How do you say 10?', options: ['phrá', 'shi-phew', 'san'], answer: 'shi-phew' },
    { say: 'Wonderful! You counted to ten in Khasi. Go and count something at home tonight!', vis: 'win' },
  ] },
  { id: 'pattern', title: 'Patterns in a Basket', tag: 'Maths · Patterns', mins: 3, color: 'var(--c3)', steps: [
    { say: 'Look at Bah Kynsai’s basket! Do you see something that repeats?', vis: 'intro', chalk: 'Find the repeating unit' },
    { say: 'Dark, light, light. Dark, light, light. The part that repeats is called the unit!', vis: 'pattern', n: 9 },
    { say: 'Your turn! After dark, light, light, what comes next?', vis: 'quiz', q: 'Dark, light, light, … what comes next?', options: ['Dark', 'Light'], answer: 'Dark' },
    { say: 'Every third strip is dark: strips one, four, seven, ten, thirteen. So what colour is strip fourteen?', vis: 'pattern', n: 15 },
    { say: 'Think carefully! What colour is strip fourteen?', vis: 'quiz', q: 'What colour is strip 14?', options: ['Dark', 'Light'], answer: 'Light' },
    { say: 'Brilliant! You found the unit and used it to predict. That is real maths!', vis: 'win' },
  ] },
  { id: 'share', title: 'Sharing Equally', tag: 'Maths · Division', mins: 3, color: 'var(--c1)', steps: [
    { say: 'Kong Iba has twelve bundles of paddy and four families. Can we share them fairly?', vis: 'intro', chalk: '12 bundles, 4 families' },
    { say: 'Let’s give one bundle to each family, again and again, until none are left. Watch!', vis: 'share' },
    { say: 'So, how many bundles did each family get?', vis: 'quiz', q: '12 shared by 4 families is…', options: ['2', '3', '4'], answer: '3' },
    { say: 'Yes! Twelve divided by four is three. Dividing means sharing equally!', vis: 'win' },
  ] },
]

// Points reward effort, not just right answers, so every level can win.
export const POINTS = [
  ['Try before any hint', 10], ['Solve without a hint', 20], ['Checker explains clearly', 15], ['Listen to a village story', 5], ['Help another group', 10],
]
export const BOARD_TODAY = [
  { g: 'hornbill', pts: 245, delta: 2 }, { g: 'bamboo', pts: 230, delta: 0 }, { g: 'orchid', pts: 205, delta: 3 },
  { g: 'river', pts: 190, delta: -1 }, { g: 'pine', pts: 175, delta: -2 }, { g: 'cloud', pts: 120, delta: -1 },
]
export const BOARD_WEEK = [
  { g: 'bamboo', pts: 1180 }, { g: 'hornbill', pts: 1140 }, { g: 'orchid', pts: 1015 }, { g: 'river', pts: 980 }, { g: 'pine', pts: 905 }, { g: 'cloud', pts: 640 },
]
export const STARS = [
  { who: 'Riti', team: 'Orchid', why: 'Most improved: 3 levels of hints → solved alone' },
  { who: 'Ibadahun', team: 'Bamboo', why: 'Best Checker: 6 clear explanations' },
  { who: 'Badaphira', team: 'River', why: 'Story star: retold the river story' },
]
export const PRIZES = [
  { t: 'The Hornbill Cup', d: 'A bamboo trophy woven by Bah Kynsai, kept by the winning group for a week', c: 'var(--c4)' },
  { t: 'Choose the Roots Day story', d: 'The winning group picks which elder story is told next', c: 'var(--c3)' },
  { t: 'Sticker sheet for every member', d: 'Printed at school from the ₹4,000 printing budget', c: 'var(--c5)' },
  { t: 'Most Improved ribbon', d: 'Separate prize so lower-level groups can always win', c: 'var(--c1)' },
]

// Individual top 10 (today). Score = effort points out of 100; time = average seconds to the group's first try.
export const TOP10 = [
  ['Ibadahun', 'Bamboo', 100, 14], ['Evanisha', 'Hornbill', 100, 16], ['Riti', 'Orchid', 100, 19],
  ['Aiborlang', 'Hornbill', 95, 15], ['Badaphira', 'River', 95, 18], ['Wanda', 'Pine', 90, 17],
  ['Shanbor', 'Bamboo', 90, 21], ['Larisa', 'River', 85, 20], ['Daphi', 'Orchid', 85, 24], ['Synshar', 'Cloud', 80, 22],
].map(([name, team, score, secs], i) => ({ rank: i + 1, name, team, score, secs }))
