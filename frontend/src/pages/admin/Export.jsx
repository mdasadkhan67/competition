import { useState } from "react";
import API from "../../api/admin";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiFileText, FiUsers } from "react-icons/fi";

export default function Export() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const handleExport = async (group) => {
        try {
            setLoading(true);
            setError("");

            const url = group === "All" ? "/admin/registrations" : `/admin/registrations?group=${group}`;
            const res = await API.get(url);

            if (!res.data.success) {
                throw new Error(res.data.message || "Failed to fetch data");
            }

            const registrations = res.data.data;

            if (registrations.length === 0) {
                alert(`No registrations found for ${group} group.`);
                return;
            }

            // ✅ Generate PDF
            const doc = new jsPDF();

            // Header
            doc.setFontSize(18);
            doc.text("Competition Registrations 2026", 14, 15);
            doc.setFontSize(12);
            doc.text(`Group: ${group}`, 14, 22);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 29);

            // Table Data
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

            doc.save(`Registrations_${group}_${new Date().getTime()}.pdf`);

        } catch (err) {
            console.error("Export Error:", err);
            setError(err.response?.data?.message || err.message || "Failed to export data. Please check connection.");
        } finally {
            setLoading(false);
        }
    };

    const groups = [
        { name: "All", color: "bg-gray-800", icon: <FiUsers /> },
        { name: "Jr.", color: "bg-blue-600", icon: <FiFileText /> },
        { name: "Middle", color: "bg-purple-600", icon: <FiFileText /> },
        { name: "Sr", color: "bg-orange-600", icon: <FiFileText /> },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Export Data</h1>
                <p className="text-gray-500 mt-2">Download registration details in PDF format filtered by category.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {groups.map((group) => (
                    <div
                        key={group.name}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 ${group.color} text-white rounded-xl flex items-center justify-center text-xl mb-4`}>
                            {group.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{group.name} Group</h3>
                        <p className="text-sm text-gray-500 mb-6 text-center">Export all users in the {group.name} category.</p>

                        <button
                            onClick={() => handleExport(group.name)}
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${group.color} hover:brightness-110 shadow-lg shadow-gray-100`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <FiDownload />
                            )}
                            Export PDF
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-100 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-200">
                    📋
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Important Notice</h2>
                    <p className="text-gray-600 leading-relaxed">
                        The exported PDF will contain sensitive user information including phone numbers and payment statuses.
                        Please ensure you handle these documents securely and according to privacy policies.
                    </p>
                </div>
            </div>
        </div>
    );
}
