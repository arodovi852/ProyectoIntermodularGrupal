# Guía de API - Frontend PlayTheMood

> **Para el equipo de Frontend:** Todo lo que necesitas saber para conectar con el backend.

---

## 📋 Tabla de Contenidos

1. [Cómo Funciona el Backend](#-cómo-funciona-el-backend)
2. [Configuración Rápida](#-configuración-rápida)
3. [Autenticación (Usuarios)](#-autenticación-usuarios)
4. [Canciones](#-canciones)
5. [Playlists](#-playlists)
6. [Ejemplos Prácticos](#-ejemplos-prácticos)
7. [Manejo de Errores](#-manejo-de-errores)

---

## 🏗️ Cómo Funciona el Backend

### En Pocas Palabras

El backend es una **API REST** que guarda:
- **Usuarios** → Para login/registro
- **Canciones** → Tracks de Spotify que guardas en nuestra BD
- **Playlists** → Listas de canciones que crean los usuarios

### Flujo Simple

```
1. Usuario se registra → Backend guarda el usuario
2. Usuario hace login → Backend verifica y devuelve sus datos
3. Usuario busca en Spotify → Frontend obtiene canciones de Spotify
4. Usuario guarda canciones → Backend las guarda en nuestra BD
5. Usuario crea playlist → Backend guarda la playlist con los IDs de canciones
```

### Lo Importante

✅ **Las canciones vienen de Spotify** (usas la API de Spotify)  
✅ **Las guardas en nuestro backend** (para tenerlas disponibles sin depender de Spotify)  
✅ **Las playlists solo guardan IDs** (no duplican canciones)  
✅ **Autenticación con JWT** (token que dura 7 días)

### 🔒 Rutas Públicas vs Protegidas

**Públicas (no necesitan token):**
- Registro y Login
- Ver canciones (lectura)
- Buscar canciones

**Protegidas (necesitan token en header):**
- Crear/editar/eliminar playlists
- Gestionar perfil de usuario
- Guardar canciones

---

## ⚙️ Configuración Rápida

### URL del Backend

```javascript
const API_URL = 'http://localhost:3000/api';
```

### Headers por Defecto

```javascript
const headers = {
  'Content-Type': 'application/json'
};

// Para rutas protegidas, añadir token:
const token = localStorage.getItem('token');
const headersConAuth = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

### Formato de Respuestas

**Éxito:**
```json
{
  "success": true,
  "data": { /* tus datos */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

**Lista con paginación:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": [ /* array de elementos */ ]
}
```

---

## 👤 Autenticación (Usuarios)

### 1. Registrar Usuario

```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "674f1234567890abcdef1234",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2025-01-19T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Importante:** Guarda el `token` en localStorage para usarlo en peticiones protegidas.

```javascript
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

---

### 2. Login

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "674f1234567890abcdef1234",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2025-01-19T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Importante:** Guarda el `token` para autenticar las siguientes peticiones.

```javascript
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

---

### 3. Ver Perfil

```http
GET /api/users/:id
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": "674f...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2025-01-19T10:00:00.000Z"
  }
}
```

---

### 4. Actualizar Perfil

```http
PUT /api/users/:id
```

**Body (opcional todo):**
```json
{
  "name": "Juan Carlos",
  "email": "juancarlos@example.com"
}
```

---

### 5. Cambiar Contraseña

```http
PUT /api/users/:id/change-password
```

**Body:**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```

---

## 🎵 Canciones

### 1. Guardar UNA Canción

```http
POST /api/songs
```

**Body:**
```json
{
  "_id": "4cOdK2wGLETKBW3PvgPWqT",
  "name": "Someone Like You",
  "album": "21",
  "album_image_url": "https://i.scdn.co/image/...",
  "artists": ["Adele"],
  "preview_url": "https://p.scdn.co/mp3-preview/...",
  "duration_ms": 285000,
  "spotify_url": "https://open.spotify.com/track/..."
}
```

**Respuesta (201 o 200):**
```json
{
  "success": true,
  "created": true,
  "data": {
    "id": "4cOdK2wGLETKBW3PvgPWqT",
    "name": "Someone Like You",
    /* ... resto de campos */
  }
}
```

**📝 Nota:** Si la canción ya existe (mismo `_id`), se actualiza en lugar de crear duplicado.

---

### 2. Guardar VARIAS Canciones (Recomendado)

```http
POST /api/songs/batch
```

**Body:**
```json
{
  "songs": [
    {
      "_id": "4cOdK2wGLETKBW3PvgPWqT",
      "name": "Someone Like You",
      "album": "21",
      "album_image_url": "https://...",
      "artists": ["Adele"],
      "preview_url": "https://...",
      "duration_ms": 285000,
      "spotify_url": "https://..."
    },
    {
      "_id": "3n3Ppam7vgaVa1iaRUc9Lp",
      "name": "Mr. Brightside",
      /* ... */
    }
  ]
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "saved": 2,
  "errors": 0,
  "data": [ /* canciones guardadas */ ]
}
```

**💡 Tip:** Usa esto cuando el usuario selecciona canciones de Spotify.

---

### 3. Obtener Canción por ID

```http
GET /api/songs/:id
```

**Ejemplo:** `GET /api/songs/4cOdK2wGLETKBW3PvgPWqT`

---

### 4. Obtener VARIAS Canciones por IDs

```http
POST /api/songs/by-ids
```

**Body:**
```json
{
  "ids": [
    "4cOdK2wGLETKBW3PvgPWqT",
    "3n3Ppam7vgaVa1iaRUc9Lp"
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "data": [ /* canciones completas */ ]
}
```

**💡 Uso:** Para obtener todas las canciones de una playlist de una vez.

---

### 5. Buscar Canciones

```http
GET /api/songs?search=adele&page=1&limit=20
```

**Query params:**
- `search`: busca en nombre, artista y álbum
- `page`: número de página (default: 1)
- `limit`: resultados por página (default: 50)

**Respuesta:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": [ /* canciones */ ]
}
```

---

### 6. Búsqueda Avanzada

```http
GET /api/songs/search?name=someone&artist=adele&limit=10
```

**Query params:**
- `name`: buscar por nombre
- `artist`: buscar por artista
- `album`: buscar por álbum
- `limit`: máximo de resultados

---

## 📝 Playlists

### 1. Crear Playlist

```http
POST /api/playlists
```

**Body:**
```json
{
  "name": "Mi Playlist de Rock",
  "userId": "674f1234567890abcdef1234",
  "tracks": [
    "4cOdK2wGLETKBW3PvgPWqT",
    "3n3Ppam7vgaVa1iaRUc9Lp"
  ],
  "cover_image_url": "https://...",
  "spotify_url": "https://..."
}
```

**Campos requeridos:**
- `name`: nombre de la playlist
- `userId`: ID del usuario propietario

**Campos opcionales:**
- `tracks`: array de IDs de canciones (default: `[]`)
- `cover_image_url`: URL de portada (default: placeholder)
- `spotify_url`: URL de Spotify (default: `null`)

**Respuesta (201):**
```json
{
  "success": true,
  "data": {
    "id": "674f9876543210fedcba4321",
    "name": "Mi Playlist de Rock",
    "trackCount": 2,
    "userId": "674f1234567890abcdef1234",
    "coverImageUrl": "https://...",
    "createdAt": "2025-01-19T10:00:00.000Z"
  }
}
```

---

### 2. Ver Playlists de un Usuario

```http
GET /api/playlists/user/:userId
```

**Ejemplo:** `GET /api/playlists/user/674f1234567890abcdef1234`

**Respuesta:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "674f...",
      "name": "Rock Classics",
      "trackCount": 15,
      "coverImageUrl": "https://..."
    }
  ]
}
```

---

### 3. Ver Detalles de Playlist (CON CANCIONES)

```http
GET /api/playlists/:id
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "674f...",
    "name": "Mi Playlist de Rock",
    "trackCount": 2,
    "totalDuration": "8m 27s",
    "songs": [
      {
        "id": "4cOdK2wGLETKBW3PvgPWqT",
        "name": "Someone Like You",
        "album": "21",
        "albumImageUrl": "https://...",
        "artists": ["Adele"],
        "duration": "4:45",
        "spotifyUrl": "https://..."
      }
    ]
  }
}
```

**💡 Uso:** Para mostrar la playlist completa con todas las canciones.

---

### 4. Actualizar Playlist

```http
PUT /api/playlists/:id
```

**Body (todos opcionales):**
```json
{
  "name": "Nuevo Nombre",
  "tracks": ["id1", "id2", "id3"],
  "cover_image_url": "https://..."
}
```

---

### 5. Añadir Canciones a Playlist

```http
POST /api/playlists/:id/tracks
```

**Body:**
```json
{
  "tracks": [
    "7qiZfU4dY1lWllzX7mPBI",
    "5Z01UMMf7V1o0MzF86s6WJ"
  ]
}
```

**📝 Nota:** No añade duplicados. Si una canción ya está, la ignora.

---

### 6. Eliminar Playlist

```http
DELETE /api/playlists/:id
```

---

## 💻 Ejemplos Prácticos

### Ejemplo 1: Registro y Login Completo

```javascript
const API_URL = 'http://localhost:3000/api';

// Función para registrar
async function register(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error);
  }
  
  // Guardar token y usuario
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  
  return data.data;
}

// Función para login
async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error);
  }
  
  // Guardar token y usuario
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  
  return data.data;
}

