# ROOTS Study Buddy (ProdMad 6.0 prototype)

An offline village learning hub: children learn at their level in small groups, the village's farmers, artisans and elders become the curriculum, and Buddy (a small AI) helps children think without giving answers.

This is a **clickable prototype** with fictional sample data. Recording, the AI model, syncing and backup are simulated.

## Run it

```bash
npm install
npm run dev          # open the URL it prints; phones on the same Wi-Fi can open it too
```

Build:

```bash
npm run build         # normal build in dist/ (what the school hub would serve)
npm run build:single  # one self-contained HTML file in dist-single/ (for sharing a demo link)
```

Fonts and libraries are bundled, so the built app works with no internet.

## Views

| View | Route | What it shows |
|---|---|---|
| Welcome | `/` | Role picker |
| Student | `/student` | Quest, learning path, streak, badges, passport stamps |
| | `/student/practice` | Buddy chat with the hint ladder (try first → Hint 1 → Hint 2 → discuss → Checker explains) |
| | `/student/ask` | Ask Buddy: answers only from approved village cards, with sources; refuses to solve sums |
| | `/student/library` | Village lesson cards (child view) |
| | `/student/class` | Buddy’s Class: animated hornbill tutor lessons (count to 10 in Khasi, patterns, sharing) |
| | `/student/stories` | Story Circle: elders’ folk tales, riddles, songs, games and values as narrated picture books |
| | `/student/leaderboard` | Daily Top 10 learners (podium style, teacher can hide) and group league, weekly prizes |
| Teacher | `/teacher` | Live class board, alerts, charts, practice log |
| | `/teacher/groups` | Skills heatmap, child radar, drag-and-drop group builder, placement suggestions |
| | `/teacher/approvals` | AI-drafted lesson cards to edit and approve |
| | `/teacher/missions` | Missions, Roots Day planner, Skill Passport verification, Knowledge Dividends |
| | `/teacher/language` | Language Desk: community Khasi translation workflow, approved words, numbers |
| | `/teacher/assistant` | Teaching assistant chat (stuck groups, move-ups, weak skills, drafts) |
| Village Voice | `/village` | Record, consent choice, change consent, take back, dividends |
| Parent | `/parent` | Level ladders, week, stamps, consent controls |
| Hub admin | `/hub` | Devices, storage, AI on/off, backup, pen-drive import, checklist, event log |
| Impact | `/impact` | ASER-style levels before/after, hint trend, village participation, budget, pilot plan |
| Privacy | `/privacy/*` | Privacy policy, children's data, AI, community knowledge rights, accessibility, prototype disclaimer |

## Where things live

- `src/data.js`: all sample data (groups, children, questions with hint ladders, village records, missions, metrics)
- `src/buddy.js`: the simulated intelligence (answer checking, hint gating, Ask Buddy retrieval, teacher assistant, lesson-card drafting)
- `src/store.js`: app state (Zustand); theme and Lite mode are remembered in the browser
- `src/styles.css`: the design system (colour world per person, chunky game-style buttons, light and solid-black dark themes, collapsible control panel)
- `src/pages/*`: one file per screen

## Stack

React 18, Vite, React Router (hash routes), Zustand, Recharts, Framer Motion, Lucide icons, Baloo 2 + Nunito (bundled).

## Auto demo

Select **Watch demo** in the top bar (or **Watch the 3-minute demo** on the landing page). First-time visitors are offered it automatically.
The tour moves through all six dashboards, spotlights each feature, reads each step aloud with the device's voice, and types into the chats to show Buddy at work.
Controls: Play/Pause (Space), previous/next (← →), narration on/off, Esc to exit. Steps live in `src/components/Tour.jsx`.

## Voice

Narration uses the device's built-in voices with sentence-by-sentence pitch and pace changes (`src/speak.js`). For the most natural voice, present in Microsoft Edge and pick a voice marked Natural (e.g. Neerja, English India) in the demo card; those voices need internet. Offline, the device's local voices are used.

## Khasi

Only words checked against published Khasi word lists are shown (`src/i18n.jsx`). New phrases go through the Language Desk: drafted by teachers or students, voiced by an elder, approved before children see them.

## Opening screen

On each new browser session a polished frosted-glass screen explains that the site is a demo and the real product runs locally on one school laptop. Click "Break the glass & enter" (or press Enter) and the glass cracks and shatters into the app. "Skip" or Esc skips it. Code: `src/components/Intro.jsx`.

## Student view on a phone

All student screens open inside a phone in the middle of the screen (`src/components/Phone.jsx`), with a status bar, app header and bottom tabs (Home, Class, Practise, Stories, League). Layouts reflow to phone size using CSS container queries. On wide screens, captions either side explain the screen for the audience.
