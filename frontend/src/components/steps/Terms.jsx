import { useState, useRef } from "react";

export default function Terms({ next }) {
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState("");
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    const scrollRef = useRef();

    const handleScroll = () => {
        const el = scrollRef.current;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
            setScrolledToBottom(true);
        }
    };

    const handleNext = () => {
        if (!accepted) {
            setError("⚠️ Please accept Terms & Conditions to continue");
            return;
        }

        next();
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

            {/* ================= Banner Section ================= */}
            <div className="relative">

                {/* Banner Image */}
                <img
                    src="/banner.jpeg"
                    alt="Sunni Dawate Islami Annual Naat Competition 2026"
                    className="w-full h-64 md:h-80 object-cover"
                />

            </div>

            {/* ================= Terms Content ================= */}
            <div className="p-6 flex flex-col">

                {/* Header */}
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
                    Terms & Conditions
                </h2>

                <p className="text-center text-gray-500 text-sm mb-5">
                    Please read all terms carefully before continuing
                </p>

                {/* Scroll Box */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="border rounded-xl p-5 h-72 overflow-y-auto bg-gray-50 shadow-inner space-y-5 text-sm text-gray-700 leading-relaxed"
                >

                    {[...Array(10)].map((_, i) => (
                        <div key={i}>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                {i + 1}. Section Title
                            </h3>

                            <p>
                                This is a detailed paragraph explaining the terms and conditions.
                                You must carefully read and understand all clauses mentioned here.
                                Any violation of the rules may result in disqualification or rejection.
                            </p>
                        </div>
                    ))}

                </div>

                {/* Scroll Hint */}
                {!scrolledToBottom && (
                    <p className="text-xs text-gray-500 mt-2 text-center animate-pulse">
                        ⬇️ Please scroll to bottom to enable acceptance
                    </p>
                )}

                {/* Checkbox */}
                <div className="mt-5 flex items-center gap-3">
                    <input
                        type="checkbox"
                        disabled={!scrolledToBottom}
                        checked={accepted}
                        onChange={() => {
                            setAccepted(!accepted);
                            setError("");
                        }}
                        className="w-4 h-4 accent-blue-600"
                    />

                    <label
                        className={`text-sm font-medium transition ${!scrolledToBottom
                            ? "text-gray-400"
                            : "text-gray-700"
                            }`}
                    >
                        I have read and agree to the Terms & Conditions
                    </label>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm mt-3 text-center font-medium">
                        {error}
                    </p>
                )}

                {/* Continue Button */}
                <button
                    onClick={handleNext}
                    className={`mt-6 w-full py-3 rounded-xl text-white font-semibold text-lg shadow-lg transition duration-300
                    ${accepted
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    Accept & Continue
                </button>

            </div>
        </div>
    );
}