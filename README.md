# Déploiement de l'application ToDoList sur un cluster AKS


## Création de la BDD mysql

``` yaml
services:
  database:
    image: mysql:9.7.2@sha256:257388edf9c84dbc04c763625446d5f3fa6ed60d1b0873bc552c614ba0a7ab4e
    environment:
      MYSQL_RANDOM_ROOT_PASSWORD: yes
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - 3306:3306
    volumes:
      - mysql_data:/var/lib/mysql

```
**exemple de fichier .env backend / bdd avec user non-root :**

``` bash
DB_HOST=localhost
DB_USER=todolist
DB_PASSWORD=strong_user_password
DB_NAME=todolist_db
DB_DIALECT=mysql
PORT=3000 # port api backend
```

ps: pour lancer les tests du frontend sur WSL :

``` bash
sudo apt install -y chromium
export CHROME_BIN=$(which chromium)
```

## Création des Dockerfiles

**Dockerfile backend :**

``` Dockerfile
ARG NODE_VERSION=26.7.0-alpine3.24@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019

FROM node:${NODE_VERSION}

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code and chown to node user
COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
```

- `npm ci` utilisé à la place de `npm install`, best practice pour des builds reproductibles en utilisant le package-lock.json.
- Copie du code source et chown avec l'utilisateur `node` pour lancer le conteneur avec `node` plutôt que `root`.
- Utilisation de version d'images Docker avec Digest Pinning, ce qui garantit de toujours utiliser la même image.

**Dockerfile frontend :**

``` Dockerfile
ARG NODE_VERSION=26.7.0-alpine3.24@sha256:aadf416b2cdce311a8811ba3f0608a61b77dbf997500e2eafe781b51f6a0b019
ARG NGINX_VERSION=1.31.4-alpine3.24@sha256:901e944d1f4fc2bd077e8f5568b98c1f6f8cdacf6b97a87747c43134a339b9a7

# --- STAGE 1: BUILD APP ---
FROM node:${NODE_VERSION} AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

RUN npm run build -- --configuration=production


# --- STAGE 2: SERVE BUILD APP WITH NGINX WEB SERVER (non-root) ---
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS production

USER root

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build --chown=nginx:nginx /app/dist/frontend /usr/share/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# The unprivileged image listens on 8080 instead of 80
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

- Utilisation d'un Dockerfile multi-stage dans le but de réduire la taille de l'image finale et la surface d'attaque, elle n'embarque donc que les assets complilés servis par Nginx.
- `npm ci` utilisé à la palce de `npm install`, best practice pour des builds reproductibles en utilisant le package-lock.json.
- Utilisation de version d'images Docker avec Digest Pinning, ce qui garantie de toujours utiliser la même image.
- utilisation de l'image `nginxinc/nginx-unprivileged` (rootless) pour exécuter le conteneur avec l'utilisateur `nginx` plutôt que `root`.

## CI / CD et repository

Côté backend le dossier `node_modules` et `.env` ont été exclus du repository en mettant en place un `.env.example` (evite de surcharger le dépot avec + de 800 000 fichiers de dépendances et éviter de versionner les secrets) : 

``` bash
DB_HOST=database
DB_USER=todolist
DB_PASSWORD=strong_user_password
DB_NAME=todolist_db
DB_DIALECT=mysql
PORT=3000
```

### CI / CD Frontend


``` yaml
name: CI/CD Frontend

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

permissions: 
  contents: read

