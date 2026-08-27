import {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import api from "../api/api";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    async function loadGigs() {
      try {
        const response = await api.get("/gigs");

        setGigs(response.data.gigs);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load gigs."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGigs();
  }, []);

  return (
    <>
      <Navbar />

      <PageContainer>
        <section className="page-header">
          <h1>Marketplace</h1>

          <p className="page-subtitle">
            Welcome, {user?.name}. Browse services offered
            by freelancers.
          </p>
        </section>

        <section>
          <div className="section-heading">
            <h2>Available Gigs</h2>

            {gigs.length > 0 && (
              <span className="result-count">
                {gigs.length}{" "}
                {gigs.length === 1 ? "gig" : "gigs"}
              </span>
            )}
          </div>

          {loading && (
            <p>Loading gigs...</p>
          )}

          {error && (
            <div
              className="error-message"
              role="alert"
            >
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            gigs.length === 0 && (
              <div className="empty-state">
                No gigs are currently available.
              </div>
            )}

          {!loading &&
            !error &&
            gigs.length > 0 && (
              <div className="card-grid">
                {gigs.map((gig) => (
                  <article
                    className="card gig-card"
                    key={gig._id}
                  >
                    <div className="gig-card-content">
                      <span className="gig-category">
                        {gig.category}
                      </span>

                      <h3>{gig.title}</h3>

                      <p className="gig-description">
                        {gig.description}
                      </p>
                    </div>

                    <div className="gig-card-footer">
                      <div>
                        <p className="gig-price">
                          R{gig.price}
                        </p>

                        <p className="gig-freelancer">
                          Freelancer:{" "}
                          {gig.freelancer?.name ||
                            "Unavailable"}
                        </p>
                      </div>

                      <Link
                        to={`/gigs/${gig._id}`}
                        className="button"
                      >
                        View Gig
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </PageContainer>
    </>
  );
}