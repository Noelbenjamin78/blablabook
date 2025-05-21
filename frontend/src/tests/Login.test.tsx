import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "../components/auth/Login";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import React from "react";

beforeAll(() => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = { reload: vi.fn(), ...window.location };
});

beforeEach(() => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = { ...window.location, reload: vi.fn() };
  // Mock du fetch
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      token: "fake-token",
      userId: "fake-user-id",
    }),
  });
  mockNavigate.mockClear();
});

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

vi.mock("sonner", () => ({
  toast: { success: vi.fn() },
}));

vi.mock("../api/auth", () => ({
  loginUser: vi.fn().mockResolvedValue({ token: "fakeToken" }),
}));

describe("Login component", () => {
  it("render the login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /connexion/i }),
    ).toBeInTheDocument();
  });

  it("displays an error if the password is incorrect", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Mot de passe");
    const submitButton = screen.getByRole("button", { name: /connexion/i });

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Mot de passe incorrect/i),
    ).toBeInTheDocument();
  });

  it("displays an error if the email is invalid", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole("button", { name: /connexion/i });

    fireEvent.change(emailInput, { target: { value: "pasbon@" } });
    fireEvent.change(passwordInput, { target: { value: "motdepassecorrect" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/email invalide/i)).toBeInTheDocument();
  });

  it("does not display an error if the fields are valid", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Mot de passe");
    const submitButton = screen.getByRole("button", { name: /connexion/i });

    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "motdepasse" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Email invalide/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Mot de passe incorrect/i),
      ).not.toBeInTheDocument();
    });
  });

  it("the submit button is present and accessible", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const button = screen.getByRole("button", { name: /connexion/i });
    expect(button).toBeEnabled();
  });

  it("the forgotten password link is present", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /mot de passe oublié/i }),
    ).toHaveAttribute("href", "/forgot-password");
  });

  it("the redirection after submit is done correctly", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "motdepasse" },
    });
    fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/library");
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
