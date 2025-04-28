const fetchBooks = async () => {
  try {
    console.log("API URL:", `${import.meta.env.VITE_API_URL}/books`);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/books`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des livres:", error);
    throw error; // Relance l'erreur pour la gestion dans le composant
  }
};
export default fetchBooks;
