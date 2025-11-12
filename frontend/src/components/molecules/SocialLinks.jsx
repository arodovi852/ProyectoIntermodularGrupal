import { SocialIcon } from '../atoms/SocialIcon'
import styles from './SocialLinks.module.css'

export const SocialLinks = () => {
    const socials = [
        { type: 'github', href: '#github' },
        { type: 'twitter', href: '#twitter' },
        { type: 'facebook', href: '#facebook' },
        { type: 'instagram', href: '#instagram' }
    ]

    return (
        <div className={styles.socialLinks}>
            {socials.map((social, index) => (
                <SocialIcon key={index} type={social.type} href={social.href} />
            ))}
        </div>
    )
}

