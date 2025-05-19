import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  UserPen,
  CalendarDays,
  BookOpenCheck,
  Landmark,
  BookType,
  Barcode,
  Check,
  BookOpen,
} from "lucide-react";
import empty from "../../assets/images/empty.svg";
import { useIsMobile } from "@/hooks/use-mobile";
import AddReadBookButton from "../../components/books/AddReadBookButton";
import AddToReadBookButton from "./AddToReadBookButton";
import { useBookWithStatus } from "@/hooks/useBookWithStatus";

const BookItem = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const logged = localStorage.getItem("token") !== null;

  const {
    book,
    isRead: bookRead,
    toRead: bookToRead,
    loading,
    loadBook,
  } = useBookWithStatus(id);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  if (loading) {
    return (
      <p className="text-title-gold mt-20 text-center text-2xl">
        Chargement du livre...
      </p>
    );
  }

  if (!book) {
    return (
      <div className="text-title-gold mt-20 flex flex-col items-center">
        <p className="text-xl md:text-2xl">Livre introuvable...</p>
        <img src={empty} alt="vide" className="mt-4 w-64" />
      </div>
    );
  }

  return (
    <div className="mt-24 flex justify-center px-4 pb-6">
      <Card className="bg-app-bg-darker text-title-gold mx-2 mb-4 w-full max-w-3xl space-y-6 rounded-2xl p-6 shadow-xl md:mb-6 lg:mb-8">
        <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          {book.title}
        </h1>

        {isMobile ? (
          <div className="flex flex-col items-center gap-6">
            <img
              src={book.image}
              alt={book.title}
              className="w-[140px] rounded-xl object-cover shadow-md"
            />
            <div className="space-y-3 text-center text-base">
              <p className="flex items-center justify-center">
                <UserPen size={18} className="mr-2" />
                Auteur : <span className="ml-1 italic">{book.author}</span>
              </p>
              {book.edition && (
                <p className="flex items-center justify-center">
                  <Landmark size={18} className="mr-2" />
                  Édition : <span className="ml-1 italic">{book.edition}</span>
                </p>
              )}
              <p className="flex items-center justify-center">
                <CalendarDays size={18} className="mr-2" />
                Publié le :{" "}
                <span className="ml-1 italic">
                  {new Date(book.publication_date).toLocaleDateString()}
                </span>
              </p>
              <p className="flex items-center justify-center">
                <BookOpenCheck size={18} className="mr-2" />
                Pages : <span className="ml-1 italic">{book.pages ?? "—"}</span>
              </p>
              <p className="flex items-center justify-center">
                <Barcode size={18} className="mr-2" />
                ISBN : <span className="ml-1 italic">{book.isbn}</span>
              </p>
              {book.genre_name && (
                <p className="flex items-center justify-center">
                  <BookType size={18} className="mr-2" />
                  Genre : <span className="ml-1 italic">{book.genre_name}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex justify-center md:w-1/3">
              <img
                src={book.image}
                alt={book.title}
                className="max-w-[180px] rounded-xl object-cover shadow-md"
              />
            </div>
            <div className="space-y-4 text-lg md:w-2/3">
              <p className="flex items-center">
                <UserPen size={20} className="mr-2" />
                Auteur :{" "}
                <span className="ml-1 font-medium italic">{book.author}</span>
              </p>
              {book.edition && (
                <p className="flex items-center">
                  <Landmark size={20} className="mr-2" />
                  Édition : <span className="ml-1 italic">{book.edition}</span>
                </p>
              )}
              <p className="flex items-center">
                <CalendarDays size={20} className="mr-2" />
                Publié le :{" "}
                <span className="ml-1 italic">
                  {new Date(book.publication_date).toLocaleDateString()}
                </span>
              </p>
              <p className="flex items-center">
                <BookOpenCheck size={20} className="mr-2" />
                Pages : <span className="ml-1 italic">{book.pages ?? "—"}</span>
              </p>
              <p className="flex items-center">
                <Barcode size={20} className="mr-2" />
                ISBN : <span className="ml-1 italic">{book.isbn}</span>
              </p>
              {book.genre_name && (
                <p className="flex items-center">
                  <BookType size={20} className="mr-2" />
                  Genre : <span className="ml-1 italic">{book.genre_name}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="pt-6">
          <h2 className="mb-2 text-2xl font-semibold">Description</h2>
          <p className="text-xl italic">{book.description}</p>
        </div>

        {logged && (
        <>
          {!bookRead && !bookToRead ? (
            <p className="text-title-gold md:text-xl xl:text-2xl">
              Statut: Non ajouté à votre bibliothèque
            </p>
          ) : bookToRead ? (
            <div className="flex items-center space-x-2">
              <BookOpen size={24} className="text-title-gold" />{" "}
              <p className="text-title-gold md:text-xl xl:text-2xl">
                Statut: À lire
              </p>
            </div>
          ) : bookRead ? (
            <div className="flex items-center space-x-2">
              <Check size={24} className="text-green-500" />{" "}
              <p className="text-title-gold md:text-xl xl:text-2xl">
                Statut: Livre lu
              </p>
            </div>
          ) : null}

          {isMobile ? (
            <div className="flex justify-center space-x-2">
              {!bookRead && !bookToRead ? (
                <div className="flex space-x-2">
                  <AddReadBookButton onStatusChange={loadBook} />
                  <AddToReadBookButton onStatusChange={loadBook} />
                </div>
              ) : bookToRead ? (
                <AddReadBookButton onStatusChange={loadBook} />
              ) : bookRead ? null : null}
            </div>
          ) : (
            <div className="flex justify-center space-x-2">
              {!bookRead && !bookToRead ? (
                <div className="flex space-x-4">
                  <AddReadBookButton onStatusChange={loadBook} />
                  <AddToReadBookButton onStatusChange={loadBook} />
                </div>
              ) : bookToRead ? (
                <AddReadBookButton onStatusChange={loadBook} />
              ) : bookRead ? null : null}
            </div>
          )}
        </>
      )}
      </Card>
    </div>
  );
};

export default BookItem;
