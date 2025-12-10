/**
 * Controlador para Usuarios.
 * Gestiona autenticación, registro y operaciones sobre el perfil de usuario.
 *
 * Cada handler:
 * - Recibe la petición HTTP desde las rutas.
 * - Delega la lógica de negocio en `userService`.
 * - Devuelve respuestas JSON normalizadas con las claves `success`, `data`, `message` y `error`.
 */

const userService = require('../services/userService');
const { generateToken } = require('../utils/jwtHelper');

/**
 * Registrar un nuevo usuario.
 *
 * El cuerpo de la petición debe incluir, como mínimo, los datos requeridos
 * por `userService.register` (por ejemplo: `name`, `email`, `password`).
 *
 * Tras crear el usuario:
 * - Se genera un token JWT con su identificador y correo electrónico.
 * - Se devuelve el usuario ya normalizado por el servicio junto con el token.
 *
 * Respuestas:
 * - 201 Created: `{ success: true, data: { user, token } }`
 * - 400 Bad Request: si el usuario ya existe o los datos no son válidos.
 *
 * @async
 * @function register
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);

    // Generar token JWT
    const token = generateToken({ _id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    const statusCode = error.message.includes('ya está registrado') ? 400 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Login de usuario.
 *
 * El cuerpo de la petición debe incluir las credenciales esperadas por
 * `userService.login` (normalmente `email` y `password`).
 *
 * Si el login es correcto:
 * - Se genera un token JWT con el identificador y el email del usuario.
 * - Se devuelve el usuario y el token en la respuesta.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, message, data: { user, token } }`
 * - 401 Unauthorized: si las credenciales son inválidas.
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function login
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const login = async (req, res) => {
  try {
    const user = await userService.login(req.body);

    // Generar token JWT
    const token = generateToken({ _id: user.id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    const statusCode = error.message.includes('Credenciales inválidas') ? 401 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener el perfil de un usuario por su identificador.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador del usuario.
 *
 * Normalmente se utiliza junto con un middleware de autenticación que
 * garantiza que el usuario solo puede acceder a su propio perfil,
 * aunque esa restricción se implementa en las rutas o en el servicio.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: user }`
 * - 404 Not Found: si el usuario no existe.
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function getUserProfile
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar el perfil de un usuario.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador del usuario a actualizar.
 *
 * El cuerpo de la petición contiene los campos del perfil que se quieren modificar
 * (por ejemplo, `name`, `email`, etc.), según lo que permita `userService.updateUser`.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, data: userActualizado }`
 * - 404 Not Found: si el usuario no existe.
 * - 400 Bad Request: si los datos recibidos no son válidos.
 *
 * @async
 * @function updateUserProfile
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    let statusCode = 400;
    if (error.message.includes('no encontrado')) statusCode = 404;

    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Cambiar la contraseña de un usuario.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador del usuario.
 *
 * El cuerpo de la petición debe incluir los campos necesarios para
 * `userService.changePassword` (por ejemplo, contraseña actual y nueva contraseña).
 *
 * Respuestas:
 * - 200 OK: `{ success: true, message }` si la contraseña se actualiza correctamente.
 * - 404 Not Found: si el usuario no existe.
 * - 401 Unauthorized: si la contraseña actual es incorrecta.
 * - 400 Bad Request: si faltan credenciales requeridas o no cumplen las validaciones.
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function changePassword
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.changePassword(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    let statusCode = 500;
    if (error.message.includes('no encontrado')) statusCode = 404;
    if (error.message.includes('incorrecta')) statusCode = 401;
    if (error.message.includes('requeridas')) statusCode = 400;

    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Eliminar un usuario.
 *
 * Parámetros de ruta:
 * - `id` (string): identificador del usuario a eliminar.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, message }` si se ha eliminado correctamente.
 * - 404 Not Found: si el usuario no existe.
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function deleteUser
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener todos los usuarios (uso típico: administración).
 *
 * Los parámetros de paginación y filtrado se leen de `req.query` y
 * se pasan directamente a `userService.getAllUsers`.
 *
 * Respuestas:
 * - 200 OK: `{ success: true, ...pagination, data: users }`
 * - 500 Internal Server Error: si se produce un error inesperado.
 *
 * @async
 * @function getAllUsers
 * @param {import('express').Request} req Objeto de petición HTTP.
 * @param {import('express').Response} res Objeto de respuesta HTTP.
 * @returns {Promise<void>} Promesa que se resuelve cuando se ha enviado la respuesta.
 */
const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);

    res.status(200).json({
      success: true,
      ...result.pagination,
      data: result.users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
  getAllUsers
};

