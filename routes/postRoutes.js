const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
} = require("../controllers/postController");
const { uploadFileToBlob } = require("../blobService");

// Configuration de multer pour traiter les fichiers
const upload = multer();

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

/**
 * @swagger
 * /posts/upload:
 *   post:
 *     summary: Upload d’un fichier pour un post
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
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Le fichier à uploader
 *     responses:
 *       200:
 *         description: Fichier uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileUrl:
 *                   type: string
 *                   example: https://linkupstorage.blob.core.windows.net/uploads/example.jpg
 *       400:
 *         description: Aucun fichier envoyé
 *       500:
 *         description: Erreur lors de l'upload
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Aucun fichier envoyé." });
    }

    // Upload du fichier vers Azure Blob Storage
    const fileUrl = await uploadFileToBlob(file.originalname, file.buffer);

    res.status(200).json({
      message: "Fichier uploadé avec succès.",
      fileUrl,
    });
  } catch (err) {
    console.error("Erreur lors de l'upload :", err.message);
    res.status(500).json({ message: "Erreur lors de l'upload du fichier." });
  }
});

module.exports = router;
