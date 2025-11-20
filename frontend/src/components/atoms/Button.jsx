import styles from '../../styles/Button.module.css'

export const Button = ({ children, variant = 'primary', onClick, style }) => {
    return (
        <button
            onClick={onClick}
            className={`${styles.button} ${styles[variant]}`}
            style={style}
        >
            {children}
        </button>
    )
}

