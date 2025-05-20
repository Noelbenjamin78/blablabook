import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/auth/Login";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import '@testing-library/jest-dom';
import React from "react";

// Mock les hooks et fonctions qui sortent du composant
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}));

describe("Login component", () => {
  it("render le formulaire de login", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /connexion/i })).toBeInTheDocument();
  });

  it("affiche une erreur si le formulaire est soumis vide", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    userEvent.click(screen.getByRole("button", { name: /connexion/i }));

    expect(await screen.findByText(/email invalide/i)).toBeInTheDocument();
    expect(await screen.findByText(/mot de passe incorrect/i)).toBeInTheDocument();
  });
});
