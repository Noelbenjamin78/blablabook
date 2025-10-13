import React, { useMemo, useState } from "react";
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
  email: z.string().email("Email invalide")
});

const resetSchema = z.object({
  password: z.string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    // décommente si tu veux forcer plus de règles :
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[a-z]/, "Au moins une minuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
    // .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial"),
  confirmPassword: z.string().min(12, "Le mot de passe doit contenir au moins 12 caractères")
}).refine((d) => d.password === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "Les mots de passe ne correspondent pas"
});

type RequestValues = z.infer<typeof requestSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const emailFromLink = params.get("email") || "";

  // Mode forcé sur "reset" pour ne pas demander l'email
  const mode: "reset" = "reset";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" }
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  const submitRequest = async (data: RequestValues) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email })
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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: emailFromLink,
          newPassword: data.password
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // 409 si mot de passe déjà utilisé
        if (res.status === 409) {
          toast.error(err.error || "Vous avez déjà utilisé ce mot de passe récemment.");
        } else if (res.status === 400) {
          toast.error(err.error || "Lien invalide ou expiré.");
        } else {
          toast.error(err.error || "Erreur lors de la réinitialisation.");
        }
        return;
      }
      toast.success("Mot de passe mis à jour. Connectez-vous.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Erreur réseau. Réessayez.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-app-bg-darker rounded-lg p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold mb-6">
          {"Réinitialiser le mot de passe"}
        </h1>

  {(
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(submitReset)} className="space-y-5">
              {/* Affiche l'email s'il est passé dans l'URL */}
              {emailFromLink ? (
                <div className="text-sm text-gray-600">
                  Réinitialisation pour <span className="font-semibold">{emailFromLink}</span>
                </div>
              ) : null}

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

              <Button type="submit" className="w-full bg-app-bg border border-black text-black">
                Mettre à jour le mot de passe
              </Button>
            </form>
          </Form>
  )}
      </div>
    </div>
  );
}
