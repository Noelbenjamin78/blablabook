import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import BooksRead from "../components/library/BooksRead";

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => true,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => "fake-user-id"),
});

vi.mock("@/api/library/fetchUserBooks", () => ({
  default: vi.fn().mockResolvedValue([
    {
      book_id: 5,
      title: "Le Nom du vent",
      author: "Patrick Rothfuss",
      status: 1,
    },
    {
      book_id: 14,
      title: "Bilbo le Hobbit",
      author: "J.R.R. Tolkien",
      status: 1,
    },
  ]),
}));

describe("BooksRead component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders correctly the title of the page", async () => {
    render(
      <MemoryRouter>
        <BooksRead />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Mes livres lus/i)).toBeInTheDocument();
    });
  });

  it("renders multiple books correctly", async () => {
    render(
      <MemoryRouter>
        <BooksRead />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Le Nom du vent/i)).toBeInTheDocument();
    expect(await screen.findByText(/Bilbo le Hobbit/i)).toBeInTheDocument();
    // should not be present in the list. Can be tested with ".not.toBeInTheDocument()"
    expect(await screen.queryByText(/nawak/i)).not.toBeInTheDocument();
  });

  it("displays the correct count of books", async () => {
    render(
      <MemoryRouter initialEntries={["/library/books-read"]}>
        <BooksRead />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/3 livre lus/i)).toBeInTheDocument();
    });
  });

  it("redirects to the book details page when a book is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/library/books-read"]}>
        <BooksRead />
      </MemoryRouter>,
    );

    const book = await screen.findByText(/Le Nom du vent/i);
    await user.click(book);

    expect(mockNavigate).toHaveBeenCalledWith("/book/5");
  });

  // mobile
  it("renders differently on mobile", async () => {
    render(
      <MemoryRouter initialEntries={["/library/books-read"]}>
        <BooksRead />
      </MemoryRouter>,
    );

    const cell = await screen.findByText(/Le Nom du vent/i);
    expect(cell).toHaveClass("italic");
  });
});
