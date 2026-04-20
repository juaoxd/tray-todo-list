import { BrowserWindow, Rectangle } from 'electron'
import { join } from 'path'

let popup: BrowserWindow | null = null

export function getPopupPosition(trayBounds: Rectangle, windowSize: { width: number; height: number }) {
  if (process.platform === 'darwin') {
    return {
      x: Math.round(trayBounds.x + trayBounds.width / 2 - windowSize.width / 2),
      y: trayBounds.y + trayBounds.height + 4
    }
  }
  // Windows: above taskbar
  return {
    x: Math.round(trayBounds.x + trayBounds.width / 2 - windowSize.width / 2),
    y: trayBounds.y - windowSize.height - 4
  }
}

export function createPopup(): BrowserWindow {
  popup = new BrowserWindow({
    width: 330,
    height: 520,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  popup.on('blur', () => {
    popup?.hide()
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    popup.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    popup.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return popup
}

export function getPopup(): BrowserWindow | null {
  return popup
}

export function togglePopup(trayBounds: Rectangle): void {
  if (!popup) return

  if (popup.isVisible()) {
    popup.hide()
  } else {
    const pos = getPopupPosition(trayBounds, popup.getBounds())
    popup.setPosition(pos.x, pos.y, false)
    popup.show()
  }
}
