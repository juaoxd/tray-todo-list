import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext'
import { App } from './App'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-mono/300.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './styles/global.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <AppProvider>
    <App />
  </AppProvider>
)
