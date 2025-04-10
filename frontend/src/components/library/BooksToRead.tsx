import React, { useEffect, useState } from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Card } from '../ui/card';
import { BookA, UserPen } from 'lucide-react';
import { Book } from '../../../../backend/src/types/book';
import fetchUserBooks from '@/api/library/fetchUserBooks';
import { useIsMobile } from '@/hooks/use-mobile';
import empty from '../../assets/images/empty.svg';

export interface BookWithStatus extends Book {
    status: number;
}

const BooksToRead = () => {
    const [toReadBooks, setToReadBooks] = useState<BookWithStatus[]>([]);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchData = async () => {
            const books = await fetchUserBooks(2);
            setToReadBooks(books.filter((book: BookWithStatus) => book.status === 0));
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-4xl md:text-5xl text-center font-bold text-title-gold pt-20 mb-10 md:mb-20 xl:mb-32">
                Mes livres à lire
            </h1>
            <div className="flex justify-center">
                <Card className="bg-app-bg-darker scale-90 md:scale-100 lg:scale-110 xl:scale-125 w-fit md:w-fit h-4/5 px-3 mb-4">
                    {isMobile ? (
                        <TableBody>
                            {toReadBooks.length > 0 ? (
                                toReadBooks.map((book) => (
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
                                        <p>Aucun livre à lire pour l’instant...</p>
                                        <img src={empty} alt="" />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    ) : (
                        <TableBody>
                            {toReadBooks.length > 0 ? (
                                toReadBooks.map((book) => (
                                    <TableRow key={book.title} className="border-b-1 border-title-gold">
                                        <TableCell className="text-left italic font-semibold">{book.title}</TableCell>
                                        <TableCell className="text-left">{book.author}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center italic text-title-gold py-4">
                                        <p className="text-xl md:text-2xl lg:text-3xl">
                                            Aucun livre à lire pour l’instant...
                                        </p>
                                        <img width={300} src={empty} alt="" />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default BooksToRead;
