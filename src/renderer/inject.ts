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

    const textGrowth = currentText.length - lastText.length
    const titleChanged = currentTitle !== pageTitle && pageTitle !== ''

    // Only trigger on significant text growth (AI reply, not button clicks)
    const significantGrowth = textGrowth > 80

    if ((significantGrowth || titleChanged) && lastText.length > 0) {
      if (notificationTimer) clearTimeout(notificationTimer)
      notificationTimer = setTimeout(() => {
        // Double-check: must still have grown significantly after debounce
        const nowText = (document.querySelector('main') || document.body).textContent || ''
        if (nowText.length - lastText.length > 50) {
          window.electronAPI?.notify('DeepSeek', 'new-reply')
        }
      }, 5000)
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
