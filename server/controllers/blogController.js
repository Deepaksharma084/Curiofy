import Blog from "../models/blog-model.js";

export const createBlog = async (req, res) => {
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
};

export const getBlogsByCategory = async (req, res) => {
  console.log('--- NEW REQUEST RECEIVED ---');
  console.log(`Timestamp (UTC): ${new Date().toISOString()}`);
  console.log(`Category: ${req.params.category}, Page: ${req.query.page || 1}`);

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments({ category: req.params.category });
    const blogs = await Blog.find({ category: req.params.category })
      .sort({ createdAt: -1 })
      .skip(skip)//pagination logic
      .limit(limit)//limits the number of blogs returned
      .read('primary');//Reading from the primary ensures getting the most up-to-date data

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
};

export const searchBlogs = async (req, res) => {
  try {
    let q = req.query.q || '';
    q = q.trim();
    if (!q) return res.json({ blogs: [] });

    const regex = new RegExp(q, 'i');
    const blogs = await Blog.find({
      $or: [
        { title: regex },
        { content: regex },
        { category: regex }
      ]
    }).sort({ createdAt: -1 }).limit(10);

    res.json({ blogs });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ blogs: [] });
  }
};

export const getBlogById = async (req, res) => {
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
};

export const editBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

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
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
