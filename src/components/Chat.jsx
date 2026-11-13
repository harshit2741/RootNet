import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SendHorizontal, Mic, Sparkles } from 'lucide-react'

export const BotMark = ({ icon: I = Sparkles }) => <span className="bot"><I size={16} /></span>

// Shared chat surface: student Buddy, Ask Buddy and the teaching assistant.
export default function Chat({ title, subtitle, icon, badge, messages, typing, onSend, quick = [], onQuick, placeholder = 'Type a message…', note, disabled, inputLabel = 'Message', voice }) {
  const [text, setText] = useState('')
  const logRef = useRef(null)
  const sendRef = useRef(onSend); sendRef.current = onSend
  // the auto demo can type into whichever chat is on screen
  useEffect(() => { const h = (e) => sendRef.current(e.detail); window.addEventListener('roots-tour-send', h); return () => window.removeEventListener('roots-tour-send', h) }, [])
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight }, [messages, typing])
  const send = (e) => { e?.preventDefault(); const t = text.trim(); if (!t || disabled) return; setText(''); onSend(t) }
  return (
    <section className="card chat" aria-label={title} data-tour="chat">
      <div className="chat-h">
        <BotMark icon={icon} />
        <div style={{ flex: 1, minWidth: 0 }}><div className="row" style={{ gap: 8 }}><h2>{title}</h2>{badge}</div>{subtitle && <p className="xs t3">{subtitle}</p>}</div>
      </div>
      <div className="chat-log" ref={logRef} aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} className={`msg ${m.from === 'me' ? 'me' : m.from === 'sys' ? 'sys' : ''}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}>
              {m.from === 'buddy' && <BotMark icon={icon} />}
              <div style={{ minWidth: 0 }}>{m.who && <div className="who">{m.who}</div>}<div className="bub">{m.text}{m.node}</div></div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && <div className="msg"><BotMark icon={icon} /><div className="bub"><span className="typing" aria-label="Typing"><i /><i /><i /></span></div></div>}
      </div>
      <form className="chat-f" onSubmit={send}>
        {quick.length > 0 && <div className="quick">{quick.map((q) => <button type="button" key={q} disabled={disabled} onClick={() => (onQuick ? onQuick(q) : onSend(q))}>{q}</button>)}</div>}
        <div className="row" style={{ flexWrap: 'nowrap', gap: 8 }}>
          {voice && <button type="button" className="btn icon" aria-label="Speak instead" title="Speak instead" onClick={voice}><Mic size={17} /></button>}
          <label className="sr-only" htmlFor={`in-${title}`}>{inputLabel}</label>
          <input id={`in-${title}`} className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} disabled={disabled} autoComplete="off" />
          <button className="btn primary icon" type="submit" aria-label="Send" disabled={disabled || !text.trim()}><SendHorizontal size={17} /></button>
        </div>
        {note && <p className="xs t3">{note}</p>}
      </form>
    </section>
  )
}
