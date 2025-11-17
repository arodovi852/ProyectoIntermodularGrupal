import { Header } from '../components/Header/Header'
import { Hero } from '../components/Hero/Hero'
import styles from './Landing.module.css'
import ConnectionStatus from "../components/ConnectionStatus/ConnectionStatus.jsx";

export const Landing = () => {
    return (
        <div className={styles.landing}>
            <ConnectionStatus />
            <main className={styles.main}>
                <Hero />
            </main>
        </div>
    )
}

