# Projet Azure : LinkUp

## Objectif du projet

Le projet LinkUp est une application web utilisant Azure Cosmos DB pour gérer les utilisateurs et les posts. L’objectif est de permettre l’inscription, la connexion et la gestion des données via une API REST construite avec Node.js et Express.

## Prérequis

Avant de lancer le projet, assurez-vous de disposer des éléments suivants :
- Node.js (version 16 ou supérieure)
- npm ou yarn

## Instructions de déploiement

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur en mode développement :
```bash
npm run dev
```

## Tests

Voici une liste des routes disponibles avec leurs méthodes, corps de requête et résultats attendus.

### 1. Inscription d’un utilisateur
- Route : http://localhost:3000/users/register
- Méthode : POST
- Body : JSON
```json
{
  "username": "testuser",
  "password": "password123",
  "isPrivate": false
}
```

- Réponse attendue (201 Created)
```json
{
  "message": "Utilisateur créé avec succès"
}
```

### 2. Connexion d’un utilisateur
- Route : http://localhost:3000/users/login
- Méthode : POST
- Body : JSON
```json
{
  "username": "testuser",
  "password": "password123"
}
```

- Réponse attendue (200 OK)
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI3Y2IwZWJiLWEyNjMtNDc0OC1iMDBkLWFmMzllYjQxYTc0NiIsImlhdCI6MTczMzIyMTQ1MiwiZXhwIjoxNzMzMzA3ODUyfQ.2t8hV6SENOp3BrEIVR0fih5mbAyId2NjMk45c7ifyiE"
}
```

## Notes importantes

# Résumé

