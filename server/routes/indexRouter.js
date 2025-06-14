const express = require('express');
const router = express.Router();
const Blog = require("../models/blog-model");

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

module.exports = router;