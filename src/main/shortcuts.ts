import { globalShortcut } from 'electron'
import { SHORTCUTS, BACKUP_SHORTCUTS } from './constants'
import { toggleMainWindow, showMainWindow, getMainWindow } from './window'

function tryRegister(accelerator: string, callback: () => void): boolean {
  const ok = globalShortcut.register(accelerator, callback)
  if (!ok) {
    console.warn(`[Shortcuts] Failed to register: ${accelerator}`)
  }
  return ok
}

export function registerGlobalShortcuts(): void {
  const toggleOk = tryRegister(SHORTCUTS.TOGGLE_WINDOW, () => {
    toggleMainWindow()
  })

  let newOk = tryRegister(SHORTCUTS.NEW_CONVERSATION, () => {
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
  })

  if (!newOk) {
    newOk = tryRegister(BACKUP_SHORTCUTS.NEW_CONVERSATION, () => {
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
    })
  }

  const delOk = tryRegister(SHORTCUTS.DELETE_CONVERSATION, () => {
    const win = getMainWindow()
    if (win) {
      win.webContents.executeJavaScript(`
        const btn = document.querySelector('[data-testid="delete-conversation-button"]') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Delete'));
        btn?.click();
      `).catch(() => {})
    }
    showMainWindow()
  })

  console.log('[Shortcuts] Registered:', { toggle: toggleOk, newConversation: newOk, deleteConversation: delOk })
}

export function unregisterGlobalShortcuts(): void {
  globalShortcut.unregisterAll()
}
