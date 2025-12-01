import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/Playlist.module.css';

const Playlist = () => {
    const { id } = useParams(); // ruta: /playlists/:id
    const [playlist, setPlaylist] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'carousel'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const token = localStorage.getItem('token');

                // Debug: verificar el token
                console.log('=== DEBUG TOKEN ===');
                console.log('Token:', token);
                console.log('Token tipo:', typeof token);
                console.log('Token es null/undefined:', token === null || token === undefined);
                console.log('Token es string "undefined":', token === 'undefined');
                console.log('===================');

                if (!token || token === 'undefined' || token === 'null') {
                    throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
                }

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/playlists/6928720a402d5ee7ebe963b3`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const json = await res.json();

                console.log('Respuesta del servidor:', json);
                console.log('Status:', res.status);

                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'No se pudo cargar la playlist');
                }

                setPlaylist(json.data); // PlaylistDTO.toDetailedResponse
            } catch (err) {
                console.error('Error completo:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [id]);

    if (loading) return <p>Cargando playlist...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!playlist) return <p>No se encontró la playlist.</p>;

    const { config, songs = [] } = playlist;

    return (
        <div className={styles.playlistPage}>
            {/* Sección 1: Playlist Name */}
            <section className={styles.playlistNameSection}>
                <div className={styles.playlistImage}>
                    <img
                        src={playlist.coverImageUrl}
                        alt={playlist.name}
                    />
                </div>

                <div className={styles.playlistInfo}>
                    <div className={styles.playlistTitle}>
                        <h1>{playlist.name}</h1>
                    </div>

                    <div className={styles.moodValues}>
                        <h3>Mood values</h3>
                        <div className={styles.slidersGrid}>
                            <SliderItem label="Acousticness" value={config?.acousticness} />
                            <SliderItem label="Danceability" value={config?.danceability} />
                            <SliderItem label="Energy" value={config?.energy} />
                            <SliderItem label="Instrumentalness" value={config?.instrumentalness} />
                            <SliderItem label="Liveness" value={config?.liveness} />
                            <SliderItem label="Speechiness" value={config?.speechiness} />
                            <SliderItem label="Tempo" value={config?.tempo} max={250} />
                            <SliderItem label="Valence" value={config?.valence} />
                            <SliderItem label="Key" value={config?.key} max={11} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección 2: List of Songs */}
            <section className={styles.songsSection}>
                <div className={styles.songsHeader}>
                    <h2>List of songs ({playlist.trackCount})</h2>
                    <div className={styles.viewToggle}>
                        <button
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                        >
                            Grid
                        </button>
                        <button
                            className={viewMode === 'carousel' ? 'active' : ''}
                            onClick={() => setViewMode('carousel')}
                            aria-label="Carousel view"
                        >
                            Carousel
                        </button>
                    </div>
                </div>

                <div className={`${styles.songsContainer} ${styles[viewMode]}`}>
                    {songs.map((song) => (
                        <div key={song.id} className={styles.songCard}>
                            <img
                                src={song.albumImageUrl}
                                alt={song.name}
                                className={styles.songCover}
                            />
                            <div className={styles.songInfo}>
                                <h4>{song.name}</h4>
                                <p>{song.artists.join(', ')}</p>
                                <span>{song.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

function SliderItem({ label, value, max = 1 }) {
    const safeValue = value == null ? 0 : value;
    const percent = max === 1 ? safeValue * 100 : (safeValue / max) * 100;

    return (
        <div className={styles.sliderItem}>
            <label>{label}</label>
            <input
                type="range"
                min="0"
                max={max}
                step={max === 1 ? 0.01 : 1}
                value={safeValue}
                readOnly
            />
            <span className={styles.sliderValue}>{Math.round(percent)}%</span>
        </div>
    );
}

export default Playlist;
