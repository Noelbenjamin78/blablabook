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
  ('Science-fiction'),
  ('Thriller'),
  ('Romance'),
  ('Roman historique'),
  ('Roman initiatique');

INSERT INTO book (title, author, edition, image, pages, isbn, publication_date, description, genre_id)
VALUES
  (
    'L''Ombre du vent',
    'Carlos Ruiz Zafón',
    'Édition française',
    'https://m.media-amazon.com/images/I/913DdP7RflL._SL1500_.jpg',
    636,
    9782253114864,
    '2001-04-01',
    'Un jeune garçon découvre un livre oublié qui va changer sa vie à jamais.',
    1
  ),
  (
    'Dune',
    'Frank Herbert',
    'Édition du 50e anniversaire',
    'https://m.media-amazon.com/images/I/81Ua99CURsL._SL1500_.jpg',
    896,
    9782266233200,
    '1965-08-01',
    'Une épopée de science-fiction se déroulant sur la planète désertique Arrakis.',
    2
  ),
  (
    'Les Apparences',
    'Gillian Flynn',
    'Édition française',
    'https://m.media-amazon.com/images/I/71EgpAMqnuL._SL1500_.jpg',
    696,
    9782253164913,
    '2012-06-05',
    'Un thriller sur la mystérieuse disparition d''une femme.',
    3
  ),
  (
    'Orgueil et préjugés',
    'Jane Austen',
    'Édition Penguin Classics',
    'https://images.unsplash.com/photo-1581091870627-3e3f7b2cf5ec',
    279,
    9781520455291,
    '1813-01-28',
    'Un roman romantique de mœurs qui a résisté à l''épreuve du temps.',
    4
  ),
  (
    'Le Nom du vent',
    'Patrick Rothfuss',
    'Édition de luxe',
    'https://images.unsplash.com/photo-1544936207-245d7c5f508d',
    800,
    9782352948918,
    '2007-03-27',
    'L''histoire d''un jeune homme doté de dons magiques qui devient le sorcier le plus célèbre de son monde.',
    1
  ),
  (
    'Neuromancien',
    'William Gibson',
    'Édition Ace Paperback',
    'https://m.media-amazon.com/images/I/81m-rJnUdRL._SL1500_.jpg',
    320,
    9782277223252,
    '1984-07-01',
    'Un classique cyberpunk qui a lancé le genre.',
    2
  ),
  (
    'Ne tirez pas sur l''oiseau moqueur',
    'Harper Lee',
    'Édition française',
    'https://m.media-amazon.com/images/I/51lVvSDLQJL._SL1052_.jpg',
    384,
    9782246857730,
    '1960-07-11',
    'Un roman sur les graves problèmes de viol et d''inégalité raciale vus à travers les yeux d''un enfant.',
    4
  ),
  (
    '1984',
    'George Orwell',
    'Édition française',
    'https://m.media-amazon.com/images/I/81qgSFhUemL._SL1500_.jpg',
    408,
    9782070368228,
    '1949-06-08',
    'Un roman dystopique se déroulant dans une société totalitaire sous surveillance constante.',
    2
  ),
  (
    'Gatsby le magnifique',
    'F. Scott Fitzgerald',
    'Édition française',
    'https://m.media-amazon.com/images/I/61z0MrB6qOS._SL1500_.jpg',
    240,
    9782070368228,
    '1925-04-10',
    'Une critique du rêve américain se déroulant dans les années folles.',
    4
  ),
  (
    'Moby Dick',
    'Herman Melville',
    'Édition française',
    'https://m.media-amazon.com/images/I/71f+1EmR2WL._SL1293_.jpg',
    720,
    9782745905338,
    '1851-10-18',
    'Le récit de la quête obsessionnelle du capitaine Achab pour tuer la baleine blanche.',
    4
  ),
  (
    'Guerre et Paix',
    'Léon Tolstoï',
    'Édition française',
    'https://m.media-amazon.com/images/I/81W6BFaJJWL._SL1500_.jpg',
    1225,
    9781400079988,
    '1869-01-01',
    'Un roman historique qui retrace l''invasion française de la Russie.',
    4
  ),
  (
    'Crime et Châtiment',
    'Fiodor Dostoïevski',
    'Édition française',
    'https://m.media-amazon.com/images/I/A193gO2P8WL._SL1500_.jpg',
    671,
    9782070368228,
    '1866-01-01',
    'Un roman psychologique explorant les dilemmes moraux d''un ancien étudiant pauvre.',
    3
  ),
  (
    'L''Attrape-cœurs',
    'J.D. Salinger',
    'Édition française',
    'https://m.media-amazon.com/images/I/7108sdEUEGL._SL1500_.jpg',
    277,
    9782266062336,
    '1951-07-16',
    'Une histoire sur l''aliénation adolescente et la perte de l''innocence du protagoniste Holden Caulfield.',
    5
  ),
  (
    'Bilbo le Hobbit',
    'J.R.R. Tolkien',
    'Édition française',
    'https://m.media-amazon.com/images/I/81uEDUfKBZL._SL1500_.jpg',
    310,
    9782253049418,
    '1937-09-21',
    'Un roman fantastique sur le voyage de Bilbo Baggins.',
    1
  ),
  (
    'Fahrenheit 451',
    'Ray Bradbury',
    'Édition française',
    'https://m.media-amazon.com/images/I/61JNd2+rnJL._SL1500_.jpg',
    213,
    9782070415731,
    '1953-10-19',
    'Un roman dystopique sur une société future américaine où les livres sont interdits.',
    2
  ),
  (
    'Jane Eyre',
    'Charlotte Brontë',
    'Édition française',
    'https://m.media-amazon.com/images/I/81cWqN6NQJL._SL1500_.jpg',
    500,
    9782070368228,
    '1847-10-16',
    'Orpheline, Jane Eyre devient gouvernante et tombe amoureuse de son mystérieux employeur, M. Rochester.',
    4
  ),
  (
    'Le Meilleur des mondes',
    'Aldous Huxley',
    'Édition française',
    'https://m.media-amazon.com/images/I/51zxDkx0hBL.jpg',
    311,
    9782266284184,
    '1932-01-01',
    'Un roman dystopique se déroulant dans un État mondial futuriste où le bonheur est obligatoire.',
    2
  ),
  (
    'Le Lion, la Sorcière blanche et l’Armoire magique',
    'C.S. Lewis',
    'Édition française',
    'https://m.media-amazon.com/images/I/71owMFA6TUL._SL1500_.jpg',
    208,
    9782070612369,
    '1950-10-16',
    'Quatre enfants découvrent le monde magique de Narnia en passant à travers une armoire enchantée.',
    1
  ),
  (
    'Da Vinci Code',
    'Dan Brown',
    'Édition française',
    'https://m.media-amazon.com/images/I/91qgJO5JCPL._SL1500_.jpg',
    689,
    9782266163823,
    '2003-03-18',
    'Un thriller ésotérique où le professeur Robert Langdon enquête sur un meurtre lié à une ancienne société secrète.',
    3
  ),
  (
    'L''Alchimiste',
    'Paulo Coelho',
    'Édition française',
    'https://m.media-amazon.com/images/I/71CaTj9MAFL._SL1500_.jpg',
    208,
    9782290349327,
    '1988-01-01',
    'Santiago, un jeune berger andalou, part à la recherche de sa légende personnelle à travers le désert.',
    1
  ),
  (
    'Anne... la maison aux pignons verts',
    'L.M. Montgomery',
    'Édition française',
    'https://m.media-amazon.com/images/I/718E8YzOYnL._SL1500_.jpg',
    320,
    9782266203970,
    '1908-06-01',
    'Les aventures d''Anne Shirley, une orpheline vive et imaginative, adoptée par un couple de fermiers sur l''Île-du-Prince-Édouard.',
    5
  );