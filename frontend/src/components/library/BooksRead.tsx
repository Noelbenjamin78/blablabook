import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "../ui/card";
import { BookA, Trash, UserPen } from "lucide-react";
import { Book } from "../../../../backend/src/types/book";
import { User } from "../../../../backend/src/types/user";
import { LibraryEntry } from "../../../../backend/src/types/library";
import { useIsMobile } from "@/hooks/use-mobile";
import fetchUserBooks from "../../api/library/fetchUserBooks";
import empty from "../../assets/images/empty.svg";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleRemoveFromLibrary } from "@/api/library/removeFromLibrary";

interface BookWithStatus extends Book, User, LibraryEntry {
  status: number;
  id: number;
}

const BooksRead = () => {
  const [readBooks, setReadBooks] = useState<BookWithStatus[]>([]);
  const isMobile = useIsMobile();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!userId) {
      console.error("User ID manquant");
      return;
    }
    const books = await fetchUserBooks(userId, "read");
    setReadBooks(books);
  };

  const handleRemove = async (bookId: number) => {
    await handleRemoveFromLibrary(bookId, userId, token, fetchData);
    toast.success("Livre supprimé avec succès 📚");
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <div>
      <h1 className="text-title-gold mb-8 pt-12 text-center text-4xl font-bold md:mb-16 md:text-5xl">
        Mes livres lus
      </h1>
      <div className="flex justify-center pb-10">
        <Card className="bg-app-bg-darker w-3/4 max-w-5xl scale-90 px-3 py-6 md:scale-100 lg:w-130 lg:scale-110 xl:scale-125">
          <Table className="bg-app-bg-darker h-4/5 w-full text-xl">
            {!isMobile && readBooks.length > 0 && (
              <TableHeader className="text-title-gold">
                <TableRow>
                  <TableHead className="text-left text-2xl font-bold">
                    Titre
                  </TableHead>
                  <TableHead className="text-left text-2xl font-bold">
                    Auteur
                  </TableHead>
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {readBooks.length > 0 ? (
                readBooks.map((book) => (
                  <TableRow
                    key={book.book_id}
                    className="border-title-gold cursor-pointer border-b"
                  >
                    <TableCell
                      onClick={() => navigate(`/book/${book.book_id}`)}
                      className={`py-2 text-left ${isMobile ? "flex flex-col gap-1" : "max-w-[300px] truncate text-lg italic md:text-xl lg:text-2xl"}`}
                    >
                      <span className="flex items-baseline font-semibold">
                        {isMobile && <BookA size={16} className="mr-1.5" />}
                        <span className={isMobile ? "italic" : "truncate"}>
                          {book.title}
                        </span>
                      </span>
                      <span
                        className={`flex items-baseline ${isMobile ? "text-sm" : "hidden"}`}
                      >
                        {isMobile && <UserPen size={16} className="mr-1.5" />}
                        {book.author}
                      </span>
                    </TableCell>

                    {!isMobile && (
                      <TableCell className="text-left">{book.author}</TableCell>
                    )}
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
                    colSpan={isMobile ? 1 : 3}
                    className="text-title-gold py-4 text-center italic"
                  >
                    <p
                      className={`text-xl ${!isMobile && "md:text-2xl lg:text-3xl"}`}
                    >
                      Aucun livre lu pour le moment...
                    </p>
                    <img src={empty} alt="empty" width={isMobile ? 200 : 300} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {readBooks.length > 0 && (
            <div className="mt-2 flex justify-center">
              <div className="text-title-gold mx-auto mt-6 inline-block rounded-lg bg-[#fffbe6] px-6 py-2 text-lg font-semibold shadow-sm">
                {readBooks.length} livre lu{readBooks.length !== 1 && "s"}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BooksRead;
