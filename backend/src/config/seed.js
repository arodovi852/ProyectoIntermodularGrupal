/**
 * Script de seeding para poblar la base de datos con datos iniciales
 * Ejecutar con: node src/config/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Playlist, Song } = require('../models');

// Datos de ejemplo para usuarios
const usersData = [
  {
    name: 'Cesar123',
    email: 'cesar@example.com',
    password: 'cesar123' // En producción, esto debería estar hasheado
  },
  {
    name: 'Fran123',
    email: 'fran@example.com',
    password: 'fran123'
  },
  {
    name: 'Alberto123',
    email: 'alberto@example.com',
    password: 'alberto123'
  }
];

// Datos de ejemplo para canciones (simulando respuestas de Spotify)
const songsData = [
  {
    _id: '3n3Ppam7vgaVa1iaRUc9Lp',
    name: 'Mr. Brightside',
    album: 'Hot Fuss',
    album_image_url: 'https://i.scdn.co/image/ab67616d0000b2739c284a6855f4945dc5a3cd73',
    artists: ['The Killers'],
    preview_url: null,
    duration_ms: 222200,
    spotify_url: 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp'
  },
  {
    _id: '0VjIjW4GlUZAMYd2vXMi3b',
    name: 'Blinding Lights',
    album: 'After Hours',
    album_image_url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    artists: ['The Weeknd'],
    preview_url: 'https://p.scdn.co/mp3-preview/...',
    duration_ms: 200040,
    spotify_url: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b'
  },
  {
    _id: '7qiZfU4dY1lWllzX7mPBI',
    name: 'Shape of You',
    album: '÷ (Divide)',
    album_image_url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    artists: ['Ed Sheeran'],
    preview_url: 'https://p.scdn.co/mp3-preview/...',
    duration_ms: 233713,
    spotify_url: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI'
  },
  {
    _id: '3WMj8moIAXJhHsyLaqIIHI',
    name: 'Someone Like You',
    album: '21',
    album_image_url: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Adele_-_Someone_Like_You.png',
    artists: ['Adele'],
    preview_url: null,
    duration_ms: 285000,
    spotify_url: 'https://open.spotify.com/track/3WMj8moIAXJhHsyLaqIIHI'
  },
  {
    _id: '4cOdK2wGLETKBW3PvgPWqT',
    name: 'Radioactive',
    album: 'Night Visions',
    album_image_url: 'https://upload.wikimedia.org/wikipedia/en/9/91/Imagine_Dragons_-_%22Radioactive%22_%28Single%29.jpg',
    artists: ['Imagine Dragons'],
    preview_url: 'https://p.scdn.co/mp3-preview/...',
    duration_ms: 187000,
    spotify_url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT'
  },
  {
    _id: '2Fxmhks0bxGSBdJ92vM42m',
    name: 'bad guy',
    album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
    album_image_url: 'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce',
    artists: ['Billie Eilish'],
    preview_url: 'https://p.scdn.co/mp3-preview/...',
    duration_ms: 194088,
    spotify_url: 'https://open.spotify.com/track/2Fxmhks0bxGSBdJ92vM42m'
  },
  {
    _id: '6habFhsOp2NvshLv26DqMb',
    name: 'Someone You Loved',
    album: 'Divinely Uninspired To A Hellish Extent',
    album_image_url: 'https://i.scdn.co/image/ab67616d0000b273fc2101e6889d6ce9025f85f2',
    artists: ['Lewis Capaldi'],
    preview_url: null,
    duration_ms: 182160,
    spotify_url: 'https://open.spotify.com/track/6habFhsOp2NvshLv26DqMb'
  },
  {
    _id: '0u2P5u6lvoDfwTYjAADbn4',
    name: 'lovely (with Khalid)',
    album: 'lovely (with Khalid)',
    album_image_url: 'https://upload.wikimedia.org/wikipedia/en/f/fa/Billie_Eilish_and_Khalid_-_Lovely.png',
    artists: ['Billie Eilish', 'Khalid'],
    preview_url: 'https://p.scdn.co/mp3-preview/...',
    duration_ms: 200186,
    spotify_url: 'https://open.spotify.com/track/0u2P5u6lvoDfwTYjAADbn4'
  }
];

/**
 * Función principal de seeding
 */
