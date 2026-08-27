import {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import api from "../../api/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function MyGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGigs() {
      try {
        const response = await api.get(
          "/gigs/mine"
        );

        setGigs(response.data.gigs);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load your gigs."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGigs();
  }, []);

  async function handleDelete(gigId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gig?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await api.delete(`/gigs/${gigId}`);

      setGigs((currentGigs) =>
        currentGigs.filter(
          (gig) => gig._id !== gigId
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete gig."
      );
    }
  }

  return (
    <>
      <Navbar />

      <PageContainer>
        <section className="page-header page-header-actions">
          <div>
            <h1>My Gigs</h1>

            <p className="page-subtitle">
              Manage the services you offer in the
              marketplace.
            </p>
          </div>

          <Link
            to="/freelancer/gigs/create"
            className="button"
          >
            + Create Gig
          </Link>
        </section>

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
              <h2>No gigs yet</h2>

              <p>
                Create your first gig to start
                offering services.
              </p>

              <Link
                to="/freelancer/gigs/create"
                className="button"
              >
                Create Gig
              </Link>
            </div>
          )}

        {!loading &&
          gigs.length > 0 && (
            <div className="card-grid">
              {gigs.map((gig) => (
                <article
                  className="card gig-card"
                  key={gig._id}
                >
                  <div className="gig-card-content">
                    <div className="gig-card-top">
                      <span className="gig-category">
                        {gig.category}
                      </span>

                      <span
                        className={
                          gig.isActive
                            ? "status-badge status-active"
                            : "status-badge"
                        }
                      >
                        {gig.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <h3>{gig.title}</h3>

                    <p className="gig-description">
                      {gig.description}
                    </p>
                  </div>

                  <div className="my-gig-footer">
                    <p className="gig-price">
                      R{gig.price}
                    </p>

                    <div className="actions">
                      <Link
                        to={`/freelancer/gigs/${gig._id}/edit`}
                        className="button button-secondary button-small"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className="button button-danger button-small"
                        onClick={() =>
                          handleDelete(gig._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </PageContainer>
    </>
  );
}