import "@testing-library/jest-dom/vitest";

import {
  fireEvent,
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

import MyGigs from "./MyGigs";
import api from "../../api/api";

vi.mock("../../api/api", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn()
  }
}));

const mockLogout = vi.fn();

vi.mock("../../context/useAuth", () => ({
  useAuth: () => ({
    user: {
      name: "Test Freelancer",
      role: "freelancer"
    },
    logout: mockLogout
  })
}));

describe("MyGigs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loads and displays freelancer gigs", async () => {
    api.get.mockResolvedValue({
      data: {
        gigs: [
          {
            _id: "gig-1",
            title: "Website Development",
            description: "Responsive website development service.",
            category: "Web Development",
            price: 1500,
            isActive: true
          }
        ]
      }
    });

    render(
      <MemoryRouter>
        <MyGigs />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading gigs/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Website Development")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Responsive website development service."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("1500")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("Active")
      )
    ).toBeInTheDocument();
  });

  test("requests freelancer gigs from the correct endpoint", async () => {
    api.get.mockResolvedValue({
      data: {
        gigs: []
      }
    });

    render(
      <MemoryRouter>
        <MyGigs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/gigs/mine"
      );
    });
  });

  test("shows an empty message when freelancer has no gigs", async () => {
    api.get.mockResolvedValue({
      data: {
        gigs: []
      }
    });

    render(
      <MemoryRouter>
        <MyGigs />
      </MemoryRouter>
    );

    expect(
  await screen.findByText("No gigs yet")
).toBeInTheDocument();
  });

  test("deletes a gig after confirmation", async () => {
    api.get.mockResolvedValue({
      data: {
        gigs: [
          {
            _id: "gig-1",
            title: "Website Development",
            description: "Responsive website development service.",
            category: "Web Development",
            price: 1500,
            isActive: true
          }
        ]
      }
    });

    api.delete.mockResolvedValue({
      data: {
        success: true
      }
    });

    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    render(
      <MemoryRouter>
        <MyGigs />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Website Development")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete"
      })
    );

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(
        "/gigs/gig-1"
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Website Development")
      ).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });

  test("shows an error when gigs cannot be loaded", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {
          message: "Unable to retrieve your gigs."
        }
      }
    });

    render(
      <MemoryRouter>
        <MyGigs />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Unable to retrieve your gigs."
    );
  });
});