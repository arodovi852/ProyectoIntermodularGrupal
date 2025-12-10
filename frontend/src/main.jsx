/**
 * Punto de Entrada Principal de la Aplicación Frontend.
 *
 * Este archivo es el punto de entrada de la aplicación React.
 * Se encarga de:
 * - Importar estilos globales
 * - Configurar Mock Service Worker (MSW) en desarrollo
 * - Renderizar el componente raíz (App) en el DOM
 * - Envolver la app en StrictMode para detección de bugs
 *
 * Flujo de Inicialización:
 * 1. Si está en modo DEV (desarrollo):
 *    - Importa browser.jsx (registro de MSW)
 *    - Inicia el Service Worker para interceptar requests
 *    - Maneja errores si MSW no se puede iniciar
 * 2. Crea el root de React en el elemento #root del HTML
 * 3. Renderiza el componente App en StrictMode
 * 4. React toma control del DOM
 *
 * Variables de Entorno:
 * - VITE_API_URL: URL del backend (configurada en .env)
 * - NODE_ENV: Ambiente (development/production)
 *
 * @module frontend/main
 * @requires react
 * @requires ./mocks/browser (solo en desarrollo)
 * @requires ./App.jsx
 * @requires ./index.css
 * @see {@link module:frontend/App}
 * @see {@link module:frontend/mocks/browser}
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App.jsx";

/**
 * Inicialización de Mock Service Worker (MSW) en Desarrollo.
 *
 * Solo se ejecuta en modo DEV (import.meta.env.DEV es true en desarrollo).
 *
 * Proceso:
 * 1. Importa dinámicamente browser.jsx (setup de MSW)
 * 2. Accede al worker exportado desde browser.jsx
 * 3. Llama a worker.start() para activar la interceptación de requests
 * 4. Si hay error, lo registra en console.warn (no detiene la app)
 *
 * MSW Activo Significa:
 * - Todas las requests HTTP son interceptadas por el Service Worker
 * - Los handlers definidos en handlers.jsx proporcionan respuestas mockeadas
 * - Requests no capturadas pasan al servidor real (passthrough)
 *
 * En Producción:
 * - MSW no se carga (está comentado en ternario de DEV)
 * - Las requests van directamente al backend real
 *
 * @see {@link module:frontend/mocks/browser}
 * @see {@link module:frontend/mocks/handlers}
 */
/*
if (import.meta.env.DEV) {
    import('./mocks/browser.jsx').then(({ worker }) => {
        worker.start();
    }).catch(err => {
        console.warn('No se pudo iniciar MSW', err);
    });
}
*/

/**
 * Renderización del Componente Raíz.
 *
 * Crea el React root y renderiza el componente App dentro de:
 * - **StrictMode**: Detecta efectos secundarios accidentales y componentes no puros
 *                   (extra checks en desarrollo, sin impacto en producción)
 * - **#root**: El elemento div del index.html donde se monta React
 *
 * El componente App contiene:
 * - Router: Todas las rutas de la aplicación
 * - AuthContext: Proveedor de estado de autenticación
 * - Layouts: Estructura visual de la app
 *
 * @type {React.Root}
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)