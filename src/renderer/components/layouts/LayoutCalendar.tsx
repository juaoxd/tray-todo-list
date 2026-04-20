import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { TaskItem } from '../TaskItem'
import { AddTaskRow } from '../AddTaskRow'
import { MiniCalendar } from '../MiniCalendar'
import { QuickNote } from '../QuickNote'
import { isToday, todayKey, fmtDate } from '../../lib/dates'

export function LayoutCalendar() {
  const { tasks, settings, toggleTask, deleteTask, addTask } = useApp()
  const { accent, showQuickNote, fontSize } = settings

  const [selectedDate, setSelectedDate] = useState(todayKey())

  const selectedTasks = tasks
    .filter(t => t.date === selectedDate || (t.date === '' && t.time === ''))
    .sort((a, b) => {
      if (!a.time && b.time) return 1
      if (a.time && !b.time) return -1
      return a.time.localeCompare(b.time)
    })
  const pendingCount = tasks.filter(t => isToday(t.date) && !t.done).length

  const selLabel = isToday(selectedDate) ? 'Hoje' : fmtDate(selectedDate)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px 10px', borderBottom: '1px solid oklch(0.92 0.01 250)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'oklch(0.15 0.01 250)' }}>
          Agenda
        </div>
        {pendingCount > 0 && (
          <span style={{
            background: `${accent}18`, color: accent,
            borderRadius: 6, fontSize: 10, fontWeight: 600, padding: '2px 7px',
          }}>
            {pendingCount} pendente{pendingCount > 1 ? 's' : ''} hoje
          </span>
        )}
      </div>

      {/* Calendar */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid oklch(0.92 0.01 250)' }}>
        <MiniCalendar tasks={tasks} selectedDate={selectedDate} onSelect={setSelectedDate} accent={accent} />
      </div>

      {/* Selected day tasks */}
      <div>
        <div style={{ padding: '8px 14px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'oklch(0.55 0.01 250)' }}>
            {selLabel}
          </div>
          <span style={{ fontSize: 10, color: 'oklch(0.68 0.01 250)' }}>
            {selectedTasks.length} tarefa{selectedTasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ maxHeight: 150, overflowY: 'auto', padding: '0 6px 0' }}>
          {selectedTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: 12, color: 'oklch(0.72 0.01 250)', fontSize: 12 }}>
              Livre — nada agendado
            </div>
          )}
          {selectedTasks.map(t => (
            <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} accent={accent} />
          ))}
        </div>
        <div style={{ padding: '0 8px 4px' }}>
          <AddTaskRow onAdd={addTask} accent={accent} selectedDate={selectedDate} />
        </div>
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
