import { Link } from '../atoms/Link'
import { SocialIcon } from '../atoms/SocialIcon'
import styles from '../../styles/Footer.module.css'
import {NavLink} from "react-router-dom";

export const Footer = () => {
    const links = [
        { text: 'About', href: '/About' },
        { text: 'Contact', href: '/Contact' },
        { text: 'News', href: '/News' },
        { text: 'Terms', href: '/Terms' },
        { text: 'Privacy', href: '/Privacy' },
        { text: 'API', href: '/API' },
        { text: 'Roadmap', href: '/Roadmap' },
        { text: '/', href: '#', isSpecial: true }
    ]

    const socials = [
        { type: 'github', href: '#github' },
        { type: 'twitter', href: '#twitter' },
        { type: 'facebook', href: '#facebook' },
        { type: 'instagram', href: '#instagram' }
    ]

    return (
        <footer className={styles.footer}>
            <nav className={styles.nav}>
                {/* Enlaces de navegación */}
                {links.map((link, index) => (
                    link.isSpecial ? (
                        <span key={`link-${index}`} className={styles.separator}>
                            {link.text}
                        </span>
                    ) : (
                        <NavLink key={`link-${index}`} to={link.href} className={styles.links}>
                            {link.text}
                        </NavLink>
                    )
                ))}
                {/* Iconos sociales */}
                {socials.map((social, index) => (
                    <SocialIcon key={`social-${index}`} type={social.type} href={social.href} />
                ))}
            </nav>
        </footer>
    )
}

