import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
import WebApp from './WebApp.tsx'

const isExtension = window.location.protocol === "chrome-extension:";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      {isExtension ? <App /> : <WebApp />}
    </HashRouter>
  </StrictMode>,
)