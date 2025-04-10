const fetchUserBooks = async (userId: number) => {
    const response = await fetch(`http://localhost:5000/api/library/${userId}`);
    const data = await response.json();
    return data;
};

export default fetchUserBooks;
