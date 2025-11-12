import { Header } from '../components/Header/Header'
import { Hero } from '../components/Hero/Hero'
import { Footer } from '../components/Footer/Footer'
import styles from './Landing.module.css'

export const Landing = () => {
    return (
        <div className={styles.landing}>
            <Header />
            <main className={styles.main}>
                <Hero />
                <Footer />
            </main>
        </div>
    )
}

