import { app } from 'electron'
import { initDatabase } from './database'
import { createTray } from './tray'
import { createPopup } from './window'
import { registerIpcHandlers } from './ipc-handlers'
import { startNotificationScheduler } from './notifications'

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
}

// Hide dock icon on macOS
if (process.platform === 'darwin') {
  app.dock.hide()
}

app.whenReady().then(async () => {
  await initDatabase()
  registerIpcHandlers()
  createPopup()
  createTray()
  startNotificationScheduler()
})

// Keep app running when all windows are closed (tray app behavior)
app.on('window-all-closed', (e: Event) => {
  e.preventDefault()
})
