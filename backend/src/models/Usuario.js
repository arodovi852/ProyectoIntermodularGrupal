import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
},
  correo: {
    type: String,
    required: true,
    unique: true
},
  contraseña: { 
    type: String,
    required: true
  },
  playlists: [
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'

    }
  ],
  cancionesFavoritas: [
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Cancion'
    }
  ],
});

// Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

// Método para verificar contraseña
UsuarioSchema.methods.compararContraseña = async function (contraseñaIngresada) {
  return await bcrypt.compare(contraseñaIngresada, this.contraseña);
};

export default mongoose.model('Usuario', UsuarioSchema);