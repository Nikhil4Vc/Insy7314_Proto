import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link
          to={user?.role === "freelancer" ? "/freelancer" : "/gigs"}
          className="brand"
        >
          HustleHub+
        </Link>

        {user && (
          <nav className="nav-links">
            {user.role === "client" && (
              <>
                <Link to="/gigs">
                  Marketplace
                </Link>

                <Link to="/bookings">
                  My Bookings
                </Link>
              </>
            )}

            {user.role === "freelancer" && (
              <>
                <Link to="/freelancer">
                  Dashboard
                </Link>

                <Link to="/freelancer/gigs">
                  My Gigs
                </Link>

                <Link to="/freelancer/bookings">
                  Bookings
                </Link>

                <Link to="/freelancer/income">
                  Income
                </Link>
              </>
            )}

            <span className="nav-user">
              {user.name}
            </span>

            <button
              type="button"
              className="button button-secondary button-small"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}