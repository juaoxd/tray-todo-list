import { ipcMain } from 'electron'
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  getNote,
  setNote,
  getSettings,
  updateSettings
} from './database'
import { getPopup, setPopupHeight } from './window'

export function registerIpcHandlers(): void {
  ipcMain.handle('tasks:list', () => {
    return listTasks()
  })

  ipcMain.handle('tasks:create', (_event, task) => {
    return createTask(task)
  })

  ipcMain.handle('tasks:update', (_event, { id, ...fields }) => {
    return updateTask(id, fields)
  })

  ipcMain.handle('tasks:delete', (_event, { id }) => {
    deleteTask(id)
  })

  ipcMain.handle('note:get', () => {
    return getNote()
  })

  ipcMain.handle('note:set', (_event, { content }) => {
    setNote(content)
  })

  ipcMain.handle('settings:get', () => {
    const row = getSettings()
    return {
      layout: row.layout,
      accent: row.accent,
      showQuickNote: row.show_quick_note === 1,
      fontSize: row.font_size,
      notificationsEnabled: row.notifications_enabled === 1
    }
  })

  ipcMain.handle('settings:update', (_event, settings) => {
    const mapped: Record<string, string | number> = {}
    if (settings.layout !== undefined) mapped.layout = settings.layout
    if (settings.accent !== undefined) mapped.accent = settings.accent
    if (settings.showQuickNote !== undefined) mapped.show_quick_note = settings.showQuickNote ? 1 : 0
    if (settings.fontSize !== undefined) mapped.font_size = settings.fontSize
    if (settings.notificationsEnabled !== undefined) mapped.notifications_enabled = settings.notificationsEnabled ? 1 : 0

    const row = updateSettings(mapped)
    return {
      layout: row.layout,
      accent: row.accent,
      showQuickNote: row.show_quick_note === 1,
      fontSize: row.font_size,
      notificationsEnabled: row.notifications_enabled === 1
    }
  })

  ipcMain.handle('window:hide', () => {
    getPopup()?.hide()
  })

  ipcMain.handle('window:resize', (_event, { height }: { height: number }) => {
    setPopupHeight(Math.ceil(height))
  })
}
