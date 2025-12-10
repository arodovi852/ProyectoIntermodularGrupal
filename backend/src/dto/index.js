/**
 * Índice de DTOs (Data Transfer Objects).
 *
 * Este módulo centraliza la exportación de todos los DTOs utilizados
 * en la capa de servicios y controladores para:
 * - Normalizar la forma en la que se envían y reciben datos.
 * - Evitar dependencias directas con los modelos de base de datos.
 * - Facilitar la validación y transformación entre capas.
 *
 * DTOs incluidos:
 * - UserDTO: transformación y validación de datos de usuario.
 * - SongDTO: transformación y validación de datos de canción.
 * - PlaylistDTO: transformación y validación de datos de playlist.
 *
 * @module dtos/index
 */

const UserDTO = require('./UserDTO');
const SongDTO = require('./SongDTO');
const PlaylistDTO = require('./PlaylistDTO');

module.exports = {
  UserDTO,
  SongDTO,
  PlaylistDTO
};

