import { Notification, app, ipcMain } from 'electron'
import { APP_NAME } from './constants'
import { showMainWindow } from './window'

let badgeCount = 0

export function setupNotifications(): void {
  ipcMain.on('notify', (_event, { title, body }: { title: string; body: string }) => {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: title || APP_NAME,
        body,
        silent: false
      })
      notification.on('click', () => {
        showMainWindow()
      })
      notification.show()
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