async function seedDatabase() {
  try {
    // Conectar a la base de datos
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mood-playlist-app');
    console.log('✅ Conectado a MongoDB');

    // Limpiar la base de datos existente
    console.log('\n🧹 Limpiando base de datos...');
    await User.deleteMany({});
    await Playlist.deleteMany({});
    await Song.deleteMany({});
    console.log('✅ Base de datos limpia');

    // Crear usuarios
    console.log('\n👥 Creando usuarios...');
    // Hashear passwords antes de insertar
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (userData) => ({
        ...userData,
        password: await bcrypt.hash(userData.password, 10)
      }))
    );
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ ${users.length} usuarios creados (passwords hasheados)`);

    // Crear canciones
    console.log('\n🎵 Creando canciones...');
    const songs = await Song.insertMany(songsData);
    console.log(`✅ ${songs.length} canciones creadas`);

    // Crear playlists de ejemplo
    console.log('\n📋 Creando playlists...');
    const playlistsData = [
      {
        name: 'Energía Positiva',
        tracks: [songs[1]._id, songs[2]._id, songs[4]._id, songs[0]._id],
        userId: users[0]._id,
        cover_image_url: songs[1].album_image_url,
        spotify_url: null,
        config: {
          size: 20,
          seeds: [songs[1]._id.toString(), songs[2]._id.toString()],
          negativeSeeds: [],
          danceability: 0.75,
          energy: 0.85,
          valence: 0.80,
          tempo: 125
        }
      },
      {
        name: 'Momentos Reflexivos',
        tracks: [songs[3]._id, songs[6]._id, songs[7]._id],
        userId: users[0]._id,
        cover_image_url: songs[3].album_image_url,
        spotify_url: null,
        config: {
          size: 15,
          seeds: [songs[3]._id.toString(), songs[6]._id.toString()],
          negativeSeeds: [],
          acousticness: 0.65,
          energy: 0.35,
          valence: 0.30,
          speechiness: 0.05,
          tempo: 90
        }
      },
      {
        name: 'Mix Alternativo',
        tracks: [songs[5]._id, songs[0]._id, songs[4]._id],
        userId: users[1]._id,
        cover_image_url: songs[5].album_image_url,
        spotify_url: null,
        config: {
          size: 18,
          seeds: [songs[5]._id.toString(), songs[0]._id.toString()],
          negativeSeeds: [],
          energy: 0.70,
          danceability: 0.60,
          valence: 0.50,
          instrumentalness: 0.10,
          tempo: 110
        }
      },
      {
        name: 'Favoritos 2024',
        tracks: [songs[2]._id, songs[1]._id, songs[5]._id, songs[7]._id],
        userId: users[2]._id,
        cover_image_url: songs[2].album_image_url,
        spotify_url: null,
        config: {
          size: 25,
          seeds: [songs[2]._id.toString(), songs[1]._id.toString(), songs[5]._id.toString()],
          negativeSeeds: [],
          danceability: 0.70,
          energy: 0.75,
          valence: 0.65,
          acousticness: 0.20,
          tempo: 120
        }
      },
      {
        name: 'Workout Intenso',
        tracks: [songs[4]._id, songs[0]._id, songs[1]._id],
        userId: users[0]._id,
        cover_image_url: songs[4].album_image_url,
        spotify_url: null,
        config: {
          size: 30,
          seeds: [songs[4]._id.toString(), songs[0]._id.toString()],
          negativeSeeds: [songs[3]._id.toString()],
          energy: 0.90,
          danceability: 0.65,
          valence: 0.70,
          loudness: -5,
          tempo: 140
        }
      },
      {
        name: 'Chill Vibes',
        tracks: [songs[7]._id, songs[6]._id],
        userId: users[1]._id,
        cover_image_url: songs[7].album_image_url,
        spotify_url: null,
        config: {
          size: 12,
          seeds: [songs[7]._id.toString()],
          negativeSeeds: [songs[4]._id.toString()],
          acousticness: 0.70,
          energy: 0.25,
          valence: 0.40,
          instrumentalness: 0.05,
          speechiness: 0.10,
          tempo: 85
        }
      }
    ];

    const playlists = await Playlist.insertMany(playlistsData);
    console.log(`✅ ${playlists.length} playlists creadas`);

    // Mostrar resumen
    console.log('\n📊 Resumen del seeding:');
    console.log(`   👥 Usuarios: ${users.length}`);
    console.log(`   🎵 Canciones: ${songs.length}`);
    console.log(`   📋 Playlists: ${playlists.length}`);

    console.log('\n🎉 ¡Seeding completado exitosamente!\n');

    // Mostrar información de usuarios de prueba
    console.log('📝 Usuarios de prueba creados:');
    users.forEach(user => {
      console.log(`   - ${user.email} (password: desde el código)`);
    });

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar el seeding
seedDatabase();
