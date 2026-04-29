import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import { App } from './App'
import { AuthProvider } from './context/AuthContext'
import { BuildProvider } from './features/build'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BuildProvider>
          <App />
        </BuildProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
