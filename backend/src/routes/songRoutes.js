/**
 * Rutas de Gestión de Canciones.
 *
 * Proporciona endpoints para consultar, buscar y administrar canciones de Spotify.
 *
 * Política de acceso:
 * - **Lectura (GET)**: Pública - Todos los usuarios pueden buscar y ver canciones.
 * - **Escritura (POST/DELETE)**: Protegida - Requiere autenticación JWT.
 *
 * Las canciones son importadas desde Spotify API y almacenadas en la base de datos
 * para reutilización en playlists. El ID de Spotify se usa como clave primaria.
 *
 * @module routes/songRoutes
 * @requires express
 * @requires ../controllers/songController
 * @requires ../middleware/authMiddleware
 */

const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * GET /songs/
 *
 * Obtiene la lista completa de canciones almacenadas en la base de datos.
 *
 * Soporta paginación:
 * - `?page=1` - Página (por defecto 1)
 * - `?limit=20` - Canciones por página (por defecto 20)
 *
 * Respuestas:
 * - **200**: Array de canciones paginadas.
 * - **500**: Error del servidor.
 *
 * @route GET /songs/
 * @access Public
 * @param {number} [page=1] - Número de página para paginación.
 * @param {number} [limit=20] - Número de canciones por página.
 * @returns {Object[]} Array de canciones con metadatos.
 *
 * @example
 * GET /api/songs/?page=1&limit=20
 *
 * Response 200:
 * {
 *   "success": true,
 *   "songs": [
 *     {
 *       "id": "spotify123",
 *       "name": "Bohemian Rhapsody",
 *       "album": "A Night at the Opera",
 *       "artists": ["Queen"],
 *       "duration": "5:55",
 *       "spotifyUrl": "https://open.spotify.com/track/..."
 *     }
 *   ],
 *   "total": 250,
 *   "page": 1
 * }
 */
// Rutas públicas (solo lectura)
router.get('/', songController.getAllSongs);

/**
 * GET /songs/search
 *
 * Busca canciones por nombre, artista o álbum (case-insensitive).
 *
 * Query parámetros:
 * - `q`: Término de búsqueda general (busca en nombre, artista, álbum).
 * - `name`: Búsqueda específica en nombre de canción.
 * - `artist`: Búsqueda específica en artistas.
 * - `album`: Búsqueda específica en álbum.
 * - `page`: Número de página (por defecto 1).
 * - `limit`: Canciones por página (por defecto 20).
 *
 * Respuestas:
 * - **200**: Array de canciones que coinciden con la búsqueda.
 * - **400**: Parámetro de búsqueda requerido.
 * - **500**: Error del servidor.
 *
 * @route GET /songs/search
 * @access Public
 * @param {string} q - Búsqueda general (nombre, artista o álbum).
 * @param {string} [name] - Búsqueda en nombre específicamente.
 * @param {string} [artist] - Búsqueda en artistas específicamente.
 * @param {string} [album] - Búsqueda en álbum específicamente.
 * @param {number} [page=1] - Página de resultados.
 * @param {number} [limit=20] - Resultados por página.
 * @returns {Object[]} Array de canciones que coinciden.
 *
 * @example
 * GET /api/songs/search?q=bohemian
 *
 * Response 200:
 * {
 *   "success": true,
 *   "songs": [
 *     { "id": "...", "name": "Bohemian Rhapsody", "artists": ["Queen"] }
 *   ],
 *   "total": 1
 * }
 *
 * @example
 * GET /api/songs/search?artist=Queen&album=A+Night
 */
router.get('/search', songController.searchSongs);

/**
 * GET /songs/:id
 *
 * Obtiene los detalles completos de una canción específica por su ID de Spotify.
 *
 * Respuestas:
 * - **200**: Datos completos de la canción.
 * - **404**: Canción no encontrada.
 * - **500**: Error del servidor.
 *
 * @route GET /songs/:id
 * @access Public
 * @param {string} id - ID de Spotify de la canción.
 * @returns {Object} Objeto canción con todos sus metadatos.
 *
 * @example
 * GET /api/songs/3n3Ppam7vgaVa1iaRUc9Lp
 *
 * Response 200:
 * {
 *   "success": true,
 *   "song": {
 *     "id": "3n3Ppam7vgaVa1iaRUc9Lp",
 *     "name": "Mr. Brightside",
 *     "album": "Hot Fuss",
 *     "artists": ["The Killers"],
 *     "albumImageUrl": "https://i.scdn.co/image/...",
 *     "duration": "3:43",
 *     "previewUrl": "https://...",
 *     "spotifyUrl": "https://open.spotify.com/track/..."
 *   }
 * }
 */
router.get('/:id', songController.getSongById);

