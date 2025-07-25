import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './AppContext/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/malla-reddy-university/'>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>,
)
