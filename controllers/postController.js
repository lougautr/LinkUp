const { posts: postContainer, users: userContainer } = require("../cosmosClient");
const { v4: uuidv4 } = require("uuid");
const { uploadFileToBlob } = require("../blobService"); // Importer la fonction

exports.createPost = async (req, res) => {
 
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
          console.error(`Erreur lors de la récupération de l'utilisateur pour le post ${post.id}:`, error.message);
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
    console.error(`Erreur lors de la récupération du post ${id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const file = req.file;

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
      return res.status(403).json({ error: "Unauthorized to update this post" });
    }

    // Update media if a new file is uploaded
    let mediaUrl = post.mediaUrl;
    if (file) {
      mediaUrl = await uploadFileToBlob(file.originalname, file.buffer);
    }

    // Update content and media URL
    const updatedPost = {
      ...post,
      content: content || post.content,
      mediaUrl,
      updatedAt: new Date().toISOString(),
    };

    // Replace the post in the database
    await postContainer.item(post.id, post.userId).replace(updatedPost);

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error(`Error updating post ${id}:`, error.message);
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
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    // Delete the post
    await postContainer.item(post.id, post.userId).delete();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
