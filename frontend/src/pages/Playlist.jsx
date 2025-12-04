import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/Playlist.module.css';
import SongCard from '../components/SongCard/SongCard.jsx';

const Playlist = () => {
    const { id } = useParams(); // ruta: /playlists/:id
    const [playlist, setPlaylist] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'carousel'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const carouselRef = useRef(null);

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
                    `${import.meta.env.VITE_BACKEND_URL}/api/playlists/692d910cdfe6210f1f54c259`,
                    /*Playlist de Fran: 692d910cdfe6210f1f54c259
                    * Playlist de César: 692d910cdfe6210f1f54c25a*/
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

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 320; // ancho de la tarjeta + gap
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

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

                <div className={styles.carouselWrapper}>
                    {viewMode === 'carousel' && (
                        <button
                            className={styles.carouselButton + ' ' + styles.prevButton}
                            onClick={() => scroll('left')}
                            aria-label="Previous songs"
                        >
                            <svg width="67" height="430" viewBox="0 0 67 430" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M67 430L25 430C11.1929 430 9.78513e-07 418.807 2.18557e-06 405L3.54062e-05 25C3.66133e-05 11.1929 11.1929 9.78513e-07 25 2.18557e-06L67 5.85733e-06L67 430Z" fill="black" fill-opacity="0.47"/>
                                <g>
                                    <path d="M44.0954 241.541C44.8952 242.339 46.197 242.316 46.9689 241.491L48.6864 239.655C49.42 238.87 49.4031 237.646 48.6479 236.882L27.9094 215.906C27.1391 215.127 27.1391 213.873 27.9094 213.094L48.6479 192.118C49.4031 191.354 49.42 190.13 48.6864 189.345L46.9689 187.509C46.197 186.684 44.8952 186.661 44.0954 187.459L18.4185 213.084C17.6356 213.866 17.6356 215.134 18.4185 215.916L44.0954 241.541Z" fill="white"/>
                                </g>
                            </svg>
                        </button>
                    )}
                    <div className={`${styles.songsContainer} ${styles[viewMode]}`} ref={carouselRef}>
                        {songs.map((song) => (
                            <div key={song.id} className={styles.songCard}>
                                <SongCard
                                    coverImage={song.albumImageUrl}
                                    title={song.name}
                                    artist={song.artists.join(', ')}
                                />
                            </div>
                        ))}
                    </div>
                    {viewMode === 'carousel' && (
                        <button
                            className={styles.carouselButton + ' ' + styles.nextButton}
                            onClick={() => scroll('right')}
                            aria-label="Next songs"
                        >
                            <svg width="67" height="430" viewBox="0 0 67 430" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 430L42 430C55.8071 430 67 418.807 67 405L67 25C67 11.1929 55.8071 0 42 0L0 0L0 430Z" fill="black" fill-opacity="0.47"/>
                                <g>
                                    <path d="M22.9046 241.541C22.1048 242.339 20.803 242.316 20.0311 241.491L18.3136 239.655C17.58 238.87 17.5969 237.646 18.3521 236.882L39.0906 215.906C39.8609 215.127 39.8609 213.873 39.0906 213.094L18.3521 192.118C17.5969 191.354 17.58 190.13 18.3136 189.345L20.0311 187.509C20.803 186.684 22.1048 186.661 22.9046 187.459L48.5815 213.084C49.3644 213.866 49.3644 215.134 48.5815 215.916L22.9046 241.541Z" fill="white"/>
                                </g>
                            </svg>
                        </button>
                    )}
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
