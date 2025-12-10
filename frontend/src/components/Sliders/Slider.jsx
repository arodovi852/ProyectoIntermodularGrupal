import React from 'react'
import styles from './Sliders.module.css'

export const Slider = ({ label, min=0, max=100, step=1, value, onChange }) => (
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