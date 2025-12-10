/**
 * Componente TrackCard - Tarjeta de Track/Canción Simple.
 *
 * Componente ligero para mostrar información de una canción/track.
 * Similar a SongCard pero más simple, muestra:
 * - Imagen del track/álbum
 * - Nombre del track
 * - Artista
 *
 * Características:
 * - Imagen placeholder automática si falla la carga
 * - Texto truncado si es muy largo
 * - Diseño vertical con imagen superior
 * - Reutilizable en diferentes contextos
 *
 * Estructura de Track esperada:
 * ```
 * {
 *   id: string,
 *   name: string,
 *   artist: string,
 *   image: string (URL)
 * }
 * ```
 *
 * Imagen Placeholder:
 * - Si la imagen no carga, usa: https://via.placeholder.com/150
 *
 * @module frontend/components/TrackCard
 * @component
 * @param {Object} props
 * @param {Object} props.track - Objeto track con datos
 * @param {string} props.track.image - URL de imagen
 * @param {string} props.track.name - Nombre del track
 * @param {string} props.track.artist - Nombre del artista
 * @returns {React.ReactElement} Tarjeta de track simple
 *
 * @example
 * <TrackCard track={{ image: 'url', name: 'Song', artist: 'Artist' }} />
 */

import React from 'react'
import styles from '../../styles/TrackCard.module.css'

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
