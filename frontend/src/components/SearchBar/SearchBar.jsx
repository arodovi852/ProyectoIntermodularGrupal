import React from 'react'
import styles from './SearchBar.module.css'

const SearchBar = ({ value, onChange, onSearch, placeholder }) => {
    const handleKey = (e) => {
        if (e.key === 'Enter') onSearch()
    }
    return (
        <div className={styles.searchBar}>
            <input
                className={styles.input}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKey}
                placeholder={placeholder || 'Buscar...'}
            />
            <button className={styles.button} onClick={onSearch}>Buscar</button>
        </div>
    )
}

export default SearchBar
