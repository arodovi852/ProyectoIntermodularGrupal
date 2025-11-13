const CancionSchema = new mongoose.Schema(
    {
  idApi: {
    type: String,
    required: true,
    unique: true
}, // ID de ReccoBeats o Spotify
  nombre: {
    type: String,
    required: true
},
  imagen: {
    type: String
}, // URL de la imagen del álbum
}
);

export default mongoose.model('Cancion', CancionSchema);