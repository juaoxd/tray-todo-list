export const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export function getToday(): Date {
  return new Date()
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return formatDateKey(getToday())
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayKey()
}

export function fmtDate(dateStr: string): string {
  const [y, m, day] = dateStr.split('-')
  const dt = new Date(+y, +m - 1, +day)
  return dt.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function fmtTodayLong(): string {
  const d = getToday()
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`
}

export function fmtTodayHeader(): string {
  const d = getToday()
  const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  const day = d.getDate()
  const monthShort = MONTHS_PT[d.getMonth()].slice(0, 3)
  return `${weekdays[d.getDay()]}, ${day} ${monthShort}`
}

export function getPriorityColor(p: string): string {
  if (p === 'high') return 'oklch(0.60 0.20 25)'
  if (p === 'med') return 'oklch(0.65 0.18 70)'
  return 'oklch(0.62 0.14 155)'
}
