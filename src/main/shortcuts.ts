import { globalShortcut } from 'electron'
import { SHORTCUTS } from './constants'
import { toggleMainWindow } from './window'

export function registerGlobalShortcuts(): void {
  const ok = globalShortcut.register(SHORTCUTS.TOGGLE_WINDOW, () => {
    toggleMainWindow()
  })
  console.log('[Shortcuts] Toggle window:', ok ? 'OK' : 'FAILED')
}

export function unregisterGlobalShortcuts(): void {
  globalShortcut.unregisterAll()
}
