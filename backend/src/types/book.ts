export interface Book {
    id: number;
    title: string;
    author: string;
    edition?: string;
    image: string;
    pages?: number;
    isbn: number;
    publication_date: Date;
    description: string;
    genre_id: number | null;
    genre_name?: string; // nullable, present when we join with genre table in some queries
  }