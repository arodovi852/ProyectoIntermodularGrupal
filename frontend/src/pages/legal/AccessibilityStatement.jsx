import styles from '../../styles/LegalPage.module.css';

/**
 * Página de Declaración de Accesibilidad.
 * Ruta: /legal/accesibilidad
 * Cumple con WCAG 2.1 y Directiva (UE) 2016/2102.
 *
 * @component
 * @returns {React.ReactElement} Página completa de Declaración de Accesibilidad
 */
function AccessibilityStatement() {
    return (
        <main className={styles.legalPage} id="main-content">
            <h1>Declaración de Accesibilidad</h1>
            <p className={styles.lastUpdated}>Última actualización: 19 de febrero de 2026 — Versión 1.0</p>

            <section>
                <h2>1. Compromiso con la Accesibilidad</h2>
                <p>
                    <strong>PlayTheMood</strong> se compromete a garantizar la accesibilidad digital para
                    todas las personas, incluidas aquellas con discapacidades. Trabajamos continuamente
                    para mejorar la experiencia de usuario y aplicar los estándares de accesibilidad web
                    pertinentes.
                </p>
            </section>

            <section>
                <h2>2. Normativa Aplicable</h2>
                <ul>
                    <li><strong>Directiva (UE) 2016/2102</strong> — Accesibilidad de sitios web y aplicaciones móviles</li>
                    <li><strong>Real Decreto 1112/2018</strong> — Accesibilidad de sitios web del sector público español</li>
                    <li><strong>WCAG 2.1</strong> (Web Content Accessibility Guidelines) — Nivel AA como objetivo</li>
                    <li><strong>EN 301 549</strong> — Requisitos de accesibilidad para productos y servicios TIC</li>
                </ul>
            </section>

            <section>
                <h2>3. Estado de Conformidad</h2>
                <p>
                    Esta web cumple parcialmente con las <strong>WCAG 2.1 nivel AA</strong>. Continuamos
                    trabajando para alcanzar la conformidad total.
                </p>

                <h3>3.1 Medidas de Accesibilidad Implementadas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Criterio WCAG</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1.1.1</td>
                            <td>Alternativas textuales (atributo alt en imágenes)</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>1.3.1</td>
                            <td>Información y relaciones (HTML5 semántico)</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>1.4.3</td>
                            <td>Contraste mínimo (ratio 4.5:1)</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>1.4.4</td>
                            <td>Redimensionar texto (zoom hasta 200%)</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>2.1.1</td>
                            <td>Toda funcionalidad accesible por teclado</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>2.4.1</td>
                            <td>Enlace "Saltar al contenido" (skip link)</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>2.4.2</td>
                            <td>Títulos descriptivos en cada página</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>2.4.7</td>
                            <td>Indicador de foco visible</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>3.1.1</td>
                            <td>Idioma de la página (lang="es")</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>3.3.1</td>
                            <td>Identificación de errores en formularios</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>3.3.2</td>
                            <td>Etiquetas e instrucciones en inputs</td>
                            <td>✅ Implementado</td>
                        </tr>
                        <tr>
                            <td>4.1.2</td>
                            <td>Uso de atributos ARIA cuando necesario</td>
                            <td>✅ Implementado</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>4. Contenido No Accesible</h2>
                <p>Las siguientes áreas pueden presentar limitaciones conocidas:</p>
                <ul>
                    <li>Algunas animaciones decorativas pueden no pausarse automáticamente</li>
                    <li>Contenido embebido de terceros (reproductor de Spotify) puede no ser completamente accesible</li>
                </ul>
            </section>

            <section>
                <h2>5. Tecnologías Compatibles</h2>
                <p>La accesibilidad de PlayTheMood depende de las siguientes tecnologías:</p>
                <ul>
                    <li>HTML5 semántico</li>
                    <li>WAI-ARIA (Accessible Rich Internet Applications)</li>
                    <li>CSS3 con soporte para preferencias de usuario (prefers-reduced-motion, prefers-color-scheme)</li>
                    <li>JavaScript (React) con componentes accesibles</li>
                </ul>
            </section>

            <section>
                <h2>6. Herramientas de Verificación Utilizadas</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Herramienta</th>
                            <th>Propósito</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>WAVE (WebAIM)</td>
                            <td>Evaluación automática de accesibilidad</td>
                        </tr>
                        <tr>
                            <td>axe DevTools</td>
                            <td>Extensión de navegador para auditoría</td>
                        </tr>
                        <tr>
                            <td>Lighthouse (Chrome)</td>
                            <td>Auditoría completa de accesibilidad</td>
                        </tr>
                        <tr>
                            <td>Contrast Checker (WebAIM)</td>
                            <td>Verificación de ratios de contraste</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>7. Feedback y Contacto</h2>
                <p>
                    Si encuentras barreras de accesibilidad en PlayTheMood o necesitas información
                    en un formato alternativo, contacta con nosotros:
                </p>
                <div className={styles.contactBox}>
                    <p><strong>Email:</strong> <a href="mailto:accesibilidad@playthemood.dev">accesibilidad@playthemood.dev</a></p>
                    <p><strong>Contacto general:</strong> <a href="mailto:contacto@playthemood.dev">contacto@playthemood.dev</a></p>
                </div>
                <p>Intentaremos responder en un plazo de <strong>5 días hábiles</strong>.</p>
            </section>

            <section>
                <h2>8. Procedimiento de Aplicación</h2>
                <p>
                    Si la respuesta a tu solicitud de accesibilidad no es satisfactoria, puedes
                    presentar una reclamación ante:
                </p>
                <ul>
                    <li><strong>Ministerio de Asuntos Económicos y Transformación Digital</strong></li>
                    <li><strong>Defensor del Pueblo</strong> — <a href="https://www.defensordelpueblo.es" target="_blank" rel="noopener noreferrer">www.defensordelpueblo.es</a></li>
                </ul>
            </section>

            <section>
                <h2>9. Mejora Continua</h2>
                <p>Nos comprometemos a:</p>
                <ul>
                    <li>Realizar auditorías periódicas de accesibilidad</li>
                    <li>Incorporar criterios WCAG 2.1 en cada fase de desarrollo</li>
                    <li>Formar al equipo de desarrollo en buenas prácticas de accesibilidad</li>
                    <li>Priorizar la corrección de problemas de accesibilidad reportados por los usuarios</li>
                </ul>
            </section>
        </main>
    );
}

export default AccessibilityStatement;
