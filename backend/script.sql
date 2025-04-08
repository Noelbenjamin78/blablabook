----------------------------- STRUCTURE TABLES ------------------------------

DROP TABLE IF EXISTS library, book, genre, "user" CASCADE;

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE genre (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  edition VARCHAR(50),
  image VARCHAR(255) NOT NULL,
  pages INT,
  isbn BIGINT NOT NULL,
  publication_date DATE NOT NULL,
  description TEXT NOT NULL,
  genre_id INT REFERENCES genre(id) ON DELETE SET NULL
);

CREATE TABLE library (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
  book_id INT REFERENCES book(id) ON DELETE CASCADE,
  status SMALLINT NOT NULL CHECK (status IN (0, 1))  -- 0 = to read, 1 = read
);


-------------------------- INSERTION -----------------------------------

INSERT INTO genre (name) VALUES
  ('Fantasy'),
  ('Science Fiction'),
  ('Thriller'),
  ('Romance');

INSERT INTO book (title, author, edition, image, pages, isbn, publication_date, description, genre_id)
VALUES
  (
    'The Shadow of the Wind',
    'Carlos Ruiz Zafón',
    'First',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    512,
    9780143034902,
    '2001-04-01',
    'A young boy discovers a forgotten book that will change his life forever.',
    1
  ),
  (
    'Dune',
    'Frank Herbert',
    '50th Anniversary Edition',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc',
    896,
    9780441172719,
    '1965-08-01',
    'Epic science fiction saga set on the desert planet Arrakis.',
    2
  ),
  (
    'Gone Girl',
    'Gillian Flynn',
    'Movie Tie-In Edition',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
    432,
    9780307588371,
    '2012-06-05',
    'A thriller about a woman''s mysterious disappearance.',
    3
  ),
  (
    'Pride and Prejudice',
    'Jane Austen',
    'Penguin Classics',
    'https://images.unsplash.com/photo-1581091870627-3e3f7b2cf5ec',
    279,
    9780141439518,
    '1813-01-28',
    'A romantic novel of manners that has stood the test of time.',
    4
  ),
  (
    'The Name of the Wind',
    'Patrick Rothfuss',
    'Deluxe Edition',
    'https://images.unsplash.com/photo-1544936207-245d7c5f508d',
    662,
    9780756404741,
    '2007-03-27',
    'The tale of a magically gifted young man who grows to be the most notorious wizard his world has ever seen.',
    1
  ),
  (
    'Neuromancer',
    'William Gibson',
    'Ace Paperback',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    271,
    9780441569595,
    '1984-07-01',
    'A cyberpunk classic that launched the genre.',
    2
  );