/**
 * POST /songs/by-ids
 *
 * Obtiene múltiples canciones por sus IDs en una sola consulta.
 *
 * Útil para obtener detalles de varias canciones simultáneamente (ej: tracks de una playlist).
 *
 * Body esperado:
 * ```json
 * {
 *   "ids": ["id1", "id2", "id3"]
 * }
 * ```
 *
 * Respuestas:
 * - **200**: Array de canciones encontradas.
 * - **400**: Array de IDs no proporcionado o vacío.
 * - **500**: Error del servidor.
 *
 * @route POST /songs/by-ids
 * @access Public
 * @param {string[]} ids - Array de IDs de Spotify.
 * @returns {Object[]} Array de canciones encontradas.
 *
 * @example
 * POST /api/songs/by-ids
 * Content-Type: application/json
 *
 * {
 *   "ids": ["3n3Ppam7vgaVa1iaRUc9Lp", "2DaxqgrOhkeH0fpeiQq2f4"]
 * }
 *
 * Response 200:
 * {
 *   "success": true,
 *   "songs": [
 *     { "id": "3n3Ppam7vgaVa1iaRUc9Lp", "name": "Mr. Brightside" },
 *     { "id": "2DaxqgrOhkeH0fpeiQq2f4", "name": "Somebody Told Me" }
 *   ]
 * }
 */
router.post('/by-ids', songController.getSongsByIds);

/**
 * POST /songs/
 *
 * Crea una nueva canción en la base de datos.
 *
 * Típicamente, esta ruta se usa internamente para almacenar canciones
 * importadas desde Spotify API cuando se generan playlists.
 *
 * Body esperado:
 * ```json
 * {
 *   "_id": "spotifyId",
 *   "name": "Song Name",
 *   "album": "Album Name",
 *   "album_image_url": "https://...",
 *   "artists": ["Artist 1", "Artist 2"],
 *   "preview_url": "https://...",
 *   "duration_ms": 240000,
 *   "spotify_url": "https://open.spotify.com/track/..."
 * }
 * ```
 *
 * Respuestas:
 * - **201**: Canción creada exitosamente.
 * - **400**: Datos inválidos o duplicados.
 * - **401**: Token no proporcionado o inválido.
 * - **500**: Error del servidor.
 *
 * @route POST /songs/
 * @access Private (Autenticado)
 * @param {string} _id - ID de Spotify (clave primaria).
 * @param {string} name - Nombre de la canción.
 * @param {string} album - Nombre del álbum.
 * @param {string} album_image_url - URL de portada (HTTPS).
 * @param {string[]} artists - Array de artistas (mínimo 1).
 * @param {string|null} preview_url - URL de preview (opcional).
 * @param {number} duration_ms - Duración en milisegundos.
 * @param {string} spotify_url - URL en Spotify.
 * @returns {Object} Canción creada.
 *
 * @example
 * POST /api/songs/
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * Content-Type: application/json
 */
// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, songController.createSong);

/**
 * POST /songs/batch
 *
 * Crea múltiples canciones en una sola operación.
 *
 * Útil para importar canciones en lote desde Spotify API.
 * Procesa cada canción individualmente y reporta éxitos y errores.
 *
 * Body esperado:
 * ```json
 * {
 *   "songs": [
 *     { "_id": "id1", "name": "Song 1", ... },
 *     { "_id": "id2", "name": "Song 2", ... }
 *   ]
 * }
 * ```
 *
 * Respuestas:
 * - **201**: Canciones procesadas. Retorna éxitos y errores.
 * - **400**: Array de canciones no proporcionado o vacío.
 * - **401**: Token no proporcionado o inválido.
 * - **500**: Error del servidor.
 *
 * @route POST /songs/batch
 * @access Private (Autenticado)
 * @param {Object[]} songs - Array de objetos canción.
 * @returns {Object} Objeto con `created` (count) y `errors` (array).
 *
 * @example
 * POST /api/songs/batch
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * Content-Type: application/json
 *
 * {
 *   "songs": [
 *     { "_id": "id1", "name": "Song 1", ... },
 *     { "_id": "id2", "name": "Song 2", ... }
 *   ]
 * }
 *
 * Response 201:
 * {
 *   "success": true,
 *   "created": 2,
 *   "errors": []
 * }
 */
router.post('/batch', authMiddleware, songController.createManySongs);

/**
 * DELETE /songs/:id
 *
 * Elimina una canción de la base de datos.
 *
 * Importante:
 * - Esto eliminará la canción completamente.
 * - Las playlists que referencian esta canción quedarán con referencias rotas.
 * - Considere implementar soft deletes para producción.
 *
 * Respuestas:
 * - **200**: Canción eliminada exitosamente.
 * - **401**: Token no proporcionado o inválido.
 * - **404**: Canción no encontrada.
 * - **500**: Error del servidor.
 *
 * @route DELETE /songs/:id
 * @access Private (Autenticado)
 * @param {string} id - ID de Spotify de la canción a eliminar.
 * @returns {Object} Mensaje de confirmación.
 *
 * @example
 * DELETE /api/songs/3n3Ppam7vgaVa1iaRUc9Lp
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "message": "Canción eliminada correctamente"
 * }
 */
router.delete('/:id', authMiddleware, songController.deleteSong);

module.exports = router;

