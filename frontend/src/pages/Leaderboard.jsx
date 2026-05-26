import { useState } from "react";
import { FiAward, FiTrendingUp, FiSearch, FiTrophy, FiStar } from "react-icons/fi";

export default function Leaderboard() {
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");

    const rankings = [
        { rank: 1, id: "SDI-2026-081", name: "Muhammad Hamza Shaikh", group: "Senior", makhraj: 34, vocal: 24, kalam: 18, melody: 19.5, total: 95.5 },
        { rank: 2, id: "SDI-2026-312", name: "Mustafa Ali Khan", group: "Middle", makhraj: 33, vocal: 23, kalam: 19, melody: 18.5, total: 93.5 },
        { rank: 3, id: "SDI-2026-398", name: "Abdul Wahab", group: "Sub-Junior", makhraj: 32.5, vocal: 22.5, kalam: 18, melody: 19, total: 92.0 },
        { rank: 4, id: "SDI-2026-104", name: "Ahmad Raza Qadri", group: "Senior", makhraj: 31, vocal: 23, kalam: 18, melody: 17, total: 89.0 },
        { rank: 5, id: "SDI-2026-402", name: "Zayd Siddiqui", group: "Junior", makhraj: 32, vocal: 21, kalam: 16.5, melody: 18, total: 87.5 },
        { rank: 6, id: "SDI-2026-250", name: "Muhammad Anas Raza", group: "Middle", makhraj: 30.5, vocal: 21.5, kalam: 17, melody: 17.5, total: 87.0 },
        { rank: 7, id: "SDI-2026-121", name: "Muadh Shaikh", group: "Senior", makhraj: 31, vocal: 20, kalam: 16, melody: 17, total: 84.0 },
        { rank: 8, id: "SDI-2026-411", name: "Owais Ahmad Qadri", group: "Junior", makhraj: 29, vocal: 20.5, kalam: 15.5, melody: 17, total: 82.0 },
        { rank: 9, id: "SDI-2026-009", name: "Raza Ali", group: "Sub-Junior", makhraj: 28.5, vocal: 19, kalam: 16.5, melody: 16, total: 80.0 }
    ];

    const filteredRankings = rankings.filter((cand) => {
        const matchesCategory = category === "All" || cand.group === category;
        const matchesSearch = cand.name.toLowerCase().includes(search.toLowerCase()) || cand.id.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Re-index ranking for filtered view
    const formattedRankings = filteredRankings.map((cand, idx) => ({
        ...cand,
        displayRank: idx + 1
    }));

    // Top 3 for Podium
    const podiumCandidates = formattedRankings.slice(0, 3);
    // Rest of candidates
    const restCandidates = formattedRankings.slice(3);

    // Arrange podium order: Rank 2, Rank 1, Rank 3
    const getPodiumOrder = (podium) => {
        const ordered = [];
        if (podium[1]) ordered.push(podium[1]); // Rank 2
        if (podium[0]) ordered.push(podium[0]); // Rank 1
        if (podium[2]) ordered.push(podium[2]); // Rank 3
        return ordered;
    };

    const orderedPodium = getPodiumOrder(podiumCandidates);

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            
            {/* Page Header */}
            <section className="bg-brand-dark py-16 px-4 text-center text-white border-b border-brand-mint/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative max-w-4xl mx-auto space-y-3">
                    <span className="text-brand-gold font-bold text-xs uppercase tracking-widest">Live Standings</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                        Leaderboard & Rankings
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
                        Real-time scores aggregated across pronunciation, melody, and presentation.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

                {/* Filter and search bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    {/* Search */}
                    <div className="w-full md:w-80 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <FiSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search rank list..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-mint/30 focus:border-brand-primary placeholder:text-gray-400 transition-all"
                        />
                    </div>

                    {/* Category Selector */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto font-display font-semibold text-[10px] sm:text-xs">
                        {["All", "Sub-Junior", "Junior", "Middle", "Senior"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                                    category === cat
                                    ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/10"
                                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ================= PODIUM LAYOUT ================= */}
                {orderedPodium.length > 0 && (
                    <div className="flex flex-col md:flex-row items-end justify-center gap-6 sm:gap-10 pt-16 pb-8 px-4 font-display">
                        
                        {orderedPodium.map((cand, idx) => {
                            const isFirst = cand.displayRank === 1;
                            const isSecond = cand.displayRank === 2;
                            const isThird = cand.displayRank === 3;
                            
                            // Height and styling variables
                            let heightClass = "h-48";
                            let podiumStyle = "bg-white border border-gray-100 shadow-lg";
                            let rankBadge = "bg-slate-100 border-slate-200 text-slate-500";
                            
                            if (isFirst) {
                                heightClass = "h-64 sm:h-72 order-1 md:order-2 z-10 scale-105 md:scale-110";
                                podiumStyle = "bg-gradient-to-b from-[#064e43]/90 to-brand-dark/95 border border-brand-mint/30 shadow-2xl text-white soft-glow-emerald";
                                rankBadge = "bg-brand-gold text-brand-dark border-brand-gold-light";
                            } else if (isSecond) {
                                heightClass = "h-52 sm:h-60 order-2 md:order-1";
                                rankBadge = "bg-slate-200 border-slate-300 text-slate-700 font-bold";
                            } else if (isThird) {
                                heightClass = "h-44 sm:h-52 order-3";
                                rankBadge = "bg-amber-100 border-amber-200 text-amber-700";
                            }

                            return (
                                <div 
                                    key={cand.id} 
                                    className={`w-full md:w-64 rounded-3xl flex flex-col justify-end items-center p-6 text-center transition-all hover:scale-[1.02] duration-300 ${heightClass} ${podiumStyle}`}
                                >
                                    {/* Avatar placeholder with Rank icon */}
                                    <div className="relative mb-4">
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-2xl border-4 ${
                                            isFirst ? "bg-white/10 border-brand-gold" : "bg-brand-light/30 border-brand-mint"
                                        }`}>
                                            {isFirst ? <FiTrophy className="text-brand-gold-light text-3xl" /> : cand.name[0]}
                                        </div>
                                        <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black border ${rankBadge}`}>
                                            Rank {cand.displayRank}
                                        </span>
                                    </div>

                                    {/* Candidate Info */}
                                    <div className="space-y-1 mt-2">
                                        <h4 className="font-extrabold text-base tracking-tight leading-tight line-clamp-1">{cand.name}</h4>
                                        <p className={`text-xs font-semibold ${isFirst ? "text-brand-mint" : "text-gray-400"}`}>{cand.group} • {cand.id}</p>
                                    </div>

                                    {/* Score */}
                                    <div className="mt-4 pt-3 border-t border-gray-150/10 w-full">
                                        <span className={`text-xl font-black ${isFirst ? "text-brand-gold-light" : "text-brand-primary"}`}>
                                            {cand.total.toFixed(1)} Pts
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ================= LEADERBOARD LIST TABLE ================= */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm font-semibold font-sans">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                                    <th className="py-4.5 px-6">Rank</th>
                                    <th className="py-4.5 px-6">Candidate</th>
                                    <th className="py-4.5 px-6">Group</th>
                                    <th className="py-4.5 px-6 text-center">Pronunciation (35)</th>
                                    <th className="py-4.5 px-6 text-center">Melody (20)</th>
                                    <th className="py-4.5 px-6 text-center">Kalam (20)</th>
                                    <th className="py-4.5 px-6 text-center">Vocal (25)</th>
                                    <th className="py-4.5 px-6 text-right">Total Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {restCandidates.length > 0 ? (
                                    restCandidates.map((cand) => (
                                        <tr key={cand.id} className="hover:bg-brand-light/5 transition-colors">
                                            <td className="py-4.5 px-6">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center text-xs">
                                                    {cand.displayRank}
                                                </span>
                                            </td>
                                            <td className="py-4.5 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-brand-dark leading-tight">{cand.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{cand.id}</span>
                                                </div>
                                            </td>
                                            <td className="py-4.5 px-6">
                                                <span className="px-2.5 py-1 bg-gray-100 border border-gray-100 text-gray-500 text-[10px] font-bold rounded-lg uppercase">
                                                    {cand.group}
                                                </span>
                                            </td>
                                            <td className="py-4.5 px-6 text-center font-medium">{cand.makhraj}</td>
                                            <td className="py-4.5 px-6 text-center font-medium">{cand.melody}</td>
                                            <td className="py-4.5 px-6 text-center font-medium">{cand.kalam}</td>
                                            <td className="py-4.5 px-6 text-center font-medium">{cand.vocal}</td>
                                            <td className="py-4.5 px-6 text-right font-black text-brand-primary text-sm sm:text-base">
                                                {cand.total.toFixed(1)} / 100
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    podiumCandidates.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="py-12 px-6 text-center text-gray-400 font-semibold">
                                                No candidates match search queries.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>

        </div>
    );
}
