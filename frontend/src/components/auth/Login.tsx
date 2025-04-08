import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormProps {
    onLogin: (email: string, password: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-secondary-blue text-white py-4 w-full">
                <div className="flex items-center justify-between px-4">
                    <h1 className="text-2xl font-bold">
                        BlaBla<span className="text-text-title-gold">oo</span>k
                    </h1>
                    <div className="flex items-center justify-center w-full space-x-4">
                        <Button
                            className="bg-white text-text-title-gold hover:bg-gray-200"
                            onClick={() => (window.location.href = '/')}
                        >
                            Accueil
                        </Button>
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-64 bg-white text-black placeholder-gray-500"
                        />
                    </div>
                </div>
            </header>

            <h1 className="text-3xl font-bold text-center mt-6 text-text-title-gold">CONNEXION</h1>

            <main className="flex-grow">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Mot de passe
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-secondary-blue text-white hover:bg-blue-700">
                        Connexion
                    </Button>
                </form>
            </main>

            <footer className="bg-secondary-blue text-white py-4 w-full">
                <div className="text-center">
                    <p className="text-sm">© 2025 BlaBlaBook. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default AuthForm;
