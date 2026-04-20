import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useApp } from './context/AppContext'
import { LayoutCompact } from './components/layouts/LayoutCompact'
import { LayoutCalendar } from './components/layouts/LayoutCalendar'
import { LayoutFocus } from './components/layouts/LayoutFocus'
import { TweaksPanel } from './components/TweaksPanel'

function AppContent() {
  const { settings, loading } = useApp()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Resize window to match content height
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        window.api.window.resize(containerRef.current.offsetHeight)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Listen for "show-settings" from tray right-click
  useEffect(() => {
    return window.api.window.onShowSettings(() => setSettingsOpen(true))
  }, [])

  // Reset settings panel when popup is hidden
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) setSettingsOpen(false) }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (loading) {
    return (
      <div ref={containerRef} style={{ padding: '0 0 8px' }}>
        <div style={{
          background: 'white', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          padding: 20, textAlign: 'center', color: 'oklch(0.6 0.01 250)', fontSize: 12,
        }}>
          Carregando...
        </div>
      </div>
    )
  }

  const layouts = {
    compact: LayoutCompact,
    calendar: LayoutCalendar,
    focus: LayoutFocus,
  }
  const Layout = layouts[settings.layout] || LayoutCompact

  return (
    <div ref={containerRef} style={{ padding: '0 0 8px' }}>
      <div style={{
        width: 330,
        background: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        {settingsOpen
          ? <TweaksPanel onClose={() => setSettingsOpen(false)} />
          : <Layout />
        }
      </div>
    </div>
  )
}

export function App() {
  return <AppContent />
}
