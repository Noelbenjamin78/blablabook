import React from 'react';
import { Link } from 'react-router';
import { Card, CardFooter, CardTitle } from '../ui/card';
import libraryRead from '../../assets/images/library-read.svg';
import libraryToRead from '../../assets/images/library-to-read.svg';
import { Heart, BookPlus } from 'lucide-react';

import { useNavigate } from 'react-router';
import { Separator } from '@radix-ui/react-separator';

const Library = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <h1 className="text-4xl font-bold text-title-gold pt-20 mb-28">Ma bibliothèque</h1>
            <div className="flex flex-col justify-center h-screen -mt-40">
                <div className="flex justify-center space-x-16 top-1 text-2xl">
                    <Card
                        className="w-80 h-100 my-auto items-center cursor-pointer bg-app-bg-darker shadow-lg"
                        onClick={() => navigate('/library/books-read')}
                    >
                        <CardTitle className="text-title-gold">Mes livres lus</CardTitle>
                        <Link to="/books-read"></Link>
                        <img src={libraryRead} alt="" className="w-40 h-40 object-cover" />
                        <Separator className="my-1 border-t-2 border-title-gold w-3/5" />
                        <CardFooter className="text-title-gold flex space-x-2">
                            <Heart />
                            {/*TODO à dynamiser*/}
                            <p>21 livres lus</p>
                        </CardFooter>
                    </Card>
                    <Card
                        className="w-80 h-100 items-center cursor-pointer bg-app-bg-darker shadow-lg"
                        onClick={() => navigate('/library/books-to-read')}
                    >
                        <CardTitle className="text-title-gold">Mes livres à lire</CardTitle>
                        <Link to="/books-to-read"></Link>
                        <img src={libraryToRead} alt="" className="w-40 h-40 object-cover" />
                        <Separator className="my-1 border-t-2 border-title-gold w-3/5" />
                        <CardFooter className="text-title-gold flex space-x-2">
                            <BookPlus />
                            {/*TODO à dynamiser*/}
                            <p>4 livres à lire</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Library;
