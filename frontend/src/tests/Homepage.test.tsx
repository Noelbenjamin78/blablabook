import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import Homepage from "../pages/Homepage";
import { MemoryRouter } from "react-router-dom";
import fetchBooks from "@/api/books/fetchBooks";
import { useIsMobile } from "../hooks/use-mobile";

vi.mock("../hooks/use-mobile", () => ({
  useIsMobile: vi.fn(),
}));

vi.mock("@/api/books/fetchBooks", () => ({
  default: vi.fn(),
}));
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockBooks = [
  {
    id: 1,
    title: "Le Petit Prince",
    genre_name: "Fiction",
    image: "https://example.com/le-petit-prince.jpg",
  },
  {
    id: 2,
    title: "Cosmos",
    genre_name: "Science",
    image: "https://example.com/cosmos.jpg",
  },
  
];

describe("Homepage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchBooks as any).mockResolvedValue(mockBooks);
    (useIsMobile as any).mockReturnValue(false);
  });

  it("renders the homepage with unique books per genre", async () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Réunion de passionnés")).toBeInTheDocument();
    });

    expect(screen.getByText(/Fiction/i)).toBeInTheDocument();
    expect(screen.getByText(/Science/i)).toBeInTheDocument();
  });

  it("renders differently for mobile", async () => {
    (useIsMobile as any).mockReturnValue(true);

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Réunion de passionnés")).toBeInTheDocument();
    });

    const image = screen.getAllByRole("img")[0];
    expect(image.className).toMatch(/h-45/);
  });

  it("navigates to book detail on click", async () => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Réunion de passionnés")).toBeInTheDocument();
    });

    const bookCard = screen.getByText("Le Petit Prince");
    bookCard.click();
    expect(mockNavigate).toHaveBeenCalledWith("/book/1");

  });
 
});
