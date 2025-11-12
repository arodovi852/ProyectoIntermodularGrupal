import { Logo } from '../atoms/Logo'
import { NavButtons } from '../molecules/NavButtons'
import styles from './Header.module.css'

export const Header = () => {
    return (
        <header className={styles.header}>
            <Logo />
            <NavButtons />
        </header>
    )
}

