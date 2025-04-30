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
import { User } from "../../../../backend/src/types/user";
import { LibraryEntry } from "../../../../backend/src/types/library";
import { useIsMobile } from "@/hooks/use-mobile";
import fetchUserBooks from "../../api/library/fetchUserBooks";
import empty from "../../assets/images/empty.svg";

interface BookWithStatus extends Book, User, LibraryEntry {
  status: number;
  id: number;
}

const BooksRead = () => {
  const [readBooks, setReadBooks] = useState<BookWithStatus[]>([]);
  const isMobile = useIsMobile();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const books = await fetchUserBooks(userId, "read");
        setReadBooks(books);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  return (
    <div>
      <h1 className="text-title-gold mb-12 pt-20 text-center text-4xl font-bold md:mb-28 md:text-5xl">
        Mes livres lus
      </h1>
      <div className="flex justify-center">
        <Card className="bg-app-bg-darker h-4/5 w-fit scale-90 px-3 md:scale-100 lg:scale-110">
          {isMobile ? (
            <Table className="bg-app-bg-darker h-4/5 w-fit items-center justify-center text-xl">
              <TableBody>
                {readBooks.length > 0 ? (
                  readBooks.map((book: BookWithStatus) => (
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
                      <p>Aucun livre lu pour le moment...</p>
                      <img src={empty} alt="" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table className="bg-app-bg-darker h-4/5 w-fit items-center justify-center text-xl">
              {readBooks.length > 0 && (
                <TableHeader className="text-title-gold space-x-16">
                  <TableRow>
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
                {readBooks.length > 0 ? (
                  readBooks.map((book) => (
                    <TableRow
                      key={book.title}
                      className="border-title-gold border-b-1"
                    >
                      <TableCell className="text-left text-xl font-semibold italic md:text-2xl lg:text-3xl">
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
                    <TableCell
                      colSpan={2}
                      className="col-span-full text-center"
                    >
                      {readBooks.length} livre{readBooks.length !== 1 && "s"} lu
                      {readBooks.length !== 1 && "s"}
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
