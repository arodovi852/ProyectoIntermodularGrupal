const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET endpoint for search functionality - queries ReccoBeats API
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        
        // Call ReccoBeats API to search for songs
        try {
            const response = await axios.get('https://api.reccobeats.com/search', {
                params: { q }
            });
            
            // Extract and format song data from ReccoBeats response
            const songs = (response.data.tracks || response.data || []).slice(0, 20).map((track) => ({
                id: track.id || track.uri || track.track_id,
                name: track.name || track.title,
                artist: track.artist || track.artists?.[0]?.name || 'Unknown Artist',
                album: track.album || track.album_name || 'Unknown Album',
                image: track.image || track.album_image_url || track.images?.[0]?.url || 'https://via.placeholder.com/150',
                uri: track.uri,
                preview_url: track.preview_url || null,
                duration_ms: track.duration_ms
            }));
            
            res.json(songs);
        } catch (apiErr) {
            console.error('ReccoBeats search error:', apiErr.message);
            // Fallback to mock results if API fails
            const mockResults = [
                { 
                    id: 'mock-1', 
                    name: `${q} - Demo Track 1`, 
                    artist: 'Demo Artist', 
                    album: 'Demo Album',
                    image: 'https://via.placeholder.com/150' 
                },
                { 
                    id: 'mock-2', 
                    name: `${q} - Demo Track 2`, 
                    artist: 'Demo Artist 2', 
                    album: 'Demo Album 2',
                    image: 'https://via.placeholder.com/150' 
                },
            ];
            res.json(mockResults);
        }
    } catch (err) {
        console.error('Search error', err.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// POST endpoint for playlist generation with all parameters
router.post('/', async (req, res) => {
    try {
        const {
            danceability,
            acousticness,
            energy,
            instrumentalness,
            loudness,
            mode,
            tempo,
            valence,
            speechiness,
            likedSongs,
            dislikedSongs
        } = req.body;

        // Map frontend parameter names to ReccoBeats API parameter names
        const params = {
            target_danceability: danceability ? danceability / 100 : 0.5,
            target_acousticness: acousticness ? acousticness / 100 : 0.5,
            target_energy: energy ? energy / 100 : 0.5,
            target_instrumentalness: instrumentalness ? instrumentalness / 100 : 0.5,
            target_loudness: loudness || -5,
            target_mode: mode || 0,
            target_tempo: tempo || 120,
            target_valence: valence ? valence / 100 : 0.5,
            target_speechiness: speechiness ? speechiness / 100 : 0.5,
        };

        // Add seed tracks if liked/disliked songs are provided
        if (likedSongs && likedSongs.length > 0) {
            params.seed_tracks = likedSongs.slice(0, 5).join(',');
        }

        console.log('Calling ReccoBeats API with params:', params);

        // Call the ReccoBeats API
        const response = await axios.get('https://api.reccobeats.com/recommendations', { params });
        res.json(response.data);
    } catch (err) {
        console.error('Recco generation error', err.message || err);
        res.status(500).json({ error: 'Failed to generate playlist', details: err.message });
    }
});

// Legacy GET endpoint for backwards compatibility
router.get('/', async (req, res) => {
    try {
        const { energia, valencia, tempo, query } = req.query;
        const params = {};
        if (energia) params.target_energy = energia / 100;
        if (valencia) params.target_valence = valencia / 100;
        if (tempo) params.target_tempo = tempo;
        if (query) params.q = query;

        const response = await axios.get('https://api.reccobeats.com/recommendations', { params });
        res.json(response.data);
    } catch (err) {
        console.error('Recco proxy error', err.message || err);
        res.status(500).json({ error: 'Failed to fetch recommendations', details: err.message });
    }
});

module.exports = router;
