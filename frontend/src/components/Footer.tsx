import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-blue fixed bottom-0 w-full py-4 text-white">
      <div className="text-center">
        <a href="/rgpd" className="mr-5">
          Politique de confidentialité
        </a>
        <a href="apropos">À propos</a>
        <p className="text-sm">© 2025 BlaBlaBook. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
