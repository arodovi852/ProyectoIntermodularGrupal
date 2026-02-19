import {Outlet, useLocation} from "react-router";
import React from "react";
import {Footer} from "../components/Footer/Footer.jsx";
import {Header} from "../components/Header/Header.jsx";
import CookieBanner from "../components/CookieBanner/CookieBanner.jsx";
import styles from "../styles/LayoutRoot.module.css";

function LayoutRoot() {
    const location = useLocation()
    const isLanding = location.pathname === '/'
    const isAuthPage = ['/', '/login', '/register', '/recoverpassword'].includes(location.pathname)

    // Para Landing, no usar el layout wrapper (tiene su propio diseño)
    if (isLanding) {
        return (
            <>
                {/* Skip link para accesibilidad WCAG 2.4.1 */}
                <a href="#main-content" className="skip-link">
                    Saltar al contenido principal
                </a>
                <Header/>
                <Outlet/>
                <CookieBanner />
            </>
        )
    }

    // Para otras páginas (Login, Register, etc.), usar el layout con wrapper
    return (
        <section className={`${styles.layoutRoot} ${isAuthPage ? styles.authLayout : ''}`}>
            {/* Skip link para accesibilidad WCAG 2.4.1 */}
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>
            <Header/>
            <main className={styles.content} id="main-content">
                <Outlet/>
            </main>
            <Footer/>
            <CookieBanner />
        </section>
    )
}

export default LayoutRoot