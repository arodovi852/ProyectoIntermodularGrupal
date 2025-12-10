/**
 * Rutas de Gestión de Usuarios.
 *
 * Proporciona endpoints para obtener, actualizar y eliminar perfiles de usuario.
 * TODAS las rutas en este módulo requieren autenticación JWT válida.
 *
 * Flujo de seguridad:
 * - Middleware `authMiddleware` valida el token JWT en todas las rutas.
 * - Middleware `verifyOwnership` verifica que el usuario solo acceda a sus propios datos.
 * - Excepción: GET / (listar todos) puede ser solo para administradores.
 *
 * Headers requeridos:
 * ```
 * Authorization: Bearer <JWT_TOKEN>
 * ```
 *
 * @module routes/userRoutes
 * @requires express
 * @requires ../controllers/userController
 * @requires ../middleware/authMiddleware
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, verifyOwnership } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /users/
 *
 * Obtiene la lista de TODOS los usuarios registrados en la aplicación.
 *
 * Nota: Esta ruta actualmente es pública para usuarios autenticados.
 * En producción, debería estar restringida a administradores.
 *
 * Respuestas:
 * - **200**: Array de usuarios públicos (sin contraseñas).
 * - **401**: Token no proporcionado o inválido.
 * - **500**: Error del servidor.
 *
 * @route GET /users/
 * @access Private (Autenticado)
 * @param {string} Authorization - Header con token JWT válido.
 * @returns {Object[]} Array de usuarios sin información sensible.
 *
 * @example
 * GET /api/users/
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "users": [
 *     { "id": "...", "name": "Juan", "email": "juan@example.com" },
 *     { "id": "...", "name": "María", "email": "maria@example.com" }
 *   ]
 * }
 */
// Gestión de usuarios
router.get('/', userController.getAllUsers); // Admin: ver todos los usuarios

/**
 * GET /users/:id
 *
 * Obtiene el perfil público de un usuario específico.
 *
 * Seguridad:
 * - Requiere autenticación.
 * - Middleware `verifyOwnership` verifica que el usuario solo vea su propio perfil.
 * - El ID en la ruta debe coincidir con el ID del usuario autenticado.
 *
 * Respuestas:
 * - **200**: Datos públicos del usuario.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Intento de acceder al perfil de otro usuario.
 * - **404**: Usuario no encontrado.
 * - **500**: Error del servidor.
 *
 * @route GET /users/:id
 * @access Private (Solo propietario)
 * @param {string} id - ID del usuario a obtener (debe ser del usuario autenticado).
 * @returns {Object} Datos públicos del usuario.
 *
 * @example
 * GET /api/users/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "name": "Juan Pérez",
 *     "email": "juan@example.com",
 *     "created_at": "2024-01-15T10:30:00Z"
 *   }
 * }
 */
router.get('/:id', verifyOwnership, userController.getUserProfile);

/**
 * PUT /users/:id
 *
 * Actualiza el perfil de un usuario.
 *
 * Body esperado:
 * ```json
 * {
 *   "name": "Nuevo Nombre",
 *   "email": "newemail@example.com"
 * }
 * ```
 *
 * Campos permitidos: `name`, `email`. La contraseña se actualiza en `/users/:id/change-password`.
 *
 * Seguridad:
 * - Requiere autenticación.
 * - Middleware `verifyOwnership` impide actualizar perfiles ajenos.
 *
 * Respuestas:
 * - **200**: Perfil actualizado exitosamente.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Intento de actualizar perfil ajeno.
 * - **400**: Email duplicado u otros datos inválidos.
 * - **404**: Usuario no encontrado.
 * - **500**: Error del servidor.
 *
 * @route PUT /users/:id
 * @access Private (Solo propietario)
 * @param {string} id - ID del usuario a actualizar.
 * @param {string} [name] - Nuevo nombre del usuario (2-100 caracteres).
 * @param {string} [email] - Nuevo email (debe ser único).
 * @returns {Object} Perfil actualizado del usuario.
 *
 * @example
 * PUT /api/users/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * Content-Type: application/json
 *
 * {
 *   "name": "Juan Pablo Pérez García",
 *   "email": "juanpablo@example.com"
 * }
 *
 * Response 200:
 * {
 *   "success": true,
 *   "user": { "id": "...", "name": "Juan Pablo Pérez García", "email": "juanpablo@example.com" }
 * }
 */
