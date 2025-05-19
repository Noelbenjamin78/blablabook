# Utiliser une image de base légère avec Node.js
FROM node:alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Installer ESLint et Vite globalement si nécessaire
RUN npm install -g eslint vite

# Exposer le port sur lequel l'application va tourner
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

