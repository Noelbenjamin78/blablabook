import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface LogoutButtonProps {
    onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <Button onClick={handleLogout} variant="defaultNoHover" className="bg-white text-title-gold">
            Se déconnecter
        </Button>
    );
};

export default LogoutButton;
