import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RoleRoute({
  children,
  allowedRoles
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/gigs" replace />;
  }

  return children;
}