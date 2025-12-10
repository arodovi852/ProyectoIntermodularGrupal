/**
 * Componente SongCard - Tarjeta de Canción Reutilizable.
 *
 * Componente versátil que muestra información de una canción en formato tarjeta.
 * Soporta dos modos de uso:
 * 1. Modo de objeto: Pasar un objeto `song` completo
 * 2. Modo de props: Pasar props individuales (coverImage, title, artist)
 *
 * Características:
 * - Imagen de la canción/álbum
 * - Nombre de la canción
 * - Artista
 * - Imagen placeholder si falla la carga
 * - Responsive y reutilizable en múltiples contextos
 * - Estilos modulares CSS
 *
 * Modo Objeto:
 * ```jsx
 * <SongCard song={{ id: '1', name: 'Song', artist: 'Artist', image: 'url' }} />
 * ```
 *
 * Modo Props:
 * ```jsx
 * <SongCard coverImage="url" title="Song" artist="Artist" />
 * ```
 *
 * Imagen Placeholder:
 * - Se usa automáticamente si la imagen no carga
 * - URL: https://placehold.co/300x300/1a1a1a/666666?text=No+Image
 *
 * @module frontend/components/SongCard
 * @component
 * @param {Object} props
 * @param {Object} [props.song] - Objeto canción completo
 * @param {string} [props.song.image] - URL de imagen
 * @param {string} [props.song.name] - Nombre de canción
 * @param {string} [props.song.artist] - Artista
 * @param {string} [props.coverImage] - URL de imagen (si no usa song)
 * @param {string} [props.title] - Nombre (si no usa song)
 * @param {string} [props.artist] - Artista (si no usa song)
 * @returns {React.ReactElement} Tarjeta de canción
 *
 * @example
 * // Modo objeto (Playlist.jsx)
 * <SongCard song={song} />
 *
 * @example
 * // Modo props (Generate.jsx, SongList.jsx)
 * <SongCard coverImage="url" title="Song" artist="Artist" />
 */

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
