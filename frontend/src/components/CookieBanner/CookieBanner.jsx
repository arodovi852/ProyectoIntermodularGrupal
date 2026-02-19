import { useState, useEffect } from 'react';
import styles from '../../styles/CookieBanner.module.css';

/**
 * Componente CookieBanner - Banner de consentimiento de cookies.
 *
 * Muestra un banner al usuario en su primera visita para gestionar
 * el consentimiento de cookies según la normativa RGPD y LSSI-CE.
 *
 * Funcionalidades:
 * - Opciones granulares: necesarias, personalización, analíticas
 * - Aceptar todas, rechazar no esenciales, o guardar preferencias
 * - Persiste la elección en localStorage
 * - Se oculta automáticamente si ya hay consentimiento previo
 * - Accesible: role="dialog", aria-label, focus management
 *
 * @component
 * @returns {React.ReactElement|null} Banner de cookies o null si ya hay consentimiento
 */
function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,
        personalization: false,
        analytics: false
    });

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const saveConsent = (consentData) => {
        localStorage.setItem('cookieConsent', JSON.stringify({
            ...consentData,
            timestamp: new Date().toISOString(),
            version: '1.0'
        }));
        setVisible(false);
    };

    const handleAcceptAll = () => {
        saveConsent({
            necessary: true,
            personalization: true,
            analytics: true
        });
    };

    const handleRejectNonEssential = () => {
        saveConsent({
            necessary: true,
            personalization: false,
            analytics: false
        });
    };

    const handleSavePreferences = () => {
        saveConsent(preferences);
    };

    if (!visible) return null;

    return (
        <div className={styles.cookieOverlay} role="dialog" aria-label="Preferencias de cookies" aria-modal="false">
            <div className={styles.cookieBanner}>
                <h2>🍪 Utilizamos cookies</h2>
                <p>
                    Esta web utiliza cookies para mejorar tu experiencia. Las cookies técnicas son
                    necesarias para el funcionamiento del sitio. Puedes aceptar todas, rechazar las
                    no esenciales o configurar tus preferencias.
                </p>

                <div className={styles.options}>
                    <label className={styles.optionItem}>
                        <input
                            type="checkbox"
                            checked
                            disabled
                            aria-label="Cookies necesarias (siempre activas)"
                        />
                        <span className={styles.optionLabel}>
                            <span>Cookies necesarias</span>
                            <small>Requeridas para el funcionamiento básico (sesión, autenticación, seguridad)</small>
                        </span>
                    </label>

                    <label className={styles.optionItem}>
                        <input
                            type="checkbox"
                            checked={preferences.personalization}
                            onChange={(e) => setPreferences({
                                ...preferences,
                                personalization: e.target.checked
                            })}
                            aria-label="Cookies de personalización"
                        />
                        <span className={styles.optionLabel}>
                            <span>Cookies de personalización</span>
                            <small>Recuerdan tus preferencias (tema, idioma, último estado de ánimo)</small>
                        </span>
                    </label>

                    <label className={styles.optionItem}>
                        <input
                            type="checkbox"
                            checked={preferences.analytics}
                            onChange={(e) => setPreferences({
                                ...preferences,
                                analytics: e.target.checked
                            })}
                            aria-label="Cookies analíticas"
                        />
                        <span className={styles.optionLabel}>
                            <span>Cookies analíticas</span>
                            <small>Nos ayudan a mejorar el servicio con análisis de uso anónimos</small>
                        </span>
                    </label>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleRejectNonEssential} className={styles.secondary}>
                        Solo necesarias
                    </button>
                    <button onClick={handleSavePreferences} className={styles.secondary}>
                        Guardar preferencias
                    </button>
                    <button onClick={handleAcceptAll} className={styles.primary}>
                        Aceptar todas
                    </button>
                </div>

                <a href="/legal/cookies" className={styles.cookieLink}>
                    Ver política completa de cookies
                </a>
            </div>
        </div>
    );
}

export default CookieBanner;
