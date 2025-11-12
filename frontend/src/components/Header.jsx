import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth.jsx";
import {use} from "react";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login');};

  return (
      <header>
          <Link to="/">BROADCASTTD</Link>
          <nav id="mainNavbar">
              <ul>
                  <li><NavLink to="/" end>Home</NavLink></li>
                  {user ? (
                      <>
                          <li><NavLink to="/Dashboard">Login</NavLink></li>
                          <li><NavLink to="/Profile">Profile</NavLink></li>
                          <li><NavLink to="/Configuration">Configuration</NavLink></li>
                          <li><button onClick={handleLogout}>Logout</button></li>
                      </>
                  ) : (
                      <>
                          <li><NavLink to="/Login">Login</NavLink></li>
                          <li><NavLink to="/Register">Register</NavLink></li>
                      </>
                  )}
            </ul>
        </nav>
    </header>
  );
}

export default Header;