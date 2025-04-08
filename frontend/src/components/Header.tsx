import React from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from './ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-secondary-blue text-white py-4 w-full">
            <div className="flex items-center justify-between px-4">
                {/* Logo */}
                <h1 className="text-2xl font-bold">
                    BlaBla<span className="text-text-title-gold">oo</span>k
                </h1>

                {/* Navigation Menu et Barre de recherche */}
                <div className="flex flex-1 items-center justify-center space-x-8">
                    {/* Navigation Menu */}
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/" className="text-text-title-gold bg-amber-50">
                                    Accueil
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/about" className="text-text-title-gold bg-amber-50">
                                    À propos
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/contact" className="text-text-title-gold bg-amber-50">
                                    Contact
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Barre de recherche */}
                    <div className="relative w-64">
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full bg-white text-black placeholder-gray-500 pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;