# Arquitectura Implementada - Backend

## 🏗️ Diagrama de Arquitectura Completa

```mermaid
graph TB
    subgraph "Frontend React (Puerto 5173)"
        UI[Interfaz de Usuario]
        Sliders[Sliders de Mood]
        Auth[Componente Auth]
        PlaylistView[Vista de Playlists]
    end

    subgraph "Backend Express (Puerto 3000)"
        subgraph "Rutas"
            AuthRoutes["/api/auth/*"]
            UserRoutes["/api/users/*"]
            SongRoutes["/api/songs/*"]
            PlaylistRoutes["/api/playlists/*"]
        end
        
        subgraph "Controladores"
            UserCtrl[userController]
            SongCtrl[songController]
            PlaylistCtrl[playlistController]
        end
        
        subgraph "Modelos Mongoose"
            UserModel[(User)]
            SongModel[(Song)]
            PlaylistModel[(Playlist)]
        end
    end

    subgraph "Servicios Externos"
        ReccoBeats[ReccoBeats API]
        Spotify[Spotify Data]
    end

    subgraph "Base de Datos"
        MongoDB[(MongoDB Atlas)]
    end

    UI --> Auth
    UI --> Sliders
    UI --> PlaylistView
    
    Auth --> AuthRoutes
    Sliders --> ReccoBeats
    ReccoBeats --> Sliders
    Sliders --> SongRoutes
    PlaylistView --> PlaylistRoutes
    
    AuthRoutes --> UserCtrl
    UserRoutes --> UserCtrl
    SongRoutes --> SongCtrl
    PlaylistRoutes --> PlaylistCtrl
    
    UserCtrl --> UserModel
    SongCtrl --> SongModel
    PlaylistCtrl --> PlaylistModel
    PlaylistCtrl --> SongModel
    
    UserModel --> MongoDB
    SongModel --> MongoDB
    PlaylistModel --> MongoDB
    
    ReccoBeats -.->|"Usa datos de"| Spotify
```

## 📊 Flujo de Datos Detallado

### 1. Registro/Login de Usuario

```mermaid
sequenceDiagram
    participant F as Frontend
    participant A as /api/auth
    participant UC as userController
    participant UM as User Model
    participant DB as MongoDB

    F->>A: POST /register {name, email, password}
    A->>UC: register()
    UC->>UC: bcrypt.hash(password, 10)
    UC->>UM: create({name, email, hashedPassword})
    UM->>DB: save()
    DB-->>UM: Usuario guardado
    UM-->>UC: user
    UC-->>UC: user.toPublicJSON()
    UC-->>A: {success: true, data: publicUser}
    A-->>F: Usuario registrado (sin password)
```

### 2. Generación de Playlist

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant R as ReccoBeats
    participant B as Backend
    participant DB as MongoDB

    U->>F: Ajusta sliders (valence, energy, danceability)
    F->>R: GET /recommendations?valence=0.8&energy=0.7...
    R-->>F: Array de tracks de Spotify
    
    Note over F: Procesa tracks de Spotify
    
    F->>B: POST /api/songs/batch {songs: [...]}
    B->>DB: Guarda canciones (upsert)
    DB-->>B: Canciones guardadas
    B-->>F: {success: true, saved: 20}
    
    F->>B: POST /api/playlists {name, tracks: [ids], userId}
    B->>DB: Crea playlist
    DB-->>B: Playlist creada
    B-->>F: {success: true, data: playlist}
    
    F->>U: Muestra playlist generada
```

### 3. Visualización de Playlists del Usuario

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    F->>B: GET /api/playlists/user/:userId
    B->>DB: find({userId})
    DB-->>B: Array de playlists
    B-->>F: {success: true, data: playlists}
    
    Note over F: Usuario selecciona una playlist
    
    F->>B: GET /api/playlists/:id
    B->>DB: findById + populate songs
    DB-->>B: Playlist con canciones completas
    B-->>B: getTotalDuration()
    B-->>F: {success: true, data: {playlist, songs, duration}}
    F->>F: Renderiza playlist con reproductor
```

## 🗂️ Estructura de Datos

### User
```json
{
  "_id": "ObjectId",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "$2b$10$...", // Hasheado
  "created_at": "2025-11-18T10:00:00Z",
  "createdAt": "2025-11-18T10:00:00Z",
  "updatedAt": "2025-11-18T10:00:00Z"
}
```

