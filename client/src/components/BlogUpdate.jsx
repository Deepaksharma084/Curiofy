import { API_BASE_URL } from '../config';
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import styles from './BlogPage.module.css';
import Loader from './Loader';
//Imports for the Rich Text Editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './QuillEditor.css';

export default function BlogUpdate() {
  const { owner } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState({
    title: "",
    imageUrl: "",
    content: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
        const data = await response.json();
        if (response.ok) {
          setBlog(data); // Seting the entire blog object
        } else {
          setError(data.message || "Failed to fetch blog");
        }
      } catch (err) {
        setError("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!owner) navigate("/owner/login");
  }, [owner, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prevState => ({ ...prevState, [name]: value }));
  };

  //Special handler for the Rich Text Editor's content
  const handleContentChange = (content) => {
    setBlog(prevState => ({ ...prevState, content: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(blog),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Blog updated successfully!");
        setTimeout(() => navigate(`/blog/${id}`), 1000);
      } else {
        setError(data.message || "Failed to update blog");
      }
    } catch (error) {
      setError("Failed to update blog. Please try again.");
    }
  };

  if (loading) return (
    <div className={`flex justify-center items-center ${styles.blogContainer} w-full h-screen`}>
      <div className={styles.overlay}><Loader /></div>
    </div>
  );

  return (
    <div className={styles.blogContainer}>
      <div className={styles.overlay}>
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl shadow-2xl w-[42rem] border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Update Blog</h2>
          {success && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4">{success}</div>}
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-white">Title</label>
              <input
                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-white/30 transition-all duration-300"
                name="title" value={blog.title} onChange={handleChange} placeholder="Enter title" required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white">Image URL</label>
              <input
                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-white/30 transition-all duration-300"
                name="imageUrl" value={blog.imageUrl} onChange={handleChange} placeholder="Enter image URL" required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white">Category</label>
              <select
                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-white/30 transition-all duration-300"
                name="category" value={blog.category} onChange={handleChange} required
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

            {/*REPLACED THE TEXTAREA WITH THIS*/}
            <div className="space-y-2">
              <label className="text-sm text-white">Content</label>
              <ReactQuill
                theme="snow"
                value={blog.content}
                onChange={handleContentChange}
                placeholder="Enter content"
                className="quill-editor-container"
              />
            </div>

            <button
              className="mt-5 w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
              type="submit"
            >
              Update Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}