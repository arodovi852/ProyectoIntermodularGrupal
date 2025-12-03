import React, { useState } from 'react'
import styles from '../styles/Generate.module.css'
import SearchBar from '../components/SearchBar/SearchBar'
import Sliders from '../components/Sliders/Sliders'
import SongList from '../components/SongList/SongList'
import SongCard from '../components/SongCard/SongCard'
import api from '../services/api'

const Generate = () => {
    // Default values optimized for mainstream/pop music
    const [acousticness, setAcousticness] = useState(30)      // Bajo = más electrónico
    const [danceability, setDanceability] = useState(70)      // Alto = bailable
    const [energy, setEnergy] = useState(65)                  // Medio-alto = energético
    const [instrumentalness, setInstrumentalness] = useState(10) // Bajo = con voces
    const [liveness, setLiveness] = useState(20)              // Bajo = estudio
    const [mode, setMode] = useState(60)                      // Mayor = alegre
    const [loudness, setLoudness] = useState(70)              // Alto = música potente
    const [valence, setValence] = useState(60)                // Medio-alto = positivo
    const [speechiness, setSpeechiness] = useState(30)        // Bajo-medio = cantado
    const [tempo, setTempo] = useState(120)                   // Medio = versátil
    const [playlistSize, setPlaylistSize] = useState(20)

    const [searchLoading, setSearchLoading] = useState(false)
    const [generationLoading, setGenerationLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [likedSongs, setLikedSongs] = useState([])
    const [dislikedSongs, setDislikedSongs] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [generatedPlaylist, setGeneratedPlaylist] = useState(null)

    const handleSearch = async (songOrEvent) => {
        // Handle both direct search and selected song from autocomplete
        let searchQuery = query
        let selectedSong = null

        if (songOrEvent && typeof songOrEvent === 'object' && songOrEvent.name) {
            // If a song object is passed from autocomplete
            selectedSong = songOrEvent
            searchQuery = songOrEvent.name
        } else if (songOrEvent?.preventDefault) {
            // If it's an event (form submit)
            songOrEvent.preventDefault()
        }

        if (!searchQuery.trim()) return

        setSearchLoading(true)
        try {
            // If a song was selected from autocomplete, just add it
            if (selectedSong) {
                setSearchResults([selectedSong])
                return
            }

            // Otherwise, call backend search endpoint
            const res = await api.get('/api/generate/search', {
                params: { q: searchQuery }
            })
            setSearchResults(res.data || [])
        } catch (err) {
            console.error('Search error:', err)
            setSearchResults([])
        } finally {
            setSearchLoading(false)
        }
    }

    const handleAddSong = (song, type) => {
        if (type === 'liked') {
            if (likedSongs.length < 5 && !likedSongs.find(s => s.id === song.id)) {
                setLikedSongs([...likedSongs, song])
            }
        } else {
            if (dislikedSongs.length < 5 && !dislikedSongs.find(s => s.id === song.id)) {
                setDislikedSongs([...dislikedSongs, song])
            }
        }
    }

    const handleRemoveSong = (songId, type) => {
        if (type === 'liked') {
            setLikedSongs(likedSongs.filter(s => s.id !== songId))
        } else {
            setDislikedSongs(dislikedSongs.filter(s => s.id !== songId))
        }
    }

    const handleGeneratePlaylist = async () => {
        // Validate that we have at least one seed
        if (likedSongs.length === 0) {
            alert('Por favor, añade al menos una canción que te guste como referencia');
            return;
        }

        setGenerationLoading(true)
        setGeneratedPlaylist(null)
        try {
            // Prepare parameters for ReccoBeats API
            const params = {
                size: playlistSize,
                seeds: likedSongs.map(s => s.id).join(','),
                acousticness,
                danceability,
                energy,
                instrumentalness,
                liveness,
                mode,
                loudness,
                valence,
                speechiness,
                tempo
            };

            // Add negativeSeeds only if there are disliked songs
            if (dislikedSongs.length > 0) {
                params.negativeSeeds = dislikedSongs.map(s => s.id).join(',');
            }

            console.log('=== FRONTEND DEBUG ===');
            console.log('Slider values before sending:');
            console.log('- Loudness:', loudness, typeof loudness);
            console.log('- Mode:', mode, typeof mode);
            console.log('- Acousticness:', acousticness, typeof acousticness);
            console.log('Full params object:', params);
            console.log('===================');

            const res = await api.get('/api/generate/get-recommendation', { params });

            // Log the response for debugging
            console.log('Playlist generated from ReccoBeats:', res.data);

            // Save the generated playlist data
            setGeneratedPlaylist(res.data)
        } catch (err) {
            console.error('Generation error:', err);
            setGeneratedPlaylist({
                error: err.response?.data?.error || err.message || 'Failed to generate playlist'
            })
        } finally {
            setGenerationLoading(false)
        }
    }

    // Preset configurations for different music moods/genres
    const applyPreset = (presetName) => {
        const presets = {
            kpop: {
                acousticness: 15,
                danceability: 85,
                energy: 85,
                instrumentalness: 5,
                liveness: 15,
                mode: 80,
                loudness: 90,
                valence: 80,
                speechiness: 40,
                tempo: 130
            },
            chill: {
                acousticness: 60,
                danceability: 40,
                energy: 30,
                instrumentalness: 30,
                liveness: 20,
                mode: 40,
                loudness: 30,
                valence: 50,
                speechiness: 10,
                tempo: 90
            },
            party: {
                acousticness: 10,
                danceability: 95,
                energy: 90,
                instrumentalness: 10,
                liveness: 25,
                mode: 85,
                loudness: 95,
                valence: 85,
                speechiness: 30,
                tempo: 128
            },
            focus: {
                acousticness: 50,
                danceability: 30,
                energy: 35,
                instrumentalness: 80,
                liveness: 10,
                mode: 50,
                loudness: 40,
                valence: 50,
                speechiness: 5,
                tempo: 100
            },
            workout: {
                acousticness: 10,
                danceability: 75,
                energy: 95,
                instrumentalness: 20,
                liveness: 20,
                mode: 70,
                loudness: 95,
                valence: 75,
                speechiness: 40,
                tempo: 140
            }
        };

        const preset = presets[presetName];
        if (preset) {
            setAcousticness(preset.acousticness);
            setDanceability(preset.danceability);
            setEnergy(preset.energy);
            setInstrumentalness(preset.instrumentalness);
            setLiveness(preset.liveness);
            setMode(preset.mode);
            setLoudness(preset.loudness);
            setValence(preset.valence);
            setSpeechiness(preset.speechiness);
            setTempo(preset.tempo);
        }
    }

    return (
        <main className={styles.container}>
            {/* Section 1: Sliders */}
            <section className={styles.sliderSection}>
                <h2 className={styles.sectionTitle}>1. ¿Cómo te sientes hoy?</h2>

                {/* Preset Buttons */}
                <div className={styles.presetsContainer}>
                    <p className={styles.presetsLabel}>Configuraciones rápidas:</p>
                    <div className={styles.presetButtons}>
                        <button
                            className={styles.presetBtn}
                            onClick={() => applyPreset('kpop')}
                            title="K-pop: Enérgico, bailable, alegre"
                        >
                            🎤 K-pop
                        </button>
                        <button
                            className={styles.presetBtn}
                            onClick={() => applyPreset('party')}
                            title="Fiesta: Muy bailable, electrónico, energético"
                        >
                            🎉 Fiesta
                        </button>
                        <button
                            className={styles.presetBtn}
                            onClick={() => applyPreset('chill')}
                            title="Chill: Relajado, acústico, tranquilo"
                        >
                            🌙 Chill
                        </button>
                        <button
                            className={styles.presetBtn}
                            onClick={() => applyPreset('workout')}
                            title="Workout: Intenso, rápido, motivacional"
                        >
                            💪 Workout
                        </button>
                        <button
                            className={styles.presetBtn}
                            onClick={() => applyPreset('focus')}
                            title="Focus: Instrumental, tranquilo, sin distracciones"
                        >
                            🎯 Focus
                        </button>
                    </div>
                </div>

                <Sliders
                    acousticness={acousticness}
                    setAcousticness={setAcousticness}
                    danceability={danceability}
                    setDanceability={setDanceability}
                    energy={energy}
                    setEnergy={setEnergy}
                    instrumentalness={instrumentalness}
                    setInstrumentalness={setInstrumentalness}
                    liveness={liveness}
                    setLiveness={setLiveness}
                    mode={mode}
                    setMode={setMode}
                    loudness={loudness}
                    setLoudness={setLoudness}
                    valence={valence}
                    setValence={setValence}
                    speechiness={speechiness}
                    setSpeechiness={setSpeechiness}
                    tempo={tempo}
                    setTempo={setTempo}
                />
                
                {/* Playlist Size Input */}
                <div className={styles.playlistSizeSection}>
                    <label className={styles.playlistLabel}>Cantidad de canciones</label>
                    <p className={styles.playlistDescription}>Ingresa un número entre 1 y 100</p>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={playlistSize}
                        onChange={(e) => setPlaylistSize(Math.min(100, Math.max(1, Number(e.target.value))))}
                        className={styles.playlistInput}
                        placeholder="20"
                    />
                </div>
            </section>

            {/* Section 2: Songs */}
            <section className={styles.songSection}>
                <h2 className={styles.sectionTitle}>2. Añade hasta 5 canciones que te gusten o no</h2>
                
                <SearchBar
                    value={query}
                    onChange={(v) => setQuery(v)}
                    onSearch={handleSearch}
                    onAddSong={handleAddSong}
                    likedSongs={likedSongs}
                    dislikedSongs={dislikedSongs}
                    placeholder="Buscar canción, artista o álbum"
                />

                {searchResults.length > 0 && (
                    <div className={styles.searchResultsWrap}>
                        <h3>Resultados de búsqueda</h3>
                        <div className={styles.searchResults}>
                            {searchResults.map((song) => (
                                <div key={song.id} className={styles.resultItem}>
                                    <span>{song.name} - {song.artist}</span>
                                    <div className={styles.resultActions}>
                                        <button
                                            className={styles.likeBtn}
                                            onClick={() => handleAddSong(song, 'liked')}
                                            disabled={likedSongs.length >= 5}
                                            aria-label="Me gusta"
                                        >
                                        </button>
                                        <button
                                            className={styles.dislikeBtn}
                                            onClick={() => handleAddSong(song, 'disliked')}
                                            disabled={dislikedSongs.length >= 5}
                                            aria-label="No me gusta"
                                        >
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <SongList
                    likedSongs={likedSongs}
                    dislikedSongs={dislikedSongs}
                    onRemove={handleRemoveSong}
                />
            </section>

            {/* Generate Button */}
            <div className={styles.buttonWrap}>
                <button
                    className={styles.generateBtn}
                    onClick={handleGeneratePlaylist}
                    disabled={generationLoading}
                >
                    {generationLoading ? 'Generando...' : 'Generar playlist'}
                </button>
            </div>

            {/* Generated Playlist Results */}
            {generatedPlaylist && (
                <section className={styles.playlistResults}>
                    <h2 className={styles.sectionTitle}>
                        Playlist Generada ({generatedPlaylist.tracks?.length || 0} canciones)
                    </h2>
                    {generatedPlaylist.error ? (
                        <div className={styles.errorBox}>
                            <p>Error: {generatedPlaylist.error}</p>
                        </div>
                    ) : generatedPlaylist.tracks && generatedPlaylist.tracks.length > 0 ? (
                        <div className={styles.songsGrid}>
                            {generatedPlaylist.tracks.map((track) => (
                                <SongCard
                                    key={track.id}
                                    song={track}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.errorBox}>
                            <p>No se generaron canciones. Intenta ajustar los parámetros.</p>
                        </div>
                    )}
                </section>
            )}
        </main>
    )
}

export default Generate
