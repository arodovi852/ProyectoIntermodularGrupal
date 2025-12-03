import React from 'react'
import styles from '../../styles/Sliders.module.css'

const SliderItem = ({ 
    label, 
    description, 
    min=0, 
    max=100, 
    step=1, 
    value, 
    onChange,
    unit=''
}) => (
    <div className={styles.sliderItem}>
        <div className={styles.labelContainer}>
            <label className={styles.label}>{label}</label>
            <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.sliderContainer}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={styles.sliderInput}
            />
            <span className={styles.value}>{value}{unit}</span>
        </div>
    </div>
)

const Sliders = ({
    acousticness, setAcousticness,
    danceability, setDanceability,
    energy, setEnergy,
    instrumentalness, setInstrumentalness,
    liveness, setLiveness,
    mode, setMode,
    loudness, setLoudness,
    valence, setValence,
    speechiness, setSpeechiness,
    tempo, setTempo
}) => {
    return (
        <div className={styles.sliders}>
            <SliderItem 
                label="Nivel acústico" 
                description="Bajo (0-30) = Electrónico/Sintético | Alto (70-100) = Acústico/Natural"
                min={0}
                max={100} 
                value={acousticness} 
                onChange={setAcousticness} 
            />
            
            <SliderItem 
                label="Bailable (Danceability)"
                description="Bajo (0-30) = Difícil de bailar | Alto (70-100) = Muy bailable"
                min={0}
                max={100} 
                value={danceability} 
                onChange={setDanceability} 
            />
            
            <SliderItem 
                label="Energía"
                description="Bajo (0-30) = Tranquilo/Relajado | Alto (70-100) = Intenso/Enérgico"
                min={0}
                max={100} 
                value={energy} 
                onChange={setEnergy} 
            />
            
            <SliderItem 
                label="Instrumental"
                description="Bajo (0-30) = Con voces | Alto (70-100) = Solo música instrumental"
                min={0}
                max={100} 
                value={instrumentalness} 
                onChange={setInstrumentalness} 
            />
            
            <SliderItem 
                label="En vivo (Liveness)"
                description="Bajo (0-30) = Estudio | Alto (70-100) = Concierto en vivo"
                min={0}
                max={100} 
                value={liveness} 
                onChange={setLiveness} 
            />
            
            <SliderItem 
                label="Volumen" 
                description="Bajo (0-30) = Música muy suave | Alto (70-100) = Música muy potente"
                min={0}
                max={100}
                value={loudness}
                onChange={setLoudness} 
            />
            
            <SliderItem 
                label="Modo musical"
                description="Menor (0-49) = Sonidos tristes/oscuros | Mayor (50-100) = Sonidos alegres/brillantes"
                min={0}
                max={100}
                value={mode}
                onChange={setMode} 
            />
            
            <SliderItem 
                label="Voz hablada (Speechiness)"
                description="Bajo (0-30) = Música cantada | Alto (70-100) = Rap/Spoken Word"
                min={0}
                max={100} 
                value={speechiness} 
                onChange={setSpeechiness} 
            />
            
            <SliderItem 
                label="Tempo (BPM)"
                description="Lento (60-90 BPM) = Baladas | Rápido (140-180 BPM) = Dance/EDM"
                min={40}
                max={200} 
                value={tempo} 
                onChange={setTempo} 
                unit=" BPM"
            />
            
            <SliderItem 
                label="Estado de ánimo (Valence)"
                description="Bajo (0-30) = Triste/Melancólico | Alto (70-100) = Alegre/Feliz"
                min={0}
                max={100} 
                value={valence} 
                onChange={setValence} 
            />
        </div>
    )
}

export default Sliders
