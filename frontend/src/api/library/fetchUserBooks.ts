const fetchUserBooks = async (userId: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/library/${userId}`,
  );
  const data = await response.json();
  return data;
};

export default fetchUserBooks;
