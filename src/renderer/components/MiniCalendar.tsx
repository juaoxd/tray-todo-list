import { useState } from 'react'
import { Task } from '../lib/types'
import { DAYS_PT, MONTHS_PT, getToday } from '../lib/dates'

interface Props {
  tasks: Task[]
  selectedDate: string
  onSelect: (date: string) => void
  accent: string
}

const calNavBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 16, color: 'oklch(0.50 0.01 250)', padding: '0 4px',
  borderRadius: 4, lineHeight: 1, transition: 'color 0.1s',
}

export function MiniCalendar({ tasks, selectedDate, onSelect, accent }: Props) {
  const today = getToday()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const taskDates = new Set(tasks.map(t => t.date))

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isSelected = (d: number | null) => {
    if (!d || !selectedDate) return false
    const s = selectedDate.split('-')
    return +s[0] === year && +s[1] - 1 === month && +s[2] === d
  }

  const isTodayCell = (d: number | null) => {
    if (!d) return false
    return year === today.getFullYear() && month === today.getMonth() && d === today.getDate()
  }

  const hasTasks = (d: number | null) => {
    if (!d) return false
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return taskDates.has(key)
  }

  const select = (d: number | null) => {
    if (!d) return
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    onSelect(key)
  }

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div style={{ userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button onClick={prevMonth} style={calNavBtn}>&lsaquo;</button>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'oklch(0.25 0.01 250)' }}>
          {MONTHS_PT[month]} {year}
        </span>
        <button onClick={nextMonth} style={calNavBtn}>&rsaquo;</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: 4 }}>
        {DAYS_PT.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 10, fontWeight: 600,
            color: 'oklch(0.65 0.01 250)', padding: '0 0 2px',
            fontFamily: "'DM Mono', monospace",
          }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((d, i) => {
          const sel = isSelected(d)
          const tod = isTodayCell(d)
          const has = hasTasks(d)
          return (
            <div
              key={i}
              onClick={() => select(d)}
              style={{
                textAlign: 'center',
                width: 28, height: 28, borderRadius: 7,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontFamily: "'DM Mono', monospace",
                fontWeight: tod ? 600 : 400,
                color: sel ? 'white' : tod ? accent : d ? 'oklch(0.25 0.01 250)' : 'transparent',
                background: sel ? accent : tod ? `${accent}18` : 'transparent',
                cursor: d ? 'pointer' : 'default',
                position: 'relative',
                transition: 'background 0.12s',
              }}
            >
              {d || ''}
              {has && !sel && (
                <span style={{
                  position: 'absolute', bottom: 2,
                  width: 3, height: 3, borderRadius: '50%',
                  background: accent, opacity: 0.7,
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
