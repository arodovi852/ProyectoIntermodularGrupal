import React, { useState } from 'react'
import styles from './Generate.module.css'
import SearchBar from '../components/SearchBar/SearchBar'
import Sliders from '../components/Sliders/Sliders'
import SongList from '../components/SongList/SongList'
import TrackCard from '../components/TrackCard/TrackCard'
import api from '../services/api'

const Generate = () => {
    // 10 sliders for recommendation parameters
    const [acousticness, setAcousticness] = useState(50)
    const [danceability, setDanceability] = useState(50)
    const [energy, setEnergy] = useState(50)
    const [instrumentalness, setInstrumentalness] = useState(50)
    const [liveness, setLiveness] = useState(50)
    const [mode, setMode] = useState(50)
    const [loudness, setLoudness] = useState(50)
    const [valence, setValence] = useState(50)
    const [speechiness, setSpeechiness] = useState(50)
    const [tempo, setTempo] = useState(120)
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
            const res = await api.get('/api/recco/search', {
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
        setGenerationLoading(true)
        setGeneratedPlaylist(null)
        try {
            const res = await api.post('/api/recco', {
                acousticness,
                danceability,
                energy,
                instrumentalness,
                liveness,
                mode,
                loudness,
                valence,
                speechiness,
                tempo,
                limit: playlistSize,
                likedSongs: likedSongs.map(s => s.id),
                dislikedSongs: dislikedSongs.map(s => s.id),
            })
            // Save the generated playlist data
            setGeneratedPlaylist(res.data)
            console.log('Playlist generated:', res.data)
        } catch (err) {
            console.error('Generation error:', err)
            setGeneratedPlaylist({ error: err.message || 'Failed to generate playlist' })
        } finally {
            setGenerationLoading(false)
        }
    }

    return (
        <main className={styles.container}>
            {/* Section 1: Sliders */}
            <section className={styles.sliderSection}>
                <h2 className={styles.sectionTitle}>1. ¿Cómo te sientes hoy?</h2>
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
                    <p className={styles.playlistDescription}>¿Cuántas canciones quieres en tu playlist?</p>
                    <input
                        type="number"
                        min="5"
                        max="100"
                        value={playlistSize}
                        onChange={(e) => setPlaylistSize(Math.min(100, Math.max(5, Number(e.target.value))))}
                        className={styles.playlistInput}
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
                                        >
                                            ♥
                                        </button>
                                        <button
                                            className={styles.dislikeBtn}
                                            onClick={() => handleAddSong(song, 'disliked')}
                                            disabled={dislikedSongs.length >= 5}
                                        >
                                            ✕
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
                            <p>❌ Error: {generatedPlaylist.error}</p>
                        </div>
                    ) : generatedPlaylist.tracks && generatedPlaylist.tracks.length > 0 ? (
                        <div className={styles.tracksGrid}>
                            {generatedPlaylist.tracks.map((track) => (
                                <TrackCard key={track.id} track={track} />
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
