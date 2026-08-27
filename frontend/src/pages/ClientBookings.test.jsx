import "@testing-library/jest-dom/vitest";

import {
  render,
  screen,
  waitFor
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import {
  beforeEach,
  describe,
  expect,
  test,
  vi
} from "vitest";

import ClientBookings from "./ClientBookings";
import api from "../api/api";

vi.mock("../api/api", () => ({
  default: {
    get: vi.fn()
  }
}));

const mockLogout = vi.fn();

vi.mock("../context/useAuth", () => ({
  useAuth: () => ({
    user: {
      name: "Test Client",
      role: "client"
    },
    logout: mockLogout
  })
}));

describe("ClientBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("requests the client's bookings from the backend", async () => {
    api.get.mockResolvedValue({
      data: {
        bookings: []
      }
    });

    render(
      <MemoryRouter>
        <ClientBookings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  test("displays bookings returned by the API", async () => {
    api.get.mockResolvedValue({
      data: {
        bookings: [
          {
            _id: "booking-1",
            gig: {
              _id: "gig-1",
              title: "Website Development",
              category: "Web Development"
            },
            freelancer: {
              _id: "freelancer-1",
              name: "Test Freelancer",
              email: "freelancer@example.com"
            },
            price: 1500,
            status: "booked",
            createdAt: "2026-08-22T13:54:08.017Z"
          }
        ]
      }
    });

    render(
      <MemoryRouter>
        <ClientBookings />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Website Development")
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("Test Freelancer")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("1500")
      )
    ).toBeInTheDocument();

    expect(
  screen.getByText("booked", {
    selector: ".status-badge"
  })
).toBeInTheDocument();
  });

  test("shows a message when the client has no bookings", async () => {
    api.get.mockResolvedValue({
      data: {
        bookings: []
      }
    });

    render(
      <MemoryRouter>
        <ClientBookings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/loading/i)
      ).not.toBeInTheDocument();
    });

    expect(
  screen.getByText(
    "You have not booked any gigs yet."
  )
).toBeInTheDocument();
  });

  test("shows an error when bookings cannot be loaded", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {
          message: "Unable to retrieve bookings."
        }
      }
    });

    render(
      <MemoryRouter>
        <ClientBookings />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Unable to retrieve bookings."
    );
  });
});