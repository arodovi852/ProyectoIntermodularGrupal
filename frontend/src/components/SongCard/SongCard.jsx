import React from 'react';
import styles from '../../styles/SongCard.module.css';

function SongCard({ coverImage, title, artist }) {
    return (
        <article className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={coverImage}
                    alt={`${title} - ${artist}`}
                    className={styles.image}
                />
            </div>

            <div className={styles.textWrapper}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.artist}>{artist}</p>
            </div>
        </article>
    );
}

export default SongCard;
