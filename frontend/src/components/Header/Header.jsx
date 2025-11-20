import { Logo } from '../atoms/Logo'
import { NavButtons } from '../molecules/NavButtons'
import styles from '../../styles/Header.module.css'
import {UseAuth} from "../../hooks/UseAuth.jsx";
import {Link, NavLink, useNavigate} from "react-router-dom";

export const Header = () => {
    return (
        <header className={styles.header}>
            <Logo />
            <NavButtons />
        </header>
    )
}