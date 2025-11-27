import styles from '../../styles/BackgroundBlob.module.css'

export const BackgroundBlob = ({ size = 400, color, top, left, right, bottom, blur = 100 }) => {
    return (
        <div
            className={styles.blob}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                top,
                left,
                right,
                bottom,
                filter: `blur(${blur}px)`
            }}
        ></div>
    )
}