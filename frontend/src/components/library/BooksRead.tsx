import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '../ui/card';
import { BookA, UserPen } from 'lucide-react';
import { Book } from '../../../../backend/src/types/book';
import { useIsMobile } from '@/hooks/use-mobile';
import fetchUserBooks from '../../api/library/fetchUserBooks';
import empty from '../../assets/images/empty.svg';

interface BookWithStatus extends Book {
    status: number;
}

const BooksRead = () => {
    const [readBooks, setReadBooks] = useState<BookWithStatus[]>([]);
    const isMobile = useIsMobile();
    // TODO:to change dynamically when user is added in the DB
    const userId = 2;

    useEffect(() => {
        const fetchData = async () => {
            const books = await fetchUserBooks(userId);
            setReadBooks(books.filter((book: BookWithStatus) => book.status === 1));
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-4xl md:text-5xl text-center font-bold text-title-gold pt-20 mb-12 md:mb-28">
                Mes livres lus
            </h1>
            <div className="flex justify-center">
                <Card className="bg-app-bg-darker scale-90 md:scale-100 lg:scale-110 w-fit h-4/5 px-3">
                    {isMobile ? (
                        <Table className="bg-app-bg-darker w-fit h-4/5 text-xl items-center justify-center">
                            <TableBody>
                                {readBooks.length > 0 ? (
                                    readBooks.map((book: BookWithStatus) => (
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center italic text-title-gold py-4">
                                            <p>Aucun livre lu pour le moment...</p>
                                            <img src={empty} alt="" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <Table className="bg-app-bg-darker w-fit h-4/5 text-xl items-center justify-center">
                            {readBooks.length > 0 && (
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
                                {readBooks.length > 0 ? (
                                    readBooks.map((book) => (
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
                                            <p className="text-xl md:text-2xl lg:text-3xl">
                                                Aucun livre lu pour le moment...
                                            </p>
                                            <img width={300} src={empty} alt="" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            {readBooks.length > 0 && (
                                <TableFooter className="text-title-gold">
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center col-span-full">
                                            {readBooks.length} livre{readBooks.length !== 1 && 's'} lu
                                            {readBooks.length !== 1 && 's'}
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

export default BooksRead;
