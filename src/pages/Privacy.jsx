import { useNavigate, useParams } from 'react-router-dom'
import { ShieldCheck, Baby, Bot, Sprout, Accessibility, FlaskConical, Lock, WifiOff, Trash2, Eye, UserCheck, AlertTriangle } from 'lucide-react'
import { Glass, PageHead, Notice } from '../components/ui'

const TABS = [
  ['', 'Privacy policy', ShieldCheck], ['children', 'Children’s data', Baby], ['ai', 'How the AI works', Bot],
  ['knowledge', 'Community knowledge', Sprout], ['access', 'Accessibility', Accessibility], ['prototype', 'Prototype disclaimer', FlaskConical],
]

const DATA = [
  ['Child’s first name and group', 'To show the right questions to the right group', 'School laptop only', 'Teachers; the child’s own group', 'Until the child leaves the school, then deleted'],
  ['Practice tries, hints used, Checker’s explanation', 'To help teachers see who needs help and to regroup by level', 'School laptop only', 'Teachers', '1 school year, then summarised without names'],
  ['Skill Passport evidence (photo of the work, not the child)', 'To record skills a child has shown', 'School laptop only', 'Teacher, mentor, the child, their parent', 'Until the child leaves; the family may take a printed copy'],
  ['Village Voice recordings and photos', 'To build lesson cards from village knowledge', 'School laptop; tablets if Public or School only', 'As chosen by the contributor', 'Until the contributor takes it back'],
  ['Parent consent record', 'To show that a parent or guardian agreed', 'School office file + hub', 'Head teacher', 'As long as the child uses ROOTS'],
]

function Policy() {
  return (
    <div className="prose">
      <p>ROOTS is run by the school, under its School Management Committee (SMC). The SMC decides how data is used and is responsible for it. This page explains, in plain words, what ROOTS keeps, why, where, and what you can do about it.</p>
      <div className="grid g3" style={{ maxWidth: 'none' }}>
        {[[WifiOff, 'Stays in the village', 'Everything is stored on the school laptop and its backup drive. Nothing is sent to the internet or to any company.'], [Eye, 'Only what is needed', 'First names only. No phone numbers, addresses, ID numbers, location tracking, ads or profiles.'], [Trash2, 'You can say no', 'Parents and contributors can see, correct or delete their data, and withdraw consent at any time.']].map(([I, h, p]) => (
          <div key={h} className="well" style={{ padding: 16, display: 'grid', gap: 6 }}><I size={22} color="var(--leaf)" /><b>{h}</b><span className="small muted">{p}</span></div>
        ))}
      </div>
      <h3>What we keep and why</h3>
      <div className="scroll-x"><table className="table"><thead><tr><th>Data</th><th>Why</th><th>Where</th><th>Who sees it</th><th>How long</th></tr></thead><tbody>{DATA.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={i ? 'small' : ''}>{i ? c : <b>{c}</b>}</td>)}</tr>)}</tbody></table></div>
      <h3>What we never do</h3>
      <ul><li>Sell, share or send data to any company or app.</li><li>Show advertising, or track children’s behaviour to target them.</li><li>Rank or label children publicly. Levels guide grouping only.</li><li>Use cameras or microphones without someone pressing the button.</li><li>Take photos of children for lesson cards. Photos are of work, crafts, fields and tools.</li></ul>
      <h3>Your rights</h3>
      <ul><li><b>See</b> what is stored about you or your child: ask the teacher for a printed copy.</li><li><b>Correct</b> anything that is wrong.</li><li><b>Delete</b> your data or your child’s data. It is removed from the hub and every tablet within 7 days.</li><li><b>Withdraw consent</b> at any time. Your child can still take part using printed cards.</li><li><b>Complain</b> to the head teacher, who is the school’s contact for data questions. If you are not satisfied, you can approach the Data Protection Board of India.</li></ul>
      <h3>Keeping it safe</h3>
      <ul><li>The hub’s Wi-Fi has a password and does not connect to the internet during class.</li><li>Teacher screens need a PIN. Restricted village records are encrypted and open only for the contributor and the SMC.</li><li>The backup drive is kept in a locked cupboard.</li><li>If data is ever lost or seen by the wrong person, the school will tell the affected families straight away, and the Data Protection Board within 72 hours, as the DPDP Rules require.</li></ul>
      <h3>The law we follow</h3>
      <p>ROOTS is designed around India’s Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 (notified on 14 November 2025, coming into force in phases). Even where a school may be exempt from some duties, ROOTS asks for a parent’s or guardian’s consent before using a child’s data, and it never tracks children for advertising.</p>
    </div>
  )
}

