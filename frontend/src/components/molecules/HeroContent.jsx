import { Button } from '../atoms/Button'
import { Link } from '../atoms/Link'
import styles from './HeroContent.module.css'

export const HeroContent = () => {
    return (
        <div className={styles.heroContent}>
            <h1 className={styles.title}>
                BROADCASTTD
            </h1>

            <p className={styles.description}>
                <span className={styles.highlight}>Transforma tus</span> emociones en música: tu playlist,
                <span className={styles.highlight}> hecha a medida</span> para este instante.
            </p>

            <Link href="#" className={styles.link}>
                Más sobre el sitio.
            </Link>

            <div className={styles.ctaContainer}>
                <Button variant="cta">
                    <span className={styles.ctaLight}>Crea tu </span>
                    <span className={styles.ctaBlack}>playlist.</span>
                </Button>
            </div>
        </div>
    )
}

