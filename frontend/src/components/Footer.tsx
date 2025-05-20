import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer data-testid="footer" className="bg-secondary-blue fixed bottom-0 w-full py-4 text-white">
      <div className="text-center">
        <Link to="/rgpd" className="mr-5">
          Politique de confidentialité
        </Link>
        <Link to="apropos">À propos</Link>
        <p className="text-sm">© 2025 BlaBlaBook. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
