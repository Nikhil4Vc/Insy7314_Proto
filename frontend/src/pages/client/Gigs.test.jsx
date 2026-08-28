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

import Gigs from "./Gigs";
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
      name: "Test Client",
      role: "client"
    },
    logout: mockLogout
  })
}));

describe("Gigs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays available gigs returned by the API", async () => {
    api.get.mockResolvedValue({
      data: {
        gigs: [
          {
            _id: "gig-1",
            title: "Website Development",
            description: "Responsive business website",
            category: "Web Development",
            price: 1500,
            freelancer: {
              name: "Test Freelancer"
            }
          },
          {
            _id: "gig-2",
            title: "Logo Design",
            description: "Professional business logo",
            category: "Graphic Design",
            price: 750,
            freelancer: {
              name: "Second Freelancer"
            }
          }
        ]
      }
    });

    render(
      <MemoryRouter>
        <Gigs />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading gigs/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Website Development")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Logo Design")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/R1500/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/R750/)
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("Test Freelancer")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("Second Freelancer")
      )
    ).toBeInTheDocument();
  });

  test("requests gigs from the backend", async () => {
    api.get.mockResolvedValue({
      data: {
        gigs: []
      }
    });

    render(
      <MemoryRouter>
        <Gigs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/gigs");
    });
  });

  test("shows a message when there are no gigs", async () => {
    api.get.mockResolvedValue({
      data: {
        gigs: []
      }
    });

    render(
      <MemoryRouter>
        <Gigs />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        "No gigs are currently available."
      )
    ).toBeInTheDocument();
  });

  test("shows an error when gigs cannot be loaded", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {
          message: "Unable to retrieve gigs."
        }
      }
    });

    render(
      <MemoryRouter>
        <Gigs />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Unable to retrieve gigs."
    );
  });
});