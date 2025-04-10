import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Library from './components/library/Library';
import BooksRead from './components/library/BooksRead';
import BooksToRead from './components/library/BooksToRead';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Smile } from 'lucide-react';

function App() {
    const handleLoginSuccess = () => {
        toast.success(
            <div className="flex items-center space-x-2">
                <p>Connexion réussie !</p>
                <Smile size={16} />
            </div>,
        );
    };

    return (
        <main className="bg-app-bg h-full w-full">
            <div className="pb-16 md:pb-20">
                <Header />
                <Toaster duration={6000} toastOptions={{ className: 'mt-4' }} position="top-right" richColors={true} />
                <Routes>
                    <Route path="/" element={<div>Accueil</div>} />
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLogin={function (email: string, password: string): void {
                                    throw new Error('Function not implemented.');
                                }}
                                onLoginSuccess={handleLoginSuccess}
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <Register
                                onRegister={function (email: string, password: string): void {
                                    throw new Error('Function not implemented.');
                                }}
                            />
                        }
                    />
                    <Route path="/library" element={<Library />} />
                    <Route path="/library/books-read" element={<BooksRead />} />
                    <Route path="/library/books-to-read" element={<BooksToRead />} />
                </Routes>
            </div>
            <Footer />
        </main>
    );
}

export default App;
