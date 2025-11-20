/**
 * Controlador para Usuarios
 * Gestiona autenticación, registro y operaciones de usuario
 */

const userService = require('../services/userService');
const { generateToken } = require('../utils/jwtHelper');

/**
 * Registrar un nuevo usuario
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
 * Login de usuario
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
 * Obtener perfil de usuario
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
 * Actualizar perfil de usuario
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
 * Cambiar contraseña
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
 * Eliminar usuario
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
 * Obtener todos los usuarios (admin)
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

