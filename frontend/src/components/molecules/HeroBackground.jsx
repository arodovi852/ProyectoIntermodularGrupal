/**
 * Componente HeroBackground - Fondo Animado del Hero.
 *
 * Molécula que renderiza la capa visual de fondo del hero section:
 * - Vídeo de fondo en autoplay, loop y muted
 * - Blobs animados/decorativos con diferentes colores
 * - Capa visual impactante y moderna
 *
 * Características:
 * - Vídeo background que cubre todo el container
 * - 3 BackgroundBlob con colores y posiciones diferentes:
 *   1. Blob azul (100, 120, 255) en top-left (10%, 20%)
 *   2. Blob rojo-rosa (255, 107, 129) en bottom-right (15%, 15%)
 *   3. Blob morado (138, 147, 255) en bottom-center
 * - Efecto de blur en blobs para suavizar
 * - Responsive y performance optimizado
 *
 * Archivos usados:
 * - Video: /src/assets/backgroundvideo.mp4
 * - Atoms: BackgroundBlob
 *
 * Ubicación:
 * - Renderizado dentro de Hero.jsx
 * - Detrás del contenido (z-index lower)
 * - Solo en landing page
 *
 * @module frontend/components/molecules/HeroBackground
 * @component
 * @requires ../atoms/BackgroundBlob
 * @requires ../../assets/backgroundvideo.mp4
 * @returns {React.ReactElement} Contenedor con video y blobs
 */

import { BackgroundBlob } from '../atoms/BackgroundBlob'
import backgroundVideo from '../../assets/backgroundvideo.mp4'
import styles from '../../styles/HeroBackground.module.css'

/**
 * Componente HeroBackground Principal.
 *
 * Renderiza el fondo visual del hero con vídeo y blobs decorativos.
 *
 * @component
 * @returns {React.ReactElement} Fondo con vídeo y elementos decorativos
 */
export const HeroBackground = () => {
    return (
        <>
            <video
                className={styles.videoBackground}
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>

            <BackgroundBlob
                size={400}
                color="rgba(100, 120, 255, 0.6)"
                top="10%"
                left="20%"
                blur={100}
            />

            <BackgroundBlob
                size={300}
                color="rgba(255, 107, 129, 0.5)"
                bottom="15%"
                right="15%"
                blur={80}
            />

            <BackgroundBlob
                size={150}
                color="rgba(138, 147, 255, 0.7)"
                bottom="30%"
                left="50%"
                blur={60}
            />
        </>
    )
}

