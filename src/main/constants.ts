export const APP_NAME = 'DeepSeek Desktop'
export const BUNDLE_ID = 'site.roychen.deepseek-desktop'
export const CHAT_URL = 'https://chat.deepseek.com'

export const DEFAULT_WINDOW_WIDTH = 1200
export const DEFAULT_WINDOW_HEIGHT = 800
export const MIN_WINDOW_WIDTH = 800
export const MIN_WINDOW_HEIGHT = 600

export const SHORTCUTS = {
  TOGGLE_WINDOW: 'CommandOrControl+Shift+D',
  NEW_CONVERSATION: 'CommandOrControl+Shift+N',
  DELETE_CONVERSATION: 'CommandOrControl+Shift+Delete'
} as const

export const BACKUP_SHORTCUTS = {
  NEW_CONVERSATION: 'CommandOrControl+Shift+T'
} as const

export type ShortcutAction = keyof typeof SHORTCUTS
