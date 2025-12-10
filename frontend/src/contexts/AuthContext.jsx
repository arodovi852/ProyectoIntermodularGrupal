/**
 * Contexto y Proveedor de Autenticación.
 *
 * AuthProvider proporciona estado de autenticación global a toda la aplicación.
 * Gestiona:
 * - Estado del usuario autenticado
 * - Token JWT almacenado en localStorage
 * - Métodos de login, registro y logout
 * - Estado de carga durante recuperación de sesión
 * - Persistencia de sesión entre recargas
 *
 * Flujo de Autenticación:
 * 1. **Inicialización**: Recupera token de localStorage si existe
 * 2. **Login**: Envía credenciales al backend, almacena token
 * 3. **Register**: Crea usuario nuevo, almacena token automáticamente
 * 4. **Logout**: Limpia token y estado del usuario
 * 5. **Persistencia**: Token se mantiene en localStorage
 *
 * Uso en componentes:
 * ```jsx
 * import { useAuth } from '../hooks/UseAuth.jsx';
 *
 * function MiComponente() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   return ...
 * }
 * ```
 *
 * @module frontend/contexts/AuthContext
 * @requires react
 * @see {@link module:frontend/hooks/UseAuth}
 */

import {useEffect, useState} from 'react';
import {AuthContext} from "../hooks/UseAuth.jsx";

/**
 * Proveedor de Autenticación.
 *
 * Componente que proporciona el contexto de autenticación a toda la app.
 * Maneja el ciclo de vida de la sesión del usuario.
 *
 * Estado Interno:
 * - **user**: Datos del usuario autenticado { id, name, email, token } o null
 * - **loading**: True mientras se recupera sesión de localStorage
 *
 * Valor del Contexto:
 * ```
 * {
 *   user: Object|null,          // Usuario autenticado o null
 *   isAuthenticated: boolean,   // True si user !== null
 *   login: Function,            // login(email, password) -> Promise<boolean>
 *   register: Function,         // register(name, email, password) -> Promise<boolean>
 *   logout: Function,           // logout() -> void
 *   loading: boolean            // True mientras se recupera sesión
 * }
 * ```
 *
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos que pueden usar el contexto
 * @returns {React.ReactElement} Proveedor de contexto con children adentro
 *
 * @example
 * <AuthProvider>
 *   <Router />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
    /**
     * Estado del usuario autenticado.
     * @type {[Object|null, Function]}
     */
    const [user, setUser] = useState(null);

    /**
     * Estado de carga durante recuperación de sesión.
     * Se usa para evitar flashes de contenido no autenticado.
     * @type {[boolean, Function]}
     */
    const [loading, setLoading] = useState(true);

    /**
     * Efecto: Recuperar sesión al montar el componente.
     *
     * Se ejecuta una sola vez al montar AuthProvider.
     * Intenta recuperar el token de localStorage para restaurar la sesión.
     * Útil para persistencia: usuario no necesita login en cada carga.
     *
     * Proceso:
     * 1. Lee token del localStorage
     * 2. Si existe, establece user con el token
     * 3. Marca loading como false (sesión recuperada)
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

            setUser({ token });
        }
        setLoading(false);
    }, []);

    /**
     * Login del usuario con email y contraseña.
     *
     * Envía credenciales al backend (/api/auth/login).
     * Si es exitoso, almacena token y datos del usuario.
     *
     * Proceso:
     * 1. Envía POST a /api/auth/login
     * 2. Recibe response con token y datos del usuario
     * 3. Almacena en localStorage
     * 4. Actualiza estado user
     * 5. Retorna true si exitoso, false si falló
     *
     * @async
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<boolean>} true si login exitoso, false si falló
     *
     * @example
     * const { login } = useAuth();
     * const success = await login('user@example.com', 'password123');
     */
    async function login(email, password) {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        return !!(await storeData(response));

    }

    /**
     * Registro de nuevo usuario.
     *
     * Envía datos de registro al backend (/api/auth/register).
     * Si es exitoso, automáticamente autentica al usuario (login).
     *
     * Proceso:
     * 1. Envía POST a /api/auth/register
     * 2. Backend crea el usuario y retorna token
     * 3. Almacena token y datos en localStorage
     * 4. Actualiza estado user
     * 5. Retorna true si exitoso
     *
     * @async
     * @param {string} name - Nombre completo del usuario
     * @param {string} email - Email del usuario (debe ser único)
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<boolean>} true si registro exitoso, false si falló
     *
     * @example
     * const { register } = useAuth();
     * const success = await register('Juan Pérez', 'juan@example.com', 'password123');
     */
    async function register(name, email, password) {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password})
        })
        await storeData(response)
        return !!(await storeData(response));

    }

    /**
     * Almacena datos de usuario y token en localStorage y estado.
     *
     * Función interna que procesa la respuesta del backend.
     * Valida que la respuesta sea exitosa y guarda los datos.
     *
     * Almacenamiento:
     * - localStorage.token: Token JWT (usado en requests)
     * - localStorage.id: ID del usuario
     * - Estado user: Datos completos del usuario + token
     *
     * Proceso:
     * 1. Valida status 200 o 201
     * 2. Parsea JSON de la respuesta
     * 3. Valida que response.success sea true
     * 4. Extrae token y datos del usuario
     * 5. Guarda en localStorage
     * 6. Actualiza estado user
     * 7. Retorna true si exitoso
     *
     * @async
     * @param {Response} response - Response del fetch
     * @returns {Promise<boolean>} true si datos almacenados, false si falló
     * @private
     */
    async function storeData(response) {
        if (response.status === 200 || response.status === 201) {
            const element = await response.json()
            console.log('=== DEBUG STOREDATA ===');
            console.log('Response completa:', element);
            console.log('Token a guardar:', element.data?.token);
            console.log('========================');

            if (element.success) {
                localStorage.setItem('id', element.data.user.id);
                localStorage.setItem('token', element.data.token);
                setUser({ token: element.data.token, ...element.data.user });
                return true;
            } else {
                return false
            }
        }
    }

    /**
     * Logout del usuario.
     *
     * Limpia el token de localStorage y limpia el estado user.
     * Usuario vuelve a estado no autenticado.
     *
     * Proceso:
     * 1. Elimina token de localStorage
     * 2. Limpia estado user
     * 3. Router redirige a login (ver PrivateLayoutRoot)
     *
     * @returns {void}
     *
     * @example
     * const { logout } = useAuth();
     * logout(); // Usuario desautenticado
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    /**
     * Indicador de autenticación.
     * True si user !== null, false si no hay usuario.
     * @type {boolean}
     */
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}