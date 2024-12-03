// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const auth = require("../middleware/auth");

router.post("/", auth, createPost);
router.get("/", auth, getPosts);
router.get("/:id", auth, getPostById);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
