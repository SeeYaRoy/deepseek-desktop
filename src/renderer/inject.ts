interface ElectronAPI {
  notify: (title: string, body: string) => void
  onShortcut: (callback: (action: string) => void) => () => void
}

declare const window: Window & {
  electronAPI?: ElectronAPI
}

function initMessageObserver(): void {
  if (!window.electronAPI) return

  window.electronAPI.onShortcut((action) => {
    if (action === 'NEW_CONVERSATION') {
      const btn =
        document.querySelector('[data-testid="new-conversation-button"]') ||
        document.querySelector('button[title*="New"]') ||
        Array.from(document.querySelectorAll('button')).find((b) =>
          b.textContent?.includes('New Chat')
        )
      ;(btn as HTMLElement)?.click()
    }
  })

  let lastMessageCount = 0
  let notificationTimer: ReturnType<typeof setTimeout> | null = null

  const checkNewMessages = (): void => {
    const messages = document.querySelectorAll('[data-testid="chat-message"], .ds-message, .message-item')
    const currentCount = messages.length

    if (currentCount > lastMessageCount && lastMessageCount > 0) {
      if (notificationTimer) clearTimeout(notificationTimer)
      notificationTimer = setTimeout(() => {
        const lastMsg = messages[messages.length - 1]
        const text = lastMsg?.textContent?.slice(0, 100) || 'New message'
        window.electronAPI?.notify('DeepSeek', text)
      }, 2000)
    }

    lastMessageCount = currentCount
  }

  const observer = new MutationObserver(() => {
    checkNewMessages()
  })

  const chatContainer = document.querySelector('main') || document.body
  observer.observe(chatContainer, { childList: true, subtree: true })

  setInterval(checkNewMessages, 3000)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMessageObserver)
} else {
  initMessageObserver()
}
