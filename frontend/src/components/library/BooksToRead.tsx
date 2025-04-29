import React, { useEffect, useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "../ui/card";
import { BookA, UserPen } from "lucide-react";
import { Book } from "../../../../backend/src/types/book";
import fetchUserBooks from "@/api/library/fetchUserBooks";
import { useIsMobile } from "@/hooks/use-mobile";
import empty from "../../assets/images/empty.svg";

export interface BookWithStatus extends Book {
  status: number;
}

const BooksToRead = () => {
  const [toReadBooks, setToReadBooks] = useState<BookWithStatus[]>([]);
  const isMobile = useIsMobile();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      const books = await fetchUserBooks(userId, "toread");
      setToReadBooks(books);
    };
    fetchData();
  }, [userId]);

  return (
    <div>
      <h1 className="text-title-gold mb-10 pt-20 text-center text-4xl font-bold md:mb-20 md:text-5xl xl:mb-32">
        Mes livres à lire
      </h1>
      <div className="flex justify-center">
        <Card className="bg-app-bg-darker mb-4 h-4/5 w-fit scale-90 px-3 md:w-fit md:scale-100 lg:scale-110 xl:scale-125">
          {isMobile ? (
            <TableBody>
              {toReadBooks.length > 0 ? (
                toReadBooks.map((book) => (
                  <TableRow
                    key={book.title}
                    className="border-title-gold border-b"
                  >
                    <TableCell className="flex flex-col gap-1 py-2 text-left">
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
                  <TableCell className="text-title-gold py-4 text-center italic">
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
                  <TableRow
                    key={book.title}
                    className="border-title-gold border-b-1"
                  >
                    <TableCell className="text-left font-semibold italic">
                      {book.title}
                    </TableCell>
                    <TableCell className="text-left">{book.author}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-title-gold py-4 text-center italic"
                  >
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
