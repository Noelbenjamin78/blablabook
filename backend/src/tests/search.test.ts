import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";

describe("book.controller - searchBooks", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let searchBooksByTitleMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    searchBooksByTitleMock = vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "Test Book Search",
        author: "Search Author",
        genre_id: 1,
        genre_name: "Thriller"
      }
    ]);

    vi.doMock("../repositories/book.repository", () => ({
      searchBooksByTitle: searchBooksByTitleMock
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  it("should return 400 if name query param is missing", async () => {
    mockReq = { query: {} };

    const { searchBooks } = await import("../controllers/search.controller");

    await searchBooks(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: 'Le paramètre "name" est requis'
    });
  });

  it("should return 400 if name query param is not a string", async () => {
    mockReq = {
        query: { name: 123 }
      } as unknown as Request; 

    const { searchBooks } = await import("../controllers/search.controller");

    await searchBooks(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: 'Le paramètre "name" est requis'
    });
  });

  it("should return matching books when name is valid", async () => {
    mockReq = { query: { name: "Test" } };

    const { searchBooks } = await import("../controllers/search.controller");

    await searchBooks(mockReq as Request, mockRes as Response);

    expect(searchBooksByTitleMock).toHaveBeenCalledWith("Test");
    expect(jsonSpy).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 1,
        title: "Test Book Search"
      })
    ]);
  });

  it("should return 500 if an exception is thrown", async () => {
    searchBooksByTitleMock.mockRejectedValue(new Error("DB error"));

    mockReq = { query: { name: "Test" } };

    const { searchBooks } = await import("../controllers/search.controller");

    await searchBooks(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Erreur lors de la recherche"
    });
  });
});