const mongoose = require('mongoose');

/**
 * Esquema de Canción (Song/Track)
 * Almacena información de canciones obtenidas de Spotify
 */
const songSchema = new mongoose.Schema({
  // Usamos el ID de Spotify como _id para evitar duplicados
  _id: {
    type: String,
    required: [true, 'El ID de Spotify es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre de la canción es requerido'],
    trim: true
  },
  album: {
    type: String,
    required: [true, 'El álbum es requerido'],
    trim: true
  },
  album_image_url: {
    type: String,
    required: [true, 'La URL de la portada del álbum es requerida'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida'
    }
  },
  artists: {
    type: [String],
    required: [true, 'Los artistas son requeridos'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Debe haber al menos un artista'
    }
  },
  preview_url: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida o null'
    }
  },
  duration_ms: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: [0, 'La duración no puede ser negativa']
  },
  spotify_url: {
    type: String,
    required: [true, 'La URL de Spotify es requerida'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/(open\.)?spotify\.com\/.+/.test(v);
      },
      message: 'Debe ser una URL de Spotify válida'
    }
  }
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  collection: 'songs'
});

// Índices para búsquedas eficientes
songSchema.index({ name: 1 });
songSchema.index({ artists: 1 });
songSchema.index({ album: 1 });

// Método para obtener duración en formato legible (mm:ss)
songSchema.methods.getFormattedDuration = function() {
  const minutes = Math.floor(this.duration_ms / 60000);
  const seconds = Math.floor((this.duration_ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Método estático para crear una canción desde la respuesta de Spotify
songSchema.statics.fromSpotifyTrack = function(spotifyTrack) {
  return {
    _id: spotifyTrack.id,
    name: spotifyTrack.name,
    album: spotifyTrack.album.name,
    album_image_url: spotifyTrack.album.images[0]?.url || '',
    artists: spotifyTrack.artists.map(artist => artist.name),
    preview_url: spotifyTrack.preview_url,
    duration_ms: spotifyTrack.duration_ms,
    spotify_url: spotifyTrack.external_urls.spotify
  };
};

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

