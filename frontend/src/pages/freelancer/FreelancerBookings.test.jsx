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

import FreelancerBookings from "./FreelancerBookings";
import api from "../../api/api";

const mockLogout = vi.fn();

vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn()
  }
}));

vi.mock("../../context/useAuth", () => ({
  useAuth: () => ({
    user: {
      name: "Test Freelancer",
      role: "freelancer"
    },
    logout: mockLogout
  })
}));

describe("FreelancerBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("requests freelancer bookings from the backend", async () => {
    api.get.mockResolvedValue({
      data: {
        bookings: []
      }
    });

    render(
      <MemoryRouter>
        <FreelancerBookings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/bookings/freelancer"
      );
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
            client: {
              _id: "client-1",
              name: "Test Client",
              email: "client@example.com"
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
        <FreelancerBookings />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Website Development")
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("Test Client")
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

  test("shows a message when there are no freelancer bookings", async () => {
    api.get.mockResolvedValue({
      data: {
        bookings: []
      }
    });

    render(
      <MemoryRouter>
        <FreelancerBookings />
      </MemoryRouter>
    );

    expect(
  await screen.findByText("No bookings yet")
).toBeInTheDocument();
  });

  test("shows an error when bookings cannot be loaded", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {
          message: "Unable to retrieve freelancer bookings."
        }
      }
    });

    render(
      <MemoryRouter>
        <FreelancerBookings />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Unable to retrieve freelancer bookings."
    );
  });
});