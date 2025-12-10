/**
 * Componente Footer - Pie de Página.
 *
 * Sección de pie de página que aparece en casi todas las páginas.
 * Contiene:
 * - Enlaces de navegación secundaria
 * - Iconos de redes sociales
 * - Información legal (Terms, Privacy)
 * - Documentación (API, Roadmap)
 *
 * Características:
 * - Grid responsive de enlaces
 * - Iconos de redes sociales interactivos
 * - Separador visual entre secciones
 * - Enlaces internos (React Router)
 * - Enlaces externos a redes sociales
 *
 * Enlaces incluidos:
 * - About: /About
 * - Contact: /Contact
 * - News: /News
 * - Terms: /Terms
 * - Privacy: /Privacy
 * - API: /API
 * - Roadmap: /Roadmap
 *
 * Redes Sociales:
 * - GitHub
 * - Twitter
 * - Facebook
 * - Instagram
 *
 * Ubicación:
 * - Renderizado en Hero.jsx (integrado)
 * - Renderizado en LayoutRoot.jsx (en rutas normales)
 * - Aparece al final de cada página
 *
 * @module frontend/components/Footer
 * @component
 * @requires ../atoms/Link
 * @requires ../atoms/SocialIcon
 * @returns {React.ReactElement} Pie de página con enlaces y redes sociales
 *
 * @example
 * // En LayoutRoot.jsx
 * <Footer />
 *
 * // O dentro de Hero
 * <Hero /> // que incluye Footer internamente
 */

import { Link } from '../atoms/Link'
import { SocialIcon } from '../atoms/SocialIcon'
import styles from '../../styles/Footer.module.css'
import {NavLink} from "react-router-dom";

/**
 * Componente Footer Principal.
 *
 * Renderiza el pie de página con navegación y redes sociales.
 *
 * Estructura:
 * - Array de links de navegación
 * - Array de redes sociales
 * - Mapeo a componentes NavLink y SocialIcon
 * - Separador especial "/" entre secciones
 *
 * @component
 * @returns {React.ReactElement} Footer con navegación y redes sociales
 */
export const Footer = () => {
    const links = [
        { text: 'About', href: '/About' },
        { text: 'Contact', href: '/Contact' },
        { text: 'News', href: '/News' },
        { text: 'Terms', href: '/Terms' },
        { text: 'Privacy', href: '/Privacy' },
        { text: 'API', href: '/API' },
        { text: 'Roadmap', href: '/Roadmap' },
        { text: '/', href: '#', isSpecial: true }
    ]

    const socials = [
        { type: 'github', href: '#github' },
        { type: 'twitter', href: '#twitter' },
        { type: 'facebook', href: '#facebook' },
        { type: 'instagram', href: '#instagram' }
    ]

    return (
        <footer className={styles.footer}>
            <nav className={styles.nav}>
                {/* Enlaces de navegación */}
                {links.map((link, index) => (
                    link.isSpecial ? (
                        <span key={`link-${index}`} className={styles.separator}>
                            {link.text}
                        </span>
                    ) : (
                        <NavLink key={`link-${index}`} to={link.href} className={styles.links}>
                            {link.text}
                        </NavLink>
                    )
                ))}
                {/* Iconos sociales */}
                {socials.map((social, index) => (
                    <SocialIcon key={`social-${index}`} type={social.type} href={social.href} />
                ))}
            </nav>
        </footer>
    )
}

