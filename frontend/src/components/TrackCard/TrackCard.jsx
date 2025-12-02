import React from 'react'
import styles from './TrackCard.module.css'

const TrackCard = ({ track }) => {
    return (
        <div className={styles.card}>
            <img 
                src={track.image} 
                alt={`${track.name} album cover`}
                className={styles.image}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150'
                }}
            />
            <div className={styles.info}>
                <h3 className={styles.name}>{track.name}</h3>
                <p className={styles.artist}>{track.artist}</p>
            </div>
        </div>
    )
}

export default TrackCard
