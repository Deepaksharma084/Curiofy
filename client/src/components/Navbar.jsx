import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import AdminDiv from './AdminDiv.jsx';
import Hamburger from './Hamburger.jsx';
import SettingsIcon from './SettingsIcon.jsx'
import gsap from 'gsap';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAdminDiv, setShowAdminDiv] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
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
        setShowAdminDiv(false); // Close admin div when opening mobile menu
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
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="topToBottom text-white hover:text-gray-300 transition-colors">
                                Home
                            </Link>
                            <form onSubmit={handleSearch} className="topToBottom relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-64 px-4 py-1 rounded-full bg-white/10 border border-white/20 
                                         text-white placeholder-white/70 focus:outline-none focus:ring-2 
                                         focus:ring-white/30 focus:border-transparent"
                                />
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
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-32 px-4 py-1 rounded-full bg-white/10 border border-white/20 
                                             text-white placeholder-white/70 focus:outline-none focus:ring-2 
                                             focus:ring-white/30 focus:border-transparent"
                                />
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