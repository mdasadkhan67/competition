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
        <div className="w-full font-sans">

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-display">
                    Performance Details
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">
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
                    <div className="inputBox bg-gray-50 border-gray-100 cursor-not-allowed select-none">
                        <span className="opacity-60">🏷️</span>
                        <input
                            value={group || "Auto calculated from DOB"}
                            readOnly
                            className="bg-transparent w-full text-gray-500 font-bold"
                        />
                    </div>
                    {group && availability.length > 0 && (
                        <div className="mt-2 text-xs font-semibold">
                            {(() => {
                                const gData = availability.find(g => g.group === group);
                                if (!gData) return null;
                                return gData.isFull ? (
                                    <span className="text-red-500 font-bold flex items-center gap-1">⚠️ Registration is full for {group} ({gData.limit} limit reached). You cannot proceed.</span>
                                ) : (
                                    <span className="text-brand-primary flex items-center gap-1">✅ Group {group} is available ({gData.limit - gData.count} spots left)</span>
                                );
                            })()}
                        </div>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1.5 font-medium leading-normal">
                        Group is automatically selected based on your date of birth
                    </p>
                </div>

            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm mt-4 text-center font-semibold">
                    {error}
                </p>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-10">
                <button
                    onClick={prev}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-all"
                >
                    ← Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-emerald-600 font-bold transition-all shadow-md shadow-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Checking..." : "Next →"}
                </button>
            </div>
        </div>
    );
}