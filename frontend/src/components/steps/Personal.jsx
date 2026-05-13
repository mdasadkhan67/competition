import { useState } from "react";

export default function Personal({ form, handleChange, next, prev }) {
    const [error, setError] = useState("");

    const handleNext = () => {
        const { name, email, phone, dob } = form;

        if (!name || name.trim().length < 2) {
            setError("⚠️ Full name must be at least 2 characters long");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setError("⚠️ Please enter a valid email address");
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phone || !phoneRegex.test(phone)) {
            setError("⚠️ Phone number must be exactly 10 digits");
            return;
        }

        if (!dob) {
            setError("⚠️ Date of Birth is required");
            return;
        }

        const birthDate = new Date(dob);
        const today = new Date();
        if (birthDate > today) {
            setError("⚠️ Date of Birth cannot be in the future");
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
                    Personal Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Enter your basic details carefully
                </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

                {/* Name */}
                <div>
                    <label className="label">Full Name</label>
                    <div className="inputBox">
                        <span>👤</span>
                        <input
                            name="name"
                            value={form.name || ""}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="label">Email Address</label>
                    <div className="inputBox">
                        <span>📧</span>
                        <input
                            name="email"
                            value={form.email || ""}
                            onChange={handleChange}
                            placeholder="example@email.com"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="label">Phone Number</label>
                    <div className="inputBox">
                        <span>📞</span>
                        <input
                            name="phone"
                            value={form.phone || ""}
                            onChange={handleChange}
                            placeholder="9876543210"
                        />
                    </div>
                </div>

                {/* DOB */}
                <div>
                    <label className="label">Date of Birth</label>
                    <div className="inputBox">
                        <span>📅</span>
                        <input
                            name="dob"
                            type="date"
                            value={form.dob || ""}
                            onChange={handleChange}
                        />
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