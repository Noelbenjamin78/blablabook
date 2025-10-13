import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  // garde 6 pour ne pas bloquer des anciens comptes ; passe à 12 si ta politique l'exige
  password: z.string().min(6, "Mot de passe incorrect"),
});

type LoginProps = {
  onLoginSuccess?: () => void;
};

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include" // pour envoyer le cookie
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        toast.error(errorData.error || "Identifiants invalides");
        return;
      }

      const { userId } = await response.json();
      localStorage.setItem("userId", userId);

      if (onLoginSuccess) onLoginSuccess();
      toast.success("Connexion réussie !", { duration: 2000 });
      navigate("/library");
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error("Une erreur est survenue.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <h1 className="title-gold mt-6 text-center text-4xl font-bold md:mt-6 md:text-3xl">
        CONNEXION
      </h1>

      <main className="flex flex-grow flex-col items-center justify-center space-y-6 px-4">
        <div
          className={`mx-auto mt-8 w-full ${isMobile ? "" : "max-w-md"} bg-app-bg-darker rounded-lg p-4 shadow-md md:p-6`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Entrez votre email"
                        autoComplete="username"
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mot de passe + œil */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Entrez votre mot de passe"
                          autoComplete="current-password"
                          className="bg-app-bg pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                          aria-label={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                variant="defaultNoHover"
                className="bg-app-bg w-full border border-black text-black"
              >
                Connexion
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default Login;
