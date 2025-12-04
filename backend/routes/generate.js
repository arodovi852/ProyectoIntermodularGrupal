const express = require('express');
const router = express.Router();
const { spotifyRequest } = require('../src/utils/spotifyAuth');
const axios = require('axios');

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

// GET endpoint for playlist generation using ReccoBeats API
router.get('/get-recommendation', async (req, res) => {
    try {
        const {
            size,
            seeds,
            negativeSeeds,
            acousticness,
            danceability,
            energy,
            instrumentalness,
            key,
            liveness,
            loudness,
            mode,
            speechiness,
            tempo,
            valence
        } = req.query;

        console.log('=== BACKEND DEBUG ===');
        console.log('Received query params:');
        console.log('- loudness (raw):', loudness, typeof loudness);
        console.log('- mode (raw):', mode, typeof mode);
        console.log('- acousticness (raw):', acousticness, typeof acousticness);
        console.log('===================');

        // Convert size to number
        const sizeNum = parseInt(size);

        // Validate required parameters
        if (!sizeNum || sizeNum < 1 || sizeNum > 100) {
            return res.status(400).json({
                error: 'Size must be between 1 and 100'
            });
        }

        if (!seeds || seeds.trim() === '') {
            return res.status(400).json({
                error: 'Seeds are required'
            });
        }

        // Seeds come as comma-separated string from query params
        const seedsArray = seeds.split(',').filter(s => s.trim());
        if (seedsArray.length < 1 || seedsArray.length > 5) {
            return res.status(400).json({
                error: 'Seeds must contain 1 to 5 track IDs'
            });
        }

        // Build query parameters for ReccoBeats API
        const params = {
            size: sizeNum,
            seeds: seeds
        };

        // Add optional parameters if provided
        if (negativeSeeds && negativeSeeds.trim() !== '') {
            const negativeSeedsArray = negativeSeeds.split(',').filter(s => s.trim());
            if (negativeSeedsArray.length > 5) {
                return res.status(400).json({
                    error: 'Negative seeds can have maximum 5 track IDs'
                });
            }
            params.negativeSeeds = negativeSeeds;
        }

        // Audio features - convert from 0-100 to 0-1 range
        // Send all parameters to give ReccoBeats full context
        if (acousticness !== undefined && acousticness !== null && acousticness !== '') {
            params.acousticness = parseFloat(acousticness) / 100;
        }
        if (danceability !== undefined && danceability !== null && danceability !== '') {
            params.danceability = parseFloat(danceability) / 100;
        }
        if (energy !== undefined && energy !== null && energy !== '') {
            params.energy = parseFloat(energy) / 100;
        }
        if (instrumentalness !== undefined && instrumentalness !== null && instrumentalness !== '') {
            params.instrumentalness = parseFloat(instrumentalness) / 100;
        }
        if (liveness !== undefined && liveness !== null && liveness !== '') {
            params.liveness = parseFloat(liveness) / 100;
        }
        if (speechiness !== undefined && speechiness !== null && speechiness !== '') {
            params.speechiness = parseFloat(speechiness) / 100;
        }
        if (valence !== undefined && valence !== null && valence !== '') {
            params.valence = parseFloat(valence) / 100;
        }

        // Special parameters with different ranges
        if (key !== undefined && key !== null && key !== '') {
            const keyNum = parseInt(key);
            if (keyNum >= -1 && keyNum <= 11) {
                params.key = keyNum;
            }
        }
        if (loudness !== undefined && loudness !== null && loudness !== '') {
            const value = parseFloat(loudness);
            // Convert from 0-100 scale to -60 to 0 dB range (typical music loudness range)
            // Formula: loudness_db = (value / 100) * (max - min) + min
            // 0 → -60 dB (very quiet), 50 → -30 dB (medium), 100 → 0 dB (loud)
            params.loudness = (value / 100) * 60 - 60;
            console.log(`Loudness conversion: ${value} (0-100) → ${params.loudness} dB`);
        }
        if (mode !== undefined && mode !== null && mode !== '') {
            const value = parseFloat(mode);
            // Convert from 0-100 to 0 or 1
            // 0-49 = minor (0), 50-100 = major (1)
            params.mode = value >= 50 ? 1 : 0;
        }
        if (tempo !== undefined && tempo !== null && tempo !== '') {
            const tempoNum = parseFloat(tempo);
            if (tempoNum >= 0 && tempoNum <= 250) {
                params.tempo = tempoNum;
            }
        }

        console.log('Calling ReccoBeats API with params:', params);
        console.log('Seeds being sent:', params.seeds);
        console.log('Negative seeds being sent:', params.negativeSeeds);

        // Call ReccoBeats API
        const response = await axios.get('https://api.reccobeats.com/v1/track/recommendation', {
            params,
            headers: {
                'Accept': 'application/json'
            },
            timeout: 15000
        });

        console.log('ReccoBeats response status:', response.status);

        // ReccoBeats returns data inside a 'content' field
        const reccoTracks = response.data.content || response.data;

        // Extract Spotify IDs from href URLs
        const spotifyIds = reccoTracks
            .map(track => {
                if (track.href && track.href.includes('spotify.com/track/')) {
                    return track.href.split('spotify.com/track/')[1];
                }
                return null;
            })
            .filter(id => id !== null);

        console.log('Extracted Spotify IDs:', spotifyIds);

        // Fetch track details from Spotify to get album images
        let spotifyTrackDetails = {};
        if (spotifyIds.length > 0) {
            try {
                // Spotify allows fetching up to 50 tracks at once
                const spotifyResponse = await spotifyRequest('https://api.spotify.com/v1/tracks', {
                    params: {
                        ids: spotifyIds.join(',')
                    }
                });

                // Map tracks by ID for quick lookup
                spotifyResponse.data.tracks.forEach(track => {
                    if (track) {
                        spotifyTrackDetails[track.id] = {
                            album: track.album.name,
                            image: track.album.images[0]?.url || null,
                            preview_url: track.preview_url
                        };
                    }
                });
                console.log('Fetched Spotify details for', Object.keys(spotifyTrackDetails).length, 'tracks');
            } catch (spotifyErr) {
                console.error('Error fetching Spotify track details:', spotifyErr.message);
                // Continue without Spotify details
            }
        }

        // Format the response to match frontend expectations
        const tracks = reccoTracks.map((track) => {
            const spotifyId = track.href?.split('spotify.com/track/')[1];
            const spotifyDetails = spotifyId ? spotifyTrackDetails[spotifyId] : null;

            return {
                id: spotifyId || track.id,
                name: track.trackTitle,
                artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
                artists: track.artists || [],
                album: spotifyDetails?.album || track.album || 'Unknown Album',
                image: spotifyDetails?.image || null,
                uri: track.href || '',
                preview_url: spotifyDetails?.preview_url || track.previewUrl || null,
                duration_ms: track.durationMs,
                popularity: track.popularity || 0,
                href: track.href,
                isrc: track.isrc
            };
        });

        console.log('Formatted tracks with Spotify images:', tracks.length);

        res.json({ tracks, total: tracks.length });
    } catch (err) {
        console.error('ReccoBeats API error:', err.response?.data || err.message);

        // Provide more detailed error information
        const errorDetails = {
            error: 'Failed to get recommendations from ReccoBeats',
            details: err.response?.data?.error?.message || err.message,
            status: err.response?.status
        };

        res.status(err.response?.status || 500).json(errorDetails);
    }
});

// POST endpoint for playlist generation using Spotify Recommendations API (LEGACY - kept for reference)
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
