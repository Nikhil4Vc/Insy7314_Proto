import { Link } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

export default function FreelancerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <PageContainer>
        <section className="page-header">
          <h1>Freelancer Dashboard</h1>

          <p className="page-subtitle">
            Welcome, {user?.name}. Manage your gigs,
            bookings and income.
          </p>
        </section>

        <div className="dashboard-actions">
          <Link
            to="/freelancer/gigs"
            className="card dashboard-card"
          >
            <div>
              <h2>My Gigs</h2>

              <p>
                View, edit and manage the services
                you offer.
              </p>
            </div>

            <span className="dashboard-card-link">
              Manage gigs →
            </span>
          </Link>

          <Link
            to="/freelancer/bookings"
            className="card dashboard-card"
          >
            <div>
              <h2>Bookings</h2>

              <p>
                View clients who have booked your
                services.
              </p>
            </div>

            <span className="dashboard-card-link">
              View bookings →
            </span>
          </Link>

          <Link
            to="/freelancer/income"
            className="card dashboard-card"
          >
            <div>
              <h2>Income</h2>

              <p>
                Review your completed transactions
                and earnings.
              </p>
            </div>

            <span className="dashboard-card-link">
              View income →
            </span>
          </Link>
        </div>

        <section className="dashboard-create">
          <div>
            <h2>Offer a new service</h2>

            <p>
              Create a gig and make it available
              in the marketplace.
            </p>
          </div>

          <Link
            to="/freelancer/gigs/create"
            className="button"
          >
            + Create Gig
          </Link>
        </section>
      </PageContainer>
    </>
  );
}