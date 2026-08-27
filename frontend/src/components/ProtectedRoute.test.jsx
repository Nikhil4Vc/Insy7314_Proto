import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import ProtectedRoute from "./ProtectedRoute";

vi.mock("../context/useAuth", () => ({
  useAuth: vi.fn()
}));

import { useAuth } from "../context/useAuth";

describe("ProtectedRoute", () => {
  test("shows loading state while authentication is loading", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Protected Content</p>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  test("allows authenticated users to access protected content", () => {
    useAuth.mockReturnValue({
      user: {
        name: "Test Client",
        role: "client"
      },
      loading: false
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Protected Content</p>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Protected Content")
    ).toBeInTheDocument();
  });

  test("redirects unauthenticated users to login", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <MemoryRouter initialEntries={["/gigs"]}>
        <ProtectedRoute>
          <p>Protected Content</p>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.queryByText("Protected Content")
    ).not.toBeInTheDocument();
  });
});