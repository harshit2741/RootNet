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
| Teacher | `/teacher` | Live class board, alerts, charts, practice log |
| | `/teacher/groups` | Skills heatmap, child radar, drag-and-drop group builder, placement suggestions |
| | `/teacher/approvals` | AI-drafted lesson cards to edit and approve |
| | `/teacher/missions` | Missions, Roots Day planner, Skill Passport verification, Knowledge Dividends |
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
- `src/styles.css`: the design system (light/dark tokens, glass panels, neumorphic controls, Lite mode)
- `src/pages/*`: one file per screen

## Stack

React 18, Vite, React Router (hash routes), Zustand, Recharts, Framer Motion, Lucide icons, Lexend + Bricolage Grotesque (bundled).
