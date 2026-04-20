import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { TaskItem } from '../TaskItem'
import { AddTaskRow } from '../AddTaskRow'
import { MiniCalendar } from '../MiniCalendar'
import { QuickNote } from '../QuickNote'
import { fmtTodayHeader } from '../../lib/dates'

export function LayoutFocus() {
  const { tasks, settings, toggleTask, deleteTask, addTask } = useApp()
  const { accent, showQuickNote, fontSize } = settings

  const [calOpen, setCalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayKey())

  const displayTasks = tasks
    .filter(t => t.date === selectedDate || (t.date === '' && t.time === ''))
    .sort((a, b) => {
      if (!a.time && b.time) return 1
      if (a.time && !b.time) return -1
      return a.time.localeCompare(b.time)
    })
  const done = displayTasks.filter(t => t.done).length
  const total = displayTasks.length
  const pct = total ? Math.round(done / total * 100) : 0

  const nextTask = displayTasks.find(t => !t.done && t.time)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize }}>
      {/* Header */}
      <div style={{ padding: '14px 14px 12px', background: `${accent}08` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: accent, marginBottom: 4,
            }}>
              {fmtTodayHeader()}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 26, fontWeight: 600, color: 'oklch(0.15 0.01 250)', fontFamily: "'DM Mono', monospace" }}>
                {done}/{total}
              </span>
              <span style={{ fontSize: 12, color: 'oklch(0.55 0.01 250)', fontWeight: 400 }}>
                tarefas concluídas
              </span>
            </div>
          </div>
          <button
            onClick={() => setCalOpen(o => !o)}
            style={{
              background: calOpen ? `${accent}18` : 'oklch(0.94 0.01 250)',
              border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500,
              color: calOpen ? accent : 'oklch(0.45 0.01 250)', transition: 'all 0.15s', marginTop: 2,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="2" width="11" height="10" rx="1.5" />
              <path d="M4 1v2M9 1v2M1 5h11" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 8, height: 3, background: 'oklch(0.90 0.01 250)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>

        {nextTask && (
          <div style={{
            marginTop: 8, fontSize: 10.5, color: 'oklch(0.50 0.01 250)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontFamily: "'DM Mono', monospace", color: accent, fontWeight: 500 }}>{nextTask.time}</span>
            <span>→</span>
            <span style={{ fontWeight: 500, color: 'oklch(0.30 0.01 250)' }}>{nextTask.text}</span>
          </div>
        )}
      </div>

      {/* Calendar (collapsible) */}
      {calOpen && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid oklch(0.92 0.01 250)' }}>
          <MiniCalendar tasks={tasks} selectedDate={selectedDate} onSelect={setSelectedDate} accent={accent} />
        </div>
      )}

      {/* Tasks */}
      <div style={{ maxHeight: 200, overflowY: 'auto', padding: '6px 6px 0' }}>
        {displayTasks.map(t => (
          <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} accent={accent} />
        ))}
      </div>
      <div style={{ padding: '0 8px 4px' }}>
        <AddTaskRow onAdd={addTask} accent={accent} selectedDate={selectedDate} />
      </div>

      {/* Quick note */}
      {showQuickNote && (
        <div style={{ padding: '8px 14px 12px', borderTop: '1px solid oklch(0.92 0.01 250)' }}>
          <QuickNote accent={accent} />
        </div>
      )}
    </div>
  )
}
