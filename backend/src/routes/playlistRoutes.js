/**
 * Rutas para gestión de playlists
 */

const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

// Obtener todas las playlists de un usuario
router.get('/user/:userId', playlistController.getUserPlaylists);

// Crear una nueva playlist
router.post('/', playlistController.createPlaylist);

// Obtener detalles de una playlist con sus canciones
router.get('/:id', playlistController.getPlaylistDetails);

// Actualizar una playlist
router.put('/:id', playlistController.updatePlaylist);

// Eliminar una playlist
router.delete('/:id', playlistController.deletePlaylist);

// Añadir canciones a una playlist
router.post('/:id/tracks', playlistController.addTracksToPlaylist);

module.exports = router;

