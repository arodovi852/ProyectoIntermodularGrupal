import { useState, useEffect } from 'react';
import { checkHealth } from '../../services/api.js';
import styles from './ConnectionStatus.module.css';

export default function ConnectionStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔍 Verificando conexión con backend...');
        const result = await checkHealth();
        console.log('Respuesta recibida:', result);

        // Verificar que la respuesta sea válida
        if (result && result.status === 'ok') {
          setStatus('connected');
        } else {
          console.warn('Respuesta inesperada del backend:', result);
          setStatus('disconnected');
        }
      } catch (error) {
        console.error('Error al conectar con backend:', error);
        if (error.response) {
          console.error('Código de estado:', error.response.status);
          console.error('Datos:', error.response.data);
        } else if (error.request) {
          console.error('No se recibió respuesta del servidor');
        } else {
          console.error('Error:', error.message);
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