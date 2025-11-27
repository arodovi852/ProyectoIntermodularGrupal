import React from 'react'
import { HeroBackground } from '../components/molecules/HeroBackground'
import { HeroContent } from '../components/molecules/HeroContent'
import { Footer } from '../components/Footer/Footer'
import styles from '../styles/Landing.module.css'
import ConnectionStatus from "../components/ConnectionStatus/ConnectionStatus.jsx";

const Landing = () => {
    return (
        <div className={styles.landing}>
            <HeroBackground />
            <ConnectionStatus />
            <main className={styles.main}>
                <HeroContent />
            </main>
            <Footer />
        </div>
    )
}
export default Landing