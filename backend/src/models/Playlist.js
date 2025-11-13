import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  imagen: {
    type: String
  }, // URL o base64 de portada
  canciones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cancion'
    }
  ],
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
});

export default mongoose.model('Playlist', PlaylistSchema);