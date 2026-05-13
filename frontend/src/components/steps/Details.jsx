import { useEffect, useState } from "react";
import { getGroupAvailability } from "../../api/config";

export default function Details({ form, handleChange, next, prev }) {
    const [group, setGroup] = useState("");
    const [error, setError] = useState("");
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);


    // ✅ Calculate age from DOB
    const calculateGroup = (dob) => {
        if (!dob) return "";

        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age <= 12) return "Jr.";
        if (age <= 18) return "Middle";
        return "Sr";
    };

    // ✅ Auto set group when DOB changes
    useEffect(() => {
        const g = calculateGroup(form.dob);
        setGroup(g);

        // also update in main form state
        if (g) {
            handleChange({
                target: { name: "group", value: g }
            });
        }
    }, [form.dob]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await getGroupAvailability();
                if (res.success) {
                    setAvailability(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch availability", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, []);

    const handleNext = () => {
        if (!form.naatTitle || form.naatTitle.trim().length < 3) {
            setError("⚠️ Please enter a valid Naat / Kalam Title (min 3 chars)");
            return;
        }

        if (group) {
            const groupData = availability.find(g => g.group === group);
            if (groupData && groupData.isFull) {
                setError(`Registration for ${group} group is currently full.`);
                return;
            }
        }

        setError("");
        next();
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg mx-auto">

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Performance Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Enter your kalam title and category
                </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

                {/* Kalam Title */}
                <div>
                    <label className="label">Naat / Kalam Title</label>
                    <div className="inputBox">
                        <span>🎤</span>
                        <input
                            name="naatTitle"
                            value={form.naatTitle || ""}
                            onChange={handleChange}
                            placeholder="Enter your kalam title"
                        />
                    </div>
                </div>

                {/* Group (Auto) */}
                <div>
                    <label className="label">Category Group</label>
                    <div className="inputBox bg-gray-100 cursor-not-allowed">
                        <span>🏷️</span>
                        <input
                            value={group || "Auto calculated from DOB"}
                            readOnly
                            className="bg-transparent w-full"
                        />
                    </div>
                    {group && availability.length > 0 && (
                        <div className="mt-2 text-sm font-medium">
                            {(() => {
                                const gData = availability.find(g => g.group === group);
                                if (!gData) return null;
                                return gData.isFull ? (
                                    <span className="text-red-500 font-bold">⚠️ Group is Full ({gData.limit} limit reached). You cannot proceed.</span>
                                ) : (
                                    <span className="text-green-600">✅ Group is available ({gData.limit - gData.count} spots left)</span>
                                );
                            })()}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Group is automatically selected based on your date of birth
                    </p>
                </div>

            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm mt-4 text-center">
                    {error}
                </p>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prev}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                    ← Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow disabled:opacity-50"
                >
                    {loading ? "Checking..." : "Next →"}
                </button>
            </div>
        </div>
    );
}