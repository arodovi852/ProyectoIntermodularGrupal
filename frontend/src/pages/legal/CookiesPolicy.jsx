import styles from '../../styles/LegalPage.module.css';

/**
 * Página de Política de Cookies.
 * Ruta: /legal/cookies
 * Cumple con la Directiva ePrivacy y LSSI-CE.
 *
 * @component
 * @returns {React.ReactElement} Página completa de Política de Cookies
 */
function CookiesPolicy() {
    const handleOpenCookieSettings = () => {
        localStorage.removeItem('cookieConsent');
        window.location.reload();
    };

    return (
        <main className={styles.legalPage} id="main-content">
            <h1>Política de Cookies</h1>
            <p className={styles.lastUpdated}>Última actualización: 19 de febrero de 2026 — Versión 1.0</p>

            <section>
                <h2>1. ¿Qué son las Cookies?</h2>
                <p>
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador,
                    tablet o móvil) cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones
                    y preferencias durante un período de tiempo, para que no tengas que volver a configurarlos
                    cada vez que visites el sitio o navegues entre sus páginas.
                </p>
            </section>

            <section>
                <h2>2. Normativa Aplicable</h2>
                <ul>
                    <li><strong>Directiva 2002/58/CE</strong> — Directiva ePrivacy de la UE</li>
                    <li><strong>Ley 34/2002 (LSSI-CE)</strong> — Artículos 22.2 y 22.3 sobre cookies</li>
                    <li><strong>Reglamento (UE) 2016/679 (RGPD)</strong> — Para cookies que tratan datos personales</li>
                </ul>
            </section>

            <section>
                <h2>3. Cookies que Utilizamos</h2>

                <h3>3.1 Cookies Técnicas / Necesarias</h3>
                <p>Estas cookies son esenciales para el funcionamiento del sitio y <strong>no requieren consentimiento</strong> (Art. 22.2 LSSI-CE).</p>
                <table>
                    <thead>
                        <tr>
                            <th>Cookie</th>
                            <th>Finalidad</th>
                            <th>Duración</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>session_id</td>
                            <td>Mantener la sesión de usuario activa</td>
                            <td>Sesión</td>
                        </tr>
                        <tr>
                            <td>jwt_token</td>
                            <td>Autenticación segura del usuario</td>
                            <td>24 horas</td>
                        </tr>
                        <tr>
                            <td>csrf_token</td>
                            <td>Protección contra ataques CSRF</td>
                            <td>Sesión</td>
                        </tr>
                        <tr>
                            <td>cookieConsent</td>
                            <td>Almacenar tus preferencias de cookies</td>
                            <td>1 año</td>
                        </tr>
                    </tbody>
                </table>

                <h3>3.2 Cookies de Personalización</h3>
                <p>Estas cookies <strong>requieren tu consentimiento</strong> y permiten recordar tus preferencias.</p>
                <table>
                    <thead>
                        <tr>
                            <th>Cookie</th>
                            <th>Finalidad</th>
                            <th>Duración</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>theme_preference</td>
                            <td>Preferencia de tema (claro/oscuro)</td>
                            <td>1 año</td>
                        </tr>
                        <tr>
                            <td>language</td>
                            <td>Idioma preferido del usuario</td>
                            <td>1 año</td>
                        </tr>
                        <tr>
                            <td>last_mood</td>
                            <td>Último estado de ánimo seleccionado</td>
                            <td>30 días</td>
                        </tr>
                    </tbody>
                </table>

                <h3>3.3 Cookies Analíticas</h3>
                <p>Estas cookies <strong>requieren tu consentimiento</strong> y nos ayudan a entender cómo usas el sitio web.</p>
                <div className={styles.highlight}>
                    <p><strong>Nota:</strong> Actualmente PlayTheMood no implementa cookies analíticas de terceros. En caso de incorporarlas en el futuro, se actualizará esta política y se solicitará tu consentimiento.</p>
                </div>

                <h3>3.4 Cookies Publicitarias</h3>
                <p>PlayTheMood <strong>NO utiliza</strong> cookies publicitarias ni de seguimiento de terceros.</p>
            </section>

            <section>
                <h2>4. Gestión de Cookies</h2>

                <h3>4.1 Banner de Consentimiento</h3>
                <p>
                    Al visitar PlayTheMood por primera vez, se muestra un banner informativo que te permite:
                </p>
                <ul>
                    <li><strong>Aceptar todas las cookies</strong></li>
                    <li><strong>Rechazar las cookies no esenciales</strong> (solo se activan las técnicas/necesarias)</li>
                    <li><strong>Configurar tus preferencias</strong> de forma granular</li>
                </ul>

                <h3>4.2 Modificar Preferencias</h3>
                <p>Puedes modificar tus preferencias de cookies en cualquier momento:</p>
                <ul>
                    <li>Haciendo clic en "Configurar cookies" en el pie de página</li>
                    <li>
                        <button
                            onClick={handleOpenCookieSettings}
                            style={{
                                background: 'none',
                                border: '1px solid #5888ed',
                                color: '#5888ed',
                                padding: '0.4rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                            aria-label="Abrir configuración de cookies"
                        >
                            Restablecer preferencias de cookies
                        </button>
                    </li>
                </ul>

                <h3>4.3 Configuración del Navegador</h3>
                <p>También puedes gestionar las cookies desde la configuración de tu navegador:</p>
                <ul>
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                    <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                </ul>
                <div className={styles.highlight}>
                    <p><strong>Aviso:</strong> Si desactivas las cookies técnicas o necesarias, es posible que algunas funcionalidades de PlayTheMood no funcionen correctamente (como mantener tu sesión iniciada).</p>
                </div>
            </section>

            <section>
                <h2>5. Revocación del Consentimiento</h2>
                <p>
                    Puedes revocar tu consentimiento en cualquier momento. Al hacerlo, se eliminarán las
                    cookies no esenciales de tu navegador y solo se mantendrán las cookies técnicas
                    necesarias para el funcionamiento básico del sitio.
                </p>
            </section>

            <section>
                <h2>6. Contacto</h2>
                <p>
                    Para cualquier consulta sobre nuestra política de cookies, puedes contactarnos en:{' '}
                    <a href="mailto:privacidad@playthemood.dev">privacidad@playthemood.dev</a>
                </p>
            </section>

            <section>
                <h2>7. Más Información</h2>
                <ul>
                    <li><a href="/legal/privacidad">Política de Privacidad</a></li>
                    <li><a href="/legal/terminos">Términos y Condiciones</a></li>
                    <li><a href="https://www.aepd.es/guias/guia-uso-cookies.pdf" target="_blank" rel="noopener noreferrer">Guía de la AEPD sobre cookies</a></li>
                </ul>
            </section>
        </main>
    );
}

export default CookiesPolicy;
