import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  genre_name: string;
  description: string;
  image: string;
};

type Props = {
  books: Book[];
  openTrigger: boolean;
};

function SearchMethods({ books, openTrigger }: Props) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  console.log(books);

  useEffect(() => {
    if (openTrigger) {
      setShowSearch(true);
    }
  }, [openTrigger]);

  const filteredBooks = books.filter(
    (book) =>
      searchInput.trim() !== "" &&
      book.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleCloseSearch = () => {
    setSearchInput("");
    setShowSearch(false);
  };

  const handleBookClick = (id: number) => {
    setShowSearch(false);
    setSearchInput("");
    navigate(`/book/${id}`);
  };

  return (
    <div>
      {/* Mobile Search Overlay */}
      {showSearch && isMobile && (
        <div
          className="bg-opacity-90 fixed inset-0 z-50 flex flex-col items-center bg-black p-4"

        >
          <div className="mb-4 flex w-full justify-end">
            <X className="h-6 w-6 cursor-pointer text-white" onClick={handleCloseSearch}/>
          </div>

          <input
            type="text"
            placeholder="Entrez votre recherche..."
            className="w-full mb-4 p-2 rounded bg-white text-black placeholder-gray-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />

          <div className="w-full overflow-y-auto">
            {searchInput.trim() === "" ? (
              <p className="text-center text-white">Recherche</p>
            ) : filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="mb-2 flex items-center gap-4 rounded bg-white p-2"
                  onClick={() => handleBookClick(book.id)}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-32 w-20 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.genre_name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white">Aucun résultat trouvé</p>
            )}
          </div>
        </div>
      )}

     {/* Desktop Search with black modal */}
{!isMobile && (
  <div className="relative">
    <input
      type="text"
      placeholder="Entrez votre recherche..."
      className="w-full bg-white text-black placeholder-gray-500 pl-10 p-2 rounded"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />

    {searchInput.trim() !== "" && (
      <div
        className="fixed inset-0 z-50 bg-black flex flex-col items-center p-4 w-full overflow-y-auto"
        onClick={handleCloseSearch} 
        style={{ background: "rgba(0, 0, 0, 0.7)" }}
      >
        <div className="w-full flex justify-end">
          <button onClick={handleCloseSearch}>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/*Results */}
        <div 

        className="w-full max-w-4xl mt-4 rounded p-4 shadow-lg overflow-y-auto"
         style={{ background: "black" }}> 
        {/*  Voir si on laisse le le fond noir */}
        <input
      type="text"
      placeholder="Entrez votre recherche..."
      className="w-full bg-white text-black placeholder-gray-500 pl-10 p-2 rounded mb-3 p-2 rounded"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="mb-2 flex items-center gap-4 rounded bg-white p-2 h-50"
                onClick={() => handleBookClick(book.id)}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-32 w-20 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold text-black text-2xl ">{book.title}</h3>
                  <p className="text-xl text-gray-600">{book.genre_name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Aucun résultat trouvé</p>
          )}
        </div>
      </div>
    )}
  </div>
)}

    </div>
  );
}

export default SearchMethods;