function Children() {
  return (
    <div className="prose">
      <Notice icon={UserCheck} tone="leaf">Before a child uses ROOTS, a parent or guardian gives consent. The teacher explains ROOTS in Khasi or English at a parents’ meeting, and the parent signs or gives a thumbprint on a simple form. The school keeps the form.</Notice>
      <h3>How we protect children</h3>
      <ul><li><b>No accounts, no passwords, no personal devices.</b> Children use shared tablets as a group and pick their group, not their name.</li><li><b>First names only.</b> No surnames, dates of birth, photos of faces, or home details.</li><li><b>No chat with strangers.</b> Buddy is not connected to the internet and no one outside the school can message a child.</li><li><b>No ads, no tracking, no selling.</b> Practice data is used only to help the child learn and the teacher teach.</li><li><b>No public ranking.</b> Stars and badges reward thinking and explaining, not speed, and are shared by the group.</li><li><b>Healthy use.</b> Practice sessions are short (about 20 minutes), mixed with hands-on missions and Roots Day.</li></ul>
      <h3>If a child types something worrying</h3>
      <p>Buddy does not try to counsel children. It tells the child to speak to their teacher, and it never asks for personal details. Teachers are trained to follow the school’s child-protection policy.</p>
    </div>
  )
}

function AI() {
  return (
    <div className="prose">
      <p>ROOTS uses a small, open-source AI model (about 1 billion parameters, the Gemma 3 1B class) that runs on the school laptop’s processor. It does not use the internet, paid services or any company’s servers.</p>
      <div className="grid g2" style={{ maxWidth: 'none' }}>
        <div className="well" style={{ padding: 16 }}><b>What the AI does</b><ul className="small" style={{ marginTop: 8 }}><li>Writes hint wording for each question, overnight</li><li>Drafts lesson cards from a contributor’s own summary</li><li>Suggests the subject and concept a recording links to</li><li>Answers short teacher questions about class data</li></ul></div>
        <div className="well" style={{ padding: 16 }}><b>What the AI never does</b><ul className="small" style={{ marginTop: 8 }}><li>Gives a child the final answer to a practice question</li><li>Publishes anything without a teacher’s approval</li><li>Adds facts about culture, tradition or history</li><li>Sees records marked Restricted</li><li>Makes decisions about a child’s level or group</li></ul></div>
      </div>
      <h3>The hint rules are plain code, not AI</h3>
      <p>“No hint until the group tries” and “the Checker explains before saving” are fixed rules in the app. The AI only writes the wording of the hints, and teachers check them.</p>
      <h3>Languages, honestly</h3>
      <p>The AI works in English (and Hindi or Assamese where useful). It does <b>not</b> claim to understand or speak Khasi or other tribal languages: open speech and translation models are weak for them. The local language comes from people: elders’ recordings, teachers’ voice-overs and older students as translators. We see this as respect for an oral tradition, not a gap to hide.</p>
      <Notice icon={AlertTriangle} tone="warn">AI can make mistakes. Every AI draft is marked until a teacher approves it, and children are told to ask their teacher if something seems wrong.</Notice>
    </div>
  )
}

