import {Outlet, useLocation} from "react-router";
import React from "react";
import {Footer} from "../components/Footer/Footer.jsx";
import {Header} from "../components/Header/Header.jsx";
import styles from "../styles/LayoutRoot.module.css";

function LayoutRoot() {
    const location = useLocation()
    const isLanding = location.pathname === '/'
    const isAuthPage = ['/', '/login', '/register', '/recoverpassword'].includes(location.pathname)

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
        <section className={`${styles.layoutRoot} ${isAuthPage ? styles.authLayout : ''}`}>
            <Header/>
            <main className={styles.content}>
                <Outlet/>
            </main>
            <Footer/>
        </section>
    )
}

export default LayoutRoot