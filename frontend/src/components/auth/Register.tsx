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
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { NewUser } from "@/types/user";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Validation schema ---
const registerSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    confirmEmail: z.string().email("Email invalide"),
    password: z
      .string()
      .min(12, "Le mot de passe doit contenir au moins 12 caractères")
      // décommente ceux que tu veux rendre obligatoires :
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
      // .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    confirmPassword: z
      .string()
      .min(12, "Le mot de passe doit contenir au moins 12 caractères"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Les emails ne correspondent pas",
    path: ["confirmEmail"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC<{
  onRegister: (name: string, email: string, password: string) => void;
}> = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    const newUser: NewUser = {
      username: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        toast.error(errorData.error || "Erreur lors de l'inscription.");
        return;
      }

      toast.success("Inscription réussie !", { duration: 2000 });
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      toast.error("Erreur lors de l'inscription.", { duration: 2000 });
    }
  };

  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col">
      <h1 className="text-title-gold mt-4 text-center text-2xl font-bold md:mt-6 md:text-3xl">
        INSCRIPTION
      </h1>

      <main className="flex-grow px-4">
        <div
          className={`bg-app-bg-darker mx-auto mt-6 w-full rounded-lg p-4 shadow-md md:p-6 ${
            isMobile ? "" : "max-w-md md:max-w-lg lg:max-w-xl"
          }`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Nom */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Entrez votre nom"
                        autoComplete="name"
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        autoComplete="email"
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Email */}
              <FormField
                name="confirmEmail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmez votre email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Confirmez votre email"
                        autoComplete="email"
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password + œil */}
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
                          autoComplete="new-password"
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

              {/* Confirm Password + œil */}
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmez votre mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirmez votre mot de passe"
                          autoComplete="new-password"
                          className="bg-app-bg pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                          aria-label={
                            showConfirm
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
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
                variant="defaultNoHover"
                className="bg-app-bg w-full border border-black text-black"
              >
                Valider
              </Button>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
