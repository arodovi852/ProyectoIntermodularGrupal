/**
 * Componente ConnectionStatus - Indicador de Estado de Conexión.
 *
 * Componente global que muestra el estado de conexión con el backend.
 * Se renderiza en todo momento en la aplicación (en App.jsx).
 *
 * Estados:
 * - **checking**: Verificando conexión (al montar)
 * - **connected**: Backend disponible (indicador verde)
 * - **disconnected**: Backend no disponible (indicador rojo)
 *
 * Características:
 * - Verifica conexión al montar el componente
 * - Verifica cada 30 segundos automáticamente
 * - Muestra indicador visual (punto de color)
 * - Muestra texto de estado
 * - Logging detallado en consola para debugging
 * - Maneja errores de red gracefully
 *
 * Flujo:
 * 1. Componente monta (connectionStatus = 'checking')
 * 2. useEffect llama checkConnection()
 * 3. checkConnection() llama checkHealth() de API service
 * 4. Si success, setStatus('connected')
 * 5. Si error, setStatus('disconnected')
 * 6. Intervalo repite verificación cada 30 segundos
 * 7. Cleanup al desmontar: clearInterval()
 *
 * Ubicación en UI:
 * - Renderizado globalmente en App.jsx
 * - Posicionado en esquina (posición fixed en CSS)
 * - Siempre visible para el usuario
 *
 * Debugging:
 * - Registra logs en consola para troubleshooting
 * - Muestra código de estado HTTP si hay error
 * - Muestra mensajes descriptivos para cada tipo de error
 *
 * @module frontend/components/ConnectionStatus
 * @component
 * @returns {React.ReactElement} Indicador de estado de conexión
 *
 * @example
 * // En App.jsx
 * <ConnectionStatus />
 *
 * // Renderiza:
 * // 🟢 Conectado a backend (si conexión OK)
 * // 🔴 Sin conexión a backend (si error)
 * // 🟡 Verificando... (mientras se conecta)
 */

import { useState, useEffect } from 'react';
import { checkHealth } from '../../services/api.js';
import styles from '../../styles/ConnectionStatus.module.css';

/**
 * Componente que verifica y muestra el estado de conexión con el backend.
 *
 * @component
 * @returns {React.ReactElement} Div con indicador de status y texto
 */
export default function ConnectionStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('🔍 Verificando conexión con backend...');
        }
        const result = await checkHealth();
        if (import.meta.env.DEV) {
          console.log('Respuesta recibida:', result);
        }

        // Verificar que la respuesta sea válida
        if (result && result.status === 'ok') {
          setStatus('connected');
        } else {
          if (import.meta.env.DEV) {
            console.warn('Respuesta inesperada del backend:', result);
          }
          setStatus('disconnected');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error al conectar con backend:', error);
          if (error.response) {
            console.error('Código de estado:', error.response.status);
            console.error('Datos:', error.response.data);
          } else if (error.request) {
            console.error('No se recibió respuesta del servidor');
          } else {
            console.error('Error:', error.message);
          }
        }
        setStatus('disconnected');
      }
    };

    // Ejecutar la verificación
    checkConnection();

    // Opcional: verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const statusTexts = {
    checking: 'Verificando...',
    connected: 'Conectado a backend',
    disconnected: 'Sin conexión a backend'
  };

  return (
    <div className={styles.statusContainer}>
      <div className={`${styles.statusIndicator} ${styles[status]}`} />
      <span className={styles.statusText}>{statusTexts[status]}</span>
    </div>
  );
}