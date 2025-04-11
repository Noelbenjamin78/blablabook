import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LogoutButton from './auth/LogoutButton';
import SearchMethods from './methods/SearchMethods';
import fetchBooks from '@/api/books/fetchBooks';

const Header: React.FC = () => {
    const isMobile = useIsMobile();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const loadBooks = async () => {
            try {
                const fetched = await fetchBooks();
                setBooks(fetched);
            } catch (error) {
                console.error('Erreur lors du chargement des livres dans le header :', error);
            }
        };

        loadBooks();

    }, []);


    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const handleSearchClick = () => {
        setOpenSearch(true);
    
      };

    return (
            <header className="relative bg-secondary-blue text-white py-4 w-full">
                <div className="flex items-center justify-between px-4 gap-4">
                    <a href="/" className="text-xl font-bold whitespace-nowrap">
                    BlaBlaB<span className="text-title-gold">oo</span>k
                    </a>

                    {!isMobile && (
                        <><div className="flex flex-1 items-center justify-center gap-6">
                        <nav className="flex items-center space-x-4 text-lg">
                            <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                <a href="/">Accueil</a>
                            </Button>
                            <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                <a href="/books">Tous les livres</a>
                            </Button>
                            {isLoggedIn && (
                                <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                    <a href="/library">Ma bibliothèque</a>
                                </Button>
                            )}
                                
                        </nav>
                        <div className="relative w-full max-w-[160px] sm:max-w-xs md:max-w-md">
                            <SearchMethods books={books} openTrigger={false} />
                        </div>
                    </div>
                    <nav>
                        {isLoggedIn ? (
                            <LogoutButton onLogout={handleLogout} />
                        ) : (
                            <>
                                <Button asChild variant="defaultNoHover" className="bg-white text-title-gold mr-2">
                                    <a href="/register">Inscription</a>
                                </Button>
                                <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                    <a href="/login">Connexion</a>
                                </Button>
                            </>
                        )}
                    </nav>
                        </>
                            
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
                                        <a href="/books">Tous les livres</a>
                                    </Button>
                                    {isLoggedIn ? (
                                        <>
                                        <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                            <a href="/library">Ma bibliothèque</a>
                                        </Button>
                                        <LogoutButton onLogout={handleLogout} />
                                        </>
                                        ) : (
                                            <>
                                                <Button asChild variant="defaultNoHover" className="bg-white text-title-gold mr-2">
                                                    <a href="/register">Inscription</a>
                                                </Button>
                                                <Button asChild variant="defaultNoHover" className="bg-white text-title-gold">
                                                    <a href="/login">Connexion</a>
                                                </Button>
                                            </>
                                    )}
                                    </nav>
                                </SheetContent>
                                </Sheet>
                            </>
                        )}
                    </div>

                {/* SearchMethods always rendered with trigger */}
                {isMobile && <SearchMethods books={books} openTrigger={openSearch} />}
                </header>
        );
    };

export default Header;
