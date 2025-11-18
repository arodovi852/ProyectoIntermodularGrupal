/**
 * Rutas para autenticación y gestión de usuarios
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Autenticación
router.post('/register', userController.register);
router.post('/login', userController.login);

// Gestión de usuarios
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserProfile);
router.put('/:id', userController.updateUserProfile);
router.delete('/:id', userController.deleteUser);

// Cambiar contraseña
router.put('/:id/change-password', userController.changePassword);

module.exports = router;