// Función helper para peticiones autenticadas
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Uso
try {
  const result = await register('Juan', 'juan@example.com', '123456');
  console.log('Usuario creado:', result.user);
  console.log('Token guardado');
  
  const loginResult = await login('juan@example.com', '123456');
  console.log('Login exitoso:', loginResult.user);
} catch (error) {
  console.error('Error:', error.message);
}
```

---

### Ejemplo 2: Guardar Canciones de Spotify y Crear Playlist

```javascript
// 1. Obtener canciones de Spotify (tu código existente)
const spotifyTracks = await buscarEnSpotify('rock');

// 2. Formatear para nuestro backend
const cancionesParaGuardar = spotifyTracks.map(track => ({
  _id: track.id,
  name: track.name,
  album: track.album.name,
  album_image_url: track.album.images[0]?.url || '',
  artists: track.artists.map(a => a.name),
  preview_url: track.preview_url,
  duration_ms: track.duration_ms,
  spotify_url: track.external_urls.spotify
}));

// 3. Obtener token para autenticación
const token = localStorage.getItem('token');

// 4. Guardar en nuestro backend (batch) - REQUIERE TOKEN
const respuesta = await fetch(`${API_URL}/songs/batch`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ⬅️ TOKEN REQUERIDO
  },
  body: JSON.stringify({ songs: cancionesParaGuardar })
});

