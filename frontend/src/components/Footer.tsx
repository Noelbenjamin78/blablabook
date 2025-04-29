import React from "react";

const Footer: React.FC = () => {
<<<<<<< HEAD
    return (
        <footer className="fixed bottom-0 bg-secondary-blue text-white py-4 w-full">
            <div className="text-center">
                <a href="/rgpd" className='mr-5'>Politique de confidentialité</a>
                <a href="apropos">À propos</a>
                <p className="text-sm">© 2025 BlaBlaBook. Tous droits réservés.</p>
            </div>
        </footer>
    );
=======
  return (
    <footer className="bg-secondary-blue fixed bottom-0 w-full py-4 text-white">
      <div className="text-center">
        <p className="text-app-bg-darker text-sm">
          © 2025 BlaBlaBook. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
>>>>>>> d86c934 (feat: add book read and to read in library and saved in DB and lint and button bg color)
};

export default Footer;
