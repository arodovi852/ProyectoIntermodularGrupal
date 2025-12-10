/**
 * Componente HeroContent - Contenido Principal del Hero.
 *
 * Molécula que renderiza el contenido textual principal de la landing page:
 * - Título/marca "playthemood"
 * - Descripción/tagline
 * - Call-to-action (CTA) button
 *
 * Características:
 * - Navegación a página de generación al hacer clic
 * - Estilos con highlight en parte de la descripción
 * - CTA button prominente con estilos especiales
 *
 * Textos:
 * - Título: "playthemood"
 * - Descripción: "Turn your emotions into music: your playlist, made just for you for this moment."
 * - CTA: "Crea tu playlist."
 *
 * Ubicación:
 * - Renderizado dentro de Hero.jsx
 * - Renderizado dentro de HeroBackground
 * - Solo en landing page (ruta "/")
 *
 * @module frontend/components/molecules/HeroContent
 * @component
 * @requires ../atoms/Button
 * @requires react-router (useNavigate)
 * @returns {React.ReactElement} Div con título, descripción y CTA
 */

import { useNavigate } from 'react-router'
import { Button } from '../atoms/Button'
import styles from '../../styles/HeroContent.module.css'

/**
 * Componente HeroContent Principal.
 *
 * Renderiza el contenido del hero con navegación.
 *
 * @component
 * @returns {React.ReactElement} Contenido del hero
 */
export const HeroContent = () => {
    const navigate = useNavigate()

    return (
        <div className={styles.heroContent}>
            <h1 className={styles.title}>
                playthemood
            </h1>

            <p className={styles.description}>
                Turn your emotions into music: your playlist, made
                <span className={styles.highlight}> just for you</span> for this moment.
            </p>

            <div className={styles.ctaContainer}>
                <Button
                    variant="cta"
                    onClick={() => navigate('/generate')}
                >
                    <span className={styles.ctaLight}>Crea tu </span>
                    <span className={styles.ctaBlack}>playlist.</span>
                </Button>
            </div>
        </div>
    )
}

