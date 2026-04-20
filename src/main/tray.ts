import { Tray, nativeImage } from 'electron'
import { join } from 'path'
import { togglePopup } from './window'

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

  return tray
}
