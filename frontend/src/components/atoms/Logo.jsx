import styles from './Logo.module.css'

export const Logo = ({ text = 'playthemood', style }) => {
    return (
        <div className={styles.logo} style={style}>
            {text}
        </div>
    )
}

