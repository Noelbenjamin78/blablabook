import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { NewUser } from '@/types/user';

const registerSchema = z
    .object({
        name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
        email: z.string().email('Email invalide'),
        confirmEmail: z.string().email('Email invalide'),
        password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    })
    .refine((data) => data.email === data.confirmEmail, {
        message: 'Les emails ne correspondent pas',
        path: ['confirmEmail'],
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        const newUser: NewUser = {
            username: data.name,
            email: data.email,
            password: data.password,
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur API :', errorData);
                alert(errorData.error || "Erreur lors de l'inscription.");
                return;
            }
    
            alert('Inscription réussie !');
            window.location.href = '/accueil';
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            alert('Une erreur est survenue.');
        }
    };

    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-title-gold">INSCRIPTION</h1>
            <main className="flex-grow px-4">
                <div
                    className={`w-full mx-auto mt-6 p-4 md:p-6 shadow-md rounded-lg bg-app-bg-darker ${isMobile ? '' : 'max-w-md md:max-w-lg lg:max-w-xl'}`}
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
                                className="w-full bg-app-bg text-black border border-black"
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