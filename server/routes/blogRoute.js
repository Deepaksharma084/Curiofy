// routes/blogs.js
const express = require("express");
const Blog = require("../models/blog-model");
const isOwnerLogdin = require("../middleware/isOwnerLogdin");
const router = express.Router();

router.post("/create", isOwnerLogdin, async (req, res) => {
  console.log("Received blog creation request:", req.body);
  console.log("Authenticated owner:", req.owner);

  const { title, imageUrl, content, category } = req.body;
  try {
    const newBlog = new Blog({
      title,
      imageUrl,
      content,
      category,
      owner: req.owner._id
    });
    await newBlog.save();
    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (err) {
    console.error("Blog creation error:", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments({ category: req.params.category });
    const blogs = await Blog.find({ category: req.params.category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs
    });
  } catch (err) {
    console.error("Error fetching blogs by category:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/edit/:id", isOwnerLogdin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Verify owner
    if (blog.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        category: req.body.category
      },
      { new: true }
    );
    res.json(updatedBlog);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:id", isOwnerLogdin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Verify owner
    if (blog.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;