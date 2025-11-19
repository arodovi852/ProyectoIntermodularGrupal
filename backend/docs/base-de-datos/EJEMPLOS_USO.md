# Ejemplos de Uso - API Backend

Este documento contiene ejemplos prácticos de cómo usar la API del backend.

## 🔧 Configuración Inicial

Asegúrate de que el servidor esté corriendo:
```bash
npm run dev
```

## 📡 Ejemplos de Peticiones HTTP

### 1. Obtener Recomendaciones de Canciones

**Estado de ánimo feliz y energético:**
```http
GET http://localhost:3000/api/songs/recommendations?valence=0.9&energy=0.8&danceability=0.7&limit=10
```

**Estado de ánimo tranquilo y relajado:**
```http
GET http://localhost:3000/api/songs/recommendations?valence=0.3&energy=0.2&danceability=0.3&limit=15
```

**Respuesta esperada:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "3n3Ppam7vgaVa1iaRUc9Lp",
      "name": "Mr. Brightside",
      "album": "Hot Fuss",
      "album_image_url": "https://...",
      "artists": ["The Killers"],
      "preview_url": null,
      "duration_ms": 222200,
      "spotify_url": "https://open.spotify.com/track/...",
      "createdAt": "2024-01-18T...",
      "updatedAt": "2024-01-18T..."
    }
  ]
}
```

### 2. Buscar Canciones

**Buscar por nombre:**
```http
GET http://localhost:3000/api/songs/search?name=brightside&limit=5
```

**Buscar por artista:**
```http
GET http://localhost:3000/api/songs/search?artist=killers&limit=10
```

**Buscar por álbum:**
```http
GET http://localhost:3000/api/songs/search?album=hot%20fuss
```

### 3. Crear una Playlist

```http
POST http://localhost:3000/api/playlists
Content-Type: application/json

{
  "name": "Mi Playlist de Estudio",
  "tracks": [
    "3n3Ppam7vgaVa1iaRUc9Lp",
    "0VjIjW4GlUZAMYd2vXMi3b"
  ],
  "userId": "507f1f77bcf86cd799439011",
  "cover_image_url": "https://i.scdn.co/image/ab67616d0000b273...",
  "spotify_url": null
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "_id": "65a123456789abcdef012345",
    "name": "Mi Playlist de Estudio",
    "tracks": ["3n3Ppam7vgaVa1iaRUc9Lp", "0VjIjW4GlUZAMYd2vXMi3b"],
    "userId": "507f1f77bcf86cd799439011",
    "cover_image_url": "https://...",
    "spotify_url": null,
    "created_at": "2024-01-18T...",
    "createdAt": "2024-01-18T...",
    "updatedAt": "2024-01-18T..."
  }
}
```

### 4. Obtener Playlists de un Usuario

```http
GET http://localhost:3000/api/playlists/user/507f1f77bcf86cd799439011
```

### 5. Obtener Detalles de una Playlist (con canciones)

```http
GET http://localhost:3000/api/playlists/65a123456789abcdef012345
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "_id": "65a123456789abcdef012345",
    "name": "Mi Playlist de Estudio",
    "tracks": ["3n3Ppam7vgaVa1iaRUc9Lp", "0VjIjW4GlUZAMYd2vXMi3b"],
    "songs": [
      {
        "_id": "3n3Ppam7vgaVa1iaRUc9Lp",
        "name": "Mr. Brightside",
        "album": "Hot Fuss",
        "artists": ["The Killers"],
        "duration_ms": 222200,
        "spotify_url": "https://..."
      },
      {
        "_id": "0VjIjW4GlUZAMYd2vXMi3b",
        "name": "Blinding Lights",
        "album": "After Hours",
        "artists": ["The Weeknd"],
        "duration_ms": 200040,
        "spotify_url": "https://..."
      }
    ],
    "totalDuration": "7m 2s",
    "trackCount": 2
  }
}
```

### 6. Añadir Canciones a una Playlist

```http
POST http://localhost:3000/api/playlists/65a123456789abcdef012345/tracks
Content-Type: application/json

{
  "tracks": [
    "7qiZfU4dY1lWllzX7mPBI",
    "3WMj8moIAXJhHsyLaqIIHI"
  ]
}
```

### 7. Actualizar una Playlist

```http
PUT http://localhost:3000/api/playlists/65a123456789abcdef012345
Content-Type: application/json

{
  "name": "Mi Playlist de Estudio - Actualizada",
  "cover_image_url": "https://nueva-imagen.com/cover.jpg"
}
```

### 8. Eliminar una Playlist

```http
DELETE http://localhost:3000/api/playlists/65a123456789abcdef012345
```

### 9. Obtener Múltiples Canciones por IDs

```http
POST http://localhost:3000/api/songs/batch
Content-Type: application/json

