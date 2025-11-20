# Autenticación JWT - Guía de Implementación

## 🔐 ¿Qué es JWT?

**JWT (JSON Web Token)** es un estándar para autenticación. Cuando un usuario hace login, el servidor genera un token único que el frontend debe enviar en cada petición para identificarse.

---

## 🚀 Cómo Funciona

```
1. Usuario hace login → Backend genera token JWT
2. Frontend guarda el token
3. Frontend envía el token en cada petición
4. Backend verifica el token y permite/deniega acceso
```

---

## 📝 Para el Frontend

### 1. Registro y Login

**Registro:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Juan',
    email: 'juan@example.com',
    password: '123456'
  })
});

const { data } = await response.json();
// data contiene: { user, token }

// IMPORTANTE: Guardar el token
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

**Login:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'juan@example.com',
    password: '123456'
  })
});

const { data } = await response.json();

// Guardar token y usuario
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

---

### 2. Usar el Token en Peticiones

**Todas las peticiones protegidas necesitan el token:**

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/playlists', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ⬅️ IMPORTANTE: Bearer + espacio + token
  },
  body: JSON.stringify({
    name: 'Mi Playlist',
    userId: user.id,
    tracks: ['spotify_id_1', 'spotify_id_2']
  })
});
```

---

### 3. Función Helper Recomendada

```javascript
// api.js
const API_URL = 'http://localhost:3000/api';

// Obtener token
function getToken() {
  return localStorage.getItem('token');
}

// Petición con autenticación automática
async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  });
  
  const data = await response.json();
  
  // Si el token expiró
  if (response.status === 401 && data.error?.includes('Token')) {
    // Redirigir al login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
}

// Uso
const playlists = await fetchAPI('/playlists/user/674f...', { method: 'GET' });
const newPlaylist = await fetchAPI('/playlists', {
  method: 'POST',
  body: JSON.stringify({ name: 'Mi Playlist', userId: '...' })
});
```

---

### 4. Logout

```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

### 5. Verificar si está Autenticado

```javascript
function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

// En tu router/guards
if (!isAuthenticated()) {
  window.location.href = '/login';
}
```

---

## 🔒 Rutas Protegidas vs Públicas

### Rutas Públicas (no necesitan token):
- `POST /api/auth/register` → Registrar
- `POST /api/auth/login` → Login
- `GET /api/songs` → Ver canciones
- `GET /api/songs/:id` → Ver una canción
- `GET /api/songs/search` → Buscar canciones
- `POST /api/songs/by-ids` → Obtener múltiples canciones

### Rutas Protegidas (necesitan token):
- **Usuarios:**
  - `GET /api/users/:id` → Ver perfil
  - `PUT /api/users/:id` → Actualizar perfil
  - `DELETE /api/users/:id` → Eliminar cuenta
  - `PUT /api/users/:id/change-password` → Cambiar contraseña

- **Playlists (todas protegidas):**
  - `GET /api/playlists/user/:userId` → Ver playlists
  - `POST /api/playlists` → Crear playlist
  - `GET /api/playlists/:id` → Ver detalles
  - `PUT /api/playlists/:id` → Actualizar
  - `DELETE /api/playlists/:id` → Eliminar
  - `POST /api/playlists/:id/tracks` → Añadir canciones

- **Canciones (escritura protegida):**
  - `POST /api/songs` → Guardar canción
  - `POST /api/songs/batch` → Guardar múltiples
  - `DELETE /api/songs/:id` → Eliminar canción

---

## ⚠️ Manejo de Errores

### Error: Token no proporcionado (401)
```json
{
  "success": false,
  "error": "Token no proporcionado"
}
```
**Solución:** Incluye el header `Authorization: Bearer <token>`

### Error: Token inválido (401)
```json
{
  "success": false,
  "error": "Token inválido"
}
```
**Solución:** El token está corrupto. Hacer logout y login nuevamente.

### Error: Token expirado (401)
```json
{
  "success": false,
  "error": "Token expirado"
}
```
**Solución:** El token duró 7 días. Hacer logout y login nuevamente.

### Error: No tienes permiso (403)
```json
{
  "success": false,
  "error": "No tienes permiso para acceder a este recurso"
}
```
**Solución:** Estás intentando acceder a recursos de otro usuario.

---

## 🔧 Configuración del Backend

### Variables de Entorno

Añade a tu `.env`:

```env
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
JWT_EXPIRES_IN=7d
```

**Generar un secreto seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📊 Ejemplo Completo: Flujo de Usuario

```javascript
// 1. Registro
async function registrar() {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Juan',
      email: 'juan@example.com',
      password: '123456'
    })
  });
  
  const { data } = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  console.log('✅ Registrado y token guardado');
}

// 2. Obtener playlists (con token)
async function obtenerPlaylists() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  const response = await fetch(`http://localhost:3000/api/playlists/user/${user.id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const { data } = await response.json();
  console.log('Playlists:', data);
}

// 3. Crear playlist (con token)
async function crearPlaylist() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  const response = await fetch('http://localhost:3000/api/playlists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Mi Nueva Playlist',
      userId: user.id,
      tracks: []
    })
  });
  
  const { data } = await response.json();
  console.log('✅ Playlist creada:', data);
}

// 4. Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

## 🎯 Checklist de Implementación

### Frontend:
- [ ] Guardar token en localStorage después de login/register
- [ ] Incluir `Authorization: Bearer <token>` en todas las peticiones protegidas
- [ ] Manejar errores 401 (redirigir a login)
- [ ] Implementar logout (limpiar localStorage)
- [ ] Crear función helper para peticiones autenticadas
- [ ] Proteger rutas del frontend con guards

### Backend:
- [x] Instalar jsonwebtoken
- [x] Crear middleware de autenticación
- [x] Generar token en register/login
- [x] Proteger rutas con authMiddleware
- [x] Separar rutas de auth de rutas de usuarios
- [x] Añadir JWT_SECRET al .env

---

## 🔍 Debugging

### Ver el contenido del token

```javascript
// En el navegador (consola)
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
// Muestra: { id, email, iat, exp }
```

### Verificar si el token es válido

```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:3000/api/users/674f...', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (response.status === 401) {
  console.log('❌ Token inválido o expirado');
} else {
  console.log('✅ Token válido');
}
```

---

## 📚 Recursos

- **JWT.io:** https://jwt.io/ (para decodificar tokens)
- **Documentación:** https://jwt.io/introduction

---

**Última actualización:** 19 de enero de 2025  
**Versión:** 1.0.0

