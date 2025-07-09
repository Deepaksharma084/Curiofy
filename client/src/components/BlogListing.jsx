import React, { useEffect, useState, useCallback } from 'react';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './BlogListing.module.css';
import Loader from './Loader';

const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

const BlogListing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { category } = useParams();

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const cacheBuster = Date.now();
            const url = `${API_BASE_URL}/blogs/category/${category}/${cacheBuster}?page=${currentPage}&limit=9`;

            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch blogs');
            const data = await res.json();
            setBlogs(data.blogs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error:', error);
            setBlogs([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [category, currentPage]);

    // This is the only data-fetching hook we need.
    // It runs when the page loads, when the page number changes,
    // or when the user navigates to this page (thanks to location.key).
    useEffect(() => {
        fetchBlogs();
        window.scrollTo(0, 0);
    }, [fetchBlogs, location.key]); // location.key is the crucial part for navigation

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                                if (e.button === 0) {
                                    e.preventDefault();
                                    navigate(`/blog/${blog._id}`);
                                }
                            }} key={blog._id}
                                className="group relative rounded-2xl bg-[#000000] p-4 transition-all duration-300 hover:translate-y-[-4px]"
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
                    <div className="flex justify-center w-[100%] items-center gap-2 mt-8 mb-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-white w-24 bg-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-white">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-white w-24 bg-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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