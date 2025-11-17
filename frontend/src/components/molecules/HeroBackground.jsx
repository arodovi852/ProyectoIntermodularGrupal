import { BackgroundBlob } from '../atoms/BackgroundBlob'
import backgroundVideo from '../../assets/backgroundvideo.mp4'
import styles from './HeroBackground.module.css'

export const HeroBackground = () => {
    return (
        <>
            <video
                className={styles.videoBackground}
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>

            <BackgroundBlob
                size={400}
                color="rgba(100, 120, 255, 0.6)"
                top="10%"
                left="20%"
                blur={100}
            />

            <BackgroundBlob
                size={300}
                color="rgba(255, 107, 129, 0.5)"
                bottom="15%"
                right="15%"
                blur={80}
            />

            <BackgroundBlob
                size={150}
                color="rgba(138, 147, 255, 0.7)"
                bottom="30%"
                left="50%"
                blur={60}
            />
        </>
    )
}

