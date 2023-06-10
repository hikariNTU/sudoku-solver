import { BellIcon } from '@radix-ui/react-icons'
import { useRegisterSW } from 'virtual:pwa-register/react'

import './reload-prompt.css'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) {
    return null
  }

  return (
    <div role="dialog" className="ReloadPrompt-container">
      <div className="ReloadPrompt-toast">
        <div className="ReloadPrompt-icon">
          <BellIcon width={24} height={24} />
        </div>
        <p className="ReloadPrompt-message">
          {offlineReady ? (
            <span>App ready to work offline</span>
          ) : (
            <span>New content available, click on reload button to update.</span>
          )}
        </p>
        <div className="ReloadPrompt-toast-actions">
          {needRefresh && <button onClick={() => updateServiceWorker(true)}>Reload</button>}
          <button onClick={() => close()}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default ReloadPrompt
