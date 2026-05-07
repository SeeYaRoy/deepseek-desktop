import { Notification, app, ipcMain } from 'electron'
import { APP_NAME } from './constants'
import { showMainWindow, getMainWindow } from './window'

let badgeCount = 0

function getLocale(): string {
  return app.getLocale()
}

function t(key: string): string {
  const locale = getLocale()
  const isChinese = locale.startsWith('zh')

  const messages: Record<string, Record<string, string>> = {
    replyReceived: {
      zh: '你收到了 DeepSeek 的回复',
      en: 'You received a reply from DeepSeek'
    }
  }

  const msg = messages[key]
  if (!msg) return key
  return isChinese ? msg.zh : msg.en
}

export function setupNotifications(): void {
  ipcMain.on('notify', (_event, { title }: { title: string; body: string }) => {
    const win = getMainWindow()
    const isFocused = win?.isFocused() ?? false
    const isVisible = win?.isVisible() ?? false

    // Only show notification if window is not focused/visible
    if (isFocused && isVisible) {
      return
    }

    if (Notification.isSupported()) {
      const notification = new Notification({
        title: title || APP_NAME,
        body: t('replyReceived')
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
