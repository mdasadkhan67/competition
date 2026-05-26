import { useState } from "react";
import { FiSearch, FiAward, FiUser, FiCheckCircle, FiMinusCircle } from "react-icons/fi";

export default function Results() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const mockCandidates = [
        { id: "SDI-2026-081", name: "Muhammad Hamza Shaikh", group: "Senior", kalam: "Tajalliyate Huzoor", score: 92.5, status: "Winner" },
        { id: "SDI-2026-104", name: "Ahmad Raza Qadri", group: "Senior", kalam: "Ye Sab Tumhara Karam Hai", score: 89.0, status: "Runner-up" },
        { id: "SDI-2026-312", name: "Mustafa Ali Khan", group: "Middle", kalam: "Madine Ka Safar", score: 86.5, status: "Winner" },
        { id: "SDI-2026-402", name: "Zayd Siddiqui", group: "Junior", kalam: "Balaghal Ula Bi Kamalihi", score: 84.0, status: "Winner" },
        { id: "SDI-2026-121", name: "Muadh Shaikh", group: "Senior", kalam: "Kaabe Ke Badrud Duja", score: 81.0, status: "Qualified" },
        { id: "SDI-2026-250", name: "Muhammad Anas Raza", group: "Middle", kalam: "Subha Taiba Me Hui", score: 79.5, status: "Qualified" },
        { id: "SDI-2026-398", name: "Abdul Wahab", group: "Sub-Junior", kalam: "Lam Yati Nazeeruka", score: 88.0, status: "Winner" },
        { id: "SDI-2026-411", name: "Owais Ahmad Qadri", group: "Junior", kalam: "Aamad-e-Mustafa", score: 76.0, status: "Qualified" },
        { id: "SDI-2026-009", name: "Raza Ali", group: "Sub-Junior", kalam: "Gunahon Ki Aadat", score: 72.0, status: "Shortlisted" }
    ];

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredCandidates = mockCandidates.filter((cand) => {
        const matchesSearch = 
            cand.name.toLowerCase().includes(search.toLowerCase()) || 
            cand.id.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "All" || cand.group === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "Winner":
                return "bg-amber-50 border-amber-200 text-brand-gold";
            case "Runner-up":
                return "bg-slate-50 border-slate-200 text-slate-500";
            case "Qualified":
                return "bg-emerald-50 border-emerald-200 text-brand-primary";
            case "Shortlisted":
                return "bg-blue-50 border-blue-200 text-blue-600";
            default:
                return "bg-gray-50 border-gray-200 text-gray-500";
        }
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            
            {/* Page Header */}
            <section className="bg-brand-dark py-16 px-4 text-center text-white border-b border-brand-mint/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative max-w-4xl mx-auto space-y-3">
                    <span className="text-brand-gold font-bold text-xs uppercase tracking-widest">Public Board</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                        Competition Results
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
                        Search and view certified scores, qualified participants, and winners for each category.
                    </p>
                </div>
            </section>

            {/* Results Filter & Directory */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                
                {/* Search Bar + Category Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    {/* Search Input */}
                    <div className="w-full md:w-96 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <FiSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Name or Registration ID..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-mint/30 focus:border-brand-primary transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-display font-semibold text-xs">
                        {["All", "Sub-Junior", "Junior", "Middle", "Senior"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-bold ${
                                    categoryFilter === cat
                                    ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/10"
                                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Directory Table */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm font-sans font-semibold text-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                                    <th className="py-4.5 px-6">ID</th>
                                    <th className="py-4.5 px-6">Candidate Name</th>
                                    <th className="py-4.5 px-6">Category</th>
                                    <th className="py-4.5 px-6">Kalam Title</th>
                                    <th className="py-4.5 px-6">Score</th>
                                    <th className="py-4.5 px-6 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-150 text-gray-700">
                                {filteredCandidates.length > 0 ? (
                                    filteredCandidates.map((cand) => (
                                        <tr key={cand.id} className="hover:bg-brand-light/5 transition-colors">
                                            <td className="py-4 px-6 font-bold text-brand-dark">{cand.id}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-full bg-brand-light/30 text-brand-primary text-xs font-extrabold flex items-center justify-center border border-brand-mint/10">
                                                        {cand.name[0]}
                                                    </span>
                                                    <span>{cand.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-1 bg-gray-100 border border-gray-100 text-gray-500 text-xs font-bold rounded-lg">
                                                    {cand.group}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 italic text-gray-500">{cand.kalam}</td>
                                            <td className="py-4 px-6 font-extrabold text-brand-dark">{cand.score.toFixed(1)} / 100</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`inline-block px-3 py-1 border text-xs font-extrabold rounded-full ${getStatusStyle(cand.status)}`}>
                                                    {cand.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 px-6 text-center text-gray-400 font-semibold">
                                            <FiMinusCircle className="mx-auto text-4xl mb-3 text-gray-300" />
                                            No candidates found matching filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>

        </div>
    );
}
