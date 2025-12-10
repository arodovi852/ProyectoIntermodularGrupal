/**
 * Componente Hero - Sección Principal de Landing Page.
 *
 * Sección prominente que ocupa todo el viewport en la landing page.
 * Es la primera impresión visual del usuario.
 *
 * Composición:
 * - **HeroBackground**: Fondo animado/visual (vídeo, gradiente, etc.)
 * - **HeroContent**: Contenido textual (heading, descripción, CTA)
 * - **Footer**: Pie de página integrado en el hero
 *
 * Características:
 * - Full viewport height (100vh)
 * - Background layer visual
 * - Content layer encima del background
 * - Diseño responsive
 * - Llamada a la acción (CTA) prominent
 *
 * Ubicación:
 * - Renderizado en ruta "/" (landing page)
 * - Dentro de LayoutRoot (que tiene Header arriba)
 * - Es el componente principal de Landing.jsx
 *
 * @module frontend/components/Hero
 * @component
 * @requires ../molecules/HeroBackground
 * @requires ../molecules/HeroContent
 * @requires ../Footer/Footer
 * @returns {React.ReactElement} Sección hero con fondo, contenido y footer
 *
 * @example
 * // En Landing.jsx
 * <Hero />
 */

import { HeroBackground } from '../molecules/HeroBackground'
import { HeroContent } from '../molecules/HeroContent'
import styles from '../../styles/Hero.module.css'
import {Footer} from "../Footer/Footer.jsx";

/**
 * Componente Hero Principal.
 *
 * Renderiza la sección hero con todos sus componentes.
 * Estructura: Background + ContentWrapper(Content + Footer)
 *
 * @component
 * @returns {React.ReactElement} Sección hero completa
 */
export const Hero = () => {
    return (
        <section className={styles.hero}>
            <HeroBackground />
            <div className={styles.contentWrapper}>
                <HeroContent />
                <Footer />
            </div>
        </section>
    )
}