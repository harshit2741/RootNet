import { create } from 'zustand'
import { GROUPS, STUDENTS, RECORDS, MISSIONS, PASSPORT, LOG } from './data'
import { draftCard } from './buddy'

const saved = (k, d) => { try { const v = localStorage.getItem('roots:' + k); return v == null ? d : JSON.parse(v) } catch { return d } }
const save = (k, v) => { try { localStorage.setItem('roots:' + k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

const prefersDark = () => { try { return window.matchMedia('(prefers-color-scheme: dark)').matches } catch { return false } }

let toastId = 0
export const useStore = create((set, get) => ({
  theme: saved('theme', prefersDark() ? 'dark' : 'light'),
  lite: saved('lite', false),
  collapsed: saved('collapsed', false),
  present: false,
  footOpen: saved('footOpen', true),
  week: 8,
  lang: saved('lang', 'en'),
  prizes: { bamboo: false },
  groups: GROUPS.map((g) => ({ ...g, members: STUDENTS.filter((s) => s.group === g.id).map((s) => s.id), done: { orchid: 5, pine: 6, bamboo: 7, river: 5, hornbill: 6, cloud: 3 }[g.id], clean: { orchid: 2, pine: 4, bamboo: 6, river: 3, hornbill: 4, cloud: 1 }[g.id], qi: 0, rot: 0 })),
  records: RECORDS.map((r) => (r.status === 'pending' ? { ...r, card: draftCard(r) } : r)),
  missions: MISSIONS,
  passport: PASSPORT,
  log: LOG,
  activeGroup: 'bamboo',
  xp: 1240,
  toasts: [],

  setTheme: (theme) => { save('theme', theme); set({ theme }) },
  setLite: (lite) => { save('lite', lite); set({ lite }) },
  setCollapsed: (collapsed) => { save('collapsed', collapsed); set({ collapsed }) },
  setPresent: (present) => set({ present }),
  setFootOpen: (footOpen) => { save('footOpen', footOpen); set({ footOpen }) },
  setLang: (lang) => { save('lang', lang); set({ lang }) },
  setWeek: (week) => set({ week: Math.max(1, Math.min(8, week)) }),
  toast: (text, tone = 'leaf') => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, text, tone }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200)
  },
  setActiveGroup: (activeGroup) => set({ activeGroup }),
  updateGroup: (id, patch) => set((s) => ({ groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
  moveStudent: (sid, to) => set((s) => ({
    groups: s.groups.map((g) => ({ ...g, members: g.id === to ? [...g.members.filter((m) => m !== sid), sid] : g.members.filter((m) => m !== sid) })),
  })),
  logAttempt: (entry) => set((s) => ({ log: [entry, ...s.log] })),
  addXP: (n) => set((s) => ({ xp: s.xp + n })),
  addRecord: (r) => set((s) => ({ records: [{ ...r, card: draftCard(r) }, ...s.records] })),
  approveRecord: (id, card) => set((s) => ({ records: s.records.map((r) => (r.id === id ? { ...r, card: { ...r.card, ...card, ai: false }, status: r.consent === 'restricted' ? 'archived' : 'approved' } : r)) })),
  rejectRecord: (id) => set((s) => ({ records: s.records.map((r) => (r.id === id ? { ...r, status: 'returned' } : r)) })),
  setConsent: (id, consent) => set((s) => ({ records: s.records.map((r) => (r.id === id ? { ...r, consent, status: consent === 'restricted' && r.status === 'approved' ? 'archived' : consent !== 'restricted' && r.status === 'archived' && r.card ? 'approved' : r.status } : r)) })),
  withdrawRecord: (id) => set((s) => ({ records: s.records.map((r) => (r.id === id ? { ...r, status: 'withdrawn' } : r)) })),
  deliverDividend: (id) => set((s) => ({ records: s.records.map((r) => (r.id === id ? { ...r, dividend: { ...r.dividend, status: 'delivered', on: '12 Nov' } } : r)) })),
  togglePassport: (id, k) => set((s) => ({ passport: s.passport.map((p) => (p.id === id ? { ...p, [k]: !p[k] } : p)) })),
  assignMission: (mid, gid) => set((s) => ({ missions: s.missions.map((m) => (m.id === mid ? { ...m, assigned: m.assigned.includes(gid) ? m.assigned.filter((x) => x !== gid) : [...m.assigned, gid] } : m)) })),
}))
