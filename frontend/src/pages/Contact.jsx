import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setForm({ name: "", email: "", subject: "", message: "" });
        }, 1500);
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            
            {/* Page Header */}
            <section className="bg-brand-dark py-16 px-4 text-center text-white border-b border-brand-mint/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative max-w-4xl mx-auto space-y-3">
                    <span className="text-brand-gold font-bold text-xs uppercase tracking-widest">Support desk</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                        Contact Portal Support
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
                        Have queries regarding registration, audition schedules, or results? Drop us a line.
                    </p>
                </div>
            </section>

            {/* Grid Layout */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
                    
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-5 space-y-8 font-semibold text-sm sm:text-base">
                        <div className="space-y-3">
                            <h2 className="text-xs font-black uppercase tracking-widest text-brand-primary font-display">Reach Out</h2>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-display">Contact Information</h3>
                            <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                                Our support helpdesk is available from 10:00 AM to 6:00 PM (IST), Monday through Saturday.
                            </p>
                        </div>

                        {/* Contacts cards */}
                        <div className="space-y-4 font-semibold text-xs sm:text-sm">
                            <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-start gap-4 shadow-xs">
                                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary text-lg shrink-0">
                                    <FiPhone />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Call Support</p>
                                    <a href="tel:+919876543210" className="text-brand-dark font-extrabold hover:text-brand-primary transition-colors">+91 98765 43210</a>
                                    <p className="text-[10px] text-gray-400 font-medium">Technical & registration assistance</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-start gap-4 shadow-xs">
                                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary text-lg shrink-0">
                                    <FiMail />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Email Queries</p>
                                    <a href="mailto:support@heraislamic.com" className="text-brand-dark font-extrabold hover:text-brand-primary transition-colors">support@heraislamic.com</a>
                                    <p className="text-[10px] text-gray-400 font-medium">Lyrics approval & score audits</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-start gap-4 shadow-xs">
                                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary text-lg shrink-0">
                                    <FiMapPin />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Head Office</p>
                                    <span className="text-brand-dark font-extrabold">Quba Mosque Complex</span>
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Kurla West, Mumbai, Maharashtra 400070</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary"></div>
                            
                            {submitted ? (
                                <div className="text-center py-10 space-y-4 animate-fade">
                                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-primary text-4xl mx-auto shadow-sm">
                                        <FiCheckCircle />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark font-display">Message Sent!</h3>
                                    <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium">
                                        Thank you for contacting us. Our representative will review your message and reply via email within 24 hours.
                                    </p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="px-6 py-2 bg-brand-primary hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <h3 className="text-xl font-extrabold text-brand-dark font-display">Inquiry Form</h3>
                                        <p className="text-xs text-gray-400 font-medium">Please fill in details below to send a message.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Your Name</label>
                                            <div className="inputBox">
                                                <span>👤</span>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="John Doe"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label">Email Address</label>
                                            <div className="inputBox">
                                                <span>📧</span>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="john@example.com"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Subject</label>
                                        <div className="inputBox">
                                            <span>📝</span>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Registration Query / Document Rejected"
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Message Content</label>
                                        <div className="inputBox focus-within:ring-2 focus-within:ring-brand-mint/50 focus-within:border-brand-primary transition-all duration-300">
                                            <textarea
                                                required
                                                rows="4"
                                                placeholder="Write your detailed query or message here..."
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 font-medium resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-brand-primary hover:bg-emerald-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-brand-primary/20 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <FiSend /> Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}
