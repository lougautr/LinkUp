const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LinkUp API",
      version: "1.0.0",
      description: "Documentation de l'API LinkUp pour gérer les utilisateurs et les posts.",
    },
    servers: [
      {
        url: "linkuplma-awd7bve4amarhdcn.westeurope-01.azurewebsites.net",
        description: "Serveur local",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Point d'entrée pour lire les annotations Swagger dans les fichiers de routes
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = swaggerDocs;
