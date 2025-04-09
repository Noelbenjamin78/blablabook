# Installation

- Fill la DB via les commandes dans backend/script.sql (possible de toute exécuter d'un coup CTRL A + CTRL V)
  _rappel : connexion à la DB via les credentials présentes actuellement en clair dans docker-compose.yml_

- Bien lancer le backend avec le reste des containers

```sh
docker compose up -d --build
```

- Temporairement : créer un user dans la table "user" de la db

```sh
accès via localhost:8080 à adminer
```

# Routes API

## /books

| URL                  | Méthode HTTP | Données reçues                              | Données à envoyer |
| -------------------- | ------------ | ------------------------------------------- | ----------------- |
| `/api/books`         | `GET`        | `Liste des livres et de leur genre associé` | `/`               |
| `/api/books/:bookId` | `GET`        | `Infos du livre`                            | `/`               |

## /search

| URL                    | Méthode HTTP | Données reçues                                     | Données à envoyer |
| ---------------------- | ------------ | -------------------------------------------------- | ----------------- |
| `/api/search?name=aaa` | `GET`        | `10 premiers livres contenant "aaa" (exemple ici)` | `/`               |

## /library

| URL                                   | Méthode HTTP | Données reçues                                                                        | Données à envoyer   |
| ------------------------------------- | ------------ | ------------------------------------------------------------------------------------- | ------------------- |
| `/api/library`                        | `POST`       | `Ajouter un livre à la bibliothèque d'un user`                                        | `user_id + book_id` |
| `/api/library/:libraryEntryId`        | `DELETE`     | `Supprimer un livre de la bibliothèque d'un user`                                     | `/`                 |
| `/api/library/:libraryEntryId/status` | `PATCH`      | `Changer le statut d'un livre (0 : to read, 1 : read)`                                | `status`            |
| `/api/library/:userId?status=read`    | `GET`        | `Liste des livres de la bibliothèque d'un user (status peut être "read" ou "toread")` | `/`                 |
