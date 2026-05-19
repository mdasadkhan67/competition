import { useState } from "react";
import API from "../../api/admin";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiFileText, FiUsers, FiAward } from "react-icons/fi";
import { SCORING } from "../../constants/scoring";

const matchGroup = (pGroup, targetGroup) => {
    const p = pGroup?.replace(/\.$/, "").toLowerCase();
    const t = targetGroup?.replace(/\.$/, "").toLowerCase();
    return p === t;
};

const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export default function Export() {
    const [loadingReg, setLoadingReg] = useState(false);
    const [loadingJudging, setLoadingJudging] = useState(null);
    const [error, setError] = useState("");

    const fetchRegistrations = async (group) => {
        const url = group === "All" ? "/admin/registrations" : `/admin/registrations?group=${group}`;
        const res = await API.get(url);
        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch data");
        }
        return res.data.data;
    };

    const handleExport = async (group) => {
        try {
            setLoadingReg(true);
            setError("");

            const registrations = await fetchRegistrations(group);

            if (registrations.length === 0) {
                alert(`No registrations found for ${group} group.`);
                return;
            }

            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Competition Registrations 2026", 14, 15);
            doc.setFontSize(12);
            doc.text(`Group: ${group}`, 14, 22);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 29);

            const tableRows = registrations.map((user, index) => [
                index + 1,
                user.name,
                calculateAge(user.dob),
                user.naatTitle || "N/A",
                user.phone,
                user.payment?.status?.toUpperCase() || user.registrationStatus?.toUpperCase() || "PENDING"
            ]);

            autoTable(doc, {
                head: [["Sr.", "Name", "Age", "Kalam / Title", "Phone", "Payment Status"]],
                body: tableRows,
                startY: 35,
                theme: "grid",
                headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [243, 244, 246] },
                styles: { fontSize: 9, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 10 },
                    2: { cellWidth: 15 },
                    5: { fontStyle: "bold" }
                }
            });

            doc.save(`Registrations_${group}_${Date.now()}.pdf`);
        } catch (err) {
            console.error("Export Error:", err);
            setError(err.response?.data?.message || err.message || "Failed to export data. Please check connection.");
        } finally {
            setLoadingReg(false);
        }
    };

    const handleJudgingExport = async (group) => {
        try {
            setLoadingJudging(group);
            setError("");

            const registrations = await fetchRegistrations(group);

            const participants = registrations
                .filter(
                    (p) =>
                        matchGroup(p.group, group) &&
                        p.registrationStatus === "approved" &&
                        p.isRound2Selected === true
                )
                .map((p) => {
                    const judgeScores = p.scores || [];
                    const grandTotal = judgeScores.reduce(
                        (acc, s) => acc + (Number(s.totalScore) || 0),
                        0
                    );
                    return { ...p, grandTotal };
                })
                .sort((a, b) => b.grandTotal - a.grandTotal);

            if (participants.length === 0) {
                alert(`No judged participants found for ${group} group (cleared Round 1).`);
                return;
            }

            const judgeNames = [
                ...new Set(
                    participants.flatMap((p) =>
                        (p.scores || []).map((s) => s.judgeName).filter(Boolean)
                    )
                )
            ].sort();

            const judgeHeaders = judgeNames.map((name) => `${name} (Total)`);

            const tableRows = participants.map((p, index) => {
                const row = [
                    index + 1,
                    p.candidateRegId || "N/A",
                    p.name,
                    calculateAge(p.dob),
                    p.naatTitle || "N/A",
                    p.phone || "N/A"
                ];

                judgeNames.forEach((judgeName) => {
                    const score = p.scores?.find((s) => s.judgeName === judgeName);
                    row.push(
                        score?.totalScore !== undefined && score?.totalScore !== null
                            ? score.totalScore
                            : "-"
                    );
                });

                row.push(p.grandTotal);
                return row;
            });

            const useLandscape = judgeNames.length > 2;
            const doc = new jsPDF({ orientation: useLandscape ? "landscape" : "portrait" });

            doc.setFontSize(18);
            doc.text("Judging Scores Report 2026", 14, 15);
            doc.setFontSize(12);
            doc.text(`Group: ${group}`, 14, 22);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 29);
            doc.text(
                `Each judge column shows total marks (out of ${SCORING.MAX_TOTAL_PER_JUDGE}). Grand Total = sum of all judges.`,
                14,
                36
            );

            autoTable(doc, {
                head: [
                    [
                        "Sr.",
                        "Reg ID",
                        "Name",
                        "Age",
                        "Naat Title",
                        "Phone",
                        ...judgeHeaders,
                        "Grand Total"
                    ]
                ],
                body: tableRows,
                startY: 42,
                theme: "grid",
                headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [238, 242, 255] },
                styles: { fontSize: 8, cellPadding: 2.5 },
                columnStyles: {
                    0: { cellWidth: 8 },
                    1: { cellWidth: 22 },
                    5: { cellWidth: 18 }
                }
            });

            doc.save(`Judging_Scores_${group}_${Date.now()}.pdf`);
        } catch (err) {
            console.error("Judging Export Error:", err);
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Failed to export judging data. Please check connection."
            );
        } finally {
            setLoadingJudging(null);
        }
    };

    const registrationGroups = [
        { name: "All", color: "bg-gray-800", icon: <FiUsers /> },
        { name: "Jr.", color: "bg-blue-600", icon: <FiFileText /> },
        { name: "Middle", color: "bg-purple-600", icon: <FiFileText /> },
        { name: "Sr", color: "bg-orange-600", icon: <FiFileText /> }
    ];

    const judgingGroups = [
        { name: "Jr.", color: "bg-indigo-600" },
        { name: "Middle", color: "bg-violet-600" },
        { name: "Sr", color: "bg-fuchsia-600" }
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Export Data</h1>
                <p className="text-gray-500 mt-2">
                    Download registration lists or judging score summaries by group.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Registration export */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Registration Export</h2>
                <p className="text-sm text-gray-500 mb-6">
                    All registered users with payment status.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {registrationGroups.map((group) => (
                        <div
                            key={group.name}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center hover:shadow-md transition-shadow"
                        >
                            <div
                                className={`w-12 h-12 ${group.color} text-white rounded-xl flex items-center justify-center text-xl mb-4`}
                            >
                                {group.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{group.name} Group</h3>
                            <p className="text-sm text-gray-500 mb-6 text-center">
                                Export all users in the {group.name} category.
                            </p>

                            <button
                                type="button"
                                onClick={() => handleExport(group.name)}
                                disabled={loadingReg}
                                className={`w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${group.color} hover:brightness-110 shadow-lg shadow-gray-100`}
                            >
                                {loadingReg ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FiDownload />
                                )}
                                Export PDF
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Judging scores export */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Judging Scores Export</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Participants who cleared Round 1 — basic details plus each judge&apos;s total
                    marks and grand total.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {judgingGroups.map((group) => (
                        <div
                            key={`judging-${group.name}`}
                            className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 flex flex-col items-center hover:shadow-md transition-shadow"
                        >
                            <div
                                className={`w-12 h-12 ${group.color} text-white rounded-xl flex items-center justify-center text-xl mb-4`}
                            >
                                <FiAward />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{group.name} Group</h3>
                            <p className="text-sm text-gray-500 mb-6 text-center">
                                Judge totals per participant (max {SCORING.MAX_TOTAL_PER_JUDGE} per judge, {SCORING.CATEGORY_COUNT}×{SCORING.MAX_PER_CATEGORY}).
                            </p>

                            <button
                                type="button"
                                onClick={() => handleJudgingExport(group.name)}
                                disabled={loadingJudging !== null}
                                className={`w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${group.color} hover:brightness-110 shadow-lg shadow-indigo-100`}
                            >
                                {loadingJudging === group.name ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FiDownload />
                                )}
                                Export Judging PDF
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-200">
                    📋
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Important Notice</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Exported PDFs contain sensitive information. Handle them securely. Judging
                        exports include only candidates cleared for the final round; empty judge cells
                        mean that judge has not submitted scores yet.
                    </p>
                </div>
            </div>
        </div>
    );
}
