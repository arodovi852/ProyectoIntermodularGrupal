import React from 'react'
import styles from './Sliders.module.css'

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
                description="¿Prefieres sonidos naturales (acústicos) o electrónicos?"
                min={0} 
                max={100} 
                value={acousticness} 
                onChange={setAcousticness} 
            />
            
            <SliderItem 
                label="Ganas de bailar" 
                description="¿Cuánto te invita la música a moverte y bailar?"
                min={0} 
                max={100} 
                value={danceability} 
                onChange={setDanceability} 
            />
            
            <SliderItem 
                label="Intensidad" 
                description="Nivel de energía, desde tranquilo hasta intenso."
                min={0} 
                max={100} 
                value={energy} 
                onChange={setEnergy} 
            />
            
            <SliderItem 
                label="Solo música (sin voz)" 
                description="¿Quieres canciones instrumentales o con voz?"
                min={0} 
                max={100} 
                value={instrumentalness} 
                onChange={setInstrumentalness} 
            />
            
            <SliderItem 
                label="Sensación de directo" 
                description="¿Prefieres grabaciones de estudio o con ambiente de concierto en vivo?"
                min={0} 
                max={100} 
                value={liveness} 
                onChange={setLiveness} 
            />
            
            <SliderItem 
                label="Volumen" 
                description="¿Quieres música potente o suave? (ajusta el volumen promedio)"
                min={-60} 
                max={0} 
                value={loudness} 
                onChange={setLoudness} 
                unit=" dB"
            />
            
            <SliderItem 
                label="Modo: Alegre/Triste" 
                description="¿Buscas canciones mayormente alegres (mayor) o tristes (menor)?"
                min={0} 
                max={1} 
                step={0.1}
                value={mode} 
                onChange={setMode} 
            />
            
            <SliderItem 
                label="Presencia de voz hablada" 
                description="¿Quieres música pura o con partes habladas/rap?"
                min={0} 
                max={100} 
                value={speechiness} 
                onChange={setSpeechiness} 
            />
            
            <SliderItem 
                label="Velocidad (BPM)" 
                description="¿Prefieres música rápida o lenta?"
                min={40} 
                max={200} 
                value={tempo} 
                onChange={setTempo} 
                unit=" BPM"
            />
            
            <SliderItem 
                label="Estado de ánimo" 
                description="¿Qué emoción buscas? Alegre/feliz o melancólica/triste."
                min={0} 
                max={100} 
                value={valence} 
                onChange={setValence} 
            />
        </div>
    )
}

export default Sliders
