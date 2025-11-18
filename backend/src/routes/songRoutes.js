/**
 * Rutas para gestión de canciones
 */

const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// Obtener todas las canciones (con paginación y búsqueda)
router.get('/', songController.getAllSongs);

// Buscar canciones
router.get('/search', songController.searchSongs);

// Obtener una canción por ID
router.get('/:id', songController.getSongById);

// Crear una canción
router.post('/', songController.createSong);

// Crear múltiples canciones (batch)
router.post('/batch', songController.createManySongs);

// Obtener múltiples canciones por IDs
router.post('/by-ids', songController.getSongsByIds);

// Eliminar una canción
router.delete('/:id', songController.deleteSong);

module.exports = router;

