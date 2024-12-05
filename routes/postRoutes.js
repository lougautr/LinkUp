const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
} = require("../controllers/postController");

// Configuration de multer pour traiter les fichiers
const upload = multer();
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post with a file
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post
 *                 example: This is an example content for the post.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     mediaUrl:
 *                       type: string
 *                       example: https://linkupstorage.blob.core.windows.net/uploads/example.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     userId:
 *                       type: string
 *       400:
 *         description: Invalid data or missing file
 *       500:
 *         description: Error creating the post
 */
router.post("/", authMiddleware, upload.single("file"), createPost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all visible posts
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of visible posts
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getPosts);

/**
 * @swagger
 * /posts/me:
 *   get:
 *     summary: Retrieve all posts of the currently logged-in user
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts of the currently logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   mediaUrl:
 *                     type: string
 *                     example: https://linkupstorage.blob.core.windows.net/uploads/example.jpg
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   userId:
 *                     type: string
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me", authMiddleware, getPostsByUser);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retrieve a specific post by ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post details retrieved successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a specific post by ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post
 *                 example: This is an updated content for the post.
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", authMiddleware, upload.single("file"), updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a specific post by ID
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
