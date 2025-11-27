import styles from '../../styles/Link.module.css'

export const Link = ({ href, children, style }) => {
    return (
        <a
            href={href}
            className={styles.link}
            style={style}
        >
            {children}
        </a>
    )
}

