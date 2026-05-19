import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/admin";
import { FiSearch, FiSave, FiLock, FiAlertTriangle } from "react-icons/fi";
import {
    SCORING,
    SCORING_CATEGORIES,
    clampCategoryScore,
    computeTotalFromCategories,
    validateScoresBeforeSubmit,
    scoringCategoriesList
} from "../../constants/scoring";

export default function Judging() {
    const { group } = useParams();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [scores, setScores] = useState({});
    const [showConfirm, setShowConfirm] = useState(null); // stores participant ID to confirm

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const res = await API.get("/judge/registrations");
            const data = res.data.data;
            console.log("Fetched Registrations:", data);

            if (!Array.isArray(data)) {
                setParticipants([]);
                return;
            }
            setParticipants(data);
            const judgeId = (() => {
                try {
                    const userData = JSON.parse(localStorage.getItem('user'));
                    console.log("Current Judge User:", userData);
                    return userData?.id;
                } catch {
                    return null;
                }
            })();

            const initialScores = {};
            data.forEach(p => {
                const myScore = p.scores?.find(s => (s.judgeId?._id || s.judgeId)?.toString() === judgeId?.toString());
                if (myScore) {
                    console.log(`Found score for ${p.name}:`, myScore);
                    initialScores[p._id] = {
                        cat1: myScore.cat1 || 0,
                        cat2: myScore.cat2 || 0,
                        cat3: myScore.cat3 || 0,
                        cat4: myScore.cat4 || 0,
                        cat5: myScore.cat5 || 0,
                        totalScore: myScore.totalScore || 0,
                        comments: myScore.comments || "",
                        isLocked: true
                    };
                } else {
                    initialScores[p._id] = { cat1: 0, cat2: 0, cat3: 0, cat4: 0, cat5: 0, totalScore: 0, comments: "", isLocked: false };
                }
            });
            console.log("Initialized Scores State:", initialScores);
            setScores(initialScores);
        } catch (err) {
            console.error("Failed to fetch participants", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [group]);

    const handleInputChange = (pId, field, value) => {
        if (scores[pId]?.isLocked) return;
        setScores(prev => ({
            ...prev,
            [pId]: {
                ...(prev[pId] || { cat1: 0, cat2: 0, cat3: 0, cat4: 0, cat5: 0, comments: "", isLocked: false }),
                [field]: field === "comments" ? value : clampCategoryScore(value)
            }
        }));
    };

    const calculateTotal = (pId) => {
        const s = scores[pId];
        if (!s) return 0;
        if (s.isLocked && s.totalScore !== undefined) return s.totalScore;
        return computeTotalFromCategories(s);
    };

    const handleSave = async (pId) => {
        const { isLocked, totalScore: _ignored, ...scoreData } = scores[pId];
        const validation = validateScoresBeforeSubmit(scoreData);
        if (!validation.valid) {
            alert(validation.message);
            setShowConfirm(null);
            return;
        }
        try {
            await API.post("/judge/score", {
                registrationId: pId,
                ...scoreData,
                totalScore: validation.total
            });
            setShowConfirm(null);
            fetchParticipants();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save score");
            setShowConfirm(null);
        }
    };

    const filteredParticipants = participants.filter(p =>
        p.group === group && (
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.candidateRegId.toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">{group} Group Judging</h2>
                    <p className="text-gray-400 mt-2 font-medium">
                        Total {SCORING.MAX_TOTAL_PER_JUDGE} marks per candidate (locked after submit)
                    </p>
                    <ul className="text-gray-500 text-xs mt-2 space-y-0.5 font-medium list-none">
                        {scoringCategoriesList().map((line) => (
                            <li key={line}>{line}</li>
                        ))}
                    </ul>
                </div>

                <div className="relative w-full md:w-80">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search by name or REG-ID..."
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-gray-400 uppercase text-[11px] font-black tracking-widest px-6">
                            <th className="pb-4 pl-6">Candidate</th>
                            {SCORING_CATEGORIES.map((cat) => (
                                <th key={cat.key} className="pb-4 text-center normal-case max-w-[88px]">
                                    <span className="block text-[10px] font-bold leading-tight text-gray-500">
                                        {cat.label}
                                    </span>
                                    <span className="block text-[9px] font-normal tracking-normal text-gray-300 mt-0.5">
                                        (0–{cat.maxMarks})
                                    </span>
                                </th>
                            ))}
                            <th className="pb-4 text-center">
                                Total
                                <span className="block text-[9px] font-normal normal-case tracking-normal text-gray-300">
                                    (/{SCORING.MAX_TOTAL_PER_JUDGE})
                                </span>
                            </th>
                            <th className="pb-4">Comments</th>
                            <th className="pb-4 pr-6 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center py-20">
                                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                </td>
                            </tr>
                        ) : filteredParticipants.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center py-20 text-gray-400 font-bold bg-gray-50 rounded-3xl">
                                    No candidates found in this group.
                                </td>
                            </tr>
                        ) : (
                            filteredParticipants.map((p) => {
                                const isLocked = scores[p._id]?.isLocked;
                                return (
                                    <tr key={p._id} className={`bg-gray-50 transition-all duration-300 group ${isLocked ? 'opacity-70 grayscale-[0.5]' : 'hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5'}`}>
                                        <td className="py-6 pl-6 rounded-l-[30px]">
                                            <div className="flex items-center space-x-4">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black shadow-lg ${isLocked ? 'bg-gray-400 text-gray-200' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}>
                                                    {p.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 leading-tight">{p.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{p.candidateRegId}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {SCORING_CATEGORIES.map((cat) => (
                                            <td key={cat.key} className="py-6 text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={cat.maxMarks}
                                                    step="1"
                                                    disabled={isLocked}
                                                    title={`${cat.label} (max ${cat.maxMarks})`}
                                                    className={`w-14 h-12 border rounded-xl text-center font-black outline-none transition-all ${isLocked
                                                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-white border-gray-200 text-indigo-600 focus:ring-2 focus:ring-indigo-500'}`}
                                                    value={scores[p._id]?.[cat.key] ?? 0}
                                                    onChange={(e) => handleInputChange(p._id, cat.key, e.target.value)}
                                                />
                                            </td>
                                        ))}

                                        <td className="py-6 text-center">
                                            <div className={`w-14 h-12 flex flex-col items-center justify-center mx-auto rounded-xl font-black ${isLocked ? 'bg-gray-200 text-gray-600' : 'bg-indigo-100 text-indigo-700'}`}>
                                                <span>{calculateTotal(p._id)}</span>
                                                <span className="text-[8px] font-bold opacity-60">/{SCORING.MAX_TOTAL_PER_JUDGE}</span>
                                            </div>
                                        </td>

                                        <td className="py-6 min-w-[200px]">
                                            <input
                                                type="text"
                                                disabled={isLocked}
                                                placeholder={isLocked ? "Comments Locked" : "Add remarks..."}
                                                className={`w-full h-12 border rounded-xl px-4 text-sm font-medium outline-none transition-all ${isLocked
                                                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500'}`}
                                                value={scores[p._id]?.comments || ""}
                                                onChange={(e) => handleInputChange(p._id, "comments", e.target.value)}
                                            />
                                        </td>

                                        <td className="py-6 pr-6 rounded-r-[30px] text-right">
                                            {isLocked ? (
                                                <div className="flex items-center justify-end text-emerald-500 font-bold space-x-2 mr-2">
                                                    <FiLock />
                                                    <span className="text-[10px] uppercase tracking-widest">Submitted</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowConfirm(p._id)}
                                                    className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center ml-auto"
                                                    title="Submit Evaluation"
                                                >
                                                    <FiSave className="text-xl" />
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

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <FiAlertTriangle className="text-4xl" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Confirm Submission</h3>
                            <p className="text-gray-500 font-medium mb-8">
                                Please ensure you enter marks properly. Once submitted, <span className="text-red-500 font-bold">it can never be changed</span>.
                            </p>

                            <div className="flex w-full space-x-4">
                                <button
                                    onClick={() => setShowConfirm(null)}
                                    className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Review Again
                                </button>
                                <button
                                    onClick={() => handleSave(showConfirm)}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/40 transition-all"
                                >
                                    Yes, Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-10 p-6 bg-amber-50 rounded-3xl flex items-center space-x-4 border border-amber-100">
                <div className="bg-amber-500 p-2 rounded-xl text-white">
                    <FiLock className="text-xl" />
                </div>
                <p className="text-sm text-amber-800 font-medium">
                    <span className="font-black uppercase">Note:</span> Evaluations are permanent. You will not be able to edit a candidate's marks after clicking the save button.
                </p>
            </div>
        </div>
    );
}
