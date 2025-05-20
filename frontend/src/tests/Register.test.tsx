import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "@/components/auth/Register";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

vi.mock('sonner', () => {
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

import { toast } from 'sonner';
const successMock = toast.success as ReturnType<typeof vi.fn>;
const errorMock = toast.error as ReturnType<typeof vi.fn>;


vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api/auth", () => ({
  loginUser: vi.fn().mockResolvedValue({ token: "fakeToken" }),
}));

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
      token: 'fake-token',
      userId: 'fake-user-id',
    }),
  });
  mockNavigate.mockClear();
  vi.clearAllMocks();
});

describe("Register component", () => {
  const onRegisterMock = vi.fn();

  it("affiche tous les champs du formulaire", () => {
    render(
      <MemoryRouter>
        <Register onRegister={onRegisterMock} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmez votre email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmez votre mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Valider/i })).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("affiche une erreur si les emails ne correspondent pas", async () => {
    render(
      <MemoryRouter>
        <Register onRegister={onRegisterMock} />
      </MemoryRouter>
    );
    fireEvent.input(screen.getByLabelText(/^Email$/i), { target: { value: "test@mail.com" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre email/i), { target: { value: "autre@mail.com" } });
    fireEvent.input(screen.getByLabelText(/Nom/i), { target: { value: "Jean" } });
    fireEvent.input(screen.getByLabelText(/^Mot de passe$/i), { target: { value: "abcdef" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre mot de passe/i), { target: { value: "abcdef" } });
    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));

    await waitFor(() => {
      expect(screen.getByText(/Les emails ne correspondent pas/i)).toBeInTheDocument();
    });
  });

  it("affiche une erreur si les mots de passe ne correspondent pas", async () => {
    render(
      <MemoryRouter>
        <Register onRegister={onRegisterMock} />
      </MemoryRouter>
    );
    fireEvent.input(screen.getByLabelText(/^Email$/i), { target: { value: "test@mail.com" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre email/i), { target: { value: "test@mail.com" } });
    fireEvent.input(screen.getByLabelText(/Nom/i), { target: { value: "Jean" } });
    fireEvent.input(screen.getByLabelText(/^Mot de passe$/i), { target: { value: "abcdef" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre mot de passe/i), { target: { value: "ghijkl" } });
    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));

    await waitFor(() => {
      expect(screen.getByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument();
    });
  });

  it("envoie les données et affiche un toast en cas de succès", async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as any;

    render(
      <MemoryRouter>
        <Register onRegister={onRegisterMock} />
      </MemoryRouter>
    );
    fireEvent.input(screen.getByLabelText(/Nom/i), { target: { value: "Jean" } });
    fireEvent.input(screen.getByLabelText(/^Email$/i), { target: { value: "test@mail.com" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre email/i), { target: { value: "test@mail.com" } });
    fireEvent.input(screen.getByLabelText(/^Mot de passe$/i), { target: { value: "abcdef" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre mot de passe/i), { target: { value: "abcdef" } });

    // Mock window.location
    const locationAssign = vi.fn();
    const locationReload = vi.fn();
    delete (window as any).location;
    (window as any).location = { href: "", assign: locationAssign, reload: locationReload };

    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));

    await waitFor(() => {
      expect(successMock).toHaveBeenCalledWith("Inscription réussie !", { duration: 2000 });
    });
  });

  it("affiche un toast d'erreur si la requête échoue", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Erreur réseau")) as any;

    render(
      <MemoryRouter>
        <Register onRegister={onRegisterMock} />
      </MemoryRouter>
    );
    fireEvent.input(screen.getByLabelText(/Nom/i), { target: { value: "Jean" } });
    fireEvent.input(screen.getByLabelText(/^Email$/i), { target: { value: "test@mail.com" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre email/i), { target: { value: "test@mail.com" } });
    fireEvent.input(screen.getByLabelText(/^Mot de passe$/i), { target: { value: "abcdef" } });
    fireEvent.input(screen.getByLabelText(/Confirmez votre mot de passe/i), { target: { value: "abcdef" } });

    fireEvent.click(screen.getByRole("button", { name: /Valider/i }));

    await waitFor(() => {
      expect(errorMock).toHaveBeenCalledWith("Erreur lors de l'inscription.", { duration: 2000 });
    });
  });
});