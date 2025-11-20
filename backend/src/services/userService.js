/**
 * Servicio de Usuario
 * Contiene toda la lógica de negocio relacionada con usuarios
 */

const bcrypt = require('bcrypt');
const { User } = require('../models');
const UserDTO = require('../dto/UserDTO');

class UserService {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Usuario creado (sin password)
   */
  async register(userData) {
    try {
      // Validar y transformar datos
      const validatedData = UserDTO.toCreate(userData);

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Crear el usuario
      const user = await User.create({
        ...validatedData,
        password: hashedPassword
      });

      // Devolver usuario transformado (sin password)
      return UserDTO.toResponse(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login de usuario
   * @param {Object} credentials - Email y password
   * @returns {Object} Usuario autenticado (sin password)
   */
  async login(credentials) {
    try {
      // Validar credenciales
      const validatedCredentials = UserDTO.toLogin(credentials);

      // Buscar el usuario
      const user = await User.findOne({ email: validatedCredentials.email });
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar la contraseña
      const isValidPassword = await bcrypt.compare(
        validatedCredentials.password,
        user.password
      );
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
      }

      // Login exitoso
      return UserDTO.toResponse(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener perfil de usuario por ID
   * @param {String} userId - ID del usuario
   * @returns {Object} Usuario encontrado
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return UserDTO.toResponse(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuario con sus playlists
   * @param {String} userId - ID del usuario
   * @returns {Object} Usuario con playlists
   */
  async getUserWithPlaylists(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Obtener playlists del usuario
      const Playlist = require('../models').Playlist;
      const playlists = await Playlist.find({ userId });

      return UserDTO.toResponseWithPlaylists(user, playlists);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar perfil de usuario
   * @param {String} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Usuario actualizado
   */
  async updateUser(userId, updateData) {
    try {
      // Validar y transformar datos
      const validatedUpdates = UserDTO.toUpdate(updateData);

      // Si se actualiza el email, verificar que no exista
      if (validatedUpdates.email) {
        const existingUser = await User.findOne({
          email: validatedUpdates.email,
          _id: { $ne: userId }
        });

        if (existingUser) {
          throw new Error('El email ya está en uso');
        }
      }

      const user = await User.findByIdAndUpdate(
        userId,
        validatedUpdates,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return UserDTO.toResponse(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar contraseña del usuario
   * @param {String} userId - ID del usuario
   * @param {Object} passwordData - Contraseña actual y nueva
   * @returns {Boolean} true si se cambió exitosamente
   */
  async changePassword(userId, passwordData) {
    try {
      // Validar datos
      const validatedData = UserDTO.toChangePassword(passwordData);

      const user = await User.findById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isValid = await bcrypt.compare(
        validatedData.currentPassword,
        user.password
      );

      if (!isValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hashear nueva contraseña
      user.password = await bcrypt.hash(validatedData.newPassword, 10);
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar usuario
   * @param {String} userId - ID del usuario
   * @returns {Boolean} true si se eliminó exitosamente
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // TODO: Eliminar playlists del usuario
      // const Playlist = require('../models').Playlist;
      // await Playlist.deleteMany({ userId });

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios (con paginación)
   * @param {Object} options - Opciones de paginación y filtros
   * @returns {Object} Lista de usuarios con metadatos
   */
  async getAllUsers(options = {}) {
    try {
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 50;
      const skip = (page - 1) * limit;

      const query = {};

      // Si hay búsqueda
      if (options.search) {
        query.$or = [
          { name: { $regex: options.search, $options: 'i' } },
          { email: { $regex: options.search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .limit(limit)
        .skip(skip)
        .sort({ created_at: -1 });

      const total = await User.countDocuments(query);

      return {
        users: UserDTO.toResponseBatch(users),
        pagination: {
          count: users.length,
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar si un email está disponible
   * @param {String} email - Email a verificar
   * @returns {Boolean} true si está disponible
   */
  async isEmailAvailable(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      return !user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuarios por nombre o email
   * @param {String} searchTerm - Término de búsqueda
   * @param {Number} limit - Límite de resultados
   * @returns {Array} Lista de usuarios
   */
  async searchUsers(searchTerm, limit = 20) {
    try {
      const users = await User.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      })
        .select('-password')
        .limit(limit);

      return UserDTO.toResponseBatch(users);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();

