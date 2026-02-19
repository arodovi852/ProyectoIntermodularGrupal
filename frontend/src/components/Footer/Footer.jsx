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
        { text: 'Privacidad', href: '/legal/privacidad' },
        { text: 'Cookies', href: '/legal/cookies' },
        { text: 'Términos', href: '/legal/terminos' },
        { text: 'Accesibilidad', href: '/legal/accesibilidad' },
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
        <footer className={styles.footer} role="contentinfo">
            <nav className={styles.nav} aria-label="Enlaces del pie de página">
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
                {/* Botón para reabrir banner de cookies */}
                <button
                    onClick={() => {
                        localStorage.removeItem('cookieConsent');
                        window.location.reload();
                    }}
                    className={styles.links}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        font: 'inherit',
                        color: 'inherit',
                        textDecoration: 'underline',
                        fontSize: 'inherit'
                    }}
                    aria-label="Configurar preferencias de cookies"
                >
                    Configurar cookies
                </button>
                {/* Iconos sociales */}
                {socials.map((social, index) => (
                    <SocialIcon key={`social-${index}`} type={social.type} href={social.href} />
                ))}
            </nav>
            <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.5rem', textAlign: 'center' }}>
                © 2026 PlayTheMood. Todos los derechos reservados. Contenido musical proporcionado por Spotify®.
            </p>
        </footer>
    )
}

