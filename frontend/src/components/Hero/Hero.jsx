import { HeroBackground } from '../molecules/HeroBackground'
import { HeroContent } from '../molecules/HeroContent'
import styles from '../../styles/Hero.module.css'
import {Footer} from "../Footer/Footer.jsx";

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