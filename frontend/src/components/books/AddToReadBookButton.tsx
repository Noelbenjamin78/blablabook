import { Cross, HeartPlus } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const AddToReadBookButton = ({
  onStatusChange,
}: {
  onStatusChange: () => void;
}) => {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isMobile = useIsMobile();
  const [isToRead, setIsToRead] = useState(false);

  const handleAddToReadBookSuccess = () => {
    toast.success(
      <div className="flex items-center space-x-2">
        <p>Le livre a bien été marqué comme livre à lire !</p>
        <HeartPlus size={16} />
      </div>,
    );
    setIsToRead(true);
  };

  const handleAddToReadBookFailed = () => {
    toast.error(
      <div className="flex items-center space-x-2">
        <p>Erreur lors de l'ajout du livre à lire</p>
        <Cross size={16} />
      </div>,
    );
  };

  const handleAddToReadBook = async () => {
    if (!id || !userId || !token) {
      console.error("ID du livre, ID de l'utilisateur ou token manquant");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, book_id: id, status: 0 }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du livre comme lu");
      }

      const data = await response.json();
      handleAddToReadBookSuccess();
      onStatusChange();
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout du livre comme livre à lire:",
        error,
      );
      handleAddToReadBookFailed();
    }
  };

  if (isToRead) {
    return null;
  }

  return isMobile ? (
    <Button
      type="button"
      variant="ghost"
      onClick={handleAddToReadBook}
      className="w-18 cursor-pointer rounded-full px-4 py-2"
    >
      <HeartPlus className="text-title-gold scale-150" size={30} />
    </Button>
  ) : (
    <Button
      type="button"
      variant="primary"
      onClick={handleAddToReadBook}
      className="w-26 cursor-pointer rounded px-4 py-2"
    >
      <HeartPlus className="text-title-gold scale-175" size={16} />
      <p className="text-title-gold ml-2 md:text-xl lg:text-2xl">A lire</p>
    </Button>
  );
};

export default AddToReadBookButton;
