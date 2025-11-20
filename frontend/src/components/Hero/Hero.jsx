import { HeroBackground } from '../molecules/HeroBackground'
import { HeroContent } from '../molecules/HeroContent'
import styles from '../../styles/Hero.module.css'

export const Hero = () => {
    return (
        <section className={styles.hero}>
            <HeroBackground />
            <HeroContent />
        </section>
    )
}

