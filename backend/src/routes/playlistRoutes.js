/**
 * Rutas de Gestión de Playlists.
 *
 * Proporciona endpoints para crear, actualizar, eliminar y gestionar playlists.
 * TODAS las rutas en este módulo requieren autenticación JWT válida.
 *
 * Flujo típico:
 * 1. Usuario se registra/autentica
 * 2. Crea una nueva playlist (POST /playlists/)
 * 3. Configura parámetros de Spotify Recommendations
 * 4. Añade canciones a la playlist (POST /playlists/:id/tracks)
 * 5. Ve detalles de la playlist (GET /playlists/:id)
 * 6. Actualiza la playlist (PUT /playlists/:id)
 * 7. Elimina la playlist (DELETE /playlists/:id)
 *
 * Headers requeridos en TODAS las rutas:
 * ```
 * Authorization: Bearer <JWT_TOKEN>
 * ```
 *
 * @module routes/playlistRoutes
 * @requires express
 * @requires ../controllers/playlistController
 * @requires ../middleware/authMiddleware
 */

const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * GET /playlists/user/:userId
 *
 * Obtiene la lista completa de playlists de un usuario específico.
 *
 * Las playlists se ordenan de más reciente a más antigua.
 * Solo el usuario autenticado puede ver sus propias playlists.
 *
 * Respuestas:
 * - **200**: Array de playlists del usuario.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Intento de ver playlists de otro usuario (opcional, según implementación).
 * - **500**: Error del servidor.
 *
 * @route GET /playlists/user/:userId
 * @access Private (Autenticado)
 * @param {string} userId - ID del usuario propietario de las playlists.
 * @param {number} [page=1] - Número de página (opcional).
 * @param {number} [limit=20] - Playlists por página (opcional).
 * @returns {Object[]} Array de playlists con metadatos básicos.
 *
 * @example
 * GET /api/playlists/user/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "playlists": [
 *     {
 *       "id": "...",
 *       "name": "Summer Vibes",
 *       "trackCount": 25,
 *       "coverImageUrl": "https://...",
 *       "createdAt": "2024-01-15T10:30:00Z"
 *     }
 *   ],
 *   "total": 1
 * }
 */
// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /playlists/user/:userId
 *
 * Obtiene la lista completa de playlists de un usuario específico.
 *
 * Las playlists se ordenan de más reciente a más antigua.
 * Solo el usuario autenticado puede ver sus propias playlists.
 *
 * Respuestas:
 * - **200**: Array de playlists del usuario.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Intento de ver playlists de otro usuario (opcional, según implementación).
 * - **500**: Error del servidor.
 *
 * @route GET /playlists/user/:userId
 * @access Private (Autenticado)
 * @param {string} userId - ID del usuario propietario de las playlists.
 * @param {number} [page=1] - Número de página (opcional).
 * @param {number} [limit=20] - Playlists por página (opcional).
 * @returns {Object[]} Array de playlists con metadatos básicos.
 *
 * @example
 * GET /api/playlists/user/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "playlists": [
 *     {
 *       "id": "...",
 *       "name": "Summer Vibes",
 *       "trackCount": 25,
 *       "coverImageUrl": "https://...",
 *       "createdAt": "2024-01-15T10:30:00Z"
 *     }
 *   ],
 *   "total": 1
 * }
 */
// Obtener todas las playlists de un usuario
router.get('/user/:userId', playlistController.getUserPlaylists);

/**
 * POST /playlists/
 *
 * Crea una nueva playlist vacía con configuración de recomendaciones.
 *
 * Body esperado:
 * ```json
 * {
 *   "name": "Mi Nueva Playlist",
 *   "config": {
 *     "size": 30,
 *     "seeds": ["track1", "artist2", "genre3"],
 *     "negativeSeeds": [],
 *     "energy": 0.7,
 *     "danceability": 0.8,
 *     "acousticness": null
 *   }
 * }
 * ```
 *
 * Campos de `config`:
 * - `size`: Número de tracks a generar (1-100, requerido).
 * - `seeds`: 1-5 semillas (tracks, artistas o géneros).
 * - `negativeSeeds`: 0-5 semillas a excluir (opcional).
 * - Parámetros de audio (0-1, todos opcionales): acousticness, danceability, energy, etc.
 *
 * Respuestas:
 * - **201**: Playlist creada exitosamente.
 * - **400**: Configuración inválida (semillas, tamaño, etc.).
 * - **401**: Token no proporcionado o inválido.
 * - **500**: Error del servidor.
 *
 * @route POST /playlists/
 * @access Private (Autenticado)
 * @param {string} name - Nombre de la playlist (1-200 caracteres).
 * @param {Object} config - Configuración de recomendaciones.
 * @param {number} config.size - Cantidad de tracks (1-100).
 * @param {string[]} config.seeds - Semillas de recomendación (1-5).
 * @param {string[]} [config.negativeSeeds] - Semillas negativas (0-5).
 * @param {number} [config.acousticness] - Acústica (0-1).
 * @param {number} [config.danceability] - Bailabilidad (0-1).
 * @param {number} [config.energy] - Energía (0-1).
 * @returns {Object} Playlist creada con ID.
 *
 * @example
 * POST /api/playlists/
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * Content-Type: application/json
 *
 * {
 *   "name": "Party Night",
 *   "config": {
 *     "size": 50,
 *     "seeds": ["track123", "artist456"],
 *     "energy": 0.9,
 *     "danceability": 0.95
 *   }
 * }
 *
 * Response 201:
 * {
 *   "success": true,
 *   "playlist": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "name": "Party Night",
 *     "trackCount": 0,
 *     "config": { ... }
 *   }
 * }
 */
// Crear una nueva playlist
router.post('/', playlistController.createPlaylist);

