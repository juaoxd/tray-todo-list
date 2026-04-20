import { useState } from 'react'
import { Task } from '../lib/types'
import { getPriorityColor } from '../lib/dates'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  accent: string
}

export function TaskItem({ task, onToggle, onDelete, accent }: Props) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '6px 8px',
        borderRadius: 8,
        background: hov ? 'oklch(0.97 0.005 250)' : 'transparent',
        transition: 'background 0.12s',
        cursor: 'default',
      }}
    >
      <button
        onClick={() => onToggle(task.id)}
        style={{
          width: 16, height: 16, borderRadius: 4.5,
          border: '1.5px solid',
          flexShrink: 0, marginTop: 1,
          borderColor: task.done ? accent : 'oklch(0.78 0.01 250)',
          background: task.done ? accent : 'transparent',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s',
        }}
      >
        {task.done && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, fontWeight: task.done ? 400 : 500,
          color: task.done ? 'oklch(0.68 0.01 250)' : 'oklch(0.20 0.01 250)',
          textDecoration: task.done ? 'line-through' : 'none',
          lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {task.text}
        </div>
        {task.time && (
          <div style={{
            fontSize: 10.5, fontFamily: "'DM Mono', monospace",
            color: 'oklch(0.65 0.01 250)', marginTop: 1,
          }}>
            {task.time}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: getPriorityColor(task.priority),
          opacity: 0.8, marginTop: 4,
        }} />
        {hov && (
          <button
            onClick={() => onDelete(task.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 1,
              color: 'oklch(0.70 0.01 250)', fontSize: 13, lineHeight: 1,
              borderRadius: 3, transition: 'color 0.1s',
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
