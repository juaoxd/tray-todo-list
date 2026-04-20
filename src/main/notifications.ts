import { Notification } from 'electron'
import { listTasks, getSettings } from './database'

const notified = new Set<number>()

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getCurrentTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

export function startNotificationScheduler(): void {
  setInterval(() => {
    const settings = getSettings()
    if (!settings.notifications_enabled) return

    const today = getTodayKey()
    const currentTime = getCurrentTime()

    for (const task of listTasks()) {
      if (task.done || task.date !== today || task.time !== currentTime) continue
      if (notified.has(task.id)) continue

      notified.add(task.id)
      new Notification({
        title: 'Tarefa',
        body: task.text,
      }).show()
    }
  }, 60 * 1000)
}
