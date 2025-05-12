# LinkUp - An Azure project

## Project objective

The LinkUp project is a web application using Azure Cosmos DB to manage users and posts. The goal is to enable registration, login, and data management via a REST API built with Node.js and Express.

## Prerequisites

Before starting the project, make sure you have the following:
- `Node.js` (version 16 or higher)
- `npm` or `yarn`

## Development Environment

### Deployment Instructions (Development)

1. Install the dependencies :
```bash
npm install
```

2. Start the server in development mode :
```bash
npm run dev
```

### Documentation and Entry Points

1. Launch the project
The application server is available at the following address once started :
```bash
http://localhost:3000
```

2. API Documentation with Swagger
Swagger is available to visualize and test API routes :
```bash
http://localhost:3000/api-docs
```

## Production Environment

### Deployment on Azure

The project was deployed on Azure with the following services :
- `Azure App Service` to host the API.
- `Azure Cosmos DB` to store users and posts.
- `Azure Blob Storage` to host media files.

### Access to Production
- Base URL:
```bash
https://linkuplma-awd7bve4amarhdcn.westeurope-01.azurewebsites.net
```

- Swagger API documentation in production:
```bash
https://linkuplma-awd7bve4amarhdcn.westeurope-01.azurewebsites.net/api-docs
```

## API Testing

The API can be tested:
1. With `Swagger` on `"/api-docs"` urls
2. On `Postman` by importing our collection `LinkUp.postman_collection.json` available at the root of the project.

## Important Notes
- JWT: Protected routes require a valid JWT token. This must be included in the headers in the form:
```json
{
  "Authorization": "Bearer <your-token>"
}
```

## Contributors
- Lou-Anne Gautherie
- Antonin Montagne
- Mathieu Goudal
