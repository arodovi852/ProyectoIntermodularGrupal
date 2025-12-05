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
                     energy, setEnergy,
                     instrumentalness, setInstrumentalness,
                     mode, setMode,
                     tempo, setTempo,
                 }) => {
    return (
        <div className={styles.sliders}>
        </div>
    )
}

export default Sliders