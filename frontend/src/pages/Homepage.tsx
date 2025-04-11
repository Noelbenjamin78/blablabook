/* eslint-disable indent */
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../styles/Homepage.css";
import { useIsMobile } from "../hooks/use-mobile";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { books } from "@/data/books";

export default function Homepage() {
  const isMobile = useIsMobile();

  
  // Unique books by category
  const uniqueBooksByCategory = () => {
    const seenCategories = new Set();
    return books.filter((book) => {
      if (!seenCategories.has(book.catégorie)) {
        seenCategories.add(book.catégorie);
        return true;
      }
      return false;
    });
  };

  // Random book
  const randomBook = books[Math.floor(Math.random() * books.length)];

  return (
    <div className="flex min-h-screen flex-col">
      <Header books={books} />

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
            {(isMobile ? [randomBook] : uniqueBooksByCategory()).map((book) => (
              <div key={book.id} className="book text-center">
                <Card className="transition-all hover:shadow-xl">
                  <CardContent className="p-4">
                    <img
                      src={book.img}
                      alt={book.title}
                      className={`mx-auto transition-all ${
                        isMobile ? "h-auto w-full" : "h-72 w-48"
                      }`}
                    />
                    <CardTitle className="mt-2 text-xl font-semibold">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {book.catégorie}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
