# PlayTheMood - Backend API

API REST para la gestión de playlists musicales basadas en el estado de ánimo del usuario, construida con Node.js, Express y MongoDB.

---

## Descripción

PlayTheMood Backend es una API RESTful que proporciona servicios de autenticación de usuarios, gestión de canciones de Spotify y creación de playlists personalizadas. El sistema está diseñado para integrarse con el frontend React y la API de Spotify.

---

## Arquitectura

```
┌─────────────────────────────────────────┐
│           Frontend (React)              │
│         Puerto 5173                     │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
                 ▼
┌─────────────────────────────────────────┐
│        Backend API (Express)            │
│         Puerto 3000                     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Capa de Controladores          │    │
│  │  - userController               │    │
│  │  - songController               │    │
│  │  - playlistController           │    │
│  └──────────────┬──────────────────┘    │
│                 │                       │
│  ┌──────────────▼──────────────────┐    │
│  │  Capa de Servicios              │    │
│  │  - userService                  │    │
│  │  - songService                  │    │
│  │  - playlistService              │    │
│  └──────────────┬──────────────────┘    │
│                 │                       │
│  ┌──────────────▼──────────────────┐    │
│  │  Capa de DTOs                   │    │
│  │  - UserDTO                      │    │
│  │  - SongDTO                      │    │
│  │  - PlaylistDTO                  │    │
│  └──────────────┬──────────────────┘    │
│                 │                       │
│  ┌──────────────▼──────────────────┐    │
│  │  Modelos (Mongoose)             │    │
│  │  - User                         │    │
│  │  - Song                         │    │
│  │  - Playlist                     │    │
│  └─────────────────────────────────┘    │
└────────────────┬────────────────────────┘
                 │ Mongoose ODM
                 ▼
┌─────────────────────────────────────────┐
│          MongoDB                        │
│    Puerto 27017 / MongoDB Atlas         │
└─────────────────────────────────────────┘
```

---

## Tecnologías Utilizadas

### Core
- **Node.js** v18+ - Runtime de JavaScript
- **Express** v4.21+ - Framework web
- **MongoDB** v7+ - Base de datos NoSQL
- **Mongoose** v8.20+ - ODM para MongoDB

### Seguridad
- **bcrypt** v6.0+ - Hash de contraseñas
- **jsonwebtoken** v9.0+ - Autenticación JWT
- **cors** v2.8+ - Cross-Origin Resource Sharing

### Desarrollo
- **nodemon** v3.1+ - Hot reload en desarrollo
- **dotenv** v17.2+ - Gestión de variables de entorno
- **newman** v6.2+ - Testing automatizado de API

---

## Funcionalidades Principales

### Autenticación y Usuarios
- **Registro de usuarios** con validación de datos
- **Login seguro** con JWT tokens (duración: 7 días)
- **Gestión de perfiles** (ver, actualizar, eliminar)
- **Cambio de contraseña** con verificación
- **Protección de rutas** mediante middleware JWT
- Contraseñas hasheadas con bcrypt (salt rounds: 10)

<<<<<<< HEAD
### 🎵 Gestión de Canciones
=======
### Gestión de Canciones
>>>>>>> dev
- **Almacenamiento de tracks** de Spotify en MongoDB
- **Guardado batch** de múltiples canciones (optimizado)
- **Búsqueda avanzada** por nombre, artista o álbum
- **Paginación** configurable de resultados
- **Prevención de duplicados** mediante ID de Spotify
- Transformación automática desde formato Spotify API

### Gestión de Playlists
- **Creación de playlists** asociadas a usuarios
- **Añadir/eliminar canciones** de forma dinámica
- **Obtener detalles completos** con información de canciones
- **Prevención de duplicados** en tracks
- **Cálculo automático** de duración total
- **Búsqueda** por nombre de playlist

---

## API Endpoints

### Autenticación
```http
POST   /api/auth/register       # Registrar nuevo usuario
POST   /api/auth/login          # Login y obtener token JWT
```

### Usuarios (Protegidas con JWT)
```http
GET    /api/users/:id                    # Obtener perfil de usuario
PUT    /api/users/:id                    # Actualizar perfil
DELETE /api/users/:id                    # Eliminar cuenta
PUT    /api/users/:id/change-password    # Cambiar contraseña
```

### Canciones
```http
GET    /api/songs                   # Listar canciones (con paginación)
GET    /api/songs/search            # Buscar canciones
GET    /api/songs/:id               # Obtener canción por ID
POST   /api/songs                   # Guardar canción (requiere JWT)
POST   /api/songs/batch             # Guardar múltiples canciones (requiere JWT)
POST   /api/songs/by-ids            # Obtener múltiples por IDs
DELETE /api/songs/:id               # Eliminar canción (requiere JWT)
```