const { data: cancionesGuardadas } = await respuesta.json();

// 5. Crear playlist con las canciones - REQUIERE TOKEN
const usuario = JSON.parse(localStorage.getItem('user'));
const idsDeCaniones = cancionesGuardadas.map(c => c.id);

const playlistResponse = await fetch(`${API_URL}/playlists`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ⬅️ TOKEN REQUERIDO
  },
  body: JSON.stringify({
    name: 'Mi Playlist de Rock',
    userId: usuario.id,
    tracks: idsDeCaniones,
    cover_image_url: cancionesParaGuardar[0]?.album_image_url
  })
});

const { data: playlist } = await playlistResponse.json();
console.log('✅ Playlist creada:', playlist);
```

---

### Ejemplo 3: Mostrar Playlists del Usuario

```javascript
// Obtener usuario y token
const usuario = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

// Obtener sus playlists - REQUIERE TOKEN
const response = await fetch(`${API_URL}/playlists/user/${usuario.id}`, {
  headers: {
    'Authorization': `Bearer ${token}`  // ⬅️ TOKEN REQUERIDO
  }
});

const { data: playlists } = await response.json();

console.log(`Tienes ${playlists.length} playlists`);

// Mostrar la primera con detalles - REQUIERE TOKEN
if (playlists.length > 0) {
  const detailsResponse = await fetch(`${API_URL}/playlists/${playlists[0].id}`, {
    headers: {
      'Authorization': `Bearer ${token}`  // ⬅️ TOKEN REQUERIDO
    }
  });
  
  const { data: detalles } = await detailsResponse.json();
  
  console.log('Playlist:', detalles.name);
  console.log('Duración total:', detalles.totalDuration);
  console.log('Canciones:', detalles.songs);
}
```

---

### Ejemplo 4: Buscar y Añadir Canciones

```javascript
// Buscar canciones en tu BD
async function buscarCanciones(termino) {
  const response = await fetch(
    `${API_URL}/songs?search=${encodeURIComponent(termino)}&limit=20`
  );
  const { data } = await response.json();
  return data;
}

