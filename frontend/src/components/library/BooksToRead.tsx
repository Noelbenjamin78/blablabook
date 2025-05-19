import React, { useEffect, useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "../ui/card";
import { BookA, UserPen, Trash } from "lucide-react";
import { Book } from "../../../../backend/src/types/book";
import fetchUserBooks from "@/api/library/fetchUserBooks";
import { useIsMobile } from "@/hooks/use-mobile";
import empty from "../../assets/images/empty.svg";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleRemoveFromLibrary } from "@/api/library/removeFromLibrary";

export interface BookWithStatus extends Book {
  book_id: number;
  status: number;
}

const BooksToRead = () => {
  const [toReadBooks, setToReadBooks] = useState<BookWithStatus[]>([]);
  const isMobile = useIsMobile();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!userId) {
      console.error("User ID manquant");
      return;
    }
    const books = await fetchUserBooks(userId, "toread");
    setToReadBooks(books);
  };

  const handleRemove = async (
    bookId: number,
  ) => {
    await handleRemoveFromLibrary(bookId, userId, token, fetchData);
    toast.success("Livre supprimé avec succès 📚");
  };

  useEffect(() => {
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
                    className="border-title-gold cursor-pointer border-b"
                  >
                    <TableCell
                      className="flex flex-col gap-1 py-2 text-left"
                      onClick={() => navigate(`/book/${book.book_id}`)}
                    >
                      <span className="flex items-baseline italic">
                        <BookA size={16} className="mr-1.5" />
                        {book.title}
                      </span>
                      <span className="flex items-baseline text-sm">
                        <UserPen size={16} className="mr-1.5" />
                        {book.author}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <button
                        onClick={() => handleRemove(book.book_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={20} />
                      </button>
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
                    className="border-title-gold cursor-pointer border-b-1"
                  >
                    <TableCell
                      className="text-left font-semibold italic"
                      onClick={() => navigate(`/book/${book.book_id}`)}
                    >
                      {book.title}
                    </TableCell>
                    <TableCell className="text-left">{book.author}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleRemove(book.book_id)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
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
