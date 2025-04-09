const fetchBooks = async () => {
    const response = await fetch('http://localhost:5000/api/books/');
    const data = await response.json();
    return data;
};

export default fetchBooks;
