# Guía de Configuración Backend-Frontend

## 📋 Configuración Local (Desarrollo)

### 1. Backend
```bash
cd backend
npm install
npm start
```
El backend correrá en `http://localhost:3001`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend correrá en `http://localhost:5173`

**Archivo `.env` necesario en `frontend/`:**
```env
VITE_BACKEND_URL=http://localhost:3001
```

---

## 🐳 Configuración con Docker

### Construir y ejecutar todo:
```bash
docker-compose up --build
```

- **Frontend**: http://localhost
- **Backend**: http://localhost:3001

Docker automáticamente configura la comunicación interna entre contenedores usando `http://backend:3001`.

### Detener los contenedores:
```bash
docker-compose down
```

---

## 🌐 Configuración con Dominio (name.com, etc.)

Si tienes un dominio personalizado:

### 1. Configurar DNS
En tu proveedor (name.com, etc):
- Tipo A: `tu-dominio.com` → IP de tu servidor
- Tipo A: `api.tu-dominio.com` → IP de tu servidor

### 2. Actualizar `.env` del frontend:
```env
VITE_BACKEND_URL=https://api.tu-dominio.com
```

### 3. Configurar HTTPS con Let's Encrypt (Certbot)
```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificados
sudo certbot --nginx -d tu-dominio.com -d api.tu-dominio.com
```

### 4. Actualizar docker-compose.yml:
```yaml
services:
  backend:
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production

  frontend:
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

---

## ☁️ Configuración con Cloudflare Tunnel

### 1. Instalar cloudflared:
```bash
# Windows
winget install --id Cloudflare.cloudflared

# Linux/Mac
brew install cloudflare/cloudflare/cloudflared
```

### 2. Exponer el backend:
```bash
cloudflared tunnel --url http://localhost:3001
```

Obtendrás una URL como: `https://tu-tunnel.trycloudflare.com`

### 3. Actualizar `.env` del frontend:
```env
VITE_BACKEND_URL=https://tu-tunnel.trycloudflare.com
```

### 4. Reiniciar el frontend:
```bash
npm run dev
```

**Nota**: Los túneles de Cloudflare gratuitos cambian la URL cada vez que los reinicias.

---

## 🔍 Verificar la Conexión

### Desde el navegador:
1. Abre: http://localhost:5173 (o tu dominio)
2. Mira el widget en la parte inferior de la página
3. Debe mostrar: 🟢 **Conectado al servidor**

### Desde la terminal:
```bash
# Probar backend directamente
curl http://localhost:3001/api/health

# Respuesta esperada:
# {"status":"ok","message":"Backend funcionando","timestamp":"..."}
```

---

## 🛠️ Troubleshooting

### El widget muestra "Sin conexión"
1. Verifica que el backend esté corriendo
2. Abre la consola del navegador (F12) y mira los errores
3. Verifica que `VITE_BACKEND_URL` esté correctamente configurado
4. Reinicia el servidor de desarrollo frontend después de cambiar `.env`

### Error CORS
Si ves errores de CORS, verifica que en `backend/src/app.js`:
```javascript
app.use(cors({
    origin: '*', // O especifica tu dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
```

### Docker no conecta
1. Verifica que los servicios estén en la misma red
2. Usa `docker-compose logs backend` y `docker-compose logs frontend` para ver errores
3. Asegúrate de hacer `docker-compose down` y `docker-compose up --build` después de cambios

---

## 📝 Archivos Importantes

- **Backend**: `backend/src/app.js` - Configuración CORS y rutas
- **Backend**: `backend/routes/index.js` - Endpoint `/api/health`
- **Frontend**: `frontend/src/services/api.js` - Configuración de Axios
- **Frontend**: `frontend/.env` - Variables de entorno
- **Docker**: `docker-compose.yml` - Orquestación de contenedores
- **Docker**: `frontend/Dockerfile` - Build del frontend
- **Nginx**: `frontend/nginx.conf` - Proxy y configuración del servidor

---

## 🎓 Conceptos Importantes (Entorno Académico)

### ¿Qué es CORS?
Cross-Origin Resource Sharing permite que el frontend (puerto 5173) se comunique con el backend (puerto 3001) a pesar de estar en diferentes orígenes.

### ¿Qué hace `import.meta.env.VITE_BACKEND_URL`?
Vite expone las variables de entorno que empiezan con `VITE_` al código del navegador. Esto permite cambiar la URL del backend sin modificar el código.

### ¿Por qué usar nginx en Docker?
Nginx es un servidor web eficiente que sirve archivos estáticos (HTML, CSS, JS) y puede actuar como proxy reverso para el backend.

### ¿Qué es un túnel de Cloudflare?
Un túnel crea una conexión segura entre tu computadora local y la red de Cloudflare, permitiendo acceso público sin abrir puertos en tu router.

