const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
} = require("../controllers/postController");

// Configuration de multer pour traiter les fichiers
const upload = multer();
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Création d’un post avec un fichier
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
 *                 description: Le contenu du post
 *                 example: Voici un exemple de contenu pour le post.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Le fichier à uploader
 *     responses:
 *       201:
 *         description: Post créé avec succès
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
 *         description: Données invalides ou fichier manquant
 *       500:
 *         description: Erreur lors de la création du post
 */
router.post("/", authMiddleware, upload.single("file"), createPost);

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
router.get("/", authMiddleware, getPosts);

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
router.get("/:id", authMiddleware, getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Mise à jour d’un post spécifique
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Le contenu du post
 *                 example: Voici un exemple de contenu pour le post.
 *     responses:
 *       200:
 *         description: Post mis à jour avec succès
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id", authMiddleware, upload.single("file"), updatePost);

module.exports = router;
