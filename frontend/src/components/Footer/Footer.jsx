import { Link } from '../atoms/Link'
import { SocialIcon } from '../atoms/SocialIcon'
import styles from './Footer.module.css'

export const Footer = () => {
    const links = [
        { text: 'About', href: '#about' },
        { text: 'Contact', href: '#contact' },
        { text: 'News', href: '#news' },
        { text: 'Terms', href: '#terms' },
        { text: 'Privacy', href: '#privacy' },
        { text: 'API', href: '#api' },
        { text: 'Roadmap', href: '#roadmap' },
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
                        <Link key={`link-${index}`} href={link.href}>
                            {link.text}
                        </Link>
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

