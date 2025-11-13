import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado correctamente a MongoDB Atlas'))
  .catch(err => console.error(' Error conectando a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando y conectada a MongoDB');
});

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor backend escuchando en puerto ${PORT}`));