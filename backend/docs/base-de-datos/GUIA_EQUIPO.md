# 🚀 Guía de Inicio Rápido para el Equipo

## 👥 Para: Alberto (Frontend Lead), César (Backend Lead), Fran (Project Coordinator)

---

## ⚡ Setup Rápido (5 minutos)

### 1. Instalar MongoDB (Si no lo tienes)

**Windows:**
```bash
# Descargar desde: https://www.mongodb.com/try/download/community
# O usar Chocolatey:
choco install mongodb
```

**Verificar instalación:**
```bash
mongod --version
```

### 2. Clonar y Configurar Backend

```bash
cd E:\Usuarios\Fran\Documentos\ReposGit\ProyectoIntermodularGrupal\backend

# Las dependencias ya están instaladas, pero si necesitas reinstalar:
npm install

# El archivo .env ya está creado, pero verifica que tenga:
# MONGODB_URI=mongodb://localhost:27017/mood-playlist-app
```

### 3. Iniciar MongoDB

```bash
# En una terminal separada:
mongod
```

### 4. Poblar la Base de Datos

```bash
npm run seed
```

**Output esperado:**
```
🔌 Conectando a MongoDB...
✅ Conectado a MongoDB
🧹 Limpiando base de datos...
✅ Base de datos limpia
👥 Creando usuarios...
✅ 3 usuarios creados (passwords hasheados)
🎵 Creando canciones...
✅ 8 canciones creadas
📋 Creando playlists...
✅ 4 playlists creadas
```

### 5. Iniciar el Servidor

```bash
npm run dev
```

**Output esperado:**
```
MongoDB conectado: localhost
Base de datos: mood-playlist-app
Servidor corriendo en http://localhost:3000
```

---

## 🧪 Probar que Todo Funciona

### Test 1: Login de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"demo@example.com\",\"password\":\"demo123\"}"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "_id": "...",
    "name": "Usuario Demo",
    "email": "demo@example.com",
    "created_at": "..."
  }
}
```

### Test 2: Obtener Canciones

```bash
curl http://localhost:3000/api/songs
```

**Respuesta esperada:** Array con 8 canciones

### Test 3: Obtener Playlists de Usuario

Usa el `_id` obtenido del login:

```bash
curl http://localhost:3000/api/playlists/user/TU_USER_ID_AQUI
```

---

## 📋 Para Alberto (Frontend Lead)

### Configuración de React

Tu frontend debe conectar con:
```
Backend URL: http://localhost:3000
```

### Context de Autenticación

```javascript
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const { data } = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    }
    
    const error = await response.json();
    return { success: false, error: error.error };
  };
  
  const register = async (name, email, password) => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    if (response.ok) {
      const { data } = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    }
    
    const error = await response.json();
    return { success: false, error: error.error };
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Hook Personalizado para API

