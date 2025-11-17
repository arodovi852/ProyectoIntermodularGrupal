import styles from './Logo.module.css'
import {NavLink} from "react-router-dom";
import {Button} from "./Button.jsx";

export const Logo = ({ text = 'playthemood', style }) => {
    return (
        <article className={styles.logo} style={style}>
            <NavLink to="/" className={styles.links}>{text}</NavLink>
        </article>
    )
}