router.put('/:id', verifyOwnership, userController.updateUserProfile);

/**
 * DELETE /users/:id
 *
 * Elimina permanentemente un usuario y todos sus datos asociados.
 *
 * Importante:
 * - La eliminación es PERMANENTE y no se puede deshacer.
 * - Se elimina el usuario y potencialmente sus playlists asociadas.
 * - Se requiere confirmación adicional en el cliente si es necesario.
 *
 * Seguridad:
 * - Requiere autenticación.
 * - Middleware `verifyOwnership` verifica que solo el usuario elimine su propio perfil.
 *
 * Respuestas:
 * - **200**: Usuario eliminado exitosamente.
 * - **401**: Token no proporcionado o inválido.
 * - **403**: Intento de eliminar usuario ajeno.
 * - **404**: Usuario no encontrado.
 * - **500**: Error del servidor.
 *
 * @route DELETE /users/:id
 * @access Private (Solo propietario)
 * @param {string} id - ID del usuario a eliminar (debe ser del usuario autenticado).
 * @returns {Object} Mensaje de confirmación de eliminación.
 *
 * @example
 * DELETE /api/users/507f1f77bcf86cd799439011
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * Response 200:
 * {
 *   "success": true,
 *   "message": "Usuario eliminado correctamente"
 * }
 */
router.delete('/:id', verifyOwnership, userController.deleteUser);

/**
 * PUT /users/:id/change-password
 *
 * Cambia la contraseña de un usuario después de verificar la contraseña actual.
 *
 * Body esperado:
 * ```json
 * {
 *   "currentPassword": "contraseñaActual",
 *   "newPassword": "nuevaContraseña123"
 * }
 * ```
 *
 * Validaciones:
 * - La contraseña actual debe ser correcta.
 * - La nueva contraseña debe tener mínimo 6 caracteres.
 * - Las contraseñas se hashean antes de almacenar.
 *
 * Seguridad:
 * - Requiere autenticación.
 * - Middleware `verifyOwnership` verifica que solo el usuario cambie su propia contraseña.
 * - La contraseña actual se valida contra el hash almacenado.
 *
 * Respuestas:
 * - **200**: Contraseña actualizada exitosamente.
 * - **401**: Token no proporcionado o inválido, o contraseña actual incorrecta.
 * - **403**: Intento de cambiar contraseña de otro usuario.
 * - **400**: Nueva contraseña muy corta o datos incompletos.
 * - **404**: Usuario no encontrado.
 * - **500**: Error del servidor.
 *
 * @route PUT /users/:id/change-password
 * @access Private (Solo propietario)
 * @param {string} id - ID del usuario (debe ser del usuario autenticado).
 * @param {string} currentPassword - Contraseña actual del usuario.
 * @param {string} newPassword - Nueva contraseña (mínimo 6 caracteres).
 * @returns {Object} Mensaje de confirmación.
 *
 * @example
 * PUT /api/users/507f1f77bcf86cd799439011/change-password
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * Content-Type: application/json
 *
 * {
 *   "currentPassword": "miContraseñaActual",
 *   "newPassword": "miNuevaContraseña123"
 * }
 *
 * Response 200:
 * {
 *   "success": true,
 *   "message": "Contraseña actualizada correctamente"
 * }
 */
// Cambiar contraseña
router.put('/:id/change-password', verifyOwnership, userController.changePassword);

module.exports = router;