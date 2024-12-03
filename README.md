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
    "token": "<your_token>"
}
```

### 3. Récupération des posts
- Route : http://localhost:3000/posts/
- Méthode : GET
- Header :
```json
"authorization": "Bearer <your_token>"
```

- Réponse attendue (200 OK)
```json
[
    {
        "id": "<post_id>",
        "userId": "<user_id>",
        "content": "Voici un exemple de contenu pour le post.",
        "mediaUrl": "https://example.com/media/image.png",
        "createdAt": "2024-12-03T13:21:48.476Z",
        "type": "post",
        "_rid": "D1ZvANZednMCAAAAAAAAAA==",
        "_self": "dbs/D1ZvAA==/colls/D1ZvANZednM=/docs/D1ZvANZednMCAAAAAAAAAA==/",
        "_etag": "\"4a089080-0000-0e00-0000-674f05ed0000\"",
        "_attachments": "attachments/",
        "_ts": 1733232109
    }
]
```

### 4. Création d'un post
- Route : http://localhost:3000/posts/
- Méthode : POST
- Header :
```json
"authorization": "Bearer <your_token>"
```
- Body : JSON
```json
{
  "content": "Voici un exemple de contenu pour le post.",
  "mediaUrl": "https://example.com/media/image.png"
}
```

- Réponse attendue (201 Created)
```json
{
    "message": "Post créé avec succès",
    "post": {
        "id": "<post_id>",
        "userId": "<your_user_id>",
        "content": "Voici un exemple de contenu pour le post.",
        "mediaUrl": "https://example.com/media/image.png",
        "createdAt": "2024-12-03T12:48:07.744Z",
        "type": "post"
    }
}
```

## Notes importantes

# Résumé

