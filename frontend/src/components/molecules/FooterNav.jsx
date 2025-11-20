import { Link } from '../atoms/Link'
import styles from '../../styles/FooterNav.module.css'

export const FooterNav = () => {
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

    return (
        <div className={styles.footerNav}>
            {links.map((link, index) => (
                link.isSpecial ? (
                    <span key={index} className={styles.separator}>
                        {link.text}
                    </span>
                ) : (
                    <Link key={index} href={link.href}>
                        {link.text}
                    </Link>
                )
            ))}
        </div>
    )
}

