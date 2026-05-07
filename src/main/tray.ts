import { Tray, Menu, nativeImage, app } from 'electron'
import { join, resolve } from 'path'
import * as fs from 'fs'
import { APP_NAME } from './constants'
import { showMainWindow, getMainWindow } from './window'

function getResourcePath(...parts: string[]): string {
  const candidates = [
    join(process.resourcesPath, 'resources', ...parts),
    join(app.getAppPath(), 'resources', ...parts),
    resolve(__dirname, '../../resources', ...parts),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return candidates[0]
}

let tray: Tray | null = null

export function createTray(): Tray {
  const iconPath = getResourcePath('iconTemplate.png')
  const icon = nativeImage.createFromPath(iconPath)

  if (process.platform === 'darwin') {
    icon.setTemplateImage(true)
  }

  tray = new Tray(icon)
  tray.setToolTip(APP_NAME)
  tray.setIgnoreDoubleClickEvents(true)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Open ${APP_NAME}`,
      click: () => showMainWindow()
    },
    { type: 'separator' },
    {
      label: 'New Conversation',
      click: () => {
        const win = getMainWindow()
        if (win) {
          win.webContents.executeJavaScript(`
            const btn = document.querySelector('[data-testid="new-conversation-button"]') ||
                        document.querySelector('button[title*="New"]') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('New Chat'));
            btn?.click();
          `).catch(() => {})
        }
        showMainWindow()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    showMainWindow()
  })

  return tray
}

export function getTray(): Tray | null {
  return tray
}
