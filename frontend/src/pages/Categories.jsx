import { Link } from "react-router-dom";
import { FiClock, FiUser, FiGlobe, FiAward, FiCheckCircle } from "react-icons/fi";

export default function Categories() {
    const categories = [
        {
            name: "Sub-Junior",
            age: "Under 12 Years",
            time: "3 Minutes",
            lang: "Urdu, Hindi, English",
            description: "A category designed for very young children. Evaluation is focused on standard pronunciation, basic pitch control, and confidence.",
            prizes: ["🥇 Rs. 15,000 + Trophy", "🥈 Rs. 10,000 + Trophy", "🥉 Rs. 5,000 + Trophy"],
            active: true
        },
        {
            name: "Junior",
            age: "12 to 15 Years",
            time: "4 Minutes",
            lang: "Urdu, Arabic, Persian, Hindi",
            description: "Designed for young boys to showcase intermediate-level recitations. Focuses on talaffuz, melodic control (lahn), and choice of kalam.",
            prizes: ["🥇 Rs. 25,000 + Trophy", "🥈 Rs. 15,000 + Trophy", "🥉 Rs. 10,000 + Trophy"],
            active: true
        },
        {
            name: "Middle",
            age: "15 to 18 Years",
            time: "5 Minutes",
            lang: "Urdu, Arabic, Persian, Punjabi",
            description: "Highly competitive category for adolescents. Judges look for voice modulation, pitch shifts, complex rhyming kalam, and steady posture.",
            prizes: ["🥇 Rs. 40,000 + Trophy", "🥈 Rs. 25,000 + Trophy", "🥉 Rs. 15,000 + Trophy"],
            active: true
        },
        {
            name: "Senior",
            age: "Above 18 Years",
            time: "6 Minutes",
            lang: "Urdu, Arabic, Persian, Punjabi",
            description: "The premier category. Evaluated under strict classical standards. Candidates must showcase advanced breath control, pitch mastery, and emotional depth.",
            prizes: ["🥇 Rs. 75,000 + Trophy", "🥈 Rs. 50,000 + Trophy", "🥉 Rs. 30,000 + Trophy"],
            active: true
        }
    ];

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            
            {/* Page Header */}
            <section className="bg-brand-dark py-16 px-4 text-center text-white border-b border-brand-mint/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative max-w-4xl mx-auto space-y-3">
                    <span className="text-brand-gold font-bold text-xs uppercase tracking-widest">Eligibility Criteria</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                        Competition Categories
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
                        Explore the different age groups, allowed time limits, and prizes associated with each category.
                    </p>
                </div>
            </section>

            {/* Grid Layout */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
                            
                            {/* Color bar indicator */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary opacity-60 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="space-y-6">
                                {/* Title and Badge */}
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-black text-brand-dark font-display">{cat.name}</h3>
                                    <span className="px-3.5 py-1 bg-brand-light border border-brand-mint/35 text-brand-primary text-xs font-extrabold rounded-full tracking-wide">
                                        Active
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                                    {cat.description}
                                </p>

                                {/* Specs Row */}
                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 text-xs text-gray-600 font-semibold">
                                    <div className="flex flex-col gap-1 items-center text-center p-2 bg-gray-550/5 hover:bg-gray-50 rounded-xl">
                                        <FiUser className="text-brand-primary text-base" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Age Group</span>
                                        <span className="text-brand-dark font-extrabold">{cat.age}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-center text-center p-2 bg-gray-550/5 hover:bg-gray-50 rounded-xl">
                                        <FiClock className="text-brand-gold text-base" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time Limit</span>
                                        <span className="text-brand-dark font-extrabold">{cat.time}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-center text-center p-2 bg-gray-550/5 hover:bg-gray-50 rounded-xl">
                                        <FiGlobe className="text-brand-primary text-base" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Language</span>
                                        <span className="text-brand-dark font-extrabold truncate max-w-[80px]" title={cat.lang}>{cat.lang.split(',')[0]}...</span>
                                    </div>
                                </div>

                                {/* Prizes */}
                                <div className="space-y-2.5">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <FiAward className="text-brand-gold" /> Category Rewards
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-gray-700">
                                        {cat.prizes.map((prize, pIdx) => (
                                            <div key={pIdx} className="bg-brand-light/20 border border-brand-mint/10 p-2.5 rounded-xl flex items-center justify-center text-center text-brand-dark">
                                                {prize}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action CTA */}
                            <div className="pt-8">
                                <Link
                                    to={`/register?group=${cat.name}`}
                                    className="w-full py-3.5 bg-brand-dark hover:bg-brand-dark-hover text-white text-center font-bold rounded-2xl block text-sm transition-all shadow-md group-hover:scale-[1.01]"
                                >
                                    Register for {cat.name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
