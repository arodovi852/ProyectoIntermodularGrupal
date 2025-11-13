# Conexión Backend-Frontend

## 🎯 Cómo Funciona

### En Desarrollo Local
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3001` (Express)
- El frontend hace peticiones directamente a `http://localhost:3001/api/health`

### En Docker
- Frontend: `http://localhost:80` (nginx)
- Backend: `http://backend:3001` (solo accesible dentro de la red de Docker)
- El frontend hace peticiones a `/api/health` (ruta relativa)
- Nginx recibe la petición y la redirige a `http://backend:3001/api/health`

## 🚀 Comandos

### Desarrollo Local
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Docker
```bash
# Construir y ejecutar
docker-compose up --build

# Detener
docker-compose down

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## 🔍 Verificar Conexión

### Local
- Frontend: http://localhost:5173
- Backend health: http://localhost:3001/api/health
- Widget de conexión debe mostrar: ✅ "Conectado al servidor"

### Docker
- Frontend: http://localhost
- Backend health (a través de nginx): http://localhost/api/health
- Widget de conexión debe mostrar: ✅ "Conectado al servidor"

## 🐛 Troubleshooting

Si el widget muestra "Sin conexión":

1. **Verificar backend está corriendo**
   ```bash
   # En navegador o con curl
   curl http://localhost:3001/api/health
   ```

2. **Revisar logs de Docker**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Verificar CORS en el backend**
   - Debe estar configurado en `backend/src/app.js`
   - Debe permitir el origen del frontend

4. **Limpiar caché del navegador**
   - Ctrl + Shift + R (recarga forzada)
   - O abrir en ventana de incógnito

## 📝 Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   DESARROLLO LOCAL                  │
├─────────────────────────────────────────────────────┤
│  Navegador → http://localhost:5173 (Vite)          │
│      ↓                                              │
│  Frontend (React) → http://localhost:3001/api/...  │
│      ↓                                              │
│  Backend (Express) en puerto 3001                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   DOCKER COMPOSE                    │
├─────────────────────────────────────────────────────┤
│  Navegador → http://localhost:80                   │
│      ↓                                              │
│  Nginx (Frontend estático) → /api/...              │
│      ↓                                              │
│  Nginx Proxy → http://backend:3001/api/...         │
│      ↓                                              │
│  Backend (Express) en red interna de Docker         │
└─────────────────────────────────────────────────────┘
```

## ⚙️ Archivos Importantes

- `frontend/src/services/api.js` - Detecta automáticamente si está en desarrollo o producción
- `frontend/nginx.conf` - Configuración del proxy en Docker
- `backend/src/app.js` - Configuración de CORS
- `docker-compose.yml` - Orquestación de contenedores

