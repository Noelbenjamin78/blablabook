const fetchUserBooks = async (userId: string, status?: "read" | "toread") => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token manquant");
    return;
  }

  if (!userId) {
    console.error("userId manquant");
    return;
  }

  const url = status
    ? `${import.meta.env.VITE_API_URL}/library/${userId}?status=${status}`
    : `${import.meta.env.VITE_API_URL}/library/${userId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return [];
  }

  const data = await response.json();
  return data;
};

export default fetchUserBooks;
