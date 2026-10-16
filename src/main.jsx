import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './AyushPortfolio'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered (see scripts/prerender.mjs) — hydrate it; dev starts empty
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
