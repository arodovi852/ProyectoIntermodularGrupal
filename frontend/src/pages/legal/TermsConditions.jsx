import styles from '../../styles/LegalPage.module.css';

/**
 * Página de Términos y Condiciones.
 * Ruta: /legal/terminos
 * Adaptados al proyecto PlayTheMood.
 *
 * @component
 * @returns {React.ReactElement} Página completa de Términos y Condiciones
 */
function TermsConditions() {
    return (
        <main className={styles.legalPage} id="main-content">
            <h1>Términos y Condiciones de Uso</h1>
            <p className={styles.lastUpdated}>Última actualización: 19 de febrero de 2026 — Versión 1.0</p>

            <section>
                <h2>1. Información General</h2>
                <p>
                    Estos Términos y Condiciones (en adelante, "Términos") regulan el acceso y uso de la
                    plataforma PlayTheMood (en adelante, "el Servicio"), accesible desde <strong>playthemood.dev</strong>.
                </p>
                <div className={styles.contactBox}>
                    <p><strong>Titular del Servicio:</strong> PlayTheMood</p>
                    <p><strong>Dominio:</strong> playthemood.dev</p>
                    <p><strong>Email de contacto:</strong> <a href="mailto:legal@playthemood.dev">legal@playthemood.dev</a></p>
                </div>
            </section>

            <section>
                <h2>2. Aceptación de los Términos</h2>
                <p>
                    Al registrarte en PlayTheMood, confirmas que has leído, comprendido y aceptado estos
                    Términos, así como nuestra <a href="/legal/privacidad">Política de Privacidad</a> y
                    nuestra <a href="/legal/cookies">Política de Cookies</a>.
                </p>
                <p>
                    La versión y fecha de los Términos aceptados se registran junto con tu cuenta para
                    constancia del consentimiento otorgado.
                </p>
            </section>

            <section>
                <h2>3. Descripción del Servicio</h2>
                <p>PlayTheMood es una aplicación web que permite a los usuarios:</p>
                <ul>
                    <li>Generar playlists de Spotify personalizadas basadas en su estado de ánimo</li>
                    <li>Crear y gestionar playlists personalizadas</li>
                    <li>Descubrir nueva música según parámetros de audio</li>
                    <li>Guardar y organizar sus playlists favoritas</li>
                </ul>
                <p>El Servicio requiere:</p>
                <ul>
                    <li>Cuenta de usuario registrada en PlayTheMood</li>
                    <li>Cuenta de Spotify (para ciertas funcionalidades de integración)</li>
                </ul>
            </section>

            <section>
                <h2>4. Registro y Cuenta de Usuario</h2>
                <h3>4.1 Requisitos</h3>
                <ul>
                    <li>Tener al menos <strong>14 años</strong> (conforme a la LOPDGDD). Los menores de 14 años requieren consentimiento parental.</li>
                    <li>Proporcionar información veraz y actualizada en el registro.</li>
                    <li>Mantener la confidencialidad de tus credenciales de acceso.</li>
                    <li>Notificar cualquier uso no autorizado de tu cuenta.</li>
                </ul>
                <h3>4.2 Responsabilidad de la Cuenta</h3>
                <p>
                    Eres responsable de todas las actividades realizadas bajo tu cuenta. PlayTheMood
                    no se hace responsable de daños derivados del uso no autorizado de tus credenciales.
                </p>
            </section>

            <section>
                <h2>5. Uso Aceptable</h2>
                <h3>5.1 Uso Permitido</h3>
                <p>Los usuarios PUEDEN:</p>
                <ul>
                    <li>Crear playlists para uso personal</li>
                    <li>Compartir sus playlists públicas</li>
                    <li>Exportar sus datos personales en cualquier momento</li>
                    <li>Eliminar su cuenta permanentemente cuando lo deseen</li>
                    <li>Modificar sus datos y preferencias</li>
                </ul>
                <h3>5.2 Uso Prohibido</h3>
                <p>Los usuarios NO PUEDEN:</p>
                <ul>
                    <li>Crear cuentas falsas o con datos fraudulentos</li>
                    <li>Intentar acceder a cuentas de otros usuarios</li>
                    <li>Realizar ingeniería inversa del software</li>
                    <li>Usar el servicio para actividades ilegales</li>
                    <li>Intentar sobrecargar los servidores (ataques DoS)</li>
                    <li>Extraer datos masivamente (scraping)</li>
                    <li>Revender o comercializar el acceso al servicio</li>
                    <li>Crear contenido que incite al odio, discriminación o violencia</li>
                </ul>
            </section>

            <section>
                <h2>6. Propiedad Intelectual</h2>
                <h3>6.1 Titularidad de PlayTheMood</h3>
                <p>Son propiedad de PlayTheMood:</p>
                <ul>
                    <li>El código fuente de la aplicación (Licencia MIT)</li>
                    <li>El diseño y la interfaz de usuario</li>
                    <li>Los algoritmos de generación de playlists</li>
                    <li>La marca y logotipo "PlayTheMood"</li>
                </ul>
                <h3>6.2 Licencia de Uso</h3>
                <p>Concedemos a los usuarios una licencia:</p>
                <ul>
                    <li>No exclusiva</li>
                    <li>No transferible</li>
                    <li>Revocable</li>
                    <li>Para uso personal y no comercial</li>
                </ul>
                <h3>6.3 Contenido del Usuario</h3>
                <p>
                    Los usuarios conservan la propiedad de sus nombres de playlists, descripciones y
                    configuraciones. Al usar PlayTheMood, concedes una licencia para almacenar y mostrar
                    dicho contenido dentro del servicio.
                </p>
                <h3>6.4 Contenido de Spotify</h3>
                <p>
                    Todo el contenido musical (canciones, portadas, metadatos) es propiedad de Spotify AB
                    y sus licenciantes. Su uso está sujeto a los{' '}
                    <a href="https://developer.spotify.com/terms/" target="_blank" rel="noopener noreferrer">
                        Términos de Servicio de Spotify
                    </a>.
                </p>
            </section>

            <section>
                <h2>7. Contenido Generado por Usuarios</h2>
                <h3>7.1 Política de Contenido</h3>
                <p>No está permitido crear playlists con nombres que:</p>
                <ul>
                    <li>Inciten al odio o la discriminación</li>
                    <li>Contengan lenguaje ofensivo u obsceno</li>
                    <li>Infrinjan derechos de terceros</li>
                    <li>Promuevan actividades ilegales</li>
                </ul>
                <h3>7.2 Moderación</h3>
                <p>
                    PlayTheMood actúa como hosting de contenido (Art. 16 LSSI-CE).
                    Los usuarios pueden reportar contenido inapropiado, que será revisado en 24-48 horas.
                </p>
            </section>

            <section>
                <h2>8. Servicios de Terceros (Spotify)</h2>
                <p>
                    PlayTheMood se integra con la API de Spotify para proporcionar su servicio.
                    Al usar las funcionalidades de Spotify:
                </p>
                <ul>
                    <li>Aceptas los Términos de Servicio de Spotify</li>
                    <li>Los datos de Spotify se tratan según nuestra Política de Privacidad</li>
                    <li>No almacenamos contenido de audio de Spotify</li>
                    <li>No garantizamos la disponibilidad continua de la API de Spotify</li>
                </ul>
            </section>

            <section>
                <h2>9. Limitación de Responsabilidad</h2>
                <h3>9.1 Disponibilidad del Servicio</h3>
                <p>PlayTheMood se proporciona "tal cual" (AS IS). No garantizamos:</p>
                <ul>
                    <li>Disponibilidad ininterrumpida 24/7</li>
                    <li>Ausencia total de errores o bugs</li>
                    <li>Compatibilidad con todos los dispositivos</li>
                </ul>
                <h3>9.2 Exclusión de Daños</h3>
                <p>En la máxima medida permitida por la ley, excluimos responsabilidad por:</p>
                <ul>
                    <li>Pérdida de datos (recomendamos hacer exportaciones periódicas)</li>
                    <li>Daños indirectos o consecuentes</li>
                    <li>Interrupciones del servicio por causas ajenas a nuestra voluntad</li>
                </ul>
            </section>

            <section>
                <h2>10. Suspensión y Terminación</h2>
                <h3>10.1 Terminación por el Usuario</h3>
                <p>
                    Puedes eliminar tu cuenta en cualquier momento desde la configuración de perfil
                    o contactando a <a href="mailto:soporte@playthemood.dev">soporte@playthemood.dev</a>.
                </p>
                <h3>10.2 Suspensión por PlayTheMood</h3>
                <p>Podemos suspender o cancelar cuentas en caso de:</p>
                <ul>
                    <li>Violación de estos Términos</li>
                    <li>Uso fraudulento o abusivo</li>
                    <li>Solicitud de autoridades competentes</li>
                    <li>Inactividad prolongada (más de 24 meses)</li>
                </ul>
                <h3>10.3 Efectos de la Terminación</h3>
                <p>
                    Tras la terminación, se revoca el acceso inmediatamente. Los datos personales se
                    eliminan según el RGPD (período de retención: 30 días). Puedes solicitar la
                    exportación de tus datos antes de la eliminación.
                </p>
            </section>

            <section>
                <h2>11. Modificaciones</h2>
                <p>
                    Nos reservamos el derecho de modificar estos Términos. Los cambios se notificarán
                    mediante aviso en la aplicación y actualización de la fecha. El uso continuado
                    del Servicio tras la notificación implica aceptación de los nuevos términos.
                </p>
            </section>

            <section>
                <h2>12. Ley Aplicable y Jurisdicción</h2>
                <p>
                    Estos Términos se rigen por la <strong>legislación española</strong>. Para cualquier
                    controversia, las partes se someten a los Juzgados y Tribunales competentes.
                </p>
                <div className={styles.highlight}>
                    <p>
                        <strong>Resolución alternativa de conflictos:</strong> Para consumidores de la UE,
                        puedes acceder a la Plataforma de resolución de litigios en línea de la Comisión Europea:{' '}
                        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                            https://ec.europa.eu/consumers/odr
                        </a>
                    </p>
                </div>
            </section>

            <section>
                <h2>13. Contacto</h2>
                <div className={styles.contactBox}>
                    <p><strong>Consultas legales:</strong> <a href="mailto:legal@playthemood.dev">legal@playthemood.dev</a></p>
                    <p><strong>Soporte técnico:</strong> <a href="mailto:soporte@playthemood.dev">soporte@playthemood.dev</a></p>
                    <p><strong>Contacto general:</strong> <a href="mailto:contacto@playthemood.dev">contacto@playthemood.dev</a></p>
                </div>
            </section>
        </main>
    );
}

export default TermsConditions;
