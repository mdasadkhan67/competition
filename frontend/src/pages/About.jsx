import { Link } from "react-router-dom";
import { FiCheck, FiHeart, FiAward, FiEye } from "react-icons/fi";

export default function About() {
    const milestones = [
        { year: "2015", title: "First Edition", desc: "Launched at Quba Mosque with 40 participants from the Kurla vicinity." },
        { year: "2018", title: "Video Submissions", desc: "Digitized the prelims round using basic video recordings, hosting 250+ entries." },
        { year: "2021", title: "Global Expansion", desc: "Opened registrations for participants across states, introducing a custom judge system." },
        { year: "2026", title: "The Portal Launch", desc: "Launched this unified online dashboard for immediate evaluation and tracking." }
    ];

    const values = [
        {
            icon: <FiHeart className="text-brand-primary text-2xl" />,
            title: "Devoted Expressions",
            desc: "The primary intent is expressing love and reverence for the Prophet Muhammad (صلى الله عليه وسلم) through standard guidelines."
        },
        {
            icon: <FiEye className="text-brand-gold text-2xl" />,
            title: "Strict Authenticity",
            desc: "Special emphasis on correct Arabic pronunciation (Talaffuz) and ensuring correct meanings of the kalam are preserved."
        },
        {
            icon: <FiAward className="text-brand-primary text-2xl" />,
            title: "Unbiased Audits",
            desc: "A completely transparent grading system, where independent judges rate individual parameters without peer bias."
        }
    ];

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            
            {/* Page Header */}
            <section className="bg-brand-dark py-16 px-4 text-center text-white border-b border-brand-mint/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative max-w-4xl mx-auto space-y-3">
                    <span className="text-brand-gold font-bold text-xs uppercase tracking-widest">About Sunni Dawate Islami</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                        Naat Competition History & Mission
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
                        Learn about the annual event organized by Quba Zone (Kurla) and our commitment to showcasing beautiful recitations.
                    </p>
                </div>
            </section>

            {/* Content Section 1: Intro */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-brand-primary">Our Foundation</h2>
                    <h3 className="text-3xl font-extrabold text-brand-dark font-display">Nurturing Devotional Talent</h3>
                    <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                        The Annual Naat Competition organized by Sunni Dawate Islami, Quba Zone, has served as a prominent platform for young and aspiring reciters for over a decade. Under the guidance of our spiritual mentors, the competition aims to inculcate the correct pronunciation and respectful recitation of praises for the Prophet Muhammad (صلى الله عليه وسلم).
                    </p>
                    <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                        What started as a small local gathering has matured into a highly organized event utilizing state-of-the-art grading interfaces, helping candidates identify their strengths and polish their vocal and theological capabilities.
                    </p>
                    
                    <div className="pt-2">
                        <Link 
                            to="/register"
                            className="px-6 py-3.5 bg-brand-primary hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md inline-block"
                        >
                            Become a Participant
                        </Link>
                    </div>
                </div>

                {/* Right image/badge card */}
                <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-[150px] -z-10"></div>
                    <div className="flex items-center gap-4 mb-6">
                        <img src="/logo.svg" alt="Hera Logo" className="w-16 h-16 bg-white p-0.5 border border-brand-gold rounded-full" />
                        <div>
                            <h4 className="font-extrabold text-brand-dark text-lg font-display">Hera Islamic Channel</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Official Broadcasting Partner</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 font-semibold text-sm">
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-xs shrink-0 font-bold">✓</span>
                            <span className="text-gray-700">Broadcasting final rounds globally to millions of households.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-xs shrink-0 font-bold">✓</span>
                            <span className="text-gray-700">Providing dedicated training programs and feedback sessions for participants.</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-xs shrink-0 font-bold">✓</span>
                            <span className="text-gray-700">Encouraging adherence to classical sunnah recitation values without artificial filters.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-white border-y border-gray-100 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <h2 className="text-xs font-black uppercase tracking-widest text-brand-primary">Our Core Pillars</h2>
                        <h3 className="text-3xl font-extrabold text-brand-dark font-display">Competition Values</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((val, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 space-y-4 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-xs">
                                    {val.icon}
                                </div>
                                <h4 className="font-bold text-brand-dark text-lg font-display">{val.title}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Milestones */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="space-y-16">
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <h2 className="text-xs font-black uppercase tracking-widest text-brand-primary">Our Journey</h2>
                        <h3 className="text-3xl font-extrabold text-brand-dark font-display">Event Timeline</h3>
                    </div>

                    <div className="relative border-l border-gray-200 ml-4 md:ml-32 space-y-8 font-sans">
                        {milestones.map((ms, idx) => (
                            <div key={idx} className="relative pl-8 md:pl-12 group">
                                {/* Dot indicator */}
                                <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-white border-2 border-brand-primary rounded-full flex items-center justify-center text-[10px] font-bold text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                    {idx + 1}
                                </div>

                                {/* Year tag (absolute on desktop) */}
                                <div className="md:absolute md:left-[-120px] md:top-1 text-2xl font-black text-brand-primary font-display mb-1 md:mb-0">
                                    {ms.year}
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-brand-dark text-lg font-display">{ms.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 leading-relaxed">{ms.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
