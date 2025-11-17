import React, {Fragment} from 'react'
import { Hero } from '../components/Hero/Hero'
import styles from './Landing.module.css'
import ConnectionStatus from "../components/ConnectionStatus/ConnectionStatus.jsx";

const Landing = () => {
    return (
        <div className={styles.landing}>
            <ConnectionStatus />
            <main className={styles.main}>
                <Hero />
            </main>
        </div>
    )
}
export default Landing