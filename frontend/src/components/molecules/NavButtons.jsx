import { Button } from '../atoms/Button'
import styles from './NavButtons.module.css'

export const NavButtons = () => {
    return (
        <nav className={styles.navButtons}>
            <Button variant="primary">Log In</Button>
            <Button variant="secondary">My lists</Button>
        </nav>
    )
}

