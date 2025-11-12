import styles from './Logo.module.css'

export const Logo = ({ text = 'BROADCASTTD', style }) => {
    return (
        <div className={styles.logo} style={style}>
            {text}
        </div>
    )
}

