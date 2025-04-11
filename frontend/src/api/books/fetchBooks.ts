const fetchBooks = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/books`);
    const data = await response.json();
    return data;
};

export default fetchBooks;
