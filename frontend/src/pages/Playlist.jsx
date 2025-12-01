import React, { useState } from 'react';
import styles from '../styles/Playlist.module.css';

const Playlist = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'

    return (
        <div className={styles.playlistPage}>
            {/* Sección 1: Playlist Name */}
            <section className={styles.playlistNameSection}>
                <div className={styles.playlistImage}>
                    <img
                        src="https://via.placeholder.com/400x400"
                        alt="Playlist cover"
                    />
                </div>
                <div className={styles.playlistInfo}>
                    <div className={styles.playlistTitle}>
                        <h1 contentEditable suppressContentEditableWarning>Playlist name</h1>
                    </div>

                    <div className={styles.moodValues}>
                        <h3>Mood values</h3>
                        <div className={styles.slidersGrid}>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider1">Mood 1</label>
                                <input type="range" id="slider1" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider2">Mood 2</label>
                                <input type="range" id="slider2" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider3">Mood 3</label>
                                <input type="range" id="slider3" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider4">Mood 4</label>
                                <input type="range" id="slider4" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider5">Mood 5</label>
                                <input type="range" id="slider5" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider6">Mood 6</label>
                                <input type="range" id="slider6" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider7">Mood 7</label>
                                <input type="range" id="slider7" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider8">Mood 8</label>
                                <input type="range" id="slider8" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className={styles.sliderItem}>
                                <label htmlFor="slider9">Mood 9</label>
                                <input type="range" id="slider9" min="0" max="100" defaultValue="50" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección 2: List of Songs */}
            <section className={styles.songsSection}>
                <div className={styles.songsHeader}>
                    <h2>List of songs</h2>
                    <div className={styles.viewToggle}>
                        <button
                            className={viewMode === 'grid' ? styles.active : ''}
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                        >
                            Grid
                        </button>
                        <button
                            className={viewMode === 'carousel' ? styles.active : ''}
                            onClick={() => setViewMode('carousel')}
                            aria-label="Carousel view"
                        >
                            Carousel
                        </button>
                    </div>
                </div>

                <div className={`${styles.songsContainer} ${styles[viewMode]}`}>
                    {/* Placeholder para tarjetas de canciones */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className={styles.songCard}>
                            <div className={styles.songPlaceholder}>
                                Song {item}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Playlist;

