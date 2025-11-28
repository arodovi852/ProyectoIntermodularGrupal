import React, { useState } from 'react'
import styles from './Generate.module.css'
import SearchBar from '../components/SearchBar/SearchBar'
import Sliders from '../components/Sliders/Sliders'
import SongList from '../components/SongList/SongList'
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

    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [likedSongs, setLikedSongs] = useState([])
    const [dislikedSongs, setDislikedSongs] = useState([])
    const [searchResults, setSearchResults] = useState([])

    const handleSearch = async (e) => {
        e?.preventDefault()
        if (!query.trim()) return
        setLoading(true)
        const fallback = [
            { id: 'mock-1', name: `${query} (demo)`, artist: 'Demo Artist', image: 'https://via.placeholder.com/150' },
            { id: 'mock-2', name: `${query} - Otra (demo)`, artist: 'Demo Artist 2', image: 'https://via.placeholder.com/150' }
        ]
        try {
            // Call backend search endpoint
            const res = await api.get('/api/search', {
                params: { q: query }
            })
            const results = (res.data && res.data.length) ? res.data : fallback
            setSearchResults(results)
        } catch (err) {
            console.error('Search error:', err)
            // fallback mock results for testing when backend/search is not available
            setSearchResults(fallback)
        } finally {
            setLoading(false)
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
        setLoading(true)
        try {
            const res = await api.post('/api/recommendations', {
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
            // Handle success - navigate to playlist or show results
            console.log('Playlist generated:', res.data)
        } catch (err) {
            console.error('Generation error:', err)
        } finally {
            setLoading(false)
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
                    playlistSize={playlistSize}
                    setPlaylistSize={setPlaylistSize}
                />
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
                    disabled={loading}
                >
                    {loading ? 'Generando...' : 'Generar playlist'}
                </button>
            </div>
        </main>
    )
}

export default Generate
