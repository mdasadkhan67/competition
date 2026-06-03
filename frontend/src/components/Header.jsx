import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiAward, FiUser, FiHome, FiInfo, FiBookOpen, FiList, FiPhoneCall, FiUserCheck } from "react-icons/fi";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Check scroll state to add shadow/blur
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: "Home", path: "/", icon: <FiHome /> },
        { name: "About", path: "/about", icon: <FiInfo /> },
        { name: "Categories", path: "/categories", icon: <FiList /> },
        { name: "Rules", path: "/rules", icon: <FiBookOpen /> },
        { name: "Results", path: "/results", icon: <FiAward /> },
        { name: "Leaderboard", path: "/leaderboard", icon: <FiAward /> },
        { name: "Contact", path: "/contact", icon: <FiPhoneCall /> }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-brand-dark/95 backdrop-blur-md border-b border-brand-mint/20 shadow-lg"
                : "bg-brand-dark border-b border-brand-mint/10 shadow-md"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 bg-white rounded-full p-0.5 flex items-center justify-center shadow-md shadow-brand-mint/10 transition-transform duration-300 group-hover:scale-105 border border-brand-gold">
                            <img src="/logo.svg" alt="SDI Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight leading-none font-display">
                                SDI Portal
                            </span>
                            <span className="text-brand-mint font-bold text-xs tracking-wider uppercase mt-1 leading-none">
                                Naat Competition
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(link.path)
                                    ? "text-brand-mint bg-white/5 shadow-inner"
                                    : "text-gray-200 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTAs */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 border border-brand-mint/30 hover:border-brand-mint text-brand-mint hover:text-white hover:bg-brand-mint/10 rounded-xl text-sm font-bold transition-all duration-200"
                        >
                            Admin Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-mint hover:from-brand-primary hover:to-emerald-400 text-brand-dark font-extrabold rounded-xl text-sm transition-all duration-300 shadow-md shadow-brand-primary/20 hover:scale-[1.03] active:scale-[0.98] border border-brand-gold/30"
                        >
                            Register Now
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/5 focus:outline-none transition-colors border border-white/10"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Drawer (Overlay and Menu) */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Backdrop overlay */}
                <div
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                />

                {/* Side Drawer Content */}
                <div
                    className={`absolute top-0 right-0 h-screen w-80 max-w-[85vw] bg-brand-dark border-l border-brand-mint/10 shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div>
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                            <div className="flex items-center gap-2.5">
                                <img src="/logo.svg" alt="SDI Logo" className="w-10 h-10 bg-white rounded-full p-0.5 border border-brand-gold" />
                                <div className="flex flex-col">
                                    <span className="text-white font-extrabold text-base tracking-tight font-display">SDI Portal</span>
                                    <span className="text-brand-mint font-bold text-[10px] tracking-wider uppercase">Quba Zone</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-1.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${isActive(link.path)
                                        ? "text-brand-mint bg-brand-mint/10"
                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Call to Actions at the bottom of the drawer */}
                    <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-3 border border-brand-mint/30 hover:border-brand-mint text-brand-mint hover:text-white rounded-xl text-base font-bold transition-all duration-200"
                        >
                            <FiUserCheck /> Admin Login
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3.5 bg-gradient-to-r from-brand-primary to-brand-mint text-brand-dark text-center font-extrabold rounded-xl text-base transition-all duration-300 shadow-md shadow-brand-primary/20 border border-brand-gold/30"
                        >
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
