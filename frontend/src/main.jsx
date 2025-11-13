import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App.jsx";

// Iniciar MSW en desarrollo para mockear la API
if (import.meta.env.DEV) {
    // Usar import dinámico para que Vite no incluya MSW en producción
    import('./mocks/browser.jsx').then(({ worker }) => {
        worker.start();
    }).catch(err => {
        console.warn('No se pudo iniciar MSW', err);
    });
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)