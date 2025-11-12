import { NavLink } from "react-router-dom";
import linkedinLogo from '../assets/linkedin.png';
import xLogo from '../assets/x.png';
import facebookLogo from '../assets/facebook.png';
import instagramLogo from '../assets/instagram.png';

function Footer() {
  const altFacebookLogo = "Facebook";
  const altXLogo = "X";
  const altInstagramLogo = "Instagram";
  const altLinkedinLogo = "LinkedIn";
  return (
    <footer>
        <nav aria-label="Footer navigation">
            <ul>
                <li><NavLink to="/About" end>About</NavLink></li>
                <li><NavLink to="/Contact">Contact</NavLink></li>
                <li><NavLink to="/News">News</NavLink></li>
                <li><NavLink to="/Terms" end>Terms</NavLink></li>
                <li><NavLink to="/API">API</NavLink></li>
                <li><NavLink to="/Roadmap">Roadmap</NavLink></li>
            </ul>
        </nav>
        <ul>
            <li><a href="#" aria-label={altLinkedinLogo} target="_blank" rel="noopener noreferrer"><img src={linkedinLogo} alt={altLinkedinLogo} /></a></li>
            <li><a href="#" aria-label={altXLogo} target="_blank" rel="noopener noreferrer"><img src={xLogo} alt={altXLogo} /></a></li>
            <li><a href="#" aria-label={altFacebookLogo} target="_blank" rel="noopener noreferrer"><img src={facebookLogo} alt={altFacebookLogo} /></a></li>
            <li><a href="#" aria-label={altInstagramLogo} target="_blank" rel="noopener noreferrer"><img src={instagramLogo} alt={altInstagramLogo} /></a></li>
        </ul>
        <article>
            © {new Date().getFullYear()} — Tu proyecto
        </article>
    </footer>
  );
}

export default Footer;