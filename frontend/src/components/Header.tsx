import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutButton from "./auth/LogoutButton";
import SearchMethods from "./methods/SearchMethods";
import fetchBooks from "@/api/books/fetchBooks";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowMenuItems(true), 400);
      return () => clearTimeout(timer);
    } else {
      setShowMenuItems(false);
    }
  }, [open]);

  useEffect(() => {
    // Vérifie la présence de userId pour l'état de connexion
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);

    const loadBooks = async () => {
      try {
        const fetched = await fetchBooks();
        setBooks(fetched);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des livres dans le header :",
          error,
        );
      }
    };

    loadBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleSearchClick = () => {
    setOpenSearch(true);
  };

  const menuItems = [
    { to: "/", label: "Accueil" },
    { to: "/books", label: "Tous les livres" },
    ...(isLoggedIn
      ? [{ to: "/library", label: "Ma bibliothèque" }, { isLogout: true }]
      : [
          { to: "/register", label: "Inscription" },
          { to: "/login", label: "Connexion" },
        ]),
  ];

  return (
    <header className="bg-secondary-blue w-full border-b border-gray-200 px-4 py-2 text-gray-800">
      <div className="flex items-center justify-between gap-4 px-4">
        <Link to="/" className="text-xl font-bold whitespace-nowrap text-white">
          BlaBlaB<span className="text-title-gold">oo</span>k
        </Link>

        {!isMobile && (
          <>
            <div className="flex flex-1 items-center justify-center gap-6">
              <nav className="flex items-center space-x-4 text-lg">
                <Button
                  asChild
                  variant="defaultNoHover"
                  className="bg-app-bg-darker text-title-gold"
                >
                  <Link to="/">Accueil</Link>
                </Button>
                <Button
                  asChild
                  variant="defaultNoHover"
                  className="bg-app-bg-darker text-title-gold"
                >
                  <Link to="/books">Tous les livres</Link>
                </Button>
                {isLoggedIn && (
                  <Button
                    asChild
                    variant="defaultNoHover"
                    className="bg-app-bg-darker text-title-gold"
                  >
                    <Link to="/library">Ma bibliothèque</Link>
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
                  <Button
                    asChild
                    variant="defaultNoHover"
                    className="text-title-gold bg-app-bg mr-2"
                  >
                    <Link to="/register">Inscription</Link>
                  </Button>
                  <Button
                    asChild
                    variant="defaultNoHover"
                    className="text-title-gold bg-app-bg"
                  >
                    <Link to="/login">Connexion</Link>
                  </Button>
                </>
              )}
            </nav>
          </>
        )}
        {isMobile && (
          <>
            <div className="relative flex flex-1 justify-center">
              <button onClick={handleSearchClick}>
                <Search className="text-white" size={28} />
              </button>
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button>
                  <Menu className="text-title-gold" size={28} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="text-app-bg-darker mt-4 mr-4 h-fit w-[60%] max-w-sm rounded-2xl border border-gray-200 bg-white/30 shadow-xl backdrop-blur-lg"
              >
                <nav className="bg-opacity-50 mt-8 flex flex-col space-y-4 px-4">
                  {showMenuItems && (
                    <div
                      key={String(showMenuItems)}
                      className="flex flex-col space-y-4"
                    >
                      {menuItems.flatMap((item, index) => {
                        const content = item.isLogout ? (
                          <motion.div
                            key="logout"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <LogoutButton onLogout={handleLogout} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key={item.to}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 * index }}
                          >
                            <Link
                              to={item.to ?? "/"}
                              className="text-lg font-bold hover:underline"
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        );

                        return index < menuItems.length - 1
                          ? [
                              content,
                              <Separator asChild key={`sep-${index}`}>
                                <div className="h-[1px] self-start bg-stone-200" />
                              </Separator>,
                            ]
                          : [content];
                      })}
                    </div>
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
