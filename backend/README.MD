# ToDoList Backend API

Backend REST d'une application ToDoList en architecture mono-utilisateur, développé avec Node.js, Express, Sequelize et MySQL.

## 🚀 Technologies utilisées

- Node.js  
- Express  
- Sequelize  
- MySQL  
- Swagger UI  
- Jest + Supertest (tests)

## 🗂️ Structure du projet

```
backend/
├── src/
│   ├── config/           # Configuration de la base de données et de Swagger
│   ├── controllers/      # Logique des routes (CRUD sur les tâches)
│   ├── models/           # Modèles Sequelize
│   ├── routes/           # Déclaration des routes REST
│   ├── services/         # Logique métier (règles applicatives)
│   ├── docs/             # Fichier Swagger pour la documentation
│   ├── middlewares/      # Middlewares personnalisés pour Express
│   ├── app.js            # Initialisation de l'app Express
│   └── server.js         # Point d'entrée du serveur
├── tests/                # Tests unitaires et d'intégration
├── scriptSQL.sql         # Script SQL de création de la base et des tables
├── .env                  # Variables d’environnement (non versionnées)
├── package.json          # Dépendances, scripts, métadonnées
└── README.md             # Documentation du backend
```

## ⚙️ Configuration de l'environnement

### Prérequis

Avant de lancer ce projet, assurez-vous d'avoir installé :

- **Node.js** (version recommandée : 18.x ou supérieure)  
- **MySQL** (avec les droits de création de base et tables)  
- **npm** (installé avec Node.js)

### Fichier `.env`

Le fichier `.env` doit se situer à la racine du dossier `backend/`. Il contient les variables nécessaires à la connexion à la base de données et à la configuration du port d'écoute du serveur Express. Il est fourni dans ce projet d'étude afin de simplifier les choses. En temps normal, ce fichier n'est pas partagé pour des raisons évidentes de sécurité.

Exemple de fichier `.env` :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todolist_db
PORT=3000
```

### Base de données

1. **Nom de la base attendue :** `todolist_db`  
2. (optionnel) **Sécurité** : Créer un utilisateur possédant les droits d'écriture et de lecture pour cette base de données. Définir un nom et un mot de passe à cet utilisateur à reporter dans le fichier `.env`. Si vous restez sur l'utilisation du compte **root**, il faudra laisser le champ DB_PASSWORD du fichier `.env`vide.
3. **Script de création des tables :** `scriptSQL.sql` (à exécuter après la création de la base). Ce script est présent à la racine de ce projet.

Exemple SQL à lancer dans MySQL :

```sql
CREATE DATABASE todolist_db;
```

Puis exécuter le contenu du fichier `scriptSQL.sql` pour créer les tables nécessaires. Ce fichier est à la racine du projet.

## 📦 Installer les dépendances

```bash
npm install
```

## 🚀 Lancer le projet en développement

```bash
npm run start
```

L'API est accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 🧪 Lancer les tests

```bash
npm run test
```

## 📘 Documentation Swagger

Disponible à l'adresse :  
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

La documentation est générée à partir du fichier `swagger.json` dans `src/docs/`.

## 📌 Endpoints REST principaux

| Méthode | Endpoint         | Description              |
|--------:|------------------|--------------------------|
| GET     | /api/tasks       | Récupère toutes les tâches |
| GET     | /api/tasks/:id   | Récupère une tâche        |
| POST    | /api/tasks       | Crée une tâche            |
| PUT     | /api/tasks/:id   | Met à jour une tâche      |
| DELETE  | /api/tasks/:id   | Supprime une tâche        |



