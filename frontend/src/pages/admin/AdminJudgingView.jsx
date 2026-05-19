import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/admin";
import { FiAward, FiUser, FiSearch, FiArrowUp } from "react-icons/fi";
import { SCORING, maxGrandTotal } from "../../constants/scoring";

export default function AdminJudgingView() {
    const { group } = useParams();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchResults = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/registrations");
            const data = res.data.data;
            console.log(`Admin Results - Raw Data:`, data);

            if (!Array.isArray(data)) {
                setParticipants([]);
                return;
            }

            // Filter by group (handling Jr. vs Jr) and approved status
            const filtered = data.filter(p => {
                const pGroup = p.group?.replace(/\.$/, "").toLowerCase();
                const targetGroup = group?.replace(/\.$/, "").toLowerCase();
                return pGroup === targetGroup && p.registrationStatus === "approved" && p.isRound2Selected === true;
            });

            console.log(`Admin Results - Filtered for ${group}:`, filtered);

            // Calculate total marks from all judges for each participant
            const processed = filtered.map(p => {
                const totalFromAllJudges = p.scores?.reduce((acc, s) => acc + (s.totalScore || 0), 0) || 0;
                const judgeCount = p.scores?.length || 0;
                return { ...p, grandTotal: totalFromAllJudges, judgeCount };
            });

            // Sort by grandTotal (highest first)
            processed.sort((a, b) => b.grandTotal - a.grandTotal);
            setParticipants(processed);
        } catch (err) {
            console.error("Failed to fetch results", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [group]);

    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.candidateRegId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">{group} Group Leaderboard</h2>
                    <p className="text-gray-500 mt-2 font-medium">
                        Each judge: {SCORING.MAX_TOTAL_PER_JUDGE} marks (Kalam, Tarz o Tarannum, Talaffuz, Harkat o Saknaat, Libas o Andaz — 10 each)
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search candidate..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-widest border-b border-gray-100">
                                <th className="py-6 pl-8">Rank</th>
                                <th className="py-6">Candidate</th>
                                <th className="py-6 text-center">Judge Marks</th>
                                <th className="py-6 text-center">Grand Total</th>
                                <th className="py-6 pr-8 text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20">
                                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredParticipants.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-gray-400 font-bold">
                                        No results available for this group yet.
                                    </td>
                                </tr>
                            ) : (
                                filteredParticipants.map((p, index) => {
                                    const maxPossible = p.judgeCount * SCORING.MAX_TOTAL_PER_JUDGE;
                                    const percentage = maxPossible ? (p.grandTotal / maxPossible) * 100 : 0;
                                    return (
                                        <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-6 pl-8">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                    index === 1 ? 'bg-gray-100 text-gray-500' :
                                                        index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                                        {p.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-800 leading-tight">{p.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{p.candidateRegId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex justify-center items-center gap-3">
                                                    {[0, 1, 2].map((idx) => {
                                                        const score = p.scores?.[idx];
                                                        return (
                                                            <div key={idx} className="flex flex-col items-center">
                                                                <span className="text-[9px] text-gray-400 font-black uppercase mb-1">Judge {idx + 1}</span>
                                                                <div
                                                                    className={`w-12 h-10 rounded-xl border flex items-center justify-center font-black transition-all ${score
                                                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                                                                        : "bg-gray-50 border-gray-100 text-gray-300"
                                                                        }`}
                                                                    title={score ? `${score.judgeName} (${score.totalScore}/${SCORING.MAX_TOTAL_PER_JUDGE})` : "Pending"}
                                                                >
                                                                    {score ? score.totalScore : "-"}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="text-xl font-black text-indigo-600">{p.grandTotal}</span>
                                                <span className="text-[10px] text-gray-300 font-bold ml-1">/ {p.judgeCount * SCORING.MAX_TOTAL_PER_JUDGE}</span>
                                            </td>
                                            <td className="py-6 pr-8 text-right">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden md:block">
                                                        <div
                                                            className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-emerald-500' :
                                                                percentage > 50 ? 'bg-indigo-500' : 'bg-orange-500'
                                                                }`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-400">{Math.round(percentage)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600 rounded-[35px] p-8 text-white shadow-xl shadow-indigo-500/20">
                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                        <FiAward className="text-2xl" />
                    </div>
                    <h3 className="text-white/60 uppercase text-[10px] font-black tracking-widest mb-1">Current Leader</h3>
                    <p className="text-2xl font-black truncate">{participants[0]?.name || "N/A"}</p>
                </div>

                <div className="bg-white rounded-[35px] p-8 border border-gray-100 shadow-sm">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                        <FiUser className="text-2xl" />
                    </div>
                    <h3 className="text-gray-400 uppercase text-[10px] font-black tracking-widest mb-1">Total Evaluated</h3>
                    <p className="text-2xl font-black text-gray-800">{participants.filter(p => p.judgeCount > 0).length}</p>
                </div>

                <div className="bg-white rounded-[35px] p-8 border border-gray-100 shadow-sm">
                    <div className="h-12 w-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
                        <FiArrowUp className="text-2xl" />
                    </div>
                    <h3 className="text-gray-400 uppercase text-[10px] font-black tracking-widest mb-1">Max Possible</h3>
                    <p className="text-2xl font-black text-gray-800">
                        {maxGrandTotal()}{" "}
                        <span className="text-xs text-gray-300 font-bold">({SCORING.MAX_JUDGES} judges × {SCORING.MAX_TOTAL_PER_JUDGE})</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
