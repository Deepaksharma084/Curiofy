import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BlogListing.module.css';
import Loader from './Loader';

//A helper to safely convert HTML to plain text.
// It uses the browser's own parser, so it's safe and efficient.
const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

const BlogListing = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { category } = useParams();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                 // This is the most powerful technique to defeat network/CDN caches.
                const randomCacheBuster = `cb=${Math.random()}`;
                const url = `${API_BASE_URL}/blogs/category/${category}?page=${currentPage}&limit=9&${randomCacheBuster}`;

                // this is the most aggressive cache-control options available in the fetch API.
                const res = await fetch(url, {
                    method: 'GET',
                    // 'no-store' is the strongest directive. It tells the browser
                    // to not store this response in its cache AT ALL.
                    cache: 'no-store',
                    headers: {
                        // These headers are for any intermediate proxies/CDNs.
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache', // For older HTTP/1.0 proxies
                        'Expires': '0', // For very old clients
                    },
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch blogs');
                const data = await res.json();
                setBlogs(data.blogs);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchBlogs();
        window.scrollTo(0, 0);
    }, [category, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center ${styles.blogContainer} w-full h-screen`}>
                <div className={styles.overlay}>
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.blogContainer}>
            <div className={styles.overlay}>
                <div className="min-h-screen w-full px-2 sm:px-10 flex flex-col items-center justify-center bg-transparent">
                    <div>
                        <h1 className="text-2xl font-bold mt-8 mb-8 text-white">{category} Blogs</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-min bg-transparent rounded-md gap-8">
                        {blogs.map((blog) => (
                            <div onClick={e => {
                                // For left-click, prevent default and use navigate
                                if (e.button === 0) {
                                    e.preventDefault();
                                    navigate(`/blog/${blog._id}`);
                                }
                                // For middle-click and right-click, let browser handle
                            }} key={blog._id}
                                className="group relative rounded-2xl bg-[#000000] backdrop-blur-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#00000077] hover:translate-y-[-4px]"
                            >
                                <div className="w-full aspect-video rounded-xl">
                                    <img
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        className="w-full h-full object-contain bg-[#00000077] rounded-xl transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-[0.8rem] text-gray-500 mt-4">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                                <div className="mt-2 space-y-3">
                                    <h2 className="text-xl font-semibold text-white/90">{blog.title}</h2>

                                    {/*Using the stripHtml function before creating the substring. */}
                                    <p className="text-sm text-white/60 line-clamp-3">
                                        {stripHtml(blog.content).substring(0, 150)}....
                                    </p>

                                    <a
                                        href={`/blog/${blog._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-[#ffc72d] hover:text-[#ffd75e] transition-colors">
                                        Read more
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>

                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center w-[100%] items-center gap-2 mt-8 mb-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-white w-24 bg-white/30 rounded-lg  
                                         hover:bg-white/20 transition-all duration-300"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-white">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-white w-24 bg-white/30 rounded-lg  
                                         hover:bg-white/20 transition-all duration-300"
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BlogListing;