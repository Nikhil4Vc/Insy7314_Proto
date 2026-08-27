import "@testing-library/jest-dom/vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import Login from "./Login";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../context/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin
  })
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("Login", () => {
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
  screen.getByRole("heading", {
    name: "Welcome back"
  })
).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Login"
      })
    ).toBeInTheDocument();
  });

  test("submits email and password", async () => {
    mockLogin.mockResolvedValue({
      user: {
        name: "Test Client",
        role: "client"
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email"),
      {
        target: {
          value: "client@example.com"
        }
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "SecurePass123!"
        }
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Login"
      })
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "client@example.com",
        "SecurePass123!"
      );
    });
  });

  test("redirects client to gigs after successful login", async () => {
    mockLogin.mockResolvedValue({
      user: {
        name: "Test Client",
        role: "client"
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email"),
      {
        target: {
          value: "client@example.com"
        }
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "SecurePass123!"
        }
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Login"
      })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/gigs"
      );
    });
  });

  test("redirects freelancer to freelancer dashboard", async () => {
    mockLogin.mockResolvedValue({
      user: {
        name: "Test Freelancer",
        role: "freelancer"
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email"),
      {
        target: {
          value: "freelancer@example.com"
        }
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "SecurePass123!"
        }
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Login"
      })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/freelancer"
      );
    });
  });

  test("shows login error returned by API", async () => {
    mockLogin.mockRejectedValue({
      response: {
        data: {
          message: "Invalid email or password."
        }
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByLabelText("Email"),
      {
        target: {
          value: "client@example.com"
        }
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password"),
      {
        target: {
          value: "WrongPassword123!"
        }
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Login"
      })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Invalid email or password."
    );
  });
});