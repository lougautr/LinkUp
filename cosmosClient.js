const { CosmosClient } = require("@azure/cosmos");
const config = require("./config");

const client = new CosmosClient({
  endpoint: config.cosmos.endpoint,
  key: config.cosmos.key,
});

const database = client.database(config.cosmos.databaseId);

const containers = {
  users: database.container("Users"), // Conteneur "Users"
  posts: database.container("Posts"), // Conteneur "Posts"
};

// Test de connexion
(async () => {
  try {
    const { resource: dbDefinition } = await database.read();
    console.log(`Connecté à la base de données : ${dbDefinition.id}`);

    for (const [name, container] of Object.entries(containers)) {
      const { resource: containerDefinition } = await container.read();
      console.log(`Connecté au conteneur : ${name}`);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion à Cosmos DB :", error.message);
  }
})();

module.exports = containers;
