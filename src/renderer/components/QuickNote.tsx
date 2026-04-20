import { useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext'

interface Props {
  accent: string
}

export function QuickNote({ accent }: Props) {
  const { note, setNote } = useApp()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleChange = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setNote(value)
    }, 500)
  }, [setNote])

  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
        color: 'oklch(0.62 0.01 250)', marginBottom: 6,
      }}>
        Nota rápida
      </div>
      <textarea
        defaultValue={note}
        onChange={e => handleChange(e.target.value)}
        placeholder="Rascunho, ideia, link..."
        style={{
          width: '100%', minHeight: 58, resize: 'none',
          border: '1px solid oklch(0.90 0.01 250)', borderRadius: 8,
          padding: '8px 10px', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
          color: 'oklch(0.25 0.01 250)', background: 'oklch(0.985 0.005 250)',
          outline: 'none', lineHeight: 1.5,
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = accent}
        onBlur={e => e.target.style.borderColor = 'oklch(0.90 0.01 250)'}
      />
    </div>
  )
}