function Knowledge() {
  return (
    <div className="prose">
      <p>The knowledge farmers, artisans and elders share belongs to them and to their community, not to the school and not to ROOTS.</p>
      <ul>
        <li><b>You choose who hears it:</b> Public, School only, or Restricted (kept in the archive, never shown to children).</li>
        <li><b>You can change your mind:</b> change the setting or take a recording back at any time. It disappears from tablets at the next sync.</li>
        <li><b>You are always named:</b> every lesson card says whose knowledge it is.</li>
        <li><b>No one profits from it:</b> recordings are never sold or used for advertising. If a product card is made for an artisan, it is theirs to use or not.</li>
        <li><b>Sacred or private knowledge stays private:</b> communities decide what is not for recording. The school does not ask.</li>
        <li><b>Something comes back:</b> every contribution earns a Knowledge Dividend, such as a crop calendar, a printed record of a craft, or a recording for the family.</li>
      </ul>
      <p>Consent rules are agreed with the village in the first month of the pilot, with the headman or Dorbar where appropriate, before any recording begins.</p>
    </div>
  )
}

function Access() {
  return (
    <div className="prose">
      <ul>
        <li>Text uses Lexend, a typeface designed to make reading easier, at a large size with strong contrast.</li>
        <li>Every button has a text label as well as an icon. Colour is never the only sign of status.</li>
        <li>Light and dark themes, and a Lite mode that turns off glass effects for older tablets and for anyone who finds them distracting.</li>
        <li>Works with a keyboard; focus is always visible. Animations stop if the device asks for reduced motion.</li>
        <li>Questions can be read aloud, and knowledge holders can record instead of typing.</li>
        <li>Paper-first: every hint ladder, mission and passport can be printed, so no child is left out when devices fail.</li>
      </ul>
    </div>
  )
}

function Prototype() {
  return (
    <div className="prose">
      <Notice icon={FlaskConical} tone="gold">This is a clickable prototype made for the ProdMad 6.0 “ROOTS” case competition (bITeSys, IIM Shillong). It is not a live service.</Notice>
      <ul>
        <li>All names, groups, recordings, numbers and charts are <b>fictional sample data</b>. Any likeness to real people is unintended.</li>
        <li>Recording, read-aloud, syncing, backup and the AI model are <b>simulated</b>. Buddy’s replies come from simple rules that copy how the real hub would behave.</li>
        <li>The prototype runs entirely in your browser. It sends nothing to a server. Your theme and Lite mode choice are remembered in your browser only.</li>
        <li>Photos you choose stay in your browser and disappear when you reload.</li>
        <li>This policy text shows how ROOTS would handle data in a real pilot. It is not legal advice; a real school would review it with the SMC and an adviser.</li>
        <li>Learning-level steps follow the style of ASER surveys; Kolibri and DIKSHA are named as the open content sources ROOTS would sit on top of. No endorsement by those organisations is implied.</li>
      </ul>
    </div>
  )
}

export default function Privacy() {
  const { tab = '' } = useParams(); const nav = useNavigate()
  const cur = TABS.find((t) => t[0] === tab) || TABS[0]
  const Body = { '': Policy, children: Children, ai: AI, knowledge: Knowledge, access: Access, prototype: Prototype }[cur[0]]
  return (
    <>
      <PageHead eyebrow="Privacy & safety" title={cur[1]} lede="Written in plain words for teachers, parents and village contributors. Last updated 12 November 2026." />
      <div className="grid split-lib">
        <Glass className="stack-sm" style={{ padding: 10 }} as="nav" aria-label="Policy sections">
          {TABS.map(([id, label, I]) => <button key={id} type="button" className={`navitem ${cur[0] === id ? 'active' : ''}`} style={{ border: 0, background: cur[0] === id ? undefined : 'transparent', cursor: 'pointer', textAlign: 'left' }} onClick={() => nav(id ? `/privacy/${id}` : '/privacy')}><I />{label}</button>)}
          <div className="divider" />
          <span className="tiny faint row" style={{ gap: 6, padding: '4px 10px' }}><Lock size={12} />Data contact: the head teacher</span>
        </Glass>
        <Glass strong className="pad-lg"><Body /></Glass>
      </div>
    </>
  )
}
