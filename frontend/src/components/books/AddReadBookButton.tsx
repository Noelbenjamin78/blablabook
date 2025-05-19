import { Check, Cross, BookOpenCheck } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const AddReadBookButton = ({
  onStatusChange,
}: {
  onStatusChange: () => void;
}) => {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isMobile = useIsMobile();
  const [isRead, setIsRead] = useState(false);

  const handleAddReadBookSuccess = () => {
    toast.success(
      <div className="flex items-center space-x-2">
        <p>Le livre a bien été marqué comme lu !</p>
        <Check size={16} />
      </div>,
    );
    setIsRead(true);
  };

  const handleAddReadBookFailed = () => {
    toast.error(
      <div className="flex items-center space-x-2">
        <p>Erreur lors de l'ajout du livre comme lu</p>
        <Cross size={16} />
      </div>,
    );
  };

  const handleAddReadBook = async () => {
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
        body: JSON.stringify({ user_id: userId, book_id: id, status: 1 }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du livre comme lu");
      }

      const data = await response.json();
      handleAddReadBookSuccess();
      onStatusChange();
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre comme lu:", error);
      handleAddReadBookFailed();
    }
  };

  if (isRead) {
    return null;
  }

  return isMobile ? (
    <Button
      variant="ghost"
      onClick={handleAddReadBook}
      className="w-18 rounded-full px-4 py-2 cursor-pointer"
    >
      <BookOpenCheck className="text-secondary-blue scale-150" />
    </Button>
  ) : (
    <Button
      variant="primary"
      onClick={handleAddReadBook}
      className="w-24 rounded px-4 py-2 cursor-pointer"
    >
      <BookOpenCheck className="text-secondary-blue scale-175" />
      <p className="text-secondary-blue ml-2 md:text-xl lg:text-2xl">Lu</p>
    </Button>
  );
};

export default AddReadBookButton;
