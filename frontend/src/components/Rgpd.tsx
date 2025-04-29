import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Rgpd = () => {
  return (
    <>
      <main className="container mx-auto p-4 text-center">
      <p className="text-6xl text-red-600 "> Ceci est un site factice à but pédagogique </p>
        <h1 className="text-6xl font-bold mb-6">Politique de confidentialité</h1>
        <section className="mb-6">
          <h2 className="text-5xl font-semibold mb-2">Collecte des données</h2>
          <p className="text-gray-700 text-4xl">
            Nous collectons des données personnelles telles que votre nom,
            adresse e-mail et toute autre information que vous fournissez
            volontairement lors de l'utilisation de notre plateforme.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-5xl font-semibold mb-2">Utilisation des données</h2>
          <p className="text-gray-700 text-3xl">
            Les données collectées sont utilisées pour améliorer nos services,
            personnaliser votre expérience et communiquer avec vous. Nous ne
            partageons pas vos informations avec des tiers sans votre
            consentement explicite.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-5xl font-semibold mb-2">Protection des données</h2>
          <p className="text-gray-700 text-3xl">
            Nous mettons en œuvre des mesures de sécurité techniques et
            organisationnelles pour protéger vos données contre tout accès non
            autorisé, perte ou divulgation.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-5xl font-semibold mb-2">Vos droits</h2>
          <p className="text-gray-700 text-3xl">
            Conformément au RGPD, vous avez le droit d'accéder, de rectifier ou
            de supprimer vos données personnelles. Vous pouvez également
            retirer votre consentement à tout moment.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-5xl font-semibold mb-2">Contact</h2>
          <p className="text-gray-700 text-3xl">
            Pour toute question concernant cette politique de confidentialité,
            veuillez nous contacter à l'adresse suivante : contact@blablabook.com.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Rgpd;
