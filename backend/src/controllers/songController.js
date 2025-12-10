/**
 * Controlador para Canciones (Songs).
 * Gestiona operaciones CRUD y búsquedas sobre canciones almacenadas en la base de datos.
 *
 * Cada handler:
 * - Recibe la petición HTTP desde las rutas.
 * - Delega la lógica de negocio en `songService`.
 * - Devuelve respuestas JSON normalizadas con las claves `success`, `data` y `error`.
 */

const songService = require('../services/songService');

/**
 * Obtener todas las canciones con soporte de paginación.
 *
 * Los parámetros de paginación y filtrado se leen desde `req.query`
 * y se pasan directamente a `songService.getAllSongs`.
 *
 * Ejemplos de parámetros de consulta habituales:
 * - `page` {number}: número de página.
 * - `limit` {number}: tamaño de página.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, ...pagination, data: songs }`
 * - 500 Internal Server Error: si ocurre un error inesperado.
 *
 * @async
 * @function getAllSongs
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const getAllSongs = async (req, res) => {
  try {
    const result = await songService.getAllSongs(req.query);

    res.status(200).json({
      success: true,
      ...result.pagination,
      data: result.songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener una canción por su identificador.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador de la canción en la base de datos.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: song }`
 * - 404 Not Found: si la canción no existe.
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function getSongById
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await songService.getSongById(id);

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear una nueva canción o actualizarla si ya existe.
 *
 * El cuerpo de la petición debe contener la información de la canción
 * en el formato que espera `songService.createOrUpdateSong`
 * (por ejemplo, datos provenientes de la API de Spotify).
 *
 * Respuestas:
 * - 201 Created: si la canción se ha creado por primera vez.
 * - 200 OK: si la canción ya existía y se ha actualizado.
 * - 400 Bad Request: si los datos no son válidos.
 *
 * @async
 * @function createSong
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const createSong = async (req, res) => {
  try {
    const result = await songService.createOrUpdateSong(req.body);

    const statusCode = result.isNew ? 201 : 200;
    res.status(statusCode).json({
      success: true,
      created: result.isNew,
      data: result.song
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Crear o actualizar múltiples canciones en batch.
 *
 * El cuerpo de la petición debe incluir una propiedad:
 * - `songs` {Object[]}: array de objetos de canción a crear o actualizar.
 *
 * Respuestas:
 * - 201 Created: `{ success: true, saved, errors, data, errorDetails }`
 *   donde:
 *   - `saved` es el número de canciones guardadas correctamente.
 *   - `errors` es el número de canciones que no se han podido guardar.
 *   - `data` contiene las canciones persistidas.
 *   - `errorDetails` incluye información sobre los fallos individuales.
 * - 400 Bad Request: si el formato del batch no es válido.
 *
 * @async
 * @function createManySongs
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const createManySongs = async (req, res) => {
  try {
    const result = await songService.createOrUpdateSongsBatch(req.body.songs);

    res.status(201).json({
      success: true,
      saved: result.savedCount,
      errors: result.errorCount,
      data: result.saved,
      errorDetails: result.errors
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener múltiples canciones por sus IDs.
 *
 * El cuerpo de la petición debe incluir:
 * - `ids` {string[]}: array de identificadores de canciones.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, count, data: songs }`
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function getSongsByIds
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const getSongsByIds = async (req, res) => {
  try {
    const songs = await songService.getSongsByIds(req.body.ids);

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Buscar canciones por criterios de consulta.
 *
 * Los filtros de búsqueda se reciben en `req.query` y se pasan a
 * `songService.searchSongs` (por ejemplo, nombre, artista, álbum, etc.).
 *
 * Respuestas:
 * - 200 OK: `{ success: true, count, data: songs }`
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function searchSongs
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const searchSongs = async (req, res) => {
  try {
    const songs = await songService.searchSongs(req.query);

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar una canción por su identificador.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador de la canción a eliminar.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: {} }`
 * - 404 Not Found: si la canción no existe.
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function deleteSong
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    await songService.deleteSong(id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  createManySongs,
  getSongsByIds,
  searchSongs,
  deleteSong
};

