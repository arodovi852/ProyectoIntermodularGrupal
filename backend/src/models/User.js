/**
 * Modelo de Usuario.
 *
 * Representa un usuario de la aplicación con información de autenticación y perfil.
 * Almacena datos personales, credenciales hasheadas y proporciona métodos para
 * obtener información pública y relaciones con playlists.
 *
 * Campos principales:
 * - **name**: Nombre completo del usuario (2-100 caracteres).
 * - **email**: Email único del usuario (validado con regex).
 * - **password**: Contraseña hasheada (mínimo 6 caracteres en BD).
 * - **created_at**: Timestamp de creación.
 * - **createdAt/updatedAt**: Timestamps automáticos de Mongoose.
 *
 * Relaciones:
 * - Uno-a-muchos con **Playlist** (un usuario tiene múltiples playlists).
 *
 * @module models/User
 * @requires mongoose
 */
const mongoose = require('mongoose');

/**
 * Esquema de Usuario para Mongoose.
 *
 * Define la estructura y validaciones de los documentos de usuario en MongoDB.
 * Incluye validadores personalizados para email y restricciones de longitud.
 *
 * @typedef {Object} User
 * @property {string} name - Nombre del usuario (2-100 caracteres).
 * @property {string} email - Email único (validado como email válido).
 * @property {string} password - Contraseña hasheada (mínimo 6 caracteres).
 * @property {Date} created_at - Fecha de creación manual.
 * @property {Date} createdAt - Timestamp automático de creación (Mongoose).
 * @property {Date} updatedAt - Timestamp automático de última actualización (Mongoose).
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Debe ser un email válido'
    }
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  collection: 'users'
});

/**
 * Método de instancia para obtener información pública del usuario.
 *
 * Excluye explícitamente la contraseña y devuelve solo los datos
 * seguros para compartir con el cliente (públicos).
 *
 * @memberof User
 * @instance
 * @method toPublicJSON
 * @returns {Object} Objeto con información pública del usuario.
 * @returns {string} return._id ID del usuario.
 * @returns {string} return.name Nombre del usuario.
 * @returns {string} return.email Email del usuario.
 * @returns {Date} return.created_at Fecha de creación.
 *
 * @example
 * const user = await User.findById(userId);
 * const publicData = user.toPublicJSON();
 * // { _id: '...', name: 'Juan', email: 'juan@mail.com', created_at: Date }
 */
// Método para obtener información pública del usuario (sin password)
userSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    created_at: this.created_at
  };
};

/**
 * Virtual para obtener las playlists asociadas a este usuario.
 *
 * Establece una relación uno-a-muchos con el modelo Playlist.
 * Las playlists se cargan automáticamente si se incluye `populate('playlists')`
 * en la consulta.
 *
 * @memberof User
 * @instance
 * @type {Array<Playlist>}
 *
 * @example
 * const userWithPlaylists = await User.findById(userId).populate('playlists');
 * console.log(userWithPlaylists.playlists); // Array de documentos Playlist
 */
// Método virtual para obtener playlists del usuario
userSchema.virtual('playlists', {
  ref: 'Playlist',
  localField: '_id',
  foreignField: 'userId'
});

// Asegurar que los virtuals se incluyan al convertir a JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

