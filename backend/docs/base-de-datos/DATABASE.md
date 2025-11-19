# Base de Datos MongoDB - Mood Playlist App

## 📋 Estructura de la Base de Datos

Este proyecto utiliza MongoDB con Mongoose para gestionar tres colecciones principales:

### 1. **Users (Usuarios)**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (único),
  password: String,
  created_at: Date
}
```

### 2. **Songs (Canciones)**
```javascript
{
  _id: String (ID de Spotify),
  name: String,
  album: String,
  album_image_url: String,
  artists: [String],
  preview_url: String,
  duration_ms: Number,
  spotify_url: String
}
```

### 3. **Playlists**
```javascript
{
  _id: ObjectId,
  name: String,
  tracks: [String] (IDs de canciones),
  spotify_url: String,
  userId: ObjectId (referencia a User),
  created_at: Date,
  cover_image_url: String
}
```

## 🚀 Configuración Inicial

### 1. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tu URI de MongoDB:

```bash
# Para MongoDB local
MONGODB_URI=mongodb://localhost:27017/mood-playlist-app

# Para MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mood-playlist-app?retryWrites=true&w=majority
```

### 2. Instalar MongoDB (si usas local)

**Windows:**
- Descarga MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
- Instala y asegúrate de que el servicio esté corriendo

**Verificar instalación:**
```bash
mongod --version
```

### 3. Poblar la base de datos con datos iniciales

Ejecuta el script de seeding:

```bash
npm run seed
```

Este comando creará:
- ✅ 3 usuarios de prueba
- ✅ 8 canciones de ejemplo
- ✅ 4 playlists de ejemplo

## 📝 Scripts Disponibles

```bash
# Iniciar el servidor
npm start

# Desarrollo con recarga automática
npm run dev

# Poblar la base de datos
npm run seed
```

## 🔧 Uso de los Modelos

### Importar modelos

```javascript
const { User, Playlist, Song } = require('./models');
```

### Ejemplos de uso

#### Crear un usuario
```javascript
const newUser = await User.create({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'password123'
});
```

#### Crear una canción desde Spotify
```javascript
const spotifyTrack = { /* datos de Spotify API */ };
const songData = Song.fromSpotifyTrack(spotifyTrack);
const song = await Song.create(songData);
```

#### Crear una playlist
```javascript
const playlist = await Playlist.create({
  name: 'Mi Playlist',
  tracks: ['spotify_id_1', 'spotify_id_2'],
  userId: user._id,
  cover_image_url: 'https://...'
});
```

#### Buscar playlists de un usuario
```javascript
const playlists = await Playlist.findByUserId(userId);
```

#### Obtener duración total de una playlist
```javascript
const duration = await playlist.getTotalDuration();
console.log(duration); // "15m 30s"
```

## 🔍 Métodos Útiles

### Song
- `song.getFormattedDuration()` - Devuelve la duración en formato "mm:ss"
- `Song.fromSpotifyTrack(spotifyTrack)` - Crea objeto desde respuesta de Spotify

### Playlist
- `playlist.getTotalDuration()` - Duración total formateada
- `playlist.getTrackCount()` - Número de canciones
- `playlist.getCoverImage()` - URL de la portada
- `Playlist.findByUserId(userId)` - Playlists de un usuario

### User
- `user.toPublicJSON()` - Devuelve datos sin password

## 🔗 Índices y Optimizaciones

Los modelos incluyen índices para optimizar búsquedas:

- **Users:** índice único en `email`
- **Songs:** índices en `name`, `artists`, `album`
- **Playlists:** índices en `userId`, `created_at`, `name`

## 📊 Validaciones

Todos los modelos incluyen validaciones automáticas:
- ✅ Campos requeridos
- ✅ Formatos de email y URLs
- ✅ Longitudes mínimas/máximas
- ✅ Arrays no vacíos

## 🔐 Seguridad

⚠️ **Importante:** Los passwords en el script de seeding NO están hasheados. En producción, debes:

1. Instalar bcrypt: `npm install bcrypt`
2. Hashear passwords antes de guardar:

```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

## 🐛 Troubleshooting

### Error: "MongooseServerSelectionError"
- Verifica que MongoDB esté corriendo
- Comprueba la URI en `.env`
- Si usas Atlas, verifica las credenciales y whitelist de IPs

### Error: "E11000 duplicate key error"
- Estás intentando crear un documento con un campo único duplicado (email o _id)
- Ejecuta `npm run seed` de nuevo para limpiar la base de datos

### Conexión lenta
- Si usas MongoDB local, asegúrate de tener buena conectividad
- Para Atlas, verifica tu conexión a internet

## 📚 Recursos Adicionales

- [Documentación de Mongoose](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [ReccoBeats API](https://reccobeats.com/docs/apis/get-recommendation)


