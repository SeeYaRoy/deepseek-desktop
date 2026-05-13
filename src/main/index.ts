import { app } from 'electron'
import { BUNDLE_ID } from './constants'
import { createMainWindow, showMainWindow, setIsQuitting } from './window'
import { createTray } from './tray'
import { registerGlobalShortcuts, unregisterGlobalShortcuts } from './shortcuts'
import { setupNotifications, clearBadge } from './notifications'
import { closeCache } from './cache'

if (process.platform === 'win32') {
  app.setAppUserModelId(BUNDLE_ID)
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
