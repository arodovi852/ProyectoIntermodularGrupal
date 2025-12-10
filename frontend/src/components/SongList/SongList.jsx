/**
 * Componente SongList - Visualización de Canciones Liked y Disliked.
 *
 * Renderiza dos listas de canciones seleccionadas por el usuario:
 * - **Liked Songs**: Canciones que le gustan (máximo 5)
 * - **Disliked Songs**: Canciones que no le gustan (máximo 5)
 *
 * Características:
 * - Muestra imagen, nombre, artista y álbum de cada canción
 * - Botón para eliminar canción individual
 * - Indica contador de seleccionadas (ej: "3 de 5")
 * - Estilos diferenciados para liked/disliked
 * - Responsive grid layout
 * - Click en imagen o botón elimina la canción
 *
 * Estructura de Song esperada:
 * ```
 * {
 *   id: string,
 *   name: string,
 *   artist: string,
 *   album: string,
 *   image: string (URL)
 * }
 * ```
 *
 * @module frontend/components/SongList
 * @component
 * @param {Object} props
 * @param {Array} props.likedSongs - Array de canciones que gustan
 * @param {Array} props.dislikedSongs - Array de canciones que no gustan
 * @param {Function} props.onRemove - Callback para eliminar (songId, type)
 * @returns {React.ReactElement} Listas de canciones con controles
 */

import React from 'react'
import styles from '../../styles/SongList.module.css'

const SongList = ({ likedSongs, dislikedSongs, onRemove }) => {
    return (
        <div className={styles.songListContainer}>
            {(likedSongs.length > 0 || dislikedSongs.length > 0) && (
                <>
                    {likedSongs.length > 0 && (
                        <div className={styles.songGroup}>
                            <h3 className={styles.groupTitle}>Canciones que te gustan ({likedSongs.length} de 5)</h3>
                            <div className={styles.songRow}>
                                {likedSongs.map((song) => (
                                    <div key={song.id} className={styles.songCard}>
                                        {song.image && (
                                            <img
                                                src={song.image}
                                                alt={song.name}
                                                className={styles.songImage}
                                                onClick={() => onRemove(song.id, 'liked')}
                                            />
                                        )}
                                        <div className={styles.songInfo}>
                                            <p className={styles.songName}>{song.name}</p>
                                            <p className={styles.songArtist}>{song.artist}</p>
                                            {song.album && <p className={styles.songAlbum}>{song.album}</p>}
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => onRemove(song.id, 'liked')}
                                            title="Eliminar"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {dislikedSongs.length > 0 && (
                        <div className={styles.songGroup}>
                            <h3 className={styles.groupTitle}>Canciones que no te gustan ({dislikedSongs.length} de 5)</h3>
                            <div className={styles.songRow}>
                                {dislikedSongs.map((song) => (
                                    <div key={song.id} className={`${styles.songCard} ${styles.disliked}`}>
                                        {song.image && (
                                            <img
                                                src={song.image}
                                                alt={song.name}
                                                className={styles.songImage}
                                                onClick={() => onRemove(song.id, 'disliked')}
                                            />
                                        )}
                                        <div className={styles.songInfo}>
                                            <p className={styles.songName}>{song.name}</p>
                                            <p className={styles.songArtist}>{song.artist}</p>
                                            {song.album && <p className={styles.songAlbum}>{song.album}</p>}
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => onRemove(song.id, 'disliked')}
                                            title="Eliminar"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default SongList
