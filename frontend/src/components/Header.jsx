import { Link, NavLink, useNavigate } from "react-router-dom";
import { UseAuth } from "../hooks/UseAuth.jsx";

function Header() {
  const { isAuthenticated, logout } = UseAuth();

  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
      <header>
          <Link to="/">BROADCASTTD</Link>
          <nav id="mainNavbar">
              <ul>
                  <li><NavLink to="/" end>Home</NavLink></li>
                  {isAuthenticated ? (
                      <>
                          <li><NavLink to="/DashBoard">Dashboard</NavLink></li>
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