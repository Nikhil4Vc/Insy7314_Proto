import {
  useEffect,
  useState
} from "react";

import api from "../api/api";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

export default function ClientBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await api.get(
          "/bookings/mine"
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
          <h1>My Bookings</h1>

          <p className="page-subtitle">
            View the services you have booked.
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
              You have not booked any gigs yet.
            </div>
          )}

        {!loading &&
          !error &&
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
                        {booking.gig?.category}
                      </span>

                      <h2>
                        {booking.gig?.title}
                      </h2>

                      <p className="booking-freelancer">
                        Freelancer:{" "}
                        {booking.freelancer?.name}
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
                      className={
                        booking.status === "booked"
                          ? "status-badge status-booked"
                          : "status-badge"
                      }
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