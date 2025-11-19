# Base de Datos y API — Documentación Consolidada

Este documento recoge la definición actual del backend, su arquitectura, la estructura de la base de datos (MongoDB con Mongoose), validaciones y ejemplos concretos de uso. Se han eliminado referencias a correcciones pendientes o mejoras futuras; aquí solo figura lo que define el backend tal y como está implementado.

---

## Resumen rápido

- Stack: Node.js + Express + MongoDB (Mongoose)
- Modelos: User, Song, Playlist
- Autenticación y seguridad de contraseñas: bcrypt (hash automático al registrar)
- Endpoints REST organizados por módulo: /api/auth, /api/users, /api/songs, /api/playlists
- Scripts útiles: `npm start`, `npm run dev`, `npm run seed`

---

## Arquitectura (alto nivel)

```mermaid
graph TB
    subgraph Frontend React
        UI[Interfaz de Usuario]
    end

    subgraph Backend Express
        AuthRoutes[/api/auth/*]
        UserRoutes[/api/users/*]
        SongRoutes[/api/songs/*]
        PlaylistRoutes[/api/playlists/*]

        UserCtrl[userController]
        SongCtrl[songController]
        PlaylistCtrl[playlistController]

        UserModel[(User)]
        SongModel[(Song)]
        PlaylistModel[(Playlist)]
    end

    subgraph Servicios Externos
        ReccoBeats[ReccoBeats API]
        Spotify[Spotify Data]
    end

    subgraph BaseDatos
        MongoDB[(MongoDB Atlas/Local)]
    end

    UI -->|llama| AuthRoutes
    UI -->|llama| SongRoutes
    UI -->|llama| PlaylistRoutes
    UI -->|consulta recomendaciones| ReccoBeats

    AuthRoutes --> UserCtrl
    UserRoutes --> UserCtrl
    SongRoutes --> SongCtrl
    PlaylistRoutes --> PlaylistCtrl

    UserCtrl --> UserModel
    SongCtrl --> SongModel
    PlaylistCtrl --> PlaylistModel

    UserModel --> MongoDB
    SongModel --> MongoDB
    PlaylistModel --> MongoDB
```

---

## Estructura de datos (modelos)

### User

Campos principales:
- `_id`: ObjectId
- `name`: String, requerido, trim, longitud entre 2 y 100
- `email`: String, requerido, único, lowercase, formato validado por regex
- `password`: String, requerido, mínimo 6 caracteres (almacenado hasheado)
- `created_at`: Date (predefinido)
- `createdAt`, `updatedAt`: timestamps (automáticos)

Validaciones y comportamiento:
- Índice único en `email` para evitar duplicados
- `toPublicJSON()` — método de instancia que devuelve el usuario sin el campo `password`
- Virtual `playlists` para popular playlists del usuario

Ejemplo (JSON):
```json
{
  "_id": "ObjectId",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "created_at": "2025-11-18T10:00:00Z"
}
```

---

### Song

Campos principales:
- `_id`: String (ID de Spotify)
- `name`: String, requerido
- `album`: String
- `album_image_url`: String (URL)
- `artists`: [String] (no vacío)
- `preview_url`: String (URL opcional)
- `duration_ms`: Number (positiva)
- `spotify_url`: String (URL)
- `createdAt`, `updatedAt`: timestamps

Validaciones y comportamiento:
- `_id` se utiliza como clave primaria (evita duplicados por ID de Spotify)
- Método estático `fromSpotifyTrack(spotifyTrack)` para convertir la respuesta de la API de Spotify a la forma del modelo
- Método de instancia `getFormattedDuration()` para obtener la duración en mm:ss
- Índices en `name`, `artists` y `album` para optimizar búsquedas

Ejemplo (JSON):
```json
{
  "_id": "3n3Ppam7vgaVa1iaRUc9Lp",
  "name": "Mr. Brightside",
  "album": "Hot Fuss",
  "artists": ["The Killers"],
  "duration_ms": 222200
}
```

---

### Playlist

Campos principales:
- `_id`: ObjectId
- `name`: String, requerido
- `tracks`: [String] — array de IDs de canciones (IDs de `Song._id`)
- `userId`: ObjectId — referencia a `User`
- `cover_image_url`: String (URL opcional)
- `spotify_url`: String (opcional)
- `created_at`: Date
- `createdAt`, `updatedAt`: timestamps

Validaciones y comportamiento:
- Validación de arrays (no nulos) y de URLs cuando correspondan
- Métodos útiles en instancias:
  - `getTotalDuration()` — calcula la duración total combinando `duration_ms` de las canciones y devuelve un string formateado
  - `getTrackCount()` — devuelve el número de tracks
  - `getCoverImage()` — obtiene la URL de portada si existe
- Índices en `userId`, `created_at` y `name`

Ejemplo (JSON):
```json
{
  "_id": "ObjectId",
  "name": "Energía Positiva",
  "tracks": ["3n3Ppam7vgaVa1iaRUc9Lp", "0VjIjW4GlUZAMYd2vXMi3b"],
  "userId": "ObjectId",
  "cover_image_url": "https://..."
}
```

---

## Relaciones entre modelos

