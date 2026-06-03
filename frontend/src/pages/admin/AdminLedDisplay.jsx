import { useEffect, useState } from "react";
import API from "../../api/admin";
import { FiAward, FiMonitor, FiExternalLink, FiCheckCircle, FiClock, FiSearch, FiPlay } from "react-icons/fi";
import { SCORING } from "../../constants/scoring";
import AdminLedScreen from "./AdminLedScreen";

export default function AdminLedDisplay() {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeGroup, setActiveGroup] = useState("Jr.");
    const [presentingCandidate, setPresentingCandidate] = useState(null);

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/registrations");
            const data = res.data.data;
            console.log("Admin LED Display - Raw Data:", data);

            if (!Array.isArray(data)) {
                setParticipants([]);
                return;
            }

            // Only show approved and selected for Round 2
            const filtered = data.filter(p => p.registrationStatus === "approved" && p.isRound2Selected === true);
            setParticipants(filtered);
        } catch (err) {
            console.error("Failed to fetch registrations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    // Standalone LED screen window opener
    const openStandaloneScreen = () => {
        const width = 1280;
        const height = 720;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        window.open(
            "/admin/led-screen",
            "LED_Screen_Display",
            `width=${width},height=${height},left=${left},top=${top},menubar=no,status=no,toolbar=no`
        );
    };

    // Filter logic
    const displayedParticipants = participants.filter(p => {
        // Group match (handling dot in Jr.)
        const pGroup = p.group?.replace(/\.$/, "").toLowerCase();
        const targetGroup = activeGroup?.replace(/\.$/, "").toLowerCase();
        const matchesGroup = pGroup === targetGroup;

        // Search match
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.candidateRegId.toLowerCase().includes(search.toLowerCase()) ||
            p.naatTitle.toLowerCase().includes(search.toLowerCase());

        return matchesGroup && matchesSearch;
    });

    const handlePresent = (candidate) => {
        // 1. Store in localStorage so the standalone window can detect it
        const payload = {
            id: candidate._id,
            name: candidate.name,
            candidateRegId: candidate.candidateRegId,
            group: candidate.group,
            naatTitle: candidate.naatTitle,
            scores: candidate.scores || [],
            photo: candidate.photo,
            timestamp: Date.now() // to force storage event change
        };
        localStorage.setItem("active_led_candidate", JSON.stringify(payload));

        // 2. Open inline fullscreen view too
        setPresentingCandidate(payload);
    };

    const handleUnlockScore = async (registrationId, judgeId, judgeName, candidateName) => {
        const confirmUnlock = window.confirm(
            `Are you sure you want to unlock/reset ${judgeName}'s score for "${candidateName}"?\nThis will completely remove the score, allowing the judge to evaluate them again.`
        );

        if (confirmUnlock) {
            try {
                const jId = (judgeId?._id || judgeId)?.toString();
                await API.delete(`/admin/registrations/${registrationId}/scores/${jId}`);
                alert("Score unlocked successfully!");
                fetchParticipants();
            } catch (err) {
                console.error("Failed to unlock score", err);
                alert(err.response?.data?.message || "Failed to unlock score");
            }
        }
    };

    const getJudgeScore = (scores, index) => {
        // Returns the score of the judge at the given index if exists
        const score = scores?.[index];
        return score ? score.totalScore : null;
    };

    const getJudgeName = (scores, index) => {
        const score = scores?.[index];
        return score ? score.judgeName : `Judge ${index + 1}`;
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <FiMonitor className="text-brand-primary" /> LED Screen Controller
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">
                        Present live candidate marks and grand totals on the big projector screen.
                    </p>
                </div>

                <button
                    onClick={openStandaloneScreen}
                    className="flex items-center gap-2 px-6 py-3.5 bg-brand-dark hover:bg-brand-dark-hover text-white font-bold rounded-2xl shadow-lg shadow-brand-dark/15 border border-brand-mint/10 hover:border-brand-mint/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                    <FiExternalLink className="text-lg text-brand-mint" /> Open Standalone LED Tab
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-card rounded-[35px] p-6 flex flex-col md:flex-row gap-6 justify-between items-center border border-gray-100">
                {/* Tabs */}
                <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-full md:w-auto">
                    {["Jr.", "Middle", "Sr"].map((grp) => (
                        <button
                            key={grp}
                            onClick={() => setActiveGroup(grp)}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${activeGroup === grp
                                ? "bg-white text-brand-dark shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            {grp === "Jr." ? "Junior" : grp === "Middle" ? "Middle" : "Senior"} Group
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search candidate or title..."
                        className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-mint/10 focus:border-brand-primary outline-none transition-all font-medium text-sm shadow-xs"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table of Candidates */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-widest border-b border-gray-100">
                                <th className="py-6 pl-8">Reg ID</th>
                                <th className="py-6">Candidate</th>
                                <th className="py-6">Naat Title</th>
                                <th className="py-6 text-center">Judges Status</th>
                                <th className="py-6 text-center">Grand Total</th>
                                <th className="py-6 pr-8 text-right">LED Presentation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-20">
                                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : displayedParticipants.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-20 text-gray-400 font-bold">
                                        No candidates found in {activeGroup === "Jr." ? "Junior" : activeGroup === "Middle" ? "Middle" : "Senior"} group.
                                    </td>
                                </tr>
                            ) : (
                                displayedParticipants.map((p) => {
                                    const scoresCount = p.scores?.length || 0;
                                    const isReady = scoresCount === 3;
                                    const grandTotal = p.scores?.reduce((sum, s) => sum + (s.totalScore || 0), 0) || 0;

                                    return (
                                        <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                                            {/* Reg ID */}
                                            <td className="py-6 pl-8 font-black text-xs text-brand-dark/70 uppercase">
                                                {p.candidateRegId}
                                            </td>

                                            {/* Name */}
                                            <td className="py-6">
                                                <div className="flex items-center space-x-3">
                                                    {p.photo ? (
                                                        <img src={`http://localhost:5000/${p.photo}`} className="h-10 w-10 rounded-xl object-cover border border-brand-mint/30" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center font-black">
                                                            {p.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-black text-gray-800 leading-tight">{p.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{p.city}, {p.state}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Naat Title */}
                                            <td className="py-6">
                                                <p className="font-semibold text-gray-700 max-w-[200px] truncate" title={p.naatTitle}>
                                                    {p.naatTitle}
                                                </p>
                                            </td>

                                            {/* Judges Status */}
                                            <td className="py-6">
                                                <div className="flex justify-center items-center gap-4">
                                                    {[0, 1, 2].map((idx) => {
                                                        const scoreObj = p.scores?.[idx];
                                                        return (
                                                            <div key={idx} className="flex flex-col items-center relative">
                                                                {scoreObj ? (
                                                                    <div
                                                                        onClick={() => handleUnlockScore(p._id, scoreObj.judgeId, scoreObj.judgeName, p.name)}
                                                                        className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-black cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                                                                        title={`Click to Unlock/Reset ${scoreObj.judgeName}'s score`}
                                                                    >
                                                                        <FiCheckCircle className="text-emerald-500 text-sm hover:text-red-500" />
                                                                        <span>{scoreObj.totalScore}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1 bg-red-50 text-red-500 px-2.5 py-1 rounded-lg border border-red-100 text-xs font-bold" title="Score Pending">
                                                                        <FiClock className="text-red-400 animate-pulse text-sm" />
                                                                        <span>--</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>

                                            {/* Grand Total */}
                                            <td className="py-6 text-center font-display">
                                                {isReady ? (
                                                    <div>
                                                        <span className="text-lg font-black text-brand-primary">{grandTotal}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold ml-0.5">/150</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300 font-bold text-sm">--</span>
                                                )}
                                            </td>

                                            {/* Action Button */}
                                            <td className="py-6 pr-8 text-right">
                                                {isReady ? (
                                                    <button
                                                        onClick={() => handlePresent(p)}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-mint text-white font-black rounded-xl text-xs shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                                                    >
                                                        <FiPlay className="text-sm" /> Present on LED
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 font-bold rounded-xl text-xs border border-gray-200/50 cursor-not-allowed"
                                                    >
                                                        Pending ({scoresCount}/3)
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fullscreen Overlay Presenter Modal (For Inline view) */}
            {presentingCandidate && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full relative">
                        {/* Close button in top right for controller operator */}
                        <button
                            onClick={() => {
                                setPresentingCandidate(null);
                                localStorage.removeItem("active_led_candidate");
                            }}
                            className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-red-400 px-4 py-2 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer"
                        >
                            Close Presentation (ESC)
                        </button>

                        <AdminLedScreen
                            isEmbedded={true}
                            embeddedCandidate={presentingCandidate}
                            onClose={() => {
                                setPresentingCandidate(null);
                                localStorage.removeItem("active_led_candidate");
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
