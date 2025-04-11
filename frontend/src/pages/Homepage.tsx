import React, { useEffect, useState } from "react";
import "../styles/Homepage.css";
import { useIsMobile } from "../hooks/use-mobile";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import fetchBooks from "@/api/books/fetchBooks";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const fetched = await fetchBooks();
        setBooks(fetched);
      } catch (err) {
        console.error("Erreur lors du chargement des livres :", err);
      }
    };

    loadBooks();
  }, []);

  const handleBookClick = (id: number) => {
    navigate(`/book/${id}`);
  };

  const uniqueBooksByCategory = () => {
    const seen = new Set();
    return books.filter((book) => {
      if (!seen.has(book.genre_name)) {
        seen.add(book.genre_name);
        return true;
      }
      return false;
    });
  };

  const randomBook = books[Math.floor(Math.random() * books.length)];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-grow flex-col">
        <h1 className="mt-6 text-center text-2xl font-bold">
          Réunion de passionnés
        </h1>

        <section className={`mt-4 ${isMobile ? "px-4" : "px-8"}`}>
          <div
            className={`grid justify-center gap-6 ${
              isMobile ? "" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {(isMobile ? (randomBook ? [randomBook] : []) : uniqueBooksByCategory()).map((book) => (
              <div
                key={book.id}
                className="book text-center cursor-pointer"
                onClick={() => handleBookClick(book.id)}
              >
                <Card className="transition-all hover:shadow-xl">
                  <CardContent className="p-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className={`mx-auto transition-all ${
                        isMobile ? "h-auto w-full" : "h-72 w-48"
                      }`}
                    />
                    <CardTitle className="mt-2 text-xl font-semibold">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {book.genre_name}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}