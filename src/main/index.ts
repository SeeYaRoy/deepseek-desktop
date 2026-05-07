import { app, nativeImage } from 'electron'
import { join, resolve } from 'path'
import * as fs from 'fs'
import { createMainWindow, showMainWindow, setIsQuitting } from './window'
import { createTray } from './tray'
import { registerGlobalShortcuts, unregisterGlobalShortcuts } from './shortcuts'
import { setupNotifications, clearBadge } from './notifications'
import { closeCache } from './cache'

function getResourcePath(...parts: string[]): string | undefined {
  const candidates = [
    join(process.cwd(), 'resources', ...parts),
    join(process.resourcesPath, 'resources', ...parts),
    join(app.getAppPath(), 'resources', ...parts),
    resolve(__dirname, '../../resources', ...parts),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  console.warn('[Main] Resource not found:', parts, 'tried:', candidates)
  return undefined
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
  process.exit(0)
}

app.on('second-instance', () => {
  showMainWindow()
})

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const dockIconPath = getResourcePath('icon.png')
    if (dockIconPath) {
      app.dock.setIcon(nativeImage.createFromPath(dockIconPath))
    }
  }

  const win = createMainWindow()
  createTray()
  registerGlobalShortcuts()
  setupNotifications()

  win.on('focus', () => {
    clearBadge()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  showMainWindow()
})

app.on('before-quit', () => {
  setIsQuitting(true)
})

app.on('will-quit', () => {
  unregisterGlobalShortcuts()
})

app.on('quit', () => {
  closeCache()
})
