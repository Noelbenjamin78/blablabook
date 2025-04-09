import React from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '../ui/card';
import { BookA, UserPen } from 'lucide-react';

// TODO:to change dynamically with the API and DB
const books = [
    { title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry' },
    { title: '1984', author: 'George Orwell' },
    { title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien' },
    { title: 'La Nuit des Temps', author: 'René Barjavel' },
    { title: 'Dune', author: 'Frank Herbert' },
    { title: 'Les Misérables', author: 'Victor Hugo' },
    { title: 'Le Comte de Monte-Cristo', author: 'Alexandre Dumas' },
    { title: 'Le Tour du Monde en 80 Jours', author: 'Jules Verne' },
    { title: 'La Guerre des Mondes', author: 'H.G. Wells' },
    { title: "L'Odyssée", author: 'Homère' },
];

const isMobile = window.innerWidth < 768;

const BooksRead = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-title-gold pt-20 mb-28">Mes livres lus</h1>
            <div className="flex justify-center">
                <Card className="bg-app-bg-darker w-fit md:w-fit h-4/5 px-3">
                    {isMobile ? (
                        <Table className="bg-app-bg-darker w-fit h-4/5 text-xl items-center justify-center">
                            <TableBody>
                                {books.map((book) => (
                                    <React.Fragment key={book.title}>
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
                                    </React.Fragment>
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
                                {books.map((book) => (
                                    <TableRow key={book.title} className="border-b-1 border-title-gold">
                                        <TableCell className="text-left italic font-semibold">{book.title}</TableCell>
                                        <TableCell className="text-left">{book.author}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter className="text-title-gold">
                                <TableRow>
                                    <TableCell className="text-center col-span-full">
                                        {books.length} livres lus
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

export default BooksRead;
