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

import Income from "./Income";
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

describe("Income", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("requests freelancer income from the backend", async () => {
    api.get.mockResolvedValue({
      data: {
        totalIncome: 0,
        transactionCount: 0,
        transactions: []
      }
    });

    render(
      <MemoryRouter>
        <Income />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/bookings/income"
      );
    });
  });

  test("displays total income and transaction details", async () => {
    api.get.mockResolvedValue({
      data: {
        totalIncome: 2500,
        transactionCount: 2,
        transactions: [
          {
            _id: "transaction-1",
            amount: 1500,
            type: "booking_payment",
            status: "completed",
            createdAt: "2026-08-22T13:54:08.017Z"
          },
          {
            _id: "transaction-2",
            amount: 1000,
            type: "booking_payment",
            status: "completed",
            createdAt: "2026-08-22T14:14:58.403Z"
          }
        ]
      }
    });

    render(
      <MemoryRouter>
        <Income />
      </MemoryRouter>
    );

    expect(
      await screen.findByText((content) =>
        content.includes("2500")
      )
    ).toBeInTheDocument();

  expect(
  screen.getByText("Completed Transactions")
).toBeInTheDocument();

expect(
  screen.getByText("2", {
    selector: ".summary-value"
  })
).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("1500")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("1000")
      )
    ).toBeInTheDocument();

    expect(
      screen.getAllByText((content) =>
        content.includes("completed")
      ).length
    ).toBeGreaterThanOrEqual(2);
  });

  test("shows a message when there are no transactions", async () => {
    api.get.mockResolvedValue({
      data: {
        totalIncome: 0,
        transactionCount: 0,
        transactions: []
      }
    });

    render(
      <MemoryRouter>
        <Income />
      </MemoryRouter>
    );

    expect(
  await screen.findByText(
    "No transactions yet"
  )
).toBeInTheDocument();
  });

  test("shows an error when income cannot be loaded", async () => {
    api.get.mockRejectedValue({
      response: {
        data: {
          message: "Unable to retrieve income."
        }
      }
    });

    render(
      <MemoryRouter>
        <Income />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Unable to retrieve income."
    );
  });
});