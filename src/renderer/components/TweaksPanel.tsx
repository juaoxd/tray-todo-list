import { useApp } from '../context/AppContext'
import { Settings } from '../lib/types'

const ACCENTS = ['#5B7CF6', '#E05D5D', '#2DAE74', '#E07A2A', '#9B5CE5', '#D4954A']

export function TweaksPanel() {
  const { settings, updateSettings } = useApp()

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    updateSettings({ [key]: value })
  }

  return (
    <div style={{
      background: 'white',
      borderTop: '1px solid oklch(0.92 0.01 250)',
      padding: '12px 14px',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13,
    }}>
      <h3 style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'oklch(0.55 0.01 250)',
        marginBottom: 12,
      }}>
        Tweaks
      </h3>

      {/* Layout */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontSize: 11, color: 'oklch(0.45 0.01 250)', marginBottom: 4, fontWeight: 500 }}>
          Layout
        </label>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(['compact', 'calendar', 'focus'] as const).map(v => (
            <button
              key={v}
              onClick={() => set('layout', v)}
              style={{
                padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                border: '1px solid',
                borderColor: settings.layout === v ? settings.accent : 'oklch(0.88 0.01 250)',
                cursor: 'pointer',
                background: settings.layout === v ? settings.accent : 'white',
                color: settings.layout === v ? 'white' : 'oklch(0.45 0.01 250)',
                transition: 'all 0.15s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontSize: 11, color: 'oklch(0.45 0.01 250)', marginBottom: 4, fontWeight: 500 }}>
          Cor de destaque
        </label>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {ACCENTS.map(c => (
            <div
              key={c}
              onClick={() => set('accent', c)}
              style={{
                width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer',
                outline: settings.accent === c ? `2px solid ${c}` : 'none',
                outlineOffset: 2, transition: 'outline 0.12s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick note toggle */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontSize: 11, color: 'oklch(0.45 0.01 250)', marginBottom: 4, fontWeight: 500 }}>
          Nota rápida
        </label>
        <div style={{ display: 'flex', gap: 4 }}>
          {([true, false] as const).map(v => (
            <button
              key={String(v)}
              onClick={() => set('showQuickNote', v)}
              style={{
                padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                border: '1px solid',
                borderColor: settings.showQuickNote === v ? settings.accent : 'oklch(0.88 0.01 250)',
                cursor: 'pointer',
                background: settings.showQuickNote === v ? settings.accent : 'white',
                color: settings.showQuickNote === v ? 'white' : 'oklch(0.45 0.01 250)',
                transition: 'all 0.15s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {v ? 'Visível' : 'Oculta'}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div>
        <label style={{ display: 'block', fontSize: 11, color: 'oklch(0.45 0.01 250)', marginBottom: 4, fontWeight: 500 }}>
          Tamanho do texto — {settings.fontSize}px
        </label>
        <input
          type="range"
          min={11}
          max={15}
          step={0.5}
          value={settings.fontSize}
          onChange={e => set('fontSize', parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}
