import { setupWorker } from 'msw'
import { handlers } from './handlers.jsx'

export const worker = setupWorker(...handlers)

