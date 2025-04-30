import React from "react";
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

// Validation schema avec Zod
const registerSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    confirmEmail: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        alert(errorData.error || "Erreur lors de l'inscription.");
        return;
      }

      alert("Inscription réussie !");
      window.location.href = "/";
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Une erreur est survenue.");
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
          className={`bg-app-bg-darker mx-auto mt-6 w-full rounded-lg p-4 shadow-md md:p-6 ${isMobile ? "" : "max-w-md md:max-w-lg lg:max-w-xl"}`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        {...field}
                        className="bg-app-bg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmez votre mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        {...field}
                        className="bg-app-bg"
                      />
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
