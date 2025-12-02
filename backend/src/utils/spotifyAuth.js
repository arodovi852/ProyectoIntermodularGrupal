const axios = require('axios');

let accessToken = null;
let tokenExpiry = null;

/**
 * Get Spotify access token using Client Credentials flow
 * Token is cached and only refreshed when expired
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
 * Make authenticated request to Spotify API
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
