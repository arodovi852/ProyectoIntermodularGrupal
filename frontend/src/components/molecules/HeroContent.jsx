import { Button } from '../atoms/Button'
import styles from '../../styles/HeroContent.module.css'

export const HeroContent = () => {
    return (
        <div className={styles.heroContent}>
            <h1 className={styles.title}>
                playthemood
            </h1>

            <p className={styles.description}>
                Transforma tus emociones en música: tu playlist, hecha
                <span className={styles.highlight}> a medida</span> para este instante.
            </p>

            <div className={styles.ctaContainer}>
                <Button variant="cta">
                    <span className={styles.ctaLight}>Crea tu </span>
                    <span className={styles.ctaBlack}>playlist.</span>
                </Button>
            </div>
        </div>
    )
}

