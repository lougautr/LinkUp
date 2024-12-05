const {
  posts: postContainer,
  users: userContainer,
} = require("../cosmosClient");
const { v4: uuidv4 } = require("uuid");
const { uploadFileToBlob } = require("../blobService"); // Import the function

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

    // Step 2: Create the post
    const post = {
      id: uuidv4(),
      userId: req.userId,
      content,
      mediaUrl,
      createdAt: new Date().toISOString(),
      type: "post",
    };

    await postContainer.items.create(post);
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    // Fetch all posts
    const { resources: posts } = await postContainer.items
      .query("SELECT * FROM c WHERE c.type = 'post'")
      .fetchAll();

    // Check each user's profile associated with the posts
    const visiblePosts = await Promise.all(
      posts.map(async (post) => {
        try {
          // Add the second parameter for partition key
          const { resources: users } = await userContainer.items
            .query({
              query: "SELECT * FROM c WHERE c.id = @userId",
              parameters: [{ name: "@userId", value: post.userId }],
            })
            .fetchAll();

          const user = users[0];

          // Check if the user is found and if the profile is public
          if (user && user.isPrivate === false) {
            return post; // Include the post if the user is public
          }
          else if (user.id === req.userId) {
            return post; // Include the post if the user is the same as the requester
          }
          else {
            return null; // Exclude the post if the user is private
          }
        } catch (error) {
          console.error(
            `Error fetching user for post ${post.id}:`,
            error.message
          );
        }

        return null; // If the user is private or an error occurs
      })
    );

    // Filter visible posts (remove nulls)
    const filteredPosts = visiblePosts.filter((post) => post !== null);

    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    // SQL query to fetch the post by ID and partition key userId
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

    // Query to check if the associated user is public
    const { resources: users } = await userContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @userId",
        parameters: [{ name: "@userId", value: post.userId }],
      })
      .fetchAll();

    const user = users[0];
    if (user.id === req.userId) {
      return res.json(post);
    }
    else if (user && user.isPrivate === false) {
      return res.json(post);
    }
    else{
      return res.status(403).json({ error: "Access to post denied" });
    }
  } catch (error) {
    console.error(
      `Error fetching post ${id}:`,
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
  const file = req.file; // Get the uploaded file

  try {
    let mediaUrl = null;
    if (file) {
      // If a file is present, upload it
      mediaUrl = await uploadFileToBlob(file.originalname, file.buffer);
    }

    const postId = req.params.id;

    // Find the existing post
    const { resources: posts } = await postContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: postId }],
      })
      .fetchAll();

    const existingPost = posts[0];

    // Check if the post exists and is of type "post"
    if (!existingPost || existingPost.type !== "post") {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is authorized to update the post
    if (existingPost.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized to modify this post" });
    }

    // Update the fields with new or old values
    const updatedPost = {
      ...existingPost,
      content: content || existingPost.content, // If content is provided, update it; otherwise, keep the old
      mediaUrl: mediaUrl || existingPost.mediaUrl, // If a file is uploaded, update the media URL
      updatedAt: new Date().toISOString(), // Update the modified date
    };

    // Update in the database
    await postContainer.item(postId, existingPost.userId).replace(updatedPost);

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.error("Error updating post:", error.message);
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

exports.getPostsByUser = async (req, res) => {
  console.log(req);
  try {
    const { resources: posts } = await postContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'post' AND c.userId = @userId",
        parameters: [{ name: "@userId", value: req.userId }],
      })
      .fetchAll();

    console.log(posts);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
