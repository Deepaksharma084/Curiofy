import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DeleteBlogButton from './BlogDelete';
import styles from './BlogPage.module.css';
import Loader from './Loader';
import NotFound from './NotFound';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { owner } = useAuth();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch blog');
                }

                const data = await res.json();
                setBlog(data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchBlog();

        // Scroll to top when this component mounts or id changes
        window.scrollTo(0, 0);
    }, [id]);

    if (loading)
        return (
            <div className={`flex justify-center items-center ${styles.blogContainer} w-full h-screen`}>
                <div className={styles.overlay}>
                    <Loader />
                </div>
            </div>
        );

    if (!blog) return <div className={`flex justify-center items-center ${styles.blogContainer} w-full h-screen`}>
        <div className={styles.overlay}>
            <NotFound />
        </div>
    </div>;

    return (
        <div className={styles.blogContainerBlackBg}>
            <div className={styles.overlay}>
                <div className="px-2 sm:px-10 py-10">
                    <div className="mx-auto sm:w-screen bg-white/10 rounded-3xl md:p-16 p-3 py-8 shadow-2xl">
                        <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="mx-auto sm:w-[30rem] object-cover rounded-2xl mb-8"
                        />

                        {/* Date added above the title with styling */}
                        <p className="text-sm text-gray-400 mb-2">
                            Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>

                        <h1 className="text-3xl font-bold text-white mb-4">{blog.title}</h1>
                        <p className="text-white/80 whitespace-pre-wrap">{blog.content}</p>

                        <div className="flex gap-4 mt-8">
                            <div className='flex flex-col sm:flex-row gap-2 items-center justify-center w-full'>
                                <button
                                    onClick={() => navigate(`/blogs/${blog.category}`)}
                                    className="bg-gradient-to-r from-[#5d2026] via-[#832d35] to-[#5d2026] 
                                     hover:from-[#832d35] hover:via-[#a83840] hover:to-[#832d35]
                                        backdrop-blur-xl font-bold text-zinc-200 px-4 py-2 rounded 
                                        transition-all duration-300"
                                >
                                    Explore more in {blog.category}
                                </button>


                                {/* Only buttons is shown if owner is logged in */}
                                {owner && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/blog/edit/${blog._id}`)}
                                            className='bg-zinc-500 px-4 py-2 rounded hover:bg-zinc-600 transition-colors text-white'
                                        >
                                            Update
                                        </button>

                                        <DeleteBlogButton blogId={blog._id} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;