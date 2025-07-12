import express from "express";
import isOwnerLogdin from "../middleware/isOwnerLogdin.js";
import {
  createBlog,
  getBlogsByCategory,
  searchBlogs,
  getBlogById,
  editBlog,
  deleteBlog
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/create", isOwnerLogdin, createBlog);
router.get("/category/:category/:cacheBuster?", getBlogsByCategory);
router.get("/search", searchBlogs);
router.get("/:id", getBlogById);
router.put("/edit/:id", isOwnerLogdin, editBlog);
router.delete("/delete/:id", isOwnerLogdin, deleteBlog);

export default router;
