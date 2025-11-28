import { useState } from 'react'
import { Logo } from '../atoms/Logo'
import { NavButtons } from '../molecules/NavButtons'
import { HamburgerButton } from '../atoms/HamburgerButton'
import styles from '../../styles/Header.module.css'

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={styles.header}>
            <Logo />
            <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
            <NavButtons isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    )
}