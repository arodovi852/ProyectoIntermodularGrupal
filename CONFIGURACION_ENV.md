# 🔧 Configuración de Variables de Entorno

## ⚠️ IMPORTANTE - SEGURIDAD

**NUNCA** commiteéis archivos `.env` con credenciales reales al repositorio. Los archivos `.env` están en `.gitignore` por seguridad.

---

## 📋 Configuración para el Equipo

### Backend

1. **Copia el archivo de ejemplo:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edita `backend/.env` con tus credenciales:**
   - Para desarrollo local, puedes usar MongoDB local o crear tu propia cuenta de MongoDB Atlas
   - Las credenciales de Spotify son opcionales (para funcionalidades futuras)

3. **Variables disponibles:**
   - `MONGODB_URI`: Conexión a tu base de datos MongoDB
   - `PORT`: Puerto del servidor (por defecto 3000)
   - `NODE_ENV`: Entorno de ejecución (development/production)
   - `SPOTIFY_CLIENT_ID`: ID de aplicación Spotify (opcional)
   - `SPOTIFY_CLIENT_SECRET`: Secret de Spotify (opcional)

### Frontend

1. **Copia el archivo de ejemplo:**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edita `frontend/.env`:**
   - `VITE_API_URL`: URL del backend (por defecto http://localhost:3000/api)

---

## 🗄️ MongoDB - Opciones para Desarrollo

### Opción 1: MongoDB Local
```bash
# Instalar MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Tu .env usaría:
MONGODB_URI=mongodb://localhost:27017/mood-playlist-app
```

### Opción 2: MongoDB Atlas (Recomendado)
1. Crear cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crear un cluster gratuito (M0)
3. Configurar acceso de red (IP 0.0.0.0/0 para desarrollo)
4. Crear usuario de base de datos
5. Obtener connection string y añadirlo a tu `.env`

---

## 🚀 Producción

Para despliegue en producción, usa `backend/.env.production.example` como referencia:

```bash
cp .env.production.example .env.production
```

**Recuerda:**
- Usar credenciales diferentes para producción
- Configurar restricciones de IP en MongoDB Atlas
- Usar usuarios con permisos limitados
- Mantener las credenciales seguras (nunca en el código)

---

## 🔍 Verificación

Antes de hacer commit, verifica que no estés subiendo credenciales:

```bash
git status
# El .env NO debe aparecer
# Solo .env.example debe aparecer si lo modificaste
```

---

## 📞 Contacto

Si tienes problemas con la configuración, contacta al equipo en el canal de desarrollo.