// Añadir a playlist
async function añadirAPlaylist(playlistId, cancionIds) {
  const response = await fetch(`${API_URL}/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tracks: cancionIds })
  });
  
  const { data } = await response.json();
  return data;
}

// Uso
const canciones = await buscarCanciones('adele');
const ids = canciones.slice(0, 3).map(c => c.id);
await añadirAPlaylist('674f...', ids);
```

---

## ⚠️ Manejo de Errores

### Códigos HTTP

- **200** → OK
- **201** → Creado
- **400** → Datos inválidos
- **401** → No autorizado (login incorrecto)
- **404** → No encontrado
- **500** → Error del servidor

### Función Helper para Errores

```javascript
async function fetchAPI(url, options = {}) {
  try {
    // Obtener token automáticamente
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Si el token expiró o es inválido, logout automático
      if (response.status === 401 && data.error?.includes('Token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
      
      throw new Error(data.error || 'Error desconocido');
    }
    
    return data;
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
}

// Uso - El token se añade automáticamente
try {
  // Sin necesidad de añadir headers manualmente
  const playlists = await fetchAPI(`${API_URL}/playlists/user/674f...`);
  
  const newPlaylist = await fetchAPI(`${API_URL}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Mi Playlist',
      userId: '674f...',
      tracks: []
    })
  });
  
  console.log('Playlist creada:', newPlaylist);
} catch (error) {
  alert(`Error: ${error.message}`);
}
```

---

## 📊 Resumen de Endpoints

### Usuarios
- `POST /api/auth/register` → Registrar
- `POST /api/auth/login` → Login
- `GET /api/users/:id` → Ver perfil
- `PUT /api/users/:id` → Actualizar perfil
- `PUT /api/users/:id/change-password` → Cambiar contraseña

### Canciones
- `POST /api/songs` → Guardar una
- `POST /api/songs/batch` → Guardar varias ✅ (recomendado)
- `GET /api/songs/:id` → Obtener una
- `POST /api/songs/by-ids` → Obtener varias ✅ (recomendado)
- `GET /api/songs?search=...` → Buscar
- `GET /api/songs/search?name=...&artist=...` → Búsqueda avanzada

### Playlists
- `POST /api/playlists` → Crear
- `GET /api/playlists/user/:userId` → Ver de un usuario
- `GET /api/playlists/:id` → Ver detalles (con canciones) ✅
- `PUT /api/playlists/:id` → Actualizar
- `POST /api/playlists/:id/tracks` → Añadir canciones
- `DELETE /api/playlists/:id` → Eliminar

---

## 🚀 Flujo Completo Recomendado

```
1. Usuario se registra/login → Guardar su ID en localStorage

2. Usuario busca en Spotify → Obtener tracks de Spotify API

3. Usuario selecciona canciones → 
   - Formatear canciones al formato del backend
   - POST /api/songs/batch (guardar todas de una vez)

4. Crear playlist →
   - POST /api/playlists con los IDs de las canciones guardadas

5. Ver playlists →
   - GET /api/playlists/user/:userId

6. Ver detalles de playlist →
   - GET /api/playlists/:id (incluye canciones completas)

7. Añadir más canciones →
   - POST /api/playlists/:id/tracks
```

---

## 💡 Tips Importantes

1. **Usa `/api/songs/batch`** para guardar múltiples canciones de una vez (más eficiente)

2. **Usa `/api/songs/by-ids`** para obtener todas las canciones de una playlist de una vez

3. **GET `/api/playlists/:id`** devuelve la playlist con las canciones completas y duración

4. **Guarda el token** en localStorage después del login/registro

5. **Incluye el token** en el header `Authorization: Bearer <token>` para rutas protegidas

6. **No guardes la contraseña** en el frontend (el backend la hashea)

7. **Las canciones no se duplican** (usan el ID de Spotify como `_id`)

8. **Los tracks en playlists son solo IDs** (no objetos completos)

9. **El token expira en 7 días** - maneja el error 401 para hacer logout automático

---

## 🚪 Logout

```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

## ⚠️ Errores Relacionados con JWT

### Token no proporcionado (401)
```json
{
  "success": false,
  "error": "Token no proporcionado"
}
```
**Solución:** Incluye el header `Authorization: Bearer <token>`

### Token inválido (401)
```json
{
  "success": false,
  "error": "Token inválido"
}
```
**Solución:** Token corrupto. Hacer logout y login nuevamente.

### Token expirado (401)
```json
{
  "success": false,
  "error": "Token expirado"
}
```
**Solución:** El token duró 7 días. Hacer logout y login nuevamente.

### No tienes permiso (403)
```json
{
  "success": false,
  "error": "No tienes permiso para acceder a este recurso"
}
```
**Solución:** Intentas acceder a recursos de otro usuario.

---

## 📚 Documentación Completa

Para más detalles sobre JWT:
- **[AUTENTICACION_JWT.md](autentificacion/AUTENTICACION_JWT.md)** - Guía completa de JWT

---

**Última actualización:** 19 de enero de 2025  
**Versión:** 2.1.0 (Con JWT)  
**Backend:** Node.js + Express + MongoDB + JWT

