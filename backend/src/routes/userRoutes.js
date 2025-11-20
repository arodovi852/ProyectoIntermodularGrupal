/**
 * Rutas para gestión de usuarios
 * Todas las rutas están protegidas con JWT
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, verifyOwnership } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Gestión de usuarios
router.get('/', userController.getAllUsers); // Admin: ver todos los usuarios
router.get('/:id', verifyOwnership, userController.getUserProfile);
router.put('/:id', verifyOwnership, userController.updateUserProfile);
router.delete('/:id', verifyOwnership, userController.deleteUser);

// Cambiar contraseña
router.put('/:id/change-password', verifyOwnership, userController.changePassword);

module.exports = router;