### Playlists (Protegidas con JWT)
```http
GET    /api/playlists/user/:userId      # Obtener playlists de usuario
GET    /api/playlists/:id                # Obtener detalles de playlist
POST   /api/playlists                    # Crear nueva playlist
PUT    /api/playlists/:id                # Actualizar playlist
DELETE /api/playlists/:id                # Eliminar playlist
POST   /api/playlists/:id/tracks         # Añadir canciones a playlist
```

---

## Modelos de Datos

### User (Usuario)
```javascript
{
  name: String,           // Nombre del usuario
  email: String,          // Email único (índice)
  password: String,       // Contraseña hasheada
  createdAt: Date,        // Fecha de registro
  updatedAt: Date         // Última actualización
}
```

### Song (Canción)
```javascript
{
  _id: String,            // ID de Spotify (único)
  name: String,           // Nombre de la canción
  album: String,          // Nombre del álbum
  albumImageUrl: String,  // URL de portada
  artists: [String],      // Array de artistas
  previewUrl: String,     // URL de preview (30s)
  durationMs: Number,     // Duración en milisegundos
  spotifyUrl: String,     // URL de Spotify
  createdAt: Date,        // Fecha de creación
  updatedAt: Date         // Última actualización
}
```

### Playlist
```javascript
{
  name: String,           // Nombre de la playlist
  tracks: [ObjectId],     // Referencias a canciones (Song._id)
  userId: ObjectId,       // Referencia al usuario (User._id)
  coverImageUrl: String,  // URL de portada
  spotifyUrl: String,     // URL de Spotify (opcional)
  createdAt: Date,        // Fecha de creación
  updatedAt: Date         // Última actualización
}
```

---

## Seguridad

### Autenticación JWT
- Tokens generados automáticamente en login/register
- Duración: 7 días (configurable)
- Verificación en rutas protegidas mediante middleware
- Payload: `{ id, email, iat, exp }`

### Protección de Contraseñas
- Hash con bcrypt (factor 10)
- Nunca se exponen en respuestas JSON
- Verificación segura en login

### Validaciones
- Datos de entrada validados en DTOs
- Email único verificado en registro
- Ownership verificado en operaciones de usuario
- Prevención de duplicados en playlists

### CORS
- Configurado para desarrollo (`origin: '*'`)
- Métodos permitidos: GET, POST, PUT, DELETE, PATCH
- Listo para configuración específica en producción

---

## Instalación y Configuración

### Requisitos Previos
- Node.js v18 o superior
- MongoDB v7 o superior (local o Atlas)
- npm v9 o superior

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/arodovi852/ProyectoIntermodularGrupal.git
cd ProyectoIntermodularGrupal/backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### Configuración (.env)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mood-playlist-app

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRES_IN=7d

# Spotify (opcional)
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
```

### Ejecución

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start

# Poblar base de datos con datos de ejemplo
npm run seed
```

El servidor estará disponible en: **http://localhost:3000**

---

## Testing

El proyecto incluye una suite completa de tests automatizados con Newman (CLI de Postman).

### Ejecutar Tests

```bash
# Tests básicos (12 tests, 26 assertions)
npm test

# Tests completos (26 tests, 49 assertions)
npm run test:complete

# Tests con detalles
npm run test:verbose

# Generar reporte HTML
npm run test:html

# Tests completos con reporte HTML
npm run test:html:complete
```

### Cobertura de Tests
- ✅ Autenticación (registro, login, validaciones)
- ✅ Gestión de usuarios (CRUD, cambio de contraseña, permisos)
- ✅ Gestión de canciones (CRUD, búsqueda, paginación, batch)
- ✅ Gestión de playlists (CRUD, añadir/eliminar tracks)
- ✅ Seguridad JWT (tokens, ownership, errores 401/403)
- ✅ Validaciones de datos (campos requeridos, formatos)
- ✅ Manejo de errores (400, 401, 403, 404, 500)

### Resultados de Tests
```
26 peticiones ejecutadas
49 assertions pasadas
0 errores
~73ms tiempo promedio de respuesta
```

---

## Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/          # Controladores (coordinan request/response)
│   │   ├── userController.js
│   │   ├── songController.js
│   │   └── playlistController.js
│   ├── services/             # Lógica de negocio
│   │   ├── userService.js
│   │   ├── songService.js
│   │   └── playlistService.js
│   ├── dto/                  # Data Transfer Objects (transformación)
│   │   ├── UserDTO.js
│   │   ├── SongDTO.js
│   │   └── PlaylistDTO.js
│   ├── models/               # Modelos Mongoose
│   │   ├── User.js
│   │   ├── Song.js
│   │   └── Playlist.js
│   ├── routes/               # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── songRoutes.js
│   │   └── playlistRoutes.js
│   ├── middleware/           # Middleware personalizado
│   │   └── authMiddleware.js
│   ├── utils/                # Utilidades
│   │   ├── jwtHelper.js
│   │   └── spotifyHelper.js
│   ├── config/               # Configuración
│   │   ├── database.js
│   │   └── seed.js
│   ├── app.js                # Configuración de Express
│   └── index.js              # Punto de entrada
├── tests/                    # Tests automatizados
│   ├── postman/
│   │   ├── PlayTheMood.postman_collection.json
│   │   └── PlayTheMood_Complete.postman_collection.json
│   └── reports/              # Reportes HTML generados
├── docs/                     # Documentación
│   ├── ARQUITECTURA_SERVICIOS_DTOS.md
│   ├── GUIA_FRONTEND_API.md
│   ├── AUTENTICACION_JWT.md
│   ├── TESTING_NEWMAN.md
│   └── REPORTES_HTML_GUIA.md
├── .env.example              # Variables de entorno de ejemplo
├── .gitignore
├── package.json
└── README.md
```

---

## Documentación Adicional

- **[GUIA_FRONTEND_API.md](docs/GUIA_FRONTEND_API.md)** - Guía completa de la API para integración frontend
<<<<<<< HEAD
- **[ARQUITECTURA_SERVICIOS_DTOS.md](docs/ARQUITECTURA_SERVICIOS_DTOS.md)** - Arquitectura detallada del backend
- **[AUTENTICACION_JWT.md](docs/AUTENTICACION_JWT.md)** - Documentación del sistema de autenticación
- **[TESTING_NEWMAN.md](docs/TESTING_NEWMAN.md)** - Guía de testing automatizado
- **[REPORTES_HTML_GUIA.md](docs/REPORTES_HTML_GUIA.md)** - Generación de reportes HTML
=======
- **[AUTENTICACION_JWT.md](docs/autentificacion/AUTENTICACION_JWT.md)** - Documentación del sistema de autenticación
- **[REPORTES_HTML_GUIA.md](docs/testing/REPORTES_HTML_GUIA.md)** - Generación de reportes HTML
>>>>>>> dev

---

## Flujo de Datos Típico

### 1. Usuario se Registra
```
Frontend → POST /api/auth/register → Backend hashea password → 
MongoDB guarda usuario → Backend devuelve {user, token}
```

### 2. Usuario hace Login
```
Frontend → POST /api/auth/login → Backend verifica password → 
Backend genera JWT → Frontend guarda token
```

### 3. Usuario busca música en Spotify (desde Frontend)
```
Frontend → Spotify API → Obtiene tracks
```

### 4. Usuario guarda canciones en Backend
```
Frontend → POST /api/songs/batch + token JWT → 
Backend valida token → Backend guarda en MongoDB → 
Backend devuelve canciones guardadas
```

### 5. Usuario crea Playlist
```
Frontend → POST /api/playlists + token JWT → 
Backend valida token → Backend crea playlist con tracks → 
MongoDB guarda playlist → Backend devuelve playlist creada
```

### 6. Usuario ve sus Playlists
```
Frontend → GET /api/playlists/user/:userId + token JWT → 
Backend valida token → MongoDB busca playlists → 
Backend devuelve lista de playlists con detalles
```

---

### Equipo de Desarrollo

César, Alberto, Fran.

### Convenciones de Código
- ESLint configurado
- Commits descriptivos
- Documentación actualizada
- Tests para nuevas funcionalidades

---

## Licencia

Este proyecto es parte de un proyecto académico y no tiene licencia pública.

---

## Soporte

Para dudas o problemas:
- **Repositorio:** https://github.com/arodovi852/ProyectoIntermodularGrupal
- **Documentación:** Carpeta `/backend/docs/`
- **Tests:** `npm test` para verificar funcionalidad

---

<<<<<<< HEAD
## 🎯 Estado del Proyecto
=======
## Estado del Proyecto
>>>>>>> dev

**Estado:** En desarrollo
**Última actualización:** 19/11/2025

### Métricas
- 3 modelos de datos
- 3 servicios de negocio
- 3 DTOs para transformación
- 20 endpoints REST
- 49 tests automatizados (100% pasando)
- ~73ms tiempo promedio de respuesta
- Cobertura de requisitos: 100%

---

**PlayTheMood Backend - API REST para gestión de playlists musicales** 🎵

