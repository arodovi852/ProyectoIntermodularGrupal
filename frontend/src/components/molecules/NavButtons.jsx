import { Button } from '../atoms/Button'
import {NavLink, useNavigate} from "react-router-dom";
import {UseAuth} from "../../hooks/UseAuth.jsx";
import styles from "../../styles/NavButtons.module.css"

export const NavButtons = ({ isOpen = false, onClose = () => {} }) => {
    const { isAuthenticated, logout } = UseAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        onClose();
    };

    const handleNavClick = () => {
        onClose();
    };

    return (
        <nav id="mainNavbar" className={`${styles.navButtons} ${isOpen ? styles.open : ''}`}>
            <ul>
                {isAuthenticated ? (
                    <>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/dashboard" className={styles.links}>Dashboard</NavLink></Button>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/profile" className={styles.links}>Profile</NavLink></Button>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/playlist" className={styles.links}>Playlist</NavLink></Button>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/configuration" className={styles.links}>Configuration</NavLink></Button>
                        <Button onClick={handleLogout} variant="secondary" className={styles.links}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button variant="primary" onClick={handleNavClick}><NavLink to="/login" className={styles.links}>Login</NavLink></Button>
                        <Button variant="secondary" onClick={handleNavClick}><NavLink to="/register" className={styles.links}>Register</NavLink></Button>
                    </>
                )}
            </ul>
        </nav>
    )
}