### Song
```json
{
  "_id": "3n3Ppam7vgaVa1iaRUc9Lp", // ID de Spotify
  "name": "Mr. Brightside",
  "album": "Hot Fuss",
  "album_image_url": "https://i.scdn.co/image/...",
  "artists": ["The Killers"],
  "preview_url": "https://p.scdn.co/mp3-preview/...",
  "duration_ms": 222200,
  "spotify_url": "https://open.spotify.com/track/...",
  "createdAt": "2025-11-18T10:00:00Z",
  "updatedAt": "2025-11-18T10:00:00Z"
}
```

### Playlist
```json
{
  "_id": "ObjectId",
  "name": "Energía Positiva",
  "tracks": ["3n3Ppam7vgaVa1iaRUc9Lp", "0VjIjW4GlUZAMYd2vXMi3b"],
  "userId": "ObjectId",
  "cover_image_url": "https://i.scdn.co/image/...",
  "spotify_url": null,
  "created_at": "2025-11-18T10:00:00Z",
  "createdAt": "2025-11-18T10:00:00Z",
  "updatedAt": "2025-11-18T10:00:00Z"
}
```

## 🔐 Capa de Seguridad

```mermaid
graph LR
    A[Request] --> B{CORS Check}
    B -->|Allowed| C[Express Middleware]
    B -->|Blocked| Z[403 Forbidden]
    C --> D[JSON Parser]
    D --> E{Route Match?}
    E -->|Yes| F[Controller]
    E -->|No| Y[404 Not Found]
    F --> G[Mongoose Validation]
    G -->|Valid| H[bcrypt if needed]
    G -->|Invalid| X[400 Bad Request]
    H --> I[Database Operation]
    I --> J[Response]
    J --> K[toPublicJSON if User]
    K --> L[Success Response]
```

## 📡 Endpoints por Módulo

### Autenticación (2 endpoints)
```
POST /api/auth/register
POST /api/auth/login
```

### Usuarios (5 endpoints)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
PUT    /api/users/:id/change-password
DELETE /api/users/:id
```

### Canciones (7 endpoints)
```
GET    /api/songs
GET    /api/songs/search
GET    /api/songs/:id
POST   /api/songs
POST   /api/songs/batch
POST   /api/songs/by-ids
DELETE /api/songs/:id
```

### Playlists (6 endpoints)
```
GET    /api/playlists/user/:userId
GET    /api/playlists/:id
POST   /api/playlists
PUT    /api/playlists/:id
DELETE /api/playlists/:id
POST   /api/playlists/:id/tracks
```

**Total: 20 endpoints REST**

## 🔄 Relaciones entre Modelos

```mermaid
erDiagram
    User ||--o{ Playlist : "crea"
    Playlist ||--o{ Song : "contiene"
    
    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        date created_at
    }
    
    Playlist {
        ObjectId _id PK
        string name
        array tracks FK
        ObjectId userId FK
        string cover_image_url
        date created_at
    }
    
    Song {
        string _id PK "ID Spotify"
        string name
        string album
        string album_image_url
        array artists
        string preview_url
        number duration_ms
        string spotify_url
    }
```

## 🚀 Stack Tecnológico Implementado

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.21.2
- **Base de Datos:** MongoDB con Mongoose 8.20.0
- **Seguridad:** bcrypt 6.0.0
- **CORS:** cors 2.8.5
- **Logging:** morgan 1.10.1
- **Variables de Entorno:** dotenv 17.2.3

### Desarrollo
- **Hot Reload:** nodemon 3.1.11
- **Testing:** (Pendiente - Jest, Maestro)

### Despliegue (Preparado)
- **Backend:** Render / Heroku
- **Database:** MongoDB Atlas
- **Frontend:** Vercel

## 📈 Métricas del Sistema

| Métrica | Valor |
|---------|-------|
| Modelos | 3 |
| Controladores | 3 |
| Funciones de controlador | 18 |
| Rutas | 3 archivos |
| Endpoints REST | 20 |
| Validaciones Mongoose | 15+ |
| Índices de base de datos | 8 |
| Métodos de modelo | 10+ |
| Líneas de código | ~1500 |
| Archivos de documentación | 7 |

---

**Última actualización:** 2025-11-18  
**Estado:** ✅ Producción Ready para MVP

