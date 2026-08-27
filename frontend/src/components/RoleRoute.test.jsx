import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import RoleRoute from "./RoleRoute";

vi.mock("../context/useAuth", () => ({
  useAuth: vi.fn()
}));

import { useAuth } from "../context/useAuth";

describe("RoleRoute", () => {
  test("allows freelancer to access freelancer content", () => {
    useAuth.mockReturnValue({
      user: {
        name: "Test Freelancer",
        role: "freelancer"
      },
      loading: false
    });

    render(
      <MemoryRouter>
        <RoleRoute allowedRoles={["freelancer"]}>
          <p>Freelancer Content</p>
        </RoleRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Freelancer Content")
    ).toBeInTheDocument();
  });

  test("blocks client from accessing freelancer content", () => {
    useAuth.mockReturnValue({
      user: {
        name: "Test Client",
        role: "client"
      },
      loading: false
    });

    render(
      <MemoryRouter initialEntries={["/freelancer"]}>
        <RoleRoute allowedRoles={["freelancer"]}>
          <p>Freelancer Content</p>
        </RoleRoute>
      </MemoryRouter>
    );

    expect(
      screen.queryByText("Freelancer Content")
    ).not.toBeInTheDocument();
  });

  test("redirects unauthenticated users to login", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <MemoryRouter initialEntries={["/freelancer"]}>
        <RoleRoute allowedRoles={["freelancer"]}>
          <p>Freelancer Content</p>
        </RoleRoute>
      </MemoryRouter>
    );

    expect(
      screen.queryByText("Freelancer Content")
    ).not.toBeInTheDocument();
  });
});