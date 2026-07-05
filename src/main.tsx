import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './store/StoreContext'
import { SessionProvider } from './context/SessionContext'
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <StoreProvider>
          <SessionProvider>
            <App />
          </SessionProvider>
        </StoreProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
