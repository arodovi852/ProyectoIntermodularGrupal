import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
        <a><Link to="/">BROADCASTTD</Link></a>
        <nav id="mainNavbar">
            <ul>
                <li><NavLink to="/" end>Home</NavLink></li>
                <li><NavLink to="/Profile">Profile</NavLink></li>
                <li><NavLink to="/Configuration">Configuration</NavLink></li>
            </ul>
        </nav>
    </header>
  );
}

export default Header;