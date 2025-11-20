import React from 'react'
import styles from './SongList.module.css'

const SongList = ({ likedSongs, dislikedSongs, onRemove }) => {
    return (
        <div className={styles.songListContainer}>
            {(likedSongs.length > 0 || dislikedSongs.length > 0) && (
                <>
                    {likedSongs.length > 0 && (
                        <div className={styles.songGroup}>
                            <h3 className={styles.groupTitle}>❤️ Canciones que te gustan ({likedSongs.length}/5)</h3>
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
                            <h3 className={styles.groupTitle}>👎 Canciones que no te gustan ({dislikedSongs.length}/5)</h3>
                            <div className={styles.songRow}>
                                {dislikedSongs.map((song) => (
                                    <div key={song.id} className={styles.songCard}>
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
