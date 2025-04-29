// hooks/useBookWithStatus.ts
import fetchBookById from "@/api/books/fetchBookId";
import { useState, useCallback } from "react";
import { Book } from "../../../backend/src/types/book";

export const useBookWithStatus = (bookId: string | undefined) => {
  const [book, setBook] = useState<Book | null>(null);
  const [isRead, setIsRead] = useState(false);
  const [toRead, setToRead] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBook = useCallback(async () => {
    try {
      if (!bookId) return;

      const bookData = await fetchBookById(bookId);
      setBook(bookData);

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) throw new Error("Non connecté");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/library/user/${userId}/book/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok && res.status !== 404)
        throw new Error("Erreur de récupération");

      if (res.status === 404) return;

      const entry = await res.json();
      setIsRead(entry.status === 1);
      setToRead(entry.status === 0);
    } catch (e) {
      setBook(null);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  return { book, isRead, toRead, loading, loadBook };
};
