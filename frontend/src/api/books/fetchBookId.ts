const fetchBookById = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du livre:", error);
    throw error;
  }
};

export default fetchBookById;
