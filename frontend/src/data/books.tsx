/* eslint-disable prettier/prettier */
/* eslint-disable indent */
export type Book = {
  id: number;
  title: string;
  catégorie: string;
  description: string;
  img: string;
};

export const books: Book[] = [
  {
    id: 1,
    title: "L'amour éternel",
    catégorie: "Romance",
    description: "Description 1",
    img: "../src/assets/cover.png",
  },
  {
    id: 2,
    title: "Voyage interstellaire",
    catégorie: "Science Fiction",
    description: "Description 2",
    img: "../src/assets/cover.png",
  },
  {
    id: 3,
    title: "Le royaume enchanté",
    catégorie: "Fantasy",
    description: "Description 3",
    img: "../src/assets/cover.png",
  },
  {
    id: 4,
    title: "Mystère au manoir",
    catégorie: "Mystery",
    description: "Description 4",
    img: "../src/assets/cover.png",
  },
  {
    id: 5,
    title: "Les secrets de la vie",
    catégorie: "Non-Fiction",
    description: "Description 5",
    img: "../src/assets/cover.png",
  },
  {
    id: 6,
    title: "Une vie extraordinaire",
    catégorie: "Biography",
    description: "Description 6",
    img: "../src/assets/cover.png",
  },
  {
    id: 7,
    title: "Frissons nocturnes",
    catégorie: "Thriller",
    description: "Description 7",
    img: "../src/assets/cover.png",
  },
  {
    id: 8,
    title: "Les ombres du passé",
    catégorie: "Historical Fiction",
    description: "Description 8",
    img: "../src/assets/cover.png",
  },
];
