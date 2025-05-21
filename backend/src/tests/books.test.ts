import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";

describe("book.controller - getBooks", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let getAllBooksMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    getAllBooksMock = vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "Test Book 1",
        author: "Author 1",
        genre_id: 1,
        genre_name: "Fiction"
      },
      {
        id: 2,
        title: "Test Book 2",
        author: "Author 2",
        genre_id: 2,
        genre_name: "Non-Fiction"
      }
    ]);

    vi.doMock("../repositories/book.repository", () => ({
      getAllBooks: getAllBooksMock,
      getOneBookById: vi.fn()
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockReq = {};

    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  it("should return all books when successful", async () => {
    const { getBooks } = await import("../controllers/books.controller");

    await getBooks(mockReq as Request, mockRes as Response);

    expect(getAllBooksMock).toHaveBeenCalled();
    expect(jsonSpy).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 1,
        title: "Test Book 1"
      }),
      expect.objectContaining({
        id: 2,
        title: "Test Book 2"
      })
    ]);
  });

  it("should return 500 if an exception is thrown", async () => {
    getAllBooksMock.mockRejectedValue(new Error("DB error"));

    const { getBooks } = await import("../controllers/books.controller");

    await getBooks(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Erreur lors de la récupération des livres"
    });
  });
});

describe("book.controller - getBook", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let getOneBookByIdMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    getOneBookByIdMock = vi.fn().mockResolvedValue({
      id: 1,
      title: "Test Book",
      author: "Test Author",
      genre_id: 1,
      genre_name: "Fiction"
    });

    vi.doMock("../repositories/book.repository", () => ({
      getAllBooks: vi.fn(),
      getOneBookById: getOneBookByIdMock
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockReq = {
      params: {
        id: "1"
      }
    };

    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  it("should return a book when found", async () => {
    const { getBook } = await import("../controllers/books.controller");

    await getBook(mockReq as Request, mockRes as Response);

    expect(getOneBookByIdMock).toHaveBeenCalledWith(1);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: "Test Book"
      })
    );
  });

  it("should return 400 if id is invalid", async () => {
    mockReq.params = { id: "invalid" };

    const { getBook } = await import("../controllers/books.controller");

    await getBook(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "ID invalide"
    });
  });

  it("should return 404 if book is not found", async () => {
    getOneBookByIdMock.mockResolvedValue(null);

    const { getBook } = await import("../controllers/books.controller");

    await getBook(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Livre non trouvé"
    });
  });

  it("should return 500 if an exception is thrown", async () => {
    getOneBookByIdMock.mockRejectedValue(new Error("DB error"));

    const { getBook } = await import("../controllers/books.controller");

    await getBook(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Erreur lors de la récupération du livre"
    });
  });
});