/**
 * Rutas de Autenticación.
 *
 * Proporciona los endpoints públicos para registro e inicio de sesión de usuarios.
 * Estas rutas NO requieren autenticación JWT ya que están destinadas a usuarios
 * sin registrar o para obtener un token válido.
 *
 * Flujo típico:
 * 1. Usuario se registra (POST /auth/register)
 * 2. Usuario inicia sesión (POST /auth/login)
 * 3. Recibe un JWT para usar en rutas protegidas
 *
 * @module routes/authRoutes
 * @requires express
 * @requires ../controllers/userController
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * POST /auth/register
 *
 * Registra un nuevo usuario en la aplicación.
 *
 * Body esperado:
 * ```json
 * {
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "password": "miContraseña123"
 * }
 * ```
 *
 * Respuestas:
 * - **201**: Usuario registrado exitosamente. Retorna datos del usuario y token JWT.
 * - **400**: Datos inválidos (email duplicado, contraseña débil, etc.).
 * - **500**: Error del servidor.
 *
 * @route POST /auth/register
 * @access Public
 * @param {string} name - Nombre del usuario (2-100 caracteres).
 * @param {string} email - Email único del usuario (validado).
 * @param {string} password - Contraseña en texto plano (mínimo 6 caracteres).
 * @returns {Object} Usuario creado y token JWT válido por 24 horas.
 *
 * @example
 * POST /api/auth/register
 * Content-Type: application/json
 *
 * {
 *   "name": "María García",
 *   "email": "maria@example.com",
 *   "password": "Password123!"
 * }
 *
 * Response 201:
 * {
 *   "success": true,
 *   "user": { "id": "...", "name": "María García", "email": "maria@example.com" },
 *   "token": "eyJhbGciOiJIUzI1NiIs..."
 * }
 */
// Rutas públicas (no requieren autenticación)
router.post('/register', userController.register);

/**
 * POST /auth/login
 *
 * Inicia sesión con credenciales existentes y retorna un JWT válido.
 *
 * Body esperado:
 * ```json
 * {
 *   "email": "juan@example.com",
 *   "password": "miContraseña123"
 * }
 * ```
 *
 * Respuestas:
 * - **200**: Login exitoso. Retorna datos del usuario y nuevo token JWT.
 * - **401**: Credenciales inválidas (email no existe o contraseña incorrecta).
 * - **400**: Email o contraseña no proporcionados.
 * - **500**: Error del servidor.
 *
 * @route POST /auth/login
 * @access Public
 * @param {string} email - Email registrado del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Object} Datos del usuario autenticado y token JWT válido por 24 horas.
 *
 * @example
 * POST /api/auth/login
 * Content-Type: application/json
 *
 * {
 *   "email": "juan@example.com",
 *   "password": "miContraseña123"
 * }
 *
 * Response 200:
 * {
 *   "success": true,
 *   "user": { "id": "...", "name": "Juan Pérez", "email": "juan@example.com" },
 *   "token": "eyJhbGciOiJIUzI1NiIs..."
 * }
 */
router.post('/login', userController.login);

module.exports = router;

