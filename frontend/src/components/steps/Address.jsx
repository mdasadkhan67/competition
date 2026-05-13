import { useState } from "react";

export default function Address({ form, handleChange, next, prev }) {
    const [error, setError] = useState("");

    const handleNext = () => {
        const { address, city, state, zip, aadharNumber } = form;

        if (!address || address.trim().length < 5) {
            setError("⚠️ Please enter a complete address");
            return;
        }

        if (!city || city.trim().length < 2) {
            setError("⚠️ Please enter a valid city");
            return;
        }

        if (!state || state.trim().length < 2) {
            setError("⚠️ Please enter a valid state");
            return;
        }

        const zipRegex = /^[0-9]{6}$/;
        if (!zip || !zipRegex.test(zip)) {
            setError("⚠️ Zip code must be exactly 6 digits");
            return;
        }

        const aadharRegex = /^[0-9]{12}$/;
        if (!aadharNumber || !aadharRegex.test(aadharNumber.replace(/\s/g, ""))) {
            setError("⚠️ Aadhar number must be exactly 12 digits");
            return;
        }

        setError("");
        next();
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg mx-auto">

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Address Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Enter your address and identification details
                </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

                {/* Address */}
                <div>
                    <label className="label">Full Address</label>
                    <div className="inputBox">
                        <span>🏠</span>
                        <input
                            name="address"
                            value={form.address || ""}
                            onChange={handleChange}
                            placeholder="Street, Area, Landmark"
                        />
                    </div>
                </div>

                {/* City */}
                <div>
                    <label className="label">City</label>
                    <div className="inputBox">
                        <span>🏙️</span>
                        <input
                            name="city"
                            value={form.city || ""}
                            onChange={handleChange}
                            placeholder="Enter city"
                        />
                    </div>
                </div>

                {/* State */}
                <div>
                    <label className="label">State</label>
                    <div className="inputBox">
                        <span>📍</span>
                        <input
                            name="state"
                            value={form.state || ""}
                            onChange={handleChange}
                            placeholder="Enter state"
                        />
                    </div>
                </div>

                {/* Zip + Aadhar (side by side only on desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Zip */}
                    <div>
                        <label className="label">Zip Code</label>
                        <div className="inputBox">
                            <span>📮</span>
                            <input
                                name="zip"
                                value={form.zip || ""}
                                onChange={handleChange}
                                placeholder="400001"
                            />
                        </div>
                    </div>

                    {/* Aadhar */}
                    <div>
                        <label className="label">Aadhar Number</label>
                        <div className="inputBox">
                            <span>🆔</span>
                            <input
                                name="aadharNumber"
                                value={form.aadharNumber || ""}
                                onChange={handleChange}
                                placeholder="1234 5678 9012"
                            />
                        </div>
                    </div>

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
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}