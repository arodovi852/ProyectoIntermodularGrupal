import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App.jsx";

if (import.meta.env.DEV) {
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