/**
 * Componente Raíz de la Aplicación.
 *
 * App es el componente principal que proporciona la estructura fundamental
 * de toda la aplicación. Envuelve la app en dos proveedores críticos:
 *
 * 1. **AuthProvider**: Proporciona estado de autenticación global
 *    - Login, logout, registro
 *    - Datos del usuario autenticado
 *    - Token JWT
 *    - Disponible en toda la app mediante useAuth()
 *
 * 2. **RouterProvider**: Proporciona sistema de ruteo
 *    - Define todas las rutas de la aplicación
 *    - Protege rutas privadas
 *    - Maneja navegación
 *    - Carga componentes de página según ruta
 *
 * 3. **ConnectionStatus**: Indicador visual de conexión
 *    - Muestra si está conectado al backend
 *    - Disponible en toda la app
 *    - Se actualiza en tiempo real
 *
 * Arquitectura:
 * ```
 * App (raíz)
 *   ├── AuthProvider (estado global)
 *   │   └── RouterProvider (sistema de rutas)
 *   │       └── Rutas (páginas, layouts)
 *   │           ├── LayoutRoot (rutas públicas)
 *   │           └── PrivateLayoutRoot (rutas protegidas)
 *   └── ConnectionStatus (indicador global)
 * ```
 *
 * Estilos:
 * - Importa App.css para estilos de la aplicación
 * - Estilos globales en index.css
 *
 * @module frontend/App
 * @component
 * @returns {React.ReactElement} Estructura raíz de la aplicación
 *
 * @example
 * // En main.jsx
 * <StrictMode>
 *   <App />
 * </StrictMode>
 */

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { RouterProvider } from "react-router";
import router from "./router/Router.jsx";
import ConnectionStatus from "./components/ConnectionStatus/ConnectionStatus.jsx";
import './styles/App.css'

/**
 * Función componente App.
 *
 * Renderiza la estructura completa de la aplicación con todos los proveedores
 * necesarios. Proporciona:
 * - Autenticación global (AuthContext)
 * - Sistema de ruteo (Router)
 * - Indicador de estado de conexión
 *
 * @returns {React.ReactElement} JSX con AuthProvider, RouterProvider y ConnectionStatus
 */
function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <ConnectionStatus />
        </AuthProvider>
    );
}

export default App
