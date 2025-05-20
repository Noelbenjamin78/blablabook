import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardTitle, CardFooter } from "../ui/card";
import { Separator } from "../ui/separator";
import { Heart, BookPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import libraryRead from "../../assets/images/library-read.svg";
import libraryToRead from "../../assets/images/library-to-read.svg";
import { BookWithStatus } from "./BooksToRead";
import fetchUserBooks from "@/api/library/fetchUserBooks";

const Library = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [readCount, setReadCount] = useState(0);
  const [toReadCount, setToReadCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCounts = async () => {
      if (!userId) {
        console.error("userId manquant");
        return;
      }

      const books = await fetchUserBooks(userId, undefined);
      const read = books.filter(
        (book: BookWithStatus) => book.status === 1,
      ).length;
      const toRead = books.filter(
        (book: BookWithStatus) => book.status === 0,
      ).length;
      setReadCount(read);
      setToReadCount(toRead);
    };
    fetchCounts();
  }, [userId]);

  return (
    <div className="w-full pb-6">
      <h1 className="text-title-gold mb-8 pt-16 text-center text-2xl font-bold md:mb-16 md:text-3xl lg:text-4xl">
        Ma bibliothèque
      </h1>

      {isMobile ? (
        <div className="mb-4 flex flex-col items-center gap-10 px-6">
          <Card
            className="bg-app-bg-darker my-auto h-75 w-65 cursor-pointer items-center shadow-lg"
            onClick={() => navigate("/library/books-read")}
          >
            <CardTitle className="text-title-gold">Mes livres lus</CardTitle>
            <Link to="/books-read"></Link>
            <img src={libraryRead} alt="" className="h-25 w-25 object-cover" />
            <Separator className="border-title-gold my-1 w-3/5 border-t-2" />
            <CardFooter className="text-title-gold flex space-x-2">
              <Heart />
              <p>{readCount} livres lus</p>
            </CardFooter>
          </Card>

          <Card
            className="bg-app-bg-darker h-75 w-65 cursor-pointer items-center shadow-lg"
            onClick={() => navigate("/library/books-to-read")}
          >
            <CardTitle className="text-title-gold">Mes livres à lire</CardTitle>
            <Link to="/books-to-read"></Link>
            <img
              src={libraryToRead}
              alt=""
              className="h-25 w-25 object-cover"
            />
            <Separator className="border-title-gold my-1 w-3/5 border-t-2" />
            <CardFooter className="text-title-gold mb-4 flex space-x-2">
              <BookPlus />
              <p>{toReadCount} à lire</p>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="mb-10 flex flex-col justify-center">
          <div className="flex justify-center space-x-16 text-2xl">
            <Card
              className="bg-app-bg-darker my-auto cursor-pointer items-center shadow-lg md:h-90 md:w-1/3 lg:h-100"
              onClick={() => navigate("/library/books-read")}
            >
              <CardTitle className="text-title-gold mt-4 text-center md:text-2xl lg:text-3xl">
                Mes livres lus
              </CardTitle>
              <img
                src={libraryRead}
                alt=""
                className="my-4 object-cover md:h-30 md:w-30 lg:h-40 lg:w-40"
              />
              <Separator className="border-title-gold my-1 w-3/5 border-t-2" />
              <CardFooter className="text-title-gold mb-4 flex space-x-2">
                <Heart />
                <p>{readCount} livres lus</p>
              </CardFooter>
            </Card>

            <Card
              className="bg-app-bg-darker my-auto cursor-pointer items-center shadow-lg md:h-90 md:w-1/3 lg:h-100"
              onClick={() => navigate("/library/books-to-read")}
            >
              <CardTitle className="text-title-gold mt-4 text-center md:text-2xl lg:text-3xl">
                Mes livres à lire
              </CardTitle>
              <img
                src={libraryToRead}
                alt=""
                className="my-4 object-cover md:h-30 md:w-30 lg:h-40 lg:w-40"
              />
              <Separator className="border-title-gold my-1 w-3/5 border-t-2" />
              <CardFooter className="text-title-gold mb-4 flex space-x-2 md:text-xl lg:text-2xl">
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
