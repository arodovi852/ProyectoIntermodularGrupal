import { NavLink } from "react-router-dom";

function Profile() {
  return (
    <main className="container py-5">
      <div className="row g-4">
        <aside className="col-12 col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-secondary mb-3 mx-auto"
                style={{ width: 96, height: 96 }}
                aria-hidden="true"
              />
              <h5 className="card-title">Nombre de Usuario</h5>
              <p className="text-muted small mb-2">@username</p>

              <div className="d-flex justify-content-center gap-4 mb-3">
                <div className="text-center">
                  <div className="fw-bold">15</div>
                  <small className="text-muted">Series</small>
                </div>
                <div className="text-center">
                  <div className="fw-bold">240</div>
                  <small className="text-muted">Puntos</small>
                </div>
              </div>

              <NavLink to="/EditProfile" className="btn btn-outline-primary btn-sm">
                Editar perfil
              </NavLink>
            </div>
          </div>
        </aside>

        <section className="col-12 col-md-8">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="mb-0">Logged series</h4>
              <NavLink to="/Logged" className="small text-decoration-none">
                See more
              </NavLink>
            </div>

            <div className="row g-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <article key={i} className="col-6 col-md-3">
                  <div className="card h-100">
                    <div className="ratio ratio-16x9 bg-secondary" />
                    <div className="card-body p-2">
                      <h6 className="card-title mb-1">Serie {i + 1}</h6>
                      <p className="small text-muted mb-0">Season x · y%</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4 className="mb-0">Recently watched</h4>
              <NavLink to="/Recently" className="small text-decoration-none">
                See more
              </NavLink>
            </div>

            <div className="row g-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <article key={`r-${i}`} className="col-6 col-md-4 col-lg-3">
                  <div className="card h-100">
                    <div className="ratio ratio-16x9 bg-secondary" />
                    <div className="card-body p-2">
                      <h6 className="card-title mb-1">Episodio {i + 1}</h6>
                      <p className="small text-muted mb-0">Hace x días</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;