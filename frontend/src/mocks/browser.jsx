// Inicializa el worker para el entorno del navegador
import { setupWorker } from 'msw'
import { handlers } from './handlers.jsx'

export const worker = setupWorker(...handlers)

