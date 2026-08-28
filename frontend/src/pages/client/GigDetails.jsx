import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../../api/api";
import { useAuth } from "../../context/useAuth";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGig() {
      try {
        const response = await api.get(
          `/gigs/${id}`
        );

        setGig(response.data.gig);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
          "Unable to load gig."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGig();
  }, [id]);

  async function handleBooking() {
    setError("");
    setBooking(true);

    try {
      await api.post("/bookings", {
        gigId: id
      });

      navigate("/bookings");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to book this gig."
      );
    } finally {
      setBooking(false);
    }
  }

  return (
    <>
      <Navbar />

      <PageContainer narrow>
        <Link
          to="/gigs"
          className="back-link"
        >
          ← Back to marketplace
        </Link>

        {loading && (
          <p>Loading gig...</p>
        )}

        {!loading && error && !gig && (
          <div
            className="error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && gig && (
          <article className="card gig-details-card">
            <span className="gig-category">
              {gig.category}
            </span>

            <h1>{gig.title}</h1>

            <p className="gig-details-description">
              {gig.description}
            </p>

            <div className="gig-details-meta">
              <div>
                <span className="meta-label">
                  Freelancer
                </span>

                <strong>
                  {gig.freelancer?.name ||
                    "Unavailable"}
                </strong>
              </div>

              <div>
                <span className="meta-label">
                  Price
                </span>

                <strong className="gig-details-price">
                  R{gig.price}
                </strong>
              </div>
            </div>

            {error && (
              <div
                className="error-message"
                role="alert"
              >
                {error}
              </div>
            )}

            {user?.role === "client" && (
              <button
                type="button"
                className="button booking-button"
                onClick={handleBooking}
                disabled={booking}
              >
                {booking
                  ? "Booking..."
                  : `Book for R${gig.price}`}
              </button>
            )}
          </article>
        )}
      </PageContainer>
    </>
  );
}