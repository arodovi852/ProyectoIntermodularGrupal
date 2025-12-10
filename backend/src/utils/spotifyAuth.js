/**
 * Autenticación y Gestión de Tokens de Spotify.
 *
 * Implementa el flujo Client Credentials de OAuth 2.0 para obtener acceso
 * a la API de Spotify. Mantiene un token en caché y lo renueva automáticamente
 * cuando expira.
 *
 * Variables de entorno requeridas:
 * - SPOTIFY_CLIENT_ID: ID de la aplicación Spotify
 * - SPOTIFY_CLIENT_SECRET: Secreto de la aplicación Spotify
 *
 * Características:
 * - Caché de tokens: Evita solicitudes innecesarias
 * - Renovación automática: Renueva cuando expira
 * - Margen de seguridad: Renueva 5 min antes de expiración
 * - Requests autenticadas: Wrapper para incluir token automáticamente
 *
 * @module utils/spotifyAuth
 * @requires axios
 */

const axios = require('axios');

let accessToken = null;
let tokenExpiry = null;

/**
 * Obtiene un token de acceso válido para la API de Spotify.
 *
 * Implementa caché con renovación automática:
 * 1. Si hay token en caché y sigue válido, lo retorna
 * 2. Si no hay token o ha expirado, solicita uno nuevo
 * 3. Almacena el token y su fecha de expiración
 * 4. Renueva 5 minutos antes de la expiración real (margen de seguridad)
 *
 * Flujo OAuth 2.0 Client Credentials:
 * - Se autentica con Client ID y Client Secret
 * - No requiere intervención del usuario
 * - Obtiene acceso a endpoints públicos de Spotify
 *
 * @async
 * @function getSpotifyAccessToken
 * @returns {Promise<string>} Token de acceso válido para usar en requests a Spotify
 * @throws {Error} Si las credenciales no están configuradas en .env
 * @throws {Error} Si falla la autenticación con Spotify
 *
 * @example
 * const token = await getSpotifyAccessToken();
 * // Usar token en requests a Spotify API
 *
 * @example
 * // Automáticamente se reutiliza el token en caché si es válido
 * const token1 = await getSpotifyAccessToken(); // Solicita nuevo
 * const token2 = await getSpotifyAccessToken(); // Retorna el cacheado
 */
async function getSpotifyAccessToken() {
    // Return cached token if still valid
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env');
    }

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
                }
            }
        );

        accessToken = response.data.access_token;
        // Set expiry to 5 minutes before actual expiry for safety
        tokenExpiry = Date.now() + ((response.data.expires_in - 300) * 1000);
        
        console.log('Spotify access token obtained, expires in', response.data.expires_in, 'seconds');
        return accessToken;
    } catch (error) {
        console.error('Failed to get Spotify access token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Spotify');
    }
}

/**
 * Realiza una request autenticada a la API de Spotify.
 *
 * Wrapper alrededor de axios que:
 * 1. Obtiene un token válido automáticamente (usa caché si es posible)
 * 2. Añade el token al header Authorization
 * 3. Realiza la request con la configuración proporcionada
 * 4. Retorna la respuesta de axios
 *
 * Ejemplo de endpoints de Spotify:
 * - `GET /v1/search` - Buscar tracks, artistas, álbumes
 * - `GET /v1/recommendations` - Obtener recomendaciones
 * - `GET /v1/tracks/{id}` - Obtener detalles de track
 * - `GET /v1/artists/{id}` - Obtener detalles de artista
 *
 * @async
 * @function spotifyRequest
 * @param {string} url - URL completa o relativa de Spotify API
 * @param {Object} [options={}] - Opciones de axios (headers, params, data, etc.)
 * @param {string} [options.method='GET'] - Método HTTP (GET, POST, etc.)
 * @param {Object} [options.params] - Query parámetros (ej: limit, offset)
 * @param {Object} [options.headers] - Headers adicionales (se combinarán con Authorization)
 * @returns {Promise<Object>} Response de axios con datos de Spotify
 * @throws {Error} Si falla la autenticación o la request
 *
 * @example
 * const response = await spotifyRequest(
 *   'https://api.spotify.com/v1/search',
 *   {
 *     params: { q: 'queen', type: 'track', limit: 10 }
 *   }
 * );
 * console.log(response.data.tracks.items);
 *
 * @example
 * const track = await spotifyRequest(
 *   'https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUc9Lp'
 * );
 * console.log(track.data.name); // Song name
 */
async function spotifyRequest(url, options = {}) {
    const token = await getSpotifyAccessToken();
    
    const config = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    };

    return axios(url, config);
}

module.exports = {
    getSpotifyAccessToken,
    spotifyRequest
};
