const express = require('express');
const router = express.Router();
const { spotifyRequest } = require('../src/utils/spotifyAuth');

// GET endpoint for search functionality - queries Spotify API
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        
        // Call Spotify Search API
        const response = await spotifyRequest('https://api.spotify.com/v1/search', {
            params: {
                q: q,
                type: 'track',
                limit: 5  // Return only 5 results as requested
            }
        });
        
        // Extract and format track data from Spotify response
        const tracks = response.data.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            image: track.album.images[0]?.url || 'https://via.placeholder.com/150',
            uri: track.uri,
            preview_url: track.preview_url,
            duration_ms: track.duration_ms
        }));
        
        res.json(tracks);
    } catch (err) {
        console.error('Spotify search error:', err.response?.data || err.message);
        res.status(500).json({ 
            error: 'Search failed', 
            details: err.response?.data?.error?.message || err.message 
        });
    }
});

// POST endpoint for playlist generation using Spotify Recommendations API
router.post('/', async (req, res) => {
    try {
        const {
            acousticness,
            danceability,
            energy,
            instrumentalness,
            liveness,
            loudness,
            mode,
            valence,
            speechiness,
            tempo,
            limit = 20,
            likedSongs,
            dislikedSongs
        } = req.body;

        // Map frontend parameter values to Spotify API expectations (0-1 range)
        const params = {
            target_acousticness: acousticness ? acousticness / 100 : undefined,
            target_danceability: danceability ? danceability / 100 : undefined,
            target_energy: energy ? energy / 100 : undefined,
            target_instrumentalness: instrumentalness ? instrumentalness / 100 : undefined,
            target_liveness: liveness ? liveness / 100 : undefined,
            target_loudness: loudness ? (loudness - 50) * 1.2 : undefined,  // Map 0-100 to ~-60 to 0 dB
            target_mode: mode ? (mode / 100 > 0.5 ? 1 : 0) : undefined,  // 0 = minor, 1 = major
            target_valence: valence ? valence / 100 : undefined,
            target_speechiness: speechiness ? speechiness / 100 : undefined,
            target_tempo: tempo || undefined,  // BPM as-is
            limit: Math.min(limit, 100)  // Max 100 songs
        };

        // Spotify requires at least one seed (track, artist, or genre)
        // Use liked songs as seed tracks (max 5)
        if (likedSongs && likedSongs.length > 0) {
            params.seed_tracks = likedSongs.slice(0, 5).join(',');
        } else {
            // If no liked songs, use popular genres as seeds
            params.seed_genres = 'pop,rock,indie';
        }

        // Remove undefined parameters
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

        console.log('Calling Spotify Recommendations API with params:', params);

        // Call Spotify Recommendations API
        const response = await spotifyRequest('https://api.spotify.com/v1/recommendations', {
            params: params
        });

        // Format the response tracks
        const tracks = response.data.tracks.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            image: track.album.images[0]?.url || 'https://via.placeholder.com/150',
            uri: track.uri,
            preview_url: track.preview_url,
            duration_ms: track.duration_ms
        }));

        res.json({ tracks, total: tracks.length });
    } catch (err) {
        console.error('Spotify recommendations error:', err.response?.data || err.message);
        res.status(500).json({ 
            error: 'Failed to generate playlist', 
            details: err.response?.data?.error?.message || err.message 
        });
    }
});

// GET endpoint to fetch individual track details by ID
router.get('/track/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Call Spotify Get Track API
        const response = await spotifyRequest(`https://api.spotify.com/v1/tracks/${id}`);
        
        const track = response.data;
        
        // Format track data
        const formattedTrack = {
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            image: track.album.images[0]?.url || 'https://via.placeholder.com/150',
            uri: track.uri,
            preview_url: track.preview_url,
            duration_ms: track.duration_ms
        };
        
        res.json(formattedTrack);
    } catch (err) {
        console.error('Spotify get track error:', err.response?.data || err.message);
        res.status(500).json({ 
            error: 'Failed to fetch track', 
            details: err.response?.data?.error?.message || err.message 
        });
    }
});

module.exports = router;
