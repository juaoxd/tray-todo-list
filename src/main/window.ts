import { BrowserWindow, Rectangle, screen } from 'electron'
import { join } from 'path'

let popup: BrowserWindow | null = null
let popupHeight = 520
let lastTrayBounds: Rectangle | null = null

export function getPopupPosition(trayBounds: Rectangle, windowSize: { width: number; height: number }) {
  if (process.platform === 'darwin') {
    return {
      x: Math.round(trayBounds.x + trayBounds.width / 2 - windowSize.width / 2),
      y: trayBounds.y + trayBounds.height + 4
    }
  }

  // Windows: detect taskbar position via workArea vs display bounds
  const display = screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y })
  const { workArea, bounds } = display
  const taskbarAtTop = workArea.y > bounds.y

  let x = Math.round(trayBounds.x + trayBounds.width / 2 - windowSize.width / 2)
  const y = taskbarAtTop
    ? trayBounds.y + trayBounds.height + 4
    : trayBounds.y - windowSize.height - 4

  // Clamp horizontally so popup doesn't go off screen
  x = Math.max(workArea.x, Math.min(x, workArea.x + workArea.width - windowSize.width))

  return { x, y }
}

export function createPopup(): BrowserWindow {
  popup = new BrowserWindow({
    width: 330,
    height: popupHeight,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: true,
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

export function setPopupHeight(h: number): void {
  popupHeight = h
  if (!popup || !popup.isVisible() || !lastTrayBounds) return
  popup.setSize(330, h)
  const pos = getPopupPosition(lastTrayBounds, { width: 330, height: h })
  popup.setPosition(pos.x, pos.y, false)
}

export function togglePopup(trayBounds: Rectangle): void {
  lastTrayBounds = trayBounds
  if (!popup) return

  if (popup.isVisible()) {
    popup.hide()
  } else {
    popup.setSize(330, popupHeight)
    const pos = getPopupPosition(trayBounds, { width: 330, height: popupHeight })
    popup.setPosition(pos.x, pos.y, false)
    popup.show()
  }
}

export function showSettings(trayBounds: Rectangle): void {
  lastTrayBounds = trayBounds
  if (!popup) return
  popup.setSize(330, popupHeight)
  const pos = getPopupPosition(trayBounds, { width: 330, height: popupHeight })
  popup.setPosition(pos.x, pos.y, false)
  popup.show()
  popup.webContents.send('show-settings')
}
