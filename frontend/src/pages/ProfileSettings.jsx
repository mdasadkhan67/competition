import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiHome, FiMapPin, FiSmartphone, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function ProfileSettings() {
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", zip: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Verify session
    useEffect(() => {
        const stored = localStorage.getItem("participant");
        if (!stored) {
            navigate("/login");
            return;
        }
        
        const candidateData = JSON.parse(stored);
        setCandidate(candidateData);
        setForm({
            name: candidateData.name || "",
            phone: candidateData.phone || "",
            address: candidateData.address || "",
            city: candidateData.city || "",
            state: candidateData.state || "",
            zip: candidateData.zip || ""
        });
    }, [navigate]);

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError("");

        if (!form.name || form.name.trim().length < 2) {
            setError("⚠️ Full name must be at least 2 characters long.");
            setLoading(false);
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!form.phone || !phoneRegex.test(form.phone)) {
            setError("⚠️ Phone number must be exactly 10 digits.");
            setLoading(false);
            return;
        }

        setTimeout(() => {
            // Update candidate
            const updated = {
                ...candidate,
                name: form.name,
                phone: form.phone,
                address: form.address,
                city: form.city,
                state: form.state,
                zip: form.zip
            };
            
            setCandidate(updated);
            localStorage.setItem("participant", JSON.stringify(updated));
            setLoading(false);
            setSuccess(true);

            // Clear success after 3s
            setTimeout(() => setSuccess(false), 3000);
        }, 1200);
    };

    if (!candidate) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl mx-auto space-y-6">
                
                {/* Back Link */}
                <Link to="/participant/dashboard" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-primary hover:text-emerald-700 transition-colors">
                    <FiArrowLeft /> Back to Dashboard
                </Link>

                <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary"></div>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-brand-dark font-display">Profile Settings</h2>
                            <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage your candidate profile information</p>
                        </div>

                        {success && (
                            <div className="bg-emerald-50/50 border border-emerald-200/50 text-brand-primary p-3.5 rounded-2xl text-xs font-semibold text-center flex items-center justify-center gap-2 animate-fade">
                                <FiCheckCircle /> Profile details updated successfully!
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50/50 border border-red-200/50 text-red-500 p-3.5 rounded-2xl text-xs font-semibold text-center">
                                {error}
                            </div>
                        )}

                        {/* Name and Mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Full Name</label>
                                <div className="inputBox">
                                    <span>👤</span>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Phone Number</label>
                                <div className="inputBox">
                                    <span>📞</span>
                                    <input
                                        type="text"
                                        required
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="label">Full Address</label>
                            <div className="inputBox">
                                <span>🏠</span>
                                <input
                                    type="text"
                                    placeholder="Street name, landmark..."
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* City, State, Zip */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="label">City</label>
                                <div className="inputBox">
                                    <span>🏙️</span>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">State</label>
                                <div className="inputBox">
                                    <span>📍</span>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={form.state}
                                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Zip Code</label>
                                <div className="inputBox">
                                    <span>📮</span>
                                    <input
                                        type="text"
                                        placeholder="Zip"
                                        value={form.zip}
                                        onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Immutable group field */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 font-semibold text-xs text-gray-500">
                            <span className="font-bold text-gray-700 block mb-1">Registration Category (Locked)</span>
                            Category ({candidate.group}) is assigned based on date of birth ({candidate.dob}) and cannot be edited.
                        </div>

                        {/* Save Trigger */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-brand-primary hover:bg-emerald-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-brand-primary/20 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Save Profile Updates"
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}