jobs:
  test:
    runs-on: ubuntu-24.04
    name: Run Frontend Tests
    steps:
      # Récupère le code du dépôt
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1

      # Configure Node.js pour l’environnement de test
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 20 
          cache: 'npm'

      # Installe les dépendances pour le job de test
      - run: npm ci

      # Exécute les tests unitaires Angular en mode Chrome headless
      - name: Exécuter les tests unitaires
        run: npx ng test --watch=false --browsers=ChromeHeadless

  build-and-push:
    needs: test
    if: github.ref == 'refs/heads/master' && github.event_name == 'push'
    runs-on: ubuntu-24.04
    name: Build and Push Docker frontend image
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout Repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1

      - name: Login to GitHub Container Registry
        uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4.6.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@37fe631027851001ddb9b187196cc803df7f5f0e # v4.3.0

      - name: Docker metadata
        id: meta
        uses: docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302 # v6.2.0
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha
            type=raw,value=latest

      - name: Build and push frontend image
        uses: docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a # v7.3.0
        with:
          context: .
          file: Dockerfile
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          push: true
          cache-from: type=gha
          cache-to: type=gha,mode=max

```

- Le job test n'a pas été modifié par rapport au fork.
- Intégration du job `build-and-push` avec la condition `needs: test`, déclenché uniquement lors d'un `push` sur la branche `master` avec différents steps:

  1. Checkout du code sur le runner
  2. Login sur GHCR grâce au secret fourni automatiquement `GITHUB_TOKEN`
  3. Setup de Docker Buildx
  4. Utilisation de l'action Docker metadata pour normaliser le nom de l'image finale et la mise en place de deux tags différents : `latest` sur chaque dernière image et le `sha du commit`
  5. Build and push de l'image Docker sur GHCR

### CI / CD Backend

Création de la CI/CD de 0 (aucun fichier présent lors du fork).

``` yaml
name: CI/CD Backend

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

permissions: 
  contents: read

jobs:
  test:
    runs-on: ubuntu-24.04

    services:
      mysql:
        image: mysql:9.7.2@sha256:257388edf9c84dbc04c763625446d5f3fa6ed60d1b0873bc552c614ba0a7ab4e
        env:
          MYSQL_DATABASE: todolist_db
          MYSQL_USER: todolist
          MYSQL_PASSWORD: testpassword
          MYSQL_ROOT_PASSWORD: rootpassword
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping -h localhost -u root -prootpassword"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
    steps:
      # Récupère le code du dépôt
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1

      # Configure Node.js pour l’environnement de test
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 20 
          cache: 'npm'

      # Installe les dépendances pour le job de test
      - run: npm ci

      # Exécute les tests unitaires
      - name: Exécuter les tests unitaires
        env:
          DB_HOST: localhost
          DB_USER: todolist
          DB_PASSWORD: testpassword
          DB_NAME: todolist_db
          DB_DIALECT: mysql 
        run: npm run test --runInBand # --runInBand pour éviter les problèmes de concurence entre les tests (se lancent un par un)

  build-and-push:
    needs: test
    if: github.ref == 'refs/heads/master' && github.event_name == 'push'
    runs-on: ubuntu-24.04
    name: Build and Push Docker backend image
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout Repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1

      - name: Login to GitHub Container Registry
        uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4.6.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@37fe631027851001ddb9b187196cc803df7f5f0e # v4.3.0

      - name: Docker metadata
        id: meta
        uses: docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302 # v6.2.0
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha
            type=raw,value=latest

      - name: Build and push backend image
        uses: docker/build-push-action@53b7df96c91f9c12dcc8a07bcb9ccacbed38856a # v7.3.0
        with:
          context: .
          file: Dockerfile
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          push: true
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

- Les tests exécutés sur le backend ont besoin d'une base de données fonctionnelle, un conteneur `mysql` est donc monté sur le runner lors de la CI.
- Les tests sont lancés avec l'argument `--runInBand` pour éviter les problèmes de conccurences entre les différents tests, ils se lancent donc un par un.


# Notes k8s

mdp grafana : 

kubectl get secret -n monitoring monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo


kubectl create serviceaccount github-actions -n todolist

creation permissions RBAC :
kubectl create rolebinding github-actions-binding \
  --clusterrole=edit \
  --serviceaccount=todolist:github-actions \
  -n todolist

kubectl create token github-actions -n todolist --duration=87600h # 10 ans