{
  "ids": [
    "3n3Ppam7vgaVa1iaRUc9Lp",
    "0VjIjW4GlUZAMYd2vXMi3b",
    "7qiZfU4dY1lWllzX7mPBI"
  ]
}
```

## 💻 Ejemplos de Código (JavaScript)

### Crear una playlist desde el frontend

```javascript
async function createPlaylist(userId, moodParams) {
  try {
    // 1. Obtener recomendaciones basadas en el estado de ánimo
    const recommendationsResponse = await fetch(
      `http://localhost:3000/api/songs/recommendations?` +
      `valence=${moodParams.valence}&` +
      `energy=${moodParams.energy}&` +
      `danceability=${moodParams.danceability}&` +
      `limit=20`
    );
    const recommendations = await recommendationsResponse.json();
    
    if (!recommendations.success) {
      throw new Error('Error al obtener recomendaciones');
    }
    
    // 2. Extraer IDs de las canciones
    const trackIds = recommendations.data.map(song => song._id);
    
    // 3. Crear la playlist
    const playlistResponse = await fetch('http://localhost:3000/api/playlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Playlist ${new Date().toLocaleDateString()}`,
        tracks: trackIds,
        userId: userId,
        cover_image_url: recommendations.data[0]?.album_image_url || '',
        spotify_url: null
      })
    });
    
    const playlist = await playlistResponse.json();
    
    if (playlist.success) {
      console.log('Playlist creada:', playlist.data);
      return playlist.data;
    } else {
      throw new Error(playlist.error);
    }
  } catch (error) {
    console.error('Error al crear playlist:', error);
    throw error;
  }
}

// Uso:
const userId = '507f1f77bcf86cd799439011';
const mood = {
  valence: 0.8,    // Feliz
  energy: 0.7,     // Energético
  danceability: 0.6 // Bailable
};

createPlaylist(userId, mood)
  .then(playlist => console.log('✅ Playlist creada:', playlist))
  .catch(error => console.error('❌ Error:', error));
```

### Buscar y mostrar canciones

```javascript
async function searchAndDisplay(searchTerm) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/songs/search?name=${encodeURIComponent(searchTerm)}&limit=10`
    );
    const result = await response.json();
    
    if (result.success) {
      console.log(`Encontradas ${result.count} canciones:`);
      result.data.forEach(song => {
        console.log(`- ${song.name} por ${song.artists.join(', ')}`);
        console.log(`  Álbum: ${song.album}`);
        console.log(`  Duración: ${formatDuration(song.duration_ms)}`);
        console.log(`  URL: ${song.spotify_url}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error en la búsqueda:', error);
  }
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Uso:
searchAndDisplay('brightside');
```

### Obtener y mostrar playlists de un usuario

```javascript
async function getUserPlaylistsWithDetails(userId) {
  try {
    // 1. Obtener playlists del usuario
    const playlistsResponse = await fetch(
      `http://localhost:3000/api/playlists/user/${userId}`
    );
    const playlistsResult = await playlistsResponse.json();
    
    if (!playlistsResult.success) {
      throw new Error('Error al obtener playlists');
    }
    
    console.log(`Usuario tiene ${playlistsResult.count} playlists:`);
    
    // 2. Obtener detalles de cada playlist
    for (const playlist of playlistsResult.data) {
      const detailsResponse = await fetch(
        `http://localhost:3000/api/playlists/${playlist._id}`
      );
      const details = await detailsResponse.json();
      
      if (details.success) {
        console.log(`\n📋 ${details.data.name}`);
        console.log(`   Canciones: ${details.data.trackCount}`);
        console.log(`   Duración: ${details.data.totalDuration}`);
        console.log(`   Tracks:`);
        details.data.songs.forEach((song, index) => {
          console.log(`   ${index + 1}. ${song.name} - ${song.artists.join(', ')}`);
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uso:
const userId = '507f1f77bcf86cd799439011';
getUserPlaylistsWithDetails(userId);
```

## 🎨 Mapeo de Estado de Ánimo a Parámetros

```javascript
const moodPresets = {
  feliz: {
    valence: 0.8,
    energy: 0.7,
    danceability: 0.6
  },
  triste: {
    valence: 0.2,
    energy: 0.3,
    danceability: 0.3
  },
  energetico: {
    valence: 0.7,
    energy: 0.9,
    danceability: 0.8
  },
  relajado: {
    valence: 0.5,
    energy: 0.2,
    danceability: 0.3
  },
  romantico: {
    valence: 0.6,
    energy: 0.4,
    danceability: 0.4
  },
  motivador: {
    valence: 0.8,
    energy: 0.8,
    danceability: 0.7
  }
};

// Uso:
const mood = moodPresets.feliz;
// Luego usar `mood` en createPlaylist()
```

## 🧪 Testing con cURL

```bash
# Obtener recomendaciones
curl "http://localhost:3000/api/songs/recommendations?valence=0.8&energy=0.7&danceability=0.6&limit=5"

# Buscar canciones
curl "http://localhost:3000/api/songs/search?name=brightside"

# Crear playlist
curl -X POST http://localhost:3000/api/playlists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Playlist",
    "tracks": ["3n3Ppam7vgaVa1iaRUc9Lp"],
    "userId": "507f1f77bcf86cd799439011"
  }'

# Obtener playlists de usuario
curl "http://localhost:3000/api/playlists/user/507f1f77bcf86cd799439011"
```

## 📝 Notas Importantes

1. **IDs de Usuario:** Los ejemplos usan IDs de ejemplo. Después del seeding, usa los IDs reales de la base de datos.

2. **CORS:** El backend está configurado para aceptar peticiones desde cualquier origen (`origin: '*'`). En producción, configura esto apropiadamente.

3. **Validación:** Todos los endpoints incluyen validación de datos. Lee los mensajes de error para debugging.

4. **Paginación:** Para grandes cantidades de datos, considera implementar paginación en las búsquedas.

5. **Rate Limiting:** La API de ReccoBeats puede tener límites de uso. Monitoriza las peticiones.

---

¡Estos ejemplos te ayudarán a empezar a trabajar con la API! 🚀

