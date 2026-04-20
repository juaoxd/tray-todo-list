import { Tray, nativeImage, Menu, app } from 'electron'
import { join } from 'path'
import { togglePopup, showSettings } from './window'

let tray: Tray | null = null

export function createTray(): Tray {
  const iconName = process.platform === 'darwin' ? 'iconTemplate.png' : 'icon.png'
  const iconPath = join(__dirname, '../../resources', iconName)

  const icon = nativeImage.createFromPath(iconPath)
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon)

  tray.setToolTip('Tray Todo')

  tray.on('click', () => {
    if (tray) {
      togglePopup(tray.getBounds())
    }
  })

  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Configurações', click: () => tray && showSettings(tray.getBounds()) },
      { type: 'separator' },
      { label: 'Fechar', click: () => app.quit() }
    ])
    tray?.popUpContextMenu(contextMenu)
  })

  return tray
}
