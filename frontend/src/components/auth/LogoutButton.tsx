import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return isMobile ? (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-app-bg-darker mt-2 mb-4 justify-start p-0 text-lg font-bold hover:underline md:hidden"
    >
      Se déconnecter
    </Button>
  ) : (
    <Button
      onClick={handleLogout}
      variant="defaultNoHover"
      className="bg-app-bg-darker text-title-gold text-lg"
    >
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;
