const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
} = require("../controllers/postController");

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Création d’un post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Voici un exemple de contenu pour le post.
 *               mediaUrl:
 *                 type: string
 *                 example: https://example.com/media/image.png
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post("/", createPost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Récupération de tous les posts visibles
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des posts visibles
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Récupération d’un post spécifique
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à récupérer
 *     responses:
 *       200:
 *         description: Détails du post récupéré
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", getPostById);

module.exports = router;
