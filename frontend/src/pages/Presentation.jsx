import { NavLink } from "react-router-dom";

function Presentation() {
  return (
    <main className="container py-5">
      <section className="row align-items-center py-5">
        <div className="col-md-6">
          <h1 className="display-5 fw-bold">Track. Rate. Discover.</h1>
          <p className="lead text-muted">Track series. Rate them. See what's good.</p>
          <NavLink to="/Register" className="btn btn-primary btn-lg mt-3">
            Get started
          </NavLink>
        </div>

        <div className="col-md-6 d-none d-md-block">
          <div className="bg-light border rounded p-3" style={{ height: 220 }}>
            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
              Imagen / Promo
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Popular this week</h3>
          <NavLink to="/Popular" className="text-decoration-none small">
            See more
          </NavLink>
        </div>

        <div className="row g-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="col-6 col-md-4">
              <div className="card h-100">
                <div className="ratio ratio-16x9 bg-secondary"></div>
                <div className="card-body">
                  <h5 className="card-title mb-1">Title {i + 1}</h5>
                  <p className="card-text text-muted small">Short description</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Presentation;