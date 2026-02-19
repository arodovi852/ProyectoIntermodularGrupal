import styles from '../../styles/LegalPage.module.css';

/**
 * Página de Política de Privacidad.
 * Ruta: /legal/privacidad
 * Cumple con los requisitos del RGPD y la LOPDGDD.
 *
 * @component
 * @returns {React.ReactElement} Página completa de Política de Privacidad
 */
function PrivacyPolicy() {
    return (
        <main className={styles.legalPage} id="main-content">
            <h1>Política de Privacidad</h1>
            <p className={styles.lastUpdated}>Última actualización: 19 de febrero de 2026 — Versión 1.0</p>

            <section>
                <h2>1. Información del Responsable del Tratamiento</h2>
                <div className={styles.contactBox}>
                    <p><strong>Titular:</strong> PlayTheMood</p>
                    <p><strong>Dominio:</strong> playthemood.dev</p>
                    <p><strong>Email de contacto:</strong> <a href="mailto:contacto@playthemood.dev">contacto@playthemood.dev</a></p>
                    <p><strong>Email protección de datos:</strong> <a href="mailto:privacidad@playthemood.dev">privacidad@playthemood.dev</a></p>
                </div>
                <p>
                    PlayTheMood es una aplicación web que genera playlists de Spotify personalizadas basadas
                    en el estado de ánimo del usuario. Operamos bajo la legislación española y europea.
                </p>
            </section>

            <section>
                <h2>2. Datos que Recopilamos</h2>
                <p>Recopilamos únicamente los datos necesarios para la prestación del servicio:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Dato</th>
                            <th>Tipo</th>
                            <th>Finalidad</th>
                            <th>Base Legal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nombre de usuario</td>
                            <td>Personal</td>
                            <td>Identificación en la plataforma</td>
                            <td>Consentimiento</td>
                        </tr>
                        <tr>
                            <td>Correo electrónico</td>
                            <td>Personal</td>
                            <td>Comunicación y autenticación</td>
                            <td>Consentimiento + Ejecución contractual</td>
                        </tr>
                        <tr>
                            <td>Contraseña (hasheada)</td>
                            <td>Seguridad</td>
                            <td>Autenticación</td>
                            <td>Ejecución contractual</td>
                        </tr>
                        <tr>
                            <td>Playlists creadas</td>
                            <td>Personal</td>
                            <td>Funcionalidad del servicio</td>
                            <td>Ejecución contractual</td>
                        </tr>
                        <tr>
                            <td>Datos de Spotify</td>
                            <td>Personal (terceros)</td>
                            <td>Integración con servicio</td>
                            <td>Consentimiento</td>
                        </tr>
                        <tr>
                            <td>Dirección IP</td>
                            <td>Personal</td>
                            <td>Seguridad y logs</td>
                            <td>Interés legítimo</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.highlight}>
                    <p><strong>Datos NO recopilados:</strong> No recopilamos fecha de nacimiento, dirección postal, número de teléfono ni datos bancarios.</p>
                </div>
            </section>

            <section>
                <h2>3. Finalidad del Tratamiento</h2>
                <p>Tus datos personales son tratados para las siguientes finalidades:</p>
                <ol>
                    <li><strong>Prestación del servicio:</strong> Generación de playlists personalizadas según tu estado de ánimo.</li>
                    <li><strong>Gestión de la cuenta:</strong> Creación, mantenimiento y eliminación de tu cuenta de usuario.</li>
                    <li><strong>Comunicaciones del servicio:</strong> Notificaciones relacionadas con el funcionamiento de la plataforma.</li>
                    <li><strong>Mejora del servicio:</strong> Análisis anónimos para mejorar la experiencia de usuario.</li>
                    <li><strong>Seguridad:</strong> Protección contra accesos no autorizados y ataques.</li>
                </ol>
            </section>

            <section>
                <h2>4. Base Legal del Tratamiento</h2>
                <p>Según el Art. 6 del RGPD, el tratamiento de tus datos se fundamenta en:</p>
                <ul>
                    <li><strong>Consentimiento (Art. 6.1.a):</strong> Otorgado al registrarte y aceptar esta política.</li>
                    <li><strong>Ejecución contractual (Art. 6.1.b):</strong> Necesario para la prestación del servicio que solicitas.</li>
                    <li><strong>Interés legítimo (Art. 6.1.f):</strong> Para garantizar la seguridad de la plataforma.</li>
                </ul>
            </section>

            <section>
                <h2>5. Destinatarios de los Datos</h2>
                <p>Tus datos personales no se ceden a terceros, salvo:</p>
                <ul>
                    <li><strong>Spotify API:</strong> Para la integración con el servicio de música (datos mínimos necesarios).</li>
                    <li><strong>MongoDB Atlas:</strong> Proveedor de base de datos en la nube donde se almacenan los datos cifrados.</li>
                    <li><strong>Obligaciones legales:</strong> Cuando sea requerido por autoridades judiciales o administrativas competentes.</li>
                </ul>
            </section>

            <section>
                <h2>6. Transferencias Internacionales</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>País</th>
                            <th>Base legal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>MongoDB Atlas</td>
                            <td>UE / EE.UU.</td>
                            <td>Cláusulas contractuales tipo (Art. 46.2.c RGPD)</td>
                        </tr>
                        <tr>
                            <td>Spotify API</td>
                            <td>Suecia / Global</td>
                            <td>Contrato de servicio + Decisión de adecuación</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>7. Plazo de Conservación</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de dato</th>
                            <th>Período de conservación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Datos de cuenta activa</td>
                            <td>Mientras la cuenta esté activa</td>
                        </tr>
                        <tr>
                            <td>Datos tras eliminación de cuenta</td>
                            <td>30 días (período de gracia)</td>
                        </tr>
                        <tr>
                            <td>Logs de acceso</td>
                            <td>12 meses</td>
                        </tr>
                        <tr>
                            <td>Backups</td>
                            <td>90 días</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>8. Tus Derechos (ARCO+)</h2>
                <p>Como titular de los datos, tienes los siguientes derechos conforme al RGPD:</p>

                <h3>8.1 Derecho de Acceso (Art. 15)</h3>
                <p>Puedes solicitar una copia de tus datos personales en cualquier momento. PlayTheMood ofrece la funcionalidad de exportación de datos desde tu perfil de usuario.</p>

                <h3>8.2 Derecho de Rectificación (Art. 16)</h3>
                <p>Puedes modificar tus datos directamente desde la sección "Editar Perfil" de tu cuenta.</p>

                <h3>8.3 Derecho de Supresión — "Derecho al Olvido" (Art. 17)</h3>
                <p>Puedes eliminar tu cuenta y todos los datos asociados desde la configuración de tu perfil. La eliminación incluye todas tus playlists, datos personales y registros asociados.</p>

                <h3>8.4 Derecho de Oposición (Art. 21)</h3>
                <p>Puedes oponerte al tratamiento de tus datos para finalidades específicas, como comunicaciones comerciales.</p>

                <h3>8.5 Derecho a la Portabilidad (Art. 20)</h3>
                <p>Puedes solicitar tus datos en formato estructurado (JSON) a través de la funcionalidad de exportación disponible en tu perfil.</p>

                <h3>8.6 Derecho a la Limitación del Tratamiento (Art. 18)</h3>
                <p>Puedes solicitar la limitación del tratamiento de tus datos en determinadas circunstancias.</p>

                <div className={styles.highlight}>
                    <p><strong>Ejercicio de derechos:</strong> Para ejercer cualquiera de estos derechos, contacta con nosotros en <a href="mailto:privacidad@playthemood.dev">privacidad@playthemood.dev</a>. Responderemos en un plazo máximo de 30 días.</p>
                </div>
            </section>

            <section>
                <h2>9. Seguridad de los Datos</h2>
                <p>Implementamos las siguientes medidas técnicas y organizativas:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Medida</th>
                            <th>Tecnología</th>
                            <th>Propósito</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Cifrado de contraseñas</td><td>bcrypt (factor 10)</td><td>Protección de credenciales</td></tr>
                        <tr><td>HTTPS</td><td>TLS 1.3</td><td>Cifrado en tránsito</td></tr>
                        <tr><td>Headers de seguridad</td><td>Helmet.js</td><td>Prevención de ataques web</td></tr>
                        <tr><td>Sanitización</td><td>express-mongo-sanitize</td><td>Prevención de inyección NoSQL</td></tr>
                        <tr><td>Rate limiting</td><td>express-rate-limit</td><td>Prevención de fuerza bruta</td></tr>
                        <tr><td>Tokens seguros</td><td>JWT + secreto fuerte</td><td>Autenticación segura</td></tr>
                        <tr><td>CORS</td><td>cors middleware</td><td>Control de acceso entre orígenes</td></tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>10. Cookies</h2>
                <p>
                    PlayTheMood utiliza cookies para el funcionamiento del servicio. Para más información,
                    consulta nuestra <a href="/legal/cookies">Política de Cookies</a>.
                </p>
            </section>

            <section>
                <h2>11. Menores de Edad</h2>
                <p>
                    De conformidad con la LOPDGDD (Art. 7), el uso de PlayTheMood requiere tener al menos
                    <strong> 14 años</strong>. Los menores de 14 años necesitan el consentimiento de sus
                    padres o tutores legales para utilizar el servicio.
                </p>
            </section>

            <section>
                <h2>12. Cambios en la Política</h2>
                <p>
                    Nos reservamos el derecho de modificar esta política. Los cambios se notificarán mediante
                    aviso en la aplicación y actualización de la fecha de "Última actualización". El uso
                    continuado del servicio tras los cambios implica la aceptación de la política actualizada.
                </p>
            </section>

            <section>
                <h2>13. Contacto</h2>
                <div className={styles.contactBox}>
                    <p><strong>Protección de datos:</strong> <a href="mailto:privacidad@playthemood.dev">privacidad@playthemood.dev</a></p>
                    <p><strong>Contacto general:</strong> <a href="mailto:contacto@playthemood.dev">contacto@playthemood.dev</a></p>
                </div>
            </section>

            <section>
                <h2>14. Reclamaciones ante la AEPD</h2>
                <p>
                    Si consideras que tus derechos no han sido atendidos adecuadamente, tienes derecho a
                    presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>:
                </p>
                <div className={styles.contactBox}>
                    <p><strong>Web:</strong> <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a></p>
                    <p><strong>Dirección:</strong> C/ Jorge Juan, 6, 28001 Madrid</p>
                    <p><strong>Teléfono:</strong> 901 100 099</p>
                </div>
            </section>
        </main>
    );
}

export default PrivacyPolicy;
