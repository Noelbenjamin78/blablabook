import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import Library from "../components/library/Library";

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../assets/images/library-read.svg", () => "library-read.svg");
vi.mock("../../assets/images/library-to-read.svg", () => "library-to-read.svg");

vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => "fake-user-id"),
});

vi.mock("@/api/library/fetchUserBooks", () => ({
  default: vi
    .fn()
    .mockResolvedValue([{ status: 1 }, { status: 1 }, { status: 0 }]),
}));

describe("Library component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("displays the correct counts of books", async () => {
    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.findByText(/2 livres lus/i));
      expect(screen.findByText(/1 à lire/i));
    });
  });

  it("redirects to the books read page when the card is clicked", async () => {
    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>,
    );

    const card = await screen.findByText(/Mes livres lus/i);
    card.click();

    expect(mockNavigate).toHaveBeenCalledWith("/library/books-read");
  });

  it("redirects to the books to read page when the card is clicked", async () => {
    render(
      <MemoryRouter>
        <Library />
      </MemoryRouter>,
    );

    const card = await screen.findByText(/Mes livres à lire/i);
    card.click();

    expect(mockNavigate).toHaveBeenCalledWith("/library/books-to-read");
  });

  render(
    <MemoryRouter>
      <Library />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: /ma bibliothèque/i }),
  ).toBeTruthy();
});
