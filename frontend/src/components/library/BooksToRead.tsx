import React from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '../ui/card';
import { BookA, UserPen } from 'lucide-react';

// TODO:to change dynamically with the API and DB
const booksToRead = [
    { title: 'Fahrenheit 451', author: 'Ray Bradbury' },
    { title: 'L’Étranger', author: 'Albert Camus' },
    { title: 'Les Fleurs du mal', author: 'Charles Baudelaire' },
    { title: 'Le Meilleur des mondes', author: 'Aldous Huxley' },
    { title: 'La Peste', author: 'Albert Camus' },
    { title: 'Crime et Châtiment', author: 'Fiodor Dostoïevski' },
    { title: 'Sur la route', author: 'Jack Kerouac' },
    { title: 'Cent ans de solitude', author: 'Gabriel García Márquez' },
    { title: 'Le Parfum', author: 'Patrick Süskind' },
    { title: 'Don Quichotte', author: 'Miguel de Cervantes' },
];

const isMobile = window.innerWidth < 768;

const BooksToRead = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-title-gold pt-20 mb-28">Mes livres à lire</h1>
            <div className="flex justify-center">
                <Card className="bg-app-bg-darker w-fit md:w-fit h-4/5 px-3">
                    {isMobile ? (
                        <Table className="bg-app-bg-darker w-fit h-4/5 text-xl items-center justify-center">
                            <TableBody>
                                {booksToRead.map((book) => (
                                    <TableRow key={book.title} className="border-b border-title-gold">
                                        <TableCell className="text-left flex flex-col gap-1 py-2">
                                            <span className="flex items-baseline italic">
                                                <BookA size={16} className="mr-1.5" />
                                                {book.title}
                                            </span>
                                            <span className="flex items-baseline text-sm">
                                                <UserPen size={16} className="mr-1.5" />
                                                {book.author}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Table className="bg-app-bg-darker w-fit h-4/5 text-xl items-center justify-center">
                            <TableHeader className="space-x-16 text-title-gold">
                                <TableRow>
                                    <TableHead className="text-2xl text-left text-title-gold font-bold">
                                        Titre
                                    </TableHead>
                                    <TableHead className="text-2xl text-left text-title-gold font-bold">
                                        Auteur
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {booksToRead.map((book) => (
                                    <TableRow key={book.title} className="border-b-1 border-title-gold">
                                        <TableCell className="text-left italic font-semibold">{book.title}</TableCell>
                                        <TableCell className="text-left">{book.author}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter className="text-title-gold">
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center col-span-full">
                                        {booksToRead.length} livres à lire
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default BooksToRead;
