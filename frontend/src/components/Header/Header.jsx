/**
 * Componente Header - Navegación Superior.
 *
 * Barra de navegación principal que aparece en todas las páginas.
 * Proporciona:
 * - Logo/Marca
 * - Menú de navegación (responsive)
 * - Botón hamburguesa (mobile)
 * - Botones de acción (Login, Register, etc.)
 *
 * Características:
 * - Menú mobile con hamburger button
 * - Menú desktop expandido
 * - Toggle entre estados abierto/cerrado
 * - Cierra menú al navegar
 * - Responsive design
 *
 * Componentes incluidos:
 * - **Logo**: Marca de la aplicación
 * - **HamburgerButton**: Botón para mobile (solo visible en <768px)
 * - **NavButtons**: Botones de navegación principales
 *
 * Estado:
 * - **isMenuOpen**: boolean indicando si menú está abierto
 *
 * Ubicación:
 * - Renderizado en todos los layouts (LayoutRoot, PrivateLayoutRoot)
 * - Siempre al inicio de la página
 * - Fixed o sticky según diseño CSS
 *
 * @module frontend/components/Header
 * @component
 * @requires ../atoms/Logo
 * @requires ../atoms/HamburgerButton
 * @requires ../molecules/NavButtons
 * @returns {React.ReactElement} Barra de navegación completa
 *
 * @example
 * // En LayoutRoot.jsx
 * <Header />
 */

import { useState } from 'react'
import { Logo } from '../atoms/Logo'
import { NavButtons } from '../molecules/NavButtons'
import { HamburgerButton } from '../atoms/HamburgerButton'
import styles from '../../styles/Header.module.css'

/**
 * Componente Header Principal.
 *
 * Renderiza la barra de navegación con logo, hamburger button y nav buttons.
 *
 * Estado:
 * - **isMenuOpen**: Controla si el menú mobile está abierto
 *
 * Métodos:
 * - **toggleMenu**: Abre/cierra el menú
 *
 * @component
 * @returns {React.ReactElement} Header con navegación
 */
export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            <Logo />
            <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
            <NavButtons isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    )
}