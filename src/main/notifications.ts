import { Notification, app, ipcMain, BrowserWindow } from 'electron'
import { APP_NAME } from './constants'
import { showMainWindow, getMainWindow } from './window'

let badgeCount = 0

export function setupNotifications(): void {
  ipcMain.on('notify', (_event, { title, body }: { title: string; body: string }) => {
    const win = getMainWindow()
    const isFocused = win?.isFocused() ?? false
    const isVisible = win?.isVisible() ?? false

    console.log('[Notification] Received:', title, '-', body, '| focused:', isFocused, 'visible:', isVisible)

    // Only show notification if window is not focused/visible
    if (isFocused && isVisible) {
      console.log('[Notification] Skipped: window is focused')
      return
    }

    if (Notification.isSupported()) {
      const notification = new Notification({
        title: title || APP_NAME,
        body,
        silent: true
      })
      notification.on('click', () => {
        showMainWindow()
      })
      notification.show()
      console.log('[Notification] Shown')
    } else {
      console.warn('[Notification] Not supported on this platform')
    }

    badgeCount++
    if (process.platform === 'darwin') {
      app.setBadgeCount(badgeCount)
    }
  })
}

export function clearBadge(): void {
  badgeCount = 0
  if (process.platform === 'darwin') {
    app.setBadgeCount(0)
  }
}