- User 1 — N Playlist (un usuario crea muchas playlists)
- Playlist N — N Song (una playlist contiene múltiples canciones identificadas por su ID de Spotify)

En Mongoose se modela `userId` como referencia a `User` y `tracks` como array de strings que corresponderán a `Song._id`.

---

## Endpoints principales (implementación actual)

Autenticación (`/api/auth`):
- POST /api/auth/register — registrar usuario
- POST /api/auth/login — login de usuario

Usuarios (`/api/users`):
- GET /api/users — listar (paginado)
- GET /api/users/:id — obtener perfil
- PUT /api/users/:id — actualizar perfil
- PUT /api/users/:id/change-password — cambiar contraseña
- DELETE /api/users/:id — eliminar usuario

Canciones (`/api/songs`):
- GET /api/songs — listar canciones (paginado)
- GET /api/songs/search — búsqueda por name/artist/album
- GET /api/songs/:id — obtener canción por ID
- POST /api/songs — crear canción
- POST /api/songs/batch — crear/actualizar múltiples canciones (upsert)
- POST /api/songs/by-ids — obtener varias canciones por IDs
- DELETE /api/songs/:id — eliminar canción

Playlists (`/api/playlists`):
- GET /api/playlists/user/:userId — playlists de un usuario
- GET /api/playlists/:id — detalles de playlist (con canciones pobladas)
- POST /api/playlists — crear playlist
- PUT /api/playlists/:id — actualizar playlist
- DELETE /api/playlists/:id — eliminar playlist
- POST /api/playlists/:id/tracks — añadir tracks a una playlist

Total aproximado: 20 endpoints REST organizados por módulo.

---

## Validaciones y reglas aplicadas

- Campos requeridos marcados en los esquemas de Mongoose
- Emails validados con regex y con índice único
- Passwords: mínimo 6 caracteres; se almacenan hasheados con bcrypt al registrarse
- URLs comprobadas en los campos que las usan (album_image_url, spotify_url, cover_image_url)
- Arrays (p. ej. `artists`, `tracks`) validados para evitar valores vacíos
- Reglas de negocio implementadas en controladores: evitar duplicados al añadir tracks, upsert en batch de canciones, manejo de errores con códigos HTTP adecuados

---

## Scripts relevantes (package.json)

- `npm start` — iniciar servidor en modo producción
- `npm run dev` — iniciar en modo desarrollo (con nodemon)
- `npm run seed` — poblar la base de datos con datos de ejemplo (usuarios, canciones, playlists)

Nota: el proyecto incluye `backend/.env.example` para variables de entorno. Asegúrate de usar un `.env` local que no se suba al repositorio.

---

## Uso básico — ejemplos rápidos

1) Registrar usuario

POST /api/auth/register

Body JSON:
```json
{ "name": "Usuario Demo", "email": "demo@example.com", "password": "demo123" }
```

Respuesta: objeto público del usuario (sin password).


2) Login

POST /api/auth/login

Body JSON:
```json
{ "email": "demo@example.com", "password": "demo123" }
```

Respuesta: datos del usuario autenticado (sin password).


3) Guardar canciones obtenidas desde una API externa (frontend obtiene tracks y los envía)

POST /api/songs/batch

Body JSON:
```json
{
  "songs": [
    {
      "_id": "3n3Ppam7vgaVa1iaRUc9Lp",
      "name": "Mr. Brightside",
      "album": "Hot Fuss",
      "album_image_url": "https://...",
      "artists": ["The Killers"],
      "preview_url": null,
      "duration_ms": 222200,
      "spotify_url": "https://open.spotify.com/track/..."
    }
  ]
}
```

Respuesta: resumen de operaciones guardadas (saved/updated count).


4) Crear playlist

POST /api/playlists

Body JSON:
```json
{
  "name": "Mi Playlist",
  "tracks": ["3n3Ppam7vgaVa1iaRUc9Lp"],
  "userId": "507f1f77bcf86cd799439011",
  "cover_image_url": "https://..."
}
```

Respuesta: objeto `Playlist` creado.

---

## Métodos y utilidades implementadas en el backend

- `User.toPublicJSON()` — devolver datos del usuario sin contraseña
- `Song.fromSpotifyTrack(spotifyTrack)` — mapeo de respuestas de Spotify a modelo Song
- `Song.getFormattedDuration()` — formatear duration_ms a `mm:ss`
- `Playlist.getTotalDuration()` — calcular la duración total de la playlist
- `Playlist.findByUserId(userId)` — método estático para recuperar playlists de un usuario
- Helpers en `utils/spotifyHelper.js`: validación de tracks, extracción de IDs, selección de imágenes, formateo de duración

---

## Seeding

El script `npm run seed` limpia la colección correspondiente y crea datos de ejemplo: varios usuarios de prueba, canciones y playlists. El seeding se realiza con contraseñas hasheadas cuando corresponda.

---

## Observaciones finales

Este documento refleja el estado actual del backend y de la definición de la base de datos: modelos, validaciones, endpoints y comportamientos implementados. Para integración con el frontend, use los endpoints listados y el `.env.example` como plantilla de variables de entorno.

---

**Última actualización:** documento consolidado desde la documentación de `backend/docs/base-de-datos`
