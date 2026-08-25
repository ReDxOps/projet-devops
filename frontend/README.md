# 📝 Projet ToDoList – Frontend Angular

Ce dépôt contient le frontend de l’application **ToDoList**, une application web de gestion de tâches conçue avec Angular. Il permet à un utilisateur de créer, modifier, supprimer et filtrer des tâches selon leur statut.

---

## 🧱 Stack technique

- **Framework** : [Angular 15](https://angular.io/)
- **Langage** : TypeScript
- **Design system** : Angular Material
- **Gestion des formulaires** : Reactive Forms
- **Tests unitaires** : Jasmine + Karma
- **Client HTTP** : HttpClient Angular

---

## 🚀 Lancement du projet

### ✅ Prérequis

- Node.js (version recommandée : >= 16)
- Angular CLI (version 15 installée globalement)

```bash
npm install -g @angular/cli@15
```

### 📦 Installation des dépendances

```bash
npm install
```

### ▶️ Démarrage du serveur de développement

```bash
npm start
```

L'application sera accessible à l'adresse : [http://localhost:4200](http://localhost:4200)

---

## 🧪 Tests unitaires

```bash
npm test
```

Cela lance les tests unitaires avec **Karma** et **Jasmine**. Les tests sont définis dans les fichiers `*.spec.ts` à côté de chaque composant, service ou module testé.

ℹ️ **Aucun test end-to-end (e2e)** n’est présent dans ce projet.

---

## 📁 Arborescence du projet

```
src/
├── app/
│   ├── components/
│   │   ├── task-form/         # Composant de formulaire de tâche (création/modification)
│   │   │   └── task-form.component.*
│   │   ├── task-list/         # Composant d'affichage des tâches avec filtres
│   │   │   └── task-list.component.*
│   ├── services/
│   │   └── task.service.ts    # Service de communication avec l'API backend
│   ├── models/
│   │   └── task.model.ts      # Interface représentant une tâche
│   ├── app.component.*        # Composant racine et layout général
│   ├── app-routing.module.ts  # Configuration des routes Angular
│   └── app.module.ts          # Module principal de l'application
├── assets/                    # Fichiers statiques
└── index.html                 # Page HTML principale
```

---

## 🧩 Modules et fonctionnalités

### 📌 `task-list.component`
- Affiche la liste des tâches récupérées depuis le backend.
- Permet un filtrage par statut (`À faire`, `En cours`, `Terminée`).
- Propose des boutons d'action pour modifier ou supprimer chaque tâche.
- Composant réactif, rafraîchi automatiquement après suppression.

### ✍️ `task-form.component`
- Gère le formulaire d’ajout ou de modification de tâche.
- Détermine automatiquement le mode (`création` ou `édition`) selon la route (`/ajouter` ou `/modifier/:id`).
- Envoie les données au backend via le `TaskService`.

### 🔁 `task.service.ts`
- Contient les appels HTTP au backend :
  - `getAllTasks()`
  - `getTask(id)`
  - `addTask(task)`
  - `updateTask(task)`
  - `deleteTask(id)`
- Utilise `HttpClient` et renvoie des observables typés.

### 🧭 `app-routing.module.ts`
- Déclare les routes suivantes :
  - `/` → composant `TaskListComponent`
  - `/ajouter` → composant `TaskFormComponent`
  - `/modifier/:id` → composant `TaskFormComponent` en mode édition

### 🧱 `task.model.ts`
- Interface `Task` définissant les propriétés :
  - `id?: number`
  - `nom: string`
  - `description: string`
  - `statut: string`

---

## 📚 Bonnes pratiques

- La logique métier est centralisée dans le `TaskService`.
- L’UI est construite avec Angular Material pour un rendu cohérent et accessible.
- Les composants sont découplés et respectent le principe SRP (Single Responsibility Principle).
- Les routes sont définies de manière claire et intuitive.
- Le code est tapé fortement grâce à TypeScript et aux interfaces.

---

## 🌐 URL du backend : pourquoi elle ne doit pas être codée en dur

L’URL du backend est définie via les fichiers d’environnement d’Angular, afin de rester adaptable selon l’environnement d’exécution.

- [`src/environments/environment.ts`](src/environments/environment.ts) : utilisé en développement (`ng serve`, `ng test`). Il contient l’URL locale de l’API.
- [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts) : utilisé pour le build de production (`ng build --configuration production`). Il permet de fournir une configuration adaptée à l’environnement de déploiement.
- [`angular.json`](angular.json) configure les remplacements de fichiers selon la configuration de build, ce qui rend cette logique transparente pour le code applicatif.
- [`task.service.ts`](src/app/services/task.service.ts) n’utilise pas d’URL figée en dur : il lit `environment.apiUrl`.

**Mécanisme d’adaptation utilisé dans le pipeline :**
- Dans le workflow GitHub Actions, une étape génère le fichier `src/environments/environment.prod.ts` avant le build.
- Cette étape remplace la valeur de `apiUrl` par `/api` pour que l’application fonctionne derrière l’ingress d’AKS.
- Cela permet d’éviter de hardcoder une URL spécifique au backend dans le code frontend.

**Ce que ça signifie concrètement :**
- En local, l’application utilise la configuration de développement.
- En production, la configuration peut être adaptée sans modifier le code métier.
- Cela rend le frontend plus portable et plus simple à déployer sur différents environnements.

---

## 🔐 CI/CD : validation et build de production (GitHub Actions)

Le pipeline est défini dans [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml). Il comporte actuellement deux jobs qui s'enchaînent :

1. **`test`** (à chaque push et pull request) : récupère le code, installe les dépendances avec `npm ci`, puis exécute `npx ng test --watch=false --browsers=ChromeHeadless`.
2. **`build`** (uniquement sur un push sur `master`, et uniquement si `test` a réussi) : réinstalle les dépendances, génère le fichier `src/environments/environment.prod.ts` avec `apiUrl: '/api'`, puis construit l'application avec `npx ng build --configuration production`.

À l'état actuel, ce workflow couvre donc la partie **validation** et **construction du frontend**. Aucune étape de déploiement sur AKS ou d'authentification OIDC n'est encore présente dans ce fichier.

### Ce que le workflow fait concrètement

- Vérifie que le code est fonctionnel sur chaque pull request et chaque push sur `master`.
- S'assure que les tests unitaires passent avant d'autoriser la suite du pipeline.
- Prépare l'environnement de production pour l'application Angular.
- Produit un bundle prêt à être déployé sur un environnement cible.

### Vérifier que tout fonctionne

Après un push sur `master` : onglet **Actions** du dépôt GitHub → workflow **CI/CD Frontend** → vérifier que les deux jobs sont verts. En cas d'échec, ouvrez le job concerné et lisez le message d'erreur de l'étape en rouge.

### 🩺 Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| Le job `test` échoue | Un test unitaire est cassé | Corriger le test ou le code avant de poursuivre |
| Le job `build` échoue | Le build Angular ou la génération de `environment.prod.ts` a échoué | Vérifier les logs de la step `Générer environment.prod.ts` ou du build Angular |
| Le bundle produit ne pointe pas vers le bon backend | L'URL de l'API n'est pas correctement configurée pour l'environnement de production | Adapter la valeur `apiUrl` dans la step de génération de `environment.prod.ts` |

---

## 📎 Ressources utiles

- [Documentation Angular](https://angular.io/docs)
- [Angular CLI cheatsheet](https://angular.io/cli)
- [Angular Material](https://material.angular.io/components/categories)
