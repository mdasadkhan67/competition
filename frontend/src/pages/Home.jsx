import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiAward, FiUsers, FiClock, FiUploadCloud, FiBookOpen, FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function Home() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Target countdown date (e.g., September 12, 2026)
    useEffect(() => {
        const targetDate = new Date("2026-09-12T09:00:00+05:30").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(timer);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: <FiUsers className="text-3xl text-brand-primary" />,
            title: "Seamless Registration",
            desc: "Register in minutes by submitting your details, photograph, and identity documents through our secure multi-step wizard."
        },
        {
            icon: <FiUploadCloud className="text-3xl text-brand-gold" />,
            title: "Online Auditions",
            desc: "Upload your Naat recitation audio/video directly from your mobile or PC and check verification status in real-time."
        },
        {
            icon: <FiAward className="text-3xl text-emerald-400" />,
            title: "Fair & Transparent Judging",
            desc: "Expert judges score submissions across multiple categories (Pronunciation, Vocal Control, Choice of Kalam, and Rhythm)."
        }
    ];

    const stats = [
        { count: "1,250+", label: "Total Reciters" },
        { count: "4", label: "Age Categories" },
        { count: "12+", label: "Jury Members" },
        { count: "INR 2.5L", label: "Grand Prizes" }
    ];

    return (
        <div className="bg-gray-50 text-gray-800 overflow-x-hidden font-sans">
            
            {/* ================= HERO SECTION ================= */}
            <section className="relative premium-gradient-bg py-24 md:py-32 px-4 sm:px-6 lg:px-8 text-white overflow-hidden soft-glow-emerald">
                {/* Floating Islamic Geometry Background Art */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none scale-125">
                    <svg viewBox="0 0 100 100" className="w-full h-full stroke-white stroke-[0.2] fill-none animate-float">
                        <polygon points="50,5 63,30 90,30 70,50 80,75 50,60 20,75 30,50 10,30 37,30" />
                        <circle cx="50" cy="50" r="25" />
                        <polygon points="50,15 58,35 80,35 64,48 70,68 50,55 30,68 36,48 20,35 42,35" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Hero Text */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-brand-mint/20 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse-glow"></span>
                            <span className="text-xs sm:text-sm font-bold tracking-wider text-brand-mint uppercase font-display">Annual Event 2026</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] font-display">
                            SDI Naat <br />
                            <span className="bg-gradient-to-r from-brand-mint via-brand-gold-light to-brand-primary bg-clip-text text-transparent">
                                Competition Portal
                            </span>
                        </h1>
                        
                        <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Join the international arena of Naat recitation. Express your devotion, refine your recitation under the guidance of expert scholars, and qualify for honorable rankings.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link 
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-mint text-brand-dark font-black rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 border border-brand-gold-light/20"
                            >
                                Register Now <FiArrowRight className="text-lg" />
                            </Link>
                            <Link 
                                to="/categories"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 hover:border-brand-mint/40 transition-all text-center"
                            >
                                View Competition
                            </Link>
                            <Link 
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-transparent text-brand-mint hover:text-white font-bold text-center transition-all hover:underline"
                            >
                                Participant Login
                            </Link>
                        </div>
                    </div>

                    {/* Logo Panel / Image Panel */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                        {/* Outer Glow ring */}
                        <div className="absolute w-72 h-72 sm:w-80 sm:h-80 bg-brand-primary/20 rounded-full blur-3xl -z-10"></div>
                        
                        {/* Beautiful Circular Badge Container */}
                        <div className="w-64 h-64 sm:w-80 sm:h-80 bg-brand-dark/40 backdrop-blur-md rounded-full p-4 border border-brand-mint/30 shadow-2xl flex items-center justify-center animate-float">
                            <img src="/logo.svg" alt="Hera Islamic Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>

                </div>
            </section>

            {/* ================= COUNTDOWN SECTION ================= */}
            <section className="relative -mt-10 max-w-5xl mx-auto px-4 z-20">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1.5 text-center md:text-left">
                        <p className="text-brand-gold font-bold text-xs uppercase tracking-widest">Next Phase Auditions</p>
                        <h2 className="text-2xl font-extrabold text-brand-dark tracking-tight font-display">Registrations Deadline</h2>
                    </div>

                    {/* Timer blocks */}
                    <div className="grid grid-cols-4 gap-4 sm:gap-6 font-display">
                        {[
                            { val: timeLeft.days, label: "Days" },
                            { val: timeLeft.hours, label: "Hours" },
                            { val: timeLeft.minutes, label: "Mins" },
                            { val: timeLeft.seconds, label: "Secs" }
                        ].map((time, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-light/35 border border-brand-mint/20 rounded-2xl flex items-center justify-center text-brand-dark font-black text-xl sm:text-2xl shadow-inner">
                                    {String(time.val).padStart(2, '0')}
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{time.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= METRICS STATS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-3xl sm:text-4xl font-black text-brand-dark font-display">{stat.count}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= FEATURES SECTION ================= */}
            <section className="bg-white border-y border-gray-100 py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-16">
                    
                    {/* Header */}
                    <div className="text-center space-y-3 max-w-xl mx-auto">
                        <h2 className="text-xs font-black uppercase tracking-widest text-brand-primary">How It Works</h2>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight font-display">Competition Flow</h3>
                        <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                            A streamlined 3-step digital journey from initial submission to the final stage evaluation.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feat, i) => (
                            <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-950/5 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-[100px] -z-10"></div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-xs">
                                        {feat.icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-brand-dark font-display">{feat.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= ELIGIBILITY CATEGORIES SUMMARY ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-brand-dark rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center gap-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent"></div>
                    
                    <div className="lg:w-1/2 space-y-6 relative z-10 text-center lg:text-left">
                        <span className="text-brand-gold font-bold text-xs uppercase tracking-widest font-display">Categories Available</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">Age Groups & Limits</h2>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                            To ensure fair evaluation, candidates are classified into distinct age categories. Each group is graded on specific criteria, with proportional time allocations.
                        </p>
                        <div className="pt-2">
                            <Link 
                                to="/categories"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-emerald-500 text-brand-dark font-extrabold rounded-xl transition-all shadow-md shadow-brand-primary/10 border border-brand-gold/20"
                            >
                                Explore Group Details <FiArrowRight />
                            </Link>
                        </div>
                    </div>

                    {/* Interactive Group Stack Preview */}
                    <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 font-display">
                        {[
                            { name: "Sub-Junior", age: "Under 12 Yrs", time: "3 Mins Max" },
                            { name: "Junior", age: "12 - 15 Yrs", time: "4 Mins Max" },
                            { name: "Middle", age: "15 - 18 Yrs", time: "5 Mins Max" },
                            { name: "Senior", age: "Above 18 Yrs", time: "6 Mins Max" }
                        ].map((group, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                                <h3 className="font-bold text-brand-mint text-lg">{group.name}</h3>
                                <p className="text-xs text-gray-300 font-semibold mt-1">Age Limit: {group.age}</p>
                                <p className="text-[10px] text-brand-gold font-bold uppercase tracking-wider mt-2">Duration: {group.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= RULES SUMMARY ================= */}
            <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    <div className="lg:col-span-5 space-y-6">
                        <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">Crucial Guidelines</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight font-display">Rules & Evaluation Criteria</h2>
                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-semibold">
                            To maintain the high standards of our competition, we enforce strict recording and submission guidelines. Ensure you meet all points before uploading your recitation.
                        </p>
                        
                        <div className="space-y-3.5">
                            {[
                                "No background sound effects or reverb filters",
                                "Continuous one-take video recording (no cuts)",
                                "Recite without any written text support (preferred)",
                                "Proper dress code and respectful posture"
                            ].map((rule, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <FiCheckCircle className="text-brand-primary text-xl mt-0.5 shrink-0" />
                                    <span className="text-sm font-semibold text-gray-700">{rule}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <Link to="/rules" className="text-brand-primary font-bold hover:text-emerald-700 inline-flex items-center gap-1.5 transition-colors">
                                Read Complete Guidelines Document <FiArrowRight />
                            </Link>
                        </div>
                    </div>

                    {/* Graphic Box */}
                    <div className="lg:col-span-7 bg-brand-light/35 border border-brand-mint/20 rounded-3xl p-8 space-y-6">
                        <h3 className="font-extrabold text-brand-dark text-xl font-display">How is your recitation graded?</h3>
                        
                        {/* Grades progress simulation */}
                        <div className="space-y-4 font-semibold text-xs sm:text-sm">
                            {[
                                { aspect: "Makhraj & Pronunciation (Talaffuz)", pct: 35, color: "bg-brand-primary" },
                                { aspect: "Vocal Control & Pitch (Saut)", pct: 25, color: "bg-brand-mint" },
                                { aspect: "Choice of Kalam & Meaning (Kalam)", pct: 20, color: "bg-brand-gold" },
                                { aspect: "Melody & Expression (Lahn)", pct: 20, color: "bg-emerald-400" }
                            ].map((grade, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex justify-between text-gray-700">
                                        <span>{grade.aspect}</span>
                                        <span className="font-bold">{grade.pct}% Weight</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${grade.color} rounded-full`} style={{ width: `${grade.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}