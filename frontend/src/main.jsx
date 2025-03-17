import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ServiceProvider } from './contexts/ServiceContext.jsx'
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ServiceProvider>
            <App />
        </ServiceProvider>
    </StrictMode>
)
