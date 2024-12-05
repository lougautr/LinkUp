const {
  posts: postContainer,
  users: userContainer,
} = require("../cosmosClient");
const { v4: uuidv4 } = require("uuid");
const { uploadFileToBlob } = require("../blobService"); // Importer la fonction

exports.createPost = async (req, res) => {
  const cleanedBody = {};
  Object.keys(req.body).forEach((key) => {
    cleanedBody[key.trim()] = req.body[key];
  });
  req.body = cleanedBody;

  const { content } = req.body;

  const file = req.file;

  try {
    let mediaUrl = null;
    if (file) {
      mediaUrl = await uploadFileToBlob(file.originalname, file.buffer);
    }

    // Étape 2 : Création du post
    const post = {
      id: uuidv4(),
      userId: req.userId,
      content,
      mediaUrl,
      createdAt: new Date().toISOString(),
      type: "post",
    };

    await postContainer.items.create(post);
    res.status(201).json({ message: "Post créé avec succès", post });
  } catch (error) {
    console.error("Erreur lors de la création du post :", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    // Récupérer tous les posts
    const { resources: posts } = await postContainer.items
      .query("SELECT * FROM c WHERE c.type = 'post'")
      .fetchAll();

    // Vérifier le profil de chaque utilisateur associé aux posts
    const visiblePosts = await Promise.all(
      posts.map(async (post) => {
        try {
          // Ajouter le second paramètre pour la clé de partition
          const { resources: users } = await userContainer.items
            .query({
              query: "SELECT * FROM c WHERE c.id = @userId",
              parameters: [{ name: "@userId", value: post.userId }],
            })
            .fetchAll();

          const user = users[0];

          // Vérifiez si l'utilisateur a été trouvé et si le profil est public
          if (user && user.isPrivate === false) {
            return post; // Inclure le post si l'utilisateur est public
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération de l'utilisateur pour le post ${post.id}:`,
            error.message
          );
        }

        return null; // Si l'utilisateur n'est pas public ou une erreur survient
      })
    );

    // Filtrer les posts visibles (supprimer les `null`)
    const filteredPosts = visiblePosts.filter((post) => post !== null);

    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    // Requête SQL pour récupérer le post avec l'ID et la clé de partition userId
    const { resources: posts } = await postContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();

    const post = posts[0];

    if (!post || post.type !== "post") {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    // Requête pour vérifier si l'utilisateur associé est public
    const { resources: users } = await userContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @userId",
        parameters: [{ name: "@userId", value: post.userId }],
      })
      .fetchAll();

    const user = users[0];

    if (user && user.isPrivate === false) {
      return res.json(post); // Retourner le post si l'utilisateur est public
    }

    return res.status(403).json({ error: "Accès refusé au post" });
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du post ${id}:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  const cleanedBody = {};
  Object.keys(req.body).forEach((key) => {
    cleanedBody[key.trim()] = req.body[key];
  });
  req.body = cleanedBody;

  const { content } = req.body;
  const file = req.file; // Récupération du fichier envoyé

  try {
    let mediaUrl = null;
    if (file) {
      // Si un fichier est présent, on l'upload
      mediaUrl = await uploadFileToBlob(file.originalname, file.buffer);
    }

    const postId = req.params.id;

    // Recherche du post existant
    const { resources: posts } = await postContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: postId }],
      })
      .fetchAll();

    const existingPost = posts[0];

    // Vérification si le post existe et est du bon type
    if (!existingPost || existingPost.type !== "post") {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    // Mise à jour des champs avec les nouvelles valeurs ou les anciennes
    const updatedPost = {
      ...existingPost,
      content: content || existingPost.content, // Si le contenu est fourni, on le met à jour, sinon on garde l'ancien
      mediaUrl: mediaUrl || existingPost.mediaUrl, // Si un fichier a été uploadé, on met à jour l'URL du fichier
      updatedAt: new Date().toISOString(), // Met à jour la date de modification
    };

    // Mise à jour dans la base de données
    await postContainer.item(postId, existingPost.userId).replace(updatedPost);

    res.status(200).json({ message: "Post mis à jour avec succès", updatedPost });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post :", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the post by ID
    const { resources: posts } = await postContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();

    const post = posts[0];

    if (!post || post.type !== "post") {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure the post belongs to the user making the request
    if (post.userId !== req.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    // Delete the post
    await postContainer.item(post.id, post.userId).delete();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
