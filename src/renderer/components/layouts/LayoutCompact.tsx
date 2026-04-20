import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { TaskItem } from '../TaskItem'
import { AddTaskRow } from '../AddTaskRow'
import { MiniCalendar } from '../MiniCalendar'
import { QuickNote } from '../QuickNote'
import { isToday, todayKey, fmtTodayLong } from '../../lib/dates'

export function LayoutCompact() {
  const { tasks, settings, toggleTask, deleteTask, addTask } = useApp()
  const { accent, showQuickNote, fontSize } = settings

  const [tab, setTab] = useState<'today' | 'upcoming'>('today')
  const [calOpen, setCalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayKey())

  const todayTasks = tasks.filter(t => isToday(t.date))
  const upcomingTasks = tasks.filter(t => !isToday(t.date)).sort((a, b) => a.date.localeCompare(b.date))
  const todayPending = todayTasks.filter(t => !t.done).length
  const filteredTasks = tab === 'today' ? todayTasks : upcomingTasks

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize }}>
      {/* Header */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid oklch(0.92 0.01 250)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'oklch(0.62 0.01 250)' }}>
              Hoje
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'oklch(0.15 0.01 250)', lineHeight: 1.2 }}>
              {fmtTodayLong()}
            </div>
          </div>
          <button
            onClick={() => setCalOpen(o => !o)}
            style={{
              background: calOpen ? `${accent}18` : 'oklch(0.94 0.01 250)',
              border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500,
              color: calOpen ? accent : 'oklch(0.45 0.01 250)', transition: 'all 0.15s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="2" width="11" height="10" rx="1.5" />
              <path d="M4 1v2M9 1v2M1 5h11" />
            </svg>
            Cal
          </button>
        </div>
      </div>

      {/* Calendar (collapsible) */}
      {calOpen && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid oklch(0.92 0.01 250)' }}>
          <MiniCalendar tasks={tasks} selectedDate={selectedDate} onSelect={setSelectedDate} accent={accent} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '8px 14px 0', gap: 4 }}>
        {([['today', 'Hoje', todayPending], ['upcoming', 'Próximos', upcomingTasks.length]] as const).map(([id, label, cnt]) => (
          <button
            key={id}
            onClick={() => setTab(id as 'today' | 'upcoming')}
            style={{
              padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600,
              background: tab === id ? accent : 'transparent',
              color: tab === id ? 'white' : 'oklch(0.55 0.01 250)',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 3,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {label}
            {(cnt as number) > 0 && (
              <span style={{
                background: tab === id ? 'white' : 'oklch(0.88 0.01 250)',
                color: tab === id ? accent : 'oklch(0.50 0.01 250)',
                borderRadius: 10, fontSize: 9, fontWeight: 700, padding: '1px 5px',
              }}>
                {cnt as number}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ padding: '6px 6px 4px', maxHeight: 180, overflowY: 'auto' }}>
        {filteredTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: 16, color: 'oklch(0.72 0.01 250)', fontSize: 12 }}>
            Nenhuma tarefa ✓
          </div>
        )}
        {filteredTasks.map(t => (
          <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} accent={accent} />
        ))}
        <div style={{ padding: '0 2px' }}>
          <AddTaskRow onAdd={addTask} accent={accent} selectedDate={selectedDate} />
        </div>
      </div>

      {/* Quick note */}
      {showQuickNote && (
        <div style={{ padding: '8px 14px 12px', borderTop: '1px solid oklch(0.92 0.01 250)', marginTop: 4 }}>
          <QuickNote accent={accent} />
        </div>
      )}
    </div>
  )
}