```javascript
// src/hooks/useAPI.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

export const useAPI = () => {
  const { user } = useContext(AuthContext);
  
  // Crear playlist
  const createPlaylist = async (name, trackIds) => {
    const response = await fetch(`${API_URL}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        tracks: trackIds,
        userId: user._id,
        cover_image_url: 'https://via.placeholder.com/300'
      })
    });
    return await response.json();
  };
  
  // Guardar canciones desde ReccoBeats
  const saveSongs = async (spotifyTracks) => {
    const songs = spotifyTracks.map(track => ({
      _id: track.id,
      name: track.name,
      album: track.album.name,
      album_image_url: track.album.images[0]?.url || '',
      artists: track.artists.map(a => a.name),
      preview_url: track.preview_url,
      duration_ms: track.duration_ms,
      spotify_url: track.external_urls.spotify
    }));
    
    const response = await fetch(`${API_URL}/songs/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songs })
    });
    return await response.json();
  };
  
  // Obtener playlists del usuario
  const getUserPlaylists = async () => {
    const response = await fetch(`${API_URL}/playlists/user/${user._id}`);
    return await response.json();
  };
  
  // Obtener detalles de playlist
  const getPlaylistDetails = async (playlistId) => {
    const response = await fetch(`${API_URL}/playlists/${playlistId}`);
    return await response.json();
  };
  
  return {
    createPlaylist,
    saveSongs,
    getUserPlaylists,
    getPlaylistDetails
  };
};
```

### Flujo Completo de Generación de Playlist

```javascript
// src/components/MoodGenerator.jsx
import { useState } from 'react';
import { useAPI } from '../hooks/useAPI';

export const MoodGenerator = () => {
  const [valence, setValence] = useState(0.5);
  const [energy, setEnergy] = useState(0.5);
  const [danceability, setDanceability] = useState(0.5);
  const [loading, setLoading] = useState(false);
  
  const { saveSongs, createPlaylist } = useAPI();
  
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      // 1. Obtener tracks de ReccoBeats
      const reccoResponse = await fetch(
        `https://reccobeats.com/api/recommendations?` +
        `valence=${valence}&energy=${energy}&danceability=${danceability}&limit=20`
      );
      const { tracks } = await reccoResponse.json();
      
      // 2. Guardar tracks en el backend
      const saveResult = await saveSongs(tracks);
      console.log('Canciones guardadas:', saveResult.saved);
      
      // 3. Crear playlist
      const trackIds = tracks.map(t => t.id);
      const playlistResult = await createPlaylist(
        `Playlist ${new Date().toLocaleDateString()}`,
        trackIds
      );
      
      console.log('Playlist creada:', playlistResult.data);
      
      // 4. Redirigir o mostrar playlist
      // ...
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Genera tu Playlist</h2>
      
      <label>
        Felicidad: {valence.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={valence}
          onChange={e => setValence(parseFloat(e.target.value))}
        />
      </label>
      
      <label>
        Energía: {energy.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={energy}
          onChange={e => setEnergy(parseFloat(e.target.value))}
        />
      </label>
      
      <label>
        Bailabilidad: {danceability.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={danceability}
          onChange={e => setDanceability(parseFloat(e.target.value))}
        />
      </label>
      
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generando...' : 'Generar Playlist'}
      </button>
    </div>
  );
};
```

---

## 📋 Para César (Backend Lead)

### Tareas Completadas ✅
- [x] Modelos Mongoose (User, Song, Playlist)
- [x] Controladores (user, song, playlist)
- [x] Rutas REST (20 endpoints)
- [x] Autenticación con bcrypt
- [x] Validaciones completas
- [x] Script de seeding
- [x] Documentación completa

### Posibles Mejoras Futuras
- [ ] Implementar JWT para tokens de sesión
- [ ] Rate limiting para proteger endpoints
- [ ] Tests unitarios con Jest
- [ ] Logging más detallado
- [ ] Caché de canciones populares
- [ ] WebSockets para actualizaciones en tiempo real

### Si Necesitas Modificar Algo

**Añadir un campo a User:**
```javascript
// src/models/User.js
const userSchema = new mongoose.Schema({
  // ...existing code...
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  }
});
```

**Añadir un endpoint:**
```javascript
// src/routes/playlistRoutes.js
// ...existing code...
router.post('/:id/duplicate', playlistController.duplicatePlaylist);

// src/controllers/playlistController.js
const duplicatePlaylist = async (req, res) => {
  // implementación...
};
```

---

## 📋 Para Fran (Project Coordinator)

### Documentación Disponible

1. **README.md** - Guía general del backend
2. **DATABASE.md** - Documentación de MongoDB
3. **AUTENTICACION.md** - Sistema de autenticación
4. **ARQUITECTURA.md** - Diagramas y estructura
5. **VALIDACION_PROYECTO.md** - Validación contra requisitos
6. **CAMBIOS_FINALES.md** - Resumen de implementación
7. **EJEMPLOS_USO.md** - Ejemplos prácticos
8. **GUIA_EQUIPO.md** - Este documento

### Estado del Proyecto

| Componente | Estado | Responsable |
|------------|--------|-------------|
| Backend API | ✅ Completo | César |
| Base de Datos | ✅ Completo | César |
| Autenticación | ✅ Completo | César |
| Documentación | ✅ Completo | Fran |
| Frontend | 🔄 Pendiente | Alberto |
| Testing | 🔄 Pendiente | Equipo |
| Despliegue | 🔄 Pendiente | Equipo |

### Checklist del MVP

- [x] Backend funcional
- [x] Base de datos configurada
- [x] Autenticación implementada
- [x] Documentación completa
- [ ] Frontend React (Alberto)
- [ ] Integración Frontend-Backend (Equipo)
- [ ] Tests E2E (Equipo)
- [ ] Despliegue a producción (Equipo)

---

## 🐛 Troubleshooting Común

### Error: "Cannot connect to MongoDB"
```bash
# Solución: Asegurarse de que MongoDB está corriendo
mongod
```

### Error: "Port 3000 already in use"
```bash
# Solución: Cambiar puerto en .env
PORT=3001
```

### Error: "CORS policy blocked"
```bash
# Ya está configurado en el backend para aceptar desde localhost:5173
# Si usas otro puerto, actualizar src/app.js
```

### Error al hacer seeding
```bash
# Solución: Limpiar la base de datos manualmente
mongosh
use mood-playlist-app
db.dropDatabase()
exit
npm run seed
```

---

## 📞 Contacto y Coordinación

**Discord:** Canal del proyecto
**Reuniones:** Según calendario del equipo
**Issues:** GitHub Issues en el repositorio

---

## 🎯 Próximos Pasos

### Esta Semana
1. Alberto: Iniciar componentes de React
2. César: Estar disponible para dudas del frontend
3. Fran: Coordinar integración y revisar progreso

### Próxima Semana
1. Integración Frontend ↔ Backend
2. Primeras pruebas de usuario
3. Ajustes según feedback

---

**¡El backend está listo! Ahora es momento de brillar en el frontend! 🚀**

---

*Última actualización: 2025-11-18*
*Versión: 1.0.0*

