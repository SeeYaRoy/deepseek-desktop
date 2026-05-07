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
    const currentTitle = document.title
    const chatArea = document.querySelector('main') || document.body
    const currentText = chatArea.textContent || ''

    const textGrew = currentText.length > lastText.length + 10
    const titleChanged = currentTitle !== pageTitle && pageTitle !== ''

    if ((textGrew || titleChanged) && lastText.length > 0) {
      if (notificationTimer) clearTimeout(notificationTimer)
      notificationTimer = setTimeout(() => {
        window.electronAPI?.notify('DeepSeek', 'new-reply')
      }, 1200)
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
