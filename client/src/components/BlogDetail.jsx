import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DeleteBlogButton from './BlogDelete';
import styles from './BlogPage.module.css';
import UpdateButtonStyle from './UpdateButton.module.css';
import ExploreMoreButtonStyle from './ExploreMoreButton.module.css';
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
                            <div className='flex sm:flex-row gap-2 items-center justify-center w-full'>

                                <button onClick={() => navigate(`/blogs/${blog.category}`)} className={ExploreMoreButtonStyle.button}>
                                    <svg
                                        viewBox="0 0 20 20"
                                        className={ExploreMoreButtonStyle.svgIcon}
                                        style={{ height: '1.7rem', width: 'auto' }}
                                        fill="white"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* Only buttons is shown if owner is logged in */}
                                {owner && (
                                    <>
                                        <button onClick={() => navigate(`/blog/edit/${blog._id}`)} class={UpdateButtonStyle.button}>
                                            <svg viewBox="0 0 24 24" className={UpdateButtonStyle.svgIcon} style={{ height: '1.7rem', width: 'auto' }} fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.905 19.383a4.5 4.5 0 0 1-1.897 1.13l-2.265.678.678-2.265a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487zM16.862 4.487L19.5 7.125"
                                                    strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
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