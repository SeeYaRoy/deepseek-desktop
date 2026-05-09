import { BrowserWindow, app } from 'electron'
import { join } from 'path'
import * as fs from 'fs'
import store from './store'
import {
  APP_NAME,
  CHAT_URL,
  DEFAULT_WINDOW_WIDTH,
  DEFAULT_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT
} from './constants'

let mainWindow: BrowserWindow | null = null
let isQuitting = false

export function setIsQuitting(value: boolean): void {
  isQuitting = value
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function createMainWindow(): BrowserWindow {
  const bounds = store.get('windowBounds')
  mainWindow = new BrowserWindow({
    title: APP_NAME,
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(app.getAppPath(), 'build/preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  // Mask as regular Chrome to avoid "unusual device" warnings from DeepSeek
  const originalUA = mainWindow.webContents.getUserAgent()
  mainWindow.webContents.setUserAgent(originalUA.replace(/Electron\/[\d.]+ /, ''))

  mainWindow.loadURL(CHAT_URL)

  mainWindow.webContents.on('dom-ready', () => {
    const injectPath = join(app.getAppPath(), 'build/renderer/inject.js')
    if (fs.existsSync(injectPath)) {
      const script = fs.readFileSync(injectPath, 'utf-8')
      mainWindow?.webContents.executeJavaScript(script).catch(() => {})
    }
  })

  const saveBounds = () => {
    const b = mainWindow?.getBounds()
    if (b) {
      store.set('windowBounds', { width: b.width, height: b.height, x: b.x, y: b.y })
    }
  }
  mainWindow.on('resize', saveBounds)
  mainWindow.on('move', saveBounds)

  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin' && !isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  return mainWindow
}

export function showMainWindow(): void {
  const win = getMainWindow()
  if (win) {
    if (win.isMinimized()) win.restore()
    win.show()
    win.focus()
  } else {
    createMainWindow()
  }
}

export function toggleMainWindow(): void {
  const win = getMainWindow()
  if (!win) {
    createMainWindow()
    return
  }
  if (win.isVisible() && win.isFocused()) {
    win.hide()
  } else {
    showMainWindow()
  }
}
