import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe incorrect'),
});
type LoginProps = {
    onLoginSuccess?: () => void;
};

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur API :', errorData);
                return;
            }

            const { token, user } = await response.json();
            console.log('Utilisateur connecté :', user);

            localStorage.setItem('token', token);

            if (onLoginSuccess) onLoginSuccess();

            navigate('/library');
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            alert('Une erreur est survenue.');
        }
    };

    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col min-h-screen">
                <h1 className="text-4xl md:text-3xl font-bold text-center mt-6 md:mt-6 title-gold " >CONNEXION</h1>
                <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-6">
                <div
                    className={`mx-auto mt-8 w-full ${isMobile ? '' : 'max-w-md'} p-4 md:p-6 shadow-md rounded-lg bg-app-bg-darker`}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <div className="text-right">
                                <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <Button
                                type="submit"
                                variant="defaultNoHover"
                                className="w-full bg-app-bg text-black border border-black">
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
