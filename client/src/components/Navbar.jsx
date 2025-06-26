import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import AdminDiv from './AdminDiv.jsx';
import Hamburger from './Hamburger.jsx';
import SettingsIcon from './SettingsIcon.jsx'
import gsap from 'gsap';
import { API_BASE_URL } from '../config';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAdminDiv, setShowAdminDiv] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const popupRef = useRef(null);
    const adminDivDesktopRef = useRef(null);
    const adminDivMobileRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const hamburgerRef = useRef(null); // Ref for the hamburger button

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowSearchPopup(false);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/blogs/search?q=${encodeURIComponent(searchQuery.trim())}`);
                if (!res.ok) throw new Error('Failed to search');
                const data = await res.json();
                setSearchResults(data.blogs || []);
                setIsSearching(false);
                setShowSearchPopup(true);
            } catch (err) {
                console.error('Search error:', err);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Close Search Popup
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowSearchPopup(false);
            }

            // Close Admin Div (only if click is outside BOTH admin divs and settings icon)
            if (
                !event.target.closest('.settings-icon-button') &&
                (!adminDivDesktopRef.current || !adminDivDesktopRef.current.contains(event.target)) &&
                (!adminDivMobileRef.current || !adminDivMobileRef.current.contains(event.target))
            ) {
                setShowAdminDiv(false);
            }

            // Close Mobile Menu (only if click is outside menu, hamburger, AND admin div)
            if (
                isMobileMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target) &&
                (!adminDivMobileRef.current || !adminDivMobileRef.current.contains(event.target))
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [isMobileMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearchPopup(false);
        }
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        const footer = document.getElementById('contact');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const toggleAdminDiv = () => {
        setShowAdminDiv(prev => !prev);
    };

    // This function's only job is to toggle. The useEffect handles outside clicks.
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
        // It can be helpful to close the admin div when toggling the main menu
        if (!isMobileMenuOpen) {
            setShowAdminDiv(false);
        }
    };

    useEffect(() => {
        gsap.set(".topToBottom", { y: -50, opacity: 0 });
        gsap.to(".topToBottom", { y: 0, opacity: 1, duration: 0.9, stagger: 0.2, ease: "power2.out" });
    }, []);

    // Close menus on route change
    useEffect(() => {
        setShowSearchPopup(false);
        setSearchQuery('');
        setIsMobileMenuOpen(false);
        setShowAdminDiv(false);
    }, [location.pathname]);

    const renderSearchPopup = () => (
        <div
            ref={popupRef}
            className="absolute -right-20 mt-2 sm:w-[25rem] w-[20rem] h-[14rem] overflow-scroll max-w-lg bg-white/10 rounded-xl shadow-xl border border-white/20 backdrop-blur-xl"
            style={{ top: '110%' }}
            onMouseDown={e => e.preventDefault()}
        >
            {isSearching && <p className="text-white p-4">Searching...</p>}
            {!isSearching && searchResults.length > 0 ? (
                searchResults.map(blog => (
                    <Link
                        key={blog._id}
                        to={`/blog/${blog._id}`}
                        className="flex items-center gap-3 p-3 hover:bg-white/20"
                    >
                        {/* Blog Image */}
                        {blog.imageUrl && (
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-14 h-14 object-cover rounded-md border border-white/20"
                            />
                        )}
                        <div>
                            <p className="text-white font-semibold">{blog.title}</p>
                            {/* Creation Date */}
                            {blog.createdAt && (
                                <p className="text-xs text-white/70">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </Link>
                ))
            ) : !isSearching && <p className="text-white p-4">No results found.</p>}
        </div>
    );

    return (
        <nav className={`relative z-[2000] left-0 right-0 ${styles.authContainer}`}>
            <div className={styles.overlay}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link to="/" className="topToBottom text-white font-bold text-3xl">Curiofy</Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8 relative">
                            <Link to="/" className="topToBottom text-white hover:text-gray-300 transition-colors">Home</Link>
                            <form onSubmit={handleSearch} className="topToBottom relative w-72">
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full px-4 py-1 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent" autoComplete="off" onFocus={() => searchQuery && setShowSearchPopup(true)} />
                                {showSearchPopup && searchQuery && renderSearchPopup()}
                            </form>
                            <a href="#contact" onClick={handleContactClick} className="topToBottom text-white hover:text-gray-300 transition-colors cursor-pointer">Contact</a>
                            <div className="topToBottom relative">
                                <div onClick={toggleAdminDiv} className="flex items-center justify-center gap-4 text-white hover:text-gray-300 transition-colors cursor-pointer settings-icon-button">
                                    <SettingsIcon />
                                </div>
                                {showAdminDiv && (
                                    <div
                                        ref={adminDivDesktopRef}
                                        className="absolute right-[1] mt-8 w-48 backdrop-blur-xl bg-white/10 rounded-md shadow-lg py-1 z-[9999"
                                    >
                                        <AdminDiv />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2 z-50">
                            <form onSubmit={handleSearch} className="relative w-32">
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent" autoComplete="off" onFocus={() => searchQuery && setShowSearchPopup(true)} />
                                {showSearchPopup && searchQuery && renderSearchPopup()}
                            </form>
                            {/* This onClick now works without interference */}
                            <Hamburger ref={hamburgerRef} isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop for outside click */}
                            <div
                                className="fixed inset-0 z-[99]"
                                style={{ background: 'transparent' }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <div
                                ref={mobileMenuRef}
                                className="md:hidden fixed top-20 left-0 right-0 z-[100]"
                            >
                                <div className="backdrop-blur-xl bg-white/10 px-2 pt-2 pb-3 space-y-1 rounded-md mx-4 z-50">
                                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white block px-3 py-2 hover:bg-white/20 rounded-md">Home</Link>
                                    <a href="#contact" onClick={handleContactClick} className="text-white  block px-3 py-2 hover:bg-white/20 rounded-md">Contact</a>
                                    <div className="px-2 py-2">
                                        <button onClick={toggleAdminDiv} className="flex items-center text-white rounded-md settings-icon-button">
                                            <SettingsIcon />
                                        </button>
                                        {showAdminDiv && (
                                            <div
                                                ref={adminDivMobileRef}
                                                className="mt-2 backdrop-blur-xl bg-white/20 rounded-md shadow-lg py-1 z-[9999]" 
                                            >
                                                <AdminDiv />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}