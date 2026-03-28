# Etude de Cas 3.1 - Creation de l'API des articles

## Contexte
Ce projet complete une API Node.js/Express avec MongoDB pour la gestion des utilisateurs et des articles, selon les 6 points demandes dans la feuille de travail.

## 1. Diagramme UML de la base de donnees
Le modele de donnees contient deux entites principales :
- `User`
- `Article`

Relation :
- **One-to-many** : un `User` peut avoir plusieurs `Article`.

Champs metier importants :
- `User.role` : enum `admin | member`
- `Article.status` : enum `draft | published`

## 2. Enumeration dans `article.schema.js`
Le schema `Article` contient un champ `status` avec :
- valeurs autorisees : `draft`, `published`
- valeur par defaut : `draft`
- message d'erreur personnalise en cas de valeur invalide

Fichier :
- `api/articles/articles.schema.js`

## 3. Endpoints create / update / delete des articles
Le module Article a ete implemente avec architecture en couches :
- service : `api/articles/articles.service.js`
- controller : `api/articles/articles.controller.js`
- router : `api/articles/articles.router.js`

Routes mises en place :
- `POST /api/articles` (utilisateur connecte requis)
- `PUT /api/articles/:id` (utilisateur connecte + role admin)
- `DELETE /api/articles/:id` (utilisateur connecte + role admin)

Points de conformite :
- lors de la creation, l'article est associe a l'utilisateur connecte via `req.user.userId`
- securisation des operations sensibles (update/delete) par controle du role admin
- ajout d'evenements temps reel Socket.IO :
  - `article:create`
  - `article:update`
  - `article:delete`

Fichiers :
- `api/articles/articles.router.js`
- `api/articles/articles.controller.js`
- `api/articles/articles.service.js`
- `middlewares/admin.js`
- `server.js`

## 4. Endpoint public `api/users/:userId/articles`
Un endpoint public a ete ajoute pour recuperer les articles d'un utilisateur :
- `GET /api/users/:userId/articles`

Conformite :
- endpoint non bloque par middleware d'authentification
- recuperation des articles par `userId`
- utilisation de `populate()` pour enrichir les informations utilisateur
- exclusion du mot de passe avec `-password`

Fichiers :
- `api/users/users.router.js`
- `api/articles/articles.controller.js` (methode `getByUser`)
- `api/articles/articles.service.js` (methode `getByUser`)

## 5. Tests (creation, mise a jour, suppression)
Les tests ont ete rediges avec `supertest` et `mockingoose` dans :
- `tests/articles.spec.js`

Scenarios couverts :
- creation d'article -> HTTP `201`
- mise a jour d'article -> HTTP `200`
- suppression d'article -> HTTP `204`
- cas supplementaire : refus pour utilisateur non-admin -> HTTP `401`

Un fichier unitaire supplementaire a aussi ete ajoute :
- `tests/articles.controller.unit.spec.js`

## 6. Configuration de deploiement PM2
Configuration realisee dans :
- `ecosystem.config.js`

Exigences implantees :
- logs d'erreurs : `./logs/err.log`
- limite memoire : `200M`
- lancement en parallele : `3` instances (`cluster`)

Commande PM2 pour lancer l'application :

```bash
pm2 start ecosystem.config.js --env production
```

Commande utile (si besoin) :

```bash
mkdir -p logs
```

## Installation et execution locale
```bash
npm install
npm run dev
```

Application disponible sur :
- `http://localhost:3000`

Pour lancer les tests :
```bash
npm test
```
