import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { TerminalProvider } from './context/TerminalContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <TerminalProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </TerminalProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
