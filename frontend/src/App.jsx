import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Gigs from "./pages/client/Gigs";
import GigDetails from "./pages/client/GigDetails";
import ClientBookings from "./pages/client/ClientBookings";

import RoleRoute from "./components/RoleRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import MyGigs from "./pages/freelancer/MyGigs";
import CreateGig from "./pages/freelancer/CreateGig";
import EditGig from "./pages/freelancer/EditGig";
import FreelancerBookings from "./pages/freelancer/FreelancerBookings";
import Income from "./pages/freelancer/Income";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/gigs"
          element={
            <ProtectedRoute>
              <Gigs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gigs/:id"
          element={
            <ProtectedRoute>
              <GigDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <ClientBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/freelancer"
          element={
            <RoleRoute allowedRoles={["freelancer"]}>
              <FreelancerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/freelancer/gigs"
          element={
            <RoleRoute allowedRoles={["freelancer"]}>
              <MyGigs />
            </RoleRoute>
          }
        />

        <Route
          path="/freelancer/gigs/create"
          element={
            <RoleRoute allowedRoles={["freelancer"]}>
              <CreateGig />
            </RoleRoute>
          }
        />

        <Route
          path="/freelancer/gigs/:id/edit"
          element={
            <RoleRoute allowedRoles={["freelancer"]}>
              <EditGig />
            </RoleRoute>
          }
        />

        <Route
          path="/freelancer/bookings"
          element={
            <RoleRoute allowedRoles={["freelancer"]}>
              <FreelancerBookings />
            </RoleRoute>
          }
        />

        <Route
          path="/freelancer/income"
          element={
            <RoleRoute allowedRoles={["freelancer"]}>
              <Income />
            </RoleRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}