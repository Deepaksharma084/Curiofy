import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import styles from "./BlogDetail.module.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
    const query = useQuery();
    const searchTerm = query.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        fetch(`${API_BASE_URL}/blogs/search?q=${encodeURIComponent(searchTerm)}`)
            .then(res => res.json())
            .then(data => setResults(data.blogs || []))
            .finally(() => setLoading(false));
    }, [searchTerm]);

    return (
        <div className={styles.blogContainer} >
            <div className={styles.overlay}>
                <div className="min-h-screen flex flex-col items-center justify-start pt-10 pb-10">
                    <h2 className="text-2xl text-white mb-6">Search Results for "{searchTerm}"</h2>
                    {loading && <p className="text-white">Loading...</p>}
                    {!loading && results.length === 0 && (
                        <p className="text-white">No blogs found.</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                        {results.map(blog => (
                            <Link
                                key={blog._id}
                                to={`/blog/${blog._id}`}
                                className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition"
                            >
                                {blog.imageUrl && (
                                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-40 object-cover rounded mb-3" />
                                )}
                                <h3 className="text-white font-bold mb-2">{blog.title}</h3>
                                <p className="text-white/70 text-sm">{blog.category}</p>
                                <p className="text-white/60 text-xs mt-1">{new Date(blog.createdAt).toLocaleDateString()}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}