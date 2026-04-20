import { useState, useRef, useEffect } from 'react'

interface Props {
  onAdd: (task: { text: string; time: string; date: string; done: boolean; priority: 'med' }) => void
  accent: string
  selectedDate: string
}

export function AddTaskRow({ onAdd, accent, selectedDate }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [time, setTime] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const submit = () => {
    if (!text.trim()) return
    onAdd({ text: text.trim(), time, date: time ? selectedDate : '', done: false, priority: 'med' })
    setText('')
    setTime('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px 8px', borderRadius: 8,
          color: 'oklch(0.60 0.01 250)', fontSize: 12,
          transition: 'background 0.12s, color 0.12s',
          fontFamily: "'DM Sans', sans-serif",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.97 0.005 250)'; e.currentTarget.style.color = accent }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'oklch(0.60 0.01 250)' }}
      >
        <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Nova tarefa
      </button>
    )
  }

  return (
    <div style={{ background: 'oklch(0.97 0.005 250)', borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') { setOpen(false); setText(''); setTime('') }
        }}
        placeholder="O que precisa fazer?"
        style={{
          border: 'none', background: 'transparent', outline: 'none',
          fontSize: 12.5, fontFamily: "'DM Sans', sans-serif",
          color: 'oklch(0.20 0.01 250)', width: '100%',
        }}
      />
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          style={{
            border: '1px solid oklch(0.88 0.01 250)', borderRadius: 5, padding: '3px 6px',
            fontSize: 11, fontFamily: "'DM Mono', monospace", background: 'white',
            color: 'oklch(0.35 0.01 250)', outline: 'none', cursor: 'pointer',
          }}
        />
        <button
          onClick={submit}
          style={{
            background: accent, border: 'none', borderRadius: 5,
            color: 'white', fontSize: 11, fontWeight: 600,
            padding: '4px 10px', cursor: 'pointer', marginLeft: 'auto',
          }}
        >
          Adicionar
        </button>
        <button
          onClick={() => { setOpen(false); setText(''); setTime('') }}
          style={{
            background: 'none', border: 'none',
            color: 'oklch(0.65 0.01 250)', fontSize: 11, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
