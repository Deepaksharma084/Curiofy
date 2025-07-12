import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  content: String,
  category: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
