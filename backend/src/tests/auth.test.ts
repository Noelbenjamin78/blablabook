import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";

describe("auth.controller - login", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonSpy: Mock;
  let statusSpy: Mock;

  let compareMock: ReturnType<typeof vi.fn>;
  let signMock: ReturnType<typeof vi.fn>;
  let findUserByEmailMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();

    compareMock = vi.fn().mockResolvedValue(true);
    signMock = vi.fn().mockReturnValue("fake-jwt-token");
    findUserByEmailMock = vi.fn().mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@email.com",
      password: "hashedpass",
    });

    vi.doMock("bcryptjs", async () => {
      const actual = await vi.importActual<typeof import("bcryptjs")>("bcryptjs");
      return { ...actual, compare: compareMock };
    });

    vi.doMock("jsonwebtoken", async () => {
      const actual = await vi.importActual<typeof import("jsonwebtoken")>("jsonwebtoken");
      return { ...actual, sign: signMock };
    });

    vi.doMock("../repositories/auth.repository", () => ({
      findUserByEmail: findUserByEmailMock,
    }));

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockReq = {
      body: {
        email: "test@email.com",
        password: "password123",
      },
    };

    mockRes = {
      status: statusSpy,
    };
  });

  it("should return 200 and a token if login is successful", async () => {
    const { login } = await import("../controllers/auth.controller");

    await login(mockReq as Request, mockRes as Response);

    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      userId: 1,
    }));
  });

  it("should return 401 if user is not found", async () => {
    findUserByEmailMock.mockResolvedValue(undefined); 
  
    const { login } = await import("../controllers/auth.controller");
  
    await login(mockReq as Request, mockRes as Response);
  
    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Identifiants invalides",
    });
  });

  it("should return 401 if password does not match", async () => {
    compareMock.mockResolvedValue(false);
  
    const { login } = await import("../controllers/auth.controller");
  
    await login(mockReq as Request, mockRes as Response);
  
    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Identifiants invalides",
    });
  });

  it("should return 400 if email or password is missing", async () => {
    mockReq.body = {};
  
    const { login } = await import("../controllers/auth.controller");
  
    await login(mockReq as Request, mockRes as Response);
  
    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Email et mot de passe requis",
    });
  });

  it("should return 500 if an exception is thrown", async () => {
    findUserByEmailMock.mockRejectedValue(new Error("DB error"));
  
    const { login } = await import("../controllers/auth.controller");
  
    await login(mockReq as Request, mockRes as Response);
  
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Erreur lors de la connexion",
    });
  });
});

describe("auth.controller - register", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonSpy: Mock;
    let statusSpy: Mock;
  
    let hashMock: ReturnType<typeof vi.fn>;
    let findUserByEmailOrUsernameMock: ReturnType<typeof vi.fn>;
    let createUserMock: ReturnType<typeof vi.fn>;
  
    beforeEach(async () => {
      vi.resetModules();
  
      hashMock = vi.fn().mockResolvedValue("hashed-password");
      findUserByEmailOrUsernameMock = vi.fn().mockResolvedValue(undefined);
      createUserMock = vi.fn().mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@email.com",
        created_at: new Date().toISOString(),
      });
  
      vi.doMock("bcryptjs", async () => {
        const actual = await vi.importActual<typeof import("bcryptjs")>("bcryptjs");
        return { ...actual, hash: hashMock };
      });
  
      vi.doMock("../repositories/auth.repository", () => ({
        findUserByEmailOrUsername: findUserByEmailOrUsernameMock,
        createUser: createUserMock,
      }));
  
      jsonSpy = vi.fn();
      statusSpy = vi.fn(() => ({ json: jsonSpy }));
  
      mockReq = {
        body: {
          username: "testuser",
          email: "test@email.com",
          password: "password123",
        },
      };
  
      mockRes = {
        status: statusSpy,
      };
    });
  
    it("should return 201 and created user if registration is successful", async () => {
      const { register } = await import("../controllers/auth.controller");
  
      await register(mockReq as Request, mockRes as Response);
  
      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(Number),
        username: "testuser",
        email: "test@email.com",
      }));
    });
  
    it("should return 400 if fields are missing", async () => {
      mockReq.body = {};
  
      const { register } = await import("../controllers/auth.controller");
  
      await register(mockReq as Request, mockRes as Response);
  
      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Champs requis manquants",
      });
    });
  
    it("should return 409 if user already exists", async () => {
      findUserByEmailOrUsernameMock.mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@email.com",
      });
  
      const { register } = await import("../controllers/auth.controller");
  
      await register(mockReq as Request, mockRes as Response);
  
      expect(statusSpy).toHaveBeenCalledWith(409);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Utilisateur déjà existant (email ou pseudo)",
      });
    });
  
    it("should return 500 if an exception is thrown", async () => {
      createUserMock.mockRejectedValue(new Error("DB error"));
  
      const { register } = await import("../controllers/auth.controller");
  
      await register(mockReq as Request, mockRes as Response);
  
      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: "Erreur lors de l’inscription",
      });
    });
});

