/**
 * Servicio de Usuarios.
 *
 * Contiene toda la lógica de negocio relacionada con usuarios, incluyendo:
 * - Registro e inicio de sesión con hash de contraseñas
 * - Obtención y actualización de perfiles
 * - Cambio de contraseña con validación
 * - Búsqueda de usuarios
 * - Eliminación de cuentas
 *
 * Este servicio actúa como intermediario entre los controladores (routes)
 * y los modelos (base de datos), aplicando validaciones mediante DTOs
 * y encriptando contraseñas con bcrypt.
 *
 * @module services/userService
 * @requires bcrypt
 * @requires ../models
 * @requires ../dto/UserDTO
 * @singleton
 */

const bcrypt = require('bcrypt');
const { User } = require('../models');
const UserDTO = require('../dto/UserDTO');

class UserService {
  /**
   * Registra un nuevo usuario en la aplicación.
   *
   * Proceso:
   * 1. Valida datos de entrada mediante UserDTO.toCreate()
   * 2. Verifica que el email no esté registrado
   * 3. Encripta la contraseña con bcrypt (salt rounds: 10)
   * 4. Crea el usuario en la base de datos
   * 5. Retorna usuario sin exponer la contraseña
   *
   * @async
   * @method register
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.name - Nombre del usuario (2-100 caracteres)
   * @param {string} userData.email - Email único (validado)
   * @param {string} userData.password - Contraseña en texto plano (mínimo 6 caracteres)
   * @returns {Promise<Object>} Usuario creado sin password
   * @throws {Error} Si email duplicado o datos inválidos
   *
   * @example
   * const newUser = await userService.register({
   *   name: 'Juan Pérez',
   *   email: 'juan@example.com',
   *   password: 'MiPassword123'
   * });
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
   * Autentica un usuario y valida sus credenciales.
   *
   * Proceso:
   * 1. Valida credenciales mediante UserDTO.toLogin()
   * 2. Busca el usuario por email (normalizado a minúsculas)
   * 3. Compara la contraseña con bcrypt.compare()
   * 4. Retorna usuario sin exponer contraseña si es válido
   *
   * @async
   * @method login
   * @param {Object} credentials - Credenciales de inicio de sesión
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña en texto plano
   * @returns {Promise<Object>} Usuario autenticado sin password
   * @throws {Error} Si credenciales son inválidas o usuario no existe
   *
   * @example
   * const authenticatedUser = await userService.login({
   *   email: 'juan@example.com',
   *   password: 'MiPassword123'
   * });
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
   * Obtiene el perfil público de un usuario por su ID.
   *
   * @async
   * @method getUserById
   * @param {string} userId - ID del usuario (ObjectId de MongoDB)
   * @returns {Promise<Object>} Datos públicos del usuario sin password
   * @throws {Error} Si usuario no encontrado
   *
   * @example
   * const user = await userService.getUserById('507f1f77bcf86cd799439011');
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
   * Obtiene el perfil de un usuario junto con sus playlists asociadas.
   *
   * Realiza dos consultas:
   * 1. Obtiene datos del usuario
   * 2. Obtiene todas las playlists del usuario
   * 3. Combina en respuesta con UserDTO.toResponseWithPlaylists()
   *
   * @async
   * @method getUserWithPlaylists
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Usuario con array de playlists
   * @throws {Error} Si usuario no encontrado
   *
   * @example
   * const userWithPlaylists = await userService.getUserWithPlaylists(userId);
   * // { id, name, email, playlistsCount, playlists: [...] }
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
   * Actualiza el perfil de un usuario (nombre y/o email).
   *
   * Proceso:
   * 1. Valida datos mediante UserDTO.toUpdate()
   * 2. Si se actualiza email, verifica que no esté en uso
   * 3. Actualiza el documento en la BD
   * 4. Retorna usuario actualizado
   *
   * Nota: La contraseña se actualiza mediante changePassword()
   *
   * @async
   * @method updateUser
   * @param {string} userId - ID del usuario a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @param {string} [updateData.name] - Nuevo nombre (2-100 caracteres)
   * @param {string} [updateData.email] - Nuevo email (debe ser único)
   * @returns {Promise<Object>} Usuario actualizado sin password
   * @throws {Error} Si email duplicado, usuario no encontrado, o datos inválidos
   *
   * @example
   * const updated = await userService.updateUser(userId, {
   *   name: 'Juan García Pérez'
   * });
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
   * Cambia la contraseña de un usuario después de verificar la actual.
   *
   * Proceso:
   * 1. Valida datos mediante UserDTO.toChangePassword()
   * 2. Obtiene el usuario de la BD
   * 3. Compara contraseña actual con el hash almacenado
   * 4. Si es correcta, encripta y guarda la nueva
   * 5. Retorna true si fue exitoso
   *
   * @async
   * @method changePassword
   * @param {string} userId - ID del usuario
   * @param {Object} passwordData - Datos de cambio de contraseña
   * @param {string} passwordData.currentPassword - Contraseña actual
   * @param {string} passwordData.newPassword - Nueva contraseña (mínimo 6 caracteres)
   * @returns {Promise<boolean>} true si se cambió exitosamente
   * @throws {Error} Si contraseña actual incorrecta, usuario no encontrado, o datos inválidos
   *
   * @example
   * await userService.changePassword(userId, {
   *   currentPassword: 'MiPasswordAntiguo',
   *   newPassword: 'MiPasswordNuevo123'
   * });
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
   * Elimina permanentemente una cuenta de usuario.
   *
   * Importante:
   * - La eliminación es PERMANENTE e irreversible
   * - También debería eliminar las playlists del usuario (TO-DO)
   * - Se recomienda solicitar confirmación en el cliente antes de llamar
   *
   * @async
   * @method deleteUser
   * @param {string} userId - ID del usuario a eliminar
   * @returns {Promise<boolean>} true si se eliminó exitosamente
   * @throws {Error} Si usuario no encontrado
   *
   * @example
   * await userService.deleteUser(userId);
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
   * Obtiene una lista paginada de todos los usuarios registrados.
   *
   * Soporta filtrado por búsqueda y paginación.
   * Las contraseñas nunca se devuelven.
   *
   * @async
   * @method getAllUsers
   * @param {Object} [options={}] - Opciones de paginación y filtrado
   * @param {number} [options.page=1] - Número de página
   * @param {number} [options.limit=50] - Usuarios por página
   * @param {string} [options.search] - Término de búsqueda (nombre o email)
   * @returns {Promise<Object>} Objeto con usuarios y metadatos de paginación
   * @returns {Object[]} return.users Array de usuarios sin password
   * @returns {Object} return.pagination Información de paginación
   *
   * @example
   * const result = await userService.getAllUsers({ page: 1, limit: 20 });
   * // { users: [...], pagination: { count, total, page, pages } }
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
   * Verifica si un email está disponible para registrar.
   *
   * @async
   * @method isEmailAvailable
   * @param {string} email - Email a verificar
   * @returns {Promise<boolean>} true si el email está disponible, false si ya existe
   *
   * @example
   * const available = await userService.isEmailAvailable('nuevo@example.com');
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
   * Busca usuarios por nombre o email.
   *
   * Búsqueda case-insensitive en ambos campos.
   *
   * @async
   * @method searchUsers
   * @param {string} searchTerm - Término de búsqueda
   * @param {number} [limit=20] - Número máximo de resultados
   * @returns {Promise<Object[]>} Array de usuarios que coinciden
   *
   * @example
   * const results = await userService.searchUsers('juan', 10);
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

