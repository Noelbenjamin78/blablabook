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
  const [books, setBooks] = useState<Array[]>([]);

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

  const getUniqueBookForEachCategory = () => {
    const categories = new Set();
    const uniqueBooks: Array[] = [];

    books.forEach((book) => {
      if (!categories.has(book.genre_name)) {
        categories.add(book.genre_name);
        const filteredBooks = books.filter(
          (b) => b.genre_name === book.genre_name,
        );
        const randomBook =
          filteredBooks[Math.floor(Math.random() * filteredBooks.length)];
        uniqueBooks.push(randomBook);
      }
    });

    return uniqueBooks;
  };

  const handleBookClick = (id: number) => {
    navigate(`/book/${id}`);
  };

  const uniqueBooks = getUniqueBookForEachCategory();

  return (
    <div className="flex min-h-screen flex-col pb-6">
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
            {uniqueBooks.map((book) => (
              <div
                key={book.id}
                className="book cursor-pointer text-center"
                onClick={() => handleBookClick(book.id)}
              >
                <Card className={`bg-app-bg-darker transition-all hover:shadow-xl ${isMobile ? "w-auto h-auto" : "w-auto h-120"} `}>
                  <CardContent className="p-4">
                    <img
                      src={book.image}
                      alt={book.title}
                      className={`mx-auto transition-all ${
                        isMobile ? "h-45 w-45" : "h-72 w-48"
                      }`}
                    />
                    <CardTitle
                      className={`mt-2 font-semibold ${isMobile ? "text-lg" : "text-xl"}`}
                    >
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
