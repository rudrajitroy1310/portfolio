import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initTabletScale } from './utils/tabletScale.js'

// Render se pehle set karte hain taaki tablet pe pehle frame se sahi scale mile.
initTabletScale()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)