import styles from '../../styles/Button.module.css'

export const Button = ({ children, variant = 'primary', onClick, style }) => {
    // Para CTA, no aplicar .button ya que tiene sus propios estilos completos
    const buttonClasses = variant === 'cta'
        ? styles.cta
        : `${styles.button} ${styles[variant]}`;

    return (
        <button
            onClick={onClick}
            className={buttonClasses}
            style={style}
        >
            {children}
        </button>
    )
}

