# Projet Azure : LinkUp

## Objectif du projet

Le projet LinkUp est une application web utilisant Azure Cosmos DB pour gérer les utilisateurs et les posts. L’objectif est de permettre l’inscription, la connexion et la gestion des données via une API REST construite avec Node.js et Express.

## Prérequis

Avant de lancer le projet, assurez-vous de disposer des éléments suivants :
- `Node.js` (version 16 ou supérieure)
- `npm` ou `yarn`

## Environnement de Développement

### Instructions de Déploiement (Développement)

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur en mode développement :
```bash
npm run dev
```

### Documentation et Points d'entrée

1. Lancer le projet
Le serveur de l'application est disponible à l'adresse suivante une fois démarré :
```bash
http://localhost:3000
```

2. Documentation API avec Swagger
Swagger est disponible pour visualiser et tester les routes de l'API :
```bash
http://localhost:3000/api-docs
```

## Environnement de Production

### Déploiement sur Azure

Le projet a été déployé sur Azure avec les services suivants :
- `Azure App Service` pour héberger l'API.
- `Azure Cosmos DB` pour stocker les utilisateurs et les publications.
- `Azure Blob Storage` pour héberger les fichiers multimédias.

### Accès à la Production
- URL de base :
```bash
https://linkuplma-awd7bve4amarhdcn.westeurope-01.azurewebsites.net
```

- Documentation API Swagger en production :
```bash
https://linkuplma-awd7bve4amarhdcn.westeurope-01.azurewebsites.net/api-docs
```

## Tests de l'API

L'API peut être testé :
1. Avec `Swagger` sur les urls `"/api-docs"`
2. Sur `Postman` en important notre collection `LinkUp.postman_collection.json` disponible à la racine du projet.

## Notes importantes
- JWT : Les routes protégées nécessitent un token JWT valide. Celui-ci doit être inclus dans les headers sous la forme :
```json
{
  "Authorization": "Bearer <votre-token>"
}
```
