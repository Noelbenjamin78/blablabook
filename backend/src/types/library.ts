export interface LibraryEntry {
    id: number;
    user_id: number;
    book_id: number;
    status: number; // 0 = to read, 1 = read
  }
  
  export interface NewLibraryEntry {
    user_id: number;
    book_id: number;
    status?: number;
  }