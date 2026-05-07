import { globalShortcut } from 'electron'
import { SHORTCUTS } from './constants'
import { toggleMainWindow, showMainWindow, getMainWindow } from './window'

export function registerGlobalShortcuts(): void {
  const toggleOk = globalShortcut.register(SHORTCUTS.TOGGLE_WINDOW, () => {
    toggleMainWindow()
  })

  const newOk = globalShortcut.register(SHORTCUTS.NEW_CONVERSATION, () => {
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

  const delOk = globalShortcut.register(SHORTCUTS.DELETE_CONVERSATION, () => {
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
