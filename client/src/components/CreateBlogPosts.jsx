import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from './BlogDetail.module.css';
import { API_BASE_URL } from '../config';
// Importing ReactQuill and its CSS
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // for snow theme
import './QuillEditor.css';

export default function CreateBlogForm() {
  const { owner } = useAuth(); // Getting owner from context
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: "",
    imageUrl: "",
    content: "", // This will store HTML
    category: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); //success state

  //useEffect to redirect if owner is not present
  useEffect(() => {
    if (!owner) {
      navigate("/owner/login");
    }
  }, [owner, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Special handler for ReactQuill's content change
  const handleContentChange = (content) => {
    setBlog((prevState) => ({
      ...prevState,
      content: content,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ ...blog, ownerId: owner._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog");
      }

      setError("");
      setSuccess("Blog created successfully!");
      setBlog({
        title: "",
        imageUrl: "",
        content: "",
        category: "",
      });
      setTimeout(() => {
        setSuccess("");
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Detailed error:", error);
      setError(error.message || "Failed to create blog. Please try again.");
      if (error.message.includes("login first")) {
        setTimeout(() => {
          navigate('/owner/login');
        }, 1500);
      }
    }
  };

  return (
    <div className={styles.blogContainer}>
      <div className={styles.overlay}>
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl shadow-2xl w-[42rem] border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Create Blog</h2>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && (
              <div className="bg-green-500/20 text-white p-3 rounded-lg mb-4 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-white">Title</label>
              <input
                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white 
                         text-white placeholder-white/50 focus:border-white focus:outline-none 
                         focus:ring-white/30 transition-all duration-300"
                name="title"
                value={blog.title}
                onChange={handleChange}
                placeholder="Enter title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Image URL</label>
              <input
                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white 
                         text-white placeholder-white/50 focus:border-white focus:outline-none 
                         focus:ring-white/30 transition-all duration-300"
                name="imageUrl"
                value={blog.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white">Category</label>
              <select
                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white 
                         text-white placeholder-white/50 focus:border-white focus:outline-none 
                         focus:ring-white/30 transition-all duration-300"
                name="category"
                value={blog.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled className="text-gray-800">Select a category</option>
                <option value="Tech and electronics" className="text-gray-800">Tech and electronics</option>
                <option value="Health" className="text-gray-800">Health</option>
                <option value="Travel" className="text-gray-800">Travel</option>
                <option value="Food & Recipes" className="text-gray-800">Food & Recipes</option>
                <option value="Growth" className="text-gray-800">Growth</option>
                <option value="Finance" className="text-gray-800">Finance</option>
                <option value="Learning" className="text-gray-800">Learning</option>
                <option value="Gaming" className="text-gray-800">Gaming</option>
                <option value="DIY & Crafts" className="text-gray-800">DIY & Crafts</option>
                <option value="Photography" className="text-gray-800">Photography</option>
                <option value="Music" className="text-gray-800">Music</option>
                <option value="Marketing" className="text-gray-800">Marketing</option>
              </select>
            </div>

            {/* --- REPLACED TEXTAREA WITH REACT-QUILL --- */}
            <div className="space-y-2">
              <label className="text-sm text-white">Content</label>
              <ReactQuill
                theme="snow"
                value={blog.content}
                onChange={handleContentChange}
                placeholder="Start writing your amazing blog post..."
                className="quill-editor-container" // Custom class for styling
              />
            </div>

            <button
              className="mt-5 w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 
                       focus:outline-none focus:ring-2 focus:ring-white/30 
                       transition-all duration-300"
              type="submit"
            >
              Create Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}