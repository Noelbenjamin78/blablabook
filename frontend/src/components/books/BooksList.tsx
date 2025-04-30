import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "../ui/card";
import { BookA, UserPen } from "lucide-react";
import { Book } from "../../../../backend/src/types/book";
import { useIsMobile } from "@/hooks/use-mobile";
import fetchBooks from "../../api/books/fetchBooks";
import empty from "../../assets/images/empty.svg";
import { useNavigate } from "react-router-dom";

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
    <div className="mb-16">
      <h1 className="text-title-gold mb-8 pt-18 text-center text-4xl font-bold md:mb-28 md:text-5xl">
        Tous les livres
      </h1>
      <div className="flex justify-center">
        <Card className="bg-app-bg-darker h-4/5 scale-90 px-3 md:scale-100 lg:scale-110">
          {isMobile ? (
            <Table className="bg-app-bg-darker h-4/5 w-fit items-center justify-center text-xl">
              <TableBody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <TableRow
                      key={book.title}
                      className="border-title-gold border-b"
                    >
                      <TableCell className="flex flex-col gap-1 py-2 text-left">
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
                    <TableCell className="text-title-gold py-4 text-center italic">
                      <p>Aucun livre disponible...</p>
                      <img src={empty} alt="vide" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table className="bg-app-bg-darker h-4/5 w-4/5 items-center justify-center text-xl">
              {books.length > 0 && (
                <TableHeader className="text-title-gold space-x-16">
                  <TableRow className="pointer-events-none">
                    <TableHead className="text-title-gold text-left text-2xl font-bold">
                      Titre
                    </TableHead>
                    <TableHead className="text-title-gold text-left text-2xl font-bold">
                      Auteur
                    </TableHead>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <TableRow
                      key={book.title}
                      className="border-title-gold hover:bg-app-bg cursor-pointer border-b-1 transition"
                      onClick={() => handleBookClick(book.id)}
                    >
                      <TableCell className="text-left text-lg font-semibold italic md:text-xl lg:text-2xl">
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
                        Aucun livre disponible...
                      </p>
                      <img width={300} src={empty} alt="vide" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {books.length > 0 && (
                <TableFooter className="text-title-gold">
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="col-span-full text-center"
                    >
                      {books.length} livre{books.length !== 1 && "s"} au total
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
