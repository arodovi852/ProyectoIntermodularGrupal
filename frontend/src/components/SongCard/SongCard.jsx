import React from 'react';
import styles from '../../styles/SongCard.module.css';

function SongCard({ song, coverImage, title, artist }) {
    // Support both formats: individual props or song object
    const finalImage = song?.image || coverImage;
    const finalTitle = song?.name || title;
    const finalArtist = song?.artist || artist;

    return (
        <article className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={finalImage}
                    alt={`${finalTitle} - ${finalArtist}`}
                    className={styles.image}
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/1a1a1a/666666?text=No+Image';
                    }}
                />
            </div>

            <div className={styles.textWrapper}>
                <h3 className={styles.title}>{finalTitle}</h3>
                <p className={styles.artist}>{finalArtist}</p>
            </div>
        </article>
    );
}

export default SongCard;
