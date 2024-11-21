const express = require("express");
const { CosmosClient } = require("@azure/cosmos");
const config = require("./config");

const app = express();
app.use(express.json()); // Pour parser le JSON

// Initialiser Cosmos DB
const client = new CosmosClient({
  endpoint: config.cosmos.endpoint,
  key: config.cosmos.key,
});
const database = client.database(config.cosmos.databaseId);
const container = database.container(config.cosmos.containerId);

// Endpoint : Ajouter un post
app.post("/posts", async (req, res) => {
  try {
    const { resource: post } = await container.items.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint : Récupérer tous les posts
app.get("/posts", async (req, res) => {
  try {
    const { resources: posts } = await container.items.readAll().fetchAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint : Supprimer un post
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await container.item(id, id).delete();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log("Serveur en cours d'exécution sur http://localhost:3000");
});
