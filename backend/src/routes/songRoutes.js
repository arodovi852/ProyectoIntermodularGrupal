/**
 * Rutas para gestión de canciones
 * Lectura: público | Escritura: requiere autenticación
 */

const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Rutas públicas (solo lectura)
router.get('/', songController.getAllSongs);
router.get('/search', songController.searchSongs);
router.get('/:id', songController.getSongById);
router.post('/by-ids', songController.getSongsByIds);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, songController.createSong);
router.post('/batch', authMiddleware, songController.createManySongs);
router.delete('/:id', authMiddleware, songController.deleteSong);

module.exports = router;

