import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const requestSchema = z.object({
  email: z.string().email("Email invalide"),
});

const resetSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[a-z]/, "Au moins une minuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
  confirmPassword: z.string().min(12, "Le mot de passe doit contenir au moins 12 caractères"),
}).refine((d) => d.password === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "Les mots de passe ne correspondent pas",
});

type RequestValues = z.infer<typeof requestSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");                 // peut être null si pas de lien
  const emailFromLink = params.get("email") || "";   // peut préremplir/verrouiller

  // Mode forcé reset
  const mode: "reset" = "reset";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: emailFromLink,          // <- prérempli si présent dans l’URL
      password: "",
      confirmPassword: "",
    },
  });

  const submitRequest = async (data: RequestValues) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erreur lors de l'envoi du lien.");
        return;
      }
      toast.success("Email envoyé (si l'adresse existe). Vérifie ta boîte !");
    } catch {
      toast.error("Erreur réseau. Réessayez.");
    }
  };

  const submitReset = async (data: ResetValues) => {
  setSubmitting(true);
  try {
    const payload: Record<string, unknown> = {
      email: emailFromLink || data.email,
      // on envoie les deux pour matcher n'importe quel contrôleur
      newPassword: data.password,
      password: data.password,
    };

    // n'ajoute 'token' que s'il existe (évite token: null qui déclenche 400)
    if (token) payload.token = token;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // essaie de lire l'erreur renvoyée par l'API
      const text = await res.text().catch(() => "");
      let msg = "Erreur lors de la réinitialisation.";
      try {
        const json = text ? JSON.parse(text) : {};
        msg = json.error || json.message || msg;
      } catch {
        if (text) msg = text;
      }

      if (res.status === 409) toast.error(msg || "Vous avez déjà utilisé ce mot de passe récemment.");
      else if (res.status === 400) toast.error(msg || "Requête invalide (lien ou données).");
      else toast.error(msg);
      return;
    }

    toast.success("Mot de passe mis à jour. Connectez-vous.");
    navigate("/login", { replace: true });
  } catch {
    toast.error("Erreur réseau. Réessayez.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-app-bg-darker rounded-lg p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold mb-6">Réinitialiser le mot de passe</h1>

        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(submitReset)} className="space-y-5">

            {/* Champ email : affiché et éditable si pas dans l’URL, sinon verrouillé */}
            <FormField
              name="email"
              control={resetForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail du compte</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@domaine.fr"
                      className="bg-app-bg"
                      autoComplete="email"
                      {...field}
                      value={field.value}
                      disabled={!!emailFromLink} // verrouille si fourni via URL
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={resetForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nouveau mot de passe"
                        className="bg-app-bg pr-10"
                        autoComplete="new-password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={resetForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmez le mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirmez le mot de passe"
                        className="bg-app-bg pr-10"
                        autoComplete="new-password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                        aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-app-bg border border-black text-black"
              disabled={submitting}
            >
              {submitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
