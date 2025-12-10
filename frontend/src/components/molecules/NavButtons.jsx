/**
 * Componente NavButtons - Botones de Navegación Dinámicos.
 *
 * Molécula que renderiza los botones de navegación principales,
 * cambiando según el estado de autenticación.
 *
 * Características:
 * - **Autenticado**: Profile, Playlist, Configuration, Logout
 * - **No autenticado**: Login, Register
 * - Menú responsive (abierto/cerrado)
 * - Cierra menú al navegar
 * - Logout redirige a home
 * - Usa useAuth() para obtener estado de autenticación
 *
 * Botones por estado:
 *
 * **No autenticado**:
 * - Login (variant="primary")
 * - Register (variant="secondary")
 *
 * **Autenticado**:
 * - Profile (variant="secondary")
 * - Playlist (variant="secondary")
 * - Configuration (variant="secondary")
 * - Logout (variant="secondary")
 *
 * Props:
 * - **isOpen**: boolean indicando si menú está abierto (para mobile)
 * - **onClose**: callback para cerrar menú al navegar
 *
 * Ubicación:
 * - Renderizado dentro de Header.jsx
 * - Controlado por estado isMenuOpen del Header
 *
 * @module frontend/components/molecules/NavButtons
 * @component
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Si menú está abierto
 * @param {Function} [props.onClose] - Callback para cerrar menú
 * @requires ../atoms/Button
 * @requires ../../hooks/UseAuth
 * @returns {React.ReactElement} Nav con botones dinámicos según autenticación
 */

import { Button } from '../atoms/Button'
import {NavLink, useNavigate} from "react-router-dom";
import {UseAuth} from "../../hooks/UseAuth.jsx";
import styles from "../../styles/NavButtons.module.css"

/**
 * Componente NavButtons Principal.
 *
 * Renderiza botones de navegación diferentes según autenticación.
 *
 * @component
 * @returns {React.ReactElement} Nav con botones dinámicos
 */
export const NavButtons = ({ isOpen = false, onClose = () => {} }) => {
    const { isAuthenticated, logout } = UseAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        onClose();
    };

    const handleNavClick = () => {
        onClose();
    };

    return (
        <nav id="mainNavbar" className={`${styles.navButtons} ${isOpen ? styles.open : ''}`}>
            <ul>
                {isAuthenticated ? (
                    <>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/profile" className={styles.links}>Profile</NavLink></Button>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/playlist" className={styles.links}>Playlist</NavLink></Button>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/configuration" className={styles.links}>Configuration</NavLink></Button>
                        <Button onClick={handleLogout} variant="secondary" className={styles.links}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button variant="primary" onClick={handleNavClick}><NavLink to="/login" className={styles.links}>Login</NavLink></Button>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/register" className={styles.links}>Register</NavLink></Button>
                    </>
                )}
            </ul>
        </nav>
    )
}