/**
 * GET /playlists/:id
 *
 * Obtiene los detalles completos de una playlist incluyendo todas sus canciones.
 *
 * Información incluida:
 * - Metadatos de la playlist (nombre, fecha, portada).
 * - Array de canciones completo con detalles.
 * - Duración total y estadísticas.
 * - Configuración de recomendaciones.
 *
 * Respuestas:
 * - **200**: Datos completos de la playlist.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Usuario intenta ver playlist de otro (según implementación).
 * - **404**: Playlist no encontrada.
 * - **500**: Error del servidor.
 *
 * @route GET /playlists/:id
 * @access Private (Autenticado)
 * @param {string} id - ID de la playlist.
 * @returns {Object} Objeto playlist con todas sus canciones y metadatos.
 *
 * @example
 * GET /api/playlists/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "playlist": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "name": "Summer Vibes",
 *     "trackCount": 25,
 *     "totalDuration": "1h 45m 30s",
 *     "songs": [
 *       {
 *         "id": "spotify123",
 *         "name": "Song Name",
 *         "album": "Album",
 *         "artists": ["Artist"],
 *         "duration": "3:45"
 *       }
 *     ],
 *     "config": { ... }
 *   }
 * }
 */
// Obtener detalles de una playlist con sus canciones
router.get('/:id', playlistController.getPlaylistDetails);

/**
 * PUT /playlists/:id
 *
 * Actualiza los datos de una playlist.
 *
 * Campos actualizables:
 * - `name`: Nuevo nombre de la playlist.
 * - `cover_image_url`: URL de portada personalizada.
 * - `config`: Configuración de recomendaciones.
 * - `spotify_url`: URL compartible de Spotify.
 *
 * Body esperado:
 * ```json
 * {
 *   "name": "New Playlist Name",
 *   "cover_image_url": "https://...",
 *   "config": { ... }
 * }
 * ```
 *
 * Respuestas:
 * - **200**: Playlist actualizada exitosamente.
 * - **400**: Datos inválidos.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Usuario intenta actualizar playlist ajena.
 * - **404**: Playlist no encontrada.
 * - **500**: Error del servidor.
 *
 * @route PUT /playlists/:id
 * @access Private (Solo propietario)
 * @param {string} id - ID de la playlist.
 * @param {string} [name] - Nuevo nombre.
 * @param {string} [cover_image_url] - Nueva URL de portada.
 * @param {Object} [config] - Nueva configuración.
 * @returns {Object} Playlist actualizada.
 *
 * @example
 * PUT /api/playlists/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * Content-Type: application/json
 *
 * {
 *   "name": "Chill Vibes Updated",
 *   "cover_image_url": "https://new-image-url.com/image.jpg"
 * }
 *
 * Response 200:
 * {
 *   "success": true,
 *   "playlist": { "id": "...", "name": "Chill Vibes Updated", ... }
 * }
 */
// Actualizar una playlist
router.put('/:id', playlistController.updatePlaylist);

/**
 * DELETE /playlists/:id
 *
 * Elimina permanentemente una playlist.
 *
 * Importante:
 * - La eliminación es PERMANENTE.
 * - Se elimina la playlist pero NO las canciones de la BD.
 * - No se puede deshacer la operación.
 *
 * Respuestas:
 * - **200**: Playlist eliminada exitosamente.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Usuario intenta eliminar playlist ajena.
 * - **404**: Playlist no encontrada.
 * - **500**: Error del servidor.
 *
 * @route DELETE /playlists/:id
 * @access Private (Solo propietario)
 * @param {string} id - ID de la playlist a eliminar.
 * @returns {Object} Mensaje de confirmación.
 *
 * @example
 * DELETE /api/playlists/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "message": "Playlist eliminada correctamente"
 * }
 */
// Eliminar una playlist
router.delete('/:id', playlistController.deletePlaylist);

/**
 * POST /playlists/:id/tracks
 *
 * Añade una o más canciones a una playlist existente.
 *
 * Las canciones se añaden al final de la playlist.
 * Si una canción ya existe en la playlist, se evita duplicarla.
 *
 * Body esperado:
 * ```json
 * {
 *   "tracks": ["spotifyId1", "spotifyId2", "spotifyId3"]
 * }
 * ```
 *
 * Respuestas:
 * - **200**: Tracks añadidos exitosamente.
 * - **400**: Array de tracks no proporcionado o vacío.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Usuario intenta añadir tracks a playlist ajena.
 * - **404**: Playlist no encontrada.
 * - **500**: Error del servidor.
 *
 * @route POST /playlists/:id/tracks
 * @access Private (Solo propietario)
 * @param {string} id - ID de la playlist.
 * @param {string[]} tracks - Array de IDs de Spotify de canciones a añadir.
 * @returns {Object} Playlist actualizada con los nuevos tracks.
 *
 * @example
 * POST /api/playlists/507f1f77bcf86cd799439011/tracks
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * Content-Type: application/json
 *
 * {
 *   "tracks": ["3n3Ppam7vgaVa1iaRUc9Lp", "2DaxqgrOhkeH0fpeiQq2f4"]
 * }
 *
 * Response 200:
 * {
 *   "success": true,
 *   "playlist": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "name": "Party Night",
 *     "trackCount": 2,
 *     "songs": [
 *       { "id": "3n3Ppam7vgaVa1iaRUc9Lp", "name": "Mr. Brightside" },
 *       { "id": "2DaxqgrOhkeH0fpeiQq2f4", "name": "Somebody Told Me" }
 *     ]
 *   }
 * }
 */
// Añadir canciones a una playlist
router.post('/:id/tracks', playlistController.addTracksToPlaylist);

module.exports = router;

