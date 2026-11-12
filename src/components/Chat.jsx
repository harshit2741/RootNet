import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SendHorizontal, Mic } from 'lucide-react'
import Mascot from './Mascot'

// Generic chat surface used by the student buddy, Ask Buddy and the teacher assistant.
export default function Chat({ title, subtitle, avatar, badge, messages, typing, onSend, quick = [], onQuick, placeholder = 'Type here…', note, disabled, inputLabel = 'Message', mood = 'happy', voice, typingAvatar }) {
  const [text, setText] = useState('')
  const logRef = useRef(null)
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight }, [messages, typing])
  const send = (e) => { e?.preventDefault(); const t = text.trim(); if (!t || disabled) return; setText(''); onSend(t) }
  return (
    <section className="glass chat" aria-label={title}>
      <div className="chat-head">
        {avatar || <Mascot size={48} mood={mood} float={false} />}
        <div style={{ flex: 1 }}>
          <div className="row" style={{ gap: 8 }}><h2>{title}</h2>{badge}</div>
          {subtitle && <p className="small faint">{subtitle}</p>}
        </div>
      </div>
      <div className="chat-log" ref={logRef} aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} className={`msg ${m.from === 'me' ? 'me' : m.from === 'sys' ? 'sys' : ''}`}
              initial={{ opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .22 }}>
              {m.from === 'buddy' && (m.avatar || <Mascot size={34} mood={m.mood || 'happy'} float={false} />)}
              <div>
                {m.who && <div className="who">{m.who}</div>}
                <div className="bubble">{m.text}{m.node}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && <div className="msg">{typingAvatar || <Mascot size={34} mood="think" float={false} />}<div className="bubble"><span className="typing" aria-label="Buddy is typing"><i /><i /><i /></span></div></div>}
      </div>
      <form className="chat-foot" onSubmit={send}>
        {quick.length > 0 && <div className="quick">{quick.map((q) => <button type="button" key={q} onClick={() => onQuick ? onQuick(q) : onSend(q)} disabled={disabled}>{q}</button>)}</div>}
        <div className="composer">
          {voice && <button type="button" className="btn icon" aria-label="Speak instead (uses the tablet microphone in the real hub)" title="Speak instead" onClick={voice}><Mic size={18} /></button>}
          <label className="sr-only" htmlFor={`in-${title}`}>{inputLabel}</label>
          <input id={`in-${title}`} className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} disabled={disabled} autoComplete="off" />
          <button className="btn primary icon" type="submit" aria-label="Send" disabled={disabled || !text.trim()}><SendHorizontal size={18} /></button>
        </div>
        {note && <p className="tiny faint">{note}</p>}
      </form>
    </section>
  )
}
