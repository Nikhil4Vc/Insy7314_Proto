import {
  useEffect,
  useState
} from "react";

import api from "../../api/api";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function FreelancerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await api.get(
          "/bookings/freelancer"
        );

        setBookings(response.data.bookings);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <>
      <Navbar />

      <PageContainer>
        <section className="page-header">
          <h1>Client Bookings</h1>

          <p className="page-subtitle">
            View clients who have booked your services.
          </p>
        </section>

        {loading && (
          <p>Loading bookings...</p>
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
          bookings.length === 0 && (
            <div className="empty-state">
              <h2>No bookings yet</h2>

              <p>
                Client bookings for your gigs will
                appear here.
              </p>
            </div>
          )}

        {!loading &&
          bookings.length > 0 && (
            <div className="booking-list">
              {bookings.map((booking) => (
                <article
                  className="card booking-card"
                  key={booking._id}
                >
                  <div className="booking-main">
                    <div>
                      <span className="gig-category">
                        {booking.gig?.category ||
                          "Service"}
                      </span>

                      <h2>
                        {booking.gig?.title ||
                          "Gig"}
                      </h2>

                      <p className="booking-freelancer">
                        Client:{" "}
                        {booking.client?.name ||
                          "Unknown client"}
                      </p>
                    </div>

                    <div className="booking-price-block">
                      <span className="meta-label">
                        Price
                      </span>

                      <strong>
                        R{booking.price}
                      </strong>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <span
                      className={`status-badge status-${booking.status}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
      </PageContainer>
    </>
  );
}