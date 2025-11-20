import { Button } from '../atoms/Button'
import {NavLink, useNavigate} from "react-router-dom";
import {UseAuth} from "../../hooks/UseAuth.jsx";
import styles from "../../styles/NavButtons.module.css"

export const NavButtons = () => {
    const { isAuthenticated, logout } = UseAuth();

    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <nav id="mainNavbar" className={styles.navButtons}>
            <ul>
                {isAuthenticated ? (
                    <>
                        <Button variant="secondary"><NavLink to="/DashBoard" className={styles.links}>Dashboard</NavLink></Button>
                        <Button variant="secondary"><NavLink to="/Profile" className={styles.links}>Profile</NavLink></Button>
                        <Button variant="secondary"><NavLink to="/Configuration" className={styles.links}>Configuration</NavLink></Button>
                        <Button onClick={handleLogout} variant="secondary" className={styles.links}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button variant="primary"><NavLink to="/Login" className={styles.links}>Login</NavLink></Button>
                        <Button variant="secondary"><NavLink to="/Register" className={styles.links}>Register</NavLink></Button>
                    </>
                )}
            </ul>
        </nav>
    )
}

