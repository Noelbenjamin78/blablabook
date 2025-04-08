import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterProps {
    onRegister: (name: string, email: string, password: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email !== confirmEmail) {
            setError('Les emails ne correspondent pas.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setError('');
        onRegister(name, email, password);
    };

    return (
        <div className="">
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
                        <Input type="text" placeholder="Rechercher..." />
                    </div>
                </div>
            </header>
            <h1 className="text-3xl font-bold text-center mt-6 text-text-title-gold">INSCRIPTION</h1>
            <main className="flex-grow">
                <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
                    <h2 className="text-2xl font-bold text-center mb-6">Inscription</h2>
                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Nom
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Entrez votre nom"
                                required
                            />
                        </div>

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
                            <Label htmlFor="confirmEmail" className="text-sm font-medium text-gray-700">
                                Confirmez votre email
                            </Label>
                            <Input
                                type="email"
                                id="confirmEmail"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                placeholder="Confirmez votre email"
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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirmez le mot de passe
                            </Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmez votre mot de passe"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-secondary-blue text-white hover:bg-blue-700">
                            S'inscrire
                        </Button>
                    </form>
                </div>
            </main>
            <footer className="bg-secondary-blue text-white py-4 w-full">
                <div className="text-center">
                    <p className="text-sm">© 2025 BlaBlaBook. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default Register;
