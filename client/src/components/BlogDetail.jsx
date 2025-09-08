import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import DeleteBlogButton from './BlogDelete';
import styles from './BlogDetail.module.css';
import auroraEffect from './AuroraEffectForAskAi.module.css';
import UpdateButtonStyle from './UpdateButton.module.css';
import ExploreMoreButtonStyle from './ExploreMoreButton.module.css';
import Loader from './Loader';
import NotFound from './NotFound';
// Imported for security
import DOMPurify from 'dompurify';
import './BlogContent.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [dots, setDots] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const { owner } = useAuth();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/blogs/${id}`, { credentials: 'include' });
                if (!res.ok) {
                    throw new Error('Failed to fetch blog');
                }
                const data = await res.json();
                setBlog(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAskAI = async () => {
        setAiLoading(true);
        setAiAnswer('');
        setAiError('');
        try {
            const res = await fetch(`${API_BASE_URL}/ai/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogContent: blog.content,
                    question: aiQuestion
                })
            });
            const data = await res.json();
            if (res.ok) {
                setAiAnswer(data.answer);
            } else {
                setAiError(data.error || 'Failed to get AI response.');
            }
        } catch (err) {
            setAiError('Server error. Please try again.');
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        if (!aiLoading) {
            setDots('');
            return;
        }

        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 4 ? '.' : prev + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, [aiLoading]);

    if (loading) {
        return (
            <div className={`flex justify-center items-center ${styles.blogContainer} w-full h-screen`}>
                <div className={styles.overlay}>
                    <Loader />
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className={`flex justify-center items-center ${styles.blogContainer} w-full h-screen`}>
                <div className={styles.overlay}>
                    <NotFound />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.blogContainerBlackBg}>

            <Helmet>
                {/* This sets the browser tab title */}
                <title>{`${blog.title} - Curiofy`}</title>
                {/*description for better SEO */}
                <meta name="description" content={`Read the full blog post on ${blog.title}. Explore topics in ${blog.category}.`} />
            </Helmet>

            <div className={styles.overlay}>
                <div className="px-[0.01rem] py-5">
                    <div
                        className="mx-auto sm:w-screen bg-black/20 rounded-3xl md:p-16 p-3 py-8 shadow-2xl "
                    >
                        <div className="flex justify-center items-center w-full">
                            <LazyLoadImage
                                src={blog.imageUrl}
                                alt={blog.title}
                                effect='blur'
                                className="md:w-[50rem] h-auto rounded-2xl mb-8"
                            />
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                            Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </p>
                        <h1 className="text-3xl font-bold text-white mb-4">{blog.title}</h1>

                        {/* This renders the HTML from the database */}
                        <div
                            className="blog-content text-white/80 break-words"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
                        />

                        <div className={`${auroraEffect.auroraBg} backdrop-blur-2xl md:p-8 px-3 py-4 rounded-2xl mt-8`}>
                            <div className='w-full flex items-center mt-2 mb-2 md:p-2'>
                                <div
                                    className="aiDiv md:p-4 px-2 py-4 rounded-2xl w-full bg-white/10 border border-white/20 shadow-lg backdrop-blur-md backdrop-saturate-150 transition">
                                    <h3 className="text-center text-2xl font-semibold mb-2 text-[#ffd75e]">Ask AI about this blog post</h3>
                                    <textarea
                                        className="w-full md:p-8 p-3 rounded bg-black/60 text-white mb-2"
                                        rows={3}
                                        placeholder="Type your question about this blog post..."
                                        value={aiQuestion}
                                        onChange={e => setAiQuestion(e.target.value)}
                                        disabled={aiLoading}
                                    />
                                    <div className='flex justify-end items-end'>
                                        <button
                                            className="bg-[#ffc72d] w-40 text-black px-4 py-2 rounded font-bold hover:bg-[#ffd75e] transition"
                                            onClick={handleAskAI}
                                            disabled={aiLoading || !aiQuestion.trim()}
                                        >
                                            {aiLoading ? `Asking AI${dots}` : 'Ask AI'}
                                        </button>
                                    </div>
                                    {aiError && <div className="text-red-400 mt-2">{aiError}</div>}
                                    {aiAnswer && (
                                        <div className="mt-4 p-4 bg-white/10 rounded text-white">
                                            <strong>AI Answer:</strong>
                                            <div className="mt-2 md:p-8 p-3 whitespace-pre-line bg-black/60">{aiAnswer}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

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

                                {owner && (
                                    <>
                                        <button onClick={() => navigate(`/blog/edit/${blog._id}`)} className={UpdateButtonStyle.button}>
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