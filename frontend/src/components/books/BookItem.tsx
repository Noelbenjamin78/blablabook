import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from '../../../../backend/src/types/book';
import { Card } from '@/components/ui/card';
import { UserPen, CalendarDays, BookOpenCheck, Landmark, BookType, Barcode } from 'lucide-react';
import empty from '../../assets/images/empty.svg';
import { useIsMobile } from '@/hooks/use-mobile';

const BookItem = () => {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}`);
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status} : ${response.statusText}`);
                }
                const data = await response.json();
                if (!data || typeof data !== 'object') {
                    throw new Error('Réponse API non valide');
                }
                setBook(data);
            } catch (error) {
                console.error('Erreur lors du chargement du livre :', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBook();
    }, [id]);

    if (loading) {
        return <p className="text-center text-title-gold mt-20 text-2xl">Chargement du livre...</p>;
    }

    if (!book) {
        return (
            <div className="flex flex-col items-center mt-20 text-title-gold">
                <p className="text-xl md:text-2xl">Livre introuvable...</p>
                <img src={empty} alt="vide" className="w-64 mt-4" />
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-24 px-4">
            <Card className="bg-app-bg-darker text-title-gold w-full max-w-3xl p-6 rounded-2xl shadow-xl space-y-6 mx-2 mb-4 md:mb-6 lg:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{book.title}</h1>

                {isMobile ? (
                    <div className="flex flex-col items-center gap-6">
                        <img
                            src={book.image}
                            alt={book.title}
                            className="w-[140px] rounded-xl shadow-md object-cover"
                        />
                        <div className="space-y-3 text-base text-center">
                            <p className="flex items-center justify-center">
                                <UserPen size={18} className="mr-2" />
                                Auteur : <span className="italic ml-1">{book.author}</span>
                            </p>
                            {book.edition && (
                                <p className="flex items-center justify-center">
                                    <Landmark size={18} className="mr-2" />
                                    Édition : <span className="italic ml-1">{book.edition}</span>
                                </p>
                            )}
                            <p className="flex items-center justify-center">
                                <CalendarDays size={18} className="mr-2" />
                                Publié le :{' '}
                                <span className="italic ml-1">
                                    {new Date(book.publication_date).toLocaleDateString()}
                                </span>
                            </p>
                            <p className="flex items-center justify-center">
                                <BookOpenCheck size={18} className="mr-2" />
                                Pages : <span className="italic ml-1">{book.pages ?? '—'}</span>
                            </p>
                            <p className="flex items-center justify-center">
                                <Barcode size={18} className="mr-2" />
                                ISBN : <span className="italic ml-1">{book.isbn}</span>
                            </p>
                            {book.genre_name && (
                                <p className="flex items-center justify-center">
                                    <BookType size={18} className="mr-2" />
                                    Genre : <span className="italic ml-1">{book.genre_name}</span>
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex justify-center md:w-1/3">
                            <img
                                src={book.image}
                                alt={book.title}
                                className="max-w-[180px] rounded-xl shadow-md object-cover"
                            />
                        </div>
                        <div className="space-y-4 text-lg md:w-2/3">
                            <p className="flex items-center">
                                <UserPen size={20} className="mr-2" />
                                Auteur : <span className="italic font-medium ml-1">{book.author}</span>
                            </p>
                            {book.edition && (
                                <p className="flex items-center">
                                    <Landmark size={20} className="mr-2" />
                                    Édition : <span className="italic ml-1">{book.edition}</span>
                                </p>
                            )}
                            <p className="flex items-center">
                                <CalendarDays size={20} className="mr-2" />
                                Publié le :{' '}
                                <span className="italic ml-1">
                                    {new Date(book.publication_date).toLocaleDateString()}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <BookOpenCheck size={20} className="mr-2" />
                                Pages : <span className="italic ml-1">{book.pages ?? '—'}</span>
                            </p>
                            <p className="flex items-center">
                                <Barcode size={20} className="mr-2" />
                                ISBN : <span className="italic ml-1">{book.isbn}</span>
                            </p>
                            {book.genre_name && (
                                <p className="flex items-center">
                                    <BookType size={20} className="mr-2" />
                                    Genre : <span className="italic ml-1">{book.genre_name}</span>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-6">
                    <h2 className="text-2xl font-semibold mb-2">Description</h2>
                    <p className="italic">{book.description}</p>
                </div>
            </Card>
        </div>
    );
};

export default BookItem;
