import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-4 mt-auto">
      <div className="container">
        <nav aria-label="Footer navigation">
          <ul className="nav justify-content-center flex-wrap gap-2">
            <li className="nav-item">
              <NavLink
                to="/About"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active text-white" : "nav-link text-white-50"
                }
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Contact"
                className={({ isActive }) =>
                  isActive ? "nav-link active text-white" : "nav-link text-white-50"
                }
              >
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/News"
                className={({ isActive }) =>
                  isActive ? "nav-link active text-white" : "nav-link text-white-50"
                }
              >
                News
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Terms"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active text-white" : "nav-link text-white-50"
                }
              >
                Terms
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/API"
                className={({ isActive }) =>
                  isActive ? "nav-link active text-white" : "nav-link text-white-50"
                }
              >
                API
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Roadmap"
                className={({ isActive }) =>
                  isActive ? "nav-link active text-white" : "nav-link text-white-50"
                }
              >
                Roadmap
              </NavLink>
            </li>
          </ul>

          <div className="text-center small mt-3 text-white-50">
            © {new Date().getFullYear()} — Tu proyecto
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;