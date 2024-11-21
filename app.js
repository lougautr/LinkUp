const { CosmosClient } = require("@azure/cosmos");
const config = require("./config");

// Initialiser le client Cosmos DB
const client = new CosmosClient({
  endpoint: config.cosmos.endpoint,
  key: config.cosmos.key,
});

// Références à la base et au conteneur
const database = client.database(config.cosmos.databaseId);
const container = database.container(config.cosmos.containerId);

// Ajouter un document
async function addPost(post) {
  try {
    const { resource: createdPost } = await container.items.create(post);
    console.log(`Post créé avec succès : ${createdPost.id}`);
  } catch (err) {
    console.error("Erreur lors de l'ajout du post :", err.message);
  }
}

// Lire tous les documents
async function getAllPosts() {
  try {
    const { resources: posts } = await container.items.readAll().fetchAll();
    console.log("Posts récupérés :", posts);
  } catch (err) {
    console.error("Erreur lors de la récupération des posts :", err.message);
  }
}

// Mettre à jour un document
async function updatePost(id, updates) {
  try {
    const { resource: post } = await container.item(id, id).read();
    const updatedPost = { ...post, ...updates }; // Fusionner les données
    await container.item(id, id).replace(updatedPost);
    console.log(`Post ${id} mis à jour avec succès.`);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du post :", err.message);
  }
}

// Supprimer un document
async function deletePost(id) {
  try {
    await container.item(id, id).delete();
    console.log(`Post ${id} supprimé avec succès.`);
  } catch (err) {
    console.error("Erreur lors de la suppression du post :", err.message);
  }
}

// Exemple d'utilisation
(async () => {
  await addPost({
    id: "1", // ID unique
    userId: "user123",
    title: "Mon premier post",
    content: "Voici le contenu de mon premier post.",
    createdAt: new Date().toISOString(),
  });

  await getAllPosts();

  await updatePost("1", {
    title: "Mon post mis à jour",
    content: "Contenu modifié.",
  });

  await deletePost("1");
})();
