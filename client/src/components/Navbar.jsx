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
    const navigate = useNavigate();
    const location = useLocation();

    console.log('Navigate function:', navigate); // Debug log

    // Debounced search
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
                setSearchResults([]);
                setShowSearchPopup(false);
                setIsSearching(false);
            }
        }, 500); // Increased debounce time to 500ms

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    // Hide popup on outside click
    useEffect(() => {
        function handleClick(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowSearchPopup(false);
            }
        }
        if (showSearchPopup) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showSearchPopup]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowSearchPopup(false);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`${API_BASE_URL}/blogs/search?q=${encodeURIComponent(searchQuery.trim())}`);
            if (!res.ok) throw new Error('Failed to search');
            const data = await res.json();
            setSearchResults(data.blogs || []);
            setIsSearching(false);
            setShowSearchPopup(true);
        } catch (err) {
            setSearchResults([]);
            setIsSearching(false);
            setShowSearchPopup(true);
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
        setShowAdminDiv(!showAdminDiv);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setShowAdminDiv(false);
    };

    useEffect(() => {
        gsap.set(".topToBottom", {
            y: -50,
            opacity: 0
        });

        gsap.to(".topToBottom", {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: "power2.out"
        });
    }, []);

    useEffect(() => {
        setShowSearchPopup(false);
        setSearchQuery('');
    }, [location.pathname]);

    // --- Search popup UI ---
    const renderSearchPopup = () => (
        <div
            ref={popupRef}
            className="absolute left-0 mt-2 w-full max-w-lg bg-white/10 rounded-xl shadow-xl border border-white/20 backdrop-blur-xl"
            style={{ top: '110%' }}
            onMouseDown={e => e.preventDefault()} // This is fine, it prevents the input from blurring
        >
            {isSearching ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No results found</div>
            ) : (
                <ul>
                    {searchResults.map(blog => (
                        <li
                            key={blog._id}
                            className="px-4 py-3 hover:bg-[#312441] rounded-xl cursor-pointer"
                        >
                            <div
                                // ✨ THE FIX IS HERE: Changed from onClick to onMouseDown ✨
                                onMouseDown={() => {
                                    console.log('Navigating on mousedown to:', blog._id);
                                    setShowSearchPopup(false);
                                    setSearchQuery('');
                                    navigate(`/blog/${blog._id}`);
                                }}
                                className="flex items-center gap-3 w-full"
                            >
                                <img
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                />
                                <div>
                                    <div className="font-semibold text-white">{blog.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {blog.category} · {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <nav className={`z-40 top-5 left-0 right-0 ${styles.authContainer}`}>
            <div className={styles.overlay}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link to="/" className="topToBottom text-white font-bold text-3xl">
                                Curiofy
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8 relative">
                            <Link to="/" className="topToBottom text-white hover:text-gray-300 transition-colors">
                                Home
                            </Link>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch(e);
                                }}
                                className="topToBottom relative w-72"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        setShowSearchPopup(true);
                                    }}
                                    placeholder="Search..."
                                    className="w-full px-4 py-1 rounded-full bg-white/10 border border-white/20 
                                         text-white placeholder-white/70 focus:outline-none focus:ring-2 
                                         focus:ring-white/30 focus:border-transparent"
                                    autoComplete="off"
                                    onFocus={() => searchQuery && setShowSearchPopup(true)}
                                />
                                {showSearchPopup && searchQuery && renderSearchPopup()}
                            </form>
                            <a
                                href="#contact"
                                onClick={handleContactClick}
                                className="topToBottom text-white hover:text-gray-300 transition-colors cursor-pointer"
                            >
                                Contact
                            </a>
                            <div className="topToBottom relative">
                                <div className="flex items-center justify-center gap-4 text-white hover:text-gray-300 transition-colors cursor-pointer" onClick={toggleAdminDiv}>
                                    <SettingsIcon />
                                </div>
                                {showAdminDiv && (
                                    <div className="absolute right-0 mt-4 w-48 backdrop-blur-xl bg-white/10 rounded-md shadow-lg py-1">
                                        <AdminDiv />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2 z-50">
                            {/* Search box for mobile */}
                            <form onSubmit={handleSearch} className="relative w-32">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        setShowSearchPopup(true);
                                    }}
                                    placeholder="Search..."
                                    className="w-full px-4 py-1 rounded-full bg-white/10 border border-white/20 
                                             text-white placeholder-white/70 focus:outline-none focus:ring-2 
                                             focus:ring-white/30 focus:border-transparent"
                                    autoComplete="off"
                                    onFocus={() => searchQuery && setShowSearchPopup(true)}
                                />
                                {showSearchPopup && searchQuery && renderSearchPopup()}
                            </form>
                            <Hamburger
                                isOpen={isMobileMenuOpen}
                                onClick={toggleMobileMenu}
                            />
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed top-20 left-0 right-0 z-[100]">
                            <div className="backdrop-blur-xl bg-white/10 px-2 pt-2 pb-3 space-y-1 rounded-md mx-4 z-50">
                                <Link to="/" className="text-[#b814ff] block px-3 py-2 hover:bg-white/20 rounded-md">
                                    Home
                                </Link>
                                <a
                                    href="#contact"
                                    onClick={handleContactClick}
                                    className="text-[#b814ff]  block px-3 py-2 hover:bg-white/20 rounded-md"
                                >
                                    Contact
                                </a>
                                <div className="px-2 py-2">
                                    <button
                                        onClick={toggleAdminDiv}
                                        className="flex items-center text-white rounded-md"
                                    >
                                        <SettingsIcon />
                                    </button>
                                    {showAdminDiv && (
                                        <div className="mt-2 backdrop-blur-xl bg-white/10 rounded-md shadow-lg py-1">
                                            <AdminDiv />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}