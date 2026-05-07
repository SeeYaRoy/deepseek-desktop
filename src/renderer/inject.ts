interface ElectronAPI {
  notify: (title: string, body: string) => void
  onShortcut: (callback: (action: string) => void) => () => void
}

declare const window: Window & {
  electronAPI?: ElectronAPI
}

function initMessageObserver(): void {
  if (!window.electronAPI) return

  let lastText = ''
  let notificationTimer: ReturnType<typeof setTimeout> | null = null
  let pageTitle = document.title

  const notifyIfNewMessage = (): void => {
    // Detect new messages by watching title changes or DOM content growth
    const currentTitle = document.title
    const hasNewIndicator = document.title.includes('(') || document.title !== pageTitle

    // Also check if new content appeared in the chat area
    const chatArea = document.querySelector('main') || document.body
    const currentText = chatArea.textContent || ''

    const textChanged = currentText.length > lastText.length + 20
    const titleChanged = currentTitle !== pageTitle

    if ((textChanged || titleChanged) && lastText.length > 0) {
      if (notificationTimer) clearTimeout(notificationTimer)
      notificationTimer = setTimeout(() => {
        // Only notify if window is not focused
        if (!document.hasFocus()) {
          const lastLine = currentText.slice(-100).trim()
          window.electronAPI?.notify('DeepSeek', lastLine || 'New message')
        }
      }, 1500)
    }

    lastText = currentText
    pageTitle = currentTitle
  }

  const observer = new MutationObserver(() => {
    notifyIfNewMessage()
  })

  const chatContainer = document.querySelector('main') || document.body
  observer.observe(chatContainer, { childList: true, subtree: true, characterData: true })

  setInterval(notifyIfNewMessage, 2000)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMessageObserver)
} else {
  initMessageObserver()
}
