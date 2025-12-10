/**
 * Componente SearchBar - Búsqueda de Canciones con Autocomplete.
 *
 * Barra de búsqueda avanzada que permite:
 * - Búsqueda de canciones en tiempo real
 * - Autocomplete mediante debounce (espera 300ms)
 * - Visualización de sugerencias en dropdown
 * - Añadir canciones a liked/disliked directamente desde sugerencias
 * - Validación de canciones duplicadas
 * - Manejo de keyboard (Enter, Escape)
 * - Click-outside detection para cerrar sugerencias
 *
 * Flujo:
 * 1. Usuario escribe en el input
 * 2. onChange se dispara con cada carácter
 * 3. Se inicia debounce de 300ms
 * 4. Transcurridos 300ms sin nuevos caracteres, se busca en API
 * 5. Se muestran sugerencias en dropdown
 * 6. Usuario puede hacer click en sugerencia para añadirla
 * 7. O presionar Enter para hacer búsqueda completa
 *
 * Optimizaciones:
 * - Debounce: Evita múltiples requests mientras se está escribiendo
 * - No busca con menos de 2 caracteres
 * - Cierra sugerencias cuando se hace click fuera
 * - Detecta canciones ya añadidas
 *
 * @module frontend/components/SearchBar
 * @component
 * @param {Object} props
 * @param {string} props.value - Valor actual del input
 * @param {Function} props.onChange - Callback cuando cambia el input
 * @param {Function} props.onSearch - Callback cuando hace búsqueda
 * @param {string} [props.placeholder] - Placeholder del input
 * @param {Function} [props.onAddSong] - Callback para añadir canción (song, type)
 * @param {Array} [props.likedSongs] - Canciones ya liked
 * @param {Array} [props.dislikedSongs] - Canciones ya disliked
 * @returns {React.ReactElement} Input con dropdown de sugerencias
 */

import React, { useState, useEffect, useRef } from 'react'
import styles from '../../styles/SearchBar.module.css'
import api from '../../services/api'

const SearchBar = ({ value, onChange, onSearch, placeholder, onAddSong, likedSongs = [], dislikedSongs = [] }) => {
    const [suggestions, setSuggestions] = useState([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const suggestionsRef = useRef(null)
    const debounceTimerRef = useRef(null)

    // Fetch suggestions when user types
    const fetchSuggestions = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        setIsLoadingSuggestions(true)
        try {
            const res = await api.get('/api/generate/search', {
                params: { q: query }
            })
            setSuggestions(res.data || [])
            setShowSuggestions(true)
        } catch (err) {
            console.error('Autocomplete error:', err)
            setSuggestions([])
        } finally {
            setIsLoadingSuggestions(false)
        }
    }

    // Debounced search - waits 300ms after user stops typing
    const handleInputChange = (text) => {
        onChange(text)
        
        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }
        
        // Set new timer for debounced search
        debounceTimerRef.current = setTimeout(() => {
            fetchSuggestions(text)
        }, 300)
    }

    // Handle Enter key or button click
    const handleSearch = () => {
        setShowSuggestions(false)
        onSearch()
    }

    // Handle like/dislike from suggestion
    const handleAddFromSuggestion = (song, type, e) => {
        e.stopPropagation()
        if (onAddSong) {
            onAddSong(song, type)
        }
    }

    // Check if song is already added
    const isSongAdded = (songId) => {
        return likedSongs.some(s => s.id === songId) || dislikedSongs.some(s => s.id === songId)
    }

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
        }
    }

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={styles.searchBarWrapper} ref={suggestionsRef}>
            <div className={styles.searchBar}>
                <input
                    className={styles.input}
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder || 'Buscar canción, artista o álbum...'}
                    autoComplete="off"
                />
                <button className={styles.button} onClick={handleSearch}>Buscar</button>
            </div>

            {/* Autocomplete suggestions dropdown */}
            {showSuggestions && (
                <div className={styles.suggestionsContainer}>
                    {isLoadingSuggestions ? (
                        <div className={styles.loadingMessage}>Buscando canciones...</div>
                    ) : suggestions.length > 0 ? (
                        <ul className={styles.suggestionsList}>
                            {suggestions.map((song, index) => {
                                const isAdded = isSongAdded(song.id)
                                const isLiked = likedSongs.some(s => s.id === song.id)
                                const isDisliked = dislikedSongs.some(s => s.id === song.id)
                                
                                return (
                                    <li
                                        key={`${song.id}-${index}`}
                                        className={styles.suggestionItem}
                                    >
                                        <div className={styles.songImage}>
                                            <img 
                                                src={song.image || 'https://via.placeholder.com/40'} 
                                                alt={song.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/40'
                                                }}
                                            />
                                        </div>
                                        <div className={styles.songInfo}>
                                            <div className={styles.songName}>{song.name}</div>
                                            <div className={styles.songMeta}>
                                                {song.artist} {song.album && `• ${song.album}`}
                                            </div>
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={`${styles.likeBtn} ${isLiked ? styles.active : ''}`}
                                                onClick={(e) => handleAddFromSuggestion(song, 'liked', e)}
                                                disabled={isLiked || (likedSongs.length >= 5 && !isLiked)}
                                                title="Me gusta"
                                            >
                                                ♥
                                            </button>
                                            <button
                                                className={`${styles.dislikeBtn} ${isDisliked ? styles.active : ''}`}
                                                onClick={(e) => handleAddFromSuggestion(song, 'disliked', e)}
                                                disabled={isDisliked || (dislikedSongs.length >= 5 && !isDisliked)}
                                                title="No me gusta"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <div className={styles.noResults}>No se encontraron canciones</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBar
