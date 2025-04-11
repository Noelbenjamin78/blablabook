import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '../ui/card';
import { BookA, UserPen } from 'lucide-react';
import { Book } from '../../../../backend/src/types/book';
import { useIsMobile } from '@/hooks/use-mobile';
import fetchBooks from '../../api/books/fetchBooks';
import empty from '../../assets/images/empty.svg';
import { useNavigate } from 'react-router-dom';

const BooksList = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const handleBookClick = (bookId: number) => {
        navigate(`/book/${bookId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const fetchedBooks = await fetchBooks();
            setBooks(fetchedBooks);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-4xl md:text-5xl text-center font-bold text-title-gold pt-20 mb-8 md:mb-28">
                Tous les livres
            </h1>
            <div className="flex justify-center">
                <Card className="bg-app-bg-darker scale-90 md:scale-100 lg:scale-110 w-3/4 h-4/5 px-3">
                    {isMobile ? (
                        <Table className="bg-app-bg-darker w-fit h-4/5 text-xl items-center justify-center">
                            <TableBody>
                                {books.length > 0 ? (
                                    books.map((book) => (
                                        <TableRow key={book.title} className="border-b border-title-gold">
                                            <TableCell className="text-left flex flex-col gap-1 py-2">
                                                <div onClick={() => handleBookClick(book.id)}>
                                                    <span className="flex items-baseline italic">
                                                        <BookA size={16} className="mr-1.5" />
                                                        {book.title}
                                                    </span>
                                                    <span className="flex items-baseline text-sm">
                                                        <UserPen size={16} className="mr-1.5" />
                                                        {book.author}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center italic text-title-gold py-4">
                                            <p>Aucun livre disponible...</p>
                                            <img src={empty} alt="vide" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <Table className="bg-app-bg-darker w-fit h-4/5 text-xl items-center justify-center">
                            {books.length > 0 && (
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
                            )}
                            <TableBody>
                                {books.length > 0 ? (
                                    books.map((book) => (
                                        <TableRow key={book.title} className="border-b-1 border-title-gold">
                                            <TableCell className="text-left text-xl md:text-2xl lg:text-3xl italic font-semibold">
                                                {book.title}
                                            </TableCell>
                                            <TableCell className="text-left">{book.author}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center italic text-title-gold py-4">
                                            <p className="text-xl md:text-2xl lg:text-3xl">Aucun livre disponible...</p>
                                            <img width={300} src={empty} alt="vide" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            {books.length > 0 && (
                                <TableFooter className="text-title-gold">
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center col-span-full">
                                            {books.length} livre{books.length !== 1 && 's'} au total
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default BooksList;
