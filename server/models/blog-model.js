const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  content: String,
  category: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);
