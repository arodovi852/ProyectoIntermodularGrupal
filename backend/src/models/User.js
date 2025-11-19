const mongoose = require('mongoose');

/**
 * Esquema de Usuario
 * Almacena información de los usuarios de la aplicación
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

// Método para obtener información pública del usuario (sin password)
userSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    created_at: this.created_at
  };
};

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

