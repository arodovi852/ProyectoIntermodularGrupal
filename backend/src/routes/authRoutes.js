/**
 * Rutas de Autenticación
 * Maneja registro y login
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas públicas (no requieren autenticación)
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;

