import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LogoutButton from './auth/LogoutButton';

const Header: React.FC = () => {
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const handleSearchClick = () => {
        setShowSearchModal(true);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            console.log('Recherche lancée pour :', searchQuery);

            setShowSearchModal(false);
        } else {
            alert('Veuillez entrer un terme de recherche.');
        }
    };

    return (
        <header className="relative bg-secondary-blue text-white py-4 w-full">
            <div className="flex items-center justify-between px-4 gap-4">
                <a href="/" className="text-xl font-bold whitespace-nowrap">
                    BlaBla<span className="text-title-gold">oo</span>k
                </a>

                {!isMobile && (
                    <div className="flex flex-1 items-center justify-center gap-6">
                        <nav className="flex items-center space-x-4 text-lg">
                            <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                <a href="/">Accueil</a>
                            </Button>
                            <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                <a href="/about">À propos</a>
                            </Button>
                            <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                <a href="/contact">Contact</a>
                            </Button>
                            {isLoggedIn && <LogoutButton onLogout={handleLogout} />}
                        </nav>

                        <div className="relative w-full max-w-[160px] sm:max-w-xs md:max-w-md">
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full bg-white text-black placeholder-gray-500 pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                onClick={handleSearchSubmit}
                            />
                        </div>
                    </div>
                )}

                {isMobile && (
                    <>
                        <div className="relative flex-1 flex justify-center">
                            <button onClick={handleSearchClick}>
                                <Search className="text-white" size={28} />
                            </button>
                        </div>

                        <Sheet>
                            <SheetTrigger asChild>
                                <button>
                                    <Menu className="text-white" size={28} />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-secondary-blue text-white w-64">
                                <nav className="flex flex-col items-center space-y-4 text-lg mt-6">
                                    <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                        <a href="/accueil">Accueil</a>
                                    </Button>
                                    <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                        <a href="/about">À propos</a>
                                    </Button>
                                    <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                        <a href="/contact">Contact</a>
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </>
                )}
            </div>

            {showSearchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
                        <h2 className="text-lg font-bold mb-4">Recherche</h2>
                        <Input
                            type="text"
                            placeholder="Entrez votre recherche..."
                            className="w-full mb-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="flex justify-end space-x-4">
                            <Button variant="defaultNoHover" onClick={() => setShowSearchModal(false)}>
                                Annuler
                            </Button>
                            <Button variant="defaultNoHover" onClick={handleSearchSubmit}>
                                Rechercher
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
