import React from 'react'
import styles from './Sliders.module.css'

const Slider = ({ label, min=0, max=100, step=1, value, onChange }) => (
    <div className={styles.sliderItem}>
        <label className={styles.label}>{label}</label>
        <div className={styles.sliderContainer}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e)=> onChange(Number(e.target.value))}
                className={styles.sliderInput}
            />
            <span className={styles.value}>{value}</span>
        </div>
    </div>
)

const Sliders = ({
    danceability, setDanceability,
    acousticness, setAcousticness,
    energy, setEnergy,
    instrumentalness, setInstrumentalness,
    loudness, setLoudness,
    mode, setMode,
    tempo, setTempo,
    valence, setValence,
    speechiness, setSpeechiness
}) => {
    return (
        <div className={styles.sliders}>
            <Slider label="Bailabilidad" min={0} max={100} value={danceability} onChange={setDanceability} />
            <Slider label="Acusticidad" min={0} max={100} value={acousticness} onChange={setAcousticness} />
            <Slider label="Energía" min={0} max={100} value={energy} onChange={setEnergy} />
            <Slider label="Instrumentalidad" min={0} max={100} value={instrumentalness} onChange={setInstrumentalness} />
            <Slider label="Ruido" min={-60} max={0} value={loudness} onChange={setLoudness} />
            <Slider label="Modo" min={0} max={1} value={mode} onChange={setMode} />
            <Slider label="Tempo" min={40} max={200} value={tempo} onChange={setTempo} />
            <Slider label="Valencia" min={0} max={100} value={valence} onChange={setValence} />
            <Slider label="Verbosabilidad" min={0} max={100} value={speechiness} onChange={setSpeechiness} />
        </div>
    )
}

export default Sliders
