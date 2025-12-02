import React, { useState, useEffect, useRef } from 'react'
import styles from './SearchBar.module.css'
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
            const res = await api.get('/api/recco/search', {
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
