import Store from 'electron-store'
import { SHORTCUTS } from './constants'

interface AppStore {
  windowBounds: { width: number; height: number; x?: number; y?: number }
  shortcuts: { toggle: string; newConversation: string; deleteConversation: string }
}

const store = new Store<AppStore>({
  defaults: {
    windowBounds: { width: 1200, height: 800 },
    shortcuts: {
      toggle: SHORTCUTS.TOGGLE_WINDOW,
      newConversation: SHORTCUTS.NEW_CONVERSATION,
      deleteConversation: SHORTCUTS.DELETE_CONVERSATION
    }
  }
})

export default store
