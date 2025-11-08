// javascript
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
    <footer className="bg-dark text-white-50 py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6">
            <nav aria-label="Footer navigation">
              <ul className="nav justify-content-center justify-content-md-start flex-wrap gap-2">
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
            </nav>
          </div>

          <div className="col-12 col-md-6 text-center text-md-end mt-3 mt-md-0">
            <ul className="list-inline mb-2">
              <li className="list-inline-item me-2">
                <a
                  href="#"
                  className="d-inline-block"
                  aria-label={altLinkedinLogo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedinLogo} alt={altLinkedinLogo} className="img-fluid rounded" style={{ width: 28, height: 28 }} />
                </a>
              </li>
              <li className="list-inline-item me-2">
                <a
                  href="#"
                  className="d-inline-block"
                  aria-label={altXLogo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={xLogo} alt={altXLogo} className="img-fluid rounded" style={{ width: 28, height: 28 }} />
                </a>
              </li>
              <li className="list-inline-item me-2">
                <a
                  href="#"
                  className="d-inline-block"
                  aria-label={altFacebookLogo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={facebookLogo} alt={altFacebookLogo} className="img-fluid rounded" style={{ width: 28, height: 28 }} />
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="#"
                  className="d-inline-block"
                  aria-label={altInstagramLogo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={instagramLogo} alt={altInstagramLogo} className="img-fluid rounded" style={{ width: 28, height: 28 }} />
                </a>
              </li>
            </ul>

            <div className="small text-white-50">
              © {new Date().getFullYear()} — Tu proyecto
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;