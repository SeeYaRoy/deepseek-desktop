import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  platform: string
  onNewMessage: (callback: (data: { title: string; body: string }) => void) => () => void
  onShortcut: (callback: (action: string) => void) => () => void
  notify: (title: string, body: string) => void
}

const api: ElectronAPI = {
  platform: process.platform,

  onNewMessage: (callback) => {
    const handler = (_: unknown, data: { title: string; body: string }) => callback(data)
    ipcRenderer.on('new-message', handler)
    return () => ipcRenderer.removeListener('new-message', handler)
  },

  onShortcut: (callback) => {
    const handler = (_: unknown, action: string) => callback(action)
    ipcRenderer.on('shortcut', handler)
    return () => ipcRenderer.removeListener('shortcut', handler)
  },

  notify: (title, body) => {
    ipcRenderer.send('notify', { title, body })
  }
}

contextBridge.exposeInMainWorld('electronAPI', api)
