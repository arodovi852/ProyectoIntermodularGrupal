import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            BROADCASTTD
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? "nav-link active text-white" : "nav-link text-white-50"
                  }
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/Profile"
                  className={({ isActive }) =>
                    isActive ? "nav-link active text-white" : "nav-link text-white-50"
                  }
                >
                  Profile
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/Configuration"
                  className={({ isActive }) =>
                    isActive ? "nav-link active text-white" : "nav-link text-white-50"
                  }
                >
                  Configuration
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;