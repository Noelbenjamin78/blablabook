import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardTitle, CardFooter } from '../ui/card';
import { Separator } from '../ui/separator';
import { Heart, BookPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import libraryRead from '../../assets/images/library-read.svg';
import libraryToRead from '../../assets/images/library-to-read.svg';
import { BookWithStatus } from './BooksToRead';
import fetchUserBooks from '@/api/library/fetchUserBooks';

const Library = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const [readCount, setReadCount] = useState(0);
    const [toReadCount, setToReadCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            const books = await fetchUserBooks(2);
            const read = books.filter((book: BookWithStatus) => book.status === 1).length;
            const toRead = books.filter((book: BookWithStatus) => book.status === 0).length;
            setReadCount(read);
            setToReadCount(toRead);
        };
        fetchCounts();
    }, []);

    return (
        <div className="w-full">
            <h1 className="text-2xl text-center font-bold text-title-gold pt-20 mb-12 md:mb-28 md:text-3xl lg:text-4xl">
                Ma bibliothèque
            </h1>

            {isMobile ? (
                <div className="flex flex-col items-center gap-10 px-6 mb-4">
                    <Card
                        className="w-80 h-100 my-auto items-center cursor-pointer bg-app-bg-darker shadow-lg"
                        onClick={() => navigate('/library/books-read')}>
                        <CardTitle className="text-title-gold">Mes livres lus</CardTitle>
                        <Link to="/books-read"></Link>
                        <img src={libraryRead} alt="" className="w-40 h-40 object-cover" />
                        <Separator className="my-1 border-t-2 border-title-gold w-3/5" />
                        <CardFooter className="text-title-gold flex space-x-2">
                            <Heart />
                            <p>{readCount} livres lus</p>
                        </CardFooter>
                    </Card>

                    <Card
                        className="w-80 h-100 items-center cursor-pointer bg-app-bg-darker shadow-lg"
                        onClick={() => navigate('/library/books-to-read')}>
                        <CardTitle className="text-title-gold">Mes livres à lire</CardTitle>
                        <Link to="/books-to-read"></Link>
                        <img src={libraryToRead} alt="" className="w-40 h-40 object-cover" />
                        <Separator className="my-1 border-t-2 border-title-gold w-3/5" />
                        <CardFooter className="text-title-gold flex space-x-2 mb-4">
                            <BookPlus />
                            <p>{toReadCount} à lire</p>
                        </CardFooter>
                    </Card>
                </div>
            ) : (
                <div className="flex flex-col justify-center mb-10">
                    <div className="flex justify-center space-x-16 text-2xl">
                        <Card
                            className="md:w-1/3 md:h-90 lg:h-100 my-auto items-center cursor-pointer bg-app-bg-darker shadow-lg"
                            onClick={() => navigate('/library/books-read')}>
                            <CardTitle className="md:text-2xl lg:text-3xl text-title-gold text-center mt-4">
                                Mes livres lus
                            </CardTitle>
                            <img
                                src={libraryToRead}
                                alt=""
                                className="md:w-30 md:h-30 lg:w-40 lg:h-40 object-cover my-4"
                            />
                            <Separator className="my-1 border-t-2 border-title-gold w-3/5" />
                            <CardFooter className="text-title-gold flex space-x-2 mb-4">
                                <Heart />
                                <p>{readCount} livres lus</p>
                            </CardFooter>
                        </Card>

                        <Card
                            className="md:w-1/3 md:h-90 lg:h-100 my-auto items-center cursor-pointer bg-app-bg-darker shadow-lg"
                            onClick={() => navigate('/library/books-to-read')}>
                            <CardTitle className="md:text-2xl lg:text-3xl text-title-gold text-center mt-4">
                                Mes livres à lire
                            </CardTitle>
                            <img
                                src={libraryToRead}
                                alt=""
                                className="md:w-30 md:h-30 lg:w-40 lg:h-40 object-cover my-4"
                            />
                            <Separator className="my-1 border-t-2 border-title-gold w-3/5" />
                            <CardFooter className="md:text-xl lg:text-2xl text-title-gold flex space-x-2 mb-4">
                                <BookPlus />
                                <p>{toReadCount} à lire</p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
