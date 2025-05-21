import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";

describe("library.controller - createLibraryEntry", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let addToLibraryMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    addToLibraryMock = vi.fn().mockResolvedValue({
      id: 1,
      user_id: 1,
      book_id: 2,
      status: 0,
      created_at: new Date().toISOString()
    });

    vi.doMock("../repositories/library.repository", () => ({
      addToLibrary: addToLibraryMock,
      removeFromLibrary: vi.fn(),
      updateLibraryStatus: vi.fn(),
      getLibraryByUser: vi.fn(),
      getLibraryByUserId: vi.fn()
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));
    const sendSpy = vi.fn();

    mockReq = {
      body: {
        user_id: 1,
        book_id: 2,
        status: 0
      }
    };

    mockRes = {
      status: statusSpy,
      json: jsonSpy,
      send: sendSpy
    };
  });

  it("should create a library entry when successful", async () => {
    const { createLibraryEntry } = await import("../controllers/library.controller");

    await createLibraryEntry(mockReq as Request, mockRes as Response);

    expect(addToLibraryMock).toHaveBeenCalledWith({
      user_id: 1,
      book_id: 2,
      status: 0
    });
    expect(statusSpy).toHaveBeenCalledWith(201);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        user_id: 1,
        book_id: 2,
        status: 0
      })
    );
  });

  it("should return 400 if required fields are missing", async () => {
    mockReq.body = {};

    const { createLibraryEntry } = await import("../controllers/library.controller");

    await createLibraryEntry(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "user_id, book_id et status sont requis"
    });
  });

  it("should return 500 if an exception is thrown", async () => {
    addToLibraryMock.mockRejectedValue(new Error("DB error"));

    const { createLibraryEntry } = await import("../controllers/library.controller");

    await createLibraryEntry(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});

describe("library.controller - deleteLibraryEntry", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;
  let sendSpy: Mock;

  let removeFromLibraryMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    removeFromLibraryMock = vi.fn().mockResolvedValue(true);

    vi.doMock("../repositories/library.repository", () => ({
      addToLibrary: vi.fn(),
      removeFromLibrary: removeFromLibraryMock,
      updateLibraryStatus: vi.fn(),
      getLibraryByUser: vi.fn(),
      getLibraryByUserId: vi.fn()
    }));

    jsonSpy = vi.fn();
    sendSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy, send: sendSpy }));

    mockReq = {
      params: {
        userId: "1",
        bookId: "2"
      }
    };

    mockRes = {
      status: statusSpy,
      json: jsonSpy,
      send: sendSpy
    };
  });

  it("should delete a library entry when successful", async () => {
    const { deleteLibraryEntry } = await import("../controllers/library.controller");

    await deleteLibraryEntry(mockReq as Request, mockRes as Response);

    expect(removeFromLibraryMock).toHaveBeenCalledWith(1, 2);
    expect(statusSpy).toHaveBeenCalledWith(204);
    expect(sendSpy).toHaveBeenCalled();
  });

  it("should return 400 if userId or bookId is invalid", async () => {
    mockReq.params = { userId: "invalid", bookId: "2" };

    const { deleteLibraryEntry } = await import("../controllers/library.controller");

    await deleteLibraryEntry(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "book_id ou user_id invalide"
    });
  });

  it("should return 404 if entry is not found", async () => {
    removeFromLibraryMock.mockResolvedValue(false);

    const { deleteLibraryEntry } = await import("../controllers/library.controller");

    await deleteLibraryEntry(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Entrée non trouvée"
    });
  });

  it("should return 500 if an exception is thrown", async () => {
    removeFromLibraryMock.mockRejectedValue(new Error("DB error"));

    const { deleteLibraryEntry } = await import("../controllers/library.controller");

    await deleteLibraryEntry(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});

describe("library.controller - updateLibraryEntryStatus", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let updateLibraryStatusMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    updateLibraryStatusMock = vi.fn().mockResolvedValue(true);

    vi.doMock("../repositories/library.repository", () => ({
      addToLibrary: vi.fn(),
      removeFromLibrary: vi.fn(),
      updateLibraryStatus: updateLibraryStatusMock,
      getLibraryByUser: vi.fn(),
      getLibraryByUserId: vi.fn()
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockReq = {
      params: {
        id: "1"
      },
      body: {
        status: 1
      }
    };

    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  it("should update a library entry status when successful", async () => {
    const { updateLibraryEntryStatus } = await import("../controllers/library.controller");

    await updateLibraryEntryStatus(mockReq as Request, mockRes as Response);

    expect(updateLibraryStatusMock).toHaveBeenCalledWith(1, 1);
    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith({
      message: "Statut mis à jour pour l'entrée id : 1"
    });
  });

  it("should return 400 if id is invalid", async () => {
    mockReq.params = { id: "invalid" };

    const { updateLibraryEntryStatus } = await import("../controllers/library.controller");

    await updateLibraryEntryStatus(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "ID invalide"
    });
  });

  it("should return 400 if status is invalid", async () => {
    mockReq.body = { status: 2 };

    const { updateLibraryEntryStatus } = await import("../controllers/library.controller");

    await updateLibraryEntryStatus(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Le statut doit être 0 (to read) ou 1 (read)"
    });
  });

  it("should return 404 if entry is not found", async () => {
    updateLibraryStatusMock.mockResolvedValue(false);

    const { updateLibraryEntryStatus } = await import("../controllers/library.controller");

    await updateLibraryEntryStatus(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Entrée non trouvée"
    });
  });

  it("should return 500 if an exception is thrown", async () => {
    updateLibraryStatusMock.mockRejectedValue(new Error("DB error"));

    const { updateLibraryEntryStatus } = await import("../controllers/library.controller");

    await updateLibraryEntryStatus(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});

describe("library.controller - getUserLibraryEntries", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let getLibraryByUserMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    getLibraryByUserMock = vi.fn().mockResolvedValue([
      {
        id: 1,
        user_id: 1,
        book_id: 1,
        status: 0,
        title: "Book 1",
        author: "Author 1",
        genre_name: "Fiction"
      },
      {
        id: 2,
        user_id: 1,
        book_id: 2,
        status: 1,
        title: "Book 2",
        author: "Author 2",
        genre_name: "Non-Fiction"
      }
    ]);

    vi.doMock("../repositories/library.repository", () => ({
      addToLibrary: vi.fn(),
      removeFromLibrary: vi.fn(),
      updateLibraryStatus: vi.fn(),
      getLibraryByUser: getLibraryByUserMock,
      getLibraryByUserId: vi.fn()
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockReq = {
      params: {
        userId: "1"
      },
      query: {}
    };

    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  it("should return all user library entries when successful", async () => {
    const { getUserLibraryEntries } = await import("../controllers/library.controller");

    await getUserLibraryEntries(mockReq as Request, mockRes as Response);

    expect(getLibraryByUserMock).toHaveBeenCalledWith(1, undefined);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          user_id: 1,
          book_id: 1
        }),
        expect.objectContaining({
          id: 2,
          user_id: 1,
          book_id: 2
        })
      ])
    );
  });

  it("should filter by 'read' status when query parameter is provided", async () => {
    mockReq.query = { status: "read" };

    const { getUserLibraryEntries } = await import("../controllers/library.controller");

    await getUserLibraryEntries(mockReq as Request, mockRes as Response);

    expect(getLibraryByUserMock).toHaveBeenCalledWith(1, 1);
    expect(jsonSpy).toHaveBeenCalled();
  });

  it("should filter by 'toread' status when query parameter is provided", async () => {
    mockReq.query = { status: "toread" };

    const { getUserLibraryEntries } = await import("../controllers/library.controller");

    await getUserLibraryEntries(mockReq as Request, mockRes as Response);

    expect(getLibraryByUserMock).toHaveBeenCalledWith(1, 0);
    expect(jsonSpy).toHaveBeenCalled();
  });

  it("should return 400 if userId is invalid", async () => {
    mockReq.params = { userId: "invalid" };

    const { getUserLibraryEntries } = await import("../controllers/library.controller");

    await getUserLibraryEntries(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Paramètre userId invalide"
    });
  });

  it("should return 400 if status query parameter is invalid", async () => {
    mockReq.query = { status: "invalid" };

    const { getUserLibraryEntries } = await import("../controllers/library.controller");

    await getUserLibraryEntries(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "status doit être \"read\" ou \"toread\""
    });
  });

  it("should return 500 if an exception is thrown", async () => {
    getLibraryByUserMock.mockRejectedValue(new Error("DB error"));

    const { getUserLibraryEntries } = await import("../controllers/library.controller");

    await getUserLibraryEntries(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});

describe("library.controller - getUserBookEntry", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let getLibraryByUserMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    getLibraryByUserMock = vi.fn().mockResolvedValue([
      {
        id: 1,
        user_id: 1,
        book_id: 1,
        status: 0,
        title: "Book 1",
        author: "Author 1",
        genre_name: "Fiction"
      },
      {
        id: 2,
        user_id: 1,
        book_id: 2,
        status: 1,
        title: "Book 2",
        author: "Author 2",
        genre_name: "Non-Fiction"
      }
    ]);

    vi.doMock("../repositories/library.repository", () => ({
      addToLibrary: vi.fn(),
      removeFromLibrary: vi.fn(),
      updateLibraryStatus: vi.fn(),
      getLibraryByUser: getLibraryByUserMock,
      getLibraryByUserId: vi.fn()
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockReq = {
      params: {
        userId: "1",
        bookId: "2"
      }
    };

    mockRes = {
      status: statusSpy,
      json: jsonSpy
    };
  });

  it("should return specific book entry when found", async () => {
    const { getUserBookEntry } = await import("../controllers/library.controller");

    await getUserBookEntry(mockReq as Request, mockRes as Response);

    expect(getLibraryByUserMock).toHaveBeenCalledWith(1);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        user_id: 1,
        book_id: 2,
        title: "Book 2"
      })
    );
  });

  it("should return 400 if userId or bookId is invalid", async () => {
    mockReq.params = { userId: "invalid", bookId: "2" };

    const { getUserBookEntry } = await import("../controllers/library.controller");

    await getUserBookEntry(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "userId ou bookId invalide"
    });
  });

  it("should return 404 if book entry is not found", async () => {
    mockReq.params = { userId: "1", bookId: "3" };

    const { getUserBookEntry } = await import("../controllers/library.controller");

    await getUserBookEntry(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Livre non trouvé dans la bibliothèque de cet utilisateur"
    });
  });

  it("should return 500 if an exception is thrown", async () => {
    getLibraryByUserMock.mockRejectedValue(new Error("DB error"));

    const originalConsoleError = console.error;
    console.error = vi.fn();

    const { getUserBookEntry } = await import("../controllers/library.controller");

    await getUserBookEntry(mockReq as Request, mockRes as Response);

    console.error = originalConsoleError;

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Erreur lors de la récupération du livre"
    });
  });
});