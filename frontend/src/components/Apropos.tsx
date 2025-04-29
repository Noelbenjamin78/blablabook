import React from "react";


const Apropos = () => {
  return (
    <>
      
      <main className="container mx-auto p-4 text-center">
        <p className="text-6xl text-red-600 "> Ceci est un site factice à but pédagogique </p>
        <h1 className="text-6xl font-bold mb-10 text-title-gold ">À propos de nous</h1>
        <section className="mb-5">
          <h2 className="text-4xl font-semibold mb-2  text-title-gold">Notre mission</h2>
          <p className="text-gray-700 text-4xl">
            Chez Blablabook, notre mission est de connecter les gens à travers
            des expériences partagées et des histoires captivantes. Nous
            croyons au pouvoir de la communauté et de la communication.
          </p>
        </section>
        <section className="mb-5">
          <h2 className="text-4xl font-semibold mb-2 text-title-gold ">Notre vision</h2>
          <p className="text-gray-700 text-4xl">
            Nous aspirons à devenir une plateforme incontournable pour les
            passionnés de lecture et d'écriture, en offrant un espace où chacun
            peut s'exprimer librement et se connecter avec des esprits
            similaires.
          </p>
        </section>
        <section className="mb-5">
          <h2 className="text-4xl font-semibold mb-2 text-title-gold">Notre équipe</h2>
          <p className="text-gray-700 text-4xl">
            Notre équipe est composée de passionnés de technologie, de
            littérature et de design. Ensemble, nous travaillons pour créer une
            expérience utilisateur exceptionnelle et une communauté dynamique.
          </p>
        </section>
      </main>
      
    </>
  );
};

export default Apropos;
