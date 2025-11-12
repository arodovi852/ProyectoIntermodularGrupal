import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        allowedHosts: [
            '.trycloudflare.com', // Permite todos los subdominios de trycloudflare.com
            'localhost'
        ]
    }
})
