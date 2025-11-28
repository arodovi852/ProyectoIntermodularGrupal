import {Outlet, useLocation} from "react-router";
import React from "react";
import {Footer} from "../components/Footer/Footer.jsx";
import {Header} from "../components/Header/Header.jsx";
<<<<<<< HEAD
import './LayoutRoot.css';
=======
import styles from "../styles/LayoutRoot.module.css";
>>>>>>> dev

function LayoutRoot() {
    const location = useLocation()
    const isLanding = location.pathname === '/'

    // Para Landing, no usar el layout wrapper (tiene su propio diseño)
    if (isLanding) {
        return (
            <>
                <Header/>
                <Outlet/>
            </>
        )
    }

    // Para otras páginas (Login, Register, etc.), usar el layout con wrapper
    return (
<<<<<<< HEAD
        <div className="layout-root">
            <Header/>
            <main className="layout-content">
                <Outlet/>
            </main>
            <Footer/>
        </div>
=======
        <section className={styles.layoutRoot}>
            <Header/>
            <main className={styles.content}>
                <Outlet/>
            </main>
            <Footer/>
        </section>
>>>>>>> dev
    )
}

export default LayoutRoot