export const handleRemoveFromLibrary = async (
  bookId: number,
  userId: number,
  token: string,
  fetchData: () => void,
) => {
  if (!userId || !token) {
    console.error("Utilisateur ou token manquant");
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/library/${bookId}/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du livre");
    }

    const text = await response.text();
    if (text) {
      console.log("Livre supprimé de la bibliothèque:", JSON.parse(text));
    }
    fetchData();
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error);
  }
};
