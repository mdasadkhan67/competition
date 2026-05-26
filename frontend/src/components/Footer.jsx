import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiYoutube, FiFacebook, FiInstagram, FiTwitter, FiGlobe } from "react-icons/fi";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: "Quick Links",
            links: [
                { name: "Home", path: "/" },
                { name: "About Competition", path: "/about" },
                { name: "Categories", path: "/categories" },
                { name: "Rules & Guidelines", path: "/rules" }
            ]
        },
        {
            title: "Portals",
            links: [
                { name: "Participant Register", path: "/register" },
                { name: "Participant Login", path: "/login" },
                { name: "Judge Login", path: "/login?role=judge" },
                { name: "Admin Dashboard", path: "/login?role=admin" }
            ]
        },
        {
            title: "Public Directory",
            links: [
                { name: "Check Payment Status", path: "/check-status" },
                { name: "Leaderboard & Ranking", path: "/leaderboard" },
                { name: "Competition Results", path: "/results" },
                { name: "Contact Support", path: "/contact" }
            ]
        }
    ];

    const socialLinks = [
        { icon: <FiYoutube />, href: "https://youtube.com/heraislamic", label: "YouTube" },
        { icon: <FiFacebook />, href: "https://facebook.com", label: "Facebook" },
        { icon: <FiInstagram />, href: "https://instagram.com", label: "Instagram" },
        { icon: <FiGlobe />, href: "https://sunnidawateislami.net", label: "Website" }
    ];

    return (
        <footer className="bg-[#021815] border-t border-brand-mint/10 text-gray-400 font-sans">
            
            {/* Top Footer Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    
                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logo.svg" alt="SDI Logo" className="w-14 h-14 bg-white rounded-full p-0.5 border border-brand-gold" />
                            <div className="flex flex-col">
                                <h3 className="text-white font-extrabold text-xl tracking-tight leading-none font-display">
                                    SDI Naat Competition Portal
                                </h3>
                                <span className="text-brand-mint font-bold text-xs tracking-wider uppercase mt-1.5 leading-none">
                                    Hera Islamic Channel • Quba Zone
                                </span>
                            </div>
                        </Link>
                        
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            An elegant platform to celebrate and evaluate beautiful recitations of praise for the Prophet Muhammad (صلى الله عليه وسلم). Organized by Sunni Dawate Islami, Quba Zone, Kurla.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary/20 text-gray-300 hover:text-brand-mint flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-brand-mint/30 text-lg"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h4 className="text-white font-bold text-base tracking-wide font-display">
                                {section.title}
                            </h4>
                            <ul className="space-y-2.5 text-sm">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link 
                                            to={link.path} 
                                            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5 font-medium"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-40"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                {/* Contact and address block */}
                <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-mint/5 border border-brand-mint/10 flex items-center justify-center text-brand-mint text-base">
                            <FiPhone />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Call Us</p>
                            <a href="tel:+919876543210" className="text-white font-semibold hover:text-brand-mint transition-colors">+91 98765 43210</a>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-mint/5 border border-brand-mint/10 flex items-center justify-center text-brand-mint text-base">
                            <FiMail />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email Support</p>
                            <a href="mailto:info@heraislamic.com" className="text-white font-semibold hover:text-brand-mint transition-colors">info@heraislamic.com</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-mint/5 border border-brand-mint/10 flex items-center justify-center text-brand-mint text-base">
                            <FiMapPin />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Location</p>
                            <span className="text-white font-semibold">Quba Mosque, Kurla, Mumbai, India</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Copyright Section */}
            <div className="bg-[#01110f] py-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-gray-500 font-medium">
                        &copy; {currentYear} SDI Naat Competition Portal. All Rights Reserved.
                    </p>
                    <p className="text-gray-500 flex items-center gap-1 font-medium">
                        Designed with excellence for <span className="text-brand-mint font-semibold">Hera Islamic Channel</span>
                    </p>
                </div>
            </div>

        </footer>
    );